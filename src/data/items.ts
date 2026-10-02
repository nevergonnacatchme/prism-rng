import { RNGItem, RarityConfig, RarityTier } from '../types/rng';
import napoleonImg from '../assets/images/napoleon_aura_1790791276730.jpg';
import singularityGodheadImg from '../assets/images/singularity_godhead_1790926554615.jpg';

export const RARITY_CONFIGS: Record<RarityTier, RarityConfig> = {
  Common: {
    name: 'Common',
    color: '#94A3B8', // slate-400
    bgColor: 'rgba(148, 163, 184, 0.1)',
    borderColor: 'rgba(148, 163, 184, 0.3)',
    glowColor: 'rgba(148, 163, 184, 0.4)',
    order: 1,
  },
  Uncommon: {
    name: 'Uncommon',
    color: '#34D399', // emerald-400
    bgColor: 'rgba(52, 211, 153, 0.1)',
    borderColor: 'rgba(52, 211, 153, 0.3)',
    glowColor: 'rgba(52, 211, 153, 0.4)',
    order: 2,
  },
  Rare: {
    name: 'Rare',
    color: '#38BDF8', // sky-400
    bgColor: 'rgba(56, 189, 248, 0.1)',
    borderColor: 'rgba(56, 189, 248, 0.3)',
    glowColor: 'rgba(56, 189, 248, 0.5)',
    order: 3,
  },
  Epic: {
    name: 'Epic',
    color: '#A855F7', // purple-500
    bgColor: 'rgba(168, 85, 247, 0.1)',
    borderColor: 'rgba(168, 85, 247, 0.3)',
    glowColor: 'rgba(168, 85, 247, 0.5)',
    order: 4,
  },
  Legendary: {
    name: 'Legendary',
    color: '#F59E0B', // amber-500
    bgColor: 'rgba(245, 158, 11, 0.12)',
    borderColor: 'rgba(245, 158, 11, 0.4)',
    glowColor: 'rgba(245, 158, 11, 0.6)',
    order: 5,
  },
  Mythic: {
    name: 'Mythic',
    color: '#F43F5E', // rose-500
    bgColor: 'rgba(244, 63, 94, 0.15)',
    borderColor: 'rgba(244, 63, 94, 0.45)',
    glowColor: 'rgba(244, 63, 94, 0.7)',
    order: 6,
  },
  Celestial: {
    name: 'Celestial',
    color: '#06B6D4', // cyan-500
    bgColor: 'rgba(6, 182, 212, 0.18)',
    borderColor: 'rgba(6, 182, 212, 0.5)',
    glowColor: 'rgba(6, 182, 212, 0.8)',
    order: 7,
  },
  Transcendent: {
    name: 'Transcendent',
    color: '#F472B6', // pink-400 with iridescent rainbow styling
    bgColor: 'rgba(244, 114, 182, 0.22)',
    borderColor: 'rgba(244, 114, 182, 0.6)',
    glowColor: 'rgba(244, 114, 182, 0.95)',
    order: 8,
  },
  Impossible: {
    name: 'Impossible',
    color: '#EF4444', // imperial red & gold
    bgColor: 'rgba(239, 68, 68, 0.25)',
    borderColor: 'rgba(239, 68, 68, 0.7)',
    glowColor: 'rgba(239, 68, 68, 0.95)',
    order: 9,
  },
};

export const ITEMS: RNGItem[] = [
  // Common
  {
    id: 'pebble',
    name: 'Smooth Pebble',
    emoji: '⚪',
    rarity: 'Common',
    baseChance: 2, // 1 in 2 (50%)
    luckBonus: 0,
    sellValue: 1,
    description: 'A round, weathered river rock. Not very shiny, but fits comfortably in the palm.',
    flavorText: '"Every mountain was once just a pile of these."',
    accentColor: '#94A3B8',
  },
  {
    id: 'maple_leaf',
    name: 'Autumn Leaf',
    emoji: '🍁',
    rarity: 'Common',
    baseChance: 5, // 1 in 5 (20%)
    luckBonus: 2,
    sellValue: 2,
    description: 'A crisp amber leaf falling gently from high canopy branches.',
    flavorText: '"Whispering the changing of seasons."',
    accentColor: '#F97316',
  },
  {
    id: 'sea_glass',
    name: 'Sea Glass',
    emoji: '🌊',
    rarity: 'Common',
    baseChance: 8, // 1 in 8 (12.5%)
    luckBonus: 4,
    sellValue: 2,
    description: 'Frosted ocean glass smoothed by centuries of rolling tides.',
    flavorText: '"Polished by the patience of water."',
    accentColor: '#38BDF8',
  },
  {
    id: 'apple',
    name: 'Crisp Apple',
    emoji: '🍎',
    rarity: 'Common',
    baseChance: 10, // 1 in 10 (10%)
    luckBonus: 5,
    sellValue: 3,
    description: 'A sweet, red orchard apple with a crisp crunch and refreshing juice.',
    flavorText: '"One a day keeps bad luck at bay."',
    accentColor: '#EF4444',
  },
  {
    id: 'acorn',
    name: 'Gilded Acorn',
    emoji: '🌰',
    rarity: 'Common',
    baseChance: 14, // 1 in 14 (7.1%)
    luckBonus: 7,
    sellValue: 4,
    description: 'An oak acorn encased in a faint sheen of golden sap.',
    flavorText: '"Mighty timber sleeps within."',
    accentColor: '#D97706',
  },
  {
    id: 'copper_key',
    name: 'Old Copper Key',
    emoji: '🗝️',
    rarity: 'Common',
    baseChance: 16, // 1 in 16 (6.25%)
    luckBonus: 8,
    sellValue: 5,
    description: 'A tarnished key with notched teeth. Whatever door it opened has long turned to dust.',
    flavorText: '"Unlocks curiosity, if nothing else."',
    accentColor: '#B45309',
  },

  // Uncommon
  {
    id: 'four_leaf_clover',
    name: 'Four-Leaf Clover',
    emoji: '🍀',
    rarity: 'Uncommon',
    baseChance: 25, // 1 in 25 (4%)
    luckBonus: 15,
    sellValue: 10,
    description: 'A genuine four-petaled clover pluck from a secluded meadow. Tingles with serendipity.',
    flavorText: '"Fortune favors those who look closely."',
    accentColor: '#10B981',
  },
  {
    id: 'amethyst_shard',
    name: 'Amethyst Cluster',
    emoji: '🔮',
    rarity: 'Uncommon',
    baseChance: 35, // 1 in 35 (2.85%)
    luckBonus: 18,
    sellValue: 15,
    description: 'Geometric purple quartz crystals radiating calming geomagnetic resonance.',
    flavorText: '"Vibrating with peaceful energy."',
    accentColor: '#A855F7',
  },
  {
    id: 'silver_coin',
    name: 'Silver Aureus',
    emoji: '🥈',
    rarity: 'Uncommon',
    baseChance: 50, // 1 in 50 (2%)
    luckBonus: 22,
    sellValue: 20,
    description: 'An ancient stamped coin. Flipping it creates a mesmerizing high-pitched chime.',
    flavorText: '"Tossed into wishing wells across a dozen dynasties."',
    accentColor: '#E2E8F0',
  },
  {
    id: 'spark_plug',
    name: 'Voltaic Spark',
    emoji: '⚡',
    rarity: 'Uncommon',
    baseChance: 70, // 1 in 70 (1.42%)
    luckBonus: 28,
    sellValue: 30,
    description: 'A miniature electric capacitor humming with miniature static electricity bolts.',
    flavorText: '"A spark before the lightning strike."',
    accentColor: '#FACC15',
  },
  {
    id: 'amber_fossil',
    name: 'Ancient Amber',
    emoji: '🍯',
    rarity: 'Uncommon',
    baseChance: 90, // 1 in 90 (1.11%)
    luckBonus: 32,
    sellValue: 38,
    description: 'Translucent prehistoric tree sap preserving an insect from millions of years ago.',
    flavorText: '"Trapped in golden eternity."',
    accentColor: '#F59E0B',
  },
  {
    id: 'sapphire_geode',
    name: 'Azure Geode',
    emoji: '💎',
    rarity: 'Rare',
    baseChance: 100, // 1 in 100 (1%)
    luckBonus: 35,
    sellValue: 45,
    description: 'A cracked basalt stone sparkling with clusters of sharp sapphire crystals inside.',
    flavorText: '"Hidden luminescence born in volcanic heat."',
    accentColor: '#38BDF8',
  },

  // Rare
  {
    id: 'frost_crystal',
    name: 'Cryo Shard',
    emoji: '❄️',
    rarity: 'Rare',
    baseChance: 180, // 1 in 180 (0.55%)
    luckBonus: 44,
    sellValue: 70,
    description: 'Never melting permafrost extracted from glacial mountain summits.',
    flavorText: '"The cold preserves all things."',
    accentColor: '#67E8F9',
  },
  {
    id: 'storm_dagger',
    name: 'Stormfang Dagger',
    emoji: '⚡',
    rarity: 'Rare',
    baseChance: 250, // 1 in 250 (0.4%)
    luckBonus: 50,
    sellValue: 90,
    description: 'Forged from meteorite iron during a tempest. Tiny sparks leap across its razor fuller.',
    flavorText: '"The ozone scent never washes away."',
    accentColor: '#FACC15',
  },
  {
    id: 'shadow_kunai',
    name: 'Shadefang Kunai',
    emoji: '🗡️',
    rarity: 'Rare',
    baseChance: 320, // 1 in 320 (0.31%)
    luckBonus: 58,
    sellValue: 110,
    description: 'Folded shadowy damascus steel that leaves pitch-black trails in the air when swung.',
    flavorText: '"You only see it when it strikes."',
    accentColor: '#64748B',
  },
  {
    id: 'whispering_seashell',
    name: 'Tideborn Conch',
    emoji: '🐚',
    rarity: 'Rare',
    baseChance: 400, // 1 in 400 (0.25%)
    luckBonus: 65,
    sellValue: 140,
    description: 'Held to your ear, it plays the chorus of sunken cities deep beneath tectonic trenches.',
    flavorText: '"The tides keep all secrets eventually."',
    accentColor: '#2DD4BF',
  },
  {
    id: 'phantom_shroud',
    name: 'Phantom Shroud',
    emoji: '👻',
    rarity: 'Rare',
    baseChance: 550, // 1 in 550 (0.18%)
    luckBonus: 75,
    sellValue: 190,
    description: 'A spectral cloak woven from ethereal mist that renders the bearer partially intangible.',
    flavorText: '"Neither here nor there, drifting between dimensions."',
    accentColor: '#818CF8',
  },
  {
    id: 'mirage_lantern',
    name: 'Mirage Lantern',
    emoji: '🏮',
    rarity: 'Rare',
    baseChance: 600, // 1 in 600 (0.166%)
    luckBonus: 80,
    sellValue: 210,
    description: 'Emits a flickering ghostly purple flame that bends visual perception.',
    flavorText: '"Guide through the twilight mist."',
    accentColor: '#C084FC',
  },
  {
    id: 'cyber_overclock',
    name: 'Cyber Overclock',
    emoji: '🤖',
    rarity: 'Rare',
    baseChance: 750, // 1 in 750 (0.133%)
    luckBonus: 85,
    sellValue: 240,
    description: 'A glowing quantum microchip humming at super-clocked frequencies that bends calculations.',
    flavorText: '"Warning: System operating at 400% maximum capacity."',
    accentColor: '#10B981',
  },

  // Epic
  {
    id: 'phoenix_feather',
    name: 'Phoenix Feather',
    emoji: '🔥',
    rarity: 'Epic',
    baseChance: 800, // 1 in 800 (0.125%)
    luckBonus: 95,
    sellValue: 300,
    description: 'Radiates gentle thermal embers that flicker continuously without burning what they touch.',
    flavorText: '"From the ash, destiny rekindles."',
    accentColor: '#FB923C',
  },
  {
    id: 'enchanted_grimoire',
    name: 'Grimoire of Fates',
    emoji: '📖',
    rarity: 'Epic',
    baseChance: 2000, // 1 in 2,000 (0.05%)
    luckBonus: 140,
    sellValue: 700,
    description: 'A leather-bound tome whose parchment pages turn on their own accord, predicting outcomes.',
    flavorText: '"Written in ink that shifts before your eyes."',
    accentColor: '#C084FC',
  },
  {
    id: 'plasma_orb',
    name: 'Magnetar Plasma',
    emoji: '⚛️',
    rarity: 'Epic',
    baseChance: 3000, // 1 in 3,000 (0.033%)
    luckBonus: 180,
    sellValue: 1100,
    description: 'A magnetic field containing superheated ionization plasma that spins wildly.',
    flavorText: '"Harnessing cosmic magnetic currents."',
    accentColor: '#38BDF8',
  },
  {
    id: 'spectral_wraith',
    name: 'Spectral Wraith',
    emoji: '👤',
    rarity: 'Epic',
    baseChance: 6000, // 1 in 6,000 (0.016%)
    luckBonus: 230,
    sellValue: 1600,
    description: 'An ethereal shadowy spirit that floats behind the roller, silently repelling misfortune.',
    flavorText: '"A silent guardian from the other side."',
    accentColor: '#A855F7',
  },
  {
    id: 'blood_moon_scythe',
    name: 'Blood Moon Scythe',
    emoji: '🩸',
    rarity: 'Epic',
    baseChance: 8500, // 1 in 8,500 (0.0117%)
    luckBonus: 280,
    sellValue: 2200,
    description: 'A curved obsidian crescent soaked in crimson lunar energy that siphons vitality from adversaries.',
    flavorText: '"The red moon hung low, thirsty for tribute."',
    accentColor: '#E11D48',
  },

  // Legendary
  {
    id: 'solar_aegis',
    name: 'Sunflare Bulwark',
    emoji: '🛡️',
    rarity: 'Legendary',
    baseChance: 5000, // 1 in 5,000 (0.02%)
    luckBonus: 220,
    sellValue: 1800,
    description: 'A radiant golden shield emblazoned with solar corona flares that repel misfortune.',
    flavorText: '"Bathed in the dawn light of a thousand mornings."',
    accentColor: '#F59E0B',
  },
  {
    id: 'dragon_heart',
    name: 'Dragon Heart Core',
    emoji: '🐉',
    rarity: 'Legendary',
    baseChance: 12000, // 1 in 12,000 (0.0083%)
    luckBonus: 350,
    sellValue: 4000,
    description: 'Crystallized magma pulsing like a colossal rhythmic heartbeat, leaking draconic steam.',
    flavorText: '"A king among beasts, dormant in stone."',
    accentColor: '#DC2626',
  },
  {
    id: 'aurora_veil',
    name: 'Borealis Veil',
    emoji: '🌌',
    rarity: 'Legendary',
    baseChance: 22000, // 1 in 22,000 (0.0045%)
    luckBonus: 480,
    sellValue: 7000,
    description: 'Curtains of green and violet atmospheric auroras weaving around your shoulders.',
    flavorText: '"Solar winds dancing in planetary atmosphere."',
    accentColor: '#34D399',
  },
  {
    id: 'solar_flare',
    name: 'Helios Solar Flare',
    emoji: '☀️',
    rarity: 'Legendary',
    baseChance: 25000, // 1 in 25,000
    luckBonus: 560,
    sellValue: 9500,
    description: 'Direct solar coronal loops of thermonuclear fire that burn away poor odds.',
    flavorText: '"Warmth that turns all to ash."',
    accentColor: '#F97316',
  },
  {
    id: 'thunder_kami',
    name: 'Thunder Kami',
    emoji: '⚡',
    rarity: 'Legendary',
    baseChance: 29000, // 1 in 29,000
    luckBonus: 650,
    sellValue: 12000,
    description: 'The sealed soul of an ancient storm deity crackling with millions of volts of raw heavenly plasma.',
    flavorText: '"When heaven roars, all creations bow."',
    accentColor: '#FACC15',
  },
  {
    id: 'tempest_harbinger',
    name: 'Tempest Leviathan',
    emoji: '🌪️',
    rarity: 'Legendary',
    baseChance: 28000, // 1 in 28,000
    luckBonus: 750,
    sellValue: 16000,
    description: 'A swirling micro-cyclone of gale-force winds orbiting the user.',
    flavorText: '"Ride the eye of the storm."',
    accentColor: '#06B6D4',
  },

  // Mythic
  {
    id: 'void_prism',
    name: 'Void Prism',
    emoji: '🔮',
    rarity: 'Mythic',
    baseChance: 35000, // 1 in 35,000 (0.0028%)
    luckBonus: 550,
    sellValue: 10000,
    description: 'An obsidian prism that refracts light into pure darkness and subtle gravitational waves.',
    flavorText: '"Light bends around it in reverence."',
    accentColor: '#9333EA',
  },
  {
    id: 'chronos_hourglass',
    name: 'Chronos Hourglass',
    emoji: '⏳',
    rarity: 'Mythic',
    baseChance: 100000, // 1 in 100,000 (0.001%)
    luckBonus: 900,
    sellValue: 25000,
    description: 'The golden sands defy gravity, slowly trickling upward to reverse fleeting seconds.',
    flavorText: '"Time is merely a circle drawn by those who forget."',
    accentColor: '#EAB308',
  },
  {
    id: 'galactic_pulsar',
    name: 'Pulsar Core',
    emoji: '💫',
    rarity: 'Mythic',
    baseChance: 140000, // 1 in 140,000 (0.00071%)
    luckBonus: 1100,
    sellValue: 35000,
    description: 'A spinning neutron core emitting synchronized bursts of gamma-ray lighthouse beams.',
    flavorText: '"Clock of the universe."',
    accentColor: '#8B5CF6',
  },
  {
    id: 'glitch_catalyst',
    name: 'Anomalous Core',
    emoji: '👾',
    rarity: 'Mythic',
    baseChance: 200000, // 1 in 200,000 (0.0005%)
    luckBonus: 1400,
    sellValue: 45000,
    description: 'A tear in the fabric of existence flickering with chromatic aberration and corrupt code.',
    flavorText: '"Fatal Exception 0x00000000: Reality not found."',
    accentColor: '#10B981',
  },
  {
    id: 'nebula_weaver',
    name: 'Nebula Monarch',
    emoji: '🌌',
    rarity: 'Mythic',
    baseChance: 240000, // 1 in 240,000 (0.00041%)
    luckBonus: 1550,
    sellValue: 55000,
    description: 'A bioluminescent cosmic jellyfish floating serenely across stellar nurseries.',
    flavorText: '"Drifting among infant constellations."',
    accentColor: '#EC4899',
  },
  {
    id: 'eclipse_scythe',
    name: 'Dark Solar Eclipse',
    emoji: '🌑',
    rarity: 'Mythic',
    baseChance: 280000, // 1 in 280,000 (0.00035%)
    luckBonus: 1650,
    sellValue: 62000,
    description: 'The celestial alignment where the sun goes black, casting diamond-ring coronas.',
    flavorText: '"Day turned into starless night."',
    accentColor: '#F59E0B',
  },

  // Celestial
  {
    id: 'supernova_fragment',
    name: 'Supernova Shard',
    emoji: '✨',
    rarity: 'Celestial',
    baseChance: 350000, // 1 in 350,000 (0.000285%)
    luckBonus: 1800,
    sellValue: 75000,
    description: 'A stellar remnant glowing with the incandescent birth of new planetary nebulae.',
    flavorText: '"The dying breath of an ancient colossus."',
    accentColor: '#06B6D4',
  },
  {
    id: 'abyssal_voidwalker',
    name: 'Cosmic Riftwalker',
    emoji: '🌌',
    rarity: 'Celestial',
    baseChance: 500000, // 1 in 500,000 (0.0002%)
    luckBonus: 2800,
    sellValue: 120000,
    description: 'A cosmic singularity taking the form of an astral titan traversing the space between superclusters.',
    flavorText: '"The void is not empty; it is simply waiting."',
    accentColor: '#6366F1',
  },
  {
    id: 'quasar_nova',
    name: 'Quasar Annihilator',
    emoji: '💥',
    rarity: 'Celestial',
    baseChance: 650000, // 1 in 650,000 (0.00015%)
    luckBonus: 3100,
    sellValue: 150000,
    description: 'Supermassive accretion disk ejecting relativistic plasma beams into intergalactic space.',
    flavorText: '"Brighter than a thousand galaxies combined."',
    accentColor: '#EF4444',
  },
  {
    id: 'zenith_hyperion',
    name: 'Zenith: Hyperion',
    emoji: '☀️',
    rarity: 'Celestial',
    baseChance: 850000, // 1 in 850,000 (0.000117%)
    luckBonus: 3400,
    sellValue: 180000,
    description: 'A solar colossus that pulsates with the heat of a billion collapsing suns, vaporizing ill fate.',
    flavorText: '"When Hyperion rises, the stars themselves bow."',
    accentColor: '#F59E0B',
  },
  {
    id: 'stellar_dragon',
    name: 'Astral Dragonflight',
    emoji: '🐉',
    rarity: 'Celestial',
    baseChance: 950000, // 1 in 950,000 (0.000105%)
    luckBonus: 3700,
    sellValue: 210000,
    description: 'A wyrm of pure white stardust flying across galactic spiral arms.',
    flavorText: '"Its scales are living constellations."',
    accentColor: '#A855F7',
  },

  // Transcendent
  {
    id: 'infinity_eye',
    name: 'Eye of Infinity',
    emoji: '👁️',
    rarity: 'Transcendent',
    baseChance: 1000000, // 1 in 1,000,000 (0.0001%)
    luckBonus: 4000,
    sellValue: 250000,
    description: 'An omnipresent ocular crystal that gazes across all timelines, bending every roll to divine destiny.',
    flavorText: '"All probabilities converge at this single point."',
    accentColor: '#EC4899',
  },
  {
    id: 'singularity_core',
    name: 'Event Horizon Monarch',
    emoji: '🕳️',
    rarity: 'Transcendent',
    baseChance: 1800000, // 1 in 1,800,000 (0.000055%)
    luckBonus: 5200,
    sellValue: 380000,
    description: 'The point of no return where light, space, and time collapse into absolute zero volume.',
    flavorText: '"Not even light can escape my gravity."',
    accentColor: '#4F46E5',
  },
  {
    id: 'prismatic_phoenix',
    name: 'Prismatic Phoenix',
    emoji: '🔥',
    rarity: 'Transcendent',
    baseChance: 2500000, // 1 in 2,500,000 (0.00004%)
    luckBonus: 6500,
    sellValue: 500000,
    description: 'An immortal avian deity forged from starlight that resurrects from the ashes of collapsed galaxies.',
    flavorText: '"Fire dies, stars collapse, but the Phoenix sings forever."',
    accentColor: '#FB923C',
  },
  {
    id: 'bloodmoon_valkyrie',
    name: 'Bloodmoon Valkyrie',
    emoji: '🩸',
    rarity: 'Transcendent',
    baseChance: 3500000, // 1 in 3,500,000 (0.000028%)
    luckBonus: 8000,
    sellValue: 750000,
    description: 'A winged lunar sovereign wielding twin crimson claymores bathed in eclipsing moonlight.',
    flavorText: '"The moon turns crimson for those who conquer fate."',
    accentColor: '#E11D48',
  },
  {
    id: 'cosmic_weaver',
    name: 'Weaver of Destiny',
    emoji: '🕸️',
    rarity: 'Transcendent',
    baseChance: 4500000, // 1 in 4,500,000 (0.000022%)
    luckBonus: 9000,
    sellValue: 850000,
    description: 'Spins golden threads connecting every cause and effect across the multiverse.',
    flavorText: '"Your roll was woven eons ago."',
    accentColor: '#F59E0B',
  },

  // Impossible
  {
    id: 'napoleon',
    name: 'Napoleon',
    emoji: '👑',
    rarity: 'Impossible',
    baseChance: 10000000, // 1 in 10,000,000 (0.00001%) - The iconic impossible aura
    luckBonus: 10000, // +10,000% luck when equipped!
    sellValue: 1000000,
    description: '"There is nothing we can do." The conqueror of worlds stands triumphant on his rearing steed above the freezing Alps.',
    flavorText: '"Dans mon esprit tout divague, je me perds dans tes yeux... — There is nothing we can do."',
    accentColor: '#EF4444',
    imageUrl: napoleonImg,
  },
  {
    id: 'archangel_radiance',
    name: 'Seraphim: Dawn of Heavens',
    emoji: '👼',
    rarity: 'Impossible',
    baseChance: 25000000, // 1 in 25,000,000 (0.000004%)
    luckBonus: 16000, // +16,000% luck!
    sellValue: 2500000,
    description: 'Six shimmering golden wings unfolding across celestial planes, radiating divine mercy.',
    flavorText: '"Holy trumpets echo across eternity."',
    accentColor: '#FBBF24',
  },
  {
    id: 'chronos_deity',
    name: 'Eternity Prime: Timeless Sovereign',
    emoji: '⌛',
    rarity: 'Impossible',
    baseChance: 35000000, // 1 in 35,000,000 (0.0000028%)
    luckBonus: 20000, // +20,000% luck!
    sellValue: 3500000,
    description: 'A primordial god holding all past, present, and future in the palm of one hand.',
    flavorText: '"Time does not pass; you merely walk through it."',
    accentColor: '#38BDF8',
  },
  {
    id: 'matrix_overdrive',
    name: 'Cipher Nexus: Bytecode Singularity',
    emoji: '👾',
    rarity: 'Impossible',
    baseChance: 50000000, // 1 in 50,000,000 (0.000002%)
    luckBonus: 25000, // +25,000% luck!
    sellValue: 5000000,
    description: 'Reality deconstructs into cascading emerald bytecode, rewriting RNG probability at the hardware layer.',
    flavorText: '"01000110 01000001 01010100 01000101 — System Overridden."',
    accentColor: '#10B981',
  },
  {
    id: 'ouroboros_infinite',
    name: 'Ouroboros: Cycle of Infinity',
    emoji: '♾️',
    rarity: 'Impossible',
    baseChance: 75000000, // 1 in 75,000,000
    luckBonus: 35000,
    sellValue: 7500000,
    description: 'The cosmic serpent devouring its own tail, embodying the infinite birth and destruction of all creation.',
    flavorText: '"The beginning is the end, and the end is the roll."',
    accentColor: '#8B5CF6',
  },

  // ==========================================
  // 20 BIOME-EXCLUSIVE AURAS (BIOME SPECIFIC)
  // ==========================================

  // 1. Celestial Sanctuary Biome Exclusive (THE 1 IN 100M SUPREME AURA)
  {
    id: 'sanctuary_singularity',
    name: 'Aegis of the Infinite Void',
    emoji: '🌌',
    rarity: 'Impossible',
    baseChance: 100000000, // 1 in 100,000,000 (1 IN 100 MILLION)
    isBiomeExclusive: true,
    exclusiveBiomeId: 'celestial_sanctuary',
    exclusiveBiomeName: 'Celestial Sanctuary',
    luckBonus: 50000, // +50,000% luck boost!
    sellValue: 10000000,
    description: 'The supreme 1 in 100,000,000 biome-exclusive aura. Forged in the divine throne room of the Celestial Sanctuary, it bends all existence to your will.',
    flavorText: '"Reality collapses into absolute perfection before the Infinite Void."',
    accentColor: '#F59E0B',
    ability: {
      name: 'Infinite Void Singularity',
      description: 'Collapses space, dealing 2,500% true damage to all targets and stunning for 3.5s.',
      cooldownSec: 5.0,
      multiplier: 25.0,
      effectType: 'damage',
      effectValue: 2500,
      icon: '🌌',
    },
    combatStats: { health: 10000, attack: 1500, defense: 800, attackSpeed: 2.2, critChance: 0.85 },
  },
  {
    id: 'seraphim_sovereign',
    name: 'Seraphim Sovereign',
    emoji: '🪽',
    rarity: 'Impossible',
    baseChance: 25000000, // 1 in 25,000,000
    isBiomeExclusive: true,
    exclusiveBiomeId: 'celestial_sanctuary',
    exclusiveBiomeName: 'Celestial Sanctuary',
    luckBonus: 20000,
    sellValue: 2500000,
    description: 'Six golden wings of pure radiant starlight unfold, blessing the roller with divine fortune.',
    flavorText: '"Angelic choruses herald the arrival of sovereign luck."',
    accentColor: '#FDE047',
  },
  {
    id: 'solaris_divinity',
    name: 'Solaris Divinity',
    emoji: '☀️',
    rarity: 'Impossible',
    baseChance: 8000000, // 1 in 8,000,000
    isBiomeExclusive: true,
    exclusiveBiomeId: 'celestial_sanctuary',
    exclusiveBiomeName: 'Celestial Sanctuary',
    luckBonus: 12000,
    sellValue: 1200000,
    description: 'Blinding golden godrays envelop the roller in an eternal aura of divine supremacy.',
    flavorText: '"The sun itself bows before the throne."',
    accentColor: '#F59E0B',
  },

  // 2. Deep Space Singularity Biome Exclusives
  {
    id: 'event_horizon_omega',
    name: 'Event Horizon Ω',
    emoji: '🕳️',
    rarity: 'Impossible',
    baseChance: 15000000, // 1 in 15,000,000
    isBiomeExclusive: true,
    exclusiveBiomeId: 'deep_space',
    exclusiveBiomeName: 'Deep Space Singularity',
    luckBonus: 15000,
    sellValue: 1800000,
    description: 'A colossal gravitational singularity devouring light and warping time itself.',
    flavorText: '"Not even light can escape its inescapable pull."',
    accentColor: '#818CF8',
  },
  {
    id: 'starlight_supernova',
    name: 'Cosmic Supernova',
    emoji: '💫',
    rarity: 'Transcendent',
    baseChance: 3500000, // 1 in 3,500,000
    isBiomeExclusive: true,
    exclusiveBiomeId: 'deep_space',
    exclusiveBiomeName: 'Deep Space Singularity',
    luckBonus: 8500,
    sellValue: 850000,
    description: 'The explosive death and rebirth of a giant star discharging cosmic stellar dust.',
    flavorText: '"In stellar destruction, infinite probability is born."',
    accentColor: '#C084FC',
  },
  {
    id: 'quasar_monolith',
    name: 'Quasar Monolith',
    emoji: '💠',
    rarity: 'Celestial',
    baseChance: 900000, // 1 in 900,000
    isBiomeExclusive: true,
    exclusiveBiomeId: 'deep_space',
    exclusiveBiomeName: 'Deep Space Singularity',
    luckBonus: 4500,
    sellValue: 450000,
    description: 'A crystalline cosmic monolith emitting ultra-frequency pulsar radio waves.',
    flavorText: '"A beacon shining through ten billion light years of darkness."',
    accentColor: '#38BDF8',
  },

  // 3. Quantum Mirage Biome Exclusives
  {
    id: 'matrix_architect',
    name: 'Matrix Architect',
    emoji: '💻',
    rarity: 'Impossible',
    baseChance: 10000000, // 1 in 10,000,000
    isBiomeExclusive: true,
    exclusiveBiomeId: 'quantum_mirage',
    exclusiveBiomeName: 'Quantum Mirage',
    luckBonus: 10000,
    sellValue: 1500000,
    description: 'The sentient architect of the probability grid, altering variables at the quantum layer.',
    flavorText: '"01110010 01100101 01100001 01101100 01101001 01110100 01111001 — Rewritten."',
    accentColor: '#06B6D4',
  },
  {
    id: 'quantum_paradox',
    name: 'Quantum Paradox',
    emoji: '🌀',
    rarity: 'Transcendent',
    baseChance: 2200000, // 1 in 2,200,000
    isBiomeExclusive: true,
    exclusiveBiomeId: 'quantum_mirage',
    exclusiveBiomeName: 'Quantum Mirage',
    luckBonus: 6500,
    sellValue: 650000,
    description: 'A Schrodinger wave function existing in all probability states simultaneously.',
    flavorText: '"Until observed, all rolls are both lost and won."',
    accentColor: '#22D3EE',
  },
  {
    id: 'glitch_demiurge',
    name: 'Glitch Demiurge',
    emoji: '🔮',
    rarity: 'Celestial',
    baseChance: 850000, // 1 in 850,000
    isBiomeExclusive: true,
    exclusiveBiomeId: 'quantum_mirage',
    exclusiveBiomeName: 'Quantum Mirage',
    luckBonus: 3500,
    sellValue: 350000,
    description: 'A corrupted digital deity flashing green matrix glyphs across space.',
    flavorText: '"System memory stack overflow detected."',
    accentColor: '#34D399',
  },

  // 4. Abyssal Void Rift Biome Exclusives
  {
    id: 'void_emperor',
    name: 'Void Emperor',
    emoji: '👑',
    rarity: 'Impossible',
    baseChance: 5000000, // 1 in 5,000,000
    isBiomeExclusive: true,
    exclusiveBiomeId: 'abyssal_rift',
    exclusiveBiomeName: 'Abyssal Void Rift',
    luckBonus: 7500,
    sellValue: 900000,
    description: 'Sovereign ruler of the dark dimensional rift, draped in shadowy anti-matter robes.',
    flavorText: '"Kneel before the lord of forgotten dimensions."',
    accentColor: '#A855F7',
  },
  {
    id: 'shadow_oblivion',
    name: 'Shadow Oblivion',
    emoji: '🌑',
    rarity: 'Transcendent',
    baseChance: 1800000, // 1 in 1,800,000
    isBiomeExclusive: true,
    exclusiveBiomeId: 'abyssal_rift',
    exclusiveBiomeName: 'Abyssal Void Rift',
    luckBonus: 5000,
    sellValue: 500000,
    description: 'An absolute eclipse of all light, consuming common drops into dark matter.',
    flavorText: '"In total shadow, absolute clarity emerges."',
    accentColor: '#7E22CE',
  },
  {
    id: 'nether_harbinger',
    name: 'Nether Harbinger',
    emoji: '🕷️',
    rarity: 'Celestial',
    baseChance: 450000, // 1 in 450,000
    isBiomeExclusive: true,
    exclusiveBiomeId: 'abyssal_rift',
    exclusiveBiomeName: 'Abyssal Void Rift',
    luckBonus: 2800,
    sellValue: 280000,
    description: 'An arachnid terror weaving fate threads out of dark energy webs.',
    flavorText: '"Every web thread connects to a different timeline."',
    accentColor: '#9333EA',
  },

  // 5. Electrified Tempest Biome Exclusives
  {
    id: 'mjolnir_raijin',
    name: 'Raijin Mjolnir',
    emoji: '🌩️',
    rarity: 'Transcendent',
    baseChance: 3000000, // 1 in 3,000,000
    isBiomeExclusive: true,
    exclusiveBiomeId: 'electrified_tempest',
    exclusiveBiomeName: 'Electrified Tempest',
    luckBonus: 7000,
    sellValue: 700000,
    description: 'A divine lightning hammer crackling with ten million gigawatts of electric thunder.',
    flavorText: '"The storm god strikes the forge of fate."',
    accentColor: '#FACC15',
  },
  {
    id: 'volt_overlord',
    name: 'Volt Overlord',
    emoji: '⚡',
    rarity: 'Celestial',
    baseChance: 600000, // 1 in 600,000
    isBiomeExclusive: true,
    exclusiveBiomeId: 'electrified_tempest',
    exclusiveBiomeName: 'Electrified Tempest',
    luckBonus: 3200,
    sellValue: 320000,
    description: 'High-voltage tesla coils encircling the roller in constant ionic lightning arcs.',
    flavorText: '"Feel the static charge in every roll."',
    accentColor: '#EAB308',
  },
  {
    id: 'plasma_lightning',
    name: 'Plasma Storm Core',
    emoji: '🧪',
    rarity: 'Mythic',
    baseChance: 150000, // 1 in 150,000
    isBiomeExclusive: true,
    exclusiveBiomeId: 'electrified_tempest',
    exclusiveBiomeName: 'Electrified Tempest',
    luckBonus: 1800,
    sellValue: 180000,
    description: 'A ball of superheated plasma spinning inside an electromagnetic containment ring.',
    flavorText: '"Pure kinetic energy unleashed."',
    accentColor: '#E11D48',
  },

  // 6. Magma Cavern Biome Exclusives
  {
    id: 'inferno_surtr',
    name: "Surtr's Inferno",
    emoji: '🔥',
    rarity: 'Transcendent',
    baseChance: 2500000, // 1 in 2,500,000
    isBiomeExclusive: true,
    exclusiveBiomeId: 'magma_cavern',
    exclusiveBiomeName: 'Magma Cavern',
    luckBonus: 6000,
    sellValue: 600000,
    description: 'The fiery primordial greatsword that burns away bad fortune in volcanic magma.',
    flavorText: '"World-ending flames forge supreme luck."',
    accentColor: '#EA580C',
  },
  {
    id: 'pyro_leviathan',
    name: 'Pyro Leviathan',
    emoji: '🐉',
    rarity: 'Celestial',
    baseChance: 500000, // 1 in 500,000
    isBiomeExclusive: true,
    exclusiveBiomeId: 'magma_cavern',
    exclusiveBiomeName: 'Magma Cavern',
    luckBonus: 3000,
    sellValue: 300000,
    description: 'A massive obsidian dragon rising from molten lava pits.',
    flavorText: '"Deep in the magma core, fire dragons awaken."',
    accentColor: '#F97316',
  },

  // 7. Glacial Tundra Biome Exclusives
  {
    id: 'absolute_zero_cryo',
    name: 'Absolute Zero Apex',
    emoji: '🧊',
    rarity: 'Transcendent',
    baseChance: 2000000, // 1 in 2,000,000
    isBiomeExclusive: true,
    exclusiveBiomeId: 'glacial_tundra',
    exclusiveBiomeName: 'Glacial Tundra',
    luckBonus: 5500,
    sellValue: 550000,
    description: 'Sub-zero cryo frost freezing probability variables at absolute zero temperature (0 Kelvin).',
    flavorText: '"At 0 Kelvin, molecular motion stops and perfection freezes in place."',
    accentColor: '#38BDF8',
  },
  {
    id: 'frost_valkyrie',
    name: 'Frost Valkyrie',
    emoji: '❄️',
    rarity: 'Celestial',
    baseChance: 350000, // 1 in 350,000
    isBiomeExclusive: true,
    exclusiveBiomeId: 'glacial_tundra',
    exclusiveBiomeName: 'Glacial Tundra',
    luckBonus: 2500,
    sellValue: 250000,
    description: 'An ice warrior maiden soaring through blizzard storms on crystalline frost wings.',
    flavorText: '"Frozen blades cut through common luck."',
    accentColor: '#67E8F9',
  },

  // 8. Breezy Highlands Biome Exclusive
  {
    id: 'zephyr_sovereign',
    name: 'Zephyr Sovereign',
    emoji: '🍃',
    rarity: 'Celestial',
    baseChance: 920000, // 1 in 920,000
    isBiomeExclusive: true,
    exclusiveBiomeId: 'breezy_highlands',
    exclusiveBiomeName: 'Breezy Highlands',
    luckBonus: 4000,
    sellValue: 400000,
    description: 'Gale mountain spirits swirling emerald leaf twisters around the roller.',
    flavorText: '"Mountain winds carry the blessings of ancient spirits."',
    accentColor: '#10B981',
  },

  // 9. SUPREME 1 IN 500,000,000 DEEP SPACE SINGULARITY EXCLUSIVE AURA
  {
    id: 'singularity_godhead',
    name: 'Event Horizon Godhead: Prime Omnipotence',
    emoji: '🌌',
    rarity: 'Impossible',
    baseChance: 500000000, // 1 in 500,000,000
    isBiomeExclusive: true,
    exclusiveBiomeId: 'deep_space',
    exclusiveBiomeName: 'Deep Space Singularity',
    luckBonus: 100000, // +100,000% Base Luck Boost!
    sellValue: 25000000, // 25,000,000 Shards!
    imageUrl: singularityGodheadImg,
    description: 'The supreme cosmic godhead manifested at the center of a supermassive black hole. Erases gravitational physics and annihilates all boss entities.',
    flavorText: '"I am the beginning, the singularity, and the eternal end of all existence."',
    accentColor: '#C084FC',
  },
];

// Helper to get items sorted by rarity descending (rarest first for RNG check)
export const ITEMS_BY_RARITY_DESC = [...ITEMS].sort((a, b) => b.baseChance - a.baseChance);

// The top 3 rarest auras in the game
export const TOP_3_RAREST_ITEMS = ITEMS_BY_RARITY_DESC.slice(0, 3);
export const TOP_3_RAREST_IDS = TOP_3_RAREST_ITEMS.map((i) => i.id);

export function isTop3RarestItem(itemId: string): boolean {
  return TOP_3_RAREST_IDS.includes(itemId);
}

export function formatChance(chance: number): string {
  if (chance >= 1000000) {
    return `1 in ${(chance / 1000000).toFixed(1)}M`;
  }
  if (chance >= 1000) {
    return `1 in ${(chance / 1000).toLocaleString()}k`;
  }
  return `1 in ${chance}`;
}

export function formatPercent(chance: number): string {
  const pct = (1 / chance) * 100;
  if (pct >= 1) {
    return `${pct.toFixed(1)}%`;
  }
  if (pct >= 0.01) {
    return `${pct.toFixed(3)}%`;
  }
  return `${pct.toFixed(6)}%`;
}
