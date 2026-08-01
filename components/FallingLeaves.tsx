"use client";

import { useEffect, useRef } from "react";

interface Leaf {
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
}

const LEAF_COLORS = [
  "rgba(212, 133, 74, ", // Amber
  "rgba(196, 92, 46, ",  // Sunset orange
  "rgba(201, 123, 123, ", // Rose
  "rgba(232, 196, 176, ", // Cream blush
  "rgba(168, 70, 35, ",  // Deep autumn red
];

export default function FallingLeaves() {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    let rafId: number;
    let W = 0;
    let H = 0;
    let leaves: Leaf[] = [];

    const resize = () => {
      W = canvas.width = window.innerWidth;
      H = canvas.height = window.innerHeight;
    };

    const createLeaf = (): Leaf => {
      const colorPrefix = LEAF_COLORS[Math.floor(Math.random() * LEAF_COLORS.length)];
      return {
        x: Math.random() * W,
        y: -20 - Math.random() * 100,
        size: Math.random() * 10 + 8,
        speedY: Math.random() * 0.8 + 0.3,
        speedX: (Math.random() - 0.5) * 0.4,
        rotation: Math.random() * Math.PI * 2,
        rotationSpeed: (Math.random() - 0.5) * 0.02,
        oscillationSpeed: Math.random() * 0.02 + 0.01,
        oscillationAmplitude: Math.random() * 1.5 + 0.5,
        color: colorPrefix,
        opacity: Math.random() * 0.55 + 0.25,
      };
    };

    resize();
    window.addEventListener("resize", resize);

    // Initial leaves batch
    leaves = Array.from({ length: 24 }, createLeaf);

    const drawLeaf = (leaf: Leaf) => {
      ctx.save();
      ctx.translate(leaf.x, leaf.y);
      ctx.rotate(leaf.rotation);
      ctx.beginPath();
      // Draw organic maple leaf / teardrop petal shape
      ctx.moveTo(0, -leaf.size);
      ctx.bezierCurveTo(leaf.size * 0.8, -leaf.size * 0.3, leaf.size * 0.6, leaf.size * 0.8, 0, leaf.size);
      ctx.bezierCurveTo(-leaf.size * 0.6, leaf.size * 0.8, -leaf.size * 0.8, -leaf.size * 0.3, 0, -leaf.size);
      ctx.fillStyle = `${leaf.color}${leaf.opacity.toFixed(2)})`;
      ctx.fill();

      // Delicate leaf vein line
      ctx.beginPath();
      ctx.moveTo(0, -leaf.size * 0.7);
      ctx.lineTo(0, leaf.size * 0.8);
      ctx.strokeStyle = `rgba(255, 255, 255, ${ (leaf.opacity * 0.3).toFixed(2) })`;
      ctx.lineWidth = 0.8;
      ctx.stroke();

      ctx.restore();
    };

    let tick = 0;
    const animate = () => {
      tick++;
      ctx.clearRect(0, 0, W, H);

      for (let i = 0; i < leaves.length; i++) {
        const leaf = leaves[i];
        leaf.y += leaf.speedY;
        leaf.x += leaf.speedX + Math.sin(tick * leaf.oscillationSpeed) * leaf.oscillationAmplitude * 0.5;
        leaf.rotation += leaf.rotationSpeed;

        drawLeaf(leaf);

        // Respawn offscreen leaves
        if (leaf.y > H + 30) {
          leaves[i] = createLeaf();
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
