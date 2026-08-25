"use client";

import { useEffect, useRef } from "react";

interface FlowerParticle {
  x: number;
  y: number;
  size: number;
  speedY: number;
  speedX: number;
  rotation: number;
  rotationSpeed: number;
  oscillationSpeed: number;
  oscillationAmplitude: number;
  color: string;
  opacity: number;
  pulsePhase: number;
  petals: number;
}

const FLOWER_COLORS = [
  "rgba(96, 165, 250, ",   // Sky Blue
  "rgba(147, 197, 253, ",  // Baby Blue
  "rgba(186, 230, 253, ",  // Ice Blue
  "rgba(59, 130, 246, ",   // Royal Blue
  "rgba(251, 191, 36, ",   // Warm Gold
  "rgba(253, 230, 138, ",  // Soft Yellow
  "rgba(255, 255, 255, ",  // White
];

export default function FloatingHearts() {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    let rafId: number;
    let W = 0;
    let H = 0;
    let flowers: FlowerParticle[] = [];

    const resize = () => {
      W = canvas.width = window.innerWidth;
      H = canvas.height = window.innerHeight;
    };

    const createFlower = (): FlowerParticle => {
      const colorPrefix = FLOWER_COLORS[Math.floor(Math.random() * FLOWER_COLORS.length)];
      return {
        x: Math.random() * W,
        y: H + 20 + Math.random() * 80,
        size: Math.random() * 10 + 5,
        speedY: -(Math.random() * 0.65 + 0.25),
        speedX: (Math.random() - 0.5) * 0.4,
        rotation: Math.random() * Math.PI * 2,
        rotationSpeed: (Math.random() - 0.5) * 0.018,
        oscillationSpeed: Math.random() * 0.022 + 0.008,
        oscillationAmplitude: Math.random() * 1.6 + 0.5,
        color: colorPrefix,
        opacity: Math.random() * 0.5 + 0.25,
        pulsePhase: Math.random() * Math.PI * 2,
        petals: Math.random() < 0.5 ? 5 : 6,
      };
    };

    resize();
    window.addEventListener("resize", resize);

    flowers = Array.from({ length: 12 }, () => {
      const f = createFlower();
      f.y = Math.random() * H;
      return f;
    });

    // Draw a flower with N petals
    const drawFlower = (
      ctx: CanvasRenderingContext2D,
      size: number,
      petals: number,
      color: string,
      opacity: number
    ) => {
      const petalLength = size;
      const petalWidth  = size * 0.42;

      // Petals
      for (let p = 0; p < petals; p++) {
        const angle = (Math.PI * 2 * p) / petals;
        ctx.save();
        ctx.rotate(angle);
        ctx.beginPath();
        ctx.ellipse(0, -petalLength * 0.55, petalWidth * 0.5, petalLength * 0.55, 0, 0, Math.PI * 2);
        ctx.fillStyle = `${color}${opacity.toFixed(2)})`;
        ctx.fill();
        ctx.restore();
      }

      // Center circle
      ctx.beginPath();
      ctx.arc(0, 0, size * 0.22, 0, Math.PI * 2);
      ctx.fillStyle = `rgba(251, 191, 36, ${(opacity * 0.9).toFixed(2)})`;
      ctx.fill();
    };

    let tick = 0;
    let frame = 0;
    const animate = () => {
      frame++;
      // Throttle: only update every 2 frames (~30fps) for perf
      if (frame % 2 !== 0) { rafId = requestAnimationFrame(animate); return; }
      tick++;
      ctx.clearRect(0, 0, W, H);

      for (let i = 0; i < flowers.length; i++) {
        const f = flowers[i];
        f.y += f.speedY;
        f.x += f.speedX + Math.sin(tick * f.oscillationSpeed) * f.oscillationAmplitude * 0.38;
        f.rotation += f.rotationSpeed;

        const pulse = 1 + Math.sin(tick * 0.035 + f.pulsePhase) * 0.10;
        const currentSize = f.size * pulse;

        ctx.save();
        ctx.translate(f.x, f.y);
        ctx.rotate(f.rotation);
        drawFlower(ctx, currentSize, f.petals, f.color, f.opacity);
        ctx.restore();

        if (f.y < -30) {
          flowers[i] = createFlower();
        }
      }

      rafId = requestAnimationFrame(animate);
    };

    animate();

    return () => {
      cancelAnimationFrame(rafId);
      window.removeEventListener("resize", resize);
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      style={{
        position: "fixed",
        inset: 0,
        pointerEvents: "none",
        zIndex: 3,
      }}
      aria-hidden="true"
    />
  );
}
