import React from 'react';
import { Volume2, VolumeX, Sparkles, Coins, User, LogOut, Wrench, ShieldCheck, HelpCircle } from 'lucide-react';
import { RNGItem } from '../types/rng';

export type NavTab = 'roll' | 'arena' | 'workshop' | 'inventory' | 'index' | 'shop' | 'chat';

interface TopBarProps {
  currentTab: NavTab;
  onTabChange: (tab: NavTab) => void;
  soundEnabled: boolean;
  onToggleSound: () => void;
  luckMultiplier: number;
  equippedItem: RNGItem | null;
  shards: number;
  totalRolls: number;
  inventoryCount: number;
  currentUsername: string | null;
  isAdmin: boolean;
  onOpenAuth: () => void;
  onLogout: () => void;
  onOpenDevPanel: () => void;
  onOpenTutorial?: () => void;
  hasUnreadChat?: boolean;
}

export const TopBar: React.FC<TopBarProps> = ({
  currentTab,
  onTabChange,
  soundEnabled,
  onToggleSound,
  luckMultiplier,
  equippedItem,
  shards,
  totalRolls,
  inventoryCount,
  currentUsername,
  isAdmin,
  onOpenAuth,
  onLogout,
  onOpenDevPanel,
  onOpenTutorial,
  hasUnreadChat,
}) => {
  return (
    <header className="w-full border-b border-slate-800 bg-slate-950/80 backdrop-blur-md sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-3 sm:px-6 h-16 flex items-center justify-between gap-2">
        {/* Zone 1: Brand title wordmark */}
        <div className="flex items-center gap-3 shrink-0">
          <button
            onClick={() => onTabChange('roll')}
            className="text-base sm:text-lg font-black tracking-wider text-white hover:text-cyan-400 transition-colors flex items-center gap-2 cursor-pointer font-mono"
          >
            <span className="w-3 h-3 rounded-full bg-gradient-to-r from-cyan-400 via-amber-300 to-pink-500 shadow-[0_0_12px_#22d3ee] animate-pulse shrink-0" />
            <span className="uppercase font-black bg-gradient-to-r from-cyan-400 via-amber-300 to-pink-400 bg-clip-text text-transparent tracking-widest">
              PRISM RNG
            </span>
          </button>
        </div>

        {/* Zone 2: Clean navigation links */}
        <nav className="flex items-center gap-0.5 sm:gap-2 overflow-x-auto scrollbar-none py-1">
          <button
            onClick={() => onTabChange('roll')}
            className={`px-2.5 sm:px-3 py-1.5 text-xs sm:text-sm font-medium transition-colors border-b-2 whitespace-nowrap cursor-pointer ${
              currentTab === 'roll'
                ? 'border-cyan-400 text-white font-semibold'
                : 'border-transparent text-slate-400 hover:text-slate-200'
            }`}
          >
            Roll Chamber
          </button>

          <button
            onClick={() => onTabChange('arena')}
            className={`px-2.5 sm:px-3 py-1.5 text-xs sm:text-sm font-medium transition-colors border-b-2 flex items-center gap-1.5 whitespace-nowrap cursor-pointer ${
              currentTab === 'arena'
                ? 'border-red-500 text-white font-semibold bg-red-950/20'
                : 'border-transparent text-slate-400 hover:text-red-300'
            }`}
          >
            <span className="text-red-400">⚔️</span>
            <span>Boss Arena</span>
          </button>

          <button
            onClick={() => onTabChange('workshop')}
            className={`px-2.5 sm:px-3 py-1.5 text-xs sm:text-sm font-medium transition-colors border-b-2 flex items-center gap-1.5 whitespace-nowrap cursor-pointer ${
              currentTab === 'workshop'
                ? 'border-amber-400 text-white font-semibold bg-amber-950/20'
                : 'border-transparent text-slate-400 hover:text-amber-300'
            }`}
          >
            <span className="text-amber-400">🥊</span>
            <span>Gears</span>
          </button>

          <button
            onClick={() => onTabChange('inventory')}
            className={`px-2.5 sm:px-3 py-1.5 text-xs sm:text-sm font-medium transition-colors border-b-2 flex items-center gap-1.5 whitespace-nowrap cursor-pointer ${
              currentTab === 'inventory'
                ? 'border-cyan-400 text-white font-semibold'
                : 'border-transparent text-slate-400 hover:text-slate-200'
            }`}
          >
            <span>Inventory</span>
            <span className="text-xs font-mono text-slate-400 tabular-nums">({inventoryCount})</span>
          </button>

          <button
            onClick={() => onTabChange('index')}
            className={`px-2.5 sm:px-3 py-1.5 text-xs sm:text-sm font-medium transition-colors border-b-2 whitespace-nowrap cursor-pointer ${
              currentTab === 'index'
                ? 'border-cyan-400 text-white font-semibold'
                : 'border-transparent text-slate-400 hover:text-slate-200'
            }`}
          >
            Collection
          </button>

          <button
            onClick={() => onTabChange('shop')}
            className={`px-3 py-1.5 text-xs sm:text-sm font-bold transition-all border-b-2 flex items-center gap-1.5 whitespace-nowrap cursor-pointer rounded-t-lg ${
              currentTab === 'shop'
                ? 'border-purple-400 text-purple-200 bg-purple-950/60 shadow-[0_0_15px_rgba(168,85,247,0.4)]'
                : 'border-transparent text-purple-300/80 hover:text-purple-200 hover:bg-purple-950/30'
            }`}
          >
            <span className="text-base animate-pulse">🧪</span>
            <span>Alchemist Lab</span>
            <span className="px-1.5 py-0.2 rounded-full bg-purple-900/90 text-purple-300 text-[10px] border border-purple-600 font-mono">
              POTIONS
            </span>
          </button>

          <button
            onClick={() => onTabChange('chat')}
            className={`px-2.5 sm:px-3 py-1.5 text-xs sm:text-sm font-medium transition-colors border-b-2 flex items-center gap-1.5 whitespace-nowrap cursor-pointer ${
              currentTab === 'chat'
                ? 'border-cyan-400 text-white font-semibold'
                : 'border-transparent text-slate-400 hover:text-slate-200'
            }`}
          >
            <span>Chat</span>
            {hasUnreadChat && currentTab !== 'chat' && (
              <span className="w-2 h-2 rounded-full bg-cyan-400 animate-pulse" />
            )}
          </button>
        </nav>

        {/* Zone 3: Primary stats, Dev tools, Auth & sound action */}
        <div className="flex items-center gap-2 sm:gap-3 text-xs sm:text-sm shrink-0">
          {/* Shards Currency */}
          <div className="hidden md:flex items-center gap-1.5 text-amber-300 font-mono tabular-nums">
            <Coins className="w-3.5 h-3.5 text-amber-400" />
            <span>{shards.toLocaleString()}</span>
          </div>

          {/* Current Luck Multiplier */}
          <div className="hidden sm:flex items-center gap-1 text-cyan-300 font-mono tabular-nums text-xs">
            <Sparkles className="w-3.5 h-3.5 text-cyan-400" />
            <span className="font-semibold">{luckMultiplier.toFixed(1)}x</span>
          </div>

          {/* Dev Button if Admin */}
          {isAdmin && (
            <button
              onClick={onOpenDevPanel}
              className="py-1 px-2.5 rounded-lg bg-amber-500/20 hover:bg-amber-500/30 border border-amber-500/40 text-amber-300 text-xs font-bold font-mono transition-colors flex items-center gap-1.5 cursor-pointer shadow-sm"
              title="Tools"
            >
              <Wrench className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">Tools</span>
            </button>
          )}

          {/* Account Profile / Auth Button */}
          {currentUsername ? (
            <div className="flex items-center gap-1.5 bg-slate-900 border border-slate-800 rounded-lg px-2 py-1">
              <div className="flex items-center gap-1 text-xs">
                {isAdmin ? (
                  <ShieldCheck className="w-3.5 h-3.5 text-amber-400" />
                ) : (
                  <User className="w-3.5 h-3.5 text-slate-400" />
                )}
                <span className="font-medium text-slate-200 max-w-[80px] sm:max-w-[110px] truncate">
                  {currentUsername}
                </span>
              </div>
              <button
                onClick={onLogout}
                aria-label="Log Out"
                title="Log out"
                className="text-slate-400 hover:text-rose-400 p-0.5 rounded transition-colors cursor-pointer"
              >
                <LogOut className="w-3.5 h-3.5" />
              </button>
            </div>
          ) : (
            <button
              onClick={onOpenAuth}
              className="py-1 px-2.5 rounded-lg bg-slate-900 hover:bg-slate-800 border border-slate-800 text-slate-200 text-xs font-medium transition-colors flex items-center gap-1.5 cursor-pointer"
            >
              <User className="w-3.5 h-3.5 text-slate-400" />
              <span>Log In</span>
            </button>
          )}

          {/* Tutorial Guide Button */}
          {onOpenTutorial && (
            <button
              onClick={onOpenTutorial}
              aria-label="Open Tutorial Guide"
              title="How to Play / Guide"
              className="p-1.5 sm:p-2 text-cyan-400 hover:text-white transition-colors rounded-lg hover:bg-slate-800 cursor-pointer"
            >
              <HelpCircle className="w-4 h-4" />
            </button>
          )}

          {/* Sound Toggle Button */}
          <button
            onClick={onToggleSound}
            aria-label={soundEnabled ? 'Mute sound' : 'Unmute sound'}
            className="p-1.5 sm:p-2 text-slate-400 hover:text-white transition-colors rounded-lg hover:bg-slate-800 focus-visible:outline-2 focus-visible:outline-cyan-400 cursor-pointer"
          >
            {soundEnabled ? (
              <Volume2 className="w-4 h-4 text-cyan-400" />
            ) : (
              <VolumeX className="w-4 h-4 text-slate-500" />
            )}
          </button>
        </div>
      </div>
    </header>
  );
};

