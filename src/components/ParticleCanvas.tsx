import React, { useEffect, useRef } from 'react';
import { RarityTier, Biome } from '../types/rng';
import { RARITY_CONFIGS } from '../data/items';

interface Particle {
  x: number;
  y: number;
  vx: number;
  vy: number;
  size: number;
  color: string;
  alpha: number;
  maxAlpha: number;
  life: number;
  maxLife: number;
  angle?: number;
  spin?: number;
}

interface Meteor {
  x: number;
  y: number;
  length: number;
  speed: number;
  alpha: number;
  angle: number;
}

interface ParticleCanvasProps {
  burstTrigger?: { rarity: RarityTier; id: number } | null;
  activeRarity?: RarityTier;
  activeBiome?: Biome | null;
}

export const ParticleCanvas: React.FC<ParticleCanvasProps> = ({
  burstTrigger,
  activeBiome,
}) => {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

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

    const particles: Particle[] = [];
    const meteors: Meteor[] = [];
    let lightningFlashAlpha = 0;

    const biomeId = activeBiome?.id || 'clear_horizon';

    // Populate ambient particles based on Biome theme
    const initBiomeParticles = () => {
      particles.length = 0;
      meteors.length = 0;

      let particleCount = 70;
      if (biomeId === 'deep_space' || biomeId === 'celestial_sanctuary') {
        particleCount = 120;
      } else if (biomeId === 'glacial_tundra') {
        particleCount = 90;
      }

      for (let i = 0; i < particleCount; i++) {
        particles.push(createParticleForBiome(biomeId, width, height, true));
      }
    };

    initBiomeParticles();

    let tick = 0;

    const render = () => {
      tick++;
      ctx.clearRect(0, 0, width, height);

      // --- 1. Draw Biome Background Glow & Vignettes ---
      if (biomeId === 'glacial_tundra') {
        // Cold Frosty Blue Vignette
        const grad = ctx.createRadialGradient(width / 2, height / 2, width * 0.2, width / 2, height / 2, width * 0.7);
        grad.addColorStop(0, 'rgba(14, 165, 233, 0.03)');
        grad.addColorStop(1, 'rgba(6, 182, 212, 0.15)');
        ctx.fillStyle = grad;
        ctx.fillRect(0, 0, width, height);
      } else if (biomeId === 'scorched_cavern') {
        // Fiery Heat Glow at bottom
        const grad = ctx.createLinearGradient(0, height, 0, height - 300);
        grad.addColorStop(0, 'rgba(239, 68, 68, 0.25)');
        grad.addColorStop(1, 'transparent');
        ctx.fillStyle = grad;
        ctx.fillRect(0, 0, width, height);
      } else if (biomeId === 'deep_space') {
        // Deep Space Nebulae Glow
        const grad = ctx.createRadialGradient(width * 0.3, height * 0.4, 50, width * 0.5, height * 0.5, width * 0.8);
        grad.addColorStop(0, 'rgba(147, 51, 234, 0.12)');
        grad.addColorStop(0.5, 'rgba(236, 72, 153, 0.08)');
        grad.addColorStop(1, 'transparent');
        ctx.fillStyle = grad;
        ctx.fillRect(0, 0, width, height);
      } else if (biomeId === 'celestial_sanctuary') {
        // Holy Golden Radial Glow
        const grad = ctx.createRadialGradient(width / 2, height / 2, 20, width / 2, height / 2, width * 0.6);
        grad.addColorStop(0, 'rgba(245, 158, 11, 0.12)');
        grad.addColorStop(1, 'transparent');
        ctx.fillStyle = grad;
        ctx.fillRect(0, 0, width, height);
      }

      // --- 2. Electrified Tempest Lightning Flashes ---
      if (biomeId === 'electrified_tempest') {
        if (Math.random() < 0.015) {
          lightningFlashAlpha = 0.4;
        }
        if (lightningFlashAlpha > 0) {
          ctx.fillStyle = `rgba(255, 255, 255, ${lightningFlashAlpha})`;
          ctx.fillRect(0, 0, width, height);
          lightningFlashAlpha -= 0.04;
        }
      }

      // --- 3. Deep Space Shooting Meteors ---
      if (biomeId === 'deep_space' || biomeId === 'celestial_sanctuary') {
        if (Math.random() < 0.02) {
          meteors.push({
            x: Math.random() * width * 1.3 - width * 0.15,
            y: -20,
            length: Math.random() * 90 + 40,
            speed: Math.random() * 12 + 10,
            alpha: 1,
            angle: Math.PI / 4,
          });
        }

        for (let i = meteors.length - 1; i >= 0; i--) {
          const m = meteors[i];
          m.x += Math.cos(m.angle) * m.speed;
          m.y += Math.sin(m.angle) * m.speed;
          m.alpha -= 0.018;

          if (m.alpha <= 0 || m.y > height + 100) {
            meteors.splice(i, 1);
            continue;
          }

          ctx.save();
          ctx.beginPath();
          ctx.moveTo(m.x, m.y);
          ctx.lineTo(m.x - Math.cos(m.angle) * m.length, m.y - Math.sin(m.angle) * m.length);
          ctx.strokeStyle = biomeId === 'celestial_sanctuary' ? '#FBBF24' : '#38BDF8';
          ctx.lineWidth = 2;
          ctx.globalAlpha = m.alpha;
          ctx.shadowBlur = 10;
          ctx.shadowColor = ctx.strokeStyle;
          ctx.stroke();
          ctx.restore();
        }
      }

      // --- 4. Render Weather Particles ---
      for (let i = 0; i < particles.length; i++) {
        const p = particles[i];
        p.x += p.vx;
        p.y += p.vy;
        p.life++;

        if (biomeId === 'breezy_highlands' || biomeId === 'glacial_tundra') {
          p.x += Math.sin(tick * 0.03 + i) * 0.8; // Sway effect
        }

        // Fade in / out
        if (p.life < p.maxLife * 0.2) {
          p.alpha = (p.life / (p.maxLife * 0.2)) * p.maxAlpha;
        } else if (p.life > p.maxLife * 0.8) {
          p.alpha = ((p.maxLife - p.life) / (p.maxLife * 0.2)) * p.maxAlpha;
        } else {
          p.alpha = p.maxAlpha;
        }

        // Respawn if dead or out of bounds
        if (
          p.life >= p.maxLife ||
          p.y < -30 ||
          p.y > height + 30 ||
          p.x < -30 ||
          p.x > width + 30
        ) {
          particles[i] = createParticleForBiome(biomeId, width, height, false);
          continue;
        }

        ctx.save();
        ctx.globalAlpha = Math.max(0, p.alpha);

        if (biomeId === 'glacial_tundra') {
          // Draw 6-arm Snowflake
          ctx.strokeStyle = '#E0F2FE';
          ctx.lineWidth = 1.2;
          ctx.save();
          ctx.translate(p.x, p.y);
          ctx.rotate((p.angle || 0) + tick * 0.01);
          for (let arm = 0; arm < 6; arm++) {
            ctx.rotate((Math.PI * 2) / 6);
            ctx.beginPath();
            ctx.moveTo(0, 0);
            ctx.lineTo(0, p.size * 2);
            ctx.stroke();
          }
          ctx.restore();
        } else {
          // Standard Glowing Circle / Ember / Star Mote
          ctx.beginPath();
          ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
          ctx.fillStyle = p.color;
          ctx.shadowBlur = p.size > 2.5 ? 10 : 0;
          ctx.shadowColor = p.color;
          ctx.fill();
        }

        ctx.restore();
      }

      animId = requestAnimationFrame(render);
    };

    render();

    return () => {
      cancelAnimationFrame(animId);
      window.removeEventListener('resize', handleResize);
    };
  }, [activeBiome]);

  // Burst trigger listener for rare rolls
  useEffect(() => {
    if (!burstTrigger || !canvasRef.current) return;
    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const config = RARITY_CONFIGS[burstTrigger.rarity];
    if (!config) return;

    const cx = window.innerWidth / 2;
    const cy = window.innerHeight / 2;

    for (let i = 0; i < 50; i++) {
      const angle = Math.random() * Math.PI * 2;
      const speed = Math.random() * 8 + 3;
      const p: Particle = {
        x: cx,
        y: cy,
        vx: Math.cos(angle) * speed,
        vy: Math.sin(angle) * speed,
        size: Math.random() * 4 + 2,
        color: config.color,
        alpha: 1,
        maxAlpha: 1,
        life: 0,
        maxLife: Math.random() * 40 + 20,
      };

      const drawBurst = () => {
        p.x += p.vx;
        p.y += p.vy;
        p.alpha -= 0.025;
        if (p.alpha > 0) {
          ctx.save();
          ctx.beginPath();
          ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
          ctx.fillStyle = p.color;
          ctx.globalAlpha = p.alpha;
          ctx.shadowBlur = 12;
          ctx.shadowColor = p.color;
          ctx.fill();
          ctx.restore();
          requestAnimationFrame(drawBurst);
        }
      };
      drawBurst();
    }
  }, [burstTrigger]);

  return (
    <canvas
      ref={canvasRef}
      className="fixed inset-0 pointer-events-none z-0"
      style={{ opacity: 0.85 }}
    />
  );
};

// Helper: Factory for Biome Specific Weather Particles
function createParticleForBiome(
  biomeId: string,
  width: number,
  height: number,
  initialSpawn = false
): Particle {
  const spawnY = initialSpawn ? Math.random() * height : -20;

  switch (biomeId) {
    case 'glacial_tundra':
      return {
        x: Math.random() * width,
        y: initialSpawn ? Math.random() * height : -10,
        vx: (Math.random() - 0.5) * 1.2,
        vy: Math.random() * 2.5 + 1.2,
        size: Math.random() * 2.5 + 2,
        color: '#E0F2FE',
        alpha: Math.random() * 0.7 + 0.3,
        maxAlpha: Math.random() * 0.8 + 0.2,
        life: 0,
        maxLife: Math.random() * 300 + 200,
        angle: Math.random() * Math.PI * 2,
      };

    case 'scorched_cavern':
      return {
        x: Math.random() * width,
        y: initialSpawn ? Math.random() * height : height + 10,
        vx: (Math.random() - 0.5) * 1.5,
        vy: -(Math.random() * 3 + 1), // Rising embers
        size: Math.random() * 3 + 1.5,
        color: Math.random() > 0.5 ? '#F59E0B' : '#EF4444',
        alpha: Math.random() * 0.8 + 0.2,
        maxAlpha: Math.random() * 0.8 + 0.2,
        life: 0,
        maxLife: Math.random() * 200 + 100,
      };

    case 'electrified_tempest':
      return {
        x: Math.random() * width,
        y: spawnY,
        vx: (Math.random() - 0.5) * 2 - 2, // Rain angle
        vy: Math.random() * 12 + 10, // Fast rain
        size: Math.random() * 1.5 + 1,
        color: '#38BDF8',
        alpha: Math.random() * 0.6 + 0.2,
        maxAlpha: 0.8,
        life: 0,
        maxLife: Math.random() * 60 + 30,
      };

    case 'deep_space':
      return {
        x: Math.random() * width,
        y: Math.random() * height,
        vx: (Math.random() - 0.5) * 0.3,
        vy: (Math.random() - 0.5) * 0.3,
        size: Math.random() * 2.5 + 1,
        color: Math.random() > 0.4 ? '#C084FC' : '#38BDF8',
        alpha: Math.random() * 0.8 + 0.2,
        maxAlpha: Math.random() * 0.8 + 0.2,
        life: 0,
        maxLife: Math.random() * 350 + 150,
      };

    case 'celestial_sanctuary':
      return {
        x: Math.random() * width,
        y: initialSpawn ? Math.random() * height : height + 10,
        vx: (Math.random() - 0.5) * 0.8,
        vy: -(Math.random() * 1.5 + 0.5), // Rising golden motes
        size: Math.random() * 3 + 1.5,
        color: '#FBBF24',
        alpha: Math.random() * 0.8 + 0.2,
        maxAlpha: Math.random() * 0.9 + 0.1,
        life: 0,
        maxLife: Math.random() * 250 + 150,
      };

    case 'breezy_highlands':
      return {
        x: Math.random() * width,
        y: spawnY,
        vx: Math.random() * 2 + 1, // Wind blowing right
        vy: Math.random() * 1.5 + 0.5,
        size: Math.random() * 2.5 + 1.5,
        color: Math.random() > 0.5 ? '#34D399' : '#F97316',
        alpha: Math.random() * 0.7 + 0.3,
        maxAlpha: 0.8,
        life: 0,
        maxLife: Math.random() * 250 + 100,
      };

    case 'shattered_rift':
      return {
        x: Math.random() * width,
        y: Math.random() * height,
        vx: (Math.random() - 0.5) * 1.8,
        vy: (Math.random() - 0.5) * 1.8,
        size: Math.random() * 3 + 1,
        color: Math.random() > 0.5 ? '#A855F7' : '#EC4899',
        alpha: Math.random() * 0.7 + 0.2,
        maxAlpha: 0.8,
        life: 0,
        maxLife: Math.random() * 180 + 80,
      };

    default: // Clear Horizon / Canyon
      return {
        x: Math.random() * width,
        y: Math.random() * height,
        vx: (Math.random() - 0.5) * 0.5,
        vy: -(Math.random() * 0.8 + 0.2),
        size: Math.random() * 2 + 1,
        color: '#38BDF8',
        alpha: Math.random() * 0.6 + 0.2,
        maxAlpha: 0.7,
        life: 0,
        maxLife: Math.random() * 200 + 100,
      };
  }
}
