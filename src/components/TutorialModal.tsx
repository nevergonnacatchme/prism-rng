import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  X, ArrowRight, ArrowLeft, Check, Sparkles, Dices, 
  Compass, Swords, FlaskConical, Hammer, Shield, Zap, Wind,
  Coins, Film, BookOpen, Crown, EyeOff
} from 'lucide-react';
import { sound } from '../utils/audio';

interface TutorialModalProps {
  isOpen: boolean;
  onClose: (claimedBonusShards?: number) => void;
}

export const TutorialModal: React.FC<TutorialModalProps> = ({ isOpen, onClose }) => {
  const [currentStep, setCurrentStep] = useState<number>(0);

  // Check if starter reward was already claimed
  const [hasClaimedReward, setHasClaimedReward] = useState<boolean>(() => {
    try {
      return localStorage.getItem('coolrng_tutorial_reward_claimed') === 'true';
    } catch {
      return false;
    }
  });

  if (!isOpen) return null;

  const steps = [
    {
      title: 'Welcome to Prismatic RNG!',
      subtitle: 'The Ultimate 2D RPG Probability Adventure',
      icon: '🎲',
      color: '#38BDF8',
      content: (
        <div className="flex flex-col gap-3 font-mono text-xs text-slate-300">
          <p className="leading-relaxed">
            Welcome, adventurer! Test your luck across infinite probabilities, discover over <strong className="text-white">51 unique auras</strong>, and climb from basic common stones to the ultimate secret impossible tier!
          </p>
          <div className="grid grid-cols-2 gap-2.5 bg-slate-900/90 p-3 rounded-xl border border-slate-800">
            <div className="flex items-center gap-2">
              <span className="text-xl">🎲</span>
              <div>
                <strong className="text-white block">Roll Chamber</strong>
                <span className="text-[10px] text-slate-400">Tap or Spacebar to summon</span>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <span className="text-xl">🍀</span>
              <div>
                <strong className="text-white block">Luck Multipliers</strong>
                <span className="text-[10px] text-slate-400">Stack gloves, potions & biomes</span>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <span className="text-xl">⚔️</span>
              <div>
                <strong className="text-white block">2D Combat Arena</strong>
                <span className="text-[10px] text-slate-400">Conquer 10 boss levels</span>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <span className="text-xl">🌤️</span>
              <div>
                <strong className="text-white block">9 Biomes</strong>
                <span className="text-[10px] text-slate-400">Live weather & +25x boosts</span>
              </div>
            </div>
          </div>
        </div>
      ),
    },
    {
      title: 'How Shards & Gears Work',
      subtitle: 'The Core RPG Progression Engine',
      icon: '💎',
      color: '#F59E0B',
      content: (
        <div className="flex flex-col gap-3 font-mono text-xs text-slate-300">
          <div className="p-3 bg-slate-900/90 border border-slate-800 rounded-xl flex flex-col gap-2">
            <div className="flex items-center gap-2 text-amber-300 font-bold">
              <Coins className="w-4 h-4 text-amber-400" />
              <span>SHARDS CURRENCY</span>
            </div>
            <p className="text-[11px] text-slate-300 leading-relaxed">
              <strong>Shards</strong> are the main RPG currency. You earn Shards by salvaging duplicate auras in your Inventory, defeating Bosses in the Combat Arena, or completing tutorial milestones!
            </p>
          </div>

          <div className="p-3 bg-slate-900/90 border border-slate-800 rounded-xl flex flex-col gap-2">
            <div className="flex items-center gap-2 text-purple-300 font-bold">
              <Hammer className="w-4 h-4 text-purple-400" />
              <span>GEARS WORKSHOP</span>
            </div>
            <p className="text-[11px] text-slate-300 leading-relaxed">
              <strong>Gears</strong> are powerful Luck Gloves forged in the Gears Workshop using your Shards. Equipping a Gear gives you <strong>permanent Luck Multipliers</strong> (from +15% up to +2,000%) that multiply every roll you make!
            </p>
          </div>
        </div>
      ),
    },
    {
      title: '9 Dynamic Weather Biomes',
      subtitle: 'Atmospheric Events with Massive Aura Multipliers',
      icon: '🌤️',
      color: '#10B981',
      content: (
        <div className="flex flex-col gap-3 font-mono text-xs text-slate-300">
          <p className="leading-relaxed">
            The world continuously cycles through <strong className="text-white">9 distinct weather biomes</strong>. Each biome changes the background visual weather (snowflakes, meteor showers, rising embers, storm lightning) and boosts specific aura drop rates by up to <strong className="text-emerald-400">25x</strong>!
          </p>
          <div className="flex flex-col gap-1.5 bg-slate-900/90 p-3 rounded-xl border border-slate-800 text-[11px]">
            <div className="flex items-center justify-between border-b border-slate-800 pb-1.5">
              <span className="text-cyan-300 font-bold">❄️ Glacial Tundra (1 in 50)</span>
              <span className="text-slate-400">Falling Snowflakes & Frost Boost (+7.0x)</span>
            </div>
            <div className="flex items-center justify-between border-b border-slate-800 pb-1.5">
              <span className="text-indigo-300 font-bold">🌌 Deep Space (1 in 350)</span>
              <span className="text-slate-400">Shooting Stars & Cosmic Dust (+15.0x)</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-amber-300 font-bold">👑 Celestial Sanctuary (1 in 1,000)</span>
              <span className="text-slate-400">Divine Stardust & Ultra Rare Boost (+25.0x)</span>
            </div>
          </div>
        </div>
      ),
    },
    {
      title: '2D Pixel RPG Combat Arena',
      subtitle: '4-Hit M1 Slashes, QTE Parry Bar & Aura Specials',
      icon: '⚔️',
      color: '#EF4444',
      content: (
        <div className="flex flex-col gap-3 font-mono text-xs text-slate-300">
          <p className="leading-relaxed">
            Defeat 10 escalating Boss Levels! Slay the <strong className="text-lime-400">Goblin Warlords (Levels 1–5)</strong> to face the mighty <strong className="text-red-400">Crimson Plume Iron Knight (Levels 6–10)</strong>!
          </p>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 bg-slate-900/90 p-3 rounded-xl border border-slate-800 text-[11px]">
            <div className="flex items-start gap-2">
              <span className="text-sm text-cyan-400 font-bold">[LMB]</span>
              <span><strong>4-Hit M1 Combo</strong>: 4 slashes ending in a 2.8x critical finisher!</span>
            </div>
            <div className="flex items-start gap-2">
              <span className="text-sm text-emerald-400 font-bold">[Q]</span>
              <span><strong>QTE Parry Bar</strong>: Press [Q] in the green zone to parry heavy boss cleaves!</span>
            </div>
            <div className="flex items-start gap-2">
              <span className="text-sm text-amber-400 font-bold">[E]</span>
              <span><strong>Special Skill</strong>: Fill your meter to unleash devastating elemental ultimates!</span>
            </div>
            <div className="flex items-start gap-2">
              <span className="text-sm text-purple-400 font-bold">[A][D] / [Q]</span>
              <span><strong>Element Dashing</strong>: Trail ice, fire, lightning or stardust depending on aura!</span>
            </div>
          </div>
        </div>
      ),
    },
    {
      title: 'Alchemist Lab & 100k Whimsical Potion',
      subtitle: 'Brew Legendary Elixirs for Ultra Luck',
      icon: '🧪',
      color: '#A855F7',
      content: (
        <div className="flex flex-col gap-3 font-mono text-xs text-slate-300">
          <p className="leading-relaxed">
            Visit the <strong className="text-purple-300">Alchemist Shop</strong> to spend your Shards on luck draughts or brew the supreme <strong className="text-pink-400">Whimsical Potion (100,000 Shards)</strong>!
          </p>
          <div className="p-3 bg-purple-950/40 border border-purple-800 rounded-xl flex items-center justify-between">
            <div className="flex items-center gap-2.5">
              <span className="text-2xl">🌈</span>
              <div>
                <span className="font-bold text-white block">Whimsical Potion</span>
                <span className="text-[10px] text-purple-300">+1,000x Luck Multiplier on your very next single roll!</span>
              </div>
            </div>
            <span className="font-bold text-amber-300 text-xs">100,000 Shards</span>
          </div>
        </div>
      ),
    },
  ];

  const current = steps[currentStep];

  const handleNext = () => {
    sound.playTick();
    if (currentStep < steps.length - 1) {
      setCurrentStep((s) => s + 1);
    } else {
      if (!hasClaimedReward) {
        sound.playVictory();
        try {
          localStorage.setItem('coolrng_tutorial_completed', 'true');
          localStorage.setItem('coolrng_tutorial_reward_claimed', 'true');
        } catch {}
        setHasClaimedReward(true);
        onClose(50); // Claim 50 bonus starter shards ONCE
      } else {
        sound.playTick();
        onClose(0); // Already claimed before
      }
    }
  };

  const handlePrev = () => {
    sound.playTick();
    if (currentStep > 0) {
      setCurrentStep((s) => s - 1);
    }
  };

  const handleSkip = () => {
    sound.playTick();
    if (!hasClaimedReward) {
      sound.playVictory();
      try {
        localStorage.setItem('coolrng_tutorial_completed', 'true');
        localStorage.setItem('coolrng_tutorial_reward_claimed', 'true');
      } catch {}
      setHasClaimedReward(true);
      onClose(50);
    } else {
      onClose(0);
    }
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-black/85 backdrop-blur-md flex items-center justify-center p-4 select-none">
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        exit={{ opacity: 0, scale: 0.95 }}
        className="w-full max-w-xl rounded-3xl bg-slate-950 border border-slate-800 shadow-[0_0_50px_rgba(0,0,0,0.8)] overflow-hidden flex flex-col"
      >
        {/* Header */}
        <div className="p-5 border-b border-slate-800 flex items-center justify-between bg-slate-900/50">
          <div className="flex items-center gap-3">
            <div
              className="w-10 h-10 rounded-2xl flex items-center justify-center text-xl shadow-lg border"
              style={{
                backgroundColor: `${current.color}15`,
                borderColor: `${current.color}40`,
              }}
            >
              {current.icon}
            </div>
            <div>
              <h2 className="font-mono font-black text-base text-white tracking-wide">
                {current.title}
              </h2>
              <p className="font-mono text-[11px] text-slate-400">{current.subtitle}</p>
            </div>
          </div>
          <button
            onClick={handleSkip}
            className="p-1.5 rounded-xl text-slate-500 hover:text-white hover:bg-slate-800 transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content Body */}
        <div className="p-6">
          <AnimatePresence mode="wait">
            <motion.div
              key={currentStep}
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              transition={{ duration: 0.25 }}
            >
              {current.content}
            </motion.div>
          </AnimatePresence>
        </div>

        {/* Step indicators & Footer Navigation */}
        <div className="p-5 border-t border-slate-800/80 bg-slate-900/30 flex items-center justify-between">
          {/* Dots */}
          <div className="flex items-center gap-1.5">
            {steps.map((_, idx) => (
              <button
                key={idx}
                onClick={() => {
                  sound.playTick();
                  setCurrentStep(idx);
                }}
                className={`h-2 rounded-full transition-all cursor-pointer ${
                  idx === currentStep
                    ? 'w-6 bg-cyan-400 shadow-[0_0_10px_#22d3ee]'
                    : 'w-2 bg-slate-700 hover:bg-slate-500'
                }`}
              />
            ))}
          </div>

          {/* Buttons */}
          <div className="flex items-center gap-2 font-mono text-xs">
            {currentStep > 0 && (
              <button
                onClick={handlePrev}
                className="py-2 px-3.5 rounded-xl bg-slate-900 hover:bg-slate-800 border border-slate-700 text-slate-300 font-bold transition-all cursor-pointer flex items-center gap-1"
              >
                <ArrowLeft className="w-3.5 h-3.5" />
                <span>Prev</span>
              </button>
            )}

            <button
              onClick={handleNext}
              className="py-2 px-5 rounded-xl bg-gradient-to-r from-cyan-500 to-emerald-400 hover:opacity-95 text-slate-950 font-black tracking-wider uppercase transition-all shadow-lg cursor-pointer flex items-center gap-1.5"
            >
              <span>
                {currentStep === steps.length - 1
                  ? hasClaimedReward
                    ? 'Close Guide ✓'
                    : 'Claim Starter Bonus (+50 Shards) 🎉'
                  : 'Next'}
              </span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>
      </motion.div>
    </div>
  );
};
