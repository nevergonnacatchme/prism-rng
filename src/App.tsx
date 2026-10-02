import React, { useState, useEffect, useRef, useCallback } from 'react';
import { Analytics } from '@vercel/analytics/react';
import { TopBar, NavTab } from './components/TopBar';
import { RollChamber } from './components/RollChamber';
import { AuraStorageCompendium } from './components/AuraStorageCompendium';
import { InventoryView } from './components/InventoryView';
import { CollectionIndex } from './components/CollectionIndex';
import { AlchemistShop } from './components/AlchemistShop';
import { BossArena } from './components/BossArena';
import { GearsWorkshop } from './components/GearsWorkshop';
import { ChatRoom } from './components/ChatRoom';
import { ParticleCanvas } from './components/ParticleCanvas';
import { AuthModal } from './components/AuthModal';
import { DevPanel } from './components/DevPanel';
import { CutsceneOverlay } from './components/CutsceneOverlay';
import { TutorialModal } from './components/TutorialModal';
import { GuidedTour } from './components/GuidedTour';
import {
  ITEMS,
  ITEMS_BY_RARITY_DESC,
  RARITY_CONFIGS,
  isTop3RarestItem,
} from './data/items';
import { GEAR_ITEMS, GEARS_BY_ID } from './data/gears';
import { BIOMES, rollRandomBiome, getBiomeById } from './data/biomes';
import {
  RNGItem,
  InventorySlot,
  RollResult,
  ActivePotion,
  RarityTier,
  UserAccount,
  UserSavedState,
  ChatMessage,
  GearItem,
  Biome,
} from './types/rng';
import { sound } from './utils/audio';
import {
  initAccounts,
  getCurrentSessionUsername,
  saveUserGameState,
  clearCurrentSession,
} from './utils/auth';
import { validateAndFilterChatMessage } from './utils/chatFilter';

const GUEST_STORAGE_KEY = 'prism_rng_guest_state_v1';
const CHAT_STORAGE_KEY = 'prism_rng_chat_history_v2';
const RARE_ALERTS_KEY = 'prism_rng_rare_alerts_enabled';

export default function App() {
  // Navigation State
  const [currentTab, setCurrentTab] = useState<NavTab>('roll');
  const [selectedItem, setSelectedItem] = useState<RNGItem | null>(null);

  // Cutscene State
  const [activeCutsceneItem, setActiveCutsceneItem] = useState<RNGItem | null>(null);

  // Auth & Account State
  const [currentUser, setCurrentUser] = useState<UserAccount | null>(null);
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);
  const [isDevPanelOpen, setIsDevPanelOpen] = useState(false);
  const [customLuckOverride, setCustomLuckOverride] = useState<number | null>(null);

  // Sound State
  const [soundEnabled, setSoundEnabled] = useState<boolean>(() => {
    try {
      const saved = localStorage.getItem('prism_rng_sound');
      return saved !== null ? JSON.parse(saved) : true;
    } catch {
      return true;
    }
  });

  // Roll Mechanics State
  const [isRolling, setIsRolling] = useState(false);
  const [autoRoll, setAutoRoll] = useState(false);
  const [autoSkipCommon, setAutoSkipCommon] = useState(false);
  const [quickRoll, setQuickRoll] = useState(false);
  const [autoSkipCutscenes, setAutoSkipCutscenes] = useState<boolean>(() => {
    try {
      const saved = localStorage.getItem('coolrng_auto_skip_cutscenes');
      return saved ? JSON.parse(saved) : false;
    } catch {
      return false;
    }
  });

  // Welcome Onboarding Tutorial Modal State
  const [isTutorialOpen, setIsTutorialOpen] = useState<boolean>(() => {
    try {
      return localStorage.getItem('coolrng_tutorial_completed') !== 'true';
    } catch {
      return false;
    }
  });

  // Save cutscene preference
  useEffect(() => {
    try {
      localStorage.setItem('coolrng_auto_skip_cutscenes', JSON.stringify(autoSkipCutscenes));
    } catch {}
  }, [autoSkipCutscenes]);

  // Active Player Game State
  const [inventory, setInventory] = useState<Record<string, InventorySlot>>({});
  const [equippedItemId, setEquippedItemId] = useState<string | null>(null);
  const [equippedGearId, setEquippedGearId] = useState<string | null>(null);
  const [craftedGearIds, setCraftedGearIds] = useState<string[]>([]);
  const [totalRolls, setTotalRolls] = useState<number>(0);
  const [shards, setShards] = useState<number>(500);
  const [baseLuckLevel, setBaseLuckLevel] = useState<number>(1);
  const [activePotion, setActivePotion] = useState<ActivePotion | null>(null);

  // Session State
  const [lastRoll, setLastRoll] = useState<RollResult | null>(null);
  const [rollHistory, setRollHistory] = useState<RollResult[]>([]);
  const [burstTrigger, setBurstTrigger] = useState<{ rarity: RarityTier; id: number } | null>(null);

  // Biome Weather System State
  const [currentBiome, setCurrentBiome] = useState<Biome>(BIOMES[0]);
  const [biomeRemainingSec, setBiomeRemainingSec] = useState<number>(BIOMES[0].durationSeconds);

  // Biome Countdown Timer
  useEffect(() => {
    const timer = setInterval(() => {
      setBiomeRemainingSec((sec) => {
        if (sec <= 1) {
          // Biome expired -> check for another rare biome or return to Clear Horizon
          const next = rollRandomBiome() || BIOMES[0];
          setCurrentBiome(next);
          return next.durationSeconds;
        }
        return sec - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, []);

  // Chatroom State
  const [chatMessages, setChatMessages] = useState<ChatMessage[]>(() => {
    try {
      const saved = localStorage.getItem(CHAT_STORAGE_KEY);
      if (saved) {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed)) {
          return parsed;
        }
      }
    } catch {}
    return [];
  });

  const [showRareDropAlerts, setShowRareDropAlerts] = useState<boolean>(() => {
    try {
      const saved = localStorage.getItem(RARE_ALERTS_KEY);
      return saved !== null ? JSON.parse(saved) : true;
    } catch {
      return true;
    }
  });

  const [hasUnreadChat, setHasUnreadChat] = useState<boolean>(false);

  // Cross-tab & multi-session real-time communication channel
  const chatChannelRef = useRef<BroadcastChannel | null>(null);

  const broadcastBiomeChange = useCallback((biome: Biome, duration: number) => {
    try {
      localStorage.setItem('prism_rng_active_biome', JSON.stringify({ biome, duration, setAt: Date.now() }));
    } catch {}

    if (chatChannelRef.current) {
      try {
        chatChannelRef.current.postMessage({
          type: 'BIOME_CHANGED',
          biome,
          duration,
        });
      } catch {}
    }
  }, []);

  useEffect(() => {
    if (typeof window !== 'undefined' && 'BroadcastChannel' in window) {
      const channel = new BroadcastChannel('prism_rng_real_chat_channel');
      chatChannelRef.current = channel;

      channel.onmessage = (event) => {
        if (!event.data) return;

        if (event.data.type === 'NEW_MESSAGE') {
          const incomingMsg = event.data.message as ChatMessage;
          setChatMessages((prev) => {
            if (prev.some((m) => m.id === incomingMsg.id)) return prev;
            const updated = [...prev, incomingMsg];
            try {
              localStorage.setItem(CHAT_STORAGE_KEY, JSON.stringify(updated.slice(-100)));
            } catch {}
            return updated;
          });
          if (currentTab !== 'chat') {
            setHasUnreadChat(true);
          }
        } else if (event.data.type === 'BIOME_CHANGED') {
          const incomingBiome = event.data.biome as Biome;
          const duration = event.data.duration || incomingBiome.durationSeconds;
          setCurrentBiome(incomingBiome);
          setBiomeRemainingSec(duration);
          sound.playRareAlert();
        }
      };

      // Storage event listener fallback across windows
      const handleStorage = (e: StorageEvent) => {
        if (e.key === CHAT_STORAGE_KEY && e.newValue) {
          try {
            const parsed = JSON.parse(e.newValue);
            if (Array.isArray(parsed)) setChatMessages(parsed);
          } catch {}
        } else if (e.key === 'prism_rng_active_biome' && e.newValue) {
          try {
            const parsed = JSON.parse(e.newValue);
            if (parsed.biome) {
              setCurrentBiome(parsed.biome);
              setBiomeRemainingSec(parsed.duration || parsed.biome.durationSeconds);
            }
          } catch {}
        }
      };

      window.addEventListener('storage', handleStorage);

      return () => {
        channel.close();
        window.removeEventListener('storage', handleStorage);
      };
    }
  }, [currentTab]);

  // Save chat to localStorage on changes
  useEffect(() => {
    try {
      localStorage.setItem(CHAT_STORAGE_KEY, JSON.stringify(chatMessages.slice(-80)));
    } catch {}
  }, [chatMessages]);

  // Save alert preferences
  useEffect(() => {
    try {
      localStorage.setItem(RARE_ALERTS_KEY, JSON.stringify(showRareDropAlerts));
    } catch {}
  }, [showRareDropAlerts]);

  // Clear unread badge when entering chat
  useEffect(() => {
    if (currentTab === 'chat') {
      setHasUnreadChat(false);
    }
  }, [currentTab]);

  // Load account on mount or initialize guest
  useEffect(() => {
    const accounts = initAccounts();
    const sessionUsername = getCurrentSessionUsername();

    if (sessionUsername && accounts[sessionUsername.toLowerCase()]) {
      const acc = accounts[sessionUsername.toLowerCase()];
      setCurrentUser(acc);
      loadUserState(acc.savedState);
    } else {
      // Load guest state from localStorage
      try {
        const saved = localStorage.getItem(GUEST_STORAGE_KEY);
        if (saved) {
          const parsed = JSON.parse(saved);
          loadUserState(parsed);
        } else {
          initStarterState();
        }
      } catch {
        initStarterState();
      }
    }
  }, []);

  const initStarterState = () => {
    const starterPebble = ITEMS.find((i) => i.id === 'pebble')!;
    const starterApple = ITEMS.find((i) => i.id === 'apple')!;
    const initInv: Record<string, InventorySlot> = {
      pebble: {
        item: starterPebble,
        count: 1,
        firstDiscoveredAt: Date.now(),
        lastRolledAt: Date.now(),
      },
      apple: {
        item: starterApple,
        count: 1,
        firstDiscoveredAt: Date.now(),
        lastRolledAt: Date.now(),
      },
    };
    setInventory(initInv);
    setShards(20);
    setTotalRolls(0);
    setBaseLuckLevel(1);
    setEquippedItemId(null);
    setActivePotion(null);
    setLastRoll({
      item: starterApple,
      rollNumber: 1,
      timestamp: Date.now(),
      luckMultiplier: 1.0,
    });
  };

  const loadUserState = (saved: UserSavedState) => {
    const hydrated: Record<string, InventorySlot> = {};
    if (saved.inventory) {
      Object.keys(saved.inventory).forEach((id) => {
        const matchedItem = ITEMS.find((it) => it.id === id);
        if (matchedItem) {
          hydrated[id] = {
            item: matchedItem,
            count: saved.inventory[id].count || 1,
            firstDiscoveredAt: saved.inventory[id].firstDiscoveredAt || Date.now(),
            lastRolledAt: saved.inventory[id].lastRolledAt || Date.now(),
          };
        }
      });
    }
    setInventory(hydrated);
    setEquippedItemId(saved.equippedItemId || null);
    setEquippedGearId(saved.equippedGearId || null);
    setCraftedGearIds(Array.isArray(saved.craftedGearIds) ? saved.craftedGearIds : []);
    setTotalRolls(saved.totalRolls || 0);
    setShards(typeof saved.shards === 'number' ? saved.shards : 20);
    setBaseLuckLevel(saved.baseLuckLevel || 1);
    setActivePotion(saved.activePotion || null);
    if (typeof saved.devCustomLuck === 'number') {
      setCustomLuckOverride(saved.devCustomLuck);
    }
  };

  // Save current player state to localStorage (user account or guest)
  useEffect(() => {
    const stateToSave: UserSavedState = {
      inventory: Object.fromEntries(
        Object.entries(inventory).map(([id, slot]) => [
          id,
          {
            count: slot.count,
            firstDiscoveredAt: slot.firstDiscoveredAt,
            lastRolledAt: slot.lastRolledAt,
          },
        ])
      ),
      equippedItemId,
      equippedGearId,
      craftedGearIds,
      totalRolls,
      shards,
      baseLuckLevel,
      activePotion,
      devCustomLuck: customLuckOverride || undefined,
    };

    if (currentUser) {
      saveUserGameState(currentUser.username, stateToSave);
    } else {
      try {
        localStorage.setItem(GUEST_STORAGE_KEY, JSON.stringify(stateToSave));
      } catch {}
    }
  }, [
    currentUser,
    inventory,
    equippedItemId,
    equippedGearId,
    craftedGearIds,
    totalRolls,
    shards,
    baseLuckLevel,
    activePotion,
    customLuckOverride,
  ]);

  // Sync sound engine enabled state
  useEffect(() => {
    sound.enabled = soundEnabled;
    try {
      localStorage.setItem('prism_rng_sound', JSON.stringify(soundEnabled));
    } catch {}
  }, [soundEnabled]);

  const toggleSound = () => {
    setSoundEnabled((prev) => !prev);
  };

  // Find equipped item and gear
  const equippedItem = equippedItemId ? ITEMS.find((i) => i.id === equippedItemId) || null : null;
  const equippedGear = equippedGearId ? GEARS_BY_ID[equippedGearId] || null : null;

  // Calculate total luck multiplier
  const baseLuck = 1.0 + (baseLuckLevel - 1) * 0.1;
  const charmBonus = equippedItem ? equippedItem.luckBonus / 100 : 0;
  const gearBonus = equippedGear ? equippedGear.luckBonus / 100 : 0;
  const potionMultiplier = activePotion ? activePotion.multiplier : 1.0;
  const calculatedLuck = (baseLuck + charmBonus + gearBonus) * potionMultiplier;
  const finalLuckMultiplier = customLuckOverride !== null ? customLuckOverride : calculatedLuck;

  // Helper to broadcast a top 3 rarest aura drop to the chatroom (ONLY when someone actually rolls it)
  const broadcastTop3Drop = useCallback((item: RNGItem, senderName: string, isSenderAdmin: boolean) => {
    const newMsg: ChatMessage = {
      id: `alert-${Date.now()}-${Math.random()}`,
      sender: senderName,
      type: 'rare_drop_alert',
      content: `${senderName} unlocked ${item.name}!`,
      timestamp: Date.now(),
      isAdmin: isSenderAdmin,
      itemData: {
        name: item.name,
        emoji: item.emoji,
        rarity: item.rarity,
        baseChance: item.baseChance,
      },
    };

    setChatMessages((prev) => [...prev, newMsg]);

    if (chatChannelRef.current) {
      try {
        chatChannelRef.current.postMessage({ type: 'NEW_MESSAGE', message: newMsg });
      } catch {}
    }

    if (currentTab !== 'chat') {
      setHasUnreadChat(true);
    }
  }, [currentTab]);

  // Perform single RNG roll calculation
  const executeRoll = useCallback(() => {
    if (isRolling) return;

    setIsRolling(true);

    const rollDuration = quickRoll ? 100 : 500;

    // Play rolling tick or shimmer sound
    if (!quickRoll) {
      sound.playRollShimmer();
    } else {
      sound.playTick();
    }

    setTimeout(() => {
      // Probability Algorithm with Biome Multipliers:
      let rolledItem: RNGItem | null = null;

      for (const candidate of ITEMS_BY_RARITY_DESC) {
        // Biome Exclusive Check: Item can ONLY drop if player is in its exclusive biome!
        if (candidate.isBiomeExclusive && candidate.exclusiveBiomeId && candidate.exclusiveBiomeId !== currentBiome.id) {
          continue;
        }

        // Check if candidate aura has a lucky boost in the active biome!
        const biomeBoost = currentBiome.boostedAuras.find((b) => b.itemId === candidate.id);
        const boostMultiplier = biomeBoost ? biomeBoost.multiplier : 1.0;
        const effectiveBaseChance = candidate.baseChance / boostMultiplier;

        const effectiveProbability = Math.min(1.0, finalLuckMultiplier / effectiveBaseChance);
        if (Math.random() < effectiveProbability) {
          rolledItem = candidate;
          break;
        }
      }

      // Safeguard fallback to Pebble
      if (!rolledItem) {
        rolledItem = ITEMS.find((i) => i.id === 'pebble')!;
      }

      // Chance for a rare Biome Shift Event on roll!
      const rolledBiome = rollRandomBiome();
      if (rolledBiome && rolledBiome.id !== currentBiome.id) {
        setCurrentBiome(rolledBiome);
        setBiomeRemainingSec(rolledBiome.durationSeconds);
        sound.playRareAlert();
        broadcastBiomeChange(rolledBiome, rolledBiome.durationSeconds);
      }

      const newRollCount = totalRolls + 1;
      const result: RollResult = {
        item: rolledItem,
        rollNumber: newRollCount,
        timestamp: Date.now(),
        luckMultiplier: finalLuckMultiplier,
      };

      // Play drop sound
      if (rolledItem.id === 'napoleon') {
        sound.playAmourPlastique();
      } else {
        sound.playDrop(rolledItem.rarity);
      }

      // Trigger particle burst for visual effects
      setBurstTrigger({ rarity: rolledItem.rarity, id: Date.now() });

      // Check if item is one of the top 3 rarest auras!
      if (isTop3RarestItem(rolledItem.id)) {
        const playerName = currentUser ? currentUser.username : 'GuestRoller';
        broadcastTop3Drop(rolledItem, playerName, !!currentUser?.isAdmin);
      }

      // Trigger dramatic cutscene for Impossible / Transcendent / Celestial / Mythic auras (if not auto-skipped)!
      if (
        !autoSkipCutscenes &&
        (rolledItem.rarity === 'Impossible' ||
         rolledItem.rarity === 'Transcendent' ||
         rolledItem.rarity === 'Celestial' ||
         rolledItem.rarity === 'Mythic')
      ) {
        setAutoRoll(false); // Pause auto-roll so player enjoys the moment
        setActiveCutsceneItem(rolledItem);
      }

      // Update state
      setLastRoll(result);
      setTotalRolls(newRollCount);
      setRollHistory((prev) => [result, ...prev.slice(0, 19)]);

      // Grant 1 passive shard per roll + chance for bonus shards
      setShards((prev) => prev + 1 + (rolledItem!.rarity !== 'Common' ? 2 : 0));

      // Update inventory
      setInventory((prev) => {
        const existing = prev[rolledItem!.id];
        if (existing) {
          return {
            ...prev,
            [rolledItem!.id]: {
              ...existing,
              count: existing.count + 1,
              lastRolledAt: Date.now(),
            },
          };
        } else {
          return {
            ...prev,
            [rolledItem!.id]: {
              item: rolledItem!,
              count: 1,
              firstDiscoveredAt: Date.now(),
              lastRolledAt: Date.now(),
            },
          };
        }
      });

      // Update active potion rolls
      if (activePotion) {
        setActivePotion((prev) => {
          if (!prev) return null;
          const remaining = prev.remainingRolls - 1;
          if (remaining <= 0) return null;
          return { ...prev, remainingRolls: remaining };
        });
      }

      setIsRolling(false);
    }, rollDuration);
  }, [isRolling, quickRoll, finalLuckMultiplier, totalRolls, activePotion, currentUser, broadcastTop3Drop]);

  // Dev Feature: Force roll a chosen item
  const handleForceRollItem = (targetItem: RNGItem) => {
    setCurrentTab('roll');
    setIsRolling(true);

    if (!quickRoll) {
      sound.playRollShimmer();
    } else {
      sound.playTick();
    }

    const duration = quickRoll ? 100 : 500;

    setTimeout(() => {
      const newRollCount = totalRolls + 1;
      const result: RollResult = {
        item: targetItem,
        rollNumber: newRollCount,
        timestamp: Date.now(),
        luckMultiplier: finalLuckMultiplier,
      };

      if (targetItem.id === 'napoleon') {
        sound.playAmourPlastique();
      } else {
        sound.playDrop(targetItem.rarity);
      }
      setBurstTrigger({ rarity: targetItem.rarity, id: Date.now() });

      // If top 3 rarest, broadcast it!
      if (isTop3RarestItem(targetItem.id)) {
        const playerName = currentUser ? currentUser.username : 'GuestRoller';
        broadcastTop3Drop(targetItem, playerName, !!currentUser?.isAdmin);
      }

      // Trigger cutscene if high rarity
      if (
        targetItem.rarity === 'Impossible' ||
        targetItem.rarity === 'Transcendent' ||
        targetItem.rarity === 'Celestial' ||
        targetItem.rarity === 'Mythic' ||
        targetItem.rarity === 'Legendary'
      ) {
        setActiveCutsceneItem(targetItem);
      }

      setLastRoll(result);
      setTotalRolls(newRollCount);
      setRollHistory((prev) => [result, ...prev.slice(0, 19)]);

      // Add to inventory
      setInventory((prev) => {
        const existing = prev[targetItem.id];
        if (existing) {
          return {
            ...prev,
            [targetItem.id]: {
              ...existing,
              count: existing.count + 1,
              lastRolledAt: Date.now(),
            },
          };
        } else {
          return {
            ...prev,
            [targetItem.id]: {
              item: targetItem,
              count: 1,
              firstDiscoveredAt: Date.now(),
              lastRolledAt: Date.now(),
            },
          };
        }
      });

      setIsRolling(false);
    }, duration);
  };

  // Dev Feature: Grant items to inventory
  const handleGrantItem = (item: RNGItem, count: number) => {
    setInventory((prev) => {
      const existing = prev[item.id];
      if (existing) {
        return {
          ...prev,
          [item.id]: {
            ...existing,
            count: existing.count + count,
            lastRolledAt: Date.now(),
          },
        };
      }
      return {
        ...prev,
        [item.id]: {
          item,
          count,
          firstDiscoveredAt: Date.now(),
          lastRolledAt: Date.now(),
        },
      };
    });
  };

  // Dev Feature: Grant shards
  const handleAddShards = (amount: number) => {
    setShards((prev) => prev + amount);
  };

  // Dev Feature: Unlock 1 of all 16 items
  const handleUnlockAllItems = () => {
    setInventory((prev) => {
      const updated = { ...prev };
      ITEMS.forEach((it) => {
        if (!updated[it.id]) {
          updated[it.id] = {
            item: it,
            count: 1,
            firstDiscoveredAt: Date.now(),
            lastRolledAt: Date.now(),
          };
        }
      });
      return updated;
    });
  };

  // Auto-Roll Interval Effect
  const autoRollTimerRef = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    if (!autoRoll) {
      if (autoRollTimerRef.current) {
        clearInterval(autoRollTimerRef.current);
        autoRollTimerRef.current = null;
      }
      return;
    }

    const rollSpeedCoeff = equippedGear ? (1 - equippedGear.rollCooldownReduction / 100) : 1;
    const intervalMs = Math.max(90, Math.round((quickRoll ? 250 : 1200) * rollSpeedCoeff));

    autoRollTimerRef.current = setInterval(() => {
      if (!isRolling) {
        executeRoll();
      }
    }, intervalMs);

    return () => {
      if (autoRollTimerRef.current) {
        clearInterval(autoRollTimerRef.current);
      }
    };
  }, [autoRoll, isRolling, quickRoll, executeRoll, equippedGear]);

  // Gear Crafting Actions
  const handleCraftGear = (gear: GearItem): boolean => {
    // Verify player has all ingredients
    const hasAll = gear.recipe.every((ing) => {
      const slot = inventory[ing.itemId];
      return slot && slot.count >= ing.count;
    });

    if (!hasAll) return false;

    // Deduct ingredients
    setInventory((prev) => {
      const updated = { ...prev };
      gear.recipe.forEach((ing) => {
        if (updated[ing.itemId]) {
          const newCount = updated[ing.itemId].count - ing.count;
          if (newCount <= 0) {
            delete updated[ing.itemId];
          } else {
            updated[ing.itemId] = {
              ...updated[ing.itemId],
              count: newCount,
            };
          }
        }
      });
      return updated;
    });

    // Mark as crafted
    setCraftedGearIds((prev) => Array.from(new Set([...prev, gear.id])));

    // Auto-equip if nothing is equipped
    if (!equippedGearId) {
      setEquippedGearId(gear.id);
    }

    return true;
  };

  const handleEquipGear = (gearId: string) => {
    setEquippedGearId(gearId);
    sound.playEquip();
  };

  const handleUnequipGear = () => {
    setEquippedGearId(null);
    sound.playTick();
  };

  const handleUnlockAllGears = () => {
    setCraftedGearIds(GEAR_ITEMS.map((g) => g.id));
    if (!equippedGearId) {
      setEquippedGearId(GEAR_ITEMS[GEAR_ITEMS.length - 1].id); // Equip Imperial Gauntlet
    }
  };

  // Actions
  const handleEquipItem = (item: RNGItem) => {
    setEquippedItemId(item.id);
    sound.playEquip();
  };

  const handleUnequipItem = () => {
    setEquippedItemId(null);
    sound.playTick();
  };

  const handleSalvageItem = (item: RNGItem, count: number) => {
    const slot = inventory[item.id];
    if (!slot || slot.count <= 0) return;

    const actualCount = Math.min(count, slot.count);
    const shardsGained = actualCount * item.sellValue;

    sound.playCoin();
    setShards((prev) => prev + shardsGained);

    setInventory((prev) => {
      const current = prev[item.id];
      if (!current) return prev;
      const newCount = current.count - actualCount;
      if (newCount <= 0) {
        const copy = { ...prev };
        delete copy[item.id];
        return copy;
      }
      return {
        ...prev,
        [item.id]: {
          ...current,
          count: newCount,
        },
      };
    });

    if (slot.count - actualCount <= 0 && equippedItemId === item.id) {
      setEquippedItemId(null);
    }
  };

  const handleBuyPotion = (potionConfig: {
    id: string;
    name: string;
    multiplier: number;
    duration: number;
    cost: number;
    icon: string;
  }) => {
    if (shards < potionConfig.cost) return;
    setShards((prev) => prev - potionConfig.cost);
    setActivePotion({
      id: potionConfig.id,
      name: potionConfig.name,
      multiplier: potionConfig.multiplier,
      remainingRolls: potionConfig.duration,
      icon: potionConfig.icon,
    });
    sound.playEquip();
  };

  const handleUpgradeBaseLuck = (cost: number) => {
    if (shards < cost) return;
    setShards((prev) => prev - cost);
    setBaseLuckLevel((prev) => prev + 1);
    sound.playEquip();
  };

  const handleResetProgress = () => {
    if (window.confirm('Are you sure you want to reset all progress and rolls? This cannot be undone.')) {
      initStarterState();
    }
  };

  // Auth actions
  const handleAuthSuccess = (account: UserAccount) => {
    setCurrentUser(account);
    loadUserState(account.savedState);
    sound.playEquip();
  };

  const handleLogout = () => {
    clearCurrentSession();
    setCurrentUser(null);
    setIsDevPanelOpen(false);
    setCustomLuckOverride(null);
    initStarterState();
  };

  // Chat send handler
  const handleSendMessage = (text: string) => {
    const filter = validateAndFilterChatMessage(text);
    if (!filter.allowed) {
      return { success: false, reason: filter.reason };
    }

    const senderName = currentUser ? currentUser.username : 'GuestRoller';
    const newMsg: ChatMessage = {
      id: `user-${Date.now()}-${Math.random()}`,
      sender: senderName,
      type: 'user',
      content: filter.cleanedText,
      timestamp: Date.now(),
      isAdmin: !!currentUser?.isAdmin,
    };

    setChatMessages((prev) => [...prev, newMsg]);

    if (chatChannelRef.current) {
      try {
        chatChannelRef.current.postMessage({ type: 'NEW_MESSAGE', message: newMsg });
      } catch {}
    }

    sound.playTick();
    return { success: true };
  };

  const activeRarity = lastRoll?.item?.rarity || 'Common';
  const isAdmin = !!currentUser?.isAdmin;
  const activeUsername = currentUser ? currentUser.username : 'GuestRoller';

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col font-sans selection:bg-cyan-500 selection:text-slate-950 relative overflow-x-hidden">
      {/* 2D Canvas Particle Engine with Dynamic Biome Weather */}
      <ParticleCanvas
        burstTrigger={burstTrigger}
        activeRarity={activeRarity}
        activeBiome={currentBiome}
      />

      {/* Top Bar Contract (3 zones) */}
      <TopBar
        currentTab={currentTab}
        onTabChange={(tab) => {
          setCurrentTab(tab);
          setSelectedItem(null);
        }}
        soundEnabled={soundEnabled}
        onToggleSound={toggleSound}
        luckMultiplier={finalLuckMultiplier}
        equippedItem={equippedItem}
        shards={shards}
        totalRolls={totalRolls}
        inventoryCount={Object.keys(inventory).length}
        currentUsername={currentUser ? currentUser.username : null}
        isAdmin={isAdmin}
        onOpenAuth={() => setIsAuthModalOpen(true)}
        onLogout={handleLogout}
        onOpenDevPanel={() => setIsDevPanelOpen(true)}
        onOpenTutorial={() => setIsTutorialOpen(true)}
        hasUnreadChat={hasUnreadChat}
      />

      {/* Main Content Area */}
      <main className="flex-1 relative z-10">
        {currentTab === 'roll' && (
          <RollChamber
            lastRoll={lastRoll}
            onRoll={executeRoll}
            isRolling={isRolling}
            autoRoll={autoRoll}
            onToggleAutoRoll={() => setAutoRoll((prev) => !prev)}
            autoSkipCommon={autoSkipCommon}
            onToggleAutoSkipCommon={() => setAutoSkipCommon((prev) => !prev)}
            quickRoll={quickRoll}
            onToggleQuickRoll={() => setQuickRoll((prev) => !prev)}
            autoSkipCutscenes={autoSkipCutscenes}
            onToggleAutoSkipCutscenes={() => setAutoSkipCutscenes((prev) => !prev)}
            onOpenTutorial={() => setIsTutorialOpen(true)}
            luckMultiplier={finalLuckMultiplier}
            equippedItem={equippedItem}
            equippedGear={equippedGear}
            activePotion={activePotion}
            rollHistory={rollHistory}
            totalRolls={totalRolls}
            activeBiome={currentBiome}
            biomeRemainingSec={biomeRemainingSec}
            onInspectItem={(item) => {
              setSelectedItem(item);
              setCurrentTab('inventory');
            }}
            onPlayCutscene={(item) => setActiveCutsceneItem(item)}
            onNavigateTab={(tab) => setCurrentTab(tab)}
          />
        )}

        {currentTab === 'arena' && (
          <BossArena
            equippedAura={equippedItem || ITEMS[0]}
            inventory={inventory}
            onEquipAura={handleEquipItem}
            shards={shards}
            onAddShards={handleAddShards}
          />
        )}

        {currentTab === 'workshop' && (
          <GearsWorkshop
            inventory={inventory}
            equippedGearId={equippedGearId}
            craftedGearIds={craftedGearIds}
            onCraftGear={handleCraftGear}
            onEquipGear={handleEquipGear}
            onUnequipGear={handleUnequipGear}
          />
        )}

        {currentTab === 'inventory' && (
          <AuraStorageCompendium
            inventory={inventory}
            equippedItemId={equippedItemId}
            onEquipItem={handleEquipItem}
            onUnequipItem={handleUnequipItem}
            onSalvageItem={handleSalvageItem}
            shards={shards}
            totalRolls={totalRolls}
            luckMultiplier={finalLuckMultiplier}
          />
        )}

        {currentTab === 'index' && (
          <CollectionIndex
            inventory={inventory}
            onInspectItem={(item) => {
              setSelectedItem(item);
              setCurrentTab('inventory');
            }}
          />
        )}

        {currentTab === 'shop' && (
          <AlchemistShop
            shards={shards}
            activePotion={activePotion}
            baseLuckLevel={baseLuckLevel}
            onBuyPotion={handleBuyPotion}
            onUpgradeBaseLuck={handleUpgradeBaseLuck}
            onResetProgress={handleResetProgress}
          />
        )}

        {currentTab === 'chat' && (
          <ChatRoom
            messages={chatMessages}
            onSendMessage={handleSendMessage}
            currentUsername={activeUsername}
            isAdmin={isAdmin}
            showRareDropAlerts={showRareDropAlerts}
            onToggleShowRareDropAlerts={() => setShowRareDropAlerts((prev) => !prev)}
            onInspectItemByName={(itemName) => {
              const matched = ITEMS.find((it) => it.name.toLowerCase() === itemName.toLowerCase());
              if (matched) {
                setSelectedItem(matched);
                setCurrentTab('inventory');
              }
            }}
          />
        )}
      </main>

      {/* Auth Modal (Sign In / Register) */}
      <AuthModal
        isOpen={isAuthModalOpen}
        onClose={() => setIsAuthModalOpen(false)}
        onAuthSuccess={handleAuthSuccess}
        currentUsername={currentUser?.username}
      />

      {/* Control Panel (Only for dev85) */}
      {isAdmin && (
        <DevPanel
          isOpen={isDevPanelOpen}
          onClose={() => setIsDevPanelOpen(false)}
          shards={shards}
          onAddShards={handleAddShards}
          onGrantItem={handleGrantItem}
          onForceRollItem={handleForceRollItem}
          onUnlockAllItems={handleUnlockAllItems}
          customLuckOverride={customLuckOverride}
          onSetCustomLuck={setCustomLuckOverride}
          onPlayCutscene={(item) => setActiveCutsceneItem(item)}
          onUnlockAllGears={handleUnlockAllGears}
          activeBiome={currentBiome}
          onSetBiome={(b) => {
            setCurrentBiome(b);
            setBiomeRemainingSec(b.durationSeconds);
            broadcastBiomeChange(b, b.durationSeconds);
          }}
          onGrantPotion={(potion) => setActivePotion(potion)}
        />
      )}

      {/* Dramatic Cinematic Cutscene Overlay */}
      {activeCutsceneItem && (
        <CutsceneOverlay
          item={activeCutsceneItem}
          onComplete={() => setActiveCutsceneItem(null)}
          autoSkipCutscenes={autoSkipCutscenes}
          onToggleAutoSkipCutscenes={() => setAutoSkipCutscenes((prev) => !prev)}
        />
      )}

      {/* Playable Interactive Onboarding Guided Tour */}
      <GuidedTour
        isActive={isTutorialOpen}
        currentTab={currentTab}
        onNavigateTab={(tab) => setCurrentTab(tab)}
        onCloseTour={(bonusShards) => {
          setIsTutorialOpen(false);
          if (bonusShards) {
            setShards((prev) => prev + bonusShards);
          }
        }}
      />

      {/* Vercel Web Analytics */}
      <Analytics />
    </div>
  );
}
