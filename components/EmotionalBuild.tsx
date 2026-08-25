"use client";

import { useEffect, useRef, useState } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { SparkleIcon } from "./Icons";

gsap.registerPlugin(ScrollTrigger);

const WISH_PRESETS = [
  "✨ Sehat & Bahagia Selalu",
  "🌟 Makin Bersinar & Sukses",
  "💫 Semua Mimpimu Tercapai",
  "🌸 Senantiasa Membawa Kehangatan",
  "💖 Stay Sweet & Inspiring",
  "🎂 Happy Sweet Celebration!",
];

export default function EmotionalBuild() {
  const sectionRef = useRef<HTMLElement>(null);
  const line1Ref = useRef<HTMLParagraphElement>(null);
  const line2Ref = useRef<HTMLParagraphElement>(null);
  const buttonRef = useRef<HTMLDivElement>(null);
  const overlayRef = useRef<HTMLDivElement>(null);
  const imgRef = useRef<HTMLDivElement>(null);

  const [activeWishes, setActiveWishes] = useState<Array<{ id: number; text: string; x: number; y: number }>>([]);
  const [blown, setBlown] = useState(false);

  const handleMakeWish = (e: React.MouseEvent) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const clickX = e.clientX - rect.left;
    const clickY = e.clientY - rect.top;

    setBlown(true);
    const randomWish = WISH_PRESETS[Math.floor(Math.random() * WISH_PRESETS.length)];
    const newWish = {
      id: Date.now() + Math.random(),
      text: randomWish,
      x: clickX + (Math.random() - 0.5) * 60,
      y: clickY - 20,
    };

    setActiveWishes((prev) => [...prev, newWish]);

    setTimeout(() => {
      setActiveWishes((prev) => prev.filter((w) => w.id !== newWish.id));
    }, 2200);
  };

  useEffect(() => {
    const ctx = gsap.context(() => {
      const isMobile = window.innerWidth < 768;
      const tl = gsap.timeline({
        scrollTrigger: {
          trigger: sectionRef.current,
          start: "top top",
          end: isMobile ? "+=130%" : "+=220%",
          scrub: 1.6,
          pin: true,
          pinSpacing: true,
        },
      });

      // Slow video reveal + scale
      tl.fromTo(
        imgRef.current,
        { scale: 1.15, opacity: 0 },
        { scale: 1.02, opacity: 1, duration: 0.3, ease: "power2.out" }
      );

      // Light overlay deepens
      tl.fromTo(
        overlayRef.current,
        { opacity: 0.3 },
        { opacity: 0.72, duration: 0.2, ease: "power1.inOut" },
        "<"
      );

      // Line 1 fades in with smooth reveal
      tl.fromTo(
        line1Ref.current,
        { opacity: 0, y: 28 },
        { opacity: 1, y: 0, duration: 0.25, ease: "power2.out" },
        "+=0.06"
      );

      // Heartbeat pause
      tl.to({}, { duration: 0.18 });

      // Line 2 fades in
      tl.fromTo(
        line2Ref.current,
        { opacity: 0, y: 22 },
        { opacity: 1, y: 0, duration: 0.25, ease: "power2.out" },
        "+=0.04"
      );

      // Interactive Wish Box reveal
      tl.fromTo(
        buttonRef.current,
        { opacity: 0, scale: 0.9, y: 20 },
        { opacity: 1, scale: 1, y: 0, duration: 0.25, ease: "power2.out" },
        "+=0.05"
      );
    }, sectionRef);

    return () => ctx.revert();
  }, []);

  return (
    <section
      ref={sectionRef}
      id="emotional-build"
      style={{
        minHeight: "100svh",
        height: "100dvh",
        position: "relative",
        overflow: "hidden",
        background: "#edf4fc",
      }}
    >
      {/* Background video — landscape */}
      <div
        ref={imgRef}
        style={{ position: "absolute", inset: 0, opacity: 0, zIndex: 0, overflow: "hidden" }}
      >
        <video
          src="/img/ratu_snap.mp4"
          autoPlay
          loop
          muted
          playsInline
          style={{
            position: "absolute",
            top: "50%",
            left: "50%",
            width: "100vh",
            height: "100vw",
            objectFit: "cover",
            transform: "translate(-50%, -50%) rotate(-90deg)",
            transformOrigin: "center center",
          }}
        />
      </div>

      {/* Light soft sky blue overlay */}
      <div
        ref={overlayRef}
        style={{
          position: "absolute",
          inset: 0,
          background: "linear-gradient(180deg, rgba(244,248,253,0.78) 0%, rgba(237,244,252,0.65) 50%, rgba(219,234,254,0.85) 100%)",
          zIndex: 1,
        }}
      />

      {/* Sky blue glow center */}
      <div
        className="light-leak"
        style={{
          top: "30%",
          left: "50%",
          transform: "translateX(-50%)",
          width: "68%",
          height: "58%",
          background:
            "radial-gradient(circle, rgba(59,130,246,0.16) 0%, transparent 70%)",
          zIndex: 2,
        }}
      />

      {/* Film edge tag */}
      <div style={{ position: "absolute", top: "24px", left: "50%", transform: "translateX(-50%)", zIndex: 10 }}>
        <span className="film-edge">A WISH UPON THE STARS · 25.08.2010</span>
      </div>

      {/* Text block */}
      <div
        style={{
          position: "absolute",
          inset: 0,
          zIndex: 10,
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          textAlign: "center",
          padding: "0 clamp(1.2rem, 5vw, 4rem)",
          gap: "clamp(1rem, 2.5vw, 1.8rem)",
        }}
      >
        <p
          ref={line1Ref}
          className="font-display"
          style={{
            fontSize: "clamp(1.35rem, 4.2vw, 3.2rem)",
            fontStyle: "italic",
            fontWeight: 300,
            color: "#0f1d36",
            lineHeight: 1.4,
            textShadow: "0 2px 25px rgba(255,255,255,0.95)",
            opacity: 0,
          }}
        >
          &ldquo;Di setiap langkah perjalanan dan usiamu yang baru...&rdquo;
        </p>

        <p
          ref={line2Ref}
          className="font-display"
          style={{
            fontSize: "clamp(1.35rem, 4.2vw, 3.2rem)",
            fontStyle: "italic",
            fontWeight: 300,
            color: "#2563eb",
            lineHeight: 1.4,
            textShadow: "0 2px 25px rgba(255,255,255,0.95), 0 0 20px rgba(59,130,246,0.25)",
            opacity: 0,
          }}
        >
          &ldquo;...semoga semesta selalu memelukmu dengan hangat dan bahagia.&rdquo;
        </p>

        {/* Interactive Make a Wish Button */}
        <div ref={buttonRef} style={{ opacity: 0, marginTop: "0.6rem", position: "relative" }}>
          <button
            onClick={handleMakeWish}
            className="glass-panel wish-btn"
            style={{
              display: "inline-flex",
              alignItems: "center",
              gap: "8px",
              padding: "10px 22px",
              borderRadius: "30px",
              border: "1px solid rgba(59,130,246,0.35)",
              color: "#0f1d36",
              cursor: "pointer",
              fontSize: "clamp(0.8rem, 2.2vw, 0.88rem)",
              fontWeight: 500,
              letterSpacing: "0.04em",
              boxShadow: "0 8px 25px rgba(37,99,235,0.15)",
              transition: "transform 0.3s ease, box-shadow 0.3s ease",
            }}
            onMouseEnter={(e) => { (e.currentTarget as HTMLElement).style.transform = "scale(1.05)"; }}
            onMouseLeave={(e) => { (e.currentTarget as HTMLElement).style.transform = "scale(1)"; }}
          >
            <SparkleIcon size={16} color="#2563eb" />
            {blown ? "✨ Wish Sent! (Kirim Doa Lagi)" : "🎂 Kirim Doa & Make a Wish"}
          </button>

          {/* Floating wish badges */}
          {activeWishes.map((w) => (
            <div
              key={w.id}
              className="glass-panel"
              style={{
                position: "absolute",
                left: w.x,
                top: w.y,
                pointerEvents: "none",
                padding: "6px 12px",
                borderRadius: "20px",
                fontSize: "0.74rem",
                fontWeight: 600,
                color: "#2563eb",
                whiteSpace: "nowrap",
                border: "1px solid rgba(59,130,246,0.4)",
                boxShadow: "0 8px 20px rgba(59,130,246,0.3)",
                animation: "wishFloat 2.2s ease-out forwards",
                zIndex: 20,
              }}
            >
              {w.text}
            </div>
          ))}
        </div>
      </div>

      <style>{`
        @keyframes wishFloat {
          0%   { opacity: 0; transform: translate(-50%, 0) scale(0.8); }
          15%  { opacity: 1; transform: translate(-50%, -20px) scale(1.05); }
          80%  { opacity: 0.9; transform: translate(-50%, -80px) scale(1); }
          100% { opacity: 0; transform: translate(-50%, -120px) scale(0.9); }
        }
      `}</style>
    </section>
  );
}
