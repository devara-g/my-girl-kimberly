"use client";

import { useEffect, useRef } from "react";

interface HeartParticle {
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
}

const HEART_COLORS = [
  "rgba(251, 113, 133, ", // Pink Rose
  "rgba(244, 63, 94, ",   // Bright Love Red
  "rgba(225, 29, 72, ",   // Deep Velvet Crimson
  "rgba(244, 114, 182, ",  // Sweet Blush Pink
  "rgba(253, 164, 175, ",  // Light Rose Cream
  "rgba(251, 191, 36, ",   // Warm Golden Sparkle
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
    let hearts: HeartParticle[] = [];

    const resize = () => {
      W = canvas.width = window.innerWidth;
      H = canvas.height = window.innerHeight;
    };

    const createHeart = (): HeartParticle => {
      const colorPrefix = HEART_COLORS[Math.floor(Math.random() * HEART_COLORS.length)];
      return {
        x: Math.random() * W,
        y: H + 20 + Math.random() * 80, // Start below screen, float gently upwards
        size: Math.random() * 12 + 6,
        speedY: -(Math.random() * 0.7 + 0.3), // Float upwards
        speedX: (Math.random() - 0.5) * 0.5,
        rotation: (Math.random() - 0.5) * 0.4,
        rotationSpeed: (Math.random() - 0.5) * 0.015,
        oscillationSpeed: Math.random() * 0.02 + 0.01,
        oscillationAmplitude: Math.random() * 1.8 + 0.6,
        color: colorPrefix,
        opacity: Math.random() * 0.5 + 0.3,
        pulsePhase: Math.random() * Math.PI * 2,
      };
    };

    resize();
    window.addEventListener("resize", resize);

    // Initial batch of floating hearts
    hearts = Array.from({ length: 30 }, () => {
      const h = createHeart();
      h.y = Math.random() * H; // Distribute across full height initially
      return h;
    });

    // Helper to draw a sleek vector heart path on Canvas
    const drawHeart = (ctx: CanvasRenderingContext2D, size: number) => {
      ctx.beginPath();
      const topCurveHeight = size * 0.3;
      ctx.moveTo(0, topCurveHeight);
      // Top left curve
      ctx.bezierCurveTo(
        -size / 2, -topCurveHeight,
        -size, size / 3,
        0, size
      );
      // Top right curve
      ctx.bezierCurveTo(
        size, size / 3,
        size / 2, -topCurveHeight,
        0, topCurveHeight
      );
      ctx.closePath();
    };

    let tick = 0;
    const animate = () => {
      tick++;
      ctx.clearRect(0, 0, W, H);

      for (let i = 0; i < hearts.length; i++) {
        const h = hearts[i];
        h.y += h.speedY;
        h.x += h.speedX + Math.sin(tick * h.oscillationSpeed) * h.oscillationAmplitude * 0.4;
        h.rotation += h.rotationSpeed;

        // Subtle heart pulse
        const pulse = 1 + Math.sin(tick * 0.04 + h.pulsePhase) * 0.12;
        const currentSize = h.size * pulse;

        ctx.save();
        ctx.translate(h.x, h.y);
        ctx.rotate(h.rotation);

        // Fill heart
        drawHeart(ctx, currentSize);
        ctx.fillStyle = `${h.color}${h.opacity.toFixed(2)})`;
        ctx.shadowColor = h.color + "0.6)";
        ctx.shadowBlur = 12;
        ctx.fill();

        // Inner glowing sparkle highlight
        ctx.beginPath();
        ctx.arc(-currentSize * 0.2, currentSize * 0.2, currentSize * 0.15, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(255, 255, 255, ${(h.opacity * 0.4).toFixed(2)})`;
        ctx.fill();

        ctx.restore();

        // Respawn hearts floating above top of screen
        if (h.y < -30) {
          hearts[i] = createHeart();
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
