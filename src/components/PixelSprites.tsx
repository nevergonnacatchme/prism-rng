import React from 'react';

// 1. PLAYER SPRITE: Little Silver Knight holding Gold Shield & Upright Sword (Exact match to download (3).jfif)
export const PlayerPixelKnight: React.FC<{
  auraColor?: string;
  isAttacking?: boolean;
  comboStep?: number;
}> = ({ auraColor = '#38BDF8', isAttacking = false, comboStep = 1 }) => {
  const swordAngle = isAttacking
    ? comboStep === 1
      ? 45
      : comboStep === 2
      ? -30
      : comboStep === 3
      ? 80
      : -80
    : 0;

  return (
    <div className="relative flex flex-col items-center select-none filter drop-shadow-md">
      <svg
        width="64"
        height="72"
        viewBox="0 0 64 72"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        style={{ imageRendering: 'pixelated' }}
      >
        {/* Red Plume Feather on Top of Helmet */}
        <path d="M28 2 H38 V6 H36 V10 H30 V6 H28 Z" fill="#DC2626" />
        <path d="M32 4 H42 V8 H38 V12 H32 Z" fill="#EF4444" />

        {/* Silver Helmet */}
        <rect x="22" y="10" width="20" height="18" fill="#9CA3AF" />
        <rect x="20" y="14" width="24" height="12" fill="#D1D5DB" />
        <rect x="24" y="10" width="16" height="4" fill="#E5E7EB" />

        {/* Dark Visor Slit */}
        <rect x="28" y="18" width="12" height="4" fill="#1F2937" />
        <rect x="32" y="19" width="4" height="2" fill="#38BDF8" />

        {/* Neck Guard */}
        <rect x="24" y="28" width="16" height="4" fill="#6B7280" />

        {/* Steel Plate Torso */}
        <rect x="20" y="32" width="24" height="20" fill="#9CA3AF" />
        <rect x="24" y="34" width="16" height="16" fill="#D1D5DB" />

        {/* Gold Belt Buckle */}
        <rect x="20" y="52" width="24" height="4" fill="#1F2937" />
        <rect x="28" y="51" width="8" height="6" fill="#F59E0B" />
        <rect x="30" y="53" width="4" height="2" fill="#FEF08A" />

        {/* Legs & Boots */}
        <rect x="22" y="56" width="8" height="12" fill="#6B7280" />
        <rect x="34" y="56" width="8" height="12" fill="#6B7280" />
        <rect x="20" y="66" width="10" height="6" fill="#374151" />
        <rect x="34" y="66" width="10" height="6" fill="#374151" />

        {/* Gold & Wood Shield in Left Hand (download (3).jfif) */}
        <g transform="translate(4, 30)">
          <rect x="0" y="0" width="18" height="24" fill="#D97706" rx="2" />
          <rect x="2" y="2" width="14" height="20" fill="#B45309" />
          <rect x="4" y="4" width="10" height="16" fill="#F59E0B" />
          <rect x="7" y="10" width="4" height="4" fill="#FEF08A" />
        </g>

        {/* Silver Sword in Right Hand (Held Upright) */}
        <g
          transform={`translate(46, 28) rotate(${swordAngle})`}
          style={{ transformOrigin: '4px 20px', transition: 'transform 0.1s ease-out' }}
        >
          {/* Gold Hilt & Crossguard */}
          <rect x="0" y="18" width="12" height="3" fill="#F59E0B" />
          <rect x="4" y="21" width="4" height="5" fill="#B45309" />
          <rect x="3" y="26" width="6" height="3" fill="#F59E0B" />

          {/* Silver Upright Blade */}
          <rect x="3" y="-12" width="6" height="30" fill="#E5E7EB" />
          <rect x="5" y="-16" width="2" height="4" fill="#FFFFFF" />
          <rect x="5" y="-12" width="2" height="30" fill="#FFFFFF" />
          <rect x="3" y="-12" width="2" height="30" fill="#9CA3AF" />
        </g>
      </svg>
    </div>
  );
};

// 2. GOBLIN BOSS SPRITE (Levels 1 to 5): Green Goblin crouching with spiked wooden board club (download (1).jfif)
export const GoblinBossSprite: React.FC<{
  isAttacking?: boolean;
}> = ({ isAttacking = false }) => {
  const clubAngle = isAttacking ? -65 : 0;

  return (
    <div className="relative flex flex-col items-center select-none filter drop-shadow-xl">
      <svg
        width="88"
        height="96"
        viewBox="0 0 88 96"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        style={{ imageRendering: 'pixelated' }}
      >
        {/* Large Pointed Ears with Orange/Red Inner Lining */}
        <path d="M12 18 L2 8 L18 22 Z" fill="#65A30D" />
        <path d="M14 20 L6 12 L16 22 Z" fill="#EA580C" />
        <path d="M64 18 L80 4 L62 22 Z" fill="#65A30D" />
        <path d="M62 20 L74 8 L60 22 Z" fill="#EA580C" />

        {/* Crouching Green Goblin Head */}
        <rect x="22" y="16" width="36" height="28" fill="#65A30D" rx="2" />
        <rect x="18" y="24" width="42" height="16" fill="#84CC16" />

        {/* Pointed Chin / Nose */}
        <polygon points="18,32 10,38 22,42" fill="#4D7C0F" />

        {/* Yellow Menacing Eyes */}
        <rect x="26" y="22" width="10" height="8" fill="#FACC15" />
        <rect x="30" y="24" width="4" height="5" fill="#1F2937" />
        <rect x="46" y="22" width="10" height="8" fill="#FACC15" />
        <rect x="48" y="24" width="4" height="5" fill="#1F2937" />

        {/* Sharp Fang Teeth */}
        <rect x="24" y="38" width="30" height="6" fill="#111827" />
        <polygon points="26,38 28,43 30,38" fill="#FFFFFF" />
        <polygon points="40,38 42,43 44,38" fill="#FFFFFF" />

        {/* Thin Crouched Torso */}
        <rect x="26" y="44" width="28" height="22" fill="#4D7C0F" />
        <rect x="30" y="46" width="20" height="18" fill="#65A30D" />

        {/* Purple Loincloth Shorts */}
        <rect x="24" y="64" width="32" height="12" fill="#7E22CE" />
        <rect x="28" y="66" width="24" height="12" fill="#A855F7" />

        {/* Thin Sprawled Legs */}
        <rect x="20" y="76" width="10" height="16" fill="#4D7C0F" />
        <rect x="50" y="76" width="10" height="16" fill="#4D7C0F" />
        <rect x="14" y="88" width="16" height="6" fill="#365314" />
        <rect x="50" y="88" width="16" height="6" fill="#365314" />

        {/* Spiked Wooden Club Board held low in hands (download (1).jfif) */}
        <g
          transform={`translate(32, 58) rotate(${clubAngle})`}
          style={{ transformOrigin: '10px 10px', transition: 'transform 0.15s ease-out' }}
        >
          {/* Wooden Plank Board */}
          <rect x="-10" y="10" width="48" height="14" fill="#78350F" transform="rotate(25)" />
          <rect x="-8" y="12" width="44" height="10" fill="#92400E" transform="rotate(25)" />

          {/* Silver Nails & Spikes sticking out */}
          <line x1="10" y1="12" x2="10" y2="2" stroke="#E5E7EB" strokeWidth="3" />
          <line x1="22" y1="18" x2="22" y2="6" stroke="#E5E7EB" strokeWidth="3" />
          <line x1="32" y1="22" x2="32" y2="10" stroke="#E5E7EB" strokeWidth="3" />
          <line x1="18" y1="32" x2="18" y2="40" stroke="#E5E7EB" strokeWidth="3" />
        </g>
      </svg>
    </div>
  );
};

// 3. DARK KNIGHT BOSS SPRITE (Levels 6 to 10): Full armor Dark Knight with flowing Red Cape & Greatsword straight down (download (2).jfif)
export const DarkKnightBossSprite: React.FC<{
  isAttacking?: boolean;
  isChargingQte?: boolean;
}> = ({ isAttacking = false, isChargingQte = false }) => {
  const swordRotation = isChargingQte ? -110 : isAttacking ? 60 : 0;

  return (
    <div className="relative flex flex-col items-center select-none filter drop-shadow-2xl">
      <svg
        width="96"
        height="128"
        viewBox="0 0 96 128"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        style={{ imageRendering: 'pixelated' }}
      >
        {/* Long Flowing Red Cape Behind Back (download (2).jfif) */}
        <path d="M20 28 L10 116 L86 116 L76 28 Z" fill="#991B1B" />
        <path d="M24 30 L16 112 L80 112 L72 30 Z" fill="#DC2626" />
        <path d="M32 32 L26 110 L70 110 L64 32 Z" fill="#EF4444" />

        {/* Tall Red Helmet Plume Feather */}
        <path d="M42 2 H54 V12 H48 V18 H42 Z" fill="#DC2626" />
        <path d="M46 4 H58 V14 H52 V20 H46 Z" fill="#EF4444" />

        {/* Closed Dark Steel Great-Helm */}
        <rect x="34" y="16" width="28" height="24" fill="#374151" rx="2" />
        <rect x="36" y="18" width="24" height="20" fill="#4B5563" />
        <rect x="40" y="16" width="16" height="4" fill="#6B7280" />

        {/* T-Visor Slit */}
        <rect x="38" y="26" width="20" height="5" fill="#111827" />
        <rect x="46" y="24" width="4" height="12" fill="#111827" />
        <rect x="47" y="27" width="2" height="2" fill="#EF4444" />

        {/* Heavy Dark Plate Armor Torso */}
        <rect x="28" y="40" width="40" height="34" fill="#1F2937" />
        <rect x="32" y="42" width="32" height="30" fill="#374151" />

        {/* Heavy Shoulder Pauldrons */}
        <rect x="20" y="40" width="10" height="16" fill="#4B5563" rx="2" />
        <rect x="66" y="40" width="10" height="16" fill="#4B5563" rx="2" />

        {/* Armored Leg Greaves & Boots */}
        <rect x="32" y="74" width="12" height="36" fill="#374151" />
        <rect x="52" y="74" width="12" height="36" fill="#374151" />
        <rect x="28" y="110" width="16" height="12" fill="#1F2937" />
        <rect x="52" y="110" width="16" height="12" fill="#1F2937" />

        {/* Giant Two-Handed Broadsword (Points straight down between boots - download (2).jfif) */}
        <g
          transform={`translate(48, 52) rotate(${swordRotation})`}
          style={{ transformOrigin: '0px 0px', transition: 'transform 0.15s ease-out' }}
        >
          {/* Gold Crossguard & Pommel */}
          <rect x="-16" y="0" width="32" height="5" fill="#D97706" />
          <rect x="-14" y="1" width="28" height="3" fill="#F59E0B" />
          <rect x="-3" y="-12" width="6" height="12" fill="#B45309" />
          <rect x="-5" y="-16" width="10" height="5" fill="#F59E0B" />

          {/* Long Steel Blade Pointed Downward */}
          <rect x="-5" y="5" width="10" height="65" fill="#E5E7EB" />
          <rect x="-1" y="5" width="2" height="65" fill="#FFFFFF" />
          <rect x="-5" y="5" width="3" height="65" fill="#9CA3AF" />
          <polygon points="-5,70 5,70 0,78" fill="#E5E7EB" />
        </g>
      </svg>
    </div>
  );
};

// 4. GARGANTUAN TROLL FINAL BOSS SPRITE (Level 10 Final Boss): Tall, chunky light-green mutant troll with giant razor-fanged grin, round belly, red loincloth, and spiked mace (download (4).jfif)
export const GargantuanTrollBossSprite: React.FC<{
  isAttacking?: boolean;
  isChargingQte?: boolean;
}> = ({ isAttacking = false, isChargingQte = false }) => {
  const maceAngle = isChargingQte ? -110 : isAttacking ? 55 : 0;

  return (
    <div className="relative flex flex-col items-center select-none filter drop-shadow-2xl">
      <svg
        width="136"
        height="168"
        viewBox="0 0 136 168"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        style={{ imageRendering: 'pixelated' }}
      >
        {/* Massive Hunched Traps / Shoulder Hump */}
        <path d="M38 24 Q68 10 98 24 L108 50 L28 50 Z" fill="#4D7C0F" />
        <path d="M42 26 Q68 14 94 26 L102 48 L34 48 Z" fill="#65A30D" />

        {/* Hunched Head (Low sitting between shoulder traps) */}
        <rect x="44" y="16" width="48" height="32" fill="#65A30D" rx="6" />
        <rect x="48" y="18" width="40" height="26" fill="#84CC16" rx="4" />

        {/* Large Pointed Ears extending out */}
        <path d="M44 24 L24 16 L42 34 Z" fill="#65A30D" />
        <path d="M42 26 L28 20 L40 32 Z" fill="#4D7C0F" />
        <path d="M92 24 L112 16 L94 34 Z" fill="#65A30D" />
        <path d="M94 26 L108 20 L96 32 Z" fill="#4D7C0F" />

        {/* Glowing Eyes */}
        <rect x="52" y="22" width="10" height="7" fill="#FEF08A" rx="1" />
        <rect x="56" y="24" width="4" height="4" fill="#1F2937" />
        <rect x="74" y="22" width="10" height="7" fill="#FEF08A" rx="1" />
        <rect x="76" y="24" width="4" height="4" fill="#1F2937" />

        {/* GIANT WIDE RAZOR-FANGED GRINNING MOUTH (download (4).jfif signature look) */}
        <rect x="48" y="32" width="40" height="12" fill="#090D16" rx="3" />
        {/* Top Sharp Fangs */}
        <polygon points="50,32 53,38 56,32" fill="#FFFFFF" />
        <polygon points="56,32 59,38 62,32" fill="#FFFFFF" />
        <polygon points="62,32 65,38 68,32" fill="#FFFFFF" />
        <polygon points="68,32 71,38 74,32" fill="#FFFFFF" />
        <polygon points="74,32 77,38 80,32" fill="#FFFFFF" />
        <polygon points="80,32 83,38 86,32" fill="#FFFFFF" />
        {/* Bottom Sharp Fangs */}
        <polygon points="52,44 55,38 58,44" fill="#FFFFFF" />
        <polygon points="58,44 61,38 64,44" fill="#FFFFFF" />
        <polygon points="64,44 67,38 70,44" fill="#FFFFFF" />
        <polygon points="70,44 73,38 76,44" fill="#FFFFFF" />
        <polygon points="76,44 79,38 82,44" fill="#FFFFFF" />

        {/* HUGE ROTUND / CHUNKY BLOATED BELLY (download (4).jfif) */}
        <ellipse cx="68" cy="80" rx="42" ry="36" fill="#4D7C0F" />
        <ellipse cx="68" cy="80" rx="38" ry="32" fill="#65A30D" />
        <ellipse cx="68" cy="82" rx="30" ry="26" fill="#84CC16" />
        {/* Belly Button Line */}
        <circle cx="68" cy="88" r="3" fill="#365314" />

        {/* Muscular Long Left & Right Arms */}
        <path d="M28 48 Q18 70 24 105 L34 105 Q30 70 38 48 Z" fill="#65A30D" />
        <path d="M108 48 Q118 70 112 105 L102 105 Q106 70 98 48 Z" fill="#65A30D" />

        {/* RED / CRIMSON TATTERED LOINCLOTH BRIEFS (download (4).jfif) */}
        <path d="M38 102 L98 102 L90 125 L46 125 Z" fill="#7F1D1D" />
        <path d="M42 104 L94 104 L86 123 L50 123 Z" fill="#991B1B" />
        <path d="M46 106 L90 106 L82 121 L54 121 Z" fill="#DC2626" />

        {/* Thick Muscular Legs & Feet */}
        <rect x="42" y="122" width="18" height="34" fill="#4D7C0F" rx="3" />
        <rect x="76" y="122" width="18" height="34" fill="#4D7C0F" rx="3" />
        <rect x="44" y="124" width="14" height="30" fill="#65A30D" />
        <rect x="78" y="124" width="14" height="30" fill="#65A30D" />
        {/* Feet / Toes */}
        <rect x="36" y="152" width="26" height="12" fill="#365314" rx="3" />
        <rect x="74" y="152" width="26" height="12" fill="#365314" rx="3" />

        {/* GIANT SPIKED MACE / MORNINGSTAR BALL ON A STICK (download (4).jfif) */}
        <g
          transform={`translate(30, 95) rotate(${maceAngle})`}
          style={{ transformOrigin: '0px 0px', transition: 'transform 0.15s ease-out' }}
        >
          {/* Wooden Handle Stick */}
          <rect x="-6" y="0" width="12" height="60" fill="#78350F" transform="rotate(-30)" />
          <rect x="-4" y="0" width="8" height="58" fill="#92400E" transform="rotate(-30)" />

          {/* Heavy Iron Spiked Mace Ball at the end */}
          <g transform="translate(28, 48)">
            <circle cx="0" cy="0" r="20" fill="#1F2937" />
            <circle cx="0" cy="0" r="17" fill="#374151" />
            <circle cx="-4" cy="-4" r="14" fill="#4B5563" />

            {/* Iron Spikes */}
            <polygon points="0,-20 -5,-32 5,-32" fill="#E5E7EB" />
            <polygon points="20,0 32,-5 32,5" fill="#E5E7EB" />
            <polygon points="0,20 -5,32 5,32" fill="#E5E7EB" />
            <polygon points="-20,0 -32,-5 -32,5" fill="#E5E7EB" />
            <polygon points="14,14 24,24 18,26" fill="#E5E7EB" />
            <polygon points="-14,-14 -24,-24 -18,-26" fill="#E5E7EB" />
            <polygon points="14,-14 24,-24 26,-18" fill="#E5E7EB" />
            <polygon points="-14,14 -24,24 -26,18" fill="#E5E7EB" />
          </g>
        </g>
      </svg>
    </div>
  );
};
