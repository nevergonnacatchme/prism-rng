import { GearItem } from '../types/rng';

export const GEAR_ITEMS: GearItem[] = [
  {
    id: 'clover_mitt',
    name: 'Clover Mitt',
    type: 'glove',
    icon: '🧤',
    tier: 1,
    luckBonus: 20, // +20% base luck
    rollCooldownReduction: 0,
    specialPerk: 'Woven with four-leaf clover fibers for lucky rolls.',
    requiredDiscoveredAuras: 2,
    recipe: [
      { itemId: 'pebble', itemName: 'Smooth Pebble', itemEmoji: '🪨', count: 4 },
      { itemId: 'emerald_shard', itemName: 'Verdant Shard', itemEmoji: '🌿', count: 2 },
    ],
    description: 'A modest woven mitt that attracts fortune and purifies bad rolls.',
    flavorQuote: '"A beginner roller’s very first blessing."',
    color: '#34D399',
  },
  {
    id: 'amber_resonator',
    name: 'Amber Resonator',
    type: 'device',
    icon: '🏵️',
    tier: 2,
    luckBonus: 50, // +50% base luck
    rollCooldownReduction: 0,
    specialPerk: 'Resonates with fossilized sap, boosting uncommons and rares.',
    requiredDiscoveredAuras: 5,
    recipe: [
      { itemId: 'silver_coin', itemName: 'Silver Aureus', itemEmoji: '🪙', count: 2 },
      { itemId: 'sapphire_geode', itemName: 'Azure Geode', itemEmoji: '💎', count: 1 },
    ],
    description: 'A wrist gadget holding ancient amber crystals that vibrate with probability harmonics.',
    flavorQuote: '"Trapped in tree sap a million years ago, luck never fades."',
    color: '#F59E0B',
  },
  {
    id: 'abyssal_pincer',
    name: 'Abyssal Pincer',
    type: 'glove',
    icon: '🦞',
    tier: 3,
    luckBonus: 120, // +120% base luck
    rollCooldownReduction: 0,
    specialPerk: 'Tears open deep sea trenches to retrieve sunken fortunes.',
    requiredDiscoveredAuras: 8,
    recipe: [
      { itemId: 'whispering_seashell', itemName: 'Tideborn Conch', itemEmoji: '🐚', count: 2 },
      { itemId: 'phantom_shroud', itemName: 'Phantom Shroud', itemEmoji: '👻', count: 1 },
      { itemId: 'storm_dagger', itemName: 'Stormfang Dagger', itemEmoji: '⚡', count: 1 },
    ],
    description: 'Chitinous aquatic armor forged from trench predators that pulls luck from deep voids.',
    flavorQuote: '"The dark waters give back what time took."',
    color: '#2DD4BF',
  },
  {
    id: 'thunderclaw_gauntlet',
    name: 'Thunderclaw Gauntlet',
    type: 'glove',
    icon: '⚡',
    tier: 4,
    luckBonus: 260, // +260% base luck
    rollCooldownReduction: 0,
    specialPerk: 'Channels atmospheric lightning directly into each summon.',
    requiredDiscoveredAuras: 11,
    recipe: [
      { itemId: 'cyber_overclock', itemName: 'Cyber Overclock', itemEmoji: '🤖', count: 2 },
      { itemId: 'phoenix_feather', itemName: 'Phoenix Feather', itemEmoji: '🪶', count: 1 },
      { itemId: 'enchanted_grimoire', itemName: 'Grimoire of Fates', itemEmoji: '📖', count: 1 },
    ],
    description: 'Forged from ionized tungsten and storm runes, crackling whenever a high-tier aura nears.',
    flavorQuote: '"Strike the heavens and harvest the spark."',
    color: '#FACC15',
  },
  {
    id: 'solarflare_vambrace',
    name: 'Solarflare Vambrace',
    type: 'device',
    icon: '🛡️',
    tier: 5,
    luckBonus: 550, // +550% base luck
    rollCooldownReduction: 0,
    specialPerk: 'Blinds destiny with incandescent solar corona flares.',
    requiredDiscoveredAuras: 13,
    recipe: [
      { itemId: 'solar_aegis', itemName: 'Sunflare Bulwark', itemEmoji: '🛡️', count: 2 },
      { itemId: 'blood_moon_scythe', itemName: 'Blood Moon Scythe', itemEmoji: '🩸', count: 1 },
    ],
    description: 'A heavy golden vambrace holding the concentrated heat of a newborn yellow star.',
    flavorQuote: '"Shining brighter than a thousand failed rolls."',
    color: '#FB923C',
  },
  {
    id: 'crimson_reaver_grip',
    name: 'Crimson Reaver Grip',
    type: 'glove',
    icon: '🩸',
    tier: 6,
    luckBonus: 1200, // +1,200% base luck
    rollCooldownReduction: 0,
    specialPerk: 'Siphons bad odds and converts them into pure fortune.',
    requiredDiscoveredAuras: 15,
    recipe: [
      { itemId: 'dragon_heart', itemName: 'Dragon Heart Core', itemEmoji: '🐉', count: 2 },
      { itemId: 'thunder_kami', itemName: 'Thunder Kami', itemEmoji: '⚡', count: 1 },
    ],
    description: 'A terrifying demonic gauntlet forged in the heart of dragons blood.',
    flavorQuote: '"Blood for fortune, blood for eternity."',
    color: '#E11D48',
  },
  {
    id: 'chronoshift_bracer',
    name: 'Chronoshift Bracer',
    type: 'device',
    icon: '⌛',
    tier: 7,
    luckBonus: 2800, // +2,800% base luck
    rollCooldownReduction: 0,
    specialPerk: 'Rewinds time across unsuccessful rolls to find rare timelines.',
    requiredDiscoveredAuras: 17,
    recipe: [
      { itemId: 'chronos_hourglass', itemName: 'Chronos Hourglass', itemEmoji: '⏳', count: 2 },
      { itemId: 'void_prism', itemName: 'Void Prism', itemEmoji: '🔮', count: 1 },
      { itemId: 'glitch_catalyst', itemName: 'Anomalous Core', itemEmoji: '👾', count: 1 },
    ],
    description: 'Contains sands extracted from the end of the universe, flowing upward in reverse.',
    flavorQuote: '"If fate refuses to give, rewrite the past until it does."',
    color: '#A855F7',
  },
  {
    id: 'singularity_eye_gauntlet',
    name: 'Singularity Eye Gauntlet',
    type: 'glove',
    icon: '👁️',
    tier: 8,
    luckBonus: 6500, // +6,500% base luck
    rollCooldownReduction: 0,
    specialPerk: 'All-seeing cosmic gaze that bends reality toward Transcendent and Impossible tiers.',
    requiredDiscoveredAuras: 19,
    recipe: [
      { itemId: 'infinity_eye', itemName: 'Eye of Infinity', itemEmoji: '👁️', count: 2 },
      { itemId: 'abyssal_voidwalker', itemName: 'Cosmic Riftwalker', itemEmoji: '🌌', count: 1 },
      { itemId: 'supernova_fragment', itemName: 'Supernova Shard', itemEmoji: '✨', count: 1 },
    ],
    description: 'Embedded with two living Eyes of Infinity that continuously warp reality to guarantee impossible rolls.',
    flavorQuote: '"You do not look into the void; the void looks through your fingers."',
    color: '#EC4899',
  },
  {
    id: 'sovereign_imperial_gauntlet',
    name: 'Apex Imperial Gauntlet',
    type: 'glove',
    icon: '👑',
    tier: 9,
    luckBonus: 20000, // +20,000% base luck
    rollCooldownReduction: 0,
    specialPerk: 'Imperial supremacy. Guarantees the absolute rarest drops in existence.',
    requiredDiscoveredAuras: 21,
    recipe: [
      { itemId: 'napoleon', itemName: 'Napoleon', itemEmoji: '👑', count: 1 },
      { itemId: 'prismatic_phoenix', itemName: 'Prismatic Phoenix', itemEmoji: '🔥', count: 2 },
      { itemId: 'infinity_eye', itemName: 'Eye of Infinity', itemEmoji: '👁️', count: 2 },
    ],
    description: 'The golden coronation gauntlet inscribed with the laurels of Napoleon Bonaparte.',
    flavorQuote: '"Dans mon esprit tout divague... There is nothing we can do."',
    color: '#EF4444',
  },
];

export const GEARS_BY_ID = GEAR_ITEMS.reduce((acc, g) => {
  acc[g.id] = g;
  return acc;
}, {} as Record<string, GearItem>);
