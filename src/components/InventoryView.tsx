import React, { useState, useMemo } from 'react';
import { Search, Sparkles, Filter, ArrowUpDown, Shield, Check, Trash2, Coins, Swords, Zap } from 'lucide-react';
import { InventorySlot, RNGItem, RarityTier } from '../types/rng';
import { RARITY_CONFIGS, formatChance, formatPercent } from '../data/items';
import { getAuraCombatStats, getAuraAbility } from '../data/bosses';
import { AuraIcon } from './AuraIcon';

interface InventoryViewProps {
  inventory: Record<string, InventorySlot>;
  equippedItemId: string | null;
  onEquipItem: (item: RNGItem) => void;
  onUnequipItem: () => void;
  onSalvageItem: (item: RNGItem, count: number) => void;
  onInspectItem: (item: RNGItem) => void;
  selectedItem: RNGItem | null;
  onCloseInspect: () => void;
  shards: number;
  onPlayCutscene?: (item: RNGItem) => void;
}

type SortOption = 'rarity_desc' | 'rarity_asc' | 'count_desc' | 'name_asc' | 'recent';

export const InventoryView: React.FC<InventoryViewProps> = ({
  inventory,
  equippedItemId,
  onEquipItem,
  onUnequipItem,
  onSalvageItem,
  onInspectItem,
  selectedItem,
  onCloseInspect,
  shards,
  onPlayCutscene,
}) => {
  const [search, setSearch] = useState('');
  const [selectedRarity, setSelectedRarity] = useState<RarityTier | 'ALL'>('ALL');
  const [sortBy, setSortBy] = useState<SortOption>('rarity_desc');
  const [salvageAmount, setSalvageAmount] = useState<number>(1);

  // Convert dictionary to list
  const slotsList = useMemo(() => Object.values(inventory), [inventory]);

  // Filter & sort
  const filteredSlots = useMemo(() => {
    return slotsList
      .filter((slot) => {
        if (selectedRarity !== 'ALL' && slot.item.rarity !== selectedRarity) {
          return false;
        }
        if (
          search.trim() &&
          !slot.item.name.toLowerCase().includes(search.toLowerCase().trim()) &&
          !slot.item.rarity.toLowerCase().includes(search.toLowerCase().trim())
        ) {
          return false;
        }
        return true;
      })
      .sort((a, b) => {
        if (sortBy === 'rarity_desc') {
          return (
            RARITY_CONFIGS[b.item.rarity].order - RARITY_CONFIGS[a.item.rarity].order ||
            b.item.baseChance - a.item.baseChance
          );
        }
        if (sortBy === 'rarity_asc') {
          return (
            RARITY_CONFIGS[a.item.rarity].order - RARITY_CONFIGS[b.item.rarity].order ||
            a.item.baseChance - b.item.baseChance
          );
        }
        if (sortBy === 'count_desc') {
          return b.count - a.count;
        }
        if (sortBy === 'name_asc') {
          return a.item.name.localeCompare(b.item.name);
        }
        if (sortBy === 'recent') {
          return b.lastRolledAt - a.lastRolledAt;
        }
        return 0;
      });
  }, [slotsList, selectedRarity, search, sortBy]);

  const totalUnique = slotsList.length;
  const totalItemsCount = slotsList.reduce((acc, curr) => acc + curr.count, 0);

  // Inspector selected slot details
  const activeSlot = selectedItem ? inventory[selectedItem.id] : null;

  return (
    <div className="w-full max-w-7xl mx-auto px-4 sm:px-6 py-6 flex flex-col gap-6">
      {/* Inventory Header and Filter Bar */}
      <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4 pb-4 border-b border-slate-800">
        <div>
          <h1 className="text-xl font-bold tracking-tight text-white flex items-center gap-2">
            <span>Inventory</span>
            <span className="text-xs font-mono text-slate-400 font-normal tabular-nums">
              ({totalUnique} unique / {totalItemsCount} total items)
            </span>
          </h1>
          <p className="text-xs text-slate-400 mt-0.5">
            Equip an item to gain its passive luck bonus, or salvage duplicates for Alchemist shards.
          </p>
        </div>

        {/* Search & Sort Controls */}
        <div className="flex flex-wrap items-center gap-2 w-full md:w-auto">
          {/* Search box */}
          <div className="relative flex-1 sm:w-60">
            <Search className="w-4 h-4 text-slate-500 absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none" />
            <input
              type="text"
              placeholder="Search items..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full bg-slate-900 border border-slate-800 rounded-lg pl-9 pr-3 py-1.5 text-xs text-slate-200 placeholder:text-slate-500 focus:outline-none focus:border-cyan-400"
            />
          </div>

          {/* Sort dropdown */}
          <div className="relative">
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value as SortOption)}
              className="bg-slate-900 border border-slate-800 rounded-lg px-3 py-1.5 text-xs text-slate-300 focus:outline-none focus:border-cyan-400 cursor-pointer"
            >
              <option value="rarity_desc">Rarity: High to Low</option>
              <option value="rarity_asc">Rarity: Low to High</option>
              <option value="count_desc">Quantity: Most</option>
              <option value="recent">Recently Rolled</option>
              <option value="name_asc">Name: A to Z</option>
            </select>
          </div>
        </div>
      </div>

      {/* Rarity Tabs Filter */}
      <div className="flex items-center gap-1.5 overflow-x-auto pb-1 scrollbar-none text-xs">
        <button
          onClick={() => setSelectedRarity('ALL')}
          className={`px-3 py-1.5 rounded-lg font-medium transition-colors cursor-pointer whitespace-nowrap ${
            selectedRarity === 'ALL'
              ? 'bg-white text-slate-900 font-semibold'
              : 'bg-slate-900 text-slate-400 hover:text-slate-200 border border-slate-800'
          }`}
        >
          All ({totalUnique})
        </button>
        {(
          [
            'Common',
            'Uncommon',
            'Rare',
            'Epic',
            'Legendary',
            'Mythic',
            'Celestial',
            'Transcendent',
            'Impossible',
          ] as RarityTier[]
        ).map((tier) => {
          const count = slotsList.filter((s) => s.item.rarity === tier).length;
          const config = RARITY_CONFIGS[tier];
          return (
            <button
              key={tier}
              onClick={() => setSelectedRarity(tier)}
              className={`px-3 py-1.5 rounded-lg font-medium transition-colors cursor-pointer whitespace-nowrap flex items-center gap-1.5 ${
                selectedRarity === tier
                  ? 'bg-slate-800 text-white border border-slate-600'
                  : 'bg-slate-900 text-slate-400 hover:text-slate-200 border border-slate-800/80'
              }`}
            >
              <span className="w-1.5 h-1.5 rounded-full" style={{ backgroundColor: config.color }} />
              <span>{tier}</span>
              <span className="font-mono text-[11px] text-slate-500 tabular-nums">({count})</span>
            </button>
          );
        })}
      </div>

      {/* Main Grid & Inspector Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 items-start">
        {/* Items Grid (Takes 2 cols on lg screens, 3 if no inspector) */}
        <div className={`grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3 ${selectedItem ? 'lg:col-span-2' : 'lg:col-span-3'}`}>
          {filteredSlots.length > 0 ? (
            filteredSlots.map((slot) => {
              const isEquipped = slot.item.id === equippedItemId;
              const isSelected = selectedItem?.id === slot.item.id;
              const config = RARITY_CONFIGS[slot.item.rarity];

              return (
                <button
                  key={slot.item.id}
                  onClick={() => onInspectItem(slot.item)}
                  className={`group relative flex flex-col items-center p-3 rounded-xl border text-left transition-all cursor-pointer ${
                    isSelected
                      ? 'border-cyan-400 bg-slate-800/90 shadow-md ring-1 ring-cyan-400'
                      : isEquipped
                      ? 'border-cyan-500/50 bg-slate-900/90'
                      : 'border-slate-800 bg-slate-900/60 hover:border-slate-700 hover:bg-slate-800/60'
                  }`}
                >
                  {/* Top Badges: Equipped indicator & Count */}
                  <div className="w-full flex items-center justify-between mb-2">
                    {isEquipped ? (
                      <span className="text-[10px] font-mono text-cyan-400 flex items-center gap-0.5">
                        <Check className="w-3 h-3" />
                        <span>EQUIPPED</span>
                      </span>
                    ) : (
                      <span className="text-[10px] uppercase font-mono" style={{ color: config.color }}>
                        {slot.item.rarity}
                      </span>
                    )}

                    <span className="text-xs font-mono font-bold text-slate-300 bg-slate-950 px-1.5 py-0.5 rounded border border-slate-800 tabular-nums">
                      x{slot.count.toLocaleString()}
                    </span>
                  </div>

                  {/* 2D Item Visual Box */}
                  <div
                    className="w-16 h-16 rounded-xl flex items-center justify-center my-1 transition-transform group-hover:scale-105 overflow-hidden"
                    style={{
                      backgroundColor: config.bgColor,
                      border: `1px solid ${config.borderColor}`,
                    }}
                  >
                    {slot.item.imageUrl ? (
                      <img
                        src={slot.item.imageUrl}
                        alt={slot.item.name}
                        className="w-full h-full object-cover rounded-xl"
                      />
                    ) : (
                      <AuraIcon item={slot.item} size="xl" showGlow />
                    )}
                  </div>

                  {/* Name and Drop Rate */}
                  <div className="w-full mt-2 text-center">
                    <p className="text-xs font-semibold text-white truncate w-full">
                      {slot.item.name}
                    </p>
                    <p className="text-[11px] font-mono text-slate-400 tabular-nums">
                      {formatChance(slot.item.baseChance)}
                    </p>
                  </div>

                  {/* Equipped Luck bonus callout */}
                  {slot.item.luckBonus > 0 && (
                    <span className="mt-1 text-[10px] font-mono text-emerald-400">
                      +{slot.item.luckBonus}% Luck
                    </span>
                  )}
                </button>
              );
            })
          ) : (
            <div className="col-span-full py-16 flex flex-col items-center justify-center text-center text-slate-500 border border-dashed border-slate-800 rounded-2xl">
              <span className="text-4xl mb-3">📦</span>
              <p className="text-sm font-medium text-slate-300">No items found</p>
              <p className="text-xs text-slate-500 max-w-sm mt-1">
                {search
                  ? `No items match "${search}". Try clearing your search.`
                  : 'You have not rolled items in this category yet. Head to the Roll Chamber to start collecting!'}
              </p>
            </div>
          )}
        </div>

        {/* Item Inspector Panel */}
        {selectedItem && activeSlot && (
          <div className="lg:col-span-1 bg-slate-900 border border-slate-800 rounded-2xl p-5 sticky top-20 flex flex-col gap-4 shadow-xl">
            <div className="flex items-center justify-between pb-3 border-b border-slate-800">
              <span className="text-xs font-mono uppercase tracking-wider text-slate-400">
                Item Inspector
              </span>
              <button
                onClick={onCloseInspect}
                className="text-xs text-slate-500 hover:text-white transition-colors cursor-pointer"
              >
                Close
              </button>
            </div>

            {/* Visual preview */}
            <div className="flex flex-col items-center text-center">
              <div
                className="w-24 h-24 rounded-2xl flex items-center justify-center mb-3 shadow-lg overflow-hidden"
                style={{
                  backgroundColor: RARITY_CONFIGS[selectedItem.rarity].bgColor,
                  border: `1.5px solid ${RARITY_CONFIGS[selectedItem.rarity].borderColor}`,
                  boxShadow: `0 0 25px ${RARITY_CONFIGS[selectedItem.rarity].glowColor}`,
                }}
              >
                {selectedItem.imageUrl ? (
                  <img
                    src={selectedItem.imageUrl}
                    alt={selectedItem.name}
                    className="w-full h-full object-cover rounded-2xl"
                  />
                ) : (
                  <AuraIcon item={selectedItem} size="2xl" showGlow />
                )}
              </div>

              <div
                className="text-xs uppercase font-semibold tracking-wider"
                style={{ color: RARITY_CONFIGS[selectedItem.rarity].color }}
              >
                {selectedItem.rarity}
              </div>

              <h3 className="text-lg font-bold text-white mt-0.5">{selectedItem.name}</h3>

              <div className="flex items-center gap-2 text-xs font-mono text-slate-400 mt-1 tabular-nums">
                <span>Chance: {formatChance(selectedItem.baseChance)}</span>
                <span>({formatPercent(selectedItem.baseChance)})</span>
              </div>
            </div>

            {/* Description & Lore */}
            <div className="bg-slate-950/60 rounded-xl p-3 border border-slate-800/80 text-xs flex flex-col gap-2">
              <p className="text-slate-300 leading-relaxed">{selectedItem.description}</p>
              <p className="text-slate-500 italic">{selectedItem.flavorText}</p>
            </div>

            {/* Statistics */}
            <div className="grid grid-cols-2 gap-2 text-xs font-mono">
              <div className="bg-slate-950 p-2.5 rounded-lg border border-slate-800">
                <span className="text-slate-500 block text-[10px]">IN INVENTORY</span>
                <span className="text-white font-bold text-sm tabular-nums">
                  {activeSlot.count.toLocaleString()}
                </span>
              </div>

              <div className="bg-slate-950 p-2.5 rounded-lg border border-slate-800">
                <span className="text-slate-500 block text-[10px]">LUCK BONUS</span>
                <span className="text-emerald-400 font-bold text-sm tabular-nums">
                  +{selectedItem.luckBonus}%
                </span>
              </div>

              <div className="bg-slate-950 p-2.5 rounded-lg border border-slate-800">
                <span className="text-slate-500 block text-[10px]">SALVAGE VALUE</span>
                <span className="text-amber-400 font-bold text-sm tabular-nums flex items-center gap-1">
                  <Coins className="w-3 h-3 inline" />
                  {selectedItem.sellValue} ea
                </span>
              </div>

              <div className="bg-slate-950 p-2.5 rounded-lg border border-slate-800">
                <span className="text-slate-500 block text-[10px]">STATUS</span>
                <span className="text-cyan-400 font-bold text-sm">
                  {selectedItem.id === equippedItemId ? 'Equipped' : 'Stored'}
                </span>
              </div>
            </div>

            {/* Boss Arena Combat & Ability Card */}
            {(() => {
              const cStats = getAuraCombatStats(selectedItem);
              const cAb = getAuraAbility(selectedItem);
              return (
                <div className="bg-slate-950 p-3 rounded-xl border border-red-950/70 flex flex-col gap-2">
                  <div className="flex items-center justify-between text-[11px] font-mono font-bold text-red-400">
                    <span className="flex items-center gap-1">
                      <Swords className="w-3.5 h-3.5" />
                      <span>Boss Arena Combat Profile</span>
                    </span>
                    <span>ATK {cStats.attack}</span>
                  </div>
                  <div className="grid grid-cols-3 gap-1 text-[10px] font-mono text-slate-400">
                    <span>HP: <strong className="text-white">{cStats.health}</strong></span>
                    <span>DEF: <strong className="text-white">{cStats.defense}</strong></span>
                    <span>CRIT: <strong className="text-amber-400">{Math.round(cStats.critChance * 100)}%</strong></span>
                  </div>
                  <div className="text-[11px] font-mono text-cyan-300 flex items-center gap-1 mt-1 border-t border-slate-900 pt-1.5">
                    <Zap className="w-3 h-3 text-cyan-400 shrink-0" />
                    <span className="font-bold">{cAb.name}</span>
                  </div>
                  <p className="text-[10px] text-slate-400 leading-tight">
                    {cAb.description}
                  </p>
                </div>
              );
            })()}

            {/* Action Buttons */}
            <div className="flex flex-col gap-2 pt-2 border-t border-slate-800">
              {/* Equip / Unequip Toggle */}
              {selectedItem.id === equippedItemId ? (
                <button
                  onClick={onUnequipItem}
                  className="w-full py-2.5 px-4 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-semibold transition-colors flex items-center justify-center gap-2 cursor-pointer"
                >
                  <Shield className="w-4 h-4 text-slate-400" />
                  <span>Unequip Charm</span>
                </button>
              ) : (
                <button
                  onClick={() => onEquipItem(selectedItem)}
                  className="w-full py-2.5 px-4 rounded-xl bg-cyan-500 hover:bg-cyan-400 text-slate-950 text-xs font-bold transition-colors flex items-center justify-center gap-2 cursor-pointer shadow-md"
                >
                  <Sparkles className="w-4 h-4 text-slate-950" />
                  <span>Equip as Active Charm (+{selectedItem.luckBonus}% Luck)</span>
                </button>
              )}

              {/* Replay Cutscene Button if High Rarity */}
              {onPlayCutscene &&
                (selectedItem.rarity === 'Legendary' ||
                  selectedItem.rarity === 'Mythic' ||
                  selectedItem.rarity === 'Celestial' ||
                  selectedItem.rarity === 'Transcendent') && (
                  <button
                    onClick={() => onPlayCutscene(selectedItem)}
                    className="w-full py-2 px-3 rounded-xl bg-purple-950/40 hover:bg-purple-900/50 border border-purple-700/60 text-purple-300 text-xs font-semibold transition-colors flex items-center justify-center gap-1.5 cursor-pointer"
                  >
                    <span>🎬 Replay Cinematic Cutscene</span>
                  </button>
                )}

              {/* Salvage Controls */}
              {activeSlot.count > 0 && (
                <div className="flex items-center gap-2 mt-1">
                  <button
                    onClick={() => onSalvageItem(selectedItem, 1)}
                    className="flex-1 py-2 px-3 rounded-lg bg-slate-800 hover:bg-rose-950/40 hover:text-rose-300 hover:border-rose-800 border border-slate-700 text-slate-300 text-xs font-medium transition-colors flex items-center justify-center gap-1.5 cursor-pointer"
                    title={`Salvage 1 for ${selectedItem.sellValue} shards`}
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                    <span>Salvage 1 (+{selectedItem.sellValue} Shards)</span>
                  </button>

                  {activeSlot.count > 1 && (
                    <button
                      onClick={() => onSalvageItem(selectedItem, activeSlot.count - 1)}
                      className="py-2 px-3 rounded-lg bg-slate-800 hover:bg-rose-950/40 hover:text-rose-300 hover:border-rose-800 border border-slate-700 text-slate-300 text-xs font-medium transition-colors cursor-pointer"
                      title={`Salvage all except 1 duplicate (+${(activeSlot.count - 1) * selectedItem.sellValue} shards)`}
                    >
                      Keep 1
                    </button>
                  )}
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
