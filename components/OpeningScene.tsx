"use client";

import { useEffect, useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

export default function OpeningScene() {
  const sectionRef  = useRef<HTMLElement>(null);
  const bgRef       = useRef<HTMLDivElement>(null);
  const line1Ref    = useRef<HTMLHeadingElement>(null);
  const line2Ref    = useRef<HTMLParagraphElement>(null);
  const dividerRef  = useRef<HTMLDivElement>(null);
  const line3Ref    = useRef<HTMLParagraphElement>(null);
  const line4Ref    = useRef<HTMLParagraphElement>(null);
  const petal1Ref   = useRef<HTMLDivElement>(null);
  const petal2Ref   = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const ctx = gsap.context(() => {
      const isMobile = window.innerWidth < 768;
      const tl = gsap.timeline({
        scrollTrigger: {
          trigger: sectionRef.current,
          start: "top top",
          end: isMobile ? "+=140%" : "+=240%",
          scrub: 1.5,
          pin: true,
          pinSpacing: true,
        },
      });

      // 1. Warm background blooms in
      tl.to(bgRef.current, { opacity: 1, duration: 0.25, ease: "power2.inOut" });

      // 2. Decorative petals drift in
      tl.fromTo(
        petal1Ref.current,
        { opacity: 0, x: -60, y: 20, rotate: -15 },
        { opacity: 0.55, x: 0, y: 0, rotate: 0, duration: 0.3, ease: "power2.out" },
        "-=0.1"
      );
      tl.fromTo(
        petal2Ref.current,
        { opacity: 0, x: 60, y: -20, rotate: 15 },
        { opacity: 0.55, x: 0, y: 0, rotate: 0, duration: 0.3, ease: "power2.out" },
        "<"
      );

      // 3. First lyric line blooms up
      tl.fromTo(
        line1Ref.current,
        { opacity: 0, y: 50, filter: "blur(14px)", scale: 0.95 },
        { opacity: 1, y: 0, filter: "blur(0px)", scale: 1, duration: 0.35, ease: "power3.out" },
        "+=0.05"
      );

      // 4. Second lyric line
      tl.fromTo(
        line2Ref.current,
        { opacity: 0, y: 30, filter: "blur(8px)" },
        { opacity: 1, y: 0, filter: "blur(0px)", duration: 0.28, ease: "power2.out" },
        "+=0.04"
      );

      // 5. Divider line
      tl.fromTo(
        dividerRef.current,
        { scaleX: 0, opacity: 0 },
        { scaleX: 1, opacity: 1, duration: 0.2, ease: "power2.out" },
        "+=0.06"
      );

      // 6. Third line (handwritten)
      tl.fromTo(
        line3Ref.current,
        { opacity: 0, y: 22 },
        { opacity: 1, y: 0, duration: 0.25, ease: "power2.out" },
        "+=0.04"
      );

      // 7. Fourth line fades in
      tl.fromTo(
        line4Ref.current,
        { opacity: 0, y: 18 },
        { opacity: 1, y: 0, duration: 0.2, ease: "power2.out" },
        "+=0.03"
      );
    }, sectionRef);

    return () => ctx.revert();
  }, []);

  return (
    <section
      ref={sectionRef}
      id="opening"
      style={{
        minHeight: "100svh",
        height: "100dvh",
        position: "relative",
        overflow: "hidden",
        background: "#f4f8fd",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
      }}
    >
      {/* Warm sky gradient background */}
      <div
        ref={bgRef}
        style={{
          position: "absolute",
          inset: 0,
          background:
            "radial-gradient(ellipse at 50% 40%, #dbeafe 0%, #edf4fc 40%, #f4f8fd 100%)",
          opacity: 0,
          zIndex: 0,
        }}
      />

      {/* Ambient Sky Blue Light Leaks */}
      <div
        className="light-leak"
        style={{
          top: "-20%",
          left: "10%",
          width: "65%",
          height: "70%",
          background: "radial-gradient(circle, rgba(59,130,246,0.14) 0%, transparent 70%)",
          zIndex: 1,
        }}
      />
      <div
        className="light-leak"
        style={{
          bottom: "-15%",
          right: "5%",
          width: "55%",
          height: "60%",
          background: "radial-gradient(circle, rgba(37,99,235,0.10) 0%, transparent 70%)",
          zIndex: 1,
        }}
      />

      {/* Film label top-left */}
      <div className="opening-top-left" style={{ position: "absolute", top: "24px", left: "28px", zIndex: 10 }}>
        <span className="film-edge">KODAK 400TX · SAFETY FILM</span>
      </div>

      {/* LED date top-right */}
      <div
        className="opening-top-right"
        style={{
          position: "absolute",
          top: "24px",
          right: "28px",
          zIndex: 10,
          display: "flex",
          alignItems: "center",
          gap: "8px",
        }}
      >
        <div
          style={{
            width: "7px",
            height: "7px",
            borderRadius: "50%",
            background: "#0284c7",
            boxShadow: "0 0 8px rgba(2,132,199,0.8)",
            animation: "recDot 1.8s ease-in-out infinite",
          }}
        />
        <span className="led-date">AUG 25, 2010 · A STAR WAS BORN</span>
      </div>

      {/* Decorative petal ornaments */}
      <div
        ref={petal1Ref}
        className="opening-petal petal-left"
        style={{
          position: "absolute",
          left: "clamp(10px, 6vw, 120px)",
          top: "50%",
          transform: "translateY(-50%)",
          zIndex: 2,
          opacity: 0,
          fontSize: "clamp(2.5rem, 6vw, 6rem)",
          lineHeight: 1,
          color: "rgba(59,130,246,0.18)",
          userSelect: "none",
          fontFamily: "serif",
          pointerEvents: "none",
        }}
      >
        ✿
      </div>
      <div
        ref={petal2Ref}
        className="opening-petal petal-right"
        style={{
          position: "absolute",
          right: "clamp(10px, 6vw, 120px)",
          top: "50%",
          transform: "translateY(-50%)",
          zIndex: 2,
          opacity: 0,
          fontSize: "clamp(2.5rem, 6vw, 6rem)",
          lineHeight: 1,
          color: "rgba(59,130,246,0.18)",
          userSelect: "none",
          fontFamily: "serif",
          pointerEvents: "none",
        }}
      >
        ✿
      </div>

      {/* ── Main Cinematic Text Block ── */}
      <div
        style={{
          position: "relative",
          zIndex: 10,
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          textAlign: "center",
          padding: "0 clamp(1.2rem, 6vw, 5rem)",
          maxWidth: "920px",
          width: "100%",
          gap: "0",
        }}
      >
        {/* Chapter eyebrow */}
        <span
          className="film-edge"
          style={{
            fontSize: "clamp(0.58rem, 1.2vw, 0.68rem)",
            letterSpacing: "0.28em",
            color: "#2563eb",
            marginBottom: "clamp(0.8rem, 2.5vw, 1.5rem)",
          }}
        >
          A SPECIAL TRIBUTE · RATU BUNGA SYAKIRA
        </span>

        {/* Main lyric — display serif italic */}
        <h1
          ref={line1Ref}
          className="font-display"
          style={{
            fontSize: "clamp(1.85rem, 5.2vw, 4.5rem)",
            fontWeight: 300,
            fontStyle: "italic",
            color: "#0f1d36",
            lineHeight: 1.25,
            letterSpacing: "-0.015em",
            opacity: 0,
            marginBottom: "0.3rem",
            textShadow: "0 4px 30px rgba(59,130,246,0.12)",
          }}
        >
          &ldquo;Di bawah teduhnya langit Agustus,
        </h1>
        <p
          ref={line2Ref}
          className="font-display"
          style={{
            fontSize: "clamp(1.85rem, 5.2vw, 4.5rem)",
            fontWeight: 300,
            fontStyle: "italic",
            color: "#2563eb",
            lineHeight: 1.25,
            letterSpacing: "-0.015em",
            opacity: 0,
            marginBottom: "clamp(1.2rem, 3vw, 2rem)",
            textShadow: "0 4px 30px rgba(37,99,235,0.18)",
          }}
        >
          Ratu Bunga Syakira hadir membawa cahaya.&rdquo;
        </p>

        {/* Decorative divider line with sky blue dot */}
        <div
          ref={dividerRef}
          style={{
            display: "flex",
            alignItems: "center",
            gap: "12px",
            width: "min(240px, 70%)",
            marginBottom: "clamp(1rem, 2.5vw, 1.6rem)",
            opacity: 0,
          }}
        >
          <div style={{ flex: 1, height: "1px", background: "linear-gradient(90deg, transparent, rgba(59,130,246,0.4))" }} />
          <div style={{ width: "6px", height: "6px", borderRadius: "50%", background: "#3b82f6", boxShadow: "0 0 8px rgba(59,130,246,0.6)" }} />
          <div style={{ flex: 1, height: "1px", background: "linear-gradient(90deg, rgba(59,130,246,0.4), transparent)" }} />
        </div>

        {/* Handwritten sub line */}
        <p
          ref={line3Ref}
          className="font-handwritten"
          style={{
            fontSize: "clamp(1.2rem, 2.8vw, 1.95rem)",
            color: "#2563eb",
            opacity: 0,
            lineHeight: 1.4,
            marginBottom: "0.25rem",
          }}
        >
          terima kasih telah tumbuh menjadi sosok yang luar biasa dan menginspirasi...
        </p>
        <p
          ref={line4Ref}
          className="font-handwritten"
          style={{
            fontSize: "clamp(0.95rem, 2vw, 1.35rem)",
            color: "#334e68",
            opacity: 0,
            lineHeight: 1.4,
          }}
        >
          — 25 Agustus 2010
        </p>
      </div>

      <style>{`
        @keyframes scrollPulse {
          0%, 100% { opacity: 0.3; transform: scaleY(0.8); }
          50%       { opacity: 1;   transform: scaleY(1.1); }
        }
        @keyframes recDot {
          0%, 100% { opacity: 1; }
          50%       { opacity: 0.3; }
        }

        @media (max-width: 640px) {
          .opening-top-left {
            top: 14px !important;
            left: 16px !important;
          }
          .opening-top-right {
            top: 14px !important;
            right: 16px !important;
          }
          .opening-petal {
            opacity: 0.1 !important;
            font-size: 2.2rem !important;
          }
        }
      `}</style>
    </section>
  );
}
