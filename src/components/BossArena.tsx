import React, { useState, useEffect, useRef, useCallback } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  Swords, Shield, Zap, Sparkles, Trophy, RotateCcw, Play, Pause, FastForward,
  ChevronRight, ArrowRight, Flame, Heart, AlertTriangle, CheckCircle2, Lock
} from 'lucide-react';
import { RNGItem, InventorySlot, BossLevel } from '../types/rng';
import { BOSS_LEVELS, getAuraCombatStats, getAuraAbility } from '../data/bosses';
import { RARITY_CONFIGS, formatChance } from '../data/items';
import { sound } from '../utils/audio';
import { CombatArena2D } from './CombatArena2D';

interface FloatingNumber {
  id: number;
  text: string;
  x: number;
  y: number;
  color: string;
  isCrit?: boolean;
}

interface Projectile {
  id: number;
  from: 'player' | 'boss';
  color: string;
  icon: string;
  startX: number;
  targetX: number;
  duration: number;
  isAbility?: boolean;
}

interface CombatLogItem {
  id: number;
  text: string;
  type: 'player' | 'boss' | 'player_ult' | 'boss_ult' | 'info';
  timestamp: string;
}

interface BossArenaProps {
  equippedAura: RNGItem;
  inventory: Record<string, InventorySlot>;
  onEquipAura: (item: RNGItem) => void;
  shards: number;
  onAddShards: (amount: number) => void;
}

export const BossArena: React.FC<BossArenaProps> = ({
  equippedAura,
  inventory,
  onEquipAura,
  shards,
  onAddShards,
}) => {
  // Unlocked boss level (1 to 10, persisted in localStorage)
  const [unlockedLevel, setUnlockedLevel] = useState<number>(() => {
    try {
      const saved = localStorage.getItem('coolers_boss_unlocked_level');
      return saved ? Math.max(1, Math.min(BOSS_LEVELS.length, parseInt(saved, 10))) : 1;
    } catch {
      return 1;
    }
  });

  const [selectedLevelIndex, setSelectedLevelIndex] = useState<number>(0);
  const currentBoss: BossLevel = BOSS_LEVELS[selectedLevelIndex] || BOSS_LEVELS[0];

  // Battle Speed: 1x, 2x, 4x
  const [battleSpeed, setBattleSpeed] = useState<number>(1);
  const [isPaused, setIsPaused] = useState<boolean>(false);
  const [autoProgress, setAutoProgress] = useState<boolean>(true);
  const [showAuraDrawer, setShowAuraDrawer] = useState<boolean>(false);
  const [arenaMode, setArenaMode] = useState<'2d' | 'cosmic'>('2d');

  // Player Stats & State
  const playerStats = getAuraCombatStats(equippedAura);
  const playerAbility = getAuraAbility(equippedAura);

  const [playerHp, setPlayerHp] = useState<number>(playerStats.health);
  const [playerMaxHp, setPlayerMaxHp] = useState<number>(playerStats.health);
  const [playerShield, setPlayerShield] = useState<number>(0);
  const [playerEnergy, setPlayerEnergy] = useState<number>(0); // 0 to 100
  const [playerStunTimer, setPlayerStunTimer] = useState<number>(0);
  const [playerBurnTimer, setPlayerBurnTimer] = useState<number>(0);

  // Boss Stats & State
  const [bossHp, setBossHp] = useState<number>(currentBoss.maxHealth);
  const [bossMaxHp, setBossMaxHp] = useState<number>(currentBoss.maxHealth);
  const [bossShield, setBossShield] = useState<number>(0);
  const [bossEnergy, setBossEnergy] = useState<number>(0); // 0 to 100
  const [bossStunTimer, setBossStunTimer] = useState<number>(0);
  const [bossBurnTimer, setBossBurnTimer] = useState<number>(0);

  // Visual FX State
  const [floatingNumbers, setFloatingNumbers] = useState<FloatingNumber[]>([]);
  const [projectiles, setProjectiles] = useState<Projectile[]>([]);
  const [activeBanner, setActiveBanner] = useState<{ title: string; subtitle: string; color: string } | null>(null);
  const [screenShake, setScreenShake] = useState<boolean>(false);
  const [combatLog, setCombatLog] = useState<CombatLogItem[]>([]);

  // Battle Outcome
  const [battleState, setBattleState] = useState<'fighting' | 'victory' | 'defeat'>('fighting');
  const [rewardsClaimed, setRewardsClaimed] = useState<boolean>(false);

  // References for combat loops
  const lastPlayerAttackRef = useRef<number>(Date.now());
  const lastBossAttackRef = useRef<number>(Date.now());
  const nextNumberIdRef = useRef<number>(1);
  const nextProjIdRef = useRef<number>(1);
  const nextLogIdRef = useRef<number>(1);

  // Helper to add combat log
  const addLog = useCallback((text: string, type: 'player' | 'boss' | 'player_ult' | 'boss_ult' | 'info') => {
    const time = new Date().toLocaleTimeString([], { hour12: false, minute: '2-digit', second: '2-digit' });
    setCombatLog((prev) => [{ id: nextLogIdRef.current++, text, type, timestamp: time }, ...prev.slice(0, 39)]);
  }, []);

  // Helper to add floating number
  const spawnNumber = useCallback((text: string, x: number, y: number, color: string, isCrit = false) => {
    const id = nextNumberIdRef.current++;
    setFloatingNumbers((prev) => [...prev, { id, text, x, y, color, isCrit }]);
    setTimeout(() => {
      setFloatingNumbers((prev) => prev.filter((n) => n.id !== id));
    }, 1200);
  }, []);

  // Helper to spawn projectile
  const spawnProjectile = useCallback((from: 'player' | 'boss', color: string, icon: string, isAbility = false) => {
    const id = nextProjIdRef.current++;
    const startX = from === 'player' ? 25 : 75;
    const targetX = from === 'player' ? 75 : 25;
    const duration = (isAbility ? 0.6 : 0.45) / battleSpeed;

    setProjectiles((prev) => [...prev, { id, from, color, icon, startX, targetX, duration, isAbility }]);
    setTimeout(() => {
      setProjectiles((prev) => prev.filter((p) => p.id !== id));
    }, duration * 1000 + 100);
  }, [battleSpeed]);

  // Trigger brief screen shake
  const triggerShake = useCallback(() => {
    setScreenShake(true);
    setTimeout(() => setScreenShake(false), 350);
  }, []);

  // Reset / Initialize Battle
  const initBattle = useCallback((levelIdx = selectedLevelIndex) => {
    const boss = BOSS_LEVELS[levelIdx];
    const pStats = getAuraCombatStats(equippedAura);

    setPlayerHp(pStats.health);
    setPlayerMaxHp(pStats.health);
    setPlayerShield(0);
    setPlayerEnergy(0);
    setPlayerStunTimer(0);
    setPlayerBurnTimer(0);

    setBossHp(boss.maxHealth);
    setBossMaxHp(boss.maxHealth);
    setBossShield(0);
    setBossEnergy(0);
    setBossStunTimer(0);
    setBossBurnTimer(0);

    setFloatingNumbers([]);
    setProjectiles([]);
    setActiveBanner(null);
    setBattleState('fighting');
    setRewardsClaimed(false);

    lastPlayerAttackRef.current = Date.now();
    lastBossAttackRef.current = Date.now();

    addLog(`⚔️ Battle started against Level ${boss.level}: ${boss.name}!`, 'info');
  }, [equippedAura, selectedLevelIndex, addLog]);

  // When equipped aura or selected level changes, re-init battle
  useEffect(() => {
    initBattle(selectedLevelIndex);
  }, [equippedAura.id, selectedLevelIndex]); // eslint-disable-line react-hooks/exhaustive-deps

  // Handle Player Ultimate Ability
  const triggerPlayerAbility = useCallback(() => {
    sound.playAbility();
    setPlayerEnergy(0);

    const isNapoleon = equippedAura.id === 'napoleon';
    const mult = playerAbility.multiplier;
    const isCrit = Math.random() < playerStats.critChance * 1.5;
    const rawDmg = Math.round(playerStats.attack * mult * (isCrit ? 1.8 : 1.0));
    const effectiveDmg = Math.max(10, rawDmg - currentBoss.defense);

    // Banner announcement
    setActiveBanner({
      title: `${equippedAura.name}: ${playerAbility.name}!`,
      subtitle: playerAbility.description,
      color: RARITY_CONFIGS[equippedAura.rarity].color,
    });
    setTimeout(() => setActiveBanner(null), 2400 / battleSpeed);

    // Visuals & Projectiles
    spawnProjectile('player', RARITY_CONFIGS[equippedAura.rarity].color, playerAbility.icon, true);
    triggerShake();

    if (isNapoleon) {
      sound.playAmourPlastique();
    }

    setTimeout(() => {
      // Apply Damage to Boss
      setBossHp((prev) => {
        const next = Math.max(0, prev - effectiveDmg);
        if (next === 0 && battleState === 'fighting') {
          handleVictory();
        }
        return next;
      });

      spawnNumber(`-${effectiveDmg.toLocaleString()} ${isCrit ? 'CRIT!' : ''}`, 75, 40, '#F59E0B', isCrit);

      // Handle custom effects
      if (playerAbility.effectType === 'artillery') {
        // Napoleon: 3.5s Stun + 600 HP shield
        setBossStunTimer(playerAbility.effectValue);
        setPlayerShield((s) => s + 600);
        addLog(`👑 ${equippedAura.name} used "${playerAbility.name}" for ${effectiveDmg} CRIT damage! Boss is STUNNED for 3.5s!`, 'player_ult');
      } else if (playerAbility.effectType === 'stun') {
        setBossStunTimer(playerAbility.effectValue);
        addLog(`⚡ ${equippedAura.name} used "${playerAbility.name}" for ${effectiveDmg} damage! Boss stunned!`, 'player_ult');
      } else if (playerAbility.effectType === 'heal') {
        setPlayerHp((hp) => Math.min(playerMaxHp, hp + playerAbility.effectValue));
        spawnNumber(`+${playerAbility.effectValue}`, 25, 30, '#10B981');
        addLog(`💚 ${equippedAura.name} used "${playerAbility.name}", dealing ${effectiveDmg} and healing +${playerAbility.effectValue} HP!`, 'player_ult');
      } else if (playerAbility.effectType === 'shield') {
        setPlayerShield((s) => s + playerAbility.effectValue);
        spawnNumber(`🛡️ +${playerAbility.effectValue}`, 25, 30, '#06B6D4');
        addLog(`🛡️ ${equippedAura.name} used "${playerAbility.name}", dealing ${effectiveDmg} and gaining ${playerAbility.effectValue} Shield!`, 'player_ult');
      } else if (playerAbility.effectType === 'time_freeze') {
        setBossStunTimer(playerAbility.effectValue);
        addLog(`⏳ ${equippedAura.name} froze time for ${playerAbility.effectValue}s and delivered ${effectiveDmg} damage!`, 'player_ult');
      } else {
        addLog(`✨ ${equippedAura.name} unleashed "${playerAbility.name}" for ${effectiveDmg} damage!`, 'player_ult');
      }
    }, 450 / battleSpeed);
  }, [equippedAura, playerAbility, playerStats, currentBoss, battleState, battleSpeed, spawnProjectile, spawnNumber, triggerShake, addLog]);

  // Handle Boss Ultimate Ability
  const triggerBossAbility = useCallback(() => {
    sound.playBossUltimate();
    setBossEnergy(0);

    const bAbility = currentBoss.ability;
    const rawDmg = bAbility.damage;
    const effectiveDmg = Math.max(10, rawDmg - playerStats.defense);

    // Banner announcement
    setActiveBanner({
      title: `⚠️ BOSS ULTIMATE: ${bAbility.name}!`,
      subtitle: bAbility.description,
      color: currentBoss.themeColor,
    });
    setTimeout(() => setActiveBanner(null), 2400 / battleSpeed);

    spawnProjectile('boss', currentBoss.themeColor, bAbility.icon, true);
    triggerShake();

    setTimeout(() => {
      // Apply Damage to Player (Check Shield first)
      setPlayerShield((curShield) => {
        let remainingDmg = effectiveDmg;
        let newShield = curShield;

        if (curShield > 0) {
          if (curShield >= remainingDmg) {
            newShield = curShield - remainingDmg;
            remainingDmg = 0;
            spawnNumber(`Absorbed ${effectiveDmg}`, 25, 45, '#38BDF8');
          } else {
            remainingDmg -= curShield;
            newShield = 0;
            spawnNumber(`Shield Broke!`, 25, 45, '#38BDF8');
          }
        }

        if (remainingDmg > 0) {
          setPlayerHp((prevHp) => {
            const nextHp = Math.max(0, prevHp - remainingDmg);
            if (nextHp === 0 && battleState === 'fighting') {
              handleDefeat();
            }
            return nextHp;
          });
          spawnNumber(`-${remainingDmg}`, 25, 40, '#EF4444', true);
        }

        return newShield;
      });

      // Special Boss Effects
      if (bAbility.effectType === 'slam') {
        setPlayerStunTimer(bAbility.effectDurationSec);
        addLog(`💥 ${currentBoss.name} used "${bAbility.name}" dealing ${effectiveDmg} damage and STUNNED player!`, 'boss_ult');
      } else if (bAbility.effectType === 'burn') {
        setPlayerBurnTimer(bAbility.effectDurationSec);
        addLog(`🔥 ${currentBoss.name} unleashed "${bAbility.name}", inflicting burn!`, 'boss_ult');
      } else if (bAbility.effectType === 'siphon') {
        setBossHp((hp) => Math.min(bossMaxHp, hp + 1200));
        spawnNumber(`+1,200`, 75, 30, '#10B981');
        addLog(`🌌 ${currentBoss.name} siphoned vitality, dealing ${effectiveDmg} and healing +1,200 HP!`, 'boss_ult');
      } else if (bAbility.effectType === 'time_freeze') {
        setPlayerStunTimer(bAbility.effectDurationSec);
        addLog(`⌛ ${currentBoss.name} reversed time and froze player for ${bAbility.effectDurationSec}s!`, 'boss_ult');
      } else {
        addLog(`🔱 ${currentBoss.name} executed "${bAbility.name}" for ${effectiveDmg} catastrophe damage!`, 'boss_ult');
      }
    }, 450 / battleSpeed);
  }, [currentBoss, playerStats, bossMaxHp, battleState, battleSpeed, spawnProjectile, spawnNumber, triggerShake, addLog]);

  // Handle Victory
  const handleVictory = () => {
    sound.playVictory();
    setBattleState('victory');
    addLog(`🏆 VICTORY! Level ${currentBoss.level} ${currentBoss.name} has been defeated!`, 'info');

    // Unlock next level if applicable (Up to Level 10)
    if (currentBoss.level < BOSS_LEVELS.length && unlockedLevel <= currentBoss.level) {
      const nextLevel = currentBoss.level + 1;
      setUnlockedLevel(nextLevel);
      try {
        localStorage.setItem('coolers_boss_unlocked_level', nextLevel.toString());
      } catch {}
      addLog(`🔓 LEVEL ${nextLevel} UNLOCKED in the Boss Arena!`, 'info');
    }
  };

  // Handle Defeat
  const handleDefeat = () => {
    sound.playDefeat();
    setBattleState('defeat');
    addLog(`💀 DEFEATED by Level ${currentBoss.level} ${currentBoss.name}. Upgrade your auras and try again!`, 'info');
  };

  // Auto-Combat Main Loop (Runs every 100ms)
  useEffect(() => {
    if (battleState !== 'fighting' || isPaused) return;

    const interval = setInterval(() => {
      const now = Date.now();
      const dtSec = (0.1 * battleSpeed);

      // Decrement stun and burn timers
      setPlayerStunTimer((t) => Math.max(0, t - dtSec));
      setBossStunTimer((t) => Math.max(0, t - dtSec));

      // Burn ticks
      setPlayerBurnTimer((t) => {
        if (t > 0) {
          const burnDmg = 25;
          setPlayerHp((hp) => {
            const next = Math.max(0, hp - burnDmg);
            if (next === 0) handleDefeat();
            return next;
          });
          spawnNumber(`-${burnDmg} Burn`, 25, 45, '#F97316');
        }
        return Math.max(0, t - dtSec);
      });

      // 1. Player Auto Attack
      const playerAttackInterval = (1000 / playerStats.attackSpeed) / battleSpeed;
      if (playerStunTimer <= 0 && now - lastPlayerAttackRef.current >= playerAttackInterval) {
        lastPlayerAttackRef.current = now;
        sound.playHit();

        const isCrit = Math.random() < playerStats.critChance;
        const rawDmg = Math.round(playerStats.attack * (isCrit ? 1.5 : 1.0) * (0.9 + Math.random() * 0.2));
        const effectiveDmg = Math.max(5, rawDmg - currentBoss.defense);

        spawnProjectile('player', RARITY_CONFIGS[equippedAura.rarity].color, equippedAura.emoji);

        // Apply damage after brief projectile flight
        setTimeout(() => {
          setBossHp((prev) => {
            const next = Math.max(0, prev - effectiveDmg);
            if (next === 0 && battleState === 'fighting') {
              handleVictory();
            }
            return next;
          });

          spawnNumber(`-${effectiveDmg}`, 75, 45, isCrit ? '#FACC15' : '#FFFFFF', isCrit);

          // Build Player Energy
          setPlayerEnergy((e) => {
            const next = Math.min(100, e + (isCrit ? 22 : 14));
            if (next >= 100) {
              triggerPlayerAbility();
              return 0;
            }
            return next;
          });
        }, 220 / battleSpeed);
      }

      // 2. Boss Auto Attack
      const bossAttackInterval = (1000 / currentBoss.attackSpeed) / battleSpeed;
      if (bossStunTimer <= 0 && now - lastBossAttackRef.current >= bossAttackInterval) {
        lastBossAttackRef.current = now;
        sound.playHit();

        const rawDmg = Math.round(currentBoss.attack * (0.9 + Math.random() * 0.2));
        const effectiveDmg = Math.max(5, rawDmg - playerStats.defense);

        spawnProjectile('boss', currentBoss.themeColor, currentBoss.emoji);

        // Apply damage to player
        setTimeout(() => {
          setPlayerShield((curShield) => {
            let rem = effectiveDmg;
            let nShield = curShield;
            if (curShield > 0) {
              if (curShield >= rem) {
                nShield = curShield - rem;
                rem = 0;
                spawnNumber(`Absorbed ${effectiveDmg}`, 25, 45, '#38BDF8');
              } else {
                rem -= curShield;
                nShield = 0;
              }
            }
            if (rem > 0) {
              setPlayerHp((prev) => {
                const next = Math.max(0, prev - rem);
                if (next === 0 && battleState === 'fighting') {
                  handleDefeat();
                }
                return next;
              });
              spawnNumber(`-${rem}`, 25, 45, '#EF4444');
            }
            return nShield;
          });

          // Build Boss Energy
          setBossEnergy((e) => {
            const next = Math.min(100, e + 12);
            if (next >= 100) {
              triggerBossAbility();
              return 0;
            }
            return next;
          });
        }, 220 / battleSpeed);
      }
    }, 100);

    return () => clearInterval(interval);
  }, [
    battleState, isPaused, battleSpeed, playerStunTimer, bossStunTimer, playerStats,
    currentBoss, equippedAura, triggerPlayerAbility, triggerBossAbility, spawnProjectile,
    spawnNumber
  ]);

  // Auto-progress on victory if enabled
  useEffect(() => {
    if (battleState === 'victory' && autoProgress && currentBoss.level < 5) {
      const timer = setTimeout(() => {
        setSelectedLevelIndex((prev) => Math.min(4, prev + 1));
      }, 2500);
      return () => clearTimeout(timer);
    }
  }, [battleState, autoProgress, currentBoss.level]);

  // Claim Rewards
  const handleClaimRewards = () => {
    if (rewardsClaimed) return;
    setRewardsClaimed(true);
    sound.playCoin();
    onAddShards(currentBoss.shardReward);
    addLog(`🎁 Claimed ${currentBoss.shardReward} Shards from Level ${currentBoss.level}!`, 'info');
  };

  const auraRarityConfig = RARITY_CONFIGS[equippedAura.rarity];
  const playerHpPct = Math.max(0, Math.min(100, (playerHp / playerMaxHp) * 100));
  const bossHpPct = Math.max(0, Math.min(100, (bossHp / bossMaxHp) * 100));

  if (arenaMode === '2d') {
    return (
      <div className="w-full flex flex-col gap-2 select-none">
        {/* Mode Switch Header */}
        <div className="max-w-7xl mx-auto w-full px-3 sm:px-6 pt-3 flex flex-wrap items-center justify-between gap-2">
          <div className="flex items-center gap-2 text-xs font-mono">
            <span className="text-slate-400">ARENA STYLE:</span>
            <div className="flex items-center bg-slate-900 border border-slate-800 rounded-xl p-1">
              <button
                onClick={() => setArenaMode('2d')}
                className="py-1 px-3 rounded-lg font-bold bg-emerald-500 text-slate-950 shadow cursor-pointer"
              >
                ⚔️ 2D Combat Arena (LMB M1)
              </button>
              <button
                onClick={() => setArenaMode('cosmic')}
                className="py-1 px-3 rounded-lg text-slate-400 hover:text-white cursor-pointer transition-colors"
              >
                🌌 Tactical Stage
              </button>
            </div>
          </div>

          <span className="text-[11px] font-mono text-amber-300">
            Click LMB anywhere to attack · A/D to walk · Space to jump · Auto-M1 enabled!
          </span>
        </div>

        <CombatArena2D
          equippedAura={equippedAura}
          inventory={inventory}
          onEquipAura={onEquipAura}
          shards={shards}
          onAddShards={onAddShards}
        />
      </div>
    );
  }

  return (
    <div className="w-full max-w-7xl mx-auto px-3 sm:px-6 py-4 flex flex-col gap-4 select-none">
      {/* Top Level Selector Tabs */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 pb-3 border-b border-slate-800">
        <div className="flex flex-col gap-1">
          <div className="flex items-center gap-2">
            <Swords className="w-5 h-5 text-red-400" />
            <h1 className="text-xl font-bold tracking-tight text-white">AI Boss Arena</h1>
            <span className="text-[11px] font-mono px-2 py-0.5 rounded-full bg-red-950 text-red-300 border border-red-800">
              Auto-Battler
            </span>
            <button
              onClick={() => setArenaMode('2d')}
              className="text-xs font-mono text-emerald-400 underline ml-2 cursor-pointer hover:text-emerald-300"
            >
              Switch to 2D Combat Mode ⚔️
            </button>
          </div>
          <p className="text-xs text-slate-400 mt-0.5">
            Equip your best auras and fight through all 10 colossal AI boss levels!
          </p>
        </div>

        {/* Level Selector Buttons (1 to 10) */}
        <div className="flex items-center gap-1.5 overflow-x-auto max-w-full pb-1">
          {BOSS_LEVELS.map((boss, idx) => {
            const isUnlocked = boss.level <= unlockedLevel;
            const isSelected = idx === selectedLevelIndex;

            return (
              <button
                key={boss.id}
                onClick={() => {
                  if (isUnlocked) {
                    setSelectedLevelIndex(idx);
                  }
                }}
                disabled={!isUnlocked}
                className={`py-1.5 px-3 rounded-xl text-xs font-mono font-bold flex items-center gap-1.5 transition-all cursor-pointer ${
                  isSelected
                    ? 'bg-red-600 text-white shadow-lg ring-2 ring-red-400/50'
                    : isUnlocked
                    ? 'bg-slate-900 hover:bg-slate-800 text-slate-300 border border-slate-800'
                    : 'bg-slate-950 text-slate-600 border border-slate-900 cursor-not-allowed'
                }`}
              >
                <span>{boss.emoji}</span>
                <span>L{boss.level}</span>
                {!isUnlocked && <Lock className="w-3 h-3 text-slate-600" />}
                {boss.level < unlockedLevel && <CheckCircle2 className="w-3 h-3 text-emerald-400" />}
              </button>
            );
          })}
        </div>
      </div>

      {/* Main 2D Battle Stage */}
      <div
        className={`relative w-full h-[400px] sm:h-[460px] rounded-3xl border border-slate-800 overflow-hidden flex flex-col justify-between p-4 sm:p-6 transition-all ${
          screenShake ? 'translate-x-1 -translate-y-1' : ''
        }`}
        style={{
          background: `radial-gradient(circle at 50% 30%, rgba(20, 20, 35, 0.95), rgba(5, 5, 10, 0.98))`,
        }}
      >
        {/* Ambient Thematic Backdrop Glow */}
        <div
          className="absolute inset-0 pointer-events-none opacity-20 blur-3xl"
          style={{ backgroundColor: currentBoss.themeColor }}
        />

        {/* Top Battle HUD (Boss & Player Stats Header) */}
        <div className="relative z-10 grid grid-cols-2 gap-4">
          {/* Player Aura Info & Health Bar */}
          <div className="flex flex-col gap-1.5 bg-slate-950/70 p-3 rounded-2xl border border-slate-800/80 backdrop-blur-sm">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <span className="text-base select-none">{equippedAura.emoji}</span>
                <span className="text-xs sm:text-sm font-bold text-white truncate max-w-[120px] sm:max-w-[180px]">
                  {equippedAura.name}
                </span>
                <span
                  className="text-[10px] font-mono px-1.5 py-0.2 rounded"
                  style={{ backgroundColor: auraRarityConfig.bgColor, color: auraRarityConfig.color }}
                >
                  {equippedAura.rarity}
                </span>
              </div>
              <span className="text-xs font-mono tabular-nums font-bold text-slate-300">
                {playerHp.toLocaleString()} / {playerMaxHp.toLocaleString()} HP
              </span>
            </div>

            {/* HP Bar */}
            <div className="relative w-full h-3.5 rounded-full bg-slate-900 border border-slate-800 overflow-hidden">
              <motion.div
                className="h-full bg-gradient-to-r from-emerald-500 to-emerald-400"
                style={{ width: `${playerHpPct}%` }}
                transition={{ duration: 0.2 }}
              />
              {playerShield > 0 && (
                <div
                  className="absolute top-0 right-0 h-full bg-cyan-400/80"
                  style={{ width: `${Math.min(100, (playerShield / playerMaxHp) * 100)}%` }}
                />
              )}
            </div>

            {/* Energy / Ultimate Bar */}
            <div className="flex items-center justify-between text-[10px] font-mono text-slate-400">
              <span className="flex items-center gap-1 text-cyan-300">
                <Zap className="w-3 h-3 text-cyan-400" />
                <span>Ability: {playerAbility.name}</span>
              </span>
              <span>{Math.round(playerEnergy)}%</span>
            </div>
            <div className="w-full h-1.5 rounded-full bg-slate-900 overflow-hidden border border-slate-800">
              <div
                className="h-full bg-gradient-to-r from-cyan-500 to-indigo-500 transition-all duration-150"
                style={{ width: `${playerEnergy}%` }}
              />
            </div>
          </div>

          {/* Boss Info & Health Bar */}
          <div className="flex flex-col gap-1.5 bg-slate-950/70 p-3 rounded-2xl border border-slate-800/80 backdrop-blur-sm">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <span className="text-base select-none">{currentBoss.emoji}</span>
                <span className="text-xs sm:text-sm font-bold text-white truncate max-w-[120px] sm:max-w-[180px]">
                  {currentBoss.name}
                </span>
                <span className="text-[10px] font-mono px-1.5 py-0.2 rounded bg-red-950 text-red-300 border border-red-800">
                  LVL {currentBoss.level}
                </span>
              </div>
              <span className="text-xs font-mono tabular-nums font-bold text-red-300">
                {bossHp.toLocaleString()} / {bossMaxHp.toLocaleString()} HP
              </span>
            </div>

            {/* Boss HP Bar */}
            <div className="relative w-full h-3.5 rounded-full bg-slate-900 border border-slate-800 overflow-hidden">
              <motion.div
                className="h-full bg-gradient-to-r from-red-600 to-rose-500"
                style={{ width: `${bossHpPct}%` }}
                transition={{ duration: 0.2 }}
              />
            </div>

            {/* Boss Ultimate Charge Bar */}
            <div className="flex items-center justify-between text-[10px] font-mono text-slate-400">
              <span className="flex items-center gap-1 text-red-400">
                <Flame className="w-3 h-3 text-red-500" />
                <span>Ultimate: {currentBoss.ability.name}</span>
              </span>
              <span>{Math.round(bossEnergy)}%</span>
            </div>
            <div className="w-full h-1.5 rounded-full bg-slate-900 overflow-hidden border border-slate-800">
              <div
                className="h-full bg-gradient-to-r from-amber-500 to-red-500 transition-all duration-150"
                style={{ width: `${bossEnergy}%` }}
              />
            </div>
          </div>
        </div>

        {/* Center Arena Battle Stage (Fighters, Projectiles, FX) */}
        <div className="relative flex-1 flex items-center justify-between px-6 sm:px-16 my-2">
          {/* PLAYER FIGHTER (Left) */}
          <div className="relative flex flex-col items-center">
            {/* Status Indicator */}
            {playerStunTimer > 0 && (
              <span className="absolute -top-7 text-xs font-bold text-amber-400 font-mono animate-bounce">
                💥 STUNNED!
              </span>
            )}
            {playerShield > 0 && (
              <span className="absolute -top-7 text-xs font-bold text-cyan-400 font-mono">
                🛡️ SHIELD ({playerShield})
              </span>
            )}

            {/* Fighter Sprite Box */}
            <motion.div
              animate={{
                y: playerStunTimer > 0 ? 0 : [-4, 4, -4],
                scale: playerEnergy >= 90 ? [1, 1.06, 1] : 1,
              }}
              transition={{ repeat: Infinity, duration: 2.2, ease: 'easeInOut' }}
              className="relative w-28 h-28 sm:w-36 sm:h-36 rounded-3xl flex items-center justify-center shadow-2xl overflow-hidden border-2"
              style={{
                backgroundColor: auraRarityConfig.bgColor,
                borderColor: auraRarityConfig.borderColor,
                boxShadow: `0 0 35px ${auraRarityConfig.glowColor}`,
              }}
            >
              {equippedAura.imageUrl ? (
                <img
                  src={equippedAura.imageUrl}
                  alt={equippedAura.name}
                  className="w-full h-full object-cover rounded-3xl"
                />
              ) : (
                <span className="text-5xl sm:text-7xl select-none filter drop-shadow-xl">
                  {equippedAura.emoji}
                </span>
              )}

              {/* Rarity Star */}
              <div className="absolute top-2 right-2 w-6 h-6 rounded-full bg-slate-950/80 border border-amber-400 flex items-center justify-center">
                <Sparkles className="w-3 h-3 text-amber-400" />
              </div>
            </motion.div>

            {/* Quick Switch Aura Button */}
            <button
              onClick={() => setShowAuraDrawer(true)}
              className="mt-2 py-1 px-3 rounded-lg bg-slate-900/90 hover:bg-slate-800 text-[11px] font-mono text-cyan-300 border border-slate-700 transition-colors cursor-pointer flex items-center gap-1"
            >
              <span>Equip Aura</span>
              <ChevronRight className="w-3 h-3" />
            </button>
          </div>

          {/* PROJECTILE & FX LAYER */}
          <div className="absolute inset-0 pointer-events-none overflow-hidden">
            {projectiles.map((proj) => (
              <motion.div
                key={proj.id}
                initial={{ left: `${proj.startX}%`, top: '50%', scale: 0.8 }}
                animate={{ left: `${proj.targetX}%`, top: '50%', scale: proj.isAbility ? 1.6 : 1.1 }}
                transition={{ duration: proj.duration, ease: 'linear' }}
                className="absolute -translate-y-1/2 flex items-center justify-center"
              >
                <div
                  className="w-8 h-8 rounded-full flex items-center justify-center shadow-lg text-lg filter drop-shadow-md"
                  style={{ backgroundColor: proj.color }}
                >
                  {proj.icon}
                </div>
              </motion.div>
            ))}

            {/* Floating Damage & Combat Numbers */}
            {floatingNumbers.map((num) => (
              <motion.div
                key={num.id}
                initial={{ left: `${num.x}%`, top: `${num.y}%`, opacity: 1, scale: num.isCrit ? 1.4 : 1 }}
                animate={{ top: `${num.y - 18}%`, opacity: 0, scale: num.isCrit ? 1.6 : 1.1 }}
                transition={{ duration: 1.0 }}
                className={`absolute font-mono font-extrabold text-sm sm:text-base pointer-events-none ${
                  num.isCrit ? 'drop-shadow-lg ring-1 ring-amber-400 px-1.5 py-0.5 rounded bg-black/60' : ''
                }`}
                style={{ color: num.color }}
              >
                {num.text}
              </motion.div>
            ))}

            {/* Ultimate Ability Banner Announcement */}
            <AnimatePresence>
              {activeBanner && (
                <motion.div
                  initial={{ opacity: 0, scale: 0.8, y: -20 }}
                  animate={{ opacity: 1, scale: 1, y: 0 }}
                  exit={{ opacity: 0, scale: 0.8, y: -20 }}
                  className="absolute inset-x-0 top-1/3 mx-auto w-fit max-w-md px-6 py-3 rounded-2xl bg-black/90 border-2 backdrop-blur-md shadow-2xl flex flex-col items-center text-center z-30"
                  style={{ borderColor: activeBanner.color }}
                >
                  <span className="text-xs uppercase font-mono tracking-widest text-slate-300">
                    ULTIMATE ABILITY ACTIVATED
                  </span>
                  <span className="text-base sm:text-lg font-extrabold text-white mt-0.5">
                    {activeBanner.title}
                  </span>
                  <span className="text-[11px] text-slate-300 font-mono mt-1 max-w-sm">
                    {activeBanner.subtitle}
                  </span>
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          {/* BOSS FIGHTER (Right) */}
          <div className="relative flex flex-col items-center">
            {/* Status Indicator */}
            {bossStunTimer > 0 && (
              <span className="absolute -top-7 text-xs font-bold text-amber-400 font-mono animate-bounce">
                💥 STUNNED!
              </span>
            )}

            {/* Boss Sprite Box */}
            <motion.div
              animate={{
                y: bossStunTimer > 0 ? 0 : [4, -4, 4],
                scale: bossEnergy >= 90 ? [1, 1.08, 1] : 1,
              }}
              transition={{ repeat: Infinity, duration: 2.5, ease: 'easeInOut' }}
              className="relative w-32 h-32 sm:w-44 sm:h-44 rounded-3xl flex items-center justify-center shadow-2xl border-2"
              style={{
                backgroundColor: `${currentBoss.themeColor}20`,
                borderColor: currentBoss.themeColor,
                boxShadow: `0 0 45px ${currentBoss.themeColor}50`,
              }}
            >
              <span className="text-6xl sm:text-8xl select-none filter drop-shadow-2xl">
                {currentBoss.emoji}
              </span>

              {/* Boss Skull / Level Badge */}
              <div className="absolute top-2 right-2 px-2 py-0.5 rounded-full bg-slate-950/90 border border-red-500 text-[10px] font-mono font-bold text-red-300">
                BOSS
              </div>
            </motion.div>

            <span className="mt-2 text-xs font-mono text-slate-400 text-center">
              ATK: {currentBoss.attack} · DEF: {currentBoss.defense}
            </span>
          </div>
        </div>

        {/* Bottom Control Bar ("Sit and Watch" Engine) */}
        <div className="relative z-10 flex flex-wrap items-center justify-between gap-3 pt-3 border-t border-slate-800/80 bg-slate-950/60 p-3 rounded-2xl backdrop-blur-sm">
          <div className="flex items-center gap-2">
            {/* Play/Pause */}
            <button
              onClick={() => setIsPaused((p) => !p)}
              className="py-1.5 px-3 rounded-xl bg-slate-800 hover:bg-slate-700 text-xs font-mono font-semibold text-white transition-colors cursor-pointer flex items-center gap-1.5"
            >
              {isPaused ? <Play className="w-3.5 h-3.5 text-emerald-400" /> : <Pause className="w-3.5 h-3.5 text-amber-400" />}
              <span>{isPaused ? 'Resume' : 'Pause'}</span>
            </button>

            {/* Restart Battle */}
            <button
              onClick={() => initBattle(selectedLevelIndex)}
              className="py-1.5 px-3 rounded-xl bg-slate-800 hover:bg-slate-700 text-xs font-mono font-semibold text-slate-300 transition-colors cursor-pointer flex items-center gap-1.5"
              title="Restart Battle"
            >
              <RotateCcw className="w-3.5 h-3.5" />
              <span>Restart</span>
            </button>

            {/* Battle Speed Multiplier (1x, 2x, 4x) */}
            <div className="flex items-center rounded-xl bg-slate-900 border border-slate-800 p-0.5">
              {[1, 2, 4].map((spd) => (
                <button
                  key={spd}
                  onClick={() => setBattleSpeed(spd)}
                  className={`py-1 px-2.5 rounded-lg text-xs font-mono font-bold transition-all cursor-pointer ${
                    battleSpeed === spd
                      ? 'bg-cyan-600 text-white shadow'
                      : 'text-slate-400 hover:text-white'
                  }`}
                >
                  {spd}x
                </button>
              ))}
            </div>
          </div>

          {/* Auto-Progress Toggle */}
          <div className="flex items-center gap-3">
            <label className="flex items-center gap-2 text-xs font-mono text-slate-300 cursor-pointer">
              <input
                type="checkbox"
                checked={autoProgress}
                onChange={(e) => setAutoProgress(e.target.checked)}
                className="w-4 h-4 accent-cyan-500 rounded cursor-pointer"
              />
              <span>Auto-Progress on Win</span>
            </label>

            {/* Next Boss Button */}
            {selectedLevelIndex < 4 && (
              <button
                onClick={() => setSelectedLevelIndex((idx) => Math.min(4, idx + 1))}
                disabled={selectedLevelIndex + 1 >= unlockedLevel}
                className={`py-1.5 px-3 rounded-xl text-xs font-mono font-bold flex items-center gap-1 transition-all ${
                  selectedLevelIndex + 1 < unlockedLevel
                    ? 'bg-red-950/80 hover:bg-red-900 text-red-200 border border-red-800 cursor-pointer'
                    : 'bg-slate-900 text-slate-600 border border-slate-800 cursor-not-allowed'
                }`}
              >
                <span>Next Boss</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            )}
          </div>
        </div>

        {/* OVERLAYS: VICTORY & DEFEAT SCREENS */}
        <AnimatePresence>
          {battleState === 'victory' && (
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0 }}
              className="absolute inset-0 bg-slate-950/90 backdrop-blur-md z-40 flex flex-col items-center justify-center p-6 text-center"
            >
              <div className="w-20 h-20 rounded-full bg-emerald-500/20 border-2 border-emerald-400 flex items-center justify-center mb-4 shadow-xl">
                <Trophy className="w-10 h-10 text-emerald-400" />
              </div>
              <h2 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight mb-1">
                VICTORY!
              </h2>
              <p className="text-xs sm:text-sm text-slate-300 max-w-sm mb-4">
                You defeated <strong>{currentBoss.name}</strong> (Level {currentBoss.level})!
              </p>

              {/* Rewards Box */}
              <div className="flex items-center gap-4 p-3 rounded-2xl bg-slate-900 border border-slate-800 mb-6">
                <div className="flex items-center gap-1.5 font-mono text-cyan-300 font-bold">
                  <span>💎 +{currentBoss.shardReward} Shards</span>
                </div>
                <span className="text-slate-600">|</span>
                <div className="flex items-center gap-1.5 font-mono text-amber-300 font-bold">
                  <span>🏆 {currentBoss.itemRewardName}</span>
                </div>
              </div>

              <div className="flex items-center gap-3">
                <button
                  onClick={handleClaimRewards}
                  disabled={rewardsClaimed}
                  className={`py-2.5 px-6 rounded-xl font-bold text-xs tracking-wider transition-all cursor-pointer ${
                    rewardsClaimed
                      ? 'bg-slate-800 text-slate-400 border border-slate-700'
                      : 'bg-emerald-500 hover:bg-emerald-400 text-slate-950 shadow-lg'
                  }`}
                >
                  {rewardsClaimed ? '✓ Claimed' : 'Claim Rewards'}
                </button>

                {selectedLevelIndex < 4 && (
                  <button
                    onClick={() => {
                      handleClaimRewards();
                      setSelectedLevelIndex((i) => i + 1);
                    }}
                    className="py-2.5 px-6 rounded-xl bg-red-600 hover:bg-red-500 text-white font-bold text-xs tracking-wider transition-all cursor-pointer flex items-center gap-1.5 shadow-lg"
                  >
                    <span>Proceed to Level {selectedLevelIndex + 2}</span>
                    <ArrowRight className="w-4 h-4" />
                  </button>
                )}

                <button
                  onClick={() => initBattle(selectedLevelIndex)}
                  className="py-2.5 px-4 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-mono transition-all cursor-pointer"
                >
                  Rematch
                </button>
              </div>
            </motion.div>
          )}

          {battleState === 'defeat' && (
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0 }}
              className="absolute inset-0 bg-slate-950/90 backdrop-blur-md z-40 flex flex-col items-center justify-center p-6 text-center"
            >
              <div className="w-20 h-20 rounded-full bg-red-500/20 border-2 border-red-500 flex items-center justify-center mb-4 shadow-xl">
                <AlertTriangle className="w-10 h-10 text-red-500" />
              </div>
              <h2 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight mb-1">
                DEFEATED
              </h2>
              <p className="text-xs sm:text-sm text-slate-400 max-w-sm mb-6">
                Your aura fell before <strong>{currentBoss.name}</strong>. Try rolling higher rarity auras or equipping defensive charms!
              </p>

              <div className="flex items-center gap-3">
                <button
                  onClick={() => initBattle(selectedLevelIndex)}
                  className="py-2.5 px-6 rounded-xl bg-red-600 hover:bg-red-500 text-white font-bold text-xs tracking-wider transition-all cursor-pointer flex items-center gap-1.5 shadow-lg"
                >
                  <RotateCcw className="w-4 h-4" />
                  <span>Try Again</span>
                </button>
                <button
                  onClick={() => setShowAuraDrawer(true)}
                  className="py-2.5 px-5 rounded-xl bg-slate-800 hover:bg-slate-700 text-cyan-300 text-xs font-mono transition-all cursor-pointer"
                >
                  Equip Different Aura
                </button>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Bottom Section: Combat Log & Aura Combat Card */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        {/* Left: Active Aura Ability Card */}
        <div className="lg:col-span-1 p-4 rounded-2xl bg-slate-900 border border-slate-800 flex flex-col gap-3">
          <div className="flex items-center justify-between pb-2 border-b border-slate-800">
            <span className="text-xs font-mono uppercase tracking-wider text-slate-400">
              Active Aura Combat Profile
            </span>
            <span className="text-xs font-mono text-cyan-400">Equipped</span>
          </div>

          <div className="flex items-center gap-3">
            <div
              className="w-14 h-14 rounded-2xl flex items-center justify-center border overflow-hidden"
              style={{
                backgroundColor: auraRarityConfig.bgColor,
                borderColor: auraRarityConfig.borderColor,
              }}
            >
              {equippedAura.imageUrl ? (
                <img src={equippedAura.imageUrl} alt={equippedAura.name} className="w-full h-full object-cover" />
              ) : (
                <span className="text-3xl select-none">{equippedAura.emoji}</span>
              )}
            </div>
            <div>
              <h3 className="text-sm font-bold text-white">{equippedAura.name}</h3>
              <p className="text-xs font-mono" style={{ color: auraRarityConfig.color }}>
                {equippedAura.rarity} · {formatChance(equippedAura.baseChance)}
              </p>
            </div>
          </div>

          {/* Stats Grid */}
          <div className="grid grid-cols-2 gap-2 text-xs font-mono bg-slate-950/60 p-2.5 rounded-xl border border-slate-800/80">
            <div>
              <span className="text-slate-500">HP:</span> <strong className="text-white">{playerStats.health.toLocaleString()}</strong>
            </div>
            <div>
              <span className="text-slate-500">ATK:</span> <strong className="text-white">{playerStats.attack}</strong>
            </div>
            <div>
              <span className="text-slate-500">DEF:</span> <strong className="text-white">{playerStats.defense}</strong>
            </div>
            <div>
              <span className="text-slate-500">SPD:</span> <strong className="text-white">{playerStats.attackSpeed}/s</strong>
            </div>
            <div className="col-span-2">
              <span className="text-slate-500">CRIT:</span> <strong className="text-amber-400">{Math.round(playerStats.critChance * 100)}%</strong>
            </div>
          </div>

          {/* Ability Box */}
          <div className="p-3 rounded-xl bg-slate-950/80 border border-slate-800/80 flex flex-col gap-1">
            <div className="flex items-center gap-1.5 text-xs font-bold text-cyan-300">
              <span>{playerAbility.icon}</span>
              <span>{playerAbility.name}</span>
            </div>
            <p className="text-xs text-slate-300 leading-relaxed">
              {playerAbility.description}
            </p>
          </div>
        </div>

        {/* Right: Live Battle Log Ticker */}
        <div className="lg:col-span-2 p-4 rounded-2xl bg-slate-900 border border-slate-800 flex flex-col gap-2">
          <div className="flex items-center justify-between pb-2 border-b border-slate-800">
            <span className="text-xs font-mono uppercase tracking-wider text-slate-400 flex items-center gap-1.5">
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
              <span>Live Combat Ticker</span>
            </span>
            <span className="text-[11px] font-mono text-slate-500">Auto-scrolls latest actions</span>
          </div>

          <div className="h-48 overflow-y-auto flex flex-col gap-1.5 font-mono text-xs pr-1 scrollbar-thin">
            {combatLog.map((log) => {
              let color = 'text-slate-300';
              if (log.type === 'player_ult') color = 'text-amber-300 font-bold bg-amber-950/30 px-2 py-0.5 rounded border border-amber-800/40';
              if (log.type === 'boss_ult') color = 'text-red-400 font-bold bg-red-950/30 px-2 py-0.5 rounded border border-red-800/40';
              if (log.type === 'info') color = 'text-cyan-400 italic';

              return (
                <div key={log.id} className="flex items-start gap-2">
                  <span className="text-slate-600 text-[10px] shrink-0 tabular-nums">[{log.timestamp}]</span>
                  <span className={color}>{log.text}</span>
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {/* QUICK AURA EQUIP DRAWER MODAL */}
      <AnimatePresence>
        {showAuraDrawer && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm">
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              className="w-full max-w-2xl bg-slate-900 border border-slate-800 rounded-3xl p-6 shadow-2xl flex flex-col gap-4 max-h-[85vh] overflow-hidden"
            >
              <div className="flex items-center justify-between pb-3 border-b border-slate-800">
                <div>
                  <h3 className="text-lg font-bold text-white flex items-center gap-2">
                    <Swords className="w-5 h-5 text-cyan-400" />
                    <span>Equip Battle Aura</span>
                  </h3>
                  <p className="text-xs text-slate-400">
                    Select any aura from your inventory to lead the battle with its unique combat ability.
                  </p>
                </div>
                <button
                  onClick={() => setShowAuraDrawer(false)}
                  className="text-xs text-slate-400 hover:text-white px-2 py-1 rounded bg-slate-800 cursor-pointer"
                >
                  ✕ Close
                </button>
              </div>

              {/* Aura Grid */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 overflow-y-auto pr-1 flex-1">
                {Object.values(inventory).map((slot) => {
                  const item = slot.item;
                  const isCurrent = item.id === equippedAura.id;
                  const rConfig = RARITY_CONFIGS[item.rarity];
                  const stats = getAuraCombatStats(item);
                  const ab = getAuraAbility(item);

                  return (
                    <button
                      key={item.id}
                      onClick={() => {
                        onEquipAura(item);
                        setShowAuraDrawer(false);
                      }}
                      className={`flex flex-col p-3 rounded-2xl border text-left transition-all cursor-pointer ${
                        isCurrent
                          ? 'bg-cyan-950/40 border-cyan-400 shadow-md ring-1 ring-cyan-400'
                          : 'bg-slate-950/60 border-slate-800 hover:border-slate-700 hover:bg-slate-800/60'
                      }`}
                    >
                      <div className="flex items-center gap-3 mb-2">
                        <div
                          className="w-12 h-12 rounded-xl flex items-center justify-center border overflow-hidden shrink-0"
                          style={{ backgroundColor: rConfig.bgColor, borderColor: rConfig.borderColor }}
                        >
                          {item.imageUrl ? (
                            <img src={item.imageUrl} alt={item.name} className="w-full h-full object-cover" />
                          ) : (
                            <span className="text-2xl select-none">{item.emoji}</span>
                          )}
                        </div>
                        <div className="flex-1 min-w-0">
                          <h4 className="text-xs font-bold text-white truncate">{item.name}</h4>
                          <span className="text-[10px] font-mono" style={{ color: rConfig.color }}>
                            {item.rarity} · x{slot.count}
                          </span>
                        </div>
                        {isCurrent && (
                          <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-cyan-900 text-cyan-200">
                            Equipped
                          </span>
                        )}
                      </div>

                      {/* Stats & Ability Preview */}
                      <div className="flex items-center justify-between text-[11px] font-mono text-slate-400 border-t border-slate-800/60 pt-2">
                        <span>HP: {stats.health}</span>
                        <span>ATK: {stats.attack}</span>
                        <span>CRIT: {Math.round(stats.critChance * 100)}%</span>
                      </div>
                      <div className="mt-1.5 text-[11px] text-cyan-300 font-mono truncate">
                        ⚡ {ab.name}
                      </div>
                    </button>
                  );
                })}
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
};
