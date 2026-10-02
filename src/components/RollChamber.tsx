import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  Sparkles, Dices, Play, Square, FastForward, Shield, Flame, 
  Info, Film, Music, Clover, Zap, Hammer, Swords, BookOpen, 
  MessageSquare, User
} from 'lucide-react';
import { RNGItem, RollResult, ActivePotion, GearItem, Biome } from '../types/rng';
import { RARITY_CONFIGS, formatChance, formatPercent, ITEMS } from '../data/items';
import { NavTab } from './TopBar';
import { sound } from '../utils/audio';
import { AuraIcon } from './AuraIcon';

interface RollChamberProps {
  lastRoll: RollResult | null;
  onRoll: () => void;
  isRolling: boolean;
  autoRoll: boolean;
  onToggleAutoRoll: () => void;
  autoSkipCommon: boolean;
  onToggleAutoSkipCommon: () => void;
  quickRoll: boolean;
  onToggleQuickRoll: () => void;
  autoSkipCutscenes?: boolean;
  onToggleAutoSkipCutscenes?: () => void;
  luckMultiplier: number;
  equippedItem: RNGItem | null;
  equippedGear: GearItem | null;
  activePotion: ActivePotion | null;
  rollHistory: RollResult[];
  totalRolls: number;
  activeBiome: Biome;
  biomeRemainingSec: number;
  onInspectItem: (item: RNGItem) => void;
  onPlayCutscene?: (item: RNGItem) => void;
  onOpenTutorial?: () => void;
  onNavigateTab: (tab: NavTab) => void;
}

export const RollChamber: React.FC<RollChamberProps> = ({
  lastRoll,
  onRoll,
  isRolling,
  autoRoll,
  onToggleAutoRoll,
  autoSkipCommon,
  onToggleAutoSkipCommon,
  quickRoll,
  onToggleQuickRoll,
  autoSkipCutscenes = false,
  onToggleAutoSkipCutscenes,
  luckMultiplier,
  equippedItem,
  equippedGear,
  activePotion,
  rollHistory,
  totalRolls,
  activeBiome,
  biomeRemainingSec,
  onInspectItem,
  onPlayCutscene,
  onOpenTutorial,
  onNavigateTab,
}) => {
  const currentItem = lastRoll?.item;
  const rarityConfig = currentItem ? RARITY_CONFIGS[currentItem.rarity] : RARITY_CONFIGS['Common'];

  const [displayItem, setDisplayItem] = useState<RNGItem | null>(currentItem || null);
  const [musicActive, setMusicActive] = useState(false);

  useEffect(() => {
    if (currentItem && !isRolling) {
      setDisplayItem(currentItem);
      if (currentItem.id === 'napoleon') {
        setMusicActive(true);
      }
    }
  }, [currentItem, isRolling]);

  // Handle Spacebar hotkey to roll
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.code === 'Space' && !e.repeat && document.activeElement?.tagName !== 'INPUT') {
        e.preventDefault();
        if (!isRolling && !autoRoll) {
          onRoll();
        }
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isRolling, autoRoll, onRoll]);

  const hasCutscene =
    displayItem &&
    (displayItem.rarity === 'Impossible' ||
      displayItem.rarity === 'Transcendent' ||
      displayItem.rarity === 'Celestial' ||
      displayItem.rarity === 'Mythic');

  const isImpossible = displayItem?.rarity === 'Impossible';

  return (
    <div className="relative w-full min-h-[calc(100vh-4rem)] flex flex-col justify-between px-3 sm:px-6 py-4 overflow-hidden select-none">
      {/* TOP FLOATING HUD */}
      <div className="relative z-20 w-full flex flex-wrap items-center justify-between gap-3">
        {/* Left: Player Title & Equipped Glove */}
        <div className="flex items-center gap-2.5 bg-slate-950/80 px-3.5 py-2 rounded-2xl border border-slate-800/80 backdrop-blur-md shadow-lg">
          <div className="w-8 h-8 rounded-xl bg-cyan-950/80 border border-cyan-800 flex items-center justify-center text-cyan-400 font-mono text-xs font-bold">
            ⚡
          </div>
          <div className="flex flex-col font-mono">
            <div className="flex items-center gap-1.5">
              <span className="text-[10px] text-slate-400 uppercase tracking-widest font-bold">
                TOTAL ROLLS:
              </span>
              <span className="text-xs font-bold text-white tabular-nums">
                {totalRolls.toLocaleString()}
              </span>
            </div>
            {equippedGear ? (
              <span className="text-[11px] font-bold text-emerald-400 flex items-center gap-1">
                <span>{equippedGear.icon}</span>
                <span>{equippedGear.name} (+{equippedGear.luckBonus}%)</span>
              </span>
            ) : (
              <button
                onClick={() => onNavigateTab('shop')}
                className="text-[10px] text-slate-500 hover:text-cyan-300 transition-colors text-left"
              >
                No Glove Equipped (Click to Forge)
              </button>
            )}
          </div>
        </div>

        {/* Center: Glowing Green Luck HUD Pill */}
        <div className="flex items-center gap-2.5 px-5 py-2 rounded-full bg-slate-950/90 border border-emerald-500/60 shadow-[0_0_25px_rgba(16,185,129,0.25)] backdrop-blur-md">
          <Clover className="w-4 h-4 text-emerald-400 animate-pulse" />
          <span className="text-xs font-mono font-bold tracking-wider text-slate-300">
            LUCK:
          </span>
          <span className="text-sm font-mono font-extrabold text-emerald-300 tabular-nums">
            x{luckMultiplier.toFixed(2)}
          </span>

          {activePotion && (
            <span className={`ml-1 text-[11px] font-mono px-2 py-0.5 rounded-full border flex items-center gap-1 ${
              activePotion.id === 'whimsical_potion'
                ? 'bg-amber-950 text-amber-300 border-amber-400 shadow-[0_0_15px_#f59e0b] font-black animate-pulse'
                : 'bg-cyan-950 text-cyan-300 border-cyan-800'
            }`}>
              <span>{activePotion.icon}</span>
              <span>x{activePotion.multiplier} ({activePotion.remainingRolls})</span>
            </span>
          )}
        </div>

        {/* Right: Quick Shortcut Navigation Pills */}
        <div className="hidden md:flex items-center gap-1.5 bg-slate-950/80 p-1 rounded-2xl border border-slate-800/80 backdrop-blur-md">
          <button
            onClick={() => onNavigateTab('shop')}
            className="py-1.5 px-3 rounded-xl text-xs font-mono font-bold text-purple-200 hover:bg-purple-900/80 transition-all flex items-center gap-1.5 cursor-pointer bg-purple-950/60 border border-purple-500/80 shadow-[0_0_12px_rgba(168,85,247,0.4)]"
          >
            <span className="text-sm animate-pulse">🧪</span>
            <span>Alchemist Lab</span>
          </button>
          <button
            onClick={() => onNavigateTab('arena')}
            className="py-1.5 px-3 rounded-xl text-xs font-mono font-bold text-red-300 hover:bg-red-950/50 transition-colors flex items-center gap-1.5 cursor-pointer"
          >
            <Swords className="w-3.5 h-3.5 text-red-400" />
            <span>Arena</span>
          </button>
          <button
            onClick={() => onNavigateTab('inventory')}
            className="py-1.5 px-3 rounded-xl text-xs font-mono font-bold text-slate-300 hover:bg-slate-900 transition-colors flex items-center gap-1.5 cursor-pointer"
          >
            <Shield className="w-3.5 h-3.5 text-cyan-400" />
            <span>Vault</span>
          </button>
          <button
            onClick={() => onNavigateTab('workshop')}
            className="py-1.5 px-3 rounded-xl text-xs font-mono font-bold text-amber-300 hover:bg-amber-950/50 transition-colors flex items-center gap-1.5 cursor-pointer"
          >
            <Hammer className="w-3.5 h-3.5 text-amber-400" />
            <span>Gears</span>
          </button>
        </div>
      </div>

      {/* ACTIVE BIOME HUD ROW */}
      <div className="relative z-20 w-full flex flex-wrap items-center justify-between gap-2 mt-2 px-1 font-mono">
        <div 
          className="flex items-center gap-2 px-3 py-1.5 rounded-2xl bg-slate-950/90 border shadow-lg backdrop-blur-md"
          style={{ borderColor: `${activeBiome.color}70` }}
        >
          <span className="text-base">{activeBiome.emoji}</span>
          <div className="flex flex-col">
            <div className="flex items-center gap-1.5">
              <span className="text-[10px] text-slate-400 font-bold uppercase">BIOME:</span>
              <span className="text-xs font-black tracking-wide" style={{ color: activeBiome.color }}>
                {activeBiome.name.toUpperCase()}
              </span>
              {activeBiome.rarityChance > 1 && (
                <span className="text-[9px] px-1.5 py-0.2 rounded bg-black/60 border border-slate-700 text-slate-300 font-bold">
                  1 in {activeBiome.rarityChance.toLocaleString()}
                </span>
              )}
            </div>
          </div>
          <span className="text-[10px] text-slate-400 ml-1">
            ⏱️ {biomeRemainingSec}s
          </span>
        </div>

        {/* Boosted Auras in Active Biome */}
        {activeBiome.boostedAuras.length > 0 && (
          <div className="flex items-center gap-1.5 overflow-x-auto py-0.5">
            <span className="text-[10px] text-slate-400 font-bold uppercase">BOOSTED:</span>
            {activeBiome.boostedAuras.slice(0, 3).map((boost) => {
              const matched = ITEMS.find((i) => i.id === boost.itemId);
              if (!matched) return null;
              const config = RARITY_CONFIGS[matched.rarity];
              return (
                <div
                  key={boost.itemId}
                  className="flex items-center gap-1 px-2 py-0.5 rounded-lg bg-black/75 border text-[10px]"
                  style={{ borderColor: `${config.color}50` }}
                >
                  <span>{matched.emoji}</span>
                  <span style={{ color: config.color }} className="font-bold">{matched.name}</span>
                  <span className="text-emerald-400 font-black">+{boost.multiplier}x</span>
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* MAIN CENTER SUMMONING PEDESTAL & AURA SHOWCASE */}
      <div className="relative w-full flex-1 flex flex-col items-center justify-center my-3">
        {/* Dynamic Glow Aura Rays */}
        <div
          className="absolute w-64 h-64 sm:w-[320px] sm:h-[320px] rounded-full pointer-events-none transition-all duration-1000 blur-2xl opacity-20"
          style={{ backgroundColor: rarityConfig.color }}
        />

        {/* Rotating Ground Runic Summoning Circles */}
        <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
          {/* Outer runic ring */}
          <motion.div
            animate={{ rotate: 360 }}
            transition={{ repeat: Infinity, duration: 40, ease: 'linear' }}
            className="w-56 h-56 sm:w-[320px] sm:h-[320px] rounded-full border border-dashed border-slate-700/50"
          />
          {/* Middle counter-rotating ring */}
          <motion.div
            animate={{ rotate: -360 }}
            transition={{ repeat: Infinity, duration: 60, ease: 'linear' }}
            className="absolute w-48 h-48 sm:w-[260px] sm:h-[260px] rounded-full border border-slate-800/80 shadow-[0_0_20px_rgba(255,255,255,0.02)]"
          />
        </div>

        {/* Center Presentation Card */}
        <div className="relative z-10 w-full max-w-sm flex flex-col items-center text-center">
          <AnimatePresence mode="wait">
            {displayItem ? (
              <motion.div
                key={displayItem.id + (lastRoll?.rollNumber || 0)}
                initial={{ scale: 0.88, opacity: 0, y: 12 }}
                animate={{ scale: 1, opacity: 1, y: 0 }}
                exit={{ scale: 0.92, opacity: 0 }}
                transition={{ duration: 0.22, ease: [0.16, 1, 0.3, 1] }}
                className="flex flex-col items-center w-full"
              >
                {/* 2D Item Visual Float Container (Compact & Straight Hard-Edged) */}
                <div
                  className={`relative w-32 h-32 sm:w-36 sm:h-36 rounded-none flex items-center justify-center mb-3 shadow-2xl transition-all duration-300 overflow-hidden ${
                    isImpossible ? 'ring-2 ring-red-500/80' : ''
                  }`}
                  style={{
                    backgroundColor: rarityConfig.bgColor,
                    border: `2px solid ${rarityConfig.borderColor}`,
                    boxShadow: `0 0 35px ${rarityConfig.glowColor}`,
                  }}
                >
                  {displayItem.imageUrl ? (
                    <img
                      src={displayItem.imageUrl}
                      alt={displayItem.name}
                      className="w-full h-full object-cover rounded-none select-none"
                    />
                  ) : (
                    /* Floating Item Sprite with AuraIcon */
                    <motion.div
                      animate={{ y: [-3, 3, -3] }}
                      transition={{ repeat: Infinity, duration: 3, ease: 'easeInOut' }}
                      className="select-none filter drop-shadow-xl flex items-center justify-center"
                    >
                      <AuraIcon item={displayItem} size="hero" showGlow />
                    </motion.div>
                  )}

                  {/* Sparkle emblem for top rarities */}
                  {hasCutscene && (
                    <div className="absolute top-2 right-2 w-6 h-6 rounded-full bg-slate-950/90 border border-amber-400 flex items-center justify-center shadow-lg">
                      <Sparkles className="w-3 h-3 text-amber-400 animate-spin" />
                    </div>
                  )}
                </div>

                {/* Floating Aura Nametag */}
                <div className="flex flex-col items-center gap-1 mb-2">
                  <span
                    className="text-[10px] uppercase tracking-[0.2em] font-extrabold font-mono px-2.5 py-0.5 rounded border"
                    style={{
                      color: rarityConfig.color,
                      backgroundColor: `${rarityConfig.color}15`,
                      borderColor: `${rarityConfig.color}40`,
                    }}
                  >
                    [ {displayItem.rarity.toUpperCase()} ]
                  </span>

                  <h2 className="text-xl sm:text-2xl font-black tracking-wider text-white font-mono drop-shadow-md uppercase">
                    {displayItem.name}
                  </h2>

                  {/* Chance Bracket */}
                  <div className="flex items-center gap-2 text-[11px] font-mono tabular-nums">
                    <span className="font-bold text-slate-200">
                      [ 1 in {displayItem.baseChance.toLocaleString()} ]
                    </span>
                    <span className="text-slate-600">·</span>
                    <span style={{ color: rarityConfig.color }} className="font-bold">
                      {formatPercent(displayItem.baseChance)}
                    </span>
                  </div>
                </div>

                <p className="text-[11px] text-slate-400 max-w-xs text-center mb-1 leading-snug">
                  {displayItem.description}
                </p>

                <p className="text-xs text-slate-500 italic max-w-xs text-center mb-4">
                  {displayItem.flavorText}
                </p>

                {/* Action buttons under Pedestal */}
                <div className="flex items-center gap-3 flex-wrap justify-center">
                  <button
                    onClick={() => onInspectItem(displayItem)}
                    className="text-xs font-mono text-slate-400 hover:text-cyan-300 transition-colors flex items-center gap-1 cursor-pointer bg-slate-900/80 px-2.5 py-1 rounded-lg border border-slate-800"
                  >
                    <Info className="w-3.5 h-3.5" />
                    <span>Aura Details</span>
                  </button>

                  {hasCutscene && onPlayCutscene && (
                    <button
                      onClick={() => onPlayCutscene(displayItem)}
                      className="text-xs font-mono text-amber-400 hover:text-amber-300 transition-colors flex items-center gap-1 cursor-pointer bg-amber-950/40 px-2.5 py-1 rounded-lg border border-amber-800/50"
                      title="Replay cinematic cutscene"
                    >
                      <Film className="w-3.5 h-3.5" />
                      <span>Cutscene</span>
                    </button>
                  )}

                  {displayItem.id === 'napoleon' && (
                    <button
                      onClick={() => {
                        if (sound.isMusicPlaying()) {
                          sound.stopMusic();
                          setMusicActive(false);
                        } else {
                          sound.playAmourPlastique();
                          setMusicActive(true);
                        }
                      }}
                      className="text-xs font-mono text-red-300 hover:text-white font-bold transition-colors flex items-center gap-1.5 cursor-pointer bg-red-950/80 hover:bg-red-900 px-3 py-1 rounded-lg border border-red-500/50 shadow-md"
                    >
                      <Music className="w-3.5 h-3.5 text-red-400 animate-pulse" />
                      <span>{musicActive ? 'Pause Song ⏸' : 'Play Amour Plastique ▶'}</span>
                    </button>
                  )}
                </div>
              </motion.div>
            ) : (
              <div className="flex flex-col items-center py-12 text-slate-500 font-mono">
                <div className="w-32 h-32 rounded-3xl border border-dashed border-slate-800 flex items-center justify-center mb-4 bg-slate-950/40">
                  <Dices className="w-12 h-12 text-slate-600 animate-pulse" />
                </div>
                <p className="text-base font-bold text-slate-300">SUMMONING CHAMBER</p>
                <p className="text-xs text-slate-500 mt-1">Tap ROLL or press Spacebar to summon</p>
              </div>
            )}
          </AnimatePresence>
        </div>
      </div>

      {/* LEFT VERTICAL SIDEBAR HUB (Sol's RNG Style) */}
      <div className="absolute left-3 top-24 z-30 hidden sm:flex flex-col gap-2">
        <button
          onClick={() => onNavigateTab('inventory')}
          className="w-11 h-11 rounded-lg bg-[#0d121c]/90 border-2 border-slate-500/60 hover:border-cyan-400 text-white flex items-center justify-center shadow-xl transition-all cursor-pointer group"
          title="Aura Vault & Storage"
        >
          <Shield className="w-5 h-5 text-cyan-400 group-hover:scale-110 transition-transform" />
        </button>

        <button
          onClick={() => onNavigateTab('index')}
          className="w-11 h-11 rounded-lg bg-[#0d121c]/90 border-2 border-slate-500/60 hover:border-amber-400 text-white flex items-center justify-center shadow-xl transition-all cursor-pointer group"
          title="Aura Collection & Index"
        >
          <BookOpen className="w-5 h-5 text-amber-400 group-hover:scale-110 transition-transform" />
        </button>

        <button
          onClick={() => onNavigateTab('workshop')}
          className="w-11 h-11 rounded-lg bg-[#0d121c]/90 border-2 border-slate-500/60 hover:border-orange-400 text-white flex items-center justify-center shadow-xl transition-all cursor-pointer group"
          title="Gears & Gloves Workshop"
        >
          <Hammer className="w-5 h-5 text-orange-400 group-hover:scale-110 transition-transform" />
        </button>

        <button
          onClick={() => onNavigateTab('shop')}
          className="w-11 h-11 rounded-lg bg-[#0d121c]/90 border-2 border-purple-500/80 hover:border-purple-400 text-white flex items-center justify-center shadow-xl transition-all cursor-pointer group bg-purple-950/40"
          title="Alchemist Laboratory"
        >
          <span className="text-xl group-hover:scale-110 transition-transform animate-pulse">🧪</span>
        </button>

        <button
          onClick={() => onNavigateTab('arena')}
          className="w-11 h-11 rounded-lg bg-[#0d121c]/90 border-2 border-red-500/80 hover:border-red-400 text-white flex items-center justify-center shadow-xl transition-all cursor-pointer group bg-red-950/40"
          title="2D Boss Combat Arena"
        >
          <Swords className="w-5 h-5 text-red-400 group-hover:scale-110 transition-transform" />
        </button>
      </div>

      {/* BOTTOM FLOATING SOL'S RNG ACTION DOCK */}
      <div className="relative z-20 w-full flex flex-col items-center gap-2 pt-2 border-t-2 border-slate-700/80 bg-[#0a0d14]/95 p-3 rounded-2xl backdrop-blur-2xl shadow-2xl font-mono">
        {/* Sol's RNG Signature 3-Pill Action Row */}
        <div className="w-full max-w-2xl flex flex-wrap items-center justify-center gap-2 sm:gap-3">
          {/* Left Pill: Auto Roll : ON/OFF */}
          <button
            onClick={onToggleAutoRoll}
            className={`px-5 py-2.5 rounded-lg font-black text-xs sm:text-sm tracking-wider uppercase transition-all flex items-center gap-2 cursor-pointer border-2 shadow-xl ${
              autoRoll
                ? 'bg-[#12281d] border-emerald-400 text-emerald-300 shadow-[0_0_15px_rgba(34,197,94,0.4)]'
                : 'bg-[#111622] hover:bg-[#182030] border-slate-500/80 text-slate-200'
            }`}
          >
            <span>Auto roll : <strong className={autoRoll ? 'text-emerald-400' : 'text-slate-400'}>{autoRoll ? 'ON' : 'OFF'}</strong></span>
          </button>

          {/* Center Main Pill: Giant Roll Button */}
          <button
            onClick={onRoll}
            disabled={isRolling}
            className={`px-8 py-3 rounded-lg font-black text-base sm:text-xl tracking-widest uppercase transition-all duration-150 flex flex-col items-center justify-center cursor-pointer border-2 shadow-2xl min-w-[160px] ${
              isRolling
                ? 'bg-slate-800 text-slate-500 border-slate-600 cursor-not-allowed'
                : 'bg-[#182232] hover:bg-[#202c40] text-white border-slate-300 shadow-[0_0_25px_rgba(255,255,255,0.2)] active:scale-95'
            }`}
          >
            <div className="flex items-center gap-2">
              <Dices className={`w-5 h-5 text-cyan-400 ${isRolling ? 'animate-spin' : ''}`} />
              <span className="font-serif tracking-widest">{isRolling ? 'ROLLING...' : 'Roll'}</span>
            </div>
            <span className="text-[10px] text-slate-400 font-sans tracking-normal font-normal">
              {equippedGear ? equippedGear.name : '1/1'}
            </span>
          </button>

          {/* Right Pill: Quick Roll : ON/OFF */}
          <button
            onClick={onToggleQuickRoll}
            className={`px-5 py-2.5 rounded-lg font-black text-xs sm:text-sm tracking-wider uppercase transition-all flex items-center gap-2 cursor-pointer border-2 shadow-xl ${
              quickRoll
                ? 'bg-[#12281d] border-emerald-400 text-emerald-300 shadow-[0_0_15px_rgba(34,197,94,0.4)]'
                : 'bg-[#111622] hover:bg-[#182030] border-slate-500/80 text-slate-200'
            }`}
          >
            <span>Quick roll : <strong className={quickRoll ? 'text-emerald-400' : 'text-slate-400'}>{quickRoll ? 'ON' : 'OFF'}</strong></span>
          </button>
        </div>

        {/* Secondary Toggles Bar (Skip Common, Cutscenes, Playable Guide) */}
        <div className="flex flex-wrap items-center justify-center gap-2 text-[11px]">
          <button
            onClick={onToggleAutoSkipCommon}
            className={`px-3 py-1 rounded bg-[#111622] border border-slate-600 hover:border-slate-400 transition-colors cursor-pointer ${
              autoSkipCommon ? 'text-emerald-300 border-emerald-500' : 'text-slate-400'
            }`}
          >
            Skip Common: {autoSkipCommon ? 'ON' : 'OFF'}
          </button>

          {onToggleAutoSkipCutscenes && (
            <button
              onClick={onToggleAutoSkipCutscenes}
              className={`px-3 py-1 rounded bg-[#111622] border border-slate-600 hover:border-slate-400 transition-colors cursor-pointer ${
                autoSkipCutscenes ? 'text-amber-300 border-amber-500' : 'text-slate-400'
              }`}
            >
              Skip Cutscenes: {autoSkipCutscenes ? 'ON' : 'OFF'}
            </button>
          )}

          {onOpenTutorial && (
            <button
              onClick={onOpenTutorial}
              className="px-3 py-1 rounded bg-purple-950/80 border border-purple-500/80 text-purple-200 hover:text-white transition-colors cursor-pointer font-bold"
            >
              Playable Guide 🎯
            </button>
          )}
        </div>

        {/* Recent Roll Bar */}
        {rollHistory.length > 0 && (
          <div className="w-full flex items-center gap-2 overflow-x-auto py-1 scrollbar-none font-mono">
            <span className="text-[11px] text-slate-500 uppercase tracking-wider whitespace-nowrap">
              Recent:
            </span>
            <div className="flex items-center gap-2">
              {rollHistory.slice(0, 8).map((roll, idx) => {
                const config = RARITY_CONFIGS[roll.item.rarity];
                return (
                  <button
                    key={`${roll.rollNumber}-${idx}`}
                    onClick={() => onInspectItem(roll.item)}
                    className="flex items-center gap-1.5 px-2.5 py-1 rounded-xl bg-slate-900 border border-slate-800 text-xs hover:border-slate-700 transition-colors whitespace-nowrap cursor-pointer"
                  >
                    <AuraIcon item={roll.item} size="xs" />
                    <span style={{ color: config.color }} className="font-bold">
                      {roll.item.name}
                    </span>
                  </button>
                );
              })}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
