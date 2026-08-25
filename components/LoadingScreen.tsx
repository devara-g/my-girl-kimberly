"use client";

import { useEffect, useRef, useState } from "react";
import { SparkleIcon } from "./Icons";

interface LoadingScreenProps {
  onComplete?: () => void;
}

/* ── Canvas Star Dust Particles ── */
function StardustCosmos() {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    let width = (canvas.width = window.innerWidth);
    let height = (canvas.height = window.innerHeight);

    const onResize = () => {
      width = canvas.width = window.innerWidth;
      height = canvas.height = window.innerHeight;
    };
    window.addEventListener("resize", onResize);

    type Particle = {
      x: number;
      y: number;
      size: number;
      vx: number;
      vy: number;
      alpha: number;
      color: string;
      phase: number;
      speed: number;
    };

    const colors = ["#60a5fa", "#93c5fd", "#bfdbfe", "#fbcfe8", "#fde047", "#ffffff"];
    const particles: Particle[] = Array.from({ length: 65 }, () => ({
      x: Math.random() * width,
      y: Math.random() * height,
      size: Math.random() * 2.2 + 0.6,
      vx: (Math.random() - 0.5) * 0.35,
      vy: -Math.random() * 0.6 - 0.2, // Drifting upwards
      alpha: Math.random() * 0.8 + 0.2,
      color: colors[Math.floor(Math.random() * colors.length)],
      phase: Math.random() * Math.PI * 2,
      speed: Math.random() * 0.03 + 0.01,
    }));

    let raf: number;
    let t = 0;

    const animate = () => {
      t += 1;
      ctx.clearRect(0, 0, width, height);

      particles.forEach((p) => {
        p.x += p.vx;
        p.y += p.vy;
        if (p.y < -10) {
          p.y = height + 10;
          p.x = Math.random() * width;
        }
        if (p.x < -10) p.x = width + 10;
        if (p.x > width + 10) p.x = -10;

        const flicker = (Math.sin(t * p.speed + p.phase) + 1) / 2;
        ctx.globalAlpha = p.alpha * flicker * 0.85 + 0.15;
        ctx.fillStyle = p.color;
        ctx.shadowBlur = p.size * 3;
        ctx.shadowColor = p.color;
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
        ctx.fill();
      });

      raf = requestAnimationFrame(animate);
    };

    raf = requestAnimationFrame(animate);

    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener("resize", onResize);
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
        pointerEvents: "none",
        zIndex: 1,
      }}
    />
  );
}

export default function LoadingScreen({ onComplete }: LoadingScreenProps) {
  const ref = useRef<HTMLDivElement>(null);
  const [opened, setOpened] = useState(false);
  const [gone, setGone] = useState(false);

  const handleOpen = () => {
    if (opened) return;
    setOpened(true);

    if (ref.current) {
      ref.current.style.opacity = "0";
      ref.current.style.transform = "scale(1.08) filter(blur(10px))";
      ref.current.style.transition =
        "opacity 0.95s cubic-bezier(0.4, 0, 0.2, 1), transform 0.95s cubic-bezier(0.4, 0, 0.2, 1)";
    }

    setTimeout(() => {
      setGone(true);
      onComplete?.();
    }, 950);
  };

  if (gone) return null;

  return (
    <div
      ref={ref}
      style={{
        position: "fixed",
        inset: 0,
        zIndex: 99999,
        background: "radial-gradient(ellipse at 50% 30%, #0c1c3f 0%, #060e20 60%, #030813 100%)",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        padding: "clamp(16px, 4vw, 32px)",
        overflow: "hidden",
      }}
    >
      {/* Floating Animated Stardust Cosmos */}
      <StardustCosmos />

      {/* Ambient Celestial Glow Orbs */}
      <div
        style={{
          position: "absolute",
          top: "20%",
          left: "50%",
          transform: "translate(-50%, -50%)",
          width: "min(600px, 100vw)",
          height: "min(600px, 100vw)",
          background: "radial-gradient(circle, rgba(59,130,246,0.28) 0%, rgba(37,99,235,0.08) 50%, transparent 70%)",
          filter: "blur(70px)",
          pointerEvents: "none",
          zIndex: 0,
          animation: "auroraPulse 6s ease-in-out infinite alternate",
        }}
      />
      <div
        style={{
          position: "absolute",
          bottom: "10%",
          left: "30%",
          width: "min(400px, 80vw)",
          height: "min(400px, 80vw)",
          background: "radial-gradient(circle, rgba(147,197,253,0.12) 0%, transparent 70%)",
          filter: "blur(60px)",
          pointerEvents: "none",
          zIndex: 0,
        }}
      />

      {/* ── Ultra-Luxury Glass Invitation Envelope Card ── */}
      <div
        className="envelope-luxury-card"
        style={{
          position: "relative",
          zIndex: 10,
          maxWidth: "420px",
          width: "100%",
          background: "linear-gradient(145deg, rgba(16,33,65,0.85) 0%, rgba(8,18,38,0.92) 100%)",
          backdropFilter: "blur(30px)",
          WebkitBackdropFilter: "blur(30px)",
          borderRadius: "24px",
          padding: "clamp(28px, 6vw, 42px) clamp(22px, 5vw, 34px)",
          textAlign: "center",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          gap: "1.35rem",
          boxShadow:
            "0 30px 70px -10px rgba(0,0,0,0.8), 0 0 50px -5px rgba(59,130,246,0.3), inset 0 1px 1px rgba(255,255,255,0.2)",
          border: "1px solid rgba(147,197,253,0.35)",
        }}
      >
        {/* Shimmering Top Card Border Accent */}
        <div
          style={{
            position: "absolute",
            top: 0,
            left: "15%",
            right: "15%",
            height: "2px",
            background: "linear-gradient(90deg, transparent, #93c5fd, #60a5fa, transparent)",
            boxShadow: "0 0 12px rgba(147,197,253,0.8)",
          }}
        />

        {/* 3D Royal Flower Wax Seal Emblem with Orbiting Halo */}
        <div style={{ position: "relative", width: "80px", height: "80px", margin: "0 auto" }}>
          {/* Orbiting Celestial Ring */}
          <div
            style={{
              position: "absolute",
              inset: "-6px",
              borderRadius: "50%",
              border: "1px dashed rgba(147,197,253,0.45)",
              animation: "haloSpin 14s linear infinite",
            }}
          />
          {/* Pulsing Outer Bloom Ring */}
          <div
            style={{
              position: "absolute",
              inset: 0,
              borderRadius: "50%",
              border: "2px solid rgba(96,165,250,0.4)",
              animation: "sealPing 2.6s cubic-bezier(0, 0, 0.2, 1) infinite",
            }}
          />
          {/* Main Wax Core */}
          <div
            style={{
              position: "absolute",
              inset: "4px",
              borderRadius: "50%",
              background: "radial-gradient(circle at 35% 35%, #3b82f6 0%, #1d4ed8 55%, #172554 100%)",
              boxShadow:
                "0 0 30px rgba(59,130,246,0.65), 0 8px 16px rgba(0,0,0,0.5), inset 0 2px 4px rgba(255,255,255,0.4)",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              fontSize: "1.75rem",
              border: "1.5px solid rgba(255,255,255,0.4)",
            }}
          >
            🌸
          </div>
        </div>

        {/* Header Eyebrow & Name Section */}
        <div style={{ display: "flex", flexDirection: "column", gap: "8px", width: "100%" }}>
          <div style={{ display: "flex", alignItems: "center", justifyContent: "center", gap: "8px" }}>
            <span style={{ height: "1px", width: "20px", background: "linear-gradient(90deg, transparent, #60a5fa)" }} />
            <span
              style={{
                fontSize: "clamp(0.62rem, 1.4vw, 0.72rem)",
                letterSpacing: "0.3em",
                textTransform: "uppercase",
                color: "#93c5fd",
                fontWeight: 600,
                textShadow: "0 0 10px rgba(147,197,253,0.5)",
              }}
            >
              SPECIAL BIRTHDAY TRIBUTE
            </span>
            <span style={{ height: "1px", width: "20px", background: "linear-gradient(90deg, #60a5fa, transparent)" }} />
          </div>

          <h1
            className="font-display"
            style={{
              fontSize: "clamp(1.85rem, 5.5vw, 2.35rem)",
              fontStyle: "italic",
              fontWeight: 300,
              color: "#ffffff",
              lineHeight: 1.2,
              letterSpacing: "-0.01em",
              textShadow: "0 4px 20px rgba(59,130,246,0.4), 0 0 35px rgba(147,197,253,0.3)",
            }}
          >
            Ratu Bunga Syakira
          </h1>

          <p
            className="font-handwritten"
            style={{
              fontSize: "clamp(1.15rem, 3.2vw, 1.35rem)",
              color: "#bfdbfe",
              lineHeight: 1.35,
              marginTop: "2px",
            }}
          >
            &ldquo;sebuah persembahan hangat untuk merayakan hari istimewamu...&rdquo;
          </p>
        </div>

        {/* Elegant Date Stamp Badge */}
        <div
          style={{
            padding: "4px 14px",
            borderRadius: "20px",
            background: "rgba(30,58,138,0.35)",
            border: "1px solid rgba(147,197,253,0.25)",
            fontSize: "0.68rem",
            letterSpacing: "0.18em",
            color: "#60a5fa",
            fontWeight: 500,
          }}
        >
          25.08.2010 · A BEAUTIFUL MILESTONE
        </div>

        {/* ── Magnetic Shimmering Enter Button ── */}
        <div style={{ width: "100%", display: "flex", flexDirection: "column", alignItems: "center", gap: "10px" }}>
          <button
            onClick={handleOpen}
            className="entrance-cta-button"
            style={{
              width: "100%",
              padding: "clamp(14px, 3vw, 16px) 24px",
              borderRadius: "50px",
              background: "linear-gradient(135deg, #2563eb 0%, #3b82f6 50%, #1d4ed8 100%)",
              color: "#ffffff",
              border: "1px solid rgba(255,255,255,0.4)",
              fontSize: "clamp(0.85rem, 2vw, 0.95rem)",
              fontWeight: 500,
              letterSpacing: "0.08em",
              display: "inline-flex",
              alignItems: "center",
              justifyContent: "center",
              gap: "10px",
              cursor: "pointer",
              position: "relative",
              overflow: "hidden",
              boxShadow: "0 12px 35px rgba(37,99,235,0.55), 0 0 25px rgba(59,130,246,0.35)",
              transition: "all 0.3s cubic-bezier(0.2, 0.8, 0.2, 1)",
            }}
          >
            {/* Animated Shimmer Ray across button */}
            <div className="button-shimmer-ray" />

            <SparkleIcon size={16} color="#ffffff" />
            <span style={{ position: "relative", zIndex: 2 }}>Buka Surat &amp; Putar Musik 🎵</span>
          </button>

          <span
            style={{
              fontSize: "0.68rem",
              color: "rgba(147,197,253,0.7)",
              letterSpacing: "0.06em",
              display: "flex",
              alignItems: "center",
              gap: "4px",
            }}
          >
            🎧 Disarankan memakai earphone / speaker
          </span>
        </div>
      </div>

      <style>{`
        .entrance-cta-button:hover {
          transform: translateY(-2px) scale(1.02);
          box-shadow: 0 16px 45px rgba(37,99,235,0.7), 0 0 35px rgba(96,165,250,0.6) !important;
        }
        .entrance-cta-button:active {
          transform: scale(0.98);
        }

        .button-shimmer-ray {
          position: absolute;
          top: 0;
          left: -100%;
          width: 60%;
          height: 100%;
          background: linear-gradient(
            90deg,
            transparent,
            rgba(255, 255, 255, 0.35),
            transparent
          );
          transform: skewX(-25deg);
          animation: shimmerPass 2.8s ease-in-out infinite;
        }

        @keyframes shimmerPass {
          0% { left: -100%; }
          60%, 100% { left: 180%; }
        }

        @keyframes haloSpin {
          from { transform: rotate(0deg); }
          to { transform: rotate(360deg); }
        }

        @keyframes sealPing {
          70%, 100% {
            transform: scale(1.6);
            opacity: 0;
          }
        }

        @keyframes auroraPulse {
          0% {
            opacity: 0.7;
            transform: translate(-50%, -50%) scale(0.95);
          }
          100% {
            opacity: 1;
            transform: translate(-50%, -50%) scale(1.1);
          }
        }
      `}</style>
    </div>
  );
}
