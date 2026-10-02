import { Biome } from '../types/rng';

export const BIOMES: Biome[] = [
  {
    id: 'clear_horizon',
    name: 'Clear Horizon',
    emoji: '🌤️',
    rarityChance: 1, // 1 in 1 (Base / Default)
    color: '#38BDF8',
    gradientBg: 'from-sky-950/70 via-slate-900 to-slate-950',
    description: 'A serene open expanse with drifting starlight and steady probability currents.',
    flavorQuote: '"Calm winds carry the promise of fortune."',
    boostedAuras: [],
    ambientParticleType: 'clear',
    durationSeconds: 120,
  },
  {
    id: 'breezy_highlands',
    name: 'Breezy Highlands',
    emoji: '🍃',
    rarityChance: 60, // 1 in 60
    color: '#10B981',
    gradientBg: 'from-emerald-950/80 via-teal-950/60 to-slate-950',
    description: 'High altitude mountain gales carrying swirling emerald leaves and serendipitous currents.',
    flavorQuote: '"Gale winds separate common dust from true gems."',
    boostedAuras: [
      { itemId: 'four_leaf_clover', multiplier: 6.0 },
      { itemId: 'maple_leaf', multiplier: 5.0 },
      { itemId: 'tempest_harbinger', multiplier: 4.5 },
      { itemId: 'sea_glass', multiplier: 4.0 },
    ],
    ambientParticleType: 'wind',
    durationSeconds: 120,
  },
  {
    id: 'glacial_tundra',
    name: 'Glacial Tundra',
    emoji: '❄️',
    rarityChance: 150, // 1 in 150
    color: '#67E8F9',
    gradientBg: 'from-cyan-950/85 via-blue-950/70 to-slate-950',
    description: 'Sub-zero permafrost plains where crystal snowflakes fall and freeze probability in place.',
    flavorQuote: '"In absolute cold, only the most resilient diamonds shine."',
    boostedAuras: [
      { itemId: 'frost_crown', multiplier: 7.0 },
      { itemId: 'amethyst_shard', multiplier: 5.0 },
      { itemId: 'aurora_veil', multiplier: 5.5 },
      { itemId: 'singularity_singlet', multiplier: 4.0 },
    ],
    ambientParticleType: 'snow',
    durationSeconds: 110,
  },
  {
    id: 'magma_cavern',
    name: 'Magma Cavern',
    emoji: '🌋',
    rarityChance: 300, // 1 in 300
    color: '#F97316',
    gradientBg: 'from-orange-950/85 via-red-950/75 to-slate-950',
    description: 'Subterranean volcanic chasms flowing with liquid magma and glowing thermal embers.',
    flavorQuote: '"Let ill fortune burn away in the volcanic core."',
    boostedAuras: [
      { itemId: 'phoenix_feather', multiplier: 8.0 },
      { itemId: 'solar_aegis', multiplier: 6.5 },
      { itemId: 'solar_flare', multiplier: 6.0 },
      { itemId: 'dragon_heart', multiplier: 5.5 },
      { itemId: 'zenith_hyperion', multiplier: 4.5 },
    ],
    ambientParticleType: 'fire',
    durationSeconds: 100,
  },
  {
    id: 'electrified_tempest',
    name: 'Electrified Tempest',
    emoji: '⚡',
    rarityChance: 650, // 1 in 650
    color: '#FACC15',
    gradientBg: 'from-yellow-950/85 via-amber-950/70 to-slate-950',
    description: 'A violent supercell thunderstorm discharging millions of high-voltage ionic arcs.',
    flavorQuote: '"Lightning never strikes the same place twice — unless summoned."',
    boostedAuras: [
      { itemId: 'storm_dagger', multiplier: 10.0 },
      { itemId: 'thunder_kami', multiplier: 8.0 },
      { itemId: 'cyber_overclock', multiplier: 7.0 },
      { itemId: 'pulsar_core', multiplier: 5.0 },
    ],
    ambientParticleType: 'thunder',
    durationSeconds: 90,
  },
  {
    id: 'abyssal_rift',
    name: 'Abyssal Void Rift',
    emoji: '👾',
    rarityChance: 1200, // 1 in 1,200
    color: '#A855F7',
    gradientBg: 'from-purple-950/90 via-indigo-950/80 to-slate-950',
    description: 'A dimensional fracture tearing space open, pulling nearby stars into an event horizon.',
    flavorQuote: '"Gaze into the abyss, and feel its gravitational pull."',
    boostedAuras: [
      { itemId: 'void_prism', multiplier: 12.0 },
      { itemId: 'spectral_wraith', multiplier: 9.0 },
      { itemId: 'blood_moon_scythe', multiplier: 8.5 },
      { itemId: 'abyssal_voidwalker', multiplier: 6.0 },
      { itemId: 'eclipse_scythe', multiplier: 5.5 },
    ],
    ambientParticleType: 'void',
    durationSeconds: 85,
  },
  {
    id: 'deep_space',
    name: 'Deep Space Singularity',
    emoji: '🌌',
    rarityChance: 2500, // 1 in 2,500
    color: '#818CF8',
    gradientBg: 'from-indigo-950/95 via-slate-950 to-black',
    description: 'The silent cosmic expanse between distant galaxies, illuminated by drifting constellations and shooting meteors.',
    flavorQuote: '"Countless superclusters whisper secrets to those who dare wander the stars."',
    boostedAuras: [
      { itemId: 'supernova_fragment', multiplier: 15.0 },
      { itemId: 'galactic_pulsar', multiplier: 12.0 },
      { itemId: 'quasar_nova', multiplier: 8.5 },
      { itemId: 'stellar_dragon', multiplier: 7.5 },
      { itemId: 'nebula_weaver', multiplier: 7.0 },
    ],
    ambientParticleType: 'space',
    durationSeconds: 80,
  },
  {
    id: 'quantum_mirage',
    name: 'Quantum Mirage',
    emoji: '🌀',
    rarityChance: 6000, // 1 in 6,000
    color: '#06B6D4',
    gradientBg: 'from-cyan-950/95 via-teal-950/80 to-black',
    description: 'An ethereal quantum rift where probability waves fluctuate into parallel dimensions.',
    flavorQuote: '"Wave functions collapse into impossible fortune."',
    boostedAuras: [
      { itemId: 'glitch_catalyst', multiplier: 20.0 },
      { itemId: 'matrix_overdrive', multiplier: 14.0 },
      { itemId: 'mirage_lantern', multiplier: 10.0 },
      { itemId: 'ouroboros_infinite', multiplier: 8.0 },
    ],
    ambientParticleType: 'glitch',
    durationSeconds: 75,
  },
  {
    id: 'celestial_sanctuary',
    name: 'Celestial Sanctuary',
    emoji: '👑',
    rarityChance: 18000, // 1 in 18,000
    color: '#FDE047',
    gradientBg: 'from-amber-950/95 via-yellow-950/80 to-slate-950',
    description: 'The divine starlight throne room of the cosmos, bathed in blinding golden godrays and angelic choruses.',
    flavorQuote: '"Where impossible dreams materialize into reality."',
    boostedAuras: [
      { itemId: 'archangel_radiance', multiplier: 25.0 },
      { itemId: 'chronos_hourglass', multiplier: 18.0 },
      { itemId: 'napoleon', multiplier: 15.0 },
      { itemId: 'ouroboros_infinite', multiplier: 12.0 },
      { itemId: 'zenith_hyperion', multiplier: 10.0 },
    ],
    ambientParticleType: 'celestial',
    durationSeconds: 70,
  },
];

export const BIOMES_BY_ID: Record<string, Biome> = BIOMES.reduce((acc, b) => {
  acc[b.id] = b;
  return acc;
}, {} as Record<string, Biome>);

export function getBiomeById(id: string): Biome {
  return BIOMES_BY_ID[id] || BIOMES[0];
}

/**
 * Rolls for a random rare biome transition when rolling in the chamber.
 * Rarest biomes checked first!
 */
export function rollRandomBiome(): Biome | null {
  // Sort biomes from highest rarity to lowest
  const sorted = [...BIOMES].filter((b) => b.rarityChance > 1).sort((a, b) => b.rarityChance - a.rarityChance);

  for (const biome of sorted) {
    const roll = Math.random();
    // 1 in rarityChance
    if (roll < 1 / biome.rarityChance) {
      return biome;
    }
  }

  return null;
}
