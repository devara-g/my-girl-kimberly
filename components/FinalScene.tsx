"use client";

import { useEffect, useRef, useState, useCallback } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import dynamic from "next/dynamic";
import FlowerModal from "./FlowerModal";

const StarryNight = dynamic(() => import("./StarryNight"), { ssr: false });

gsap.registerPlugin(ScrollTrigger);

interface ConfettiParticle {
  x: number; y: number;
  vx: number; vy: number;
  size: number; color: string;
  rotation: number; vRotation: number;
  opacity: number;
  shape: "circle" | "rect" | "petal";
}

export default function FinalScene() {
  const sectionRef = useRef<HTMLElement>(null);
  const eyebrowRef = useRef<HTMLDivElement>(null);
  const line1Ref   = useRef<HTMLDivElement>(null);
  const line2Ref   = useRef<HTMLDivElement>(null);
  const line3Ref   = useRef<HTMLDivElement>(null);
  const ruleRef    = useRef<HTMLDivElement>(null);
  const bodyRef    = useRef<HTMLDivElement>(null);
  const sigRef     = useRef<HTMLDivElement>(null);
  const ctaRef     = useRef<HTMLDivElement>(null);
  const canvasRef  = useRef<HTMLCanvasElement | null>(null);

  const [showFlowerModal, setShowFlowerModal] = useState(false);
  const confettiParticles = useRef<ConfettiParticle[]>([]);
  const animationFrameId  = useRef<number | null>(null);

  const fireConfetti = useCallback((originX?: number, originY?: number) => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const startX = originX ?? canvas.width / 2;
    const startY = originY ?? canvas.height * 0.5;
    const colors = [
      "#93c5fd", "#60a5fa", "#3b82f6", "#bfdbfe",
      "#dbeafe", "#fde68a", "#fbbf24", "#e0f2fe",
      "#fff7ed", "#ffffff",
    ];
    for (let i = 0; i < 90; i++) {
      const angle = Math.PI * 2 * (i / 90) + (Math.random() - 0.5) * 0.8;
      const speed = Math.random() * 8 + 3;
      const shapes: Array<"circle" | "rect" | "petal"> = ["circle", "rect", "petal"];
      confettiParticles.current.push({
        x: startX, y: startY,
        vx: Math.cos(angle) * speed * (Math.random() * 1.3 + 0.5),
        vy: Math.sin(angle) * speed * (Math.random() * 1.2 + 0.4) - Math.random() * 5,
        size: Math.random() * 7 + 3,
        color: colors[Math.floor(Math.random() * colors.length)],
        rotation: Math.random() * 360,
        vRotation: (Math.random() - 0.5) * 10,
        opacity: 1,
        shape: shapes[Math.floor(Math.random() * shapes.length)],
      });
    }
  }, []);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;
    const handleResize = () => {
      canvas.width  = window.innerWidth;
      canvas.height = window.innerHeight;
    };
    handleResize();
    window.addEventListener("resize", handleResize);
    const render = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      for (let i = confettiParticles.current.length - 1; i >= 0; i--) {
        const p = confettiParticles.current[i];
        p.x += p.vx; p.y += p.vy;
        p.vy += 0.2; p.vx *= 0.988;
        p.rotation += p.vRotation;
        p.opacity -= 0.008;
        if (p.opacity <= 0 || p.y > canvas.height + 60) {
          confettiParticles.current.splice(i, 1); continue;
        }
        ctx.save();
        ctx.translate(p.x, p.y);
        ctx.rotate((p.rotation * Math.PI) / 180);
        ctx.globalAlpha = Math.max(0, p.opacity);
        ctx.fillStyle = p.color;
        if (p.shape === "rect") {
          ctx.fillRect(-p.size / 2, -p.size * 0.3, p.size, p.size * 0.6);
        } else if (p.shape === "circle") {
          ctx.beginPath();
          ctx.arc(0, 0, p.size / 2, 0, Math.PI * 2);
          ctx.fill();
        } else {
          ctx.beginPath();
          ctx.ellipse(0, -p.size * 0.4, p.size * 0.35, p.size * 0.7, 0, 0, Math.PI * 2);
          ctx.fill();
        }
        ctx.restore();
      }
      animationFrameId.current = requestAnimationFrame(render);
    };
    animationFrameId.current = requestAnimationFrame(render);
    return () => {
      window.removeEventListener("resize", handleResize);
      if (animationFrameId.current) cancelAnimationFrame(animationFrameId.current);
    };
  }, []);

  useEffect(() => {
    const ctx = gsap.context(() => {
      const tl = gsap.timeline({
        scrollTrigger: {
          trigger: sectionRef.current,
          start: "top 70%",
          toggleActions: "play none none reverse",
          onEnter: () => setTimeout(() => fireConfetti(), 600),
        },
      });

      tl.fromTo(eyebrowRef.current,
        { opacity: 0, y: 18 },
        { opacity: 1, y: 0, duration: 1.1, ease: "power3.out" }
      );
      tl.fromTo(ruleRef.current,
        { scaleX: 0, opacity: 0 },
        { scaleX: 1, opacity: 1, duration: 0.8, ease: "power2.inOut" },
        "-=0.5"
      );
      tl.fromTo(line1Ref.current,
        { opacity: 0, y: 44, filter: "blur(14px)" },
        { opacity: 1, y: 0, filter: "blur(0px)", duration: 1.2, ease: "power3.out" },
        "-=0.4"
      );
      tl.fromTo(line2Ref.current,
        { opacity: 0, y: 44, filter: "blur(14px)" },
        { opacity: 1, y: 0, filter: "blur(0px)", duration: 1.2, ease: "power3.out" },
        "-=1.0"
      );
      tl.fromTo(line3Ref.current,
        { opacity: 0, y: 44, filter: "blur(14px)" },
        { opacity: 1, y: 0, filter: "blur(0px)", duration: 1.2, ease: "power3.out" },
        "-=1.0"
      );
      tl.fromTo(bodyRef.current,
        { opacity: 0, y: 22 },
        { opacity: 1, y: 0, duration: 1.0, ease: "power2.out" },
        "-=0.4"
      );
      tl.fromTo(sigRef.current,
        { opacity: 0, x: -16 },
        { opacity: 1, x: 0, duration: 0.95, ease: "power2.out" },
        "-=0.4"
      );
      tl.fromTo(ctaRef.current,
        { opacity: 0, y: 14, scale: 0.96 },
        { opacity: 1, y: 0, scale: 1, duration: 0.85, ease: "back.out(1.5)" },
        "-=0.3"
      );
    }, sectionRef);
    return () => ctx.revert();
  }, [fireConfetti]);

  return (
    <section
      ref={sectionRef}
      id="final"
      style={{
        position: "relative",
        minHeight: "100vh",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        overflow: "hidden",
        background: "linear-gradient(170deg, #060e1f 0%, #0c1a36 40%, #122040 70%, #0a1628 100%)",
      }}
    >
      <StarryNight />

      {/* Confetti canvas */}
      <canvas
        ref={canvasRef}
        style={{ position: "fixed", inset: 0, pointerEvents: "none", zIndex: 99999 }}
      />

      {/* Ambient bloom orbs */}
      <div style={{ position: "absolute", inset: 0, pointerEvents: "none", zIndex: 1 }}>
        <div style={{
          position: "absolute", top: "-10%", left: "50%",
          transform: "translateX(-50%)",
          width: "80vw", height: "65vh",
          background: "radial-gradient(ellipse, rgba(37,99,235,0.15) 0%, transparent 65%)",
          filter: "blur(100px)",
        }} />
        <div style={{
          position: "absolute", bottom: "0%", left: "-10%",
          width: "55vw", height: "55vw",
          background: "radial-gradient(ellipse, rgba(251,191,36,0.08) 0%, transparent 70%)",
          filter: "blur(100px)",
        }} />
        <div style={{
          position: "absolute", bottom: "5%", right: "-5%",
          width: "42vw", height: "42vw",
          background: "radial-gradient(ellipse, rgba(96,165,250,0.10) 0%, transparent 70%)",
          filter: "blur(90px)",
        }} />
      </div>

      {/* ── Main Content ── */}
      <div
        style={{
          position: "relative",
          zIndex: 10,
          maxWidth: "860px",
          width: "100%",
          padding: "clamp(3rem, 8vw, 6rem) clamp(1.5rem, 5vw, 3rem)",
          display: "flex",
          flexDirection: "column",
          alignItems: "flex-start",
        }}
      >
        {/* Eyebrow */}
        <div
          ref={eyebrowRef}
          style={{
            fontSize: "clamp(0.58rem, 1.3vw, 0.7rem)",
            fontWeight: 500,
            letterSpacing: "0.32em",
            textTransform: "uppercase",
            color: "rgba(147,197,253,0.55)",
            fontFamily: "'Poppins', sans-serif",
            marginBottom: "clamp(1.4rem, 3vw, 2rem)",
          }}
        >
          25 Agustus 2010 &nbsp;·&nbsp; A Star Was Born
        </div>

        {/* Thin accent rule */}
        <div
          ref={ruleRef}
          style={{
            width: "clamp(48px, 7vw, 72px)",
            height: "1px",
            background: "linear-gradient(90deg, rgba(96,165,250,0.75), transparent)",
            transformOrigin: "left center",
            marginBottom: "clamp(1.8rem, 4vw, 3rem)",
          }}
        />

        {/* Oversized editorial headline */}
        <div style={{ display: "flex", flexDirection: "column", gap: "0.04em", marginBottom: "clamp(2rem, 4.5vw, 4rem)", overflow: "hidden", width: "100%" }}>
          <div
            ref={line1Ref}
            className="font-display"
            style={{
              fontSize: "clamp(2.4rem, 8.5vw, 7.5rem)",
              fontWeight: 300,
              fontStyle: "italic",
              lineHeight: 0.98,
              letterSpacing: "-0.02em",
              color: "rgba(255,255,255,0.92)",
            }}
          >
            Happy
          </div>
          <div
            ref={line2Ref}
            className="font-display"
            style={{
              fontSize: "clamp(2.4rem, 8.5vw, 7.5rem)",
              fontWeight: 700,
              fontStyle: "italic",
              lineHeight: 0.98,
              letterSpacing: "-0.02em",
              background: "linear-gradient(115deg, #93c5fd 0%, #60a5fa 40%, #fbbf24 80%, #fde68a 100%)",
              WebkitBackgroundClip: "text",
              WebkitTextFillColor: "transparent",
            }}
          >
            Birthday,
          </div>
          <div
            ref={line3Ref}
            className="font-display"
            style={{
              fontSize: "clamp(1.65rem, 5.8vw, 5rem)",
              fontWeight: 300,
              fontStyle: "italic",
              lineHeight: 1.15,
              letterSpacing: "-0.015em",
              color: "rgba(219,234,254,0.85)",
              marginTop: "4px",
            }}
          >
            Ratu Bunga Syakira.
          </div>
        </div>

        {/* Thin full-width divider */}
        <div style={{
          width: "100%",
          height: "1px",
          background: "linear-gradient(90deg, rgba(96,165,250,0.25), rgba(96,165,250,0.06) 70%, transparent)",
          marginBottom: "clamp(1.8rem, 4vw, 3.5rem)",
        }} />

        {/* Two-column body copy */}
        <div
          ref={bodyRef}
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fit, minmax(240px, 1fr))",
            gap: "clamp(1.2rem, 3vw, 2.8rem)",
            marginBottom: "clamp(2rem, 4.5vw, 4rem)",
            width: "100%",
          }}
        >
          <p
            className="font-display"
            style={{
              fontSize: "clamp(0.92rem, 1.7vw, 1.15rem)",
              fontWeight: 300,
              fontStyle: "italic",
              lineHeight: 1.9,
              color: "rgba(186,219,255,0.80)",
              margin: 0,
            }}
          >
            Selamat ulang tahun untuk sosok yang luar biasa — yang namanya terasa seperti puisi, yang kehadirannya seperti sinar matahari di pagi yang tenang.
          </p>
          <p
            className="font-display"
            style={{
              fontSize: "clamp(0.92rem, 1.7vw, 1.15rem)",
              fontWeight: 300,
              fontStyle: "italic",
              lineHeight: 1.9,
              color: "rgba(186,219,255,0.60)",
              margin: 0,
            }}
          >
            Semoga di setiap hari yang menantimu, langkahmu selalu dibasahi cahaya — dan hatimu selalu penuh dengan hal-hal yang paling kamu cintai.
          </p>
        </div>

        {/* Handwritten sign-off with left accent bar */}
        <div
          ref={sigRef}
          style={{
            display: "flex",
            flexDirection: "column",
            gap: "4px",
            marginBottom: "clamp(2.5rem, 5vw, 4.5rem)",
            paddingLeft: "clamp(0.9rem, 2vw, 1.6rem)",
            borderLeft: "2px solid rgba(96,165,250,0.28)",
          }}
        >
          <span
            className="font-handwritten"
            style={{
              fontSize: "clamp(1.35rem, 3vw, 2.2rem)",
              color: "rgba(147,197,253,0.88)",
              lineHeight: 1.35,
            }}
          >
            "teruslah mekar, tersenyum,
          </span>
          <span
            className="font-handwritten"
            style={{
              fontSize: "clamp(1.35rem, 3vw, 2.2rem)",
              color: "rgba(251,191,36,0.80)",
              lineHeight: 1.35,
            }}
          >
            dan bersinar seperti namamu..."
          </span>
        </div>

        {/* CTA buttons */}
        <div
          ref={ctaRef}
          className="final-cta-group"
          style={{
            display: "flex",
            alignItems: "center",
            gap: "clamp(12px, 2.5vw, 20px)",
            flexWrap: "wrap",
            width: "100%",
          }}
        >
          <button
            onClick={() => {
              setShowFlowerModal(true);
              fireConfetti();
              if (typeof window !== "undefined") {
                window.dispatchEvent(new CustomEvent("openBouquetMusic"));
              }
            }}
            className="final-primary-btn"
            style={{
              display: "inline-flex",
              alignItems: "center",
              justifyContent: "center",
              gap: "10px",
              padding: "clamp(12px, 2vw, 15px) clamp(22px, 3.5vw, 32px)",
              borderRadius: "4px",
              background: "transparent",
              color: "#ffffff",
              fontSize: "clamp(0.78rem, 1.4vw, 0.88rem)",
              fontWeight: 500,
              letterSpacing: "0.16em",
              textTransform: "uppercase",
              border: "1px solid rgba(255,255,255,0.45)",
              cursor: "pointer",
              transition: "all 0.3s ease",
              backdropFilter: "blur(4px)",
              fontFamily: "'Poppins', sans-serif",
            }}
            onMouseEnter={(e) => {
              const el = e.currentTarget as HTMLElement;
              el.style.background = "rgba(255,255,255,0.08)";
              el.style.borderColor = "rgba(255,255,255,0.85)";
              el.style.transform = "translateY(-2px)";
            }}
            onMouseLeave={(e) => {
              const el = e.currentTarget as HTMLElement;
              el.style.background = "transparent";
              el.style.borderColor = "rgba(255,255,255,0.45)";
              el.style.transform = "translateY(0)";
            }}
          >
            <span style={{ fontSize: "0.95rem" }}>💐</span>
            Buka Buket Bunga
          </button>

          <button
            onClick={(e) => {
              const rect = e.currentTarget.getBoundingClientRect();
              fireConfetti(rect.left + rect.width / 2, rect.top);
            }}
            className="final-secondary-btn"
            style={{
              display: "inline-flex",
              alignItems: "center",
              justifyContent: "center",
              gap: "8px",
              padding: "clamp(12px, 2vw, 15px) clamp(18px, 3vw, 24px)",
              borderRadius: "4px",
              background: "transparent",
              color: "rgba(147,197,253,0.65)",
              fontSize: "clamp(0.78rem, 1.4vw, 0.88rem)",
              fontWeight: 400,
              letterSpacing: "0.12em",
              textTransform: "uppercase",
              border: "none",
              cursor: "pointer",
              transition: "color 0.25s ease, transform 0.25s ease",
              fontFamily: "'Poppins', sans-serif",
            }}
            onMouseEnter={(e) => {
              const el = e.currentTarget as HTMLElement;
              el.style.color = "rgba(251,191,36,0.85)";
              el.style.transform = "translateX(5px)";
            }}
            onMouseLeave={(e) => {
              const el = e.currentTarget as HTMLElement;
              el.style.color = "rgba(147,197,253,0.65)";
              el.style.transform = "translateX(0)";
            }}
          >
            <span>✦</span> Rayakan
          </button>
        </div>
      </div>

      {/* Vertical editorial sidebar text */}
      <div
        className="final-sidebar-text"
        style={{
          position: "absolute",
          right: "clamp(14px, 2.5vw, 36px)",
          top: "50%",
          transform: "translateY(-50%) rotate(90deg)",
          transformOrigin: "center center",
          fontSize: "0.58rem",
          letterSpacing: "0.38em",
          textTransform: "uppercase",
          color: "rgba(96,165,250,0.18)",
          fontFamily: "'Poppins', sans-serif",
          fontWeight: 400,
          whiteSpace: "nowrap",
          zIndex: 5,
          pointerEvents: "none",
        }}
      >
        25 · 08 · 2010 &nbsp;·&nbsp; Ratu Bunga Syakira &nbsp;·&nbsp; Birthday
      </div>

      <FlowerModal isOpen={showFlowerModal} onClose={() => setShowFlowerModal(false)} />

      <style>{`
        @media (max-width: 768px) {
          .final-sidebar-text {
            display: none !important;
          }
        }
        @media (max-width: 480px) {
          .final-cta-group {
            flex-direction: column !important;
            align-items: stretch !important;
          }
          .final-primary-btn,
          .final-secondary-btn {
            width: 100% !important;
          }
        }
      `}</style>
    </section>
  );
}
