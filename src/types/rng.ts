export type RarityTier =
  | 'Common'
  | 'Uncommon'
  | 'Rare'
  | 'Epic'
  | 'Legendary'
  | 'Mythic'
  | 'Celestial'
  | 'Transcendent'
  | 'Impossible';

export interface RarityConfig {
  name: RarityTier;
  color: string;
  bgColor: string;
  borderColor: string;
  glowColor: string;
  order: number;
}

export interface AuraAbility {
  name: string;
  description: string;
  cooldownSec: number;
  multiplier: number;
  effectType: 'damage' | 'heal' | 'shield' | 'stun' | 'burn' | 'time_freeze' | 'artillery';
  effectValue: number;
  icon: string;
  voiceLine?: string;
}

export interface AuraCombatStats {
  health: number;
  attack: number;
  defense: number;
  attackSpeed: number;
  critChance: number;
}

export interface RNGItem {
  id: string;
  name: string;
  emoji: string;
  rarity: RarityTier;
  baseChance: number; // e.g. 10 means 1 in 10 (10%), 10000 means 1 in 10,000
  luckBonus: number; // percentage luck bonus when equipped, e.g. 15 for +15%
  sellValue: number; // shards gained when salvaging
  description: string;
  flavorText: string;
  accentColor: string;
  svgIcon?: string;
  imageUrl?: string;
  ability?: AuraAbility;
  combatStats?: AuraCombatStats;
  isBiomeExclusive?: boolean;
  exclusiveBiomeId?: string;
  exclusiveBiomeName?: string;
}

export interface BossAbility {
  name: string;
  description: string;
  chargeTimeSec: number;
  damage: number;
  effectType: 'slam' | 'burn' | 'siphon' | 'time_freeze' | 'cataclysm';
  effectDurationSec: number;
  icon: string;
}

export interface BossLevel {
  level: number;
  id: string;
  name: string;
  title: string;
  emoji: string;
  themeColor: string;
  bgGradient: string;
  maxHealth: number;
  attack: number;
  defense: number;
  attackSpeed: number;
  ability: BossAbility;
  shardReward: number;
  itemRewardName: string;
  flavorQuote: string;
}

export interface InventorySlot {
  item: RNGItem;
  count: number;
  firstDiscoveredAt: number;
  lastRolledAt: number;
}

export interface RollResult {
  item: RNGItem;
  rollNumber: number;
  timestamp: number;
  luckMultiplier: number;
}

export interface ActivePotion {
  id: string;
  name: string;
  multiplier: number;
  remainingRolls: number;
  icon: string;
}

export interface Biome {
  id: string;
  name: string;
  emoji: string;
  rarityChance: number; // e.g. 1 in 150
  color: string;
  gradientBg: string;
  description: string;
  flavorQuote: string;
  boostedAuras: { itemId: string; multiplier: number }[];
  ambientParticleType: 'clear' | 'snow' | 'space' | 'fire' | 'thunder' | 'void' | 'wind' | 'glitch' | 'celestial';
  durationSeconds: number;
}

export interface PlayerStats {
  totalRolls: number;
  commonRolls: number;
  rareRolls: number; // Rare or higher
  legendaryRolls: number; // Legendary or higher
  highestRarity: RarityTier;
  bestItemName: string;
  bestItemChance: number;
  shards: number;
}

export interface GearRecipeIngredient {
  itemId: string;
  itemName: string;
  itemEmoji: string;
  count: number;
}

export interface GearItem {
  id: string;
  name: string;
  type: 'glove' | 'device';
  icon: string;
  tier: number;
  luckBonus: number; // percentage luck bonus, e.g. 50 for +50%
  rollCooldownReduction: number; // percentage reduction, e.g. 15 for -15% cooldown
  bossAtkBonus?: number;
  bossHpBonus?: number;
  specialPerk: string;
  requiredDiscoveredAuras: number; // Minimum distinct auras discovered to unlock glove blueprint
  recipe: GearRecipeIngredient[];
  description: string;
  flavorQuote: string;
  color: string;
}

export interface UserSavedState {
  inventory: Record<string, { count: number; firstDiscoveredAt: number; lastRolledAt: number }>;
  equippedItemId: string | null;
  equippedGearId?: string | null;
  craftedGearIds?: string[];
  totalRolls: number;
  shards: number;
  baseLuckLevel: number;
  activePotion: ActivePotion | null;
  devCustomLuck?: number;
}

export interface UserAccount {
  username: string;
  password: string;
  isAdmin: boolean;
  createdAt: number;
  savedState: UserSavedState;
}

export type ChatMessageType = 'user' | 'system' | 'rare_drop_alert';

export interface ChatMessage {
  id: string;
  sender: string;
  type: ChatMessageType;
  content: string;
  timestamp: number;
  isAdmin?: boolean;
  itemData?: {
    name: string;
    emoji: string;
    rarity: RarityTier;
    baseChance: number;
  };
}

export interface LeaderboardPlayer {
  rank: number;
  username: string;
  totalRolls: number;
  isAdmin: boolean;
  bestAuraName?: string;
  bestAuraEmoji?: string;
  bestAuraRarity?: RarityTier;
}
