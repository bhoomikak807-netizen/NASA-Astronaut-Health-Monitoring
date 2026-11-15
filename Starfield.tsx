import React, { useEffect, useRef } from 'react';

interface Star {
  x: number;
  y: number;
  radius: number;
  alpha: number;
  twinkleSpeed: number;
  twinkleDirection: number;
  speedY: number;
  color: string;
}

interface Meteor {
  x: number;
  y: number;
  vx: number;
  vy: number;
  life: number;
  maxLife: number;
  length: number;
}

const STAR_COLORS = ['240, 246, 255', '240, 246, 255', '240, 246, 255', '170, 220, 255', '200, 190, 255', '255, 236, 210'];

export const Starfield: React.FC = () => {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    let animationFrameId: number;
    let width = (canvas.width = window.innerWidth);
    let height = (canvas.height = window.innerHeight);
    let stars: Star[] = [];
    const meteors: Meteor[] = [];
    let nextMeteor = performance.now() + 1500;

    const initStars = () => {
      stars = [];
      const starCount = Math.floor((width * height) / 3200);
      for (let i = 0; i < starCount; i++) {
        stars.push({
          x: Math.random() * width,
          y: Math.random() * height,
          radius: Math.random() < 0.06 ? Math.random() * 1.2 + 1.4 : Math.random() * 1.2 + 0.3,
          alpha: Math.random() * 0.7 + 0.25,
          twinkleSpeed: Math.random() * 0.02 + 0.005,
          twinkleDirection: Math.random() > 0.5 ? 1 : -1,
          speedY: (Math.random() * 0.08 + 0.02) * (Math.random() > 0.5 ? 1 : -1),
          color: STAR_COLORS[Math.floor(Math.random() * STAR_COLORS.length)],
        });
      }
    };

    const handleResize = () => {
      width = canvas.width = window.innerWidth;
      height = canvas.height = window.innerHeight;
      initStars();
    };
    window.addEventListener('resize', handleResize);
    initStars();

    const spawnMeteor = () => {
      const speed = Math.random() * 9 + 9;
      const angle = (Math.random() * 20 + 20) * (Math.PI / 180); // falling down-left
      meteors.push({
        x: Math.random() * width * 0.8 + width * 0.3,
        y: Math.random() * height * 0.35 - 40,
        vx: -Math.cos(angle) * speed,
        vy: Math.sin(angle) * speed,
        life: 0,
        maxLife: Math.random() * 40 + 45,
        length: Math.random() * 120 + 140,
      });
    };

    const render = (now: number) => {
      ctx.clearRect(0, 0, width, height);

      for (let i = 0; i < stars.length; i++) {
        const star = stars[i];
        if (!reduced) {
          star.alpha += star.twinkleSpeed * star.twinkleDirection;
          if (star.alpha > 1) {
            star.alpha = 1;
            star.twinkleDirection = -1;
          } else if (star.alpha < 0.15) {
            star.alpha = 0.15;
            star.twinkleDirection = 1;
          }
          star.y += star.speedY;
          if (star.y < 0) star.y = height;
          if (star.y > height) star.y = 0;
        }

        ctx.beginPath();
        ctx.arc(star.x, star.y, star.radius, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(${star.color}, ${star.alpha})`;
        ctx.fill();

        // bright stars get a halo and a soft diffraction cross
        if (star.radius > 1.3) {
          ctx.beginPath();
          ctx.arc(star.x, star.y, star.radius * 3.2, 0, Math.PI * 2);
          ctx.fillStyle = `rgba(110, 200, 255, ${star.alpha * 0.18})`;
          ctx.fill();
          ctx.strokeStyle = `rgba(${star.color}, ${star.alpha * 0.45})`;
          ctx.lineWidth = 0.6;
          const s = star.radius * 5 * star.alpha;
          ctx.beginPath();
          ctx.moveTo(star.x - s, star.y);
          ctx.lineTo(star.x + s, star.y);
          ctx.moveTo(star.x, star.y - s);
          ctx.lineTo(star.x, star.y + s);
          ctx.stroke();
        }
      }

      // shooting stars
      if (!reduced && now > nextMeteor) {
        spawnMeteor();
        nextMeteor = now + Math.random() * 3500 + 2500;
      }
      for (let i = meteors.length - 1; i >= 0; i--) {
        const m = meteors[i];
        m.life++;
        m.x += m.vx;
        m.y += m.vy;
        const fade = Math.sin((m.life / m.maxLife) * Math.PI);
        const len = Math.hypot(m.vx, m.vy);
        const tx = m.x - (m.vx / len) * m.length;
        const ty = m.y - (m.vy / len) * m.length;
        const grad = ctx.createLinearGradient(m.x, m.y, tx, ty);
        grad.addColorStop(0, `rgba(235, 248, 255, ${0.95 * fade})`);
        grad.addColorStop(0.3, `rgba(120, 200, 255, ${0.5 * fade})`);
        grad.addColorStop(1, 'rgba(88, 199, 255, 0)');
        ctx.strokeStyle = grad;
        ctx.lineWidth = 1.8;
        ctx.lineCap = 'round';
        ctx.beginPath();
        ctx.moveTo(m.x, m.y);
        ctx.lineTo(tx, ty);
        ctx.stroke();
        ctx.beginPath();
        ctx.arc(m.x, m.y, 2.2, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(255, 255, 255, ${fade})`;
        ctx.fill();
        if (m.life >= m.maxLife) meteors.splice(i, 1);
      }

      animationFrameId = requestAnimationFrame(render);
    };

    animationFrameId = requestAnimationFrame(render);

    return () => {
      window.removeEventListener('resize', handleResize);
      cancelAnimationFrame(animationFrameId);
    };
  }, []);

  return <canvas ref={canvasRef} className="fixed inset-0 pointer-events-none -z-20 w-full h-full" />;
};
