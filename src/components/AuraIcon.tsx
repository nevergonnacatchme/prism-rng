import React from 'react';
import { 
  Sparkles, Flame, Shield, Swords, Zap, Moon, Sun, Star, 
  Crown, Disc, Feather, Eye, Globe, Compass, Gem, 
  BookOpen, Droplets, Wind, Skull, Waves, Mountain, Circle
} from 'lucide-react';
import { RNGItem } from '../types/rng';

interface AuraIconProps {
  item: RNGItem | { id?: string; name?: string; emoji?: string; accentColor?: string; rarity?: string };
  size?: 'xs' | 'sm' | 'md' | 'lg' | 'xl' | '2xl' | 'hero';
  className?: string;
  showGlow?: boolean;
}

const sizeClasses = {
  xs: 'w-4 h-4 text-xs',
  sm: 'w-6 h-6 text-sm',
  md: 'w-8 h-8 text-base',
  lg: 'w-12 h-12 text-2xl',
  xl: 'w-16 h-16 text-3xl',
  '2xl': 'w-24 h-24 text-5xl',
  hero: 'w-36 h-36 text-7xl sm:text-8xl',
};

export const AuraIcon: React.FC<AuraIconProps> = ({
  item,
  size = 'md',
  className = '',
  showGlow = false,
}) => {
  if (!item) return null;

  const color = item.accentColor || '#38BDF8';
  const sizeCls = sizeClasses[size] || sizeClasses.md;

  // Custom Icon mapping for items to ensure 100% crisp visual representation on any browser
  const renderIconSvg = () => {
    switch (item.id) {
      case 'pebble':
        return (
          <div className="relative flex items-center justify-center">
            <div className="w-3/4 h-3/4 rounded-full bg-slate-400 border border-slate-300 shadow-inner" />
          </div>
        );
      case 'silver_coin':
        return <Disc className="w-full h-full text-slate-200 fill-slate-300/30" />;
      case 'amber_fossil':
        return (
          <div className="relative flex items-center justify-center">
            <div className="w-3/4 h-3/4 rounded-2xl bg-amber-500 border border-amber-300 rotate-12 flex items-center justify-center text-[10px] text-amber-950 font-black shadow-md">
              🍯
            </div>
          </div>
        );
      case 'phoenix_feather':
        return <Feather className="w-full h-full text-orange-400 drop-shadow-[0_0_8px_rgba(251,146,60,0.8)]" />;
      case 'nebula_weaver':
        return <Globe className="w-full h-full text-pink-400 animate-spin-slow drop-shadow-[0_0_10px_rgba(236,72,153,0.8)]" />;
      case 'archangel_radiance':
        return (
          <div className="relative flex items-center justify-center">
            <Crown className="w-full h-full text-amber-300 animate-pulse drop-shadow-[0_0_12px_rgba(251,191,36,0.9)]" />
          </div>
        );
      case 'infinity_eye':
        return <Eye className="w-full h-full text-pink-400 animate-pulse" />;
      case 'supernova_fragment':
        return <Sparkles className="w-full h-full text-cyan-300 animate-spin-slow" />;
      case 'napoleon':
        return <Crown className="w-full h-full text-red-500 fill-red-500/30 drop-shadow-[0_0_12px_rgba(239,68,68,0.9)]" />;
      default:
        return null;
    }
  };

  const customSvg = renderIconSvg();

  return (
    <span
      className={`inline-flex items-center justify-center select-none ${sizeCls} ${className}`}
      style={showGlow ? { filter: `drop-shadow(0 0 8px ${color}80)` } : undefined}
    >
      {customSvg ? (
        <div className="w-full h-full flex items-center justify-center">
          {customSvg}
        </div>
      ) : (
        <span className="leading-none drop-shadow-md">
          {item.emoji || '✨'}
        </span>
      )}
    </span>
  );
};
