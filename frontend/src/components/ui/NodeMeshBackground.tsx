/**
 * NAMASTE - Node Mesh Background
 * Animated particle network canvas rendered behind key pages.
 */
import { useEffect, useRef } from 'react';

interface Particle {
  x: number;
  y: number;
  vx: number;
  vy: number;
  radius: number;
  opacity: number;
}

const COLORS = ['rgba(108,99,255,', 'rgba(167,139,250,', 'rgba(0,255,156,'];

const clamp = (value: number, min: number, max: number) => Math.min(max, Math.max(min, value));

const createParticles = (width: number, height: number): Particle[] => {
  const columns = clamp(Math.round(width / 190), 4, 10);
  const rows = clamp(Math.round(height / 175), 4, 6);
  const cellWidth = width / columns;
  const cellHeight = height / rows;

  return Array.from({ length: columns * rows }, (_, index) => {
    const column = index % columns;
    const row = Math.floor(index / columns);
    const jitterX = (Math.random() - 0.5) * cellWidth * 0.34;
    const jitterY = (Math.random() - 0.5) * cellHeight * 0.34;

    return {
      x: (column + 0.5) * cellWidth + jitterX,
      y: (row + 0.5) * cellHeight + jitterY,
      vx: (Math.random() - 0.5) * 0.16,
      vy: (Math.random() - 0.5) * 0.16,
      radius: Math.random() * 1.4 + 1,
      opacity: Math.random() * 0.26 + 0.16,
    };
  });
};

export default function NodeMeshBackground() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const particles = useRef<Particle[]>([]);
  const animRef = useRef<number>(0);
  const viewport = useRef({ width: 0, height: 0 });

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const resize = () => {
      const width = window.innerWidth;
      const height = window.innerHeight;
      const dpr = window.devicePixelRatio || 1;

      viewport.current = { width, height };
      canvas.width = Math.floor(width * dpr);
      canvas.height = Math.floor(height * dpr);
      canvas.style.width = `${width}px`;
      canvas.style.height = `${height}px`;
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      particles.current = createParticles(width, height);
    };

    resize();
    window.addEventListener('resize', resize);

    const draw = () => {
      const { width, height } = viewport.current;
      const maxDistance = clamp(Math.min(width, height) * 0.16, 92, 170);
      const pts = particles.current;

      ctx.clearRect(0, 0, width, height);

      pts.forEach((p) => {
        p.x += p.vx;
        p.y += p.vy;
        if (p.x < 12 || p.x > width - 12) p.vx *= -1;
        if (p.y < 12 || p.y > height - 12) p.vy *= -1;
      });

      for (let i = 0; i < pts.length; i++) {
        for (let j = i + 1; j < pts.length; j++) {
          const dx = pts[i].x - pts[j].x;
          const dy = pts[i].y - pts[j].y;
          const dist = Math.sqrt(dx * dx + dy * dy);

          if (dist < maxDistance) {
            const alpha = (1 - dist / maxDistance) * 0.13;
            ctx.beginPath();
            ctx.moveTo(pts[i].x, pts[i].y);
            ctx.lineTo(pts[j].x, pts[j].y);
            ctx.strokeStyle = `rgba(108,99,255,${alpha})`;
            ctx.lineWidth = 0.65;
            ctx.stroke();
          }
        }
      }

      pts.forEach((p, idx) => {
        const colorBase = COLORS[idx % COLORS.length];
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.radius, 0, Math.PI * 2);
        ctx.fillStyle = `${colorBase}${p.opacity})`;
        ctx.fill();

        const glow = ctx.createRadialGradient(p.x, p.y, 0, p.x, p.y, p.radius * 5);
        glow.addColorStop(0, `${colorBase}0.12)`);
        glow.addColorStop(1, `${colorBase}0)`);
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.radius * 5, 0, Math.PI * 2);
        ctx.fillStyle = glow;
        ctx.fill();
      });

      animRef.current = requestAnimationFrame(draw);
    };

    draw();

    return () => {
      cancelAnimationFrame(animRef.current);
      window.removeEventListener('resize', resize);
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      style={{
        position: 'fixed',
        inset: 0,
        width: '100%',
        height: '100%',
        pointerEvents: 'none',
        zIndex: 0,
        opacity: 0.48,
      }}
    />
  );
}
