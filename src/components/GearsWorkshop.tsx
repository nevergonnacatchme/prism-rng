import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  Hammer, Shield, Sparkles, Check, Lock, ChevronRight, Zap, 
  Flame, Award, AlertCircle, ArrowUpRight 
} from 'lucide-react';
import { GearItem, InventorySlot } from '../types/rng';
import { GEAR_ITEMS } from '../data/gears';
import { sound } from '../utils/audio';

interface GearsWorkshopProps {
  inventory: Record<string, InventorySlot>;
  equippedGearId: string | null;
  craftedGearIds: string[];
  onCraftGear: (gear: GearItem) => boolean;
  onEquipGear: (gearId: string) => void;
  onUnequipGear: () => void;
}

export const GearsWorkshop: React.FC<GearsWorkshopProps> = ({
  inventory,
  equippedGearId,
  craftedGearIds,
  onCraftGear,
  onEquipGear,
  onUnequipGear,
}) => {
  const [viewMode, setViewMode] = useState<'station' | 'recipes'>('station');
  const [selectedGearId, setSelectedGearId] = useState<string>(GEAR_ITEMS[0].id);
  const [isCrafting, setIsCrafting] = useState<boolean>(false);
  const [craftSuccess, setCraftSuccess] = useState<boolean>(false);

  const discoveredAurasCount = Object.keys(inventory).length;
  const selectedGear = GEAR_ITEMS.find((g) => g.id === selectedGearId) || GEAR_ITEMS[0];

  const isBlueprintUnlocked = discoveredAurasCount >= selectedGear.requiredDiscoveredAuras;
  const isAlreadyCrafted = craftedGearIds.includes(selectedGear.id);
  const isCurrentlyEquipped = equippedGearId === selectedGear.id;

  // Check if player has all ingredients
  const hasAllIngredients = selectedGear.recipe.every((ing) => {
    const slot = inventory[ing.itemId];
    return slot && slot.count >= ing.count;
  });

  const handleCraft = (gearToCraft = selectedGear) => {
    const isUnlocked = discoveredAurasCount >= gearToCraft.requiredDiscoveredAuras;
    const isCrafted = craftedGearIds.includes(gearToCraft.id);
    const hasIngs = gearToCraft.recipe.every((ing) => {
      const slot = inventory[ing.itemId];
      return slot && slot.count >= ing.count;
    });

    if (!isUnlocked || isCrafted || !hasIngs || isCrafting) return;

    setIsCrafting(true);
    sound.playCrit();

    setTimeout(() => {
      const ok = onCraftGear(gearToCraft);
      setIsCrafting(false);
      if (ok) {
        sound.playVictory();
        setCraftSuccess(true);
        setTimeout(() => setCraftSuccess(false), 2500);
      }
    }, 800);
  };

  return (
    <div className="w-full max-w-7xl mx-auto px-3 sm:px-6 py-4 flex flex-col gap-5 select-none">
      {/* Workshop Header & Sub-Navigation */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 pb-4 border-b border-slate-800">
        <div>
          <div className="flex items-center gap-2">
            <Hammer className="w-6 h-6 text-amber-400" />
            <h1 className="text-xl font-bold tracking-tight text-white font-mono uppercase">
              Jake's Gear Workshop
            </h1>
            <span className="text-[11px] font-mono px-2 py-0.5 rounded-full bg-amber-950 text-amber-300 border border-amber-800 font-bold">
              Gauntlet & Gear Forge
            </span>
          </div>
          <p className="text-xs text-slate-400 mt-0.5">
            Discover auras to unlock glove blueprints. Sacrifice duplicate auras to forge gloves that multiply your base luck!
          </p>
        </div>

        {/* View Switcher Tabs & Progress */}
        <div className="flex items-center gap-3">
          <div className="flex items-center bg-slate-900 border border-slate-800 rounded-xl p-1 text-xs font-mono">
            <button
              onClick={() => setViewMode('station')}
              className={`py-1.5 px-3 rounded-lg font-bold transition-all cursor-pointer flex items-center gap-1.5 ${
                viewMode === 'station'
                  ? 'bg-amber-500 text-slate-950 shadow'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              <Hammer className="w-3.5 h-3.5" />
              <span>Forge Station</span>
            </button>
            <button
              onClick={() => setViewMode('recipes')}
              className={`py-1.5 px-3 rounded-lg font-bold transition-all cursor-pointer flex items-center gap-1.5 ${
                viewMode === 'recipes'
                  ? 'bg-amber-500 text-slate-950 shadow'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              <Sparkles className="w-3.5 h-3.5" />
              <span>All Gears & Recipes ({GEAR_ITEMS.length})</span>
            </button>
          </div>

          <div className="hidden sm:flex items-center gap-2 bg-slate-900 px-3 py-1.5 rounded-xl border border-slate-800 text-xs font-mono">
            <span className="text-slate-400">Discovered:</span>
            <span className="font-bold text-cyan-300">{discoveredAurasCount} Auras</span>
          </div>
        </div>
      </div>

      {/* VIEW MODE 1: ALL GEARS & RECIPES COMPENDIUM */}
      {viewMode === 'recipes' && (
        <div className="flex flex-col gap-4">
          <div className="bg-slate-900/60 p-4 rounded-2xl border border-slate-800 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 text-xs font-mono">
            <div>
              <span className="text-white font-bold text-sm block">Gloves & Crafting Recipes Compendium</span>
              <span className="text-slate-400 text-xs">
                Inspect every glove in the game, view required auras, and check your craft readiness.
              </span>
            </div>
            <span className="text-amber-400 font-bold bg-amber-950/60 px-3 py-1 rounded-lg border border-amber-800/80">
              ⚡ All Gears Boost Base Luck
            </span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {GEAR_ITEMS.map((gear) => {
              const isUnlocked = discoveredAurasCount >= gear.requiredDiscoveredAuras;
              const isCrafted = craftedGearIds.includes(gear.id);
              const isEquipped = equippedGearId === gear.id;
              const hasAllIngs = gear.recipe.every((ing) => {
                const count = inventory[ing.itemId]?.count || 0;
                return count >= ing.count;
              });

              return (
                <div
                  key={gear.id}
                  className="bg-slate-900/85 border border-slate-800 rounded-2xl p-4 flex flex-col justify-between gap-3 shadow-lg hover:border-slate-700 transition-all font-mono"
                >
                  {/* Top Gear Header */}
                  <div className="flex items-start justify-between gap-2">
                    <div className="flex items-center gap-3">
                      <div
                        className="w-12 h-12 rounded-xl flex items-center justify-center text-3xl border shadow-md shrink-0"
                        style={{
                          backgroundColor: `${gear.color}20`,
                          borderColor: gear.color,
                        }}
                      >
                        {gear.icon}
                      </div>

                      <div className="flex flex-col">
                        <div className="flex items-center gap-1.5">
                          <span className="font-bold text-white text-sm">{gear.name}</span>
                          <span className="text-[10px] px-1.5 py-0.2 rounded bg-slate-950 text-slate-400 border border-slate-800">
                            T{gear.tier}
                          </span>
                        </div>
                        <span className="text-xs font-bold text-emerald-400">
                          +{gear.luckBonus.toLocaleString()}% Base Luck
                        </span>
                      </div>
                    </div>

                    {isEquipped ? (
                      <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-emerald-950 text-emerald-300 border border-emerald-800">
                        EQUIPPED
                      </span>
                    ) : isCrafted ? (
                      <span className="text-[10px] px-2 py-0.5 rounded bg-cyan-950 text-cyan-300 border border-cyan-800">
                        FORGED
                      </span>
                    ) : isUnlocked ? (
                      <span className="text-[10px] px-2 py-0.5 rounded bg-amber-950 text-amber-300 border border-amber-800">
                        UNLOCKED
                      </span>
                    ) : (
                      <div className="flex items-center gap-1 text-[10px] text-slate-500">
                        <Lock className="w-3 h-3" />
                        <span>{gear.requiredDiscoveredAuras} Auras</span>
                      </div>
                    )}
                  </div>

                  <p className="text-[11px] text-slate-400 line-clamp-2">{gear.description}</p>

                  {/* Required Auras Recipe List */}
                  <div className="flex flex-col gap-1.5 pt-2 border-t border-slate-800/80">
                    <span className="text-[10px] uppercase font-bold text-slate-400 tracking-wider">
                      Required Auras:
                    </span>
                    <div className="flex flex-col gap-1">
                      {gear.recipe.map((ing) => {
                        const have = inventory[ing.itemId]?.count || 0;
                        const ready = have >= ing.count;

                        return (
                          <div
                            key={ing.itemId}
                            className={`flex items-center justify-between px-2 py-1 rounded-lg text-[11px] border ${
                              ready
                                ? 'bg-slate-950/70 border-slate-800/80 text-slate-300'
                                : 'bg-red-950/20 border-red-900/30 text-slate-400'
                            }`}
                          >
                            <span className="flex items-center gap-1.5 truncate">
                              <span>{ing.itemEmoji}</span>
                              <span className="truncate">{ing.itemName}</span>
                            </span>
                            <span className={`font-bold shrink-0 ml-1 ${ready ? 'text-emerald-400' : 'text-red-400'}`}>
                              {have} / {ing.count} {ready ? '✓' : ''}
                            </span>
                          </div>
                        );
                      })}
                    </div>
                  </div>

                  {/* Card Action Button */}
                  <div className="pt-2">
                    {isEquipped ? (
                      <button
                        onClick={onUnequipGear}
                        className="w-full py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-bold transition-colors cursor-pointer border border-slate-700"
                      >
                        Unequip Glove
                      </button>
                    ) : isCrafted ? (
                      <button
                        onClick={() => onEquipGear(gear.id)}
                        className="w-full py-2 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-slate-950 text-xs font-bold transition-all shadow cursor-pointer"
                      >
                        Equip {gear.name}
                      </button>
                    ) : isUnlocked && hasAllIngs ? (
                      <button
                        onClick={() => handleCraft(gear)}
                        className="w-full py-2 rounded-xl bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-400 hover:to-orange-400 text-slate-950 text-xs font-bold transition-all shadow cursor-pointer flex items-center justify-center gap-1.5"
                      >
                        <Hammer className="w-3.5 h-3.5" />
                        <span>Forge {gear.name}</span>
                      </button>
                    ) : (
                      <div className="w-full py-2 rounded-xl bg-slate-950 border border-slate-800/80 text-center text-xs text-slate-500">
                        {!isUnlocked
                          ? `Requires ${gear.requiredDiscoveredAuras} Auras`
                          : 'Missing Required Auras'}
                      </div>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* VIEW MODE 2: INTERACTIVE ANVIL FORGE STATION */}
      {viewMode === 'station' && (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          {/* Left Side: Gloves Selector */}
          <div className="lg:col-span-5 flex flex-col gap-2.5 max-h-[640px] overflow-y-auto pr-1 scrollbar-thin">
            {GEAR_ITEMS.map((gear) => {
              const isUnlocked = discoveredAurasCount >= gear.requiredDiscoveredAuras;
              const isCrafted = craftedGearIds.includes(gear.id);
              const isEquipped = equippedGearId === gear.id;
              const isSelected = selectedGear.id === gear.id;

              return (
                <button
                  key={gear.id}
                  onClick={() => setSelectedGearId(gear.id)}
                  className={`flex items-center justify-between p-3.5 rounded-2xl border transition-all cursor-pointer text-left ${
                    isSelected
                      ? 'bg-slate-800/90 border-amber-400/80 shadow-lg ring-1 ring-amber-400/40'
                      : 'bg-slate-900/70 border-slate-800 hover:border-slate-700 hover:bg-slate-800/60'
                  }`}
                >
                  <div className="flex items-center gap-3 min-w-0">
                    <div
                      className="w-12 h-12 rounded-xl flex items-center justify-center text-2xl border shadow-inner shrink-0"
                      style={{
                        backgroundColor: `${gear.color}15`,
                        borderColor: `${gear.color}50`,
                      }}
                    >
                      {gear.icon}
                    </div>

                    <div className="flex flex-col min-w-0">
                      <div className="flex items-center gap-2">
                        <span className="text-sm font-bold text-white truncate font-mono">
                          {gear.name}
                        </span>
                        <span className="text-[10px] font-mono px-1.5 py-0.2 rounded bg-slate-950 text-slate-400 border border-slate-800">
                          T{gear.tier}
                        </span>
                      </div>

                      <span className="text-xs font-mono font-semibold text-emerald-400">
                        +{gear.luckBonus.toLocaleString()}% Base Luck
                      </span>
                    </div>
                  </div>

                  <div className="flex items-center gap-2 shrink-0">
                    {isEquipped ? (
                      <span className="text-[10px] font-mono font-bold px-2 py-0.5 rounded bg-emerald-950 text-emerald-300 border border-emerald-800">
                        EQUIPPED
                      </span>
                    ) : isCrafted ? (
                      <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-cyan-950 text-cyan-300 border border-cyan-800">
                        CRAFTED
                      </span>
                    ) : isUnlocked ? (
                      <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-amber-950 text-amber-300 border border-amber-800">
                        UNLOCKED
                      </span>
                    ) : (
                      <div className="flex items-center gap-1 text-[10px] font-mono text-slate-500">
                        <Lock className="w-3 h-3" />
                        <span>{gear.requiredDiscoveredAuras} Auras</span>
                      </div>
                    )}
                  </div>
                </button>
              );
            })}
          </div>

          {/* Right Side: Detailed Anvil / Forge Station */}
          <div className="lg:col-span-7 flex flex-col gap-4 bg-slate-900 border border-slate-800 rounded-3xl p-5 sm:p-7 shadow-xl">
            {/* Header of Selected Gear */}
            <div className="flex items-center justify-between pb-4 border-b border-slate-800">
              <div className="flex items-center gap-4">
                <div
                  className="w-16 h-16 rounded-2xl flex items-center justify-center text-4xl border shadow-xl"
                  style={{
                    backgroundColor: `${selectedGear.color}20`,
                    borderColor: selectedGear.color,
                    boxShadow: `0 0 25px ${selectedGear.color}30`,
                  }}
                >
                  {selectedGear.icon}
                </div>

                <div>
                  <div className="flex items-center gap-2">
                    <h2 className="text-lg sm:text-xl font-bold text-white font-mono">
                      {selectedGear.name}
                    </h2>
                    <span
                      className="text-xs font-mono font-bold px-2 py-0.5 rounded-full"
                      style={{ backgroundColor: `${selectedGear.color}25`, color: selectedGear.color }}
                    >
                      Tier {selectedGear.tier} {selectedGear.type.toUpperCase()}
                    </span>
                  </div>
                  <p className="text-xs text-slate-400 mt-0.5">{selectedGear.description}</p>
                </div>
              </div>

              {/* Quick Equip / Unequip Toggle if already crafted */}
              {isAlreadyCrafted && (
                <div>
                  {isCurrentlyEquipped ? (
                    <button
                      onClick={onUnequipGear}
                      className="py-2 px-4 rounded-xl bg-slate-800 hover:bg-slate-700 text-xs font-mono text-slate-300 font-semibold transition-colors cursor-pointer border border-slate-700"
                    >
                      Unequip
                    </button>
                  ) : (
                    <button
                      onClick={() => onEquipGear(selectedGear.id)}
                      className="py-2 px-5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-mono font-bold transition-all shadow-lg cursor-pointer"
                    >
                      Equip Glove
                    </button>
                  )}
                </div>
              )}
            </div>

            {/* Blueprint Requirement Status */}
            <div
              className={`p-3.5 rounded-2xl border flex items-center justify-between text-xs font-mono ${
                isBlueprintUnlocked
                  ? 'bg-emerald-950/30 border-emerald-800/60 text-emerald-300'
                  : 'bg-red-950/30 border-red-900/60 text-red-300'
              }`}
            >
              <div className="flex items-center gap-2">
                {isBlueprintUnlocked ? <Check className="w-4 h-4 text-emerald-400" /> : <Lock className="w-4 h-4 text-red-400" />}
                <span>
                  Blueprint Requirement: Discover {selectedGear.requiredDiscoveredAuras} distinct auras
                </span>
              </div>
              <span className="font-bold">
                {discoveredAurasCount} / {selectedGear.requiredDiscoveredAuras} ({Math.min(100, Math.round((discoveredAurasCount / selectedGear.requiredDiscoveredAuras) * 100))}%)
              </span>
            </div>

            {/* Gear Base Luck Stat Overview - Only Boosts Base Luck */}
            <div className="p-4 rounded-2xl bg-slate-950 border border-slate-800 flex items-center justify-between font-mono">
              <div className="flex flex-col">
                <span className="text-[10px] text-slate-400 uppercase tracking-wider font-bold">
                  PERMANENT BASE LUCK MULTIPLIER
                </span>
                <span className="text-xl sm:text-2xl font-black text-emerald-400">
                  +{selectedGear.luckBonus.toLocaleString()}% Base Luck
                </span>
              </div>
              <span className="text-xs text-slate-400 bg-slate-900 px-3 py-1.5 rounded-xl border border-slate-800">
                Applied to all rolls
              </span>
            </div>

            {/* Special Perk Description */}
            <div className="p-3.5 rounded-2xl bg-slate-950 border border-slate-800 flex items-start gap-2.5 text-xs font-mono">
              <Zap className="w-4 h-4 text-amber-400 shrink-0 mt-0.5" />
              <div>
                <span className="font-bold text-white block mb-0.5">Special Glove Perk:</span>
                <span className="text-slate-300">{selectedGear.specialPerk}</span>
              </div>
            </div>

            {/* Crafting Recipe Ingredients */}
            <div className="flex flex-col gap-2 pt-2 border-t border-slate-800">
              <span className="text-xs font-mono uppercase tracking-wider text-slate-400 font-bold">
                Required Aura Ingredients (Gauntlet Recipe)
              </span>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                {selectedGear.recipe.map((ing) => {
                  const currentCount = inventory[ing.itemId]?.count || 0;
                  const isSufficient = currentCount >= ing.count;

                  return (
                    <div
                      key={ing.itemId}
                      className={`flex items-center justify-between p-3 rounded-xl border text-xs font-mono transition-colors ${
                        isSufficient
                          ? 'bg-slate-950/80 border-slate-800 text-slate-200'
                          : 'bg-red-950/20 border-red-900/40 text-slate-400'
                      }`}
                    >
                      <div className="flex items-center gap-2.5">
                        <span className="text-2xl select-none">{ing.itemEmoji}</span>
                        <div className="flex flex-col">
                          <span className="font-bold text-white">{ing.itemName}</span>
                          <span className="text-[10px] text-slate-500">Sacrificed upon forge</span>
                        </div>
                      </div>

                      <div className="flex items-center gap-1.5 font-bold">
                        <span className={isSufficient ? 'text-emerald-400' : 'text-red-400'}>
                          {currentCount}
                        </span>
                        <span className="text-slate-600">/</span>
                        <span className="text-slate-300">{ing.count}</span>
                        {isSufficient ? (
                          <Check className="w-4 h-4 text-emerald-400 ml-1" />
                        ) : (
                          <AlertCircle className="w-4 h-4 text-red-500 ml-1" />
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Craft Button */}
            <div className="pt-2">
              {isAlreadyCrafted ? (
                <div className="w-full py-3.5 rounded-2xl bg-slate-950 border border-slate-800 flex items-center justify-center gap-2 text-xs font-mono font-bold text-emerald-400">
                  <Check className="w-4 h-4" />
                  <span>Glove Already Forged & Ready to Equip</span>
                </div>
              ) : (
                <button
                  onClick={() => handleCraft(selectedGear)}
                  disabled={!isBlueprintUnlocked || !hasAllIngredients || isCrafting}
                  className={`w-full py-4 rounded-2xl font-mono font-bold text-sm tracking-wider flex items-center justify-center gap-2 transition-all cursor-pointer shadow-xl ${
                    isBlueprintUnlocked && hasAllIngredients
                      ? 'bg-gradient-to-r from-amber-500 via-orange-500 to-amber-600 hover:from-amber-400 hover:to-orange-400 text-slate-950 shadow-amber-500/20'
                      : 'bg-slate-800 text-slate-500 cursor-not-allowed border border-slate-700'
                  }`}
                >
                  <Hammer className={`w-4 h-4 ${isCrafting ? 'animate-bounce' : ''}`} />
                  <span>
                    {isCrafting
                      ? 'FORGING ON ANVIL...'
                      : !isBlueprintUnlocked
                      ? `LOCKED (Discover ${selectedGear.requiredDiscoveredAuras} Auras)`
                      : !hasAllIngredients
                      ? 'MISSING REQUIRED AURAS'
                      : `FORGE ${selectedGear.name.toUpperCase()}`}
                  </span>
                </button>
              )}

              <AnimatePresence>
                {craftSuccess && (
                  <motion.div
                    initial={{ opacity: 0, y: 5 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0 }}
                    className="mt-2 text-center text-xs font-mono font-bold text-emerald-400"
                  >
                    ✨ Success! {selectedGear.name} forged and added to your equipment!
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
