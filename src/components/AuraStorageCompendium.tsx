import React, { useState, useMemo } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { X, Search, Lock, Unlock, ArrowUpDown, Sparkles, Filter, ShieldCheck } from 'lucide-react';
import { RNGItem, InventorySlot } from '../types/rng';
import { RARITY_CONFIGS, formatChance } from '../data/items';
import { sound } from '../utils/audio';
import { AuraIcon } from './AuraIcon';

interface AuraStorageCompendiumProps {
  isOpen?: boolean;
  onClose?: () => void;
  inventory: Record<string, InventorySlot>;
  equippedItemId: string | null;
  onEquipItem: (item: RNGItem) => void;
  onUnequipItem: () => void;
  onSalvageItem?: (item: RNGItem, count: number) => void;
  shards: number;
  totalRolls: number;
  luckMultiplier: number;
  isModal?: boolean;
}

export const AuraStorageCompendium: React.FC<AuraStorageCompendiumProps> = ({
  isOpen = true,
  onClose,
  inventory,
  equippedItemId,
  onEquipItem,
  onUnequipItem,
  onSalvageItem,
  shards,
  totalRolls,
  luckMultiplier,
  isModal = false,
}) => {
  const [activeTab, setActiveTab] = useState<'regular' | 'equipped' | 'locked'>('regular');
  const [search, setSearch] = useState('');
  const [sortByRarity, setSortByRarity] = useState<boolean>(true);
  const [selectedRarityFilter, setSelectedRarityFilter] = useState<string>('all');

  const [lockedAuraIds, setLockedAuraIds] = useState<string[]>(() => {
    try {
      const saved = localStorage.getItem('coolrng_locked_auras');
      return saved ? JSON.parse(saved) : [];
    } catch {
      return [];
    }
  });

  const slotsList = useMemo(() => Object.values(inventory), [inventory]);
  const totalAurasCount = slotsList.reduce((acc, curr) => acc + curr.count, 0);

  // Selected item inside storage
  const [selectedItemId, setSelectedItemId] = useState<string>(() => {
    return equippedItemId || (slotsList[0] ? slotsList[0].item.id : 'pebble');
  });

  const selectedSlot = inventory[selectedItemId] || slotsList[0];
  const selectedItem = selectedSlot ? selectedSlot.item : null;

  const isCurrentEquipped = !!(selectedItem && equippedItemId === selectedItem.id);
  const isCurrentLocked = !!(selectedItem && lockedAuraIds.includes(selectedItem.id));

  const toggleLock = (itemId: string) => {
    setLockedAuraIds((prev) => {
      const updated = prev.includes(itemId)
        ? prev.filter((id) => id !== itemId)
        : [...prev, itemId];
      try {
        localStorage.setItem('coolrng_locked_auras', JSON.stringify(updated));
      } catch {}
      return updated;
    });
    sound.playTick();
  };

  const filteredSlots = useMemo(() => {
    return slotsList
      .filter((slot) => {
        // Tab filtering
        if (activeTab === 'equipped' && slot.item.id !== equippedItemId) return false;
        if (activeTab === 'locked' && !lockedAuraIds.includes(slot.item.id)) return false;

        // Rarity filter
        if (selectedRarityFilter !== 'all' && slot.item.rarity.toLowerCase() !== selectedRarityFilter.toLowerCase()) {
          return false;
        }

        // Search query
        if (!search.trim()) return true;
        const q = search.toLowerCase();
        return (
          slot.item.name.toLowerCase().includes(q) ||
          slot.item.rarity.toLowerCase().includes(q)
        );
      })
      .sort((a, b) => {
        if (sortByRarity) {
          return (
            RARITY_CONFIGS[b.item.rarity].order - RARITY_CONFIGS[a.item.rarity].order ||
            b.item.baseChance - a.item.baseChance
          );
        }
        return a.item.name.localeCompare(b.item.name);
      });
  }, [slotsList, search, sortByRarity, activeTab, equippedItemId, lockedAuraIds, selectedRarityFilter]);

  if (isModal && !isOpen) return null;

  const content = (
    <div className="relative w-full max-w-6xl bg-[#090b10] border-2 border-[#1c2432] rounded-2xl shadow-2xl overflow-hidden flex flex-col min-h-[640px] max-h-[85vh] select-none font-mono">
      {/* Top Header Bar */}
      <div className="flex flex-wrap items-center justify-between px-4 py-3 bg-[#111620] border-b border-[#1c2432] gap-3">
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-2">
            <span className="w-3 h-3 rounded-sm bg-cyan-400 shadow-[0_0_8px_#22d3ee]" />
            <h2 className="text-base sm:text-lg font-black text-white tracking-widest uppercase">
              Aura Vault
            </h2>
          </div>

          {/* Storage Tabs */}
          <div className="flex items-center gap-1 text-xs">
            <button
              onClick={() => setActiveTab('regular')}
              className={`px-3 py-1.5 rounded transition-all cursor-pointer font-bold ${
                activeTab === 'regular'
                  ? 'bg-[#1e2738] text-white border border-cyan-500/40'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              All Auras [{slotsList.length}]
            </button>

            <button
              onClick={() => setActiveTab('equipped')}
              className={`px-3 py-1.5 rounded transition-all cursor-pointer font-bold ${
                activeTab === 'equipped'
                  ? 'bg-[#1e2738] text-emerald-300 border border-emerald-500/40'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              Equipped [{equippedItemId ? 1 : 0}]
            </button>

            <button
              onClick={() => setActiveTab('locked')}
              className={`px-3 py-1.5 rounded transition-all cursor-pointer font-bold ${
                activeTab === 'locked'
                  ? 'bg-[#1e2738] text-amber-300 border border-amber-500/40'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              Locked [{lockedAuraIds.length}]
            </button>
          </div>
        </div>

        {/* Right side stats */}
        <div className="flex items-center gap-3 text-xs">
          <div className="hidden sm:flex items-center gap-2 bg-[#090b10] px-3 py-1 rounded border border-[#1c2432] text-slate-300">
            <span className="text-slate-500">Stored:</span>
            <span className="text-cyan-300 font-bold">{totalAurasCount.toLocaleString()} total</span>
          </div>

          {onClose && (
            <button
              onClick={onClose}
              className="w-8 h-8 rounded bg-[#161c27] hover:bg-[#20293a] flex items-center justify-center text-slate-300 hover:text-white transition-colors cursor-pointer border border-[#20293a]"
            >
              <X className="w-4 h-4" />
            </button>
          )}
        </div>
      </div>

      {/* Storage Body: Two Column Roblox-RNG Layout */}
      <div className="flex-1 grid grid-cols-1 lg:grid-cols-12 overflow-hidden">
        {/* LEFT PANEL: Aura Inspector & Actions */}
        <div className="lg:col-span-4 p-4 border-r border-[#1c2432] flex flex-col justify-between bg-[#0c1017] overflow-y-auto">
          {selectedItem ? (
            <div className="flex flex-col gap-3">
              {/* Spaced Aura Title */}
              <div 
                className="flex flex-col items-center text-center p-4 rounded-xl border relative overflow-hidden"
                style={{
                  backgroundColor: `${RARITY_CONFIGS[selectedItem.rarity].color}10`,
                  borderColor: `${RARITY_CONFIGS[selectedItem.rarity].color}40`,
                }}
              >
                {/* Glow backdrop */}
                <div 
                  className="absolute inset-0 opacity-15 blur-xl pointer-events-none"
                  style={{ backgroundColor: RARITY_CONFIGS[selectedItem.rarity].color }}
                />

                <span
                  className="text-lg sm:text-xl font-black tracking-[0.25em] relative z-10"
                  style={{ color: RARITY_CONFIGS[selectedItem.rarity].color }}
                >
                  [ {selectedItem.name.toUpperCase().split('').join(' ')} ]
                </span>

                <span className="text-xs text-slate-400 mt-1 relative z-10 font-bold">
                  [ {formatChance(selectedItem.baseChance)} ]
                </span>
              </div>

              {/* Large Aura Emblem / Image Preview */}
              <div 
                className="w-full h-36 rounded-none flex items-center justify-center relative overflow-hidden border-2"
                style={{
                  backgroundColor: '#07090e',
                  borderColor: RARITY_CONFIGS[selectedItem.rarity].borderColor,
                }}
              >
                {selectedItem.imageUrl ? (
                  <img src={selectedItem.imageUrl} alt={selectedItem.name} className="w-full h-full object-cover" />
                ) : (
                  <AuraIcon item={selectedItem} size="2xl" showGlow />
                )}

                {isCurrentEquipped && (
                  <div className="absolute top-2 right-2 px-2 py-0.5 rounded-none bg-emerald-500 text-slate-950 font-bold text-[10px] uppercase tracking-wider">
                    EQUIPPED
                  </div>
                )}
              </div>

              {/* [ Information ] Box */}
              <div className="p-3 rounded-none bg-[#07090e] border border-[#1c2432] flex flex-col gap-2 text-xs">
                <span className="text-slate-400 font-bold text-[11px] uppercase tracking-widest border-b border-[#1c2432] pb-1">
                  [ Information ]
                </span>

                <div className="flex items-center justify-between text-slate-300">
                  <span className="text-slate-500">Rarity Tier:</span>
                  <span style={{ color: RARITY_CONFIGS[selectedItem.rarity].color }} className="font-bold">
                    {selectedItem.rarity}
                  </span>
                </div>

                <div className="flex items-center justify-between text-slate-300">
                  <span className="text-slate-500">Odds:</span>
                  <span className="font-bold text-white">1 in {selectedItem.baseChance.toLocaleString()}</span>
                </div>

                {selectedItem.isBiomeExclusive && (
                  <div className="p-2 rounded bg-amber-950/40 border border-amber-500/60 text-[10px] text-amber-300 font-bold flex items-center justify-between">
                    <span>🌧️ BIOME EXCLUSIVE:</span>
                    <span className="text-white uppercase">{selectedItem.exclusiveBiomeName}</span>
                  </div>
                )}

                <div className="flex items-center justify-between text-slate-300">
                  <span className="text-slate-500">Base Luck Boost:</span>
                  <span className="text-emerald-400 font-bold">+{selectedItem.luckBonus}%</span>
                </div>

                <div className="flex items-center justify-between text-slate-300">
                  <span className="text-slate-500">In Inventory:</span>
                  <span className="font-bold text-cyan-300">x{selectedSlot?.count || 1}</span>
                </div>

                <div className="flex items-center justify-between text-slate-300">
                  <span className="text-slate-500">Sell Value:</span>
                  <span className="text-amber-300 font-bold">💎 {selectedItem.sellValue.toLocaleString()}</span>
                </div>
              </div>

              {/* Lore / Quote */}
              <p className="text-xs text-slate-400 italic px-1 leading-relaxed bg-[#07090e]/60 p-2.5 rounded-lg border border-[#161d28]">
                {selectedItem.flavorText || selectedItem.description}
              </p>
            </div>
          ) : (
            <div className="flex items-center justify-center h-48 text-slate-500 text-xs">
              Select an aura from the vault to inspect
            </div>
          )}

          {/* Action Buttons (Equip, Remove, Lock) */}
          {selectedItem && (
            <div className="flex flex-col gap-2 pt-3 border-t border-[#1c2432] mt-3">
              {/* Equip Button */}
              <button
                onClick={() => {
                  onEquipItem(selectedItem);
                  sound.playEquip();
                }}
                disabled={isCurrentEquipped}
                className={`w-full py-2.5 rounded-lg font-bold text-xs uppercase tracking-widest transition-all cursor-pointer border ${
                  isCurrentEquipped
                    ? 'bg-emerald-950/40 text-emerald-400 border-emerald-600/60 cursor-default'
                    : 'bg-[#153422] hover:bg-[#1c472f] text-emerald-300 border-emerald-500/70 shadow-lg'
                }`}
              >
                {isCurrentEquipped ? '✓ EQUIPPED' : '[ EQUIP AURA ]'}
              </button>

              {/* Remove / Unequip Button */}
              <button
                onClick={() => {
                  if (isCurrentEquipped) {
                    onUnequipItem();
                    sound.playTick();
                  }
                }}
                disabled={!isCurrentEquipped}
                className={`w-full py-2 rounded-lg font-bold text-xs uppercase tracking-widest transition-all border ${
                  isCurrentEquipped
                    ? 'bg-red-950/40 hover:bg-red-900/60 text-red-300 border-red-700/60 cursor-pointer'
                    : 'bg-[#10141d] text-slate-600 border-[#1c2432] cursor-not-allowed'
                }`}
              >
                [ REMOVE / UNEQUIP ]
              </button>

              {/* Lock / Unlock Toggle */}
              <button
                onClick={() => toggleLock(selectedItem.id)}
                className={`w-full py-2 rounded-lg font-bold text-xs uppercase tracking-widest transition-all border flex items-center justify-center gap-1.5 cursor-pointer ${
                  isCurrentLocked
                    ? 'bg-amber-950/40 hover:bg-amber-900/50 text-amber-300 border-amber-600/60'
                    : 'bg-[#121722] hover:bg-[#1a2130] text-slate-300 border-[#1c2432]'
                }`}
              >
                {isCurrentLocked ? <Lock className="w-3.5 h-3.5 text-amber-400" /> : <Unlock className="w-3.5 h-3.5 text-slate-400" />}
                <span>{isCurrentLocked ? 'LOCKED (PROTECTED)' : 'LOCK AURA'}</span>
              </button>

              {/* Sell / Salvage Button */}
              <button
                onClick={() => {
                  if (onSalvageItem && selectedItem && !isCurrentLocked) {
                    onSalvageItem(selectedItem, 1);
                    sound.playCoin();
                  }
                }}
                disabled={isCurrentLocked || !onSalvageItem}
                className={`w-full py-2.5 rounded-lg font-bold text-xs uppercase tracking-widest transition-all border flex items-center justify-center gap-1.5 ${
                  isCurrentLocked
                    ? 'bg-[#121620] text-slate-600 border-[#1c2432] cursor-not-allowed'
                    : 'bg-[#2d220b] hover:bg-[#3d2b0e] text-amber-300 border-amber-500/80 shadow-lg cursor-pointer'
                }`}
              >
                <span>{isCurrentLocked ? '[ CANNOT SELL LOCKED ]' : `[ SELL / SALVAGE (+💎 ${selectedItem.sellValue.toLocaleString()}) ]`}</span>
              </button>
            </div>
          )}
        </div>

        {/* RIGHT PANEL: Search, Filters, and Aura Tiles Grid */}
        <div className="lg:col-span-8 p-4 flex flex-col justify-between bg-[#080a0f] overflow-hidden">
          {/* Top Controls: Search Bar & Sort Dropdowns */}
          <div className="flex flex-wrap items-center justify-between gap-2.5 pb-3 border-b border-[#1c2432]">
            {/* Search Bar */}
            <div className="relative flex-1 min-w-[200px]">
              <Search className="w-3.5 h-3.5 text-slate-500 absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none" />
              <input
                type="text"
                placeholder="Search auras or rarities..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="w-full bg-[#0d1117] border border-[#1c2432] rounded-lg pl-9 pr-3 py-1.5 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-cyan-500 transition-colors"
              />
            </div>

            {/* Rarity Filter Selector */}
            <div className="flex items-center gap-1">
              <select
                value={selectedRarityFilter}
                onChange={(e) => setSelectedRarityFilter(e.target.value)}
                className="bg-[#0d1117] border border-[#1c2432] text-xs text-slate-300 rounded-lg px-2.5 py-1.5 focus:outline-none focus:border-cyan-500"
              >
                <option value="all">All Rarities</option>
                <option value="Common">Common</option>
                <option value="Uncommon">Uncommon</option>
                <option value="Rare">Rare</option>
                <option value="Epic">Epic</option>
                <option value="Legendary">Legendary</option>
                <option value="Mythic">Mythic</option>
                <option value="Celestial">Celestial</option>
                <option value="Transcendent">Transcendent</option>
                <option value="Impossible">Impossible</option>
              </select>

              {/* Sort Toggle */}
              <button
                onClick={() => setSortByRarity((prev) => !prev)}
                className="py-1.5 px-3 rounded-lg bg-[#0d1117] hover:bg-[#141b24] border border-[#1c2432] text-xs text-slate-300 transition-colors cursor-pointer flex items-center gap-1.5"
                title="Toggle Rarity / Alphabetical sort"
              >
                <ArrowUpDown className="w-3 h-3 text-cyan-400" />
                <span>{sortByRarity ? 'Rarity' : 'A-Z'}</span>
              </button>
            </div>
          </div>

          {/* Slot Grid: 4 to 6 columns of dark square aura tiles */}
          <div className="flex-1 overflow-y-auto pr-1 py-3">
            <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-5 xl:grid-cols-6 gap-2.5">
              {filteredSlots.map((slot) => {
                const item = slot.item;
                const isSelected = selectedItemId === item.id;
                const isEquipped = equippedItemId === item.id;
                const isLocked = lockedAuraIds.includes(item.id);
                const config = RARITY_CONFIGS[item.rarity];

                return (
                  <motion.div
                    key={item.id}
                    onClick={() => {
                      setSelectedItemId(item.id);
                      sound.playTick();
                    }}
                    whileHover={{ scale: 1.03 }}
                    whileTap={{ scale: 0.97 }}
                    className={`relative aspect-square rounded-xl p-2 flex flex-col items-center justify-between cursor-pointer transition-all border-2 ${
                      isSelected
                        ? 'bg-[#151c27] ring-2 ring-cyan-400'
                        : 'bg-[#0d1117] hover:bg-[#121720]'
                    }`}
                    style={{
                      borderColor: isSelected ? '#22d3ee' : config.borderColor,
                      boxShadow: isSelected ? `0 0 15px ${config.glowColor}` : 'none',
                    }}
                  >
                    {/* Top indicators: Count & Lock */}
                    <div className="w-full flex items-center justify-between text-[10px] pointer-events-none z-10">
                      {isLocked ? (
                        <Lock className="w-3 h-3 text-amber-400" />
                      ) : (
                        <span />
                      )}

                      {slot.count > 1 && (
                        <span className="font-bold text-slate-300 bg-black/70 px-1 rounded">
                          x{slot.count}
                        </span>
                      )}
                    </div>

                    {/* Aura Icon in Center */}
                    <div className="relative flex items-center justify-center my-auto">
                      {item.imageUrl ? (
                        <img
                          src={item.imageUrl}
                          alt={item.name}
                          className="w-10 h-10 object-cover rounded-lg"
                        />
                      ) : (
                        <AuraIcon item={item} size="md" showGlow />
                      )}
                    </div>

                    {/* Aura Name text inside tile */}
                    <div className="w-full text-center truncate z-10">
                      <span
                        className="text-[10px] font-bold block truncate"
                        style={{ color: config.color }}
                      >
                        {item.name}
                      </span>
                    </div>

                    {/* Equipped Corner Badge */}
                    {isEquipped && (
                      <div className="absolute -top-1.5 -right-1 px-1.5 py-0.2 rounded-full bg-emerald-500 text-[8px] font-bold text-slate-950">
                        EQUIPPED
                      </div>
                    )}
                  </motion.div>
                );
              })}

              {/* Empty visual slots padding to fill out the grid */}
              {Array.from({ length: Math.max(0, 18 - filteredSlots.length) }).map((_, i) => (
                <div
                  key={`empty-${i}`}
                  className="aspect-square rounded-xl bg-[#0a0d14]/40 border border-[#161c26] flex items-center justify-center text-slate-800 pointer-events-none"
                >
                  <span className="text-xs font-mono opacity-20">EMPTY</span>
                </div>
              ))}
            </div>

            {filteredSlots.length === 0 && (
              <div className="w-full py-16 flex flex-col items-center justify-center text-slate-500 text-xs">
                <Filter className="w-8 h-8 mb-2 opacity-40" />
                <span>No auras found matching this filter</span>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );

  if (isModal) {
    return (
      <div className="fixed inset-0 z-50 flex items-center justify-center p-2 sm:p-4 bg-black/80 backdrop-blur-sm select-none">
        {content}
      </div>
    );
  }

  return (
    <div className="w-full max-w-7xl mx-auto px-2 sm:px-6 py-4 flex flex-col items-center">
      {content}
    </div>
  );
};
