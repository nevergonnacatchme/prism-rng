import React, { useState, useEffect, useRef, useCallback } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  Sparkles, ArrowRight, X, Music, Check, EyeOff, Zap, Shield, 
  Crown, Flame, Star, Compass, Disc, Feather, Eye, Globe, Terminal
} from 'lucide-react';
import { RNGItem } from '../types/rng';
import { RARITY_CONFIGS, formatChance, formatPercent } from '../data/items';
import { sound } from '../utils/audio';
import { AuraIcon } from './AuraIcon';

interface CutsceneOverlayProps {
  item: RNGItem | null;
  onComplete: () => void;
  autoSkipCutscenes?: boolean;
  onToggleAutoSkipCutscenes?: () => void;
}

type CutscenePhase = 'singularity' | 'anime_slash' | 'lore' | 'supernova' | 'reveal';

export const CutsceneOverlay: React.FC<CutsceneOverlayProps> = ({
  item,
  onComplete,
  autoSkipCutscenes = false,
  onToggleAutoSkipCutscenes,
}) => {
  const [phase, setPhase] = useState<CutscenePhase>('singularity');
  const [shake, setShake] = useState(false);
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  // Background particle engine tailored specifically to item rarity
  useEffect(() => {
    if (!canvasRef.current || !item) return;
    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let animId: number;
    let width = (canvas.width = window.innerWidth);
    let height = (canvas.height = window.innerHeight);

    const handleResize = () => {
      width = canvas.width = window.innerWidth;
      height = canvas.height = window.innerHeight;
    };
    window.addEventListener('resize', handleResize);

    const color = item.accentColor || RARITY_CONFIGS[item.rarity]?.color || '#38BDF8';
    const isMythic = item.rarity === 'Mythic';
    const isCelestial = item.rarity === 'Celestial';
    const isTranscendent = item.rarity === 'Transcendent';
    const isImpossible = item.rarity === 'Impossible';

    let tick = 0;

    // MYTHIC: Matrix Glitch & Cyber Grid Particles
    const glitchBoxes: Array<{ x: number; y: number; w: number; h: number; opacity: number; color: string }> = [];
    
    // CELESTIAL: Shooting Meteors & Star Constellations
    const meteors: Array<{ x: number; y: number; vx: number; vy: number; len: number; alpha: number }> = [];

    // TRANSCENDENT: Multiverse Prism Particles & Floating Rings
    const prismRays: Array<{ angle: number; speed: number; color: string; width: number }> = [];
    const colors = ['#EF4444', '#F59E0B', '#10B981', '#06B6D4', '#6366F1', '#EC4899'];
    for (let i = 0; i < 12; i++) {
      prismRays.push({
        angle: (Math.PI * 2 * i) / 12,
        speed: 0.008 * (i % 2 === 0 ? 1 : -1),
        color: colors[i % colors.length],
        width: Math.random() * 30 + 15,
      });
    }

    // IMPOSSIBLE / ANGELIC: Golden Feather Light Motes
    const holyMotes: Array<{ x: number; y: number; vy: number; size: number; alpha: number }> = [];
    for (let i = 0; i < 70; i++) {
      holyMotes.push({
        x: Math.random() * width,
        y: Math.random() * height,
        vy: -(Math.random() * 1.5 + 0.5),
        size: Math.random() * 4 + 2,
        alpha: Math.random() * 0.8 + 0.2,
      });
    }

    const render = () => {
      tick++;
      ctx.clearRect(0, 0, width, height);
      const cx = width / 2;
      const cy = height / 2;

      if (isMythic) {
        // --- MYTHIC: CYBER MATRIX GLITCH THEME ---
        // Draw Scanlines
        ctx.fillStyle = 'rgba(0, 0, 0, 0.3)';
        ctx.fillRect(0, 0, width, height);

        ctx.strokeStyle = `${color}15`;
        ctx.lineWidth = 1;
        for (let y = 0; y < height; y += 4) {
          ctx.beginPath();
          ctx.moveTo(0, y);
          ctx.lineTo(width, y);
          ctx.stroke();
        }

        // Random Glitch Blocks
        if (Math.random() < 0.3) {
          glitchBoxes.push({
            x: Math.random() * width,
            y: Math.random() * height,
            w: Math.random() * 120 + 20,
            h: Math.random() * 15 + 4,
            opacity: Math.random() * 0.6 + 0.2,
            color: Math.random() > 0.5 ? '#10B981' : '#EC4899',
          });
        }

        for (let i = glitchBoxes.length - 1; i >= 0; i--) {
          const b = glitchBoxes[i];
          b.opacity -= 0.05;
          if (b.opacity <= 0) {
            glitchBoxes.splice(i, 1);
            continue;
          }
          ctx.fillStyle = b.color;
          ctx.globalAlpha = b.opacity;
          ctx.fillRect(b.x, b.y, b.w, b.h);
          ctx.globalAlpha = 1;
        }

        // Central Cyber Pulse Ring
        ctx.save();
        ctx.translate(cx, cy);
        ctx.rotate((tick * 0.02) % (Math.PI * 2));
        ctx.strokeStyle = color;
        ctx.lineWidth = 3;
        ctx.setLineDash([15, 10]);
        ctx.beginPath();
        ctx.arc(0, 0, 180 + Math.sin(tick * 0.1) * 20, 0, Math.PI * 2);
        ctx.stroke();
        ctx.restore();

      } else if (isCelestial) {
        // --- CELESTIAL: ASTRAL SUPERNOVA THEME ---
        // Starry Background
        const radial = ctx.createRadialGradient(cx, cy, 20, cx, cy, Math.max(width, height) * 0.65);
        radial.addColorStop(0, `${color}40`);
        radial.addColorStop(0.5, `${color}10`);
        radial.addColorStop(1, 'transparent');
        ctx.fillStyle = radial;
        ctx.fillRect(0, 0, width, height);

        // Spawn Meteors
        if (Math.random() < 0.2) {
          meteors.push({
            x: Math.random() * width * 1.5 - width * 0.25,
            y: -50,
            vx: -Math.random() * 6 - 4,
            vy: Math.random() * 10 + 8,
            len: Math.random() * 80 + 40,
            alpha: 1,
          });
        }

        for (let i = meteors.length - 1; i >= 0; i--) {
          const m = meteors[i];
          m.x += m.vx;
          m.y += m.vy;
          m.alpha -= 0.015;
          if (m.alpha <= 0 || m.y > height + 100) {
            meteors.splice(i, 1);
            continue;
          }

          ctx.save();
          ctx.beginPath();
          ctx.moveTo(m.x, m.y);
          ctx.lineTo(m.x - m.vx * 4, m.y - m.vy * 4);
          ctx.strokeStyle = color;
          ctx.lineWidth = 2.5;
          ctx.globalAlpha = m.alpha;
          ctx.shadowBlur = 15;
          ctx.shadowColor = color;
          ctx.stroke();
          ctx.restore();
        }

        // Concentric Astral Rings
        ctx.save();
        ctx.translate(cx, cy);
        for (let r = 1; r <= 3; r++) {
          ctx.rotate(((r % 2 === 0 ? 1 : -1) * tick * 0.008) % (Math.PI * 2));
          ctx.beginPath();
          ctx.arc(0, 0, r * 90, 0, Math.PI * 2);
          ctx.strokeStyle = `${color}40`;
          ctx.lineWidth = 1.5;
          ctx.setLineDash([20, 20]);
          ctx.stroke();
        }
        ctx.restore();

      } else if (isTranscendent) {
        // --- TRANSCENDENT: MULTIVERSE PRISM REALITY TEAR ---
        // Rotating Iridescent Rays
        ctx.save();
        ctx.translate(cx, cy);
        prismRays.forEach((ray) => {
          ray.angle += ray.speed;
          ctx.rotate(ray.angle);
          ctx.beginPath();
          ctx.moveTo(0, 0);
          ctx.lineTo(-ray.width, Math.max(width, height));
          ctx.lineTo(ray.width, Math.max(width, height));
          ctx.closePath();
          ctx.fillStyle = `${ray.color}15`;
          ctx.fill();
        });
        ctx.restore();

        // Vertical Dimensional Tear Beam
        ctx.save();
        ctx.beginPath();
        ctx.moveTo(cx - 3, 0);
        ctx.lineTo(cx - 3, height);
        ctx.lineTo(cx + 3, height);
        ctx.lineTo(cx + 3, 0);
        ctx.closePath();
        ctx.fillStyle = '#FFFFFF';
        ctx.shadowBlur = 30;
        ctx.shadowColor = '#F472B6';
        ctx.fill();
        ctx.restore();

      } else {
        // --- IMPOSSIBLE / SERAPHIM: HEAVENLY GOLDEN ANGELIC THEME ---
        // Floating Golden Motes
        holyMotes.forEach((m) => {
          m.y += m.vy;
          if (m.y < -20) {
            m.y = height + 20;
            m.x = Math.random() * width;
          }

          ctx.save();
          ctx.beginPath();
          ctx.arc(m.x, m.y, m.size, 0, Math.PI * 2);
          ctx.fillStyle = '#FBBF24';
          ctx.globalAlpha = m.alpha;
          ctx.shadowBlur = 12;
          ctx.shadowColor = '#F59E0B';
          ctx.fill();
          ctx.restore();
        });

        // Divine Pillar of Light
        const lightGrad = ctx.createLinearGradient(cx - 150, 0, cx + 150, 0);
        lightGrad.addColorStop(0, 'transparent');
        lightGrad.addColorStop(0.5, 'rgba(251, 191, 36, 0.25)');
        lightGrad.addColorStop(1, 'transparent');
        ctx.fillStyle = lightGrad;
        ctx.fillRect(cx - 200, 0, 400, height);
      }

      animId = requestAnimationFrame(render);
    };

    render();

    return () => {
      cancelAnimationFrame(animId);
      window.removeEventListener('resize', handleResize);
    };
  }, [item]);

  // Phase Timing Sequence
  useEffect(() => {
    if (!item) return;

    const isNapoleon = item.id === 'napoleon';
    const isImpossible = item.rarity === 'Impossible';
    const isTranscendent = item.rarity === 'Transcendent';
    const isCelestial = item.rarity === 'Celestial';
    const isMythic = item.rarity === 'Mythic';

    if (isNapoleon) {
      sound.playAmourPlastique();
      setPhase('singularity');

      const t1 = setTimeout(() => {
        sound.playAnimeSlashCut();
        setShake(true);
        setPhase('anime_slash');
        setTimeout(() => setShake(false), 300);
      }, 700);

      const t2 = setTimeout(() => setPhase('lore'), 1500);

      const t3 = setTimeout(() => {
        sound.playSupernovaBlast();
        setShake(true);
        setPhase('supernova');
        setTimeout(() => setShake(false), 400);
      }, 3400);

      const t4 = setTimeout(() => {
        sound.playDrop('Impossible');
        setPhase('reveal');
      }, 4200);

      return () => {
        clearTimeout(t1);
        clearTimeout(t2);
        clearTimeout(t3);
        clearTimeout(t4);
        sound.stopMusic();
      };
    } else if (isImpossible) {
      sound.playCutsceneDarkness();
      setPhase('singularity');

      const t1 = setTimeout(() => {
        sound.playAnimeSlashCut();
        setShake(true);
        setPhase('anime_slash');
        setTimeout(() => setShake(false), 300);
      }, 600);

      const t2 = setTimeout(() => setPhase('lore'), 1300);

      const t3 = setTimeout(() => {
        sound.playDivineTrumpets();
        sound.playSupernovaBlast();
        setShake(true);
        setPhase('supernova');
        setTimeout(() => setShake(false), 500);
      }, 2900);

      const t4 = setTimeout(() => {
        sound.playDrop('Impossible');
        setPhase('reveal');
      }, 3800);

      return () => {
        clearTimeout(t1);
        clearTimeout(t2);
        clearTimeout(t3);
        clearTimeout(t4);
      };
    } else if (isTranscendent) {
      sound.playCutsceneDarkness();
      setPhase('singularity');

      const t1 = setTimeout(() => {
        sound.playAnimeSlashCut();
        setShake(true);
        setPhase('anime_slash');
        setTimeout(() => setShake(false), 300);
      }, 500);

      const t2 = setTimeout(() => setPhase('lore'), 1100);

      const t3 = setTimeout(() => {
        sound.playWhiteoutFlash();
        setShake(true);
        setPhase('supernova');
        setTimeout(() => setShake(false), 400);
      }, 2500);

      const t4 = setTimeout(() => {
        sound.playDrop('Transcendent');
        setPhase('reveal');
      }, 3300);

      return () => {
        clearTimeout(t1);
        clearTimeout(t2);
        clearTimeout(t3);
        clearTimeout(t4);
      };
    } else if (isCelestial) {
      sound.playCutsceneDarkness();
      setPhase('singularity');

      const t1 = setTimeout(() => {
        sound.playAnimeSlashCut();
        setShake(true);
        setPhase('anime_slash');
        setTimeout(() => setShake(false), 250);
      }, 400);

      const t2 = setTimeout(() => setPhase('lore'), 900);

      const t3 = setTimeout(() => {
        sound.playSupernovaBlast();
        setPhase('supernova');
      }, 2000);

      const t4 = setTimeout(() => {
        sound.playDrop('Celestial');
        setPhase('reveal');
      }, 2700);

      return () => {
        clearTimeout(t1);
        clearTimeout(t2);
        clearTimeout(t3);
        clearTimeout(t4);
      };
    } else if (isMythic) {
      sound.playTemporalFreeze();
      setPhase('singularity');

      const t1 = setTimeout(() => {
        sound.playAnimeSlashCut();
        setShake(true);
        setPhase('anime_slash');
        setTimeout(() => setShake(false), 200);
      }, 350);

      const t2 = setTimeout(() => setPhase('lore'), 750);

      const t3 = setTimeout(() => {
        sound.playWhiteoutFlash();
        setPhase('supernova');
      }, 1700);

      const t4 = setTimeout(() => {
        sound.playDrop('Mythic');
        setPhase('reveal');
      }, 2300);

      return () => {
        clearTimeout(t1);
        clearTimeout(t2);
        clearTimeout(t3);
        clearTimeout(t4);
      };
    } else {
      setPhase('supernova');
      sound.playDrop(item.rarity);
      const t1 = setTimeout(() => setPhase('reveal'), 500);
      return () => clearTimeout(t1);
    }
  }, [item]);

  const handleFinish = useCallback(() => {
    sound.stopMusic();
    onComplete();
  }, [onComplete]);

  // Keyboard listener
  useEffect(() => {
    const handleKey = (e: KeyboardEvent) => {
      if (e.key === ' ' || e.key === 'Escape' || e.key === 'Enter') {
        e.preventDefault();
        handleFinish();
      }
    };
    window.addEventListener('keydown', handleKey);
    return () => window.removeEventListener('keydown', handleKey);
  }, [handleFinish]);

  if (!item) return null;

  const rarityConfig = RARITY_CONFIGS[item.rarity] || RARITY_CONFIGS['Common'];
  const isNapoleon = item.id === 'napoleon';
  const color = item.accentColor || rarityConfig.color;

  return (
    <div
      onClick={() => {
        if (isNapoleon && !sound.isMusicPlaying()) {
          sound.playAmourPlastique();
        }
      }}
      className={`fixed inset-0 z-50 overflow-hidden flex items-center justify-center select-none bg-slate-950 ${
        shake ? 'animate-shake' : ''
      }`}
    >
      {/* Background Custom Canvas per Rarity */}
      <canvas ref={canvasRef} className="absolute inset-0 pointer-events-none z-10" />

      {/* Top Left: Napoleon Music Play Button */}
      {isNapoleon && (
        <button
          onClick={(e) => {
            e.stopPropagation();
            sound.playAmourPlastique();
          }}
          className="absolute top-5 left-5 z-50 py-2 px-4 rounded-xl bg-red-950/90 hover:bg-red-900 border border-red-500/60 text-red-100 text-xs font-mono font-bold flex items-center gap-2 cursor-pointer shadow-[0_0_20px_rgba(239,68,68,0.5)] transition-all"
        >
          <Music className="w-4 h-4 text-red-400 animate-pulse" />
          <span>♫ Amour Plastique</span>
        </button>
      )}

      {/* Top Right Controls: Auto-Skip & Skip Buttons */}
      <div className="absolute top-5 right-5 z-50 flex items-center gap-2.5">
        {onToggleAutoSkipCutscenes && (
          <button
            onClick={(e) => {
              e.stopPropagation();
              onToggleAutoSkipCutscenes();
            }}
            className={`py-2 px-3.5 rounded-xl font-mono text-xs border transition-all cursor-pointer flex items-center gap-2 shadow-lg ${
              autoSkipCutscenes
                ? 'bg-amber-400 text-slate-950 font-black border-amber-300 shadow-[0_0_20px_rgba(245,158,11,0.5)]'
                : 'bg-black/80 hover:bg-black/95 text-slate-300 border-slate-700'
            }`}
          >
            <EyeOff className="w-4 h-4" />
            <span>Auto-Skip: <strong>{autoSkipCutscenes ? 'ON' : 'OFF'}</strong></span>
          </button>
        )}

        <button
          onClick={handleFinish}
          className="py-2 px-4 rounded-xl bg-black/80 hover:bg-black/95 text-white/90 hover:text-white border border-white/30 text-xs font-mono font-bold tracking-wider transition-all cursor-pointer flex items-center gap-2 shadow-lg hover:border-cyan-400"
        >
          <span>SKIP [SPACE]</span>
          <X className="w-4 h-4" />
        </button>
      </div>

      {/* PHASE 1: Singularity Pulse & Spacetime Bend */}
      {phase === 'singularity' && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.3 }}
          className="absolute inset-0 bg-black flex flex-col items-center justify-center p-6 text-center z-20"
        >
          <div className="relative flex items-center justify-center">
            <motion.div
              animate={{ 
                scale: [0.8, 1.8, 1.1, 2.5], 
                opacity: [0.2, 0.9, 0.4, 1.0],
                rotate: [0, 90, 180, 360]
              }}
              transition={{ repeat: Infinity, duration: 1.1 }}
              className="w-32 h-32 rounded-full blur-2xl"
              style={{ backgroundColor: color }}
            />
            <div className="w-16 h-16 rounded-full bg-white shadow-[0_0_50px_#ffffff] animate-ping" />
          </div>
          <p className="font-mono text-xs text-slate-400 uppercase tracking-[0.4em] mt-8 animate-pulse">
            {item.rarity === 'Mythic' ? 'CYBER SYSTEM BREAK...' : 'SPACETIME RUPTURE...'}
          </p>
        </motion.div>
      )}

      {/* PHASE 2: Dimensional Slash Cut */}
      {phase === 'anime_slash' && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="absolute inset-0 bg-black flex items-center justify-center z-30 pointer-events-none"
        >
          <motion.div
            initial={{ scaleX: 0, opacity: 0 }}
            animate={{ scaleX: 1, opacity: [0, 1, 1, 0] }}
            transition={{ duration: 0.35, ease: 'easeOut' }}
            className="absolute w-[160%] h-4 sm:h-6 bg-white shadow-[0_0_40px_#ffffff,0_0_80px_currentColor] -rotate-45"
            style={{ color }}
          />
        </motion.div>
      )}

      {/* PHASE 3: Dramatic Lore Typography (Unique styling per Rarity) */}
      {phase === 'lore' && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.35 }}
          className="absolute inset-0 bg-black/95 flex flex-col items-center justify-center p-8 text-center z-20"
        >
          {isNapoleon ? (
            <div className="flex flex-col items-center">
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.1, duration: 0.6 }}
                className="px-4 py-1.5 rounded-full bg-red-950/90 border border-red-500/60 text-[11px] uppercase tracking-[0.35em] font-mono text-red-300 mb-6 flex items-center gap-2 shadow-[0_0_20px_rgba(239,68,68,0.5)]"
              >
                <Crown className="w-4 h-4 text-red-400 animate-pulse" />
                <span>IMPOSSIBLE AURA · 1 IN 10,000,000</span>
              </motion.div>

              <motion.h1
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 0.4, duration: 0.8 }}
                className="text-4xl sm:text-6xl md:text-7xl font-extrabold text-white tracking-tight leading-tight max-w-3xl font-serif drop-shadow-[0_0_35px_rgba(239,68,68,0.8)]"
              >
                "There is nothing we can do."
              </motion.h1>

              <motion.p
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.9, duration: 0.7 }}
                className="text-sm sm:text-base text-slate-300 font-mono tracking-wider mt-6 max-w-lg italic"
              >
                "Dans mon esprit tout divague, je me perds dans tes yeux..."
              </motion.p>
            </div>
          ) : item.rarity === 'Mythic' ? (
            /* MYTHIC: CYBER MATRIX DATA STREAM DESIGN */
            <div className="flex flex-col items-center">
              <motion.div
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                className="px-4 py-1.5 rounded-lg bg-emerald-950/80 border border-emerald-500/60 text-emerald-400 font-mono text-xs tracking-widest uppercase mb-4 flex items-center gap-2"
              >
                <Terminal className="w-4 h-4 animate-pulse" />
                <span>FATAL EXCEPTION 0x000000 · MYTHIC DROP</span>
              </motion.div>

              <motion.h1
                initial={{ opacity: 0, y: 15 }}
                animate={{ opacity: 1, y: 0 }}
                className="text-3xl sm:text-5xl md:text-6xl font-black font-mono text-white tracking-tight mb-3 drop-shadow-[0_0_30px_#10b981]"
              >
                {item.name}
              </motion.h1>

              <p className="text-xs sm:text-sm font-mono text-emerald-300/80 max-w-md italic">
                {item.flavorText || item.description}
              </p>
            </div>
          ) : item.rarity === 'Celestial' ? (
            /* CELESTIAL: ASTRAL ZODIAC HERALDRY DESIGN */
            <div className="flex flex-col items-center">
              <motion.div
                initial={{ opacity: 0, y: -15 }}
                animate={{ opacity: 1, y: 0 }}
                className="px-5 py-1.5 rounded-full bg-cyan-950/80 border border-cyan-400/60 text-cyan-300 font-mono text-xs tracking-[0.3em] font-black uppercase mb-4 flex items-center gap-2"
              >
                <Sparkles className="w-4 h-4 animate-spin-slow" />
                <span>CELESTIAL AWAKENING · 1 IN {item.baseChance.toLocaleString()}</span>
              </motion.div>

              <motion.h1
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                className="text-4xl sm:text-6xl font-serif font-black text-white tracking-tight mb-3"
                style={{ textShadow: `0 0 35px ${color}` }}
              >
                {item.flavorText || `"${item.name}"`}
              </motion.h1>

              <p className="text-xs sm:text-sm font-mono text-cyan-200/80 max-w-lg">
                {item.description}
              </p>
            </div>
          ) : (
            /* TRANSCENDENT & IMPOSSIBLE: MULTIVERSE GOD-RAYS DESIGN */
            <div className="flex flex-col items-center">
              <motion.div
                initial={{ opacity: 0, y: 15 }}
                animate={{ opacity: 1, y: 0 }}
                className="px-6 py-2 rounded-full text-xs uppercase tracking-[0.35em] font-mono font-black mb-5 shadow-2xl border flex items-center gap-2"
                style={{
                  backgroundColor: `${color}25`,
                  borderColor: `${color}60`,
                  color: color,
                  boxShadow: `0 0 30px ${color}50`,
                }}
              >
                ★ {item.rarity.toUpperCase()} DIVINE MANIFESTATION ★
              </motion.div>

              <motion.h1
                initial={{ opacity: 0, scale: 0.92 }}
                animate={{ opacity: 1, scale: 1 }}
                className="text-4xl sm:text-6xl md:text-7xl font-black text-white tracking-tight leading-tight max-w-3xl font-serif"
                style={{ textShadow: `0 0 45px ${color}` }}
              >
                {item.flavorText || `"${item.name}"`}
              </motion.h1>

              <motion.p
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="text-xs sm:text-sm text-slate-300 font-mono tracking-wider mt-5 max-w-xl"
              >
                {item.description}
              </motion.p>
            </div>
          )}
        </motion.div>
      )}

      {/* PHASE 4: Supernova Flash */}
      {phase === 'supernova' && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: [0, 1, 0.8, 0] }}
          transition={{ duration: 0.5, ease: 'easeOut' }}
          className="absolute inset-0 bg-white flex items-center justify-center z-40"
        >
          <div
            className="w-[600px] h-[600px] rounded-full blur-3xl animate-ping"
            style={{ backgroundColor: color }}
          />
        </motion.div>
      )}

      {/* PHASE 5: FULL REVEAL */}
      {phase === 'reveal' && (
        <motion.div
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.6, type: 'spring', damping: 20 }}
          className="relative z-30 flex flex-col items-center justify-center p-6 text-center max-w-3xl w-full"
        >
          <div
            className="absolute w-[550px] h-[550px] rounded-full blur-3xl opacity-40 -z-10 animate-pulse"
            style={{ backgroundColor: color }}
          />

          <motion.div
            initial={{ y: -20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.15 }}
            className="px-5 py-2 rounded-full text-xs font-mono font-black tracking-widest uppercase mb-5 shadow-2xl border flex items-center gap-2"
            style={{
              backgroundColor: rarityConfig.bgColor,
              color: rarityConfig.color,
              borderColor: rarityConfig.borderColor,
              boxShadow: `0 0 35px ${color}60`,
            }}
          >
            <Sparkles className="w-4 h-4 animate-spin-slow" />
            <span>★ {item.rarity.toUpperCase()} AURA UNLOCKED ★</span>
            <Sparkles className="w-4 h-4 animate-spin-slow" />
          </motion.div>

          <motion.div
            initial={{ scale: 0.4, rotate: -15 }}
            animate={{ scale: 1, rotate: 0 }}
            transition={{ delay: 0.25, type: 'spring', damping: 14 }}
            className="relative mb-6"
          >
            {isNapoleon && item.imageUrl ? (
              <div className="relative group">
                <div className="w-64 h-64 sm:w-80 sm:h-80 rounded-3xl overflow-hidden border-4 border-red-500 shadow-[0_0_70px_rgba(239,68,68,0.8)] relative bg-black">
                  <img src={item.imageUrl} alt="Napoleon" className="w-full h-full object-cover" />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent flex items-end p-4">
                    <p className="text-white text-xs font-mono font-bold tracking-wider uppercase">
                      Le Général Suprême · 1 in 10,000,000
                    </p>
                  </div>
                </div>
              </div>
            ) : (
              <div className="relative flex items-center justify-center">
                <div 
                  className="absolute w-52 h-52 sm:w-64 sm:h-64 rounded-full border border-dashed animate-spin-slow opacity-60"
                  style={{ borderColor: color }}
                />
                <div 
                  className="w-44 h-44 sm:w-56 sm:h-56 rounded-3xl flex items-center justify-center border-4 shadow-2xl backdrop-blur-xl relative overflow-hidden"
                  style={{
                    backgroundColor: `${color}18`,
                    borderColor: `${color}80`,
                    boxShadow: `0 0 60px ${color}70`,
                  }}
                >
                  <AuraIcon item={item} size="hero" showGlow className="animate-bounce" />
                </div>
              </div>
            )}
          </motion.div>

          <motion.h1
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.35 }}
            className="text-3xl sm:text-5xl md:text-6xl font-black text-white tracking-tight mb-2 drop-shadow-2xl font-mono"
            style={{ textShadow: `0 0 30px ${color}90` }}
          >
            {item.name}
          </motion.h1>

          <motion.div
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.5 }}
            className="flex flex-wrap items-center justify-center gap-2.5 sm:gap-4 font-mono text-xs sm:text-sm text-slate-300 mb-6 bg-slate-950/80 px-5 py-2.5 rounded-2xl border border-slate-800 shadow-xl backdrop-blur-md"
          >
            <div className="flex items-center gap-1.5">
              <span className="text-slate-500">CHANCE:</span>
              <strong className="text-white">1 in {item.baseChance.toLocaleString()}</strong>
            </div>
            <span className="text-slate-700">|</span>
            <div className="flex items-center gap-1.5">
              <span className="text-slate-500">ODDS:</span>
              <strong className="text-emerald-400">{formatPercent(item.baseChance)}</strong>
            </div>
            <span className="text-slate-700">|</span>
            <div className="flex items-center gap-1.5">
              <span className="text-slate-500">BONUS:</span>
              <strong className="text-amber-300">+{item.luckBonus}% Luck</strong>
            </div>
          </motion.div>

          <motion.button
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.6 }}
            onClick={handleFinish}
            className="py-4 px-10 rounded-2xl bg-gradient-to-r from-cyan-400 via-amber-300 to-pink-500 hover:opacity-95 text-slate-950 font-mono font-black text-sm tracking-wider uppercase transition-all shadow-[0_0_30px_rgba(56,189,248,0.5)] cursor-pointer flex items-center gap-2.5"
          >
            <span>CLAIM & RETURN [SPACE]</span>
            <ArrowRight className="w-4 h-4" />
          </motion.button>
        </motion.div>
      )}
    </div>
  );
};
