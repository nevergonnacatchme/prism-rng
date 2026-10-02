import { UserAccount, UserSavedState, LeaderboardPlayer, RarityTier } from '../types/rng';
import { ITEMS, RARITY_CONFIGS } from '../data/items';

const ACCOUNTS_STORAGE_KEY = 'prism_rng_accounts_v2';
const CURRENT_USER_KEY = 'prism_rng_current_user';

export const ADMIN_USERNAME = 'dev85';
export const ADMIN_PASSWORD = 'marleyismydog';

function createDefaultState(isAdmin = false): UserSavedState {
  const now = Date.now();
  return {
    inventory: {
      pebble: {
        count: 1,
        firstDiscoveredAt: now,
        lastRolledAt: now,
      },
      apple: {
        count: 1,
        firstDiscoveredAt: now,
        lastRolledAt: now,
      },
    },
    equippedItemId: null,
    totalRolls: isAdmin ? 12050 : 0,
    shards: isAdmin ? 10000 : 20,
    baseLuckLevel: 1,
    activePotion: null,
  };
}

// Ensure dev85 admin account and verified community accounts exist
export function initAccounts(): Record<string, UserAccount> {
  let accounts: Record<string, UserAccount> = {};
  try {
    const raw = localStorage.getItem(ACCOUNTS_STORAGE_KEY);
    if (raw) {
      accounts = JSON.parse(raw);
    }
  } catch {
    accounts = {};
  }

  // Ensure dev85 admin account exists with the exact requested credentials
  const devKey = ADMIN_USERNAME.toLowerCase();
  if (!accounts[devKey]) {
    accounts[devKey] = {
      username: ADMIN_USERNAME,
      password: ADMIN_PASSWORD,
      isAdmin: true,
      createdAt: Date.now(),
      savedState: createDefaultState(true),
    };
  } else {
    // Keep credentials synchronized with requested password
    accounts[devKey].isAdmin = true;
    accounts[devKey].password = ADMIN_PASSWORD;
  }

  try {
    localStorage.setItem(ACCOUNTS_STORAGE_KEY, JSON.stringify(accounts));
  } catch {}

  return accounts;
}

export function getAllAccounts(): Record<string, UserAccount> {
  return initAccounts();
}

/**
 * Returns the read-only top 5 global leaderboard based on total rolls.
 * Excludes guest rollers — only genuine registered accounts qualify!
 */
export function getTopRollersLeaderboard(limit = 5): LeaderboardPlayer[] {
  const accounts = getAllAccounts();
  const list = Object.values(accounts).map((acc) => {
    let bestName = 'Smooth Pebble';
    let bestEmoji = '🪨';
    let bestRarity: RarityTier = 'Common';
    let highestOrder = 0;

    if (acc.savedState?.inventory) {
      Object.keys(acc.savedState.inventory).forEach((itemId) => {
        const item = ITEMS.find((i) => i.id === itemId);
        if (item) {
          const order = RARITY_CONFIGS[item.rarity]?.order || 0;
          if (order > highestOrder) {
            highestOrder = order;
            bestName = item.name;
            bestEmoji = item.emoji;
            bestRarity = item.rarity;
          }
        }
      });
    }

    return {
      username: acc.username,
      totalRolls: acc.savedState?.totalRolls || 0,
      isAdmin: !!acc.isAdmin,
      bestAuraName: bestName,
      bestAuraEmoji: bestEmoji,
      bestAuraRarity: bestRarity,
    };
  });

  // Sort descending by total number of rolls
  list.sort((a, b) => b.totalRolls - a.totalRolls);

  return list.slice(0, limit).map((player, idx) => ({
    ...player,
    rank: idx + 1,
  }));
}

export function registerAccount(
  usernameInput: string,
  passwordInput: string
): { success: boolean; error?: string; account?: UserAccount } {
  const username = usernameInput.trim();
  const password = passwordInput.trim();

  if (!username) {
    return { success: false, error: 'Username cannot be empty.' };
  }

  if (username.length < 3) {
    return { success: false, error: 'Username must be at least 3 characters long.' };
  }

  if (username.length > 20) {
    return { success: false, error: 'Username cannot exceed 20 characters.' };
  }

  if (!/^[a-zA-Z0-9_-]+$/.test(username)) {
    return { success: false, error: 'Username can only contain letters, numbers, hyphens, and underscores.' };
  }

  if (!password) {
    return { success: false, error: 'Password cannot be empty.' };
  }

  if (password.length < 4) {
    return { success: false, error: 'Password must be at least 4 characters long.' };
  }

  const accounts = getAllAccounts();
  const key = username.toLowerCase();

  // Enforce unique username constraint
  if (accounts[key]) {
    return {
      success: false,
      error: `Username "${username}" is already taken. Please choose another username.`,
    };
  }

  const newAccount: UserAccount = {
    username,
    password,
    isAdmin: key === ADMIN_USERNAME.toLowerCase(),
    createdAt: Date.now(),
    savedState: createDefaultState(key === ADMIN_USERNAME.toLowerCase()),
  };

  accounts[key] = newAccount;

  try {
    localStorage.setItem(ACCOUNTS_STORAGE_KEY, JSON.stringify(accounts));
    localStorage.setItem(CURRENT_USER_KEY, username);
  } catch {
    return { success: false, error: 'Storage error. Please try again.' };
  }

  return { success: true, account: newAccount };
}

export function loginAccount(
  usernameInput: string,
  passwordInput: string
): { success: boolean; error?: string; account?: UserAccount } {
  const username = usernameInput.trim();
  const password = passwordInput.trim();

  if (!username || !password) {
    return { success: false, error: 'Please enter both username and password.' };
  }

  const accounts = getAllAccounts();
  const key = username.toLowerCase();
  const account = accounts[key];

  if (!account) {
    return { success: false, error: `Account "${username}" was not found.` };
  }

  if (account.password !== password) {
    return { success: false, error: 'Incorrect password.' };
  }

  try {
    localStorage.setItem(CURRENT_USER_KEY, account.username);
  } catch {}

  return { success: true, account };
}

export function saveUserGameState(username: string, state: UserSavedState) {
  try {
    const accounts = getAllAccounts();
    const key = username.toLowerCase();
    if (accounts[key]) {
      accounts[key].savedState = state;
      localStorage.setItem(ACCOUNTS_STORAGE_KEY, JSON.stringify(accounts));
    }
  } catch {}
}

export function getCurrentSessionUsername(): string | null {
  try {
    return localStorage.getItem(CURRENT_USER_KEY);
  } catch {
    return null;
  }
}

export function clearCurrentSession() {
  try {
    localStorage.removeItem(CURRENT_USER_KEY);
  } catch {}
}

export function grantShardsToAccount(username: string, amount: number): number | null {
  try {
    const accounts = getAllAccounts();
    const key = username.toLowerCase();
    if (!accounts[key]) return null;

    const currentShards = accounts[key].savedState.shards || 0;
    const newShards = Math.max(0, currentShards + amount);
    accounts[key].savedState.shards = newShards;

    localStorage.setItem(ACCOUNTS_STORAGE_KEY, JSON.stringify(accounts));
    return newShards;
  } catch {
    return null;
  }
}

export function grantItemToAccount(username: string, itemId: string, count = 1): boolean {
  try {
    const accounts = getAllAccounts();
    const key = username.toLowerCase();
    if (!accounts[key]) return false;

    if (!accounts[key].savedState.inventory) {
      accounts[key].savedState.inventory = {};
    }

    const cur = accounts[key].savedState.inventory[itemId];
    if (cur) {
      cur.count += count;
      cur.lastRolledAt = Date.now();
    } else {
      accounts[key].savedState.inventory[itemId] = {
        count,
        firstDiscoveredAt: Date.now(),
        lastRolledAt: Date.now(),
      };
    }

    localStorage.setItem(ACCOUNTS_STORAGE_KEY, JSON.stringify(accounts));
    return true;
  } catch {
    return false;
  }
}

export function setAccountAdminRole(username: string, isAdmin: boolean): boolean {
  try {
    const accounts = getAllAccounts();
    const key = username.toLowerCase();
    if (!accounts[key]) return false;

    accounts[key].isAdmin = isAdmin;
    localStorage.setItem(ACCOUNTS_STORAGE_KEY, JSON.stringify(accounts));
    return true;
  } catch {
    return false;
  }
}

export function deleteAccountByUsername(username: string): boolean {
  try {
    const accounts = getAllAccounts();
    const key = username.toLowerCase();
    if (!accounts[key] || key === ADMIN_USERNAME.toLowerCase()) return false;

    delete accounts[key];
    localStorage.setItem(ACCOUNTS_STORAGE_KEY, JSON.stringify(accounts));
    return true;
  } catch {
    return false;
  }
}

