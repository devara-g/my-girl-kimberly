"use client";

import { useEffect, useRef } from "react";

interface Star {
  x: number;
  y: number;
  r: number;
  alpha: number;
  twinkleSpeed: number;
  twinklePhase: number;
}

interface ShootingStar {
  x: number;
  y: number;
  vx: number;
  vy: number;
  len: number;
  alpha: number;
  life: number;
  maxLife: number;
}

export default function StarryNight() {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    let raf: number;
    let W = 0, H = 0;
    let t = 0;
    let stars: Star[] = [];
    let shooters: ShootingStar[] = [];
    let shootTimer = 0;

    const resize = () => {
      W = canvas.width  = canvas.offsetWidth;
      H = canvas.height = canvas.offsetHeight;
      buildStars();
    };

    const buildStars = () => {
      const count = Math.floor((W * H) / 2800);
      stars = Array.from({ length: count }, () => ({
        x: Math.random() * W,
        y: Math.random() * H * 0.85,
        r: Math.random() * 1.3 + 0.2,
        alpha: Math.random() * 0.7 + 0.2,
        twinkleSpeed: Math.random() * 0.02 + 0.005,
        twinklePhase: Math.random() * Math.PI * 2,
      }));
    };

    const spawnShooter = () => {
      const angle = (Math.random() * 30 + 20) * (Math.PI / 180);
      const speed = Math.random() * 5 + 4;
      shooters.push({
        x: Math.random() * W * 0.6,
        y: Math.random() * H * 0.35,
        vx:  Math.cos(angle) * speed,
        vy:  Math.sin(angle) * speed,
        len: Math.random() * 100 + 80,
        alpha: 0,
        life: 0,
        maxLife: Math.random() * 60 + 50,
      });
    };

    resize();
    window.addEventListener("resize", resize);

    const draw = () => {
      t++;
      ctx.clearRect(0, 0, W, H);

      // Draw stars
      for (const s of stars) {
        const twinkle = Math.sin(t * s.twinkleSpeed + s.twinklePhase) * 0.35 + 0.65;
        ctx.beginPath();
        ctx.arc(s.x, s.y, s.r, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(232,223,201,${(s.alpha * twinkle).toFixed(2)})`;
        ctx.fill();
      }

      // Shooting stars
      shootTimer--;
      if (shootTimer <= 0) {
        spawnShooter();
        shootTimer = Math.floor(Math.random() * 200 + 180);
      }

      shooters = shooters.filter((s) => s.life < s.maxLife);
      for (const s of shooters) {
        s.life++;
        const progress = s.life / s.maxLife;
        s.alpha = progress < 0.15
          ? progress / 0.15
          : progress > 0.7
          ? 1 - (progress - 0.7) / 0.3
          : 1;

        const grad = ctx.createLinearGradient(
          s.x, s.y,
          s.x - s.vx * (s.len / 6),
          s.y - s.vy * (s.len / 6)
        );
        grad.addColorStop(0, `rgba(255,245,220,${(s.alpha * 0.9).toFixed(2)})`);
        grad.addColorStop(1, "rgba(255,245,220,0)");

        ctx.beginPath();
        ctx.moveTo(s.x, s.y);
        ctx.lineTo(s.x - s.vx * (s.len / 6), s.y - s.vy * (s.len / 6));
        ctx.strokeStyle = grad;
        ctx.lineWidth = 1.5;
        ctx.stroke();

        s.x += s.vx;
        s.y += s.vy;
      }

      raf = requestAnimationFrame(draw);
    };

    draw();
    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener("resize", resize);
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      style={{
        position: "absolute",
        inset: 0,
        width: "100%",
        height: "100%",
        display: "block",
      }}
      aria-hidden="true"
    />
  );
}
