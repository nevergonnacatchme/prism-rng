import React, { useState } from 'react';
import { Sparkles, Trophy, Lock, Crown } from 'lucide-react';
import { ITEMS, RARITY_CONFIGS, formatChance, formatPercent } from '../data/items';
import { InventorySlot, RNGItem, RarityTier } from '../types/rng';
import { AuraIcon } from './AuraIcon';

interface CollectionIndexProps {
  inventory: Record<string, InventorySlot>;
  onInspectItem: (item: RNGItem) => void;
}

export const CollectionIndex: React.FC<CollectionIndexProps> = ({ inventory, onInspectItem }) => {
  const [filterTier, setFilterTier] = useState<RarityTier | 'ALL'>('ALL');
  const totalItems = ITEMS.length;
  const discoveredCount = Object.keys(inventory).length;
  const progressPct = Math.round((discoveredCount / totalItems) * 100);

  const tiers: RarityTier[] = [
    'Impossible',
    'Transcendent',
    'Celestial',
    'Mythic',
    'Legendary',
    'Epic',
    'Rare',
    'Uncommon',
    'Common',
  ];

  const filteredTiers = filterTier === 'ALL' ? tiers : [filterTier];

  return (
    <div className="w-full max-w-7xl mx-auto px-4 sm:px-6 py-6 flex flex-col gap-6 select-none">
      {/* Header and Progress Bar */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 pb-4 border-b border-slate-800">
        <div>
          <div className="flex items-center gap-2">
            <Trophy className="w-5 h-5 text-amber-400" />
            <h1 className="text-xl font-bold tracking-tight text-white font-mono uppercase">
              Collection Codex
            </h1>
            <span className="text-[11px] font-mono px-2 py-0.5 rounded-full bg-red-950 text-red-300 border border-red-800">
              Includes IMPOSSIBLE 1/10M
            </span>
          </div>
          <p className="text-xs text-slate-400 mt-0.5">
            Discover all {totalItems} auras across the cosmos from Common to the Mythical & Impossible tier.
          </p>
        </div>

        {/* Discovery Progress Meter */}
        <div className="flex flex-col items-end gap-1.5 w-full sm:w-64">
          <div className="flex items-center justify-between w-full text-xs font-mono">
            <span className="text-slate-400">Total Codex Completion:</span>
            <span className="text-cyan-400 font-bold tabular-nums">
              {discoveredCount} / {totalItems} ({progressPct}%)
            </span>
          </div>

          <div className="w-full h-2 rounded-full bg-slate-900 border border-slate-800 overflow-hidden">
            <div
              className="h-full bg-gradient-to-r from-cyan-500 via-purple-500 to-red-500 transition-all duration-500"
              style={{ width: `${progressPct}%` }}
            />
          </div>
        </div>
      </div>

      {/* Rarity Quick Filter Pills */}
      <div className="flex items-center gap-1.5 overflow-x-auto pb-1 scrollbar-none text-xs font-mono">
        <button
          onClick={() => setFilterTier('ALL')}
          className={`py-1.5 px-3 rounded-xl transition-all cursor-pointer whitespace-nowrap font-bold ${
            filterTier === 'ALL'
              ? 'bg-white text-slate-950 shadow'
              : 'bg-slate-900 text-slate-400 hover:text-white border border-slate-800'
          }`}
        >
          All ({totalItems})
        </button>

        {tiers.map((t) => {
          const cfg = RARITY_CONFIGS[t];
          const isSelected = filterTier === t;
          const isImpossible = t === 'Impossible';

          return (
            <button
              key={t}
              onClick={() => setFilterTier(t)}
              className={`py-1.5 px-3 rounded-xl transition-all cursor-pointer whitespace-nowrap flex items-center gap-1.5 font-bold border ${
                isSelected
                  ? isImpossible
                    ? 'bg-red-600 text-white border-red-400 shadow-lg shadow-red-500/30'
                    : 'bg-slate-800 text-white border-slate-600'
                  : isImpossible
                  ? 'bg-red-950/40 text-red-300 border-red-900/60 hover:border-red-700'
                  : 'bg-slate-900 text-slate-400 hover:text-white border-slate-800'
              }`}
            >
              {isImpossible && <Crown className="w-3.5 h-3.5 text-amber-400 animate-pulse" />}
              <span className="w-2 h-2 rounded-full" style={{ backgroundColor: cfg.color }} />
              <span>{t}</span>
            </button>
          );
        })}
      </div>

      {/* Tier Sections */}
      <div className="flex flex-col gap-8">
        {filteredTiers.map((tier) => {
          const tierItems = ITEMS.filter((item) => item.rarity === tier);
          const config = RARITY_CONFIGS[tier];
          const tierDiscovered = tierItems.filter((item) => !!inventory[item.id]).length;
          const isImpossible = tier === 'Impossible';

          return (
            <div
              key={tier}
              className={`flex flex-col gap-3 p-4 sm:p-5 rounded-3xl border transition-all ${
                isImpossible
                  ? 'bg-red-950/20 border-red-500/40 shadow-2xl shadow-red-950/50'
                  : 'bg-slate-950/40 border-slate-800/80'
              }`}
            >
              {/* Tier Header */}
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2.5">
                  {isImpossible && <Crown className="w-5 h-5 text-red-400 animate-pulse" />}
                  <span
                    className="w-3 h-3 rounded-full"
                    style={{ backgroundColor: config.color, boxShadow: `0 0 10px ${config.color}` }}
                  />
                  <h2 className="text-sm sm:text-base font-extrabold uppercase tracking-wider text-white font-mono">
                    {tier} Auras
                  </h2>
                  {isImpossible && (
                    <span className="text-[10px] font-mono font-bold bg-amber-400 text-slate-950 px-2 py-0.5 rounded-full">
                      APEX RARITY
                    </span>
                  )}
                </div>

                <span className="text-xs font-mono text-slate-400 tabular-nums">
                  {tierDiscovered} / {tierItems.length} Discovered
                </span>
              </div>

              {/* Grid of Tier Items */}
              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-3">
                {tierItems.map((item) => {
                  const slot = inventory[item.id];
                  const isDiscovered = !!slot;

                  if (isDiscovered) {
                    return (
                      <button
                        key={item.id}
                        onClick={() => onInspectItem(item)}
                        className={`group flex flex-col items-center p-3 rounded-2xl border transition-all cursor-pointer text-left ${
                          isImpossible
                            ? 'bg-red-950/40 border-red-500/60 hover:border-red-400 shadow-xl'
                            : 'bg-slate-900 border-slate-800 hover:border-slate-700 hover:bg-slate-800/80'
                        }`}
                      >
                        <div
                          className="w-16 h-16 rounded-2xl flex items-center justify-center my-1 transition-transform group-hover:scale-105 overflow-hidden shadow-lg"
                          style={{
                            backgroundColor: config.bgColor,
                            border: `1.5px solid ${config.borderColor}`,
                            boxShadow: `0 0 20px ${config.glowColor}`,
                          }}
                        >
                          {item.imageUrl ? (
                            <img
                              src={item.imageUrl}
                              alt={item.name}
                              className="w-full h-full object-cover rounded-2xl"
                            />
                          ) : (
                            <AuraIcon item={item} size="xl" showGlow />
                          )}
                        </div>

                        <p className="text-xs font-bold text-white truncate w-full text-center mt-2 font-mono">
                          {item.name}
                        </p>

                        <div className="flex items-center gap-1 text-[11px] font-mono text-slate-400 tabular-nums mt-0.5">
                          <span>{formatChance(item.baseChance)}</span>
                        </div>

                        <span className="text-[10px] font-mono text-slate-400 mt-1">
                          Owned: <strong className="text-cyan-300 font-bold">{slot.count}</strong>
                        </span>
                      </button>
                    );
                  }

                  // Undiscovered Silhouette Card
                  return (
                    <div
                      key={item.id}
                      className={`flex flex-col items-center p-3 rounded-2xl border select-none opacity-50 ${
                        isImpossible
                          ? 'bg-red-950/10 border-red-900/30'
                          : 'bg-slate-950/60 border-slate-900'
                      }`}
                    >
                      <div className="w-16 h-16 rounded-2xl flex items-center justify-center my-1 bg-slate-900/80 border border-slate-800/60 text-slate-600">
                        <Lock className="w-5 h-5" />
                      </div>

                      <p className="text-xs font-mono font-medium text-slate-500 truncate w-full text-center mt-2">
                        ???
                      </p>

                      <p className="text-[11px] font-mono text-slate-600 tabular-nums mt-0.5">
                        {formatChance(item.baseChance)}
                      </p>

                      <span className="text-[10px] font-mono text-slate-600 mt-1">Undiscovered</span>
                    </div>
                  );
                })}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
