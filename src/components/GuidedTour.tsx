import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { ArrowRight, ArrowLeft, X, Sparkles, Dices, Shield, Hammer, FlaskConical, Swords } from 'lucide-react';
import { NavTab } from './TopBar';
import { sound } from '../utils/audio';

interface GuidedTourProps {
  isActive: boolean;
  currentTab: NavTab;
  onNavigateTab: (tab: NavTab) => void;
  onCloseTour: (claimedShards?: number) => void;
}

export const GuidedTour: React.FC<GuidedTourProps> = ({
  isActive,
  currentTab,
  onNavigateTab,
  onCloseTour,
}) => {
  const [tourStep, setTourStep] = useState<number>(1);

  // Check 1-time reward claim flag in localStorage
  const [hasClaimedReward, setHasClaimedReward] = useState<boolean>(() => {
    try {
      return localStorage.getItem('coolrng_tutorial_reward_claimed') === 'true';
    } catch {
      return false;
    }
  });

  if (!isActive) return null;

  const tourSteps = [
    {
      step: 1,
      tab: 'roll' as NavTab,
      title: 'Step 1: Roll Chamber 🎲',
      subtitle: 'Press [SPACE] or Click ROLL to summon Auras',
      description: 'Your probability journey begins here! Roll to unlock over 51 unique animated auras across 9 dynamic weather biomes.',
      targetLabel: 'Main Roll Button',
      arrowPos: 'bottom-28 left-1/2 -translate-x-1/2',
      arrowDirection: 'down',
      accentColor: '#38BDF8',
    },
    {
      step: 2,
      tab: 'inventory' as NavTab,
      title: 'Step 2: Vault & Inventory 🎒',
      subtitle: 'Inspect Auras & Salvage Duplicates',
      description: 'View your aura collection. Salvage duplicate auras to earn Shards, the main currency used for potions & gear crafting!',
      targetLabel: 'Inventory Tab',
      arrowPos: 'top-16 left-[42%]',
      arrowDirection: 'up',
      accentColor: '#34D399',
    },
    {
      step: 3,
      tab: 'workshop' as NavTab,
      title: 'Step 3: Gears Workshop 🥊',
      subtitle: 'Forge Permanent Luck Gloves',
      description: 'Spend your Shards to forge Luck Gloves (from +15% up to +2,000%) that permanently multiply every single roll!',
      targetLabel: 'Gears Tab',
      arrowPos: 'top-16 left-[28%]',
      arrowDirection: 'up',
      accentColor: '#F59E0B',
    },
    {
      step: 4,
      tab: 'shop' as NavTab,
      title: 'Step 4: Alchemist Lab 🧪',
      subtitle: 'Brew Ultra Draughts & Whimsical Potion 🌈',
      description: 'Visit the Alchemist Lab to brew luck draughts or save up 100,000 Shards for the supreme +1,000x Luck Rainbow Elixir!',
      targetLabel: 'Alchemist Lab Tab',
      arrowPos: 'top-16 left-[58%]',
      arrowDirection: 'up',
      accentColor: '#C084FC',
    },
    {
      step: 5,
      tab: 'arena' as NavTab,
      title: 'Step 5: 2D Combat Arena ⚔️',
      subtitle: 'Slay Bosses with 4-Hit Combos & QTE Parries',
      description: 'Fight through 10 boss levels! Slay Goblin Warlords and the Crimson Iron Knight to earn massive Shard rewards!',
      targetLabel: 'Boss Arena Tab',
      arrowPos: 'top-16 left-[18%]',
      arrowDirection: 'up',
      accentColor: '#EF4444',
    },
  ];

  const current = tourSteps.find((s) => s.step === tourStep) || tourSteps[0];

  const handleNext = () => {
    sound.playTick();
    if (tourStep < tourSteps.length) {
      const nextStep = tourStep + 1;
      setTourStep(nextStep);
      const nextTarget = tourSteps.find((s) => s.step === nextStep);
      if (nextTarget) {
        onNavigateTab(nextTarget.tab);
      }
    } else {
      if (!hasClaimedReward) {
        sound.playVictory();
        try {
          localStorage.setItem('coolrng_tutorial_completed', 'true');
          localStorage.setItem('coolrng_tutorial_reward_claimed', 'true');
        } catch {}
        setHasClaimedReward(true);
        onCloseTour(500); // 1-time 500 shards bonus
      } else {
        sound.playTick();
        onCloseTour(0); // Already claimed before
      }
    }
  };

  const handlePrev = () => {
    sound.playTick();
    if (tourStep > 1) {
      const prevStep = tourStep - 1;
      setTourStep(prevStep);
      const prevTarget = tourSteps.find((s) => s.step === prevStep);
      if (prevTarget) {
        onNavigateTab(prevTarget.tab);
      }
    }
  };

  return (
    <div className="fixed inset-0 z-50 pointer-events-none select-none">
      {/* Semi-transparent Backdrop with hole */}
      <div className="absolute inset-0 bg-black/70 backdrop-blur-[2px] pointer-events-auto" />

      {/* BOUNCING GLOWING ARROW POINTING TO UI TARGET */}
      <motion.div
        key={`arrow-${tourStep}`}
        initial={{ scale: 0, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        className={`absolute ${current.arrowPos} pointer-events-none z-50 flex flex-col items-center`}
      >
        {current.arrowDirection === 'up' && (
          <motion.div
            animate={{ y: [0, -12, 0] }}
            transition={{ repeat: Infinity, duration: 1.0, ease: 'easeInOut' }}
            className="flex flex-col items-center"
          >
            <div
              className="text-4xl filter drop-shadow-[0_0_15px_currentColor]"
              style={{ color: current.accentColor }}
            >
              ⬆️
            </div>
            <span className="px-2.5 py-1 rounded-full bg-black/90 border border-white/40 text-[11px] font-mono font-bold text-white shadow-2xl">
              Click Here!
            </span>
          </motion.div>
        )}

        {current.arrowDirection === 'down' && (
          <motion.div
            animate={{ y: [0, 12, 0] }}
            transition={{ repeat: Infinity, duration: 1.0, ease: 'easeInOut' }}
            className="flex flex-col items-center"
          >
            <span className="px-2.5 py-1 rounded-full bg-black/90 border border-white/40 text-[11px] font-mono font-bold text-white shadow-2xl mb-1">
              Click ROLL!
            </span>
            <div
              className="text-4xl filter drop-shadow-[0_0_15px_currentColor]"
              style={{ color: current.accentColor }}
            >
              ⬇️
            </div>
          </motion.div>
        )}
      </motion.div>

      {/* STEP TOOLTIP DIALOG PANEL */}
      <div className="absolute inset-x-0 bottom-10 mx-auto max-w-lg p-4 pointer-events-auto z-50">
        <motion.div
          key={`panel-${tourStep}`}
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -20 }}
          className="rounded-3xl bg-slate-950 border-2 shadow-[0_0_50px_rgba(0,0,0,0.9)] overflow-hidden p-5 flex flex-col gap-3 font-mono"
          style={{ borderColor: `${current.accentColor}80` }}
        >
          {/* Header */}
          <div className="flex items-center justify-between border-b border-slate-800 pb-3">
            <div className="flex items-center gap-2.5">
              <span
                className="px-2.5 py-0.5 rounded-full text-xs font-black uppercase tracking-wider"
                style={{
                  backgroundColor: `${current.accentColor}20`,
                  color: current.accentColor,
                  border: `1px solid ${current.accentColor}50`,
                }}
              >
                PRISM RNG TOUR
              </span>
              <span className="text-xs text-slate-400 font-bold">({tourStep} of 5)</span>
            </div>

            <button
              onClick={() => {
                sound.playTick();
                onCloseTour(0);
              }}
              className="p-1 rounded-lg text-slate-500 hover:text-white transition-colors cursor-pointer"
            >
              <X className="w-4 h-4" />
            </button>
          </div>

          {/* Title & Body */}
          <div>
            <h3 className="text-base font-black text-white tracking-wide">{current.title}</h3>
            <p className="text-xs font-bold mt-0.5" style={{ color: current.accentColor }}>
              {current.subtitle}
            </p>
            <p className="text-xs text-slate-300 leading-relaxed mt-2">{current.description}</p>
          </div>

          {/* Step dots & Buttons */}
          <div className="flex items-center justify-between pt-2 border-t border-slate-800/80 mt-1">
            <div className="flex items-center gap-1.5">
              {tourSteps.map((s) => (
                <div
                  key={s.step}
                  className={`h-2 rounded-full transition-all ${
                    s.step === tourStep ? 'w-5 bg-cyan-400 shadow-[0_0_8px_#22d3ee]' : 'w-2 bg-slate-700'
                  }`}
                />
              ))}
            </div>

            <div className="flex items-center gap-2 text-xs font-bold">
              {tourStep > 1 && (
                <button
                  onClick={handlePrev}
                  className="py-2 px-3 rounded-xl bg-slate-900 hover:bg-slate-800 text-slate-300 border border-slate-700 transition-colors cursor-pointer"
                >
                  Prev
                </button>
              )}

              <button
                onClick={handleNext}
                className="py-2 px-4 rounded-xl text-slate-950 font-black tracking-wider uppercase transition-all shadow-lg cursor-pointer flex items-center gap-1.5"
                style={{ backgroundColor: current.accentColor }}
              >
                <span>
                  {tourStep === 5
                    ? hasClaimedReward
                      ? 'Finish Tour ✓'
                      : 'Finish & Claim +500 Shards 🎉'
                    : 'Next Step →'}
                </span>
              </button>
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  );
};
