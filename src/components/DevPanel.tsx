import React, { useState, useEffect } from 'react';
import {
  Wrench,
  Coins,
  Sparkles,
  Plus,
  Dices,
  Trophy,
  Check,
  X,
  Zap,
  Sliders,
  AlertTriangle,
  Users,
  Search,
  ShieldAlert,
  Trash2,
  Gift,
  Hammer,
  Compass
} from 'lucide-react';
import { RNGItem, UserAccount, Biome, ActivePotion } from '../types/rng';
import { ITEMS, RARITY_CONFIGS, formatChance } from '../data/items';
import { GEAR_ITEMS } from '../data/gears';
import { BIOMES } from '../data/biomes';
import { AuraIcon } from './AuraIcon';
import { 
  getAllAccounts, 
  grantShardsToAccount, 
  grantItemToAccount, 
  setAccountAdminRole, 
  deleteAccountByUsername,
  registerAccount
} from '../utils/auth';
import { sound } from '../utils/audio';

interface DevPanelProps {
  isOpen: boolean;
  onClose: () => void;
  shards: number;
  onAddShards: (amount: number) => void;
  onGrantItem: (item: RNGItem, count: number) => void;
  onForceRollItem: (item: RNGItem) => void;
  onUnlockAllItems: () => void;
  customLuckOverride: number | null;
  onSetCustomLuck: (val: number | null) => void;
  onPlayCutscene: (item: RNGItem) => void;
  onUnlockAllGears?: () => void;
  activeBiome?: Biome;
  onSetBiome?: (biome: Biome) => void;
  onGrantPotion?: (potion: ActivePotion) => void;
}

export const DevPanel: React.FC<DevPanelProps> = ({
  isOpen,
  onClose,
  shards,
  onAddShards,
  onGrantItem,
  onForceRollItem,
  onUnlockAllItems,
  customLuckOverride,
  onSetCustomLuck,
  onPlayCutscene,
  onUnlockAllGears,
  activeBiome,
  onSetBiome,
  onGrantPotion,
}) => {
  const [activeTab, setActiveTab] = useState<'auras' | 'accounts' | 'biomes' | 'gears' | 'cheats'>('accounts');
  const [selectedItemId, setSelectedItemId] = useState<string>(ITEMS[0].id);
  const [itemQuantity, setItemQuantity] = useState<number>(1);
  const [customShardsInput, setCustomShardsInput] = useState<string>('50000');
  const [luckInput, setLuckInput] = useState<string>('100');
  const [feedbackMsg, setFeedbackMsg] = useState<string | null>(null);

  // Accounts Management State
  const [accounts, setAccounts] = useState<Record<string, UserAccount>>({});
  const [accountSearch, setAccountSearch] = useState<string>('');
  const [selectedAccountUser, setSelectedAccountUser] = useState<string | null>(null);
  const [grantShardsAmount, setGrantShardsAmount] = useState<string>('100000');
  const [newUsername, setNewUsername] = useState<string>('');
  const [newPassword, setNewPassword] = useState<string>('');

  useEffect(() => {
    if (isOpen) {
      refreshAccounts();
    }
  }, [isOpen]);

  const refreshAccounts = () => {
    const list = getAllAccounts();
    setAccounts(list);
  };

  const handleCreateNewAccount = () => {
    if (!newUsername.trim() || !newPassword.trim()) {
      showFeedback('Please enter both username and password.');
      return;
    }
    const res = registerAccount(newUsername.trim(), newPassword.trim());
    if (res.success) {
      showFeedback(`Real account "${newUsername.trim()}" created successfully!`);
      setNewUsername('');
      setNewPassword('');
      refreshAccounts();
    } else {
      showFeedback(res.error || 'Failed to create account.');
    }
  };

  if (!isOpen) return null;

  const selectedItem = ITEMS.find((i) => i.id === selectedItemId) || ITEMS[0];

  const showFeedback = (msg: string) => {
    setFeedbackMsg(msg);
    setTimeout(() => setFeedbackMsg(null), 3000);
  };

  const handleGrant = () => {
    onGrantItem(selectedItem, Math.max(1, itemQuantity));
    sound.playEquip();
    showFeedback(`Granted x${itemQuantity} ${selectedItem.name} to active session!`);
  };

  const handleForceRoll = () => {
    onForceRollItem(selectedItem);
    onClose();
  };

  const handleAddCustomShards = () => {
    const val = parseInt(customShardsInput, 10);
    if (!isNaN(val) && val > 0) {
      onAddShards(val);
      sound.playCoin();
      showFeedback(`Added +${val.toLocaleString()} Shards to current player!`);
    }
  };

  const handleApplyLuck = () => {
    const val = parseFloat(luckInput);
    if (!isNaN(val) && val >= 1) {
      onSetCustomLuck(val);
      showFeedback(`Custom Luck set to ${val}x!`);
    }
  };

  const handleClearLuck = () => {
    onSetCustomLuck(null);
    showFeedback('Custom Luck override cleared (default game math restored).');
  };

  // Give Shards to a chosen account
  const handleGiveShardsToAccount = (username: string) => {
    const amt = parseInt(grantShardsAmount, 10);
    if (isNaN(amt) || amt <= 0) return;

    const newBalance = grantShardsToAccount(username, amt);
    if (newBalance !== null) {
      sound.playCoin();
      showFeedback(`Successfully gave +${amt.toLocaleString()} Shards to "${username}"! (New Balance: ${newBalance.toLocaleString()})`);
      refreshAccounts();
      // If granting to current session, also update local state
      onAddShards(amt);
    }
  };

  // Give an Item directly to a chosen account
  const handleGiveItemToAccount = (username: string, item: RNGItem) => {
    const ok = grantItemToAccount(username, item.id, 1);
    if (ok) {
      sound.playEquip();
      showFeedback(`Gifted ${item.name} directly to "${username}"'s inventory!`);
      refreshAccounts();
    }
  };

  // Toggle Admin on Account
  const handleToggleAdmin = (username: string, currentAdmin: boolean) => {
    setAccountAdminRole(username, !currentAdmin);
    showFeedback(`Toggled admin status for "${username}" to ${!currentAdmin ? 'ADMIN' : 'USER'}!`);
    refreshAccounts();
  };

  // Delete Account
  const handleDeleteAccount = (username: string) => {
    if (username.toLowerCase() === 'dev85') {
      showFeedback('Cannot delete primary dev85 admin account!');
      return;
    }
    deleteAccountByUsername(username);
    showFeedback(`Deleted account "${username}".`);
    refreshAccounts();
  };

  const filteredAccounts = Object.values(accounts).filter((acc) =>
    acc.username.toLowerCase().includes(accountSearch.toLowerCase().trim())
  );

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black/85 backdrop-blur-md select-none">
      <div className="w-full max-w-4xl max-h-[90vh] bg-slate-900 border-2 border-amber-500/50 rounded-3xl shadow-2xl flex flex-col overflow-hidden">
        {/* Header with Dev Badge */}
        <div className="p-4 sm:p-5 border-b border-slate-800 flex items-center justify-between bg-slate-950/80">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-xl bg-amber-500/20 border border-amber-500/50 flex items-center justify-center text-amber-400">
              <Wrench className="w-4 h-4" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-base sm:text-lg font-mono font-bold text-white tracking-wider">
                  DEV85 CONTROL MATRIX
                </h2>
                <span className="text-[10px] font-mono bg-red-950 text-red-300 border border-red-800 px-2 py-0.5 rounded-full font-bold">
                  ADMIN ONLY
                </span>
              </div>
              <p className="text-xs text-slate-400">
                System Architecture & Real Account Database Manager
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="w-8 h-8 rounded-lg bg-slate-800 hover:bg-slate-700 flex items-center justify-center text-slate-400 hover:text-white transition-colors cursor-pointer"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Feedback Alert Toast */}
        {feedbackMsg && (
          <div className="bg-emerald-950/90 border-b border-emerald-600/80 px-4 py-2 flex items-center gap-2 text-xs font-mono text-emerald-200">
            <Check className="w-4 h-4 text-emerald-400 shrink-0" />
            <span>{feedbackMsg}</span>
          </div>
        )}

        {/* Dev Sub-tabs */}
        <div className="flex items-center gap-2 px-5 pt-3 border-b border-slate-800 bg-slate-950/40 text-xs font-mono">
          <button
            onClick={() => setActiveTab('accounts')}
            className={`pb-2.5 px-3 border-b-2 font-bold flex items-center gap-1.5 transition-colors cursor-pointer ${
              activeTab === 'accounts'
                ? 'border-amber-400 text-amber-300'
                : 'border-transparent text-slate-400 hover:text-slate-200'
            }`}
          >
            <Users className="w-4 h-4" />
            <span>Accounts & Shards ({Object.keys(accounts).length})</span>
          </button>

          <button
            onClick={() => setActiveTab('auras')}
            className={`pb-2.5 px-3 border-b-2 font-bold flex items-center gap-1.5 transition-colors cursor-pointer ${
              activeTab === 'auras'
                ? 'border-amber-400 text-amber-300'
                : 'border-transparent text-slate-400 hover:text-slate-200'
            }`}
          >
            <Sparkles className="w-4 h-4" />
            <span>Aura Spawner</span>
          </button>

          <button
            onClick={() => setActiveTab('biomes')}
            className={`pb-2.5 px-3 border-b-2 font-bold flex items-center gap-1.5 transition-colors cursor-pointer ${
              activeTab === 'biomes'
                ? 'border-amber-400 text-amber-300'
                : 'border-transparent text-slate-400 hover:text-slate-200'
            }`}
          >
            <Compass className="w-4 h-4" />
            <span>Biomes ({BIOMES.length})</span>
          </button>

          <button
            onClick={() => setActiveTab('gears')}
            className={`pb-2.5 px-3 border-b-2 font-bold flex items-center gap-1.5 transition-colors cursor-pointer ${
              activeTab === 'gears'
                ? 'border-amber-400 text-amber-300'
                : 'border-transparent text-slate-400 hover:text-slate-200'
            }`}
          >
            <Hammer className="w-4 h-4" />
            <span>Gloves & Gears</span>
          </button>

          <button
            onClick={() => setActiveTab('cheats')}
            className={`pb-2.5 px-3 border-b-2 font-bold flex items-center gap-1.5 transition-colors cursor-pointer ${
              activeTab === 'cheats'
                ? 'border-amber-400 text-amber-300'
                : 'border-transparent text-slate-400 hover:text-slate-200'
            }`}
          >
            <Sliders className="w-4 h-4" />
            <span>Luck Engine Overrides</span>
          </button>
        </div>

        {/* Content Body */}
        <div className="p-5 overflow-y-auto max-h-[calc(90vh-140px)] flex flex-col gap-6">
          {/* TAB 1: ACCOUNTS MANAGEMENT */}
          {activeTab === 'accounts' && (
            <div className="flex flex-col gap-4">
              <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 bg-slate-950 p-4 rounded-2xl border border-slate-800">
                <div>
                  <h3 className="text-sm font-bold text-white font-mono flex items-center gap-2">
                    <Users className="w-4 h-4 text-cyan-400" />
                    <span>Registered Accounts Database</span>
                  </h3>
                  <p className="text-xs text-slate-400 mt-0.5">
                    View every real registered user on the platform, manage admin roles, or inspect their vault.
                  </p>
                </div>
              </div>

              {/* Create New Real Account Form */}
              <div className="p-3.5 rounded-2xl bg-slate-950 border border-cyan-500/30 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 text-xs font-mono">
                <div className="flex items-center gap-2">
                  <Plus className="w-4 h-4 text-cyan-400" />
                  <span className="font-bold text-white">Register Real Account:</span>
                </div>
                <div className="flex flex-wrap items-center gap-2">
                  <input
                    type="text"
                    placeholder="Username..."
                    value={newUsername}
                    onChange={(e) => setNewUsername(e.target.value)}
                    className="w-32 bg-slate-900 border border-slate-700 rounded-lg px-2.5 py-1 text-xs text-white"
                  />
                  <input
                    type="password"
                    placeholder="Password..."
                    value={newPassword}
                    onChange={(e) => setNewPassword(e.target.value)}
                    className="w-32 bg-slate-900 border border-slate-700 rounded-lg px-2.5 py-1 text-xs text-white"
                  />
                  <button
                    onClick={handleCreateNewAccount}
                    className="py-1 px-3 rounded-lg bg-cyan-600 hover:bg-cyan-500 text-white font-bold transition-all cursor-pointer shadow"
                  >
                    + Create User
                  </button>
                </div>
              </div>

              {/* Search Bar */}
              <div className="relative">
                <Search className="w-4 h-4 text-slate-500 absolute left-3 top-1/2 -translate-y-1/2" />
                <input
                  type="text"
                  placeholder="Filter accounts by username..."
                  value={accountSearch}
                  onChange={(e) => setAccountSearch(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl pl-9 pr-4 py-2 text-xs font-mono text-slate-200 focus:outline-none focus:border-amber-400"
                />
              </div>

              {/* Accounts Table */}
              <div className="flex flex-col gap-2">
                {filteredAccounts.map((acc) => {
                  const saved = acc.savedState || { shards: 0, totalRolls: 0, inventory: {} };
                  const invCount = Object.keys(saved.inventory || {}).length;
                  const isDev = acc.username.toLowerCase() === 'dev85';

                  return (
                    <div
                      key={acc.username}
                      className="p-3.5 rounded-2xl bg-slate-950 border border-slate-800/80 hover:border-slate-700 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 text-xs font-mono"
                    >
                      <div className="flex items-center gap-3">
                        <div
                          className={`w-10 h-10 rounded-xl flex items-center justify-center font-bold text-sm border ${
                            acc.isAdmin
                              ? 'bg-amber-500/20 text-amber-400 border-amber-500/40'
                              : 'bg-slate-900 text-slate-300 border-slate-800'
                          }`}
                        >
                          {acc.username.charAt(0).toUpperCase()}
                        </div>

                        <div className="flex flex-col">
                          <div className="flex items-center gap-2">
                            <span className="font-bold text-white text-sm">{acc.username}</span>
                            {acc.isAdmin && (
                              <span className="text-[10px] px-1.5 py-0.2 rounded bg-red-950 text-red-300 border border-red-800 font-bold">
                                ADMIN
                              </span>
                            )}
                          </div>
                          <span className="text-slate-400 text-[11px]">
                            💎 {saved.shards?.toLocaleString() || 0} Shards · 🎲 {saved.totalRolls?.toLocaleString() || 0} Rolls · 🎒 {invCount} Auras
                          </span>
                        </div>
                      </div>

                      {/* Action Buttons */}
                      <div className="flex items-center gap-2 flex-wrap sm:flex-nowrap">
                        {/* Gift Napoleon */}
                        <button
                          onClick={() => {
                            const napoleon = ITEMS.find((i) => i.id === 'napoleon');
                            if (napoleon) handleGiveItemToAccount(acc.username, napoleon);
                          }}
                          className="py-1.5 px-2.5 rounded-lg bg-red-950 hover:bg-red-900 text-red-200 border border-red-800 transition-colors cursor-pointer"
                          title="Gift Napoleon to this account"
                        >
                          👑 Gift Napoleon
                        </button>

                        {/* Toggle Admin */}
                        {!isDev && (
                          <button
                            onClick={() => handleToggleAdmin(acc.username, acc.isAdmin)}
                            className="py-1.5 px-2.5 rounded-lg bg-slate-900 hover:bg-slate-800 text-slate-300 border border-slate-700 transition-colors cursor-pointer"
                          >
                            {acc.isAdmin ? 'Demote' : 'Make Admin'}
                          </button>
                        )}

                        {/* Delete Account */}
                        {!isDev && (
                          <button
                            onClick={() => handleDeleteAccount(acc.username)}
                            className="p-1.5 rounded-lg bg-slate-900 hover:bg-red-950 text-slate-500 hover:text-red-400 border border-slate-800 hover:border-red-800 transition-colors cursor-pointer"
                            title="Delete Account"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          )}

          {/* TAB 2: AURA SPAWNER */}
          {activeTab === 'auras' && (
            <div className="flex flex-col gap-5">
              <div className="p-4 rounded-2xl bg-slate-950 border border-slate-800 flex flex-col sm:flex-row items-center justify-between gap-4">
                <div className="flex items-center gap-3">
                  <div
                    className="w-14 h-14 rounded-2xl flex items-center justify-center text-3xl border shadow-inner overflow-hidden"
                    style={{
                      backgroundColor: RARITY_CONFIGS[selectedItem.rarity].bgColor,
                      borderColor: RARITY_CONFIGS[selectedItem.rarity].borderColor,
                    }}
                  >
                    {selectedItem.imageUrl ? (
                      <img src={selectedItem.imageUrl} alt={selectedItem.name} className="w-full h-full object-cover" />
                    ) : (
                      <AuraIcon item={selectedItem} size="lg" showGlow />
                    )}
                  </div>
                  <div>
                    <h3 className="text-base font-bold text-white font-mono">{selectedItem.name}</h3>
                    <p className="text-xs font-mono" style={{ color: RARITY_CONFIGS[selectedItem.rarity].color }}>
                      {selectedItem.rarity} · 1 in {selectedItem.baseChance.toLocaleString()}
                    </p>
                  </div>
                </div>

                <div className="flex flex-wrap items-center gap-2">
                  <button
                    onClick={() => {
                      onUnlockAllItems();
                      sound.playVictory();
                      showFeedback('Unlocked all 51 auras in your inventory!');
                    }}
                    className="py-2.5 px-4 rounded-xl bg-gradient-to-r from-purple-600 via-pink-600 to-amber-500 text-white font-mono font-bold text-xs transition-all shadow-lg cursor-pointer"
                  >
                    ✨ Get Every Aura (x51)
                  </button>
                  <button
                    onClick={handleGrant}
                    className="py-2.5 px-4 rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 font-mono font-bold text-xs transition-all shadow-lg cursor-pointer"
                  >
                    Spawn Selected
                  </button>
                  <button
                    onClick={handleForceRoll}
                    className="py-2.5 px-4 rounded-xl bg-cyan-600 hover:bg-cyan-500 text-white font-mono font-bold text-xs transition-all shadow-lg cursor-pointer"
                  >
                    Force Roll
                  </button>
                </div>
              </div>

              {/* Aura Selection Grid */}
              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-2.5">
                {ITEMS.map((item) => {
                  const cfg = RARITY_CONFIGS[item.rarity];
                  const isSel = selectedItemId === item.id;

                  return (
                    <button
                      key={item.id}
                      onClick={() => setSelectedItemId(item.id)}
                      className={`flex flex-col items-center p-2.5 rounded-xl border text-center transition-all cursor-pointer ${
                        isSel
                          ? 'bg-amber-950/40 border-amber-400 shadow-md ring-1 ring-amber-400'
                          : 'bg-slate-950 border-slate-800 hover:border-slate-700'
                      }`}
                    >
                      <AuraIcon item={item} size="md" className="mb-1" />
                      <span className="text-xs font-bold text-white truncate w-full">{item.name}</span>
                      <span className="text-[10px] font-mono mt-0.5" style={{ color: cfg.color }}>
                        {item.rarity}
                      </span>
                    </button>
                  );
                })}
              </div>
            </div>
          )}

          {/* TAB: BIOMES SWITCHER */}
          {activeTab === 'biomes' && (
            <div className="flex flex-col gap-4 font-mono text-xs">
              <div className="p-4 rounded-2xl bg-slate-950 border border-slate-800 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
                <div>
                  <h3 className="text-sm font-bold text-white flex items-center gap-2">
                    <Compass className="w-4 h-4 text-cyan-400" />
                    <span>Active Biome Override</span>
                  </h3>
                  <p className="text-xs text-slate-400 mt-0.5">
                    Click any biome to instantly shift the weather environment and activate its exclusive aura probability boosts.
                  </p>
                </div>

                {activeBiome && (
                  <div className="px-3 py-1.5 rounded-xl bg-slate-900 border border-slate-700 flex items-center gap-2">
                    <span className="text-base">{activeBiome.emoji}</span>
                    <span className="font-bold text-white">{activeBiome.name}</span>
                    <span className="text-[10px] text-cyan-400">Active</span>
                  </div>
                )}
              </div>

              {/* 9 Biomes Grid */}
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3">
                {BIOMES.map((b) => {
                  const isActive = activeBiome?.id === b.id;

                  return (
                    <div
                      key={b.id}
                      className={`p-4 rounded-2xl border flex flex-col justify-between gap-3 transition-all ${
                        isActive
                          ? 'bg-slate-900/90 border-cyan-400 shadow-[0_0_20px_rgba(6,182,212,0.25)]'
                          : 'bg-slate-950 border-slate-800 hover:border-slate-700'
                      }`}
                    >
                      <div className="flex items-start justify-between gap-2">
                        <div className="flex items-center gap-2.5">
                          <span className="text-3xl">{b.emoji}</span>
                          <div>
                            <h4 className="font-bold text-white text-sm" style={{ color: b.color }}>
                              {b.name}
                            </h4>
                            <span className="text-[10px] text-slate-400">
                              {b.rarityChance === 1 ? 'Default Biome' : `Rarity: 1 in ${b.rarityChance.toLocaleString()}`}
                            </span>
                          </div>
                        </div>
                      </div>

                      <p className="text-[11px] text-slate-400 leading-relaxed">
                        {b.description}
                      </p>

                      {b.boostedAuras.length > 0 && (
                        <div className="flex flex-wrap items-center gap-1 pt-2 border-t border-slate-800/80">
                          <span className="text-[9px] text-slate-500 uppercase font-bold">Boosts:</span>
                          {b.boostedAuras.map((boost) => {
                            const item = ITEMS.find((i) => i.id === boost.itemId);
                            if (!item) return null;
                            return (
                              <span
                                key={boost.itemId}
                                className="text-[9px] px-1.5 py-0.5 rounded bg-black/60 border border-slate-800 text-slate-300 flex items-center gap-1"
                              >
                                <span>{item.emoji}</span>
                                <span>{item.name}</span>
                                <strong className="text-emerald-400">+{boost.multiplier}x</strong>
                              </span>
                            );
                          })}
                        </div>
                      )}

                      <button
                        onClick={() => {
                          if (onSetBiome) {
                            onSetBiome(b);
                            sound.playRareAlert();
                            showFeedback(`Active Biome switched to ${b.name}!`);
                          }
                        }}
                        disabled={isActive}
                        className={`w-full py-2 rounded-xl font-bold transition-all cursor-pointer flex items-center justify-center gap-1.5 ${
                          isActive
                            ? 'bg-emerald-950/60 text-emerald-300 border border-emerald-700/60 cursor-default'
                            : 'bg-slate-900 hover:bg-slate-800 text-white border border-slate-700'
                        }`}
                      >
                        {isActive ? '✓ CURRENTLY ACTIVE' : '⚡ Activate Biome'}
                      </button>
                    </div>
                  );
                })}
              </div>
            </div>
          )}

          {/* TAB 3: GLOVES & GEARS */}
          {activeTab === 'gears' && (
            <div className="flex flex-col gap-4">
              <div className="p-4 rounded-2xl bg-slate-950 border border-slate-800 flex items-center justify-between">
                <div>
                  <h3 className="text-sm font-bold text-white font-mono">Unlock All Gear Blueprints & Gloves</h3>
                  <p className="text-xs text-slate-400">Instantly grant every glove & device blueprint to your workshop.</p>
                </div>

                <button
                  onClick={() => {
                    if (onUnlockAllGears) onUnlockAllGears();
                    showFeedback('All gloves & devices unlocked and ready to forge!');
                  }}
                  className="py-2 px-5 rounded-xl bg-gradient-to-r from-amber-500 to-orange-500 text-slate-950 font-mono font-bold text-xs shadow-lg cursor-pointer"
                >
                  Unlock All Gloves
                </button>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {GEAR_ITEMS.map((gear) => (
                  <div key={gear.id} className="p-3.5 rounded-xl bg-slate-950 border border-slate-800 flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <span className="text-3xl">{gear.icon}</span>
                      <div className="flex flex-col font-mono text-xs">
                        <span className="font-bold text-white">{gear.name}</span>
                        <span style={{ color: gear.color }}>+{gear.luckBonus}% Luck</span>
                      </div>
                    </div>
                    <span className="text-[10px] font-mono text-slate-500">Tier {gear.tier}</span>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* TAB 4: LUCK ENGINE OVERRIDES */}
          {activeTab === 'cheats' && (
            <div className="flex flex-col gap-5 font-mono text-xs">
              <div className="p-4 rounded-2xl bg-slate-950 border border-slate-800 flex flex-col gap-3">
                <div className="flex items-center justify-between">
                  <span className="font-bold text-white text-sm">Force Roll Multiplier</span>
                  <span className="text-amber-400 font-bold">
                    {customLuckOverride ? `${customLuckOverride}x Active` : 'Default In-Game Math'}
                  </span>
                </div>

                <div className="flex items-center gap-3">
                  <input
                    type="number"
                    value={luckInput}
                    onChange={(e) => setLuckInput(e.target.value)}
                    className="w-32 bg-slate-900 border border-slate-700 rounded-lg px-3 py-2 text-white"
                  />
                  <button
                    onClick={handleApplyLuck}
                    className="py-2 px-4 rounded-lg bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold cursor-pointer"
                  >
                    Apply Multiplier
                  </button>
                  <button
                    onClick={handleClearLuck}
                    className="py-2 px-4 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 cursor-pointer"
                  >
                    Reset to Default
                  </button>
                </div>
              </div>

              {/* Whimsical Potion Grant */}
              <div className="p-4 rounded-2xl bg-slate-950 border border-purple-800/80 flex items-center justify-between">
                <div>
                  <span className="font-bold text-amber-300 text-sm block flex items-center gap-1.5">
                    <span>🌈</span>
                    <span>Grant Whimsical Potion (+1,000x Luck)</span>
                  </span>
                  <span className="text-slate-400">Instantly activate the 100k shard elixir on the next roll.</span>
                </div>

                <button
                  onClick={() => {
                    if (onGrantPotion) {
                      onGrantPotion({
                        id: 'whimsical_potion',
                        name: 'Whimsical Potion',
                        multiplier: 1000.0,
                        remainingRolls: 1,
                        icon: '🌈',
                      });
                      sound.playPotionDrink();
                      showFeedback('Whimsical Potion (+1,000x Luck on next roll) activated!');
                    }
                  }}
                  className="py-2 px-4 rounded-xl bg-gradient-to-r from-purple-500 to-amber-500 text-slate-950 font-bold cursor-pointer shadow-lg"
                >
                  Activate Potion
                </button>
              </div>

              {/* Fast Shards Grant & Removal */}
              <div className="p-4 rounded-2xl bg-slate-950 border border-slate-800 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
                <div>
                  <span className="font-bold text-white text-sm block">Shards Balance Management</span>
                  <span className="text-slate-400">Current Balance: <strong className="text-amber-300">{shards.toLocaleString()} Shards</strong></span>
                </div>

                <div className="flex flex-wrap items-center gap-2">
                  {[10000, 100000, 1000000].map((amt) => (
                    <button
                      key={amt}
                      onClick={() => {
                        onAddShards(amt);
                        showFeedback(`Granted +${amt.toLocaleString()} Shards!`);
                      }}
                      className="py-1.5 px-3 rounded-lg bg-slate-900 hover:bg-slate-800 text-cyan-300 border border-slate-700 cursor-pointer font-bold"
                    >
                      +{amt.toLocaleString()}
                    </button>
                  ))}

                  <button
                    onClick={() => {
                      if (shards > 0) {
                        onAddShards(-shards);
                        sound.playCoin();
                        showFeedback('Removed all shards! Balance reset to 0.');
                      } else {
                        showFeedback('Shards balance is already 0.');
                      }
                    }}
                    className="py-1.5 px-3 rounded-lg bg-red-950 hover:bg-red-900 text-red-200 border border-red-700 cursor-pointer font-bold shadow-md"
                  >
                    🗑️ Reset Shards to 0
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
