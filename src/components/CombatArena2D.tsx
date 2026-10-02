import React, { useState, useEffect, useRef, useCallback } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  Heart, Shield, Swords, Trophy, RotateCcw, 
  Play, Pause, FastForward, Target, Sparkles, Wind, Zap, Flame, Crown
} from 'lucide-react';
import { RNGItem, InventorySlot, BossLevel } from '../types/rng';
import { BOSS_LEVELS, getAuraCombatStats, getAuraAbility } from '../data/bosses';
import { RARITY_CONFIGS } from '../data/items';
import { sound } from '../utils/audio';
import { PlayerPixelKnight, GoblinBossSprite, DarkKnightBossSprite, GargantuanTrollBossSprite } from './PixelSprites';

interface CombatArena2DProps {
  equippedAura: RNGItem;
  inventory: Record<string, InventorySlot>;
  onEquipAura: (item: RNGItem) => void;
  shards: number;
  onAddShards: (amount: number) => void;
}

interface DamageNumber {
  id: number;
  text: string;
  x: number;
  y: number;
  color: string;
  isCrit?: boolean;
}

type AuraElementType = 'fire' | 'lightning' | 'void' | 'ice' | 'holy' | 'nature' | 'imperial' | 'cosmic';

interface PixelSlashFX {
  id: number;
  x: number;
  y: number;
  comboStep: number;
  angle: number;
  color: string;
  elementType: AuraElementType;
  isFinisher: boolean;
}

interface PixelSpark {
  id: number;
  x: number;
  y: number;
  vx: number;
  vy: number;
  color: string;
  size: number;
}

interface AfterImage {
  id: number;
  x: number;
  y: number;
  facingLeft: boolean;
  opacity: number;
}

export function getAuraElementType(item: RNGItem): AuraElementType {
  const id = item.id.toLowerCase();
  const name = item.name.toLowerCase();

  if (id === 'napoleon') return 'imperial';
  if (id.includes('phoenix') || id.includes('solar') || id.includes('fire') || id.includes('flame') || id.includes('dragon') || id.includes('hyperion') || name.includes('flame') || name.includes('solar')) {
    return 'fire';
  }
  if (id.includes('thunder') || id.includes('storm') || id.includes('spark') || id.includes('voltaic') || id.includes('cyber') || id.includes('pulsar') || id.includes('matrix') || id.includes('cipher')) {
    return 'lightning';
  }
  if (id.includes('cryo') || id.includes('frost') || id.includes('ice') || id.includes('glacial')) {
    return 'ice';
  }
  if (id.includes('void') || id.includes('singularity') || id.includes('shadow') || id.includes('abyssal') || id.includes('riftwalker') || id.includes('eclipse')) {
    return 'void';
  }
  if (id.includes('infinity') || id.includes('seraphim') || id.includes('archangel') || id.includes('ouroboros') || id.includes('dawn') || id.includes('radiance')) {
    return 'holy';
  }
  if (id.includes('clover') || id.includes('leaf') || id.includes('tempest') || id.includes('tide') || id.includes('seashell')) {
    return 'nature';
  }
  return 'cosmic';
}

export const CombatArena2D: React.FC<CombatArena2DProps> = ({
  equippedAura,
  onAddShards,
}) => {
  // Boss Level (1 to 10)
  const [unlockedLevel, setUnlockedLevel] = useState<number>(() => {
    try {
      const saved = localStorage.getItem('coolrng_boss_unlocked_level_v2');
      return saved ? Math.max(1, Math.min(10, parseInt(saved, 10))) : 1;
    } catch {
      return 1;
    }
  });

  const [selectedLevelIndex, setSelectedLevelIndex] = useState<number>(0);
  const currentBoss: BossLevel = BOSS_LEVELS[selectedLevelIndex] || BOSS_LEVELS[0];
  const isIronKnight = currentBoss.level >= 6;

  const playerStats = getAuraCombatStats(equippedAura);
  const playerAbility = getAuraAbility(equippedAura);
  const playerElementType = getAuraElementType(equippedAura);

  // Health & Special Meter State
  const [playerHp, setPlayerHp] = useState<number>(playerStats.health);
  const [playerMaxHp, setPlayerMaxHp] = useState<number>(playerStats.health);
  const [playerShield, setPlayerShield] = useState<number>(0);
  const [specialEnergy, setSpecialEnergy] = useState<number>(0); // 0 to 100%

  const [bossHp, setBossHp] = useState<number>(currentBoss.maxHealth);
  const [bossMaxHp, setBossMaxHp] = useState<number>(currentBoss.maxHealth);

  // Physics Positions on 2D Stage Floor (y = 330 is ground level)
  const playerPosRef = useRef<{ x: number; y: number; vx: number; vy: number }>({ x: 180, y: 330, vx: 0, vy: 0 });
  const [playerRenderPos, setPlayerRenderPos] = useState<{ x: number; y: number }>({ x: 180, y: 330 });
  const bossPosRef = useRef<{ x: number; y: number; vx: number; vy: number }>({ x: 620, y: 330, vx: 0, vy: 0 });
  const [bossRenderPos, setBossRenderPos] = useState<{ x: number; y: number }>({ x: 620, y: 330 });

  const [playerFacingLeft, setPlayerFacingLeft] = useState<boolean>(false);
  const [bossFacingLeft, setBossFacingLeft] = useState<boolean>(true);
  const [isGrounded, setIsGrounded] = useState<boolean>(true);

  // M1 4-Hit Combo System
  const [comboStep, setComboStep] = useState<number>(1); // 1, 2, 3, 4
  const [comboTimer, setComboTimer] = useState<number>(0);
  const lastAttackTimeRef = useRef<number>(0);

  // Dash & Dodge Timing State
  const [isDashing, setIsDashing] = useState<boolean>(false);
  const isDashingRef = useRef<boolean>(false);
  const [dashCooldown, setDashCooldown] = useState<number>(0);
  const [afterImages, setAfterImages] = useState<AfterImage[]>([]);

  // BOSS TIMING DODGE QTE MECHANIC (Heavy Greatsword / Club Cleave)
  const [qteActive, setQteActive] = useState<boolean>(false);
  const [qteProgress, setQteProgress] = useState<number>(0); // 0 to 100 slider
  const qteRef = useRef<{ active: boolean; progress: number; targetMin: number; targetMax: number }>({
    active: false,
    progress: 0,
    targetMin: 55,
    targetMax: 82,
  });

  // Boss Melee AI States: 'walking' | 'winding_up' | 'swinging' | 'heavy_cleave_charging' | 'recovering'
  const [bossAction, setBossActionState] = useState<'walking' | 'winding_up' | 'swinging' | 'heavy_cleave_charging' | 'recovering'>('walking');
  const bossActionRef = useRef<'walking' | 'winding_up' | 'swinging' | 'heavy_cleave_charging' | 'recovering'>('walking');
  
  const setBossAction = useCallback((act: 'walking' | 'winding_up' | 'swinging' | 'heavy_cleave_charging' | 'recovering') => {
    bossActionRef.current = act;
    setBossActionState(act);
  }, []);
  const [bossSwingArc, setBossSwingArc] = useState<boolean>(false);

  // Controls & Game Speed
  const [autoM1, setAutoM1] = useState<boolean>(false);
  const [gameSpeed, setGameSpeed] = useState<number>(1);
  const [isPaused, setIsPaused] = useState<boolean>(false);

  // Active Key States for Smooth Input Movement
  const keysPressedRef = useRef<{ left: boolean; right: boolean; jump: boolean }>({ left: false, right: false, jump: false });

  // FX & Combat Feedback
  const [damageNumbers, setDamageNumbers] = useState<DamageNumber[]>([]);
  const [slashes, setSlashes] = useState<PixelSlashFX[]>([]);
  const [pixelSparks, setPixelSparks] = useState<PixelSpark[]>([]);
  const [screenShake, setScreenShake] = useState<boolean>(false);
  const [bossHitFlash, setBossHitFlash] = useState<boolean>(false);
  const [playerHitFlash, setPlayerHitFlash] = useState<boolean>(false);
  const [specialCutscene, setSpecialCutscene] = useState<string | null>(null);
  const [battleState, setBattleState] = useState<'fighting' | 'victory' | 'defeat'>('fighting');
  const [rewardsClaimed, setRewardsClaimed] = useState<boolean>(false);

  const arenaRef = useRef<HTMLDivElement>(null);
  const nextIdRef = useRef<number>(1);

  // Floating damage number generator
  const spawnDamage = (text: string, x: number, y: number, color = '#FFFFFF', isCrit = false) => {
    const id = nextIdRef.current++;
    setDamageNumbers((prev) => [...prev, { id, text, x, y, color, isCrit }]);
    setTimeout(() => {
      setDamageNumbers((prev) => prev.filter((d) => d.id !== id));
    }, 850);
  };

  // Spawn pixel spark particles on impact
  const spawnPixelSparks = (x: number, y: number, color: string, count = 8) => {
    const newSparks: PixelSpark[] = [];
    for (let i = 0; i < count; i++) {
      const angle = (Math.PI * 2 * i) / count + (Math.random() * 0.5 - 0.25);
      const speed = 2 + Math.random() * 4;
      newSparks.push({
        id: nextIdRef.current++,
        x,
        y,
        vx: Math.cos(angle) * speed,
        vy: Math.sin(angle) * speed - 1.5,
        color,
        size: Math.random() > 0.5 ? 4 : 6,
      });
    }
    setPixelSparks((prev) => [...prev, ...newSparks]);
    setTimeout(() => {
      const ids = new Set(newSparks.map((s) => s.id));
      setPixelSparks((prev) => prev.filter((s) => !ids.has(s.id)));
    }, 400);
  };

  // Spawn Pixelated RPG Slash Effect
  const spawnSlashFX = (x: number, y: number, step: number, angle: number, color: string, elementType: AuraElementType) => {
    const id = nextIdRef.current++;
    const isFinisher = step === 4;
    setSlashes((prev) => [...prev, { id, x, y, comboStep: step, angle, color, elementType, isFinisher }]);
    setTimeout(() => {
      setSlashes((prev) => prev.filter((s) => s.id !== id));
    }, 320);
  };

  // Perform Dash (Q key or Button) - with QTE Perfect Dodge Check
  const executeDash = useCallback(() => {
    if (dashCooldown > 0 || isPaused || battleState !== 'fighting') return;

    sound.playDash();
    setIsDashing(true);
    isDashingRef.current = true;
    setDashCooldown(1.0);

    const curX = playerPosRef.current.x;
    const curY = playerPosRef.current.y;

    // Check if player executed a Perfect Dodge during the Boss Timing Bar!
    if (qteRef.current.active) {
      const prog = qteRef.current.progress;
      const isPerfect = prog >= qteRef.current.targetMin && prog <= qteRef.current.targetMax;

      if (isPerfect) {
        // PERFECT DODGE COUNTER!
        qteRef.current.active = false;
        setQteActive(false);
        sound.playVictory();
        spawnDamage('⚡ PERFECT DODGE COUNTER! ⚡', curX, curY - 60, '#38BDF8', true);

        // Counter attack damage to boss!
        const counterDmg = Math.round(playerStats.attack * 3.5);
        setBossHp((prev) => Math.max(0, prev - counterDmg));
        spawnDamage(`-${counterDmg} COUNTER!`, bossPosRef.current.x, bossPosRef.current.y - 70, '#FACC15', true);
        setSpecialEnergy((e) => Math.min(100, e + 35)); // Big bonus energy!
      }
    }

    // Element-specific dash trail particles
    const elementTrailColors: Record<AuraElementType, string> = {
      fire: '#FB923C',
      ice: '#38BDF8',
      lightning: '#FACC15',
      void: '#C084FC',
      holy: '#FBBF24',
      nature: '#34D399',
      imperial: '#EF4444',
      cosmic: '#E879F9',
    };

    const trailColor = elementTrailColors[playerElementType] || '#38BDF8';
    spawnPixelSparks(curX, curY - 20, trailColor, 12);

    // Ghost afterimages
    const images: AfterImage[] = [
      { id: nextIdRef.current++, x: curX, y: curY, facingLeft: playerFacingLeft, opacity: 0.85 },
      { id: nextIdRef.current++, x: curX + (playerFacingLeft ? 35 : -35), y: curY, facingLeft: playerFacingLeft, opacity: 0.5 },
      { id: nextIdRef.current++, x: curX + (playerFacingLeft ? 70 : -70), y: curY, facingLeft: playerFacingLeft, opacity: 0.25 },
    ];
    setAfterImages(images);
    setTimeout(() => setAfterImages([]), 320);

    // Burst impulse
    const burstVelocity = playerFacingLeft ? -18 : 18;
    playerPosRef.current.vx = burstVelocity;

    setTimeout(() => {
      setIsDashing(false);
      isDashingRef.current = false;
    }, 280);
  }, [dashCooldown, isPaused, battleState, playerFacingLeft, playerStats.attack]);

  // UNLEASH SPECIAL ABILITY [E]
  const executeSpecialAbility = useCallback(() => {
    if (specialEnergy < 100 || battleState !== 'fighting' || isPaused) return;

    setSpecialEnergy(0);
    sound.playRareAlert();
    setSpecialCutscene(`🌟 ${playerAbility.name.toUpperCase()}! 🌟`);
    setTimeout(() => setSpecialCutscene(null), 1800);

    // Screen rumble
    setScreenShake(true);
    setTimeout(() => setScreenShake(false), 350);

    // Massive damage calculation (Supercharged 4.5x multiplier!)
    const mult = playerAbility.multiplier || 15.0;
    const specialDmg = Math.round(playerStats.attack * mult * 4.5);
    setBossHp((prev) => {
      const next = Math.max(0, prev - specialDmg);
      if (next === 0 && battleState === 'fighting') handleVictory();
      return next;
    });

    // Special Elemental FX
    const bx = bossPosRef.current.x;
    const by = bossPosRef.current.y;
    spawnSlashFX(bx, by - 40, 4, 0, '#FACC15', playerElementType);
    spawnSlashFX(bx, by - 40, 4, 45, '#EF4444', playerElementType);
    spawnSlashFX(bx, by - 40, 4, -45, '#38BDF8', playerElementType);
    spawnSlashFX(bx, by - 40, 4, 90, '#A855F7', playerElementType);
    spawnPixelSparks(bx, by - 40, '#FBBF24', 36);
    spawnDamage(`💥 -${specialDmg} ULTIMATE CRIT! 💥`, bx, by - 85, '#FACC15', true);

    // If ability grants shield
    if (playerAbility.effectType === 'shield') {
      const shieldAmt = playerAbility.effectValue || 800;
      setPlayerShield((s) => s + shieldAmt);
      spawnDamage(`+${shieldAmt} Shield!`, playerPosRef.current.x, playerPosRef.current.y - 50, '#38BDF8');
    }
  }, [specialEnergy, battleState, isPaused, playerAbility, playerStats.attack, playerElementType]); // eslint-disable-line react-hooks/exhaustive-deps

  // BASIC M1 4-HIT COMBO ATTACK (Left Click)
  const executePlayerM1 = useCallback(() => {
    if (battleState !== 'fighting' || isPaused) return;

    const now = Date.now();
    if (now - lastAttackTimeRef.current < 150) return;
    lastAttackTimeRef.current = now;

    const currentStep = comboStep;
    const isFinisher = currentStep === 4;

    setComboStep((prev) => (prev >= 4 ? 1 : prev + 1));
    setComboTimer(0.9);

    // Face towards boss
    const faceLeft = bossPosRef.current.x < playerPosRef.current.x;
    setPlayerFacingLeft(faceLeft);

    // Play ding with escalating pitch!
    sound.playDing(currentStep);

    // Gain special meter
    setSpecialEnergy((prev) => Math.min(100, prev + (isFinisher ? 12 : 5)));

    // Damage calculations
    const stepMultipliers = [1.0, 1.3, 1.7, 2.9];
    const mult = stepMultipliers[currentStep - 1];
    const isCrit = isFinisher || Math.random() < playerStats.critChance;
    const rawDmg = Math.round(playerStats.attack * mult * (isCrit ? 1.5 : 1.0) * (0.95 + Math.random() * 0.15));
    const effectiveDmg = Math.max(10, rawDmg - currentBoss.defense);

    const px = playerPosRef.current.x;
    const py = playerPosRef.current.y;
    const bx = bossPosRef.current.x;

    const slashX = px + (faceLeft ? -50 : 50);
    const slashY = py - 35;
    const slashAngle = currentStep === 1 ? -30 : currentStep === 2 ? 45 : currentStep === 3 ? 0 : 90;

    const rarityColor = RARITY_CONFIGS[equippedAura.rarity].color;
    spawnSlashFX(slashX, slashY, currentStep, slashAngle, rarityColor, playerElementType);
    spawnPixelSparks(slashX, slashY, rarityColor, isFinisher ? 16 : 8);

    const distanceToBoss = Math.abs(px - bx);
    const hitConnected = distanceToBoss < 135;

    if (hitConnected) {
      setBossHitFlash(true);
      setTimeout(() => setBossHitFlash(false), 100);

      if (isFinisher) {
        setScreenShake(true);
        setTimeout(() => setScreenShake(false), 180);
        const knockDir = bx > px ? 1 : -1;
        bossPosRef.current.vx = knockDir * 12;
      }

      setBossHp((prev) => {
        const next = Math.max(0, prev - effectiveDmg);
        if (next === 0 && battleState === 'fighting') {
          handleVictory();
        }
        return next;
      });

      spawnDamage(
        isFinisher ? `-${effectiveDmg} CRIT FINISHER!` : `-${effectiveDmg}`,
        bx + (Math.random() * 30 - 15),
        bossPosRef.current.y - 65,
        isFinisher ? '#FACC15' : isCrit ? '#F59E0B' : '#FFFFFF',
        isCrit
      );
    }
  }, [battleState, isPaused, comboStep, playerStats, currentBoss, equippedAura, playerElementType]); // eslint-disable-line react-hooks/exhaustive-deps

  const handleArenaClick = (e: React.MouseEvent<HTMLDivElement>) => {
    e.preventDefault();
    executePlayerM1();
  };

  // Reset & Init Battle
  const initBattle = useCallback((levelIdx = selectedLevelIndex) => {
    const b = BOSS_LEVELS[levelIdx] || BOSS_LEVELS[0];
    const p = getAuraCombatStats(equippedAura);

    setPlayerHp(p.health);
    setPlayerMaxHp(p.health);
    setPlayerShield(0);
    setSpecialEnergy(0);

    setBossHp(b.maxHealth);
    setBossMaxHp(b.maxHealth);

    playerPosRef.current = { x: 180, y: 330, vx: 0, vy: 0 };
    bossPosRef.current = { x: 620, y: 330, vx: 0, vy: 0 };
    setPlayerRenderPos({ x: 180, y: 330 });
    setBossRenderPos({ x: 620, y: 330 });

    setBossAction('walking');
    setBossSwingArc(false);
    setQteActive(false);
    qteRef.current.active = false;
    setComboStep(1);
    setComboTimer(0);
    setDashCooldown(0);
    setBattleState('fighting');
    setRewardsClaimed(false);
  }, [equippedAura, selectedLevelIndex]);

  useEffect(() => {
    initBattle(selectedLevelIndex);
  }, [equippedAura.id, selectedLevelIndex]); // eslint-disable-line react-hooks/exhaustive-deps

  const handleVictory = () => {
    sound.playVictory();
    setBattleState('victory');
    if (currentBoss.level < 10 && unlockedLevel <= currentBoss.level) {
      const nextLevel = currentBoss.level + 1;
      setUnlockedLevel(nextLevel);
      try {
        localStorage.setItem('coolrng_boss_unlocked_level_v2', nextLevel.toString());
      } catch {}
    }
  };

  const handleDefeat = () => {
    sound.playDefeat();
    setBattleState('defeat');
  };

  // Keyboard Input Handlers
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (battleState !== 'fighting' || isPaused) return;

      if (e.key === 'q' || e.key === 'Q') {
        executeDash();
      } else if (e.key === 'e' || e.key === 'E' || e.key === 'r' || e.key === 'R') {
        executeSpecialAbility();
      } else if (e.key === 'a' || e.key === 'A' || e.key === 'ArrowLeft') {
        keysPressedRef.current.left = true;
      } else if (e.key === 'd' || e.key === 'D' || e.key === 'ArrowRight') {
        keysPressedRef.current.right = true;
      } else if (e.key === 'w' || e.key === 'W' || e.key === ' ' || e.key === 'ArrowUp') {
        keysPressedRef.current.jump = true;
      }
    };

    const handleKeyUp = (e: KeyboardEvent) => {
      if (e.key === 'a' || e.key === 'A' || e.key === 'ArrowLeft') {
        keysPressedRef.current.left = false;
      } else if (e.key === 'd' || e.key === 'D' || e.key === 'ArrowRight') {
        keysPressedRef.current.right = false;
      } else if (e.key === 'w' || e.key === 'W' || e.key === ' ' || e.key === 'ArrowUp') {
        keysPressedRef.current.jump = false;
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    window.addEventListener('keyup', handleKeyUp);
    return () => {
      window.removeEventListener('keydown', handleKeyDown);
      window.removeEventListener('keyup', handleKeyUp);
    };
  }, [battleState, isPaused, executeDash, executeSpecialAbility]);

  // SMOOTH VELOCITY PHYSICS & COMBAT ANIMATION LOOP (requestAnimationFrame)
  useEffect(() => {
    let animFrame: number;

    const gameLoop = () => {
      if (battleState === 'fighting' && !isPaused) {
        const p = playerPosRef.current;
        const b = bossPosRef.current;
        const keys = keysPressedRef.current;

        // Player Horizontal Acceleration & Friction
        const moveAccel = 1.6 * gameSpeed;
        const maxSpeed = 7.5;
        const friction = 0.82;

        if (keys.left) {
          p.vx = Math.max(-maxSpeed, p.vx - moveAccel);
          setPlayerFacingLeft(true);
        } else if (keys.right) {
          p.vx = Math.min(maxSpeed, p.vx + moveAccel);
          setPlayerFacingLeft(false);
        } else {
          p.vx *= friction;
        }

        // Jump & Gravity
        if (keys.jump && p.y >= 330) {
          p.vy = -14.5;
          setIsGrounded(false);
        }

        p.vy += 0.85 * gameSpeed; // Gravity
        p.x += p.vx * gameSpeed;
        p.y += p.vy * gameSpeed;

        // Ground Clamp
        if (p.y >= 330) {
          p.y = 330;
          p.vy = 0;
          setIsGrounded(true);
        }
        p.x = Math.max(70, Math.min(730, p.x));

        // Boss Velocity & Friction
        b.vx *= 0.85;
        b.x += b.vx * gameSpeed;
        b.x = Math.max(70, Math.min(730, b.x));

        // Sync Render State
        setPlayerRenderPos({ x: p.x, y: p.y });
        setBossRenderPos({ x: b.x, y: b.y });

        // Update Timing Dodge QTE Slider if active
        if (qteRef.current.active) {
          qteRef.current.progress += 2.2 * gameSpeed;
          setQteProgress(qteRef.current.progress);

          // If QTE passed 100 without dodging -> lethal swing connects!
          if (qteRef.current.progress >= 100) {
            qteRef.current.active = false;
            setQteActive(false);

            // Execute heavy swing damage!
            if (!isDashingRef.current) {
              const heavyDmg = Math.round(currentBoss.attack * 2.8);
              setPlayerHp((prev) => {
                const next = Math.max(0, prev - heavyDmg);
                if (next === 0 && battleState === 'fighting') handleDefeat();
                return next;
              });
              setPlayerHitFlash(true);
              setTimeout(() => setPlayerHitFlash(false), 150);
              spawnDamage(`-${heavyDmg} CRUSHING BLOW!`, p.x, p.y - 50, '#EF4444', true);
            }
          }
        }
      }

      animFrame = requestAnimationFrame(gameLoop);
    };

    animFrame = requestAnimationFrame(gameLoop);
    return () => cancelAnimationFrame(animFrame);
  }, [battleState, isPaused, gameSpeed, currentBoss.attack]);

  // COMBAT TICK LOOP (Boss AI Decisions, Cooldowns, Auto-M1)
  useEffect(() => {
    if (battleState !== 'fighting' || isPaused) return;

    const interval = setInterval(() => {
      // Cooldown & Combo Timer decay
      setDashCooldown((cd) => Math.max(0, cd - 0.05 * gameSpeed));
      setComboTimer((t) => {
        const next = Math.max(0, t - 0.05 * gameSpeed);
        if (next === 0 && comboStep > 1) {
          setComboStep(1);
        }
        return next;
      });

      if (autoM1) {
        executePlayerM1();
      }

      // BOSS MELEE AI
      const p = playerPosRef.current;
      const b = bossPosRef.current;
      const distance = p.x - b.x;
      const absDist = Math.abs(distance);
      const faceLeft = distance < 0;
      setBossFacingLeft(faceLeft);

      // Update active QTE Timing Bar progress
      if (qteRef.current.active) {
        qteRef.current.progress += 3.5 * gameSpeed;
        setQteProgress(qteRef.current.progress);

        if (qteRef.current.progress >= 100) {
          // QTE FAILED — Heavy Slam Hit!
          qteRef.current.active = false;
          setQteActive(false);
          setPlayerHitFlash(true);
          setTimeout(() => setPlayerHitFlash(false), 150);

          const heavyDmg = Math.round(currentBoss.attack * 2.2);
          setPlayerHp((prev) => {
            const next = Math.max(0, prev - heavyDmg);
            if (next === 0 && battleState === 'fighting') handleDefeat();
            return next;
          });
          spawnDamage(`💥 -${heavyDmg} HEAVY SLAM!`, playerPosRef.current.x, playerPosRef.current.y - 50, '#EF4444', true);
        }
      }

      // Random Chance to trigger a Big Swing with Timing Dodge Bar (Every ~6 seconds)
      const shouldTriggerHeavyCleave = Math.random() < 0.08 && !qteRef.current.active && bossActionRef.current === 'walking';

      if (shouldTriggerHeavyCleave) {
        setBossAction('heavy_cleave_charging');
        qteRef.current = { active: true, progress: 0, targetMin: 55, targetMax: 82 };
        setQteActive(true);
        setQteProgress(0);

        setTimeout(() => {
          setBossAction('swinging');
          setBossSwingArc(true);
          sound.playHit();

          setTimeout(() => {
            setBossSwingArc(false);
            setBossAction('recovering');
            setTimeout(() => setBossAction('walking'), 500 / gameSpeed);
          }, 250);
        }, 1200 / gameSpeed);
      } 
      // Normal Melee Chasing & Swings
      else if (absDist > 90 && bossActionRef.current === 'walking') {
        const walkSpeed = (2.2 + currentBoss.level * 0.3) * gameSpeed;
        b.x += faceLeft ? -walkSpeed : walkSpeed;
      } else if (absDist <= 90 && bossActionRef.current === 'walking') {
        setBossAction('winding_up');

        setTimeout(() => {
          setBossAction('swinging');
          setBossSwingArc(true);
          sound.playHit();

          const curDist = Math.abs(playerPosRef.current.x - bossPosRef.current.x);
          const didHitPlayer = curDist <= 105 && !isDashingRef.current;

          if (didHitPlayer) {
            setPlayerHitFlash(true);
            setTimeout(() => setPlayerHitFlash(false), 120);

            const rawDmg = Math.round(currentBoss.attack * (0.9 + Math.random() * 0.2));
            const effectiveDmg = Math.max(5, rawDmg - playerStats.defense);

            setPlayerShield((curShield) => {
              let rem = effectiveDmg;
              let nShield = curShield;
              if (curShield > 0) {
                if (curShield >= rem) {
                  nShield = curShield - rem;
                  rem = 0;
                  spawnDamage(`Absorbed ${effectiveDmg}`, playerPosRef.current.x, playerPosRef.current.y - 45, '#38BDF8');
                } else {
                  rem -= curShield;
                  nShield = 0;
                }
              }
              if (rem > 0) {
                setPlayerHp((prev) => {
                  const next = Math.max(0, prev - rem);
                  if (next === 0 && battleState === 'fighting') handleDefeat();
                  return next;
                });
                spawnDamage(`-${rem}`, playerPosRef.current.x, playerPosRef.current.y - 45, '#EF4444');
              }
              return nShield;
            });
          } else {
            spawnDamage('DODGED!', playerPosRef.current.x, playerPosRef.current.y - 45, '#34D399');
          }

          setTimeout(() => {
            setBossSwingArc(false);
            setBossAction('recovering');
            setTimeout(() => setBossAction('walking'), 450 / gameSpeed);
          }, 200);
        }, 380 / gameSpeed);
      }
    }, 50);

    return () => clearInterval(interval);
  }, [battleState, isPaused, gameSpeed, autoM1, comboStep, currentBoss, playerStats, executePlayerM1, setBossAction]);

  const playerHpPct = Math.max(0, Math.min(100, (playerHp / playerMaxHp) * 100));
  const bossHpPct = Math.max(0, Math.min(100, (bossHp / bossMaxHp) * 100));
  const rarityConfig = RARITY_CONFIGS[equippedAura.rarity];
  const isNapoleon = equippedAura.id === 'napoleon';

  return (
    <div className="w-full max-w-7xl mx-auto px-2 sm:px-6 py-4 flex flex-col gap-4 select-none">
      {/* Header: Level Selectors & Tier Navigation */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 pb-3 border-b border-slate-800">
        <div>
          <div className="flex items-center gap-2 font-mono">
            <Swords className="w-5 h-5 text-amber-400" />
            <h1 className="text-lg sm:text-xl font-bold tracking-wider text-white uppercase">
              2D Pixel Combat Arena
            </h1>
            <span className="text-[10px] px-2 py-0.5 rounded-full bg-red-950 text-red-300 border border-red-800 font-bold">
              {isIronKnight ? 'TIER 2: IRON KNIGHT' : 'TIER 1: GOBLIN WARLORD'}
            </span>
          </div>
          <p className="text-xs text-slate-400 mt-0.5 font-mono">
            Chain 4-Hit M1 Slashes! Tap [Q] in the green zone to Perfect Dodge heavy cleaves. Press [E] for Aura Special.
          </p>
        </div>

        {/* Level Selector Pills (1 to 10) */}
        <div className="flex items-center gap-1.5 overflow-x-auto max-w-full pb-1 font-mono text-xs">
          {BOSS_LEVELS.map((boss, idx) => {
            const isUnlocked = boss.level <= unlockedLevel;
            const isSelected = idx === selectedLevelIndex;
            const isTier2 = boss.level >= 6;

            return (
              <button
                key={boss.id}
                onClick={() => isUnlocked && setSelectedLevelIndex(idx)}
                disabled={!isUnlocked}
                className={`py-1.5 px-2.5 rounded-xl font-bold flex items-center gap-1 transition-all cursor-pointer ${
                  isSelected
                    ? isTier2
                      ? 'bg-red-600 text-white shadow-[0_0_12px_#ef4444]'
                      : 'bg-amber-500 text-slate-950 shadow-lg'
                    : isUnlocked
                    ? isTier2
                      ? 'bg-red-950/50 hover:bg-red-900/60 text-red-200 border border-red-800'
                      : 'bg-slate-900 hover:bg-slate-800 text-slate-300 border border-slate-800'
                    : 'bg-slate-950 text-slate-600 border border-slate-900 cursor-not-allowed'
                }`}
              >
                <span>{boss.emoji}</span>
                <span>L{boss.level}</span>
              </button>
            );
          })}
        </div>
      </div>

      {/* 2D ACTION PIXEL COMBAT CANVAS */}
      <div
        ref={arenaRef}
        onClick={handleArenaClick}
        className={`relative w-full h-[460px] sm:h-[500px] rounded-3xl overflow-hidden cursor-crosshair border-4 border-[#1e293b] shadow-2xl transition-transform ${
          screenShake ? 'translate-y-1.5 scale-[1.01]' : ''
        }`}
        style={{
          background: 'linear-gradient(to bottom, #0f172a 0%, #090d16 50%, #030712 100%)',
        }}
      >
        {/* PIXEL DUNGEON RAIN CURTAIN & WALL (Styled after image) */}
        <div className="absolute inset-0 pointer-events-none opacity-25 flex justify-around">
          {Array.from({ length: 32 }).map((_, i) => (
            <div key={i} className="w-[1px] h-full bg-gradient-to-b from-transparent via-cyan-400 to-transparent" />
          ))}
        </div>

        {/* PIXEL STONE BRICK FLOOR (Matching uploaded image) */}
        <div className="absolute bottom-0 inset-x-0 h-[100px] bg-[#1a1c23] border-t-4 border-[#3f3f46] shadow-2xl pointer-events-none flex flex-col justify-between">
          <div className="flex justify-between w-full h-1/2 border-b-2 border-[#27272a] px-1">
            {Array.from({ length: 14 }).map((_, i) => (
              <div key={i} className="w-16 h-full bg-[#27272a] border-r-2 border-[#18181b] rounded-t-sm shadow-inner" />
            ))}
          </div>
          <div className="flex justify-between w-full h-1/2 px-4">
            {Array.from({ length: 14 }).map((_, i) => (
              <div key={i} className="w-16 h-full bg-[#18181b] border-r-2 border-[#09090b] shadow-inner" />
            ))}
          </div>
        </div>

        {/* TOP-LEFT: HEARTS, COMBO & SPECIAL [E] METER */}
        <div className="absolute top-4 left-4 z-20 flex flex-col gap-2 bg-black/85 p-3 rounded-2xl backdrop-blur-md border border-slate-800 shadow-xl">
          <div className="flex items-center gap-1.5">
            {Array.from({ length: 8 }).map((_, i) => {
              const active = i < Math.ceil((playerHp / playerMaxHp) * 8);
              return (
                <Heart
                  key={i}
                  className={`w-4 h-4 transition-all ${
                    active ? 'text-red-500 fill-red-500 drop-shadow-[0_0_6px_#ef4444]' : 'text-slate-700'
                  }`}
                />
              );
            })}
            <span className="text-white font-mono text-xs font-bold ml-2">
              {playerHp.toLocaleString()} / {playerMaxHp.toLocaleString()} HP
            </span>
          </div>

          {/* Special Ability [E] Meter Bar */}
          <div className="flex items-center gap-2 font-mono text-xs">
            <span className="text-amber-400 font-bold flex items-center gap-1">
              <Zap className="w-3.5 h-3.5" />
              <span>SPECIAL [E]:</span>
            </span>
            <div className="w-32 h-3 bg-slate-900 rounded-full border border-slate-700 overflow-hidden p-0.5">
              <div
                className={`h-full rounded-full transition-all duration-150 ${
                  specialEnergy >= 100
                    ? 'bg-gradient-to-r from-amber-400 via-pink-500 to-purple-500 shadow-[0_0_10px_#f59e0b] animate-pulse'
                    : 'bg-gradient-to-r from-cyan-500 to-blue-500'
                }`}
                style={{ width: `${specialEnergy}%` }}
              />
            </div>
            <button
              onClick={(e) => {
                e.stopPropagation();
                executeSpecialAbility();
              }}
              disabled={specialEnergy < 100}
              className={`px-2 py-0.5 rounded text-[10px] font-bold transition-all cursor-pointer ${
                specialEnergy >= 100
                  ? 'bg-amber-400 text-slate-950 font-black animate-bounce shadow-lg'
                  : 'bg-slate-800 text-slate-500 cursor-not-allowed'
              }`}
            >
              {specialEnergy >= 100 ? 'READY [E]!' : `${Math.round(specialEnergy)}%`}
            </button>
          </div>

          {/* 4-Hit M1 Combo Meter HUD */}
          <div className="flex items-center gap-2 font-mono text-[11px]">
            <span className="text-slate-400 font-bold">M1 COMBO:</span>
            <div className="flex items-center gap-1">
              {[1, 2, 3, 4].map((step) => {
                const isCurrent = comboStep === step;
                const isPassed = comboStep > step;
                return (
                  <div
                    key={step}
                    className={`w-6 h-5 rounded flex items-center justify-center font-bold text-[10px] border transition-all ${
                      step === 4
                        ? isCurrent
                          ? 'bg-amber-500 text-slate-950 border-amber-300 shadow-[0_0_10px_#f59e0b] animate-pulse'
                          : 'bg-amber-950/40 text-amber-500 border-amber-800/60'
                        : isCurrent
                        ? 'bg-cyan-500 text-slate-950 border-cyan-300 shadow-[0_0_8px_#06b6d4]'
                        : isPassed
                        ? 'bg-cyan-950 text-cyan-300 border-cyan-800'
                        : 'bg-slate-900 text-slate-600 border-slate-800'
                    }`}
                  >
                    {step === 4 ? '★4' : step}
                  </div>
                );
              })}
            </div>
            {comboTimer > 0 && (
              <span className="text-[10px] text-cyan-300 font-bold animate-pulse">
                ({comboTimer.toFixed(1)}s)
              </span>
            )}
          </div>
        </div>

        {/* TOP-RIGHT: DASH READY BUTTON */}
        <div className="absolute top-4 right-4 z-20 flex flex-col items-end gap-1.5 bg-black/85 p-2.5 rounded-2xl border border-slate-800 font-mono text-xs shadow-xl">
          <button
            onClick={(e) => {
              e.stopPropagation();
              executeDash();
            }}
            disabled={dashCooldown > 0}
            className={`px-3 py-1.5 rounded-xl font-bold flex items-center gap-1.5 transition-all cursor-pointer border ${
              dashCooldown === 0
                ? 'bg-cyan-500 text-slate-950 border-cyan-300 shadow-[0_0_12px_#06b6d4]'
                : 'bg-slate-900 text-slate-500 border-slate-800 cursor-not-allowed'
            }`}
          >
            <Wind className="w-3.5 h-3.5" />
            <span>{dashCooldown === 0 ? 'DASH [Q]' : `DASH (${dashCooldown.toFixed(1)}s)`}</span>
          </button>
        </div>

        {/* TIMING DODGE QTE OVERLAY (Heavy Boss Cleave Telegraph!) */}
        {qteActive && (
          <div className="absolute top-20 inset-x-0 mx-auto w-80 z-30 flex flex-col items-center gap-1.5 bg-black/90 p-3 rounded-2xl border-2 border-red-500 shadow-[0_0_30px_#ef4444] backdrop-blur-md animate-pulse font-mono">
            <span className="text-xs font-black text-red-400 tracking-wider flex items-center gap-1">
              <span>⚠️ HEAVY CLEAVE INCOMING — DODGE [Q]!</span>
            </span>

            {/* Timing Slider Bar */}
            <div className="relative w-full h-6 bg-slate-900 rounded-lg border border-slate-700 overflow-hidden flex items-center">
              {/* Green Perfect Dodge Zone */}
              <div
                className="absolute top-0 bottom-0 bg-emerald-500/50 border-x-2 border-emerald-400 flex items-center justify-center text-[9px] font-black text-emerald-200"
                style={{
                  left: `${qteRef.current.targetMin}%`,
                  width: `${qteRef.current.targetMax - qteRef.current.targetMin}%`,
                }}
              >
                PERFECT
              </div>

              {/* Moving Indicator */}
              <div
                className="absolute top-0 bottom-0 w-3 bg-white border-2 border-black rounded shadow-[0_0_10px_#ffffff]"
                style={{ left: `${qteProgress}%`, transform: 'translateX(-50%)' }}
              />
            </div>
          </div>
        )}

        {/* GHOST DASH AFTERIMAGES */}
        {afterImages.map((img) => (
          <div
            key={img.id}
            style={{
              left: `${img.x}px`,
              top: `${img.y}px`,
              transform: `translate(-50%, -100%) scaleX(${img.facingLeft ? -1 : 1})`,
              opacity: img.opacity,
            }}
            className="absolute z-10 pointer-events-none transition-opacity duration-300"
          >
            <div className="w-10 h-16 bg-cyan-400/40 rounded-lg blur-[2px]" />
          </div>
        ))}

        {/* 2D PLAYER CHARACTER: LITTLE SILVER PIXEL KNIGHT (download (3).jfif) */}
        <div
          style={{
            left: `${playerRenderPos.x}px`,
            top: `${playerRenderPos.y}px`,
            transform: `translate(-50%, -100%) scaleX(${playerFacingLeft ? -1 : 1})`,
          }}
          className={`absolute z-10 pointer-events-none ${
            playerHitFlash ? 'brightness-200' : ''
          }`}
        >
          <div className="relative flex flex-col items-center">
            <PlayerPixelKnight
              auraColor={rarityConfig.color}
              isAttacking={comboTimer > 0}
              comboStep={comboStep}
            />

            {/* Player Nametag */}
            <div 
              style={{ transform: `scaleX(${playerFacingLeft ? -1 : 1})` }}
              className="mt-1 px-2 py-0.5 rounded bg-black/85 border border-slate-700 text-[10px] font-mono text-white whitespace-nowrap shadow"
            >
              {equippedAura.name}
            </div>
          </div>
        </div>

        {/* 2D BOSS SPRITE: LEVEL 10 GARGANTUAN TROLL, DARK KNIGHT, OR GOBLIN */}
        <div
          style={{
            left: `${bossRenderPos.x}px`,
            top: `${bossRenderPos.y}px`,
            transform: `translate(-50%, -100%) scaleX(${bossFacingLeft ? 1 : -1})`,
          }}
          className={`absolute z-10 pointer-events-none flex flex-col items-center ${
            bossHitFlash ? 'brightness-200' : ''
          }`}
        >
          {currentBoss.level === 10 ? (
            /* FINAL BOSS (LEVEL 10): GARGANTUAN TROLL BEHEMOTH (download (4).jfif) */
            <div className="relative flex flex-col items-center">
              <GargantuanTrollBossSprite
                isAttacking={bossAction === 'swinging'}
                isChargingQte={bossAction === 'heavy_cleave_charging' || bossAction === 'winding_up'}
              />

              {/* Boss Nametag */}
              <div 
                style={{ transform: `scaleX(${bossFacingLeft ? 1 : -1})` }}
                className="mt-1 px-3 py-1 rounded-xl bg-black/95 border-2 border-red-500 flex items-center gap-1.5 shadow-[0_0_15px_#ef4444] font-mono text-xs text-red-400 font-extrabold uppercase"
              >
                <Crown className="w-4 h-4 text-amber-400 animate-bounce" />
                <span>{currentBoss.name} (Lv.{currentBoss.level} FINAL BOSS)</span>
              </div>
            </div>
          ) : isIronKnight ? (
            /* TIER 2 BOSS: CRIMSON PLUME DARK KNIGHT (download (2).jfif) */
            <div className="relative flex flex-col items-center">
              <DarkKnightBossSprite
                isAttacking={bossAction === 'swinging'}
                isChargingQte={bossAction === 'heavy_cleave_charging' || bossAction === 'winding_up'}
              />

              {/* Boss Nametag */}
              <div 
                style={{ transform: `scaleX(${bossFacingLeft ? 1 : -1})` }}
                className="mt-1 px-3 py-1 rounded-xl bg-black/90 border border-red-500/80 flex items-center gap-1.5 shadow-xl font-mono text-xs text-red-400 font-bold"
              >
                <Crown className="w-3.5 h-3.5 text-amber-400" />
                <span>{currentBoss.name} (Lv.{currentBoss.level})</span>
              </div>
            </div>
          ) : (
            /* TIER 1 BOSS: GOBLIN WARLORD (download (1).jfif) */
            <div className="relative flex flex-col items-center">
              <GoblinBossSprite isAttacking={bossAction === 'swinging'} />

              {/* Boss Nametag */}
              <div 
                style={{ transform: `scaleX(${bossFacingLeft ? 1 : -1})` }}
                className="mt-1 px-3 py-1 rounded-xl bg-black/90 border border-lime-500/80 flex items-center gap-1.5 shadow-xl font-mono text-xs text-lime-400 font-bold"
              >
                <span>👺</span>
                <span>{currentBoss.name} (Lv.{currentBoss.level})</span>
              </div>
            </div>
          )}
        </div>

        {/* BOSS SWING IMPACT ARC */}
        {bossSwingArc && (
          <motion.div
            initial={{ scale: 0.5, opacity: 1, rotate: bossFacingLeft ? 45 : -45 }}
            animate={{ scale: 1.8, opacity: 0 }}
            transition={{ duration: 0.25 }}
            style={{
              left: `${bossRenderPos.x + (bossFacingLeft ? -60 : 60)}px`,
              top: `${bossRenderPos.y - 40}px`,
            }}
            className="absolute pointer-events-none z-30 flex items-center justify-center"
          >
            <div className="w-28 h-28 rounded-full border-4 border-dashed border-red-500 bg-red-600/25 blur-[1px]" />
          </motion.div>
        )}

        {/* SPECIAL ABILITY CUTSCENE BANNER */}
        {specialCutscene && (
          <motion.div
            initial={{ scale: 0.7, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 1.2, opacity: 0 }}
            className="absolute top-1/3 inset-x-0 mx-auto w-fit z-40 bg-gradient-to-r from-amber-500 via-purple-600 to-cyan-500 p-1 rounded-2xl shadow-[0_0_40px_#f59e0b]"
          >
            <div className="bg-slate-950 px-6 py-2.5 rounded-xl font-mono font-black text-sm sm:text-base text-amber-300 tracking-widest text-center">
              {specialCutscene}
            </div>
          </motion.div>
        )}

        {/* PIXELATED RPG SLASH EFFECTS (4-HIT COMBO SEQUENCES) */}
        {slashes.map((s) => (
          <motion.div
            key={s.id}
            initial={{ scale: 0.4, opacity: 1, rotate: s.angle }}
            animate={{ scale: s.isFinisher ? 2.2 : 1.4, opacity: 0 }}
            transition={{ duration: s.isFinisher ? 0.32 : 0.22, ease: 'easeOut' }}
            style={{ left: s.x, top: s.y }}
            className="absolute -translate-x-1/2 -translate-y-1/2 pointer-events-none z-30 flex items-center justify-center"
          >
            <svg width="120" height="120" viewBox="0 0 120 120" className="filter drop-shadow-[0_0_12px_rgba(255,255,255,0.8)]">
              <path
                d="M 10 30 Q 60 10 110 60 Q 60 40 10 30 Z"
                fill={s.color}
                stroke="#FFFFFF"
                strokeWidth="2"
              />
              <path
                d="M 25 35 Q 60 22 95 55 Q 60 38 25 35 Z"
                fill="#FFFFFF"
              />
              {s.isFinisher && (
                <path
                  d="M 10 90 Q 60 110 110 60 Q 60 80 10 90 Z"
                  fill="#FACC15"
                  stroke="#FFFFFF"
                  strokeWidth="2"
                />
              )}
            </svg>
          </motion.div>
        ))}

        {/* PIXEL IMPACT SPARK CHUNKS */}
        {pixelSparks.map((spark) => (
          <motion.div
            key={spark.id}
            initial={{ left: spark.x, top: spark.y, opacity: 1 }}
            animate={{
              left: spark.x + spark.vx * 15,
              top: spark.y + spark.vy * 15,
              opacity: 0,
            }}
            transition={{ duration: 0.35, ease: 'easeOut' }}
            className="absolute pointer-events-none z-40 rounded-sm shadow"
            style={{
              width: `${spark.size}px`,
              height: `${spark.size}px`,
              backgroundColor: spark.color,
            }}
          />
        ))}

        {/* FLOATING COMBAT DAMAGE NUMBERS */}
        {damageNumbers.map((dmg) => (
          <motion.div
            key={dmg.id}
            initial={{ left: dmg.x, top: dmg.y, opacity: 1, scale: dmg.isCrit ? 1.4 : 1 }}
            animate={{ top: dmg.y - 45, opacity: 0 }}
            transition={{ duration: 0.8 }}
            className={`absolute font-mono font-extrabold text-sm sm:text-base pointer-events-none z-40 drop-shadow-md ${
              dmg.isCrit ? 'text-amber-300 ring-1 ring-amber-400 px-1.5 py-0.5 rounded bg-black/85 font-black' : ''
            }`}
            style={{ color: dmg.color }}
          >
            {dmg.text}
          </motion.div>
        ))}

        {/* BOTTOM-CENTER: BOSS HEALTH BAR */}
        <div className="absolute bottom-4 inset-x-0 mx-auto w-full max-w-md px-4 z-20 flex flex-col items-center">
          <div className="w-full bg-black/85 p-2.5 rounded-2xl border-2 border-red-500/60 backdrop-blur-md shadow-2xl flex flex-col gap-1.5">
            <div className="flex items-center justify-between text-xs font-mono">
              <span className="font-bold text-red-300 flex items-center gap-1.5">
                <span>{currentBoss.emoji}</span>
                <span>{currentBoss.name}</span>
                <span className="text-[10px] text-slate-400">(Lv.{currentBoss.level})</span>
              </span>
              <span className="text-white font-bold tabular-nums">
                {bossHp.toLocaleString()} / {bossMaxHp.toLocaleString()} HP
              </span>
            </div>

            <div className="w-full h-3.5 bg-slate-900 rounded-full overflow-hidden border border-slate-700 p-0.5">
              <div
                className="h-full bg-gradient-to-r from-red-600 via-red-500 to-amber-400 rounded-full transition-all duration-150"
                style={{ width: `${bossHpPct}%` }}
              />
            </div>
          </div>
        </div>

        {/* VICTORY MODAL */}
        {battleState === 'victory' && (
          <div className="absolute inset-0 bg-black/85 backdrop-blur-md z-50 flex flex-col items-center justify-center p-6 text-center">
            <motion.div
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              className="max-w-md w-full bg-slate-950 border-2 border-amber-400 rounded-3xl p-6 shadow-2xl flex flex-col items-center gap-4 font-mono"
            >
              <div className="w-16 h-16 rounded-2xl bg-amber-500/20 border border-amber-400 flex items-center justify-center text-3xl">
                🏆
              </div>

              <div>
                <h2 className="text-2xl font-black text-amber-300 tracking-wider">
                  VICTORY ACHIEVED!
                </h2>
                <p className="text-xs text-slate-400 mt-1">
                  You defeated {currentBoss.name}!
                </p>
              </div>

              <div className="w-full p-3 rounded-2xl bg-slate-900 border border-slate-800 flex items-center justify-between text-xs">
                <span className="text-slate-400">Battle Reward:</span>
                <span className="font-bold text-cyan-300 text-sm">
                  +{currentBoss.shardReward.toLocaleString()} Shards
                </span>
              </div>

              <div className="flex items-center gap-3 w-full">
                {!rewardsClaimed ? (
                  <button
                    onClick={() => {
                      onAddShards(currentBoss.shardReward);
                      setRewardsClaimed(true);
                      sound.playCoin();
                    }}
                    className="flex-1 py-3 rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold text-sm tracking-wider uppercase transition-all shadow-lg cursor-pointer"
                  >
                    Claim +{currentBoss.shardReward.toLocaleString()} Shards
                  </button>
                ) : (
                  <button
                    onClick={() => {
                      if (selectedLevelIndex < BOSS_LEVELS.length - 1 && selectedLevelIndex + 1 < unlockedLevel) {
                        setSelectedLevelIndex((prev) => prev + 1);
                      } else {
                        initBattle();
                      }
                    }}
                    className="flex-1 py-3 rounded-xl bg-cyan-600 hover:bg-cyan-500 text-white font-bold text-sm tracking-wider uppercase transition-all shadow-lg cursor-pointer"
                  >
                    Fight Next Level →
                  </button>
                )}

                <button
                  onClick={() => initBattle()}
                  className="py-3 px-4 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 transition-colors cursor-pointer"
                  title="Rematch"
                >
                  <RotateCcw className="w-4 h-4" />
                </button>
              </div>
            </motion.div>
          </div>
        )}

        {/* DEFEAT MODAL */}
        {battleState === 'defeat' && (
          <div className="absolute inset-0 bg-black/85 backdrop-blur-md z-50 flex flex-col items-center justify-center p-6 text-center">
            <motion.div
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              className="max-w-md w-full bg-slate-950 border-2 border-red-500 rounded-3xl p-6 shadow-2xl flex flex-col items-center gap-4 font-mono"
            >
              <div className="w-16 h-16 rounded-2xl bg-red-500/20 border border-red-500 flex items-center justify-center text-3xl">
                💀
              </div>

              <div>
                <h2 className="text-2xl font-black text-red-400 tracking-wider">
                  DEFEAT
                </h2>
                <p className="text-xs text-slate-400 mt-1">
                  {currentBoss.name}'s attack broke your defense. Time your [Q] Dodge when the bar is green to execute a Perfect Counter!
                </p>
              </div>

              <div className="flex items-center gap-3 w-full">
                <button
                  onClick={() => initBattle()}
                  className="flex-1 py-3 rounded-xl bg-red-600 hover:bg-red-500 text-white font-bold text-sm tracking-wider uppercase transition-all shadow-lg cursor-pointer flex items-center justify-center gap-2"
                >
                  <RotateCcw className="w-4 h-4" />
                  <span>Try Again</span>
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </div>

      {/* BOTTOM CONTROLS & SHORTCUTS GUIDE */}
      <div className="flex flex-wrap items-center justify-between gap-3 bg-slate-950 p-3 rounded-2xl border border-slate-800 font-mono text-xs">
        <div className="flex items-center gap-2">
          <button
            onClick={() => setAutoM1((prev) => !prev)}
            className={`py-1.5 px-3 rounded-lg font-bold border transition-all cursor-pointer flex items-center gap-1.5 ${
              autoM1
                ? 'bg-emerald-950 text-emerald-300 border-emerald-700'
                : 'bg-slate-900 text-slate-400 border-slate-800'
            }`}
          >
            <Target className="w-3.5 h-3.5" />
            <span>AUTO M1: {autoM1 ? 'ON' : 'OFF'}</span>
          </button>

          <button
            onClick={() => setGameSpeed((s) => (s === 1 ? 2 : s === 2 ? 4 : 1))}
            className="py-1.5 px-3 rounded-lg font-bold bg-slate-900 border border-slate-800 hover:text-white transition-colors cursor-pointer flex items-center gap-1.5 text-cyan-300"
          >
            <FastForward className="w-3.5 h-3.5" />
            <span>SPEED: {gameSpeed}x</span>
          </button>

          <button
            onClick={() => setIsPaused((p) => !p)}
            className="py-1.5 px-3 rounded-lg font-bold bg-slate-900 border border-slate-800 hover:text-white transition-colors cursor-pointer flex items-center gap-1 text-slate-300"
          >
            {isPaused ? <Play className="w-3.5 h-3.5" /> : <Pause className="w-3.5 h-3.5" />}
            <span>{isPaused ? 'RESUME' : 'PAUSE'}</span>
          </button>
        </div>

        {/* Keyboard Shortcuts Guide */}
        <div className="flex items-center gap-3 text-slate-400 text-[11px]">
          <span>Move: <strong className="text-white">[A] [D]</strong></span>
          <span>Jump: <strong className="text-white">[SPACE]</strong></span>
          <span>Dodge Bar: <strong className="text-emerald-400">[Q] IN GREEN</strong></span>
          <span>Special: <strong className="text-amber-300">[E]</strong></span>
          <span>M1: <strong className="text-cyan-300">[LMB]</strong></span>
        </div>
      </div>
    </div>
  );
};
