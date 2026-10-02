import React from 'react';
import { FlaskConical, Sparkles, Coins, Zap, ShieldAlert, Award } from 'lucide-react';
import { ActivePotion } from '../types/rng';

interface AlchemistShopProps {
  shards: number;
  activePotion: ActivePotion | null;
  baseLuckLevel: number;
  onBuyPotion: (potion: { id: string; name: string; multiplier: number; duration: number; cost: number; icon: string }) => void;
  onUpgradeBaseLuck: (cost: number) => void;
  onResetProgress: () => void;
}

const POTIONS = [
  {
    id: 'minor_luck',
    name: 'Fortune Draught',
    multiplier: 2.0,
    duration: 30,
    cost: 45,
    icon: '🧪',
    description: 'A glowing effervescent potion that doubles your luck for 30 consecutive rolls.',
  },
  {
    id: 'celestial_elixir',
    name: 'Celestial Elixir',
    multiplier: 4.0,
    duration: 25,
    cost: 180,
    icon: '⚗️',
    description: 'Distilled stardust that quadruples your luck for 25 consecutive rolls.',
  },
  {
    id: 'serendipity_catalyst',
    name: 'Serendipity Catalyst',
    multiplier: 8.0,
    duration: 15,
    cost: 750,
    icon: '🔮',
    description: 'A volatile concoction bending probability. Grants 8x luck for 15 rolls.',
  },
  {
    id: 'whimsical_potion',
    name: 'Whimsical Potion',
    multiplier: 1000.0,
    duration: 1,
    cost: 100000,
    icon: '🌈',
    description: 'A legendary prismatic elixir distilled from celestial stardust. Grants an unfathomable +1,000x Luck on your very next single roll!',
  },
];

export const AlchemistShop: React.FC<AlchemistShopProps> = ({
  shards,
  activePotion,
  baseLuckLevel,
  onBuyPotion,
  onUpgradeBaseLuck,
  onResetProgress,
}) => {
  const upgradeCost = Math.floor(60 * Math.pow(1.65, baseLuckLevel - 1));
  const canAffordUpgrade = shards >= upgradeCost;

  return (
    <div className="w-full max-w-5xl mx-auto px-4 sm:px-6 py-6 flex flex-col gap-6 font-mono">
      {/* Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 pb-4 border-b-2 border-slate-700/80">
        <div>
          <h1 className="text-xl font-extrabold tracking-widest text-white uppercase flex items-center gap-2">
            <FlaskConical className="w-6 h-6 text-purple-400 animate-pulse" />
            <span>Alchemist Laboratory</span>
          </h1>
          <p className="text-xs text-slate-400 mt-1">
            Salvage items in your Inventory to acquire Shards, then brew potent luck elixirs and permanent upgrades.
          </p>
        </div>

        {/* Currency Display */}
        <div className="flex items-center gap-2 bg-[#0c1017] border-2 border-slate-600 px-4 py-2 rounded-lg shadow-xl">
          <Coins className="w-4 h-4 text-amber-400" />
          <span className="text-xs text-slate-400">Available Shards:</span>
          <span className="text-sm font-bold text-amber-300 tabular-nums">
            {shards.toLocaleString()}
          </span>
        </div>
      </div>

      {/* Active Potion Status Banner */}
      {activePotion && (
        <div className="p-4 rounded-lg bg-[#140c1e] border-2 border-purple-500/80 flex items-center justify-between shadow-2xl">
          <div className="flex items-center gap-3">
            <span className="text-3xl">{activePotion.icon}</span>
            <div>
              <p className="text-xs font-bold uppercase tracking-wider text-purple-300">Active Potion Effect</p>
              <p className="text-sm font-black text-white">
                {activePotion.name} ·{' '}
                <span className="text-cyan-400">{activePotion.multiplier}x Luck</span>
              </p>
            </div>
          </div>
          <div className="text-right font-mono">
            <span className="text-xs text-slate-400 block">Remaining:</span>
            <span className="text-sm font-black text-amber-300 tabular-nums">
              {activePotion.remainingRolls} Rolls
            </span>
          </div>
        </div>
      )}

      {/* Permanent Upgrades Section */}
      <div className="flex flex-col gap-3">
        <h2 className="text-sm font-bold uppercase tracking-wider text-slate-300 flex items-center gap-2">
          <Zap className="w-4 h-4 text-cyan-400" />
          <span>Permanent Resonance Upgrades</span>
        </h2>

        <div className="p-5 rounded-2xl bg-slate-900 border border-slate-800 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2">
              <h3 className="text-sm font-bold text-white">Permanent Luck Resonance</h3>
              <span className="text-xs font-mono text-cyan-400 bg-cyan-950 px-2 py-0.5 rounded border border-cyan-800">
                Level {baseLuckLevel}
              </span>
            </div>
            <p className="text-xs text-slate-400 mt-1 max-w-md">
              Permanently enhances base roll frequency. Currently grants{' '}
              <strong className="text-white">+{(baseLuckLevel - 1) * 10}% Base Luck</strong> on all
              rolls, stacking with charms and potions.
            </p>
          </div>

          <button
            onClick={() => onUpgradeBaseLuck(upgradeCost)}
            disabled={!canAffordUpgrade}
            className={`py-2.5 px-4 rounded-xl text-xs font-bold font-mono transition-all flex items-center gap-2 cursor-pointer ${
              canAffordUpgrade
                ? 'bg-cyan-500 hover:bg-cyan-400 text-slate-950 shadow-md'
                : 'bg-slate-800 text-slate-500 border border-slate-700 cursor-not-allowed'
            }`}
          >
            <Sparkles className="w-3.5 h-3.5" />
            <span>Upgrade ({upgradeCost.toLocaleString()} Shards)</span>
          </button>
        </div>
      </div>

      {/* Potions Grid */}
      <div className="flex flex-col gap-3">
        <h2 className="text-sm font-bold uppercase tracking-wider text-slate-300 flex items-center gap-2">
          <FlaskConical className="w-4 h-4 text-purple-400" />
          <span>Luck Elixirs</span>
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {POTIONS.map((pot) => {
            const canAfford = shards >= pot.cost;

            return (
              <div
                key={pot.id}
                className="p-5 rounded-2xl bg-slate-900 border border-slate-800 flex flex-col justify-between gap-4"
              >
                <div>
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-3xl">{pot.icon}</span>
                    <span className="text-xs font-mono font-bold text-cyan-400">
                      {pot.multiplier}x Luck
                    </span>
                  </div>

                  <h3 className="text-sm font-bold text-white">{pot.name}</h3>
                  <p className="text-xs text-slate-400 mt-1 leading-relaxed">{pot.description}</p>
                </div>

                <div className="pt-3 border-t border-slate-800/80 flex items-center justify-between">
                  <div className="text-xs font-mono text-amber-300 font-bold flex items-center gap-1">
                    <Coins className="w-3.5 h-3.5" />
                    <span>{pot.cost} Shards</span>
                  </div>

                  <button
                    onClick={() => onBuyPotion(pot)}
                    disabled={!canAfford}
                    className={`py-1.5 px-3 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                      canAfford
                        ? 'bg-purple-600 hover:bg-purple-500 text-white shadow-sm'
                        : 'bg-slate-800 text-slate-500 cursor-not-allowed'
                    }`}
                  >
                    Brew & Drink
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Danger Zone: Reset Data */}
      <div className="pt-6 border-t border-slate-800 flex items-center justify-between text-xs text-slate-500">
        <div className="flex items-center gap-2">
          <ShieldAlert className="w-4 h-4 text-slate-600" />
          <span>All data is automatically saved locally in your browser.</span>
        </div>

        <button
          onClick={onResetProgress}
          className="text-slate-600 hover:text-rose-400 transition-colors underline cursor-pointer"
        >
          Reset Save Data
        </button>
      </div>
    </div>
  );
};
