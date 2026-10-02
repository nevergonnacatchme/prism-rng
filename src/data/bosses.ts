import { BossLevel, RNGItem, AuraCombatStats, AuraAbility } from '../types/rng';

export const BOSS_LEVELS: BossLevel[] = [
  // --- TIER 1: GOBLIN WARLORD (Levels 1 to 5) ---
  {
    level: 1,
    id: 'goblin_scout',
    name: 'Goblin Scout',
    title: 'Thornwood Thicket Skirmisher',
    emoji: '👺',
    themeColor: '#65A30D',
    bgGradient: 'from-lime-950/80 via-slate-900 to-slate-950',
    maxHealth: 3200,
    attack: 55,
    defense: 12,
    attackSpeed: 0.95,
    ability: {
      name: 'Spiked Club Heavy Swing',
      description: 'Raises a rusty spiked wooden plank and delivers a downward cleave.',
      chargeTimeSec: 5.5,
      damage: 220,
      effectType: 'slam',
      effectDurationSec: 1.5,
      icon: '🪵',
    },
    shardReward: 150,
    itemRewardName: 'Spiked Warlord Nail',
    flavorQuote: '"Goblins don’t cast spells; we smash heads with rusty nails!"',
  },
  {
    level: 2,
    id: 'goblin_berserker',
    name: 'Goblin Berserker',
    title: 'Enraged Wood Brawler',
    emoji: '👺',
    themeColor: '#84CC16',
    bgGradient: 'from-lime-950/90 via-slate-900 to-slate-950',
    maxHealth: 7500,
    attack: 110,
    defense: 25,
    attackSpeed: 1.1,
    ability: {
      name: 'Frenzied Club Smash',
      description: 'Delivers a rapid dual club slam with heightened ferocity.',
      chargeTimeSec: 5.0,
      damage: 380,
      effectType: 'slam',
      effectDurationSec: 1.5,
      icon: '🪵',
    },
    shardReward: 400,
    itemRewardName: 'Bloodied Goblin Totem',
    flavorQuote: '"Double the spikes, double the pain!"',
  },
  {
    level: 3,
    id: 'goblin_chieftain',
    name: 'Goblin Chieftain',
    title: 'Warlord of the Mossy Ruins',
    emoji: '👺',
    themeColor: '#4D7C0F',
    bgGradient: 'from-emerald-950/80 via-slate-900 to-slate-950',
    maxHealth: 18000,
    attack: 210,
    defense: 45,
    attackSpeed: 1.2,
    ability: {
      name: 'Earthquake Ground Slam',
      description: 'Slams the colossal spiked trunk into the dirt, cracking the arena.',
      chargeTimeSec: 6.0,
      damage: 620,
      effectType: 'slam',
      effectDurationSec: 2.0,
      icon: '💥',
    },
    shardReward: 1000,
    itemRewardName: 'Chieftain War Horn',
    flavorQuote: '"Bow before the master of the Thornwood!"',
  },
  {
    level: 4,
    id: 'goblin_titan',
    name: 'Goliath Goblin',
    title: 'Mutated Ironhide Brute',
    emoji: '👺',
    themeColor: '#3F6212',
    bgGradient: 'from-lime-950/95 via-green-950/80 to-slate-950',
    maxHealth: 42000,
    attack: 340,
    defense: 70,
    attackSpeed: 1.3,
    ability: {
      name: 'Cataclysmic Club Sweep',
      description: 'Swings an entire spiked ironwood log across the arena floor.',
      chargeTimeSec: 6.5,
      damage: 980,
      effectType: 'slam',
      effectDurationSec: 2.5,
      icon: '🪵',
    },
    shardReward: 2500,
    itemRewardName: 'Titan Bone Earring',
    flavorQuote: '"Crush! Shatter! No one escapes the giant!"',
  },
  {
    level: 5,
    id: 'goblin_overlord',
    name: 'Goblin Overlord',
    title: 'Supreme King of the Thicket',
    emoji: '👑',
    themeColor: '#A3E635',
    bgGradient: 'from-amber-950/90 via-lime-950/80 to-slate-950',
    maxHealth: 95000,
    attack: 520,
    defense: 100,
    attackSpeed: 1.45,
    ability: {
      name: 'Royal Executioner Cleave',
      description: 'Charges an enraged maximum-power club smash that shatters ground.',
      chargeTimeSec: 7.0,
      damage: 1600,
      effectType: 'slam',
      effectDurationSec: 3.0,
      icon: '🪵',
    },
    shardReward: 6000,
    itemRewardName: 'Goblin Crown of Spikes',
    flavorQuote: '"You may have felled my kin, but you will never breach the Citadel!"',
  },

  // --- TIER 2: CRIMSON PLUME IRON KNIGHT (Levels 6 to 10 - Unlocked after Level 5!) ---
  {
    level: 6,
    id: 'iron_knight_vanguard',
    name: 'Iron Knight Vanguard',
    title: 'Guardian of the Castle Bastion',
    emoji: '⚔️',
    themeColor: '#EF4444',
    bgGradient: 'from-slate-950 via-zinc-900 to-black',
    maxHealth: 160000,
    attack: 680,
    defense: 135,
    attackSpeed: 1.35,
    ability: {
      name: 'Greatsword Executioner Cleave',
      description: 'Rears back the greatsword for a lethal downward cleave. Time your dodge perfectly!',
      chargeTimeSec: 5.5,
      damage: 2200,
      effectType: 'slam',
      effectDurationSec: 2.5,
      icon: '🗡️',
    },
    shardReward: 12000,
    itemRewardName: 'Crimson Plume Shard',
    flavorQuote: '"My armor is unbroken. Draw your blade, challenger."',
  },
  {
    level: 7,
    id: 'royal_knight_champion',
    name: 'Royal Knight Champion',
    title: 'Master of the Greatsword',
    emoji: '⚔️',
    themeColor: '#DC2626',
    bgGradient: 'from-red-950/80 via-zinc-900 to-black',
    maxHealth: 260000,
    attack: 850,
    defense: 170,
    attackSpeed: 1.5,
    ability: {
      name: 'Crimson Arc Greatsword Cleave',
      description: 'Sweeps a blazing red steel arc across the entire floor.',
      chargeTimeSec: 5.0,
      damage: 3100,
      effectType: 'slam',
      effectDurationSec: 2.5,
      icon: '🗡️',
    },
    shardReward: 25000,
    itemRewardName: 'Tempered Iron Pauldron',
    flavorQuote: '"Steel knows neither mercy nor probability."',
  },
  {
    level: 8,
    id: 'dread_knight_inquisitor',
    name: 'Dread Knight Inquisitor',
    title: 'Commander of the Shadow Order',
    emoji: '⚔️',
    themeColor: '#991B1B',
    bgGradient: 'from-red-950/95 via-slate-950 to-black',
    maxHealth: 450000,
    attack: 1100,
    defense: 210,
    attackSpeed: 1.6,
    ability: {
      name: 'Judgement Execution Strike',
      description: 'Lethal 2-handed overhead cleave. Missing the dodge timing is fatal.',
      chargeTimeSec: 4.8,
      damage: 4500,
      effectType: 'slam',
      effectDurationSec: 3.0,
      icon: '🗡️',
    },
    shardReward: 50000,
    itemRewardName: 'Inquisitor Visor Crest',
    flavorQuote: '"No one bypasses the fortress gates alive."',
  },
  {
    level: 9,
    id: 'abyssal_knight_lord',
    name: 'Abyssal Knight Lord',
    title: 'Warden of the Deep Throne',
    emoji: '⚔️',
    themeColor: '#7F1D1D',
    bgGradient: 'from-red-950 via-purple-950 to-black',
    maxHealth: 800000,
    attack: 1450,
    defense: 260,
    attackSpeed: 1.7,
    ability: {
      name: 'Cataclysmic Greatsword Decapitation',
      description: 'An unstoppable sword arc infused with dark iron kinetic force.',
      chargeTimeSec: 4.5,
      damage: 6500,
      effectType: 'slam',
      effectDurationSec: 3.0,
      icon: '🗡️',
    },
    shardReward: 100000,
    itemRewardName: 'Abyssal Broadsword Hilt',
    flavorQuote: '"You stand before centuries of undefeated martial perfection."',
  },
  {
    level: 10,
    id: 'grand_crimson_sovereign',
    name: 'Grand Crimson Sovereign',
    title: 'Undefeated Emperor of the Iron Citadel',
    emoji: '👑',
    themeColor: '#B91C1C',
    bgGradient: 'from-red-950/95 via-black to-slate-950',
    maxHealth: 1500000,
    attack: 1900,
    defense: 320,
    attackSpeed: 1.85,
    ability: {
      name: 'Absolute Sovereign Greatsword Cataclysm',
      description: 'Renders the entire battlefield in half with a titanic downward blade swing.',
      chargeTimeSec: 4.2,
      damage: 9500,
      effectType: 'slam',
      effectDurationSec: 3.5,
      icon: '🗡️',
    },
    shardReward: 250000,
    itemRewardName: 'Sovereign Crimson Cloak',
    flavorQuote: '"Kneel before the Iron Throne, or be cleaved into oblivion."',
  },
];

// Custom abilities defined for key auras
export const CUSTOM_AURA_ABILITIES: Record<string, { ability: AuraAbility; stats: AuraCombatStats }> = {
  singularity_godhead: {
    ability: {
      name: 'Prime Event Horizon Annihilation',
      description: 'Collapses the entire spatial matrix into a singularity, dealing 500,000 True Damage, time-freezing the boss for 10.0 seconds, and granting a 1,000,000 HP Void Shield!',
      cooldownSec: 3.5,
      multiplier: 350.0,
      effectType: 'time_freeze',
      effectValue: 10.0,
      icon: '🌌',
      voiceLine: '"All matter, space, and time shall collapse into my palm."',
    },
    stats: {
      health: 4500000, // 4.5 Million HP!
      attack: 85000,   // 85,000 ATK!
      defense: 3500,   // 3,500 Defense!
      attackSpeed: 3.8,
      critChance: 1.0,  // 100% Critical Strike Chance!
    },
  },
  sanctuary_singularity: {
    ability: {
      name: 'Infinite Void Eradication',
      description: 'Eradicates the battlefield with event horizon singularity gravity, dealing 250,000 True Damage, freezing boss for 8.0s, and granting 500,000 HP shield!',
      cooldownSec: 4.0,
      multiplier: 200.0,
      effectType: 'time_freeze',
      effectValue: 8.0,
      icon: '🌌',
      voiceLine: '"Reality collapses before the Infinite Void."',
    },
    stats: {
      health: 3000000, // 3.0 Million HP!
      attack: 55000,   // 55,000 ATK!
      defense: 2200,   // 2,200 Defense!
      attackSpeed: 3.2,
      critChance: 0.95,
    },
  },
  ouroboros_infinite: {
    ability: {
      name: 'Infinity Tail Cataclysm',
      description: 'The ancient serpent devours space-time, dealing 4,000% true damage and resetting all cooldowns instantly!',
      cooldownSec: 5.0,
      multiplier: 40.0,
      effectType: 'damage',
      effectValue: 0,
      icon: '♾️',
      voiceLine: '"The infinite cycle consumes all."',
    },
    stats: {
      health: 30000,
      attack: 3800,
      defense: 450,
      attackSpeed: 2.1,
      critChance: 0.8,
    },
  },
  chronos_deity: {
    ability: {
      name: 'Chronosphere Oblivion',
      description: 'Freezes time for 6.0 seconds, bombarding the boss with 12 rapid cosmic strikes dealing 3,500% true damage!',
      cooldownSec: 5.5,
      multiplier: 35.0,
      effectType: 'time_freeze',
      effectValue: 6.0,
      icon: '⌛',
      voiceLine: '"Time ceases to flow."',
    },
    stats: {
      health: 25000,
      attack: 3200,
      defense: 380,
      attackSpeed: 2.0,
      critChance: 0.7,
    },
  },
  matrix_overdrive: {
    ability: {
      name: 'System Kernel Purge',
      description: 'Injects corrupt binary code directly into the boss core, executing 3,000% true damage, freezing boss for 4.0s, and healing for 3,000 HP!',
      cooldownSec: 5.5,
      multiplier: 30.0,
      effectType: 'time_freeze',
      effectValue: 4.0,
      icon: '👾',
      voiceLine: '"01000001 01001100 01001100 — OVERDRIVE."',
    },
    stats: {
      health: 22000,
      attack: 2800,
      defense: 320,
      attackSpeed: 1.9,
      critChance: 0.65,
    },
  },
  seraphim_sovereign: {
    ability: {
      name: 'Divine Wrath of Seraphim',
      description: 'Unfolds six starlight wings dealing 2,500% holy starlight damage and granting complete divine invulnerability (2,000 HP shield)!',
      cooldownSec: 6.0,
      multiplier: 25.0,
      effectType: 'shield',
      effectValue: 2000,
      icon: '🪽',
      voiceLine: '"By heavenly decree, be cleansed!"',
    },
    stats: {
      health: 20000,
      attack: 2500,
      defense: 300,
      attackSpeed: 1.85,
      critChance: 0.6,
    },
  },
  archangel_radiance: {
    ability: {
      name: 'Divine Wrath of Seraphim',
      description: 'Calls down seven columns of holy starlight dealing 2,000% damage and granting complete divine invulnerability (1,500 HP shield)!',
      cooldownSec: 6.5,
      multiplier: 20.0,
      effectType: 'shield',
      effectValue: 1500,
      icon: '🪽',
      voiceLine: '"By heavenly decree, be cleansed!"',
    },
    stats: {
      health: 18000,
      attack: 2200,
      defense: 280,
      attackSpeed: 1.8,
      critChance: 0.55,
    },
  },
  napoleon: {
    ability: {
      name: 'There Is Nothing We Can Do',
      description: 'Orders an imperial French artillery volley of 8 cannonballs dealing 2,200% damage, stunning the boss for 4.0s, and granting a 1,200 HP shield!',
      cooldownSec: 6.0,
      multiplier: 22.0,
      effectType: 'artillery',
      effectValue: 4.0,
      icon: '👑',
      voiceLine: '"Dans mon esprit tout divague... There is nothing we can do."',
    },
    stats: {
      health: 18000,
      attack: 2200,
      defense: 280,
      attackSpeed: 1.8,
      critChance: 0.55,
    },
  },
  infinity_eye: {
    ability: {
      name: 'Singularity Collapse',
      description: 'Rips reality open, dealing 550% AoE reality damage and reducing Boss Attack Speed by 40% for 5s.',
      cooldownSec: 6.5,
      multiplier: 5.5,
      effectType: 'damage',
      effectValue: 5.0,
      icon: '👁️',
      voiceLine: '"All timelines converge."',
    },
    stats: {
      health: 6200,
      attack: 540,
      defense: 85,
      attackSpeed: 1.5,
      critChance: 0.35,
    },
  },
  prismatic_phoenix: {
    ability: {
      name: 'Solar Rebirth',
      description: 'Blasts the arena in radiant phoenix fire dealing 480% damage and instantly heals for 1,500 HP.',
      cooldownSec: 8.0,
      multiplier: 4.8,
      effectType: 'heal',
      effectValue: 1500,
      icon: '🔥',
    },
    stats: {
      health: 5400,
      attack: 460,
      defense: 70,
      attackSpeed: 1.45,
      critChance: 0.3,
    },
  },
  bloodmoon_valkyrie: {
    ability: {
      name: 'Crimson Lunar Execution',
      description: 'Executes a twin-bladed aerial cross-slash dealing 520% damage and afflicting the boss with 70 bleed DPS for 5s.',
      cooldownSec: 7.0,
      multiplier: 5.2,
      effectType: 'burn',
      effectValue: 70,
      icon: '🩸',
      voiceLine: '"Bask in the blood of the eclipse!"',
    },
    stats: {
      health: 5800,
      attack: 510,
      defense: 75,
      attackSpeed: 1.5,
      critChance: 0.38,
    },
  },
  zenith_hyperion: {
    ability: {
      name: 'Solar Flare Catastrophe',
      description: 'Erupts with the heat of a coronal mass ejection, dealing 450% solar damage and stunning for 2.2s.',
      cooldownSec: 7.2,
      multiplier: 4.5,
      effectType: 'stun',
      effectValue: 2.2,
      icon: '☀️',
    },
    stats: {
      health: 5000,
      attack: 430,
      defense: 68,
      attackSpeed: 1.42,
      critChance: 0.32,
    },
  },
  abyssal_voidwalker: {
    ability: {
      name: 'Event Horizon Rift',
      description: 'Tears open the void, dealing 440% damage and siphoning 400 Shield HP from the boss.',
      cooldownSec: 7.5,
      multiplier: 4.4,
      effectType: 'shield',
      effectValue: 400,
      icon: '🌌',
    },
    stats: {
      health: 4800,
      attack: 410,
      defense: 65,
      attackSpeed: 1.4,
      critChance: 0.28,
    },
  },
  supernova_fragment: {
    ability: {
      name: 'Hypernova Burst',
      description: 'Fires concentrated stellar plasma dealing 400% radiant damage and burning for 60 DPS over 4s.',
      cooldownSec: 6.0,
      multiplier: 4.0,
      effectType: 'burn',
      effectValue: 60,
      icon: '✨',
    },
    stats: {
      health: 4200,
      attack: 360,
      defense: 55,
      attackSpeed: 1.35,
      critChance: 0.25,
    },
  },
  dragon_heart: {
    ability: {
      name: "Dragon's Infernal Roar",
      description: 'Unleashes ancient dragon breath dealing 380% fire damage with 100% critical strike chance.',
      cooldownSec: 7.0,
      multiplier: 3.8,
      effectType: 'damage',
      effectValue: 0,
      icon: '🐉',
    },
    stats: {
      health: 3800,
      attack: 330,
      defense: 50,
      attackSpeed: 1.3,
      critChance: 0.3,
    },
  },
  chronos_hourglass: {
    ability: {
      name: 'Temporal Stasis',
      description: 'Freezes the boss in time for 3.0 seconds while delivering 4 rapid strikes of 100% damage.',
      cooldownSec: 8.0,
      multiplier: 3.5,
      effectType: 'time_freeze',
      effectValue: 3.0,
      icon: '⏳',
    },
    stats: {
      health: 3400,
      attack: 290,
      defense: 45,
      attackSpeed: 1.3,
      critChance: 0.22,
    },
  },
  thunder_kami: {
    ability: {
      name: '1,000,000V Lightning Bolt',
      description: 'Calls down divine heaven thunder, dealing 340% shock damage and stunning for 2.0s.',
      cooldownSec: 6.5,
      multiplier: 3.4,
      effectType: 'stun',
      effectValue: 2.0,
      icon: '⚡',
    },
    stats: {
      health: 3000,
      attack: 260,
      defense: 40,
      attackSpeed: 1.4,
      critChance: 0.25,
    },
  },
  blood_moon_scythe: {
    ability: {
      name: 'Crimson Reap',
      description: 'Slashes the boss with cursed blood magic, dealing 280% damage and healing for 50% damage dealt.',
      cooldownSec: 6.0,
      multiplier: 2.8,
      effectType: 'heal',
      effectValue: 0.5,
      icon: '🩸',
    },
    stats: {
      health: 2600,
      attack: 230,
      defense: 35,
      attackSpeed: 1.25,
      critChance: 0.2,
    },
  },
  solar_aegis: {
    ability: {
      name: 'Solar Bastion',
      description: 'Summons an impenetrable solar ward absorbing 500 damage and reflecting 40% back to attacker.',
      cooldownSec: 8.5,
      multiplier: 2.4,
      effectType: 'shield',
      effectValue: 500,
      icon: '🛡️',
    },
    stats: {
      health: 3200,
      attack: 190,
      defense: 60,
      attackSpeed: 1.1,
      critChance: 0.15,
    },
  },
  stormfang_blade: {
    ability: {
      name: 'Thunder Slash',
      description: 'Delivers a high-voltage lightning slash dealing 250% damage with shock chain.',
      cooldownSec: 5.5,
      multiplier: 2.5,
      effectType: 'damage',
      effectValue: 0,
      icon: '⚡',
    },
    stats: {
      health: 2200,
      attack: 180,
      defense: 30,
      attackSpeed: 1.25,
      critChance: 0.18,
    },
  },
  frostbite_core: {
    ability: {
      name: 'Absolute Zero Frost',
      description: 'Blasts the boss with sub-zero blizzard crystals dealing 230% damage and slowing attack speed.',
      cooldownSec: 6.0,
      multiplier: 2.3,
      effectType: 'damage',
      effectValue: 0,
      icon: '❄️',
    },
    stats: {
      health: 2000,
      attack: 160,
      defense: 28,
      attackSpeed: 1.15,
      critChance: 0.15,
    },
  },
};

// Fallback dynamic generator by rarity for all other auras
export function getAuraCombatStats(item: RNGItem): AuraCombatStats {
  if (CUSTOM_AURA_ABILITIES[item.id]) {
    return CUSTOM_AURA_ABILITIES[item.id].stats;
  }

  // Scaling based on rarity (Massively Buffed!)
  switch (item.rarity) {
    case 'Impossible':
      return { health: 2200000, attack: 38000, defense: 1500, attackSpeed: 2.8, critChance: 0.9 };
    case 'Transcendent':
      return { health: 1500000, attack: 25000, defense: 1000, attackSpeed: 2.4, critChance: 0.8 };
    case 'Celestial':
      return { health: 900000, attack: 15000, defense: 600, attackSpeed: 2.0, critChance: 0.65 };
    case 'Mythic':
      return { health: 450000, attack: 8000, defense: 350, attackSpeed: 1.75, critChance: 0.5 };
    case 'Legendary':
      return { health: 4000, attack: 480, defense: 80, attackSpeed: 1.25, critChance: 0.2 };
    case 'Epic':
      return { health: 2600, attack: 300, defense: 55, attackSpeed: 1.15, critChance: 0.15 };
    case 'Rare':
      return { health: 1800, attack: 180, defense: 35, attackSpeed: 1.1, critChance: 0.12 };
    case 'Uncommon':
      return { health: 1200, attack: 110, defense: 22, attackSpeed: 1.0, critChance: 0.08 };
    case 'Common':
    default:
      return { health: 750, attack: 65, defense: 14, attackSpeed: 0.9, critChance: 0.05 };
  }
}

export function getAuraAbility(item: RNGItem): AuraAbility {
  if (CUSTOM_AURA_ABILITIES[item.id]) {
    return CUSTOM_AURA_ABILITIES[item.id].ability;
  }

  // Scaling generic dynamic ability based on item name and rarity
  switch (item.rarity) {
    case 'Impossible':
      return {
        name: `${item.name}'s Imperial Decree`,
        description: `Unleashes an impossible reality warp dealing 2,500% damage and shielding for 1,500 HP.`,
        cooldownSec: 5.0,
        multiplier: 25.0,
        effectType: 'shield',
        effectValue: 1500,
        icon: '👑',
      };
    case 'Transcendent':
      return {
        name: `${item.name}'s Divine Surge`,
        description: `Summons transcendent cosmic power dealing 1,800% damage and healing 2,000 HP.`,
        cooldownSec: 5.5,
        multiplier: 18.0,
        effectType: 'heal',
        effectValue: 2000,
        icon: '✨',
      };
    case 'Celestial':
      return {
        name: `${item.name}'s Celestial Beam`,
        description: `Channels astral energy, dealing 1,200% radiant damage to the target.`,
        cooldownSec: 5.5,
        multiplier: 12.0,
        effectType: 'damage',
        effectValue: 0,
        icon: '💫',
      };
    case 'Mythic':
      return {
        name: `${item.name}'s Mythic Strike`,
        description: `Deals 850% damage with a 2.5-second stun effect.`,
        cooldownSec: 5.5,
        multiplier: 8.5,
        effectType: 'stun',
        effectValue: 2.5,
        icon: '⚡',
      };
    case 'Legendary':
      return {
        name: `${item.name}'s Blazing Edge`,
        description: `Inflicts 600% critical damage and burns target for 120 DPS over 3 seconds.`,
        cooldownSec: 5.0,
        multiplier: 6.0,
        effectType: 'burn',
        effectValue: 120,
        icon: '🔥',
      };
    case 'Epic':
      return {
        name: `${item.name}'s Resonant Blast`,
        description: `Strikes with 220% elemental burst damage.`,
        cooldownSec: 5.5,
        multiplier: 2.2,
        effectType: 'damage',
        effectValue: 0,
        icon: '💥',
      };
    case 'Rare':
      return {
        name: `${item.name}'s Power Surge`,
        description: `Empowers attack dealing 180% damage.`,
        cooldownSec: 5.0,
        multiplier: 1.8,
        effectType: 'damage',
        effectValue: 0,
        icon: '⚔️',
      };
    case 'Uncommon':
      return {
        name: `${item.name}'s Quick Strike`,
        description: `Swift attack dealing 150% damage.`,
        cooldownSec: 4.5,
        multiplier: 1.5,
        effectType: 'damage',
        effectValue: 0,
        icon: '🗡️',
      };
    case 'Common':
    default:
      return {
        name: `${item.name}'s Solid Bash`,
        description: `Bashes the target for 120% basic damage.`,
        cooldownSec: 4.0,
        multiplier: 1.2,
        effectType: 'damage',
        effectValue: 0,
        icon: '🪨',
      };
  }
}
