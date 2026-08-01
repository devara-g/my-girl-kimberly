"use client";

import { useEffect, useRef, useState } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import dynamic from "next/dynamic";
import { HeartSolidIcon } from "./Icons";
import FlowerModal from "./FlowerModal";

const StarryNight = dynamic(() => import("./StarryNight"), { ssr: false });

gsap.registerPlugin(ScrollTrigger);

export default function FinalScene() {
  const sectionRef = useRef<HTMLElement>(null);
  const line1Ref   = useRef<HTMLHeadingElement>(null);
  const line2Ref   = useRef<HTMLParagraphElement>(null);
  const line3Ref   = useRef<HTMLParagraphElement>(null);
  const noteRef    = useRef<HTMLParagraphElement>(null);
  const heartRef   = useRef<HTMLDivElement>(null);
  const bgRef      = useRef<HTMLDivElement>(null);

  const [heartsCount, setHeartsCount] = useState<Array<{ id: number; x: number; y: number }>>([]);
  const [showFlowerModal, setShowFlowerModal] = useState(false);

  const triggerHeartBurst = (e: React.MouseEvent) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const clickX = e.clientX - rect.left;
    const clickY = e.clientY - rect.top;

    const newHearts = Array.from({ length: 12 }, (_, i) => ({
      id: Date.now() + i,
      x: clickX + (Math.random() - 0.5) * 80,
      y: clickY + (Math.random() - 0.5) * 80,
    }));

    setHeartsCount((prev) => [...prev, ...newHearts]);
    setShowFlowerModal(true);

    setTimeout(() => {
      setHeartsCount((prev) => prev.filter((h) => !newHearts.some((nh) => nh.id === h.id)));
    }, 1400);
  };

  useEffect(() => {
    const ctx = gsap.context(() => {
      // Background fade-in
      gsap.fromTo(
        bgRef.current,
        { opacity: 0 },
        {
          opacity: 1,
          duration: 1.6,
          ease: "power2.out",
          scrollTrigger: {
            trigger: sectionRef.current,
            start: "top 80%",
          },
        }
      );

      // Line 1 Title Reveal
      gsap.fromTo(
        line1Ref.current,
        { opacity: 0, y: 50, filter: "blur(14px)", scale: 0.92 },
        {
          opacity: 1,
          y: 0,
          filter: "blur(0px)",
          scale: 1,
          duration: 1.8,
          ease: "power3.out",
          scrollTrigger: {
            trigger: sectionRef.current,
            start: "top 65%",
          },
        }
      );

      // Line 2
      gsap.fromTo(
        line2Ref.current,
        { opacity: 0, y: 30, filter: "blur(8px)" },
        {
          opacity: 1,
          y: 0,
          filter: "blur(0px)",
          duration: 1.4,
          ease: "power2.out",
          delay: 0.35,
          scrollTrigger: {
            trigger: sectionRef.current,
            start: "top 55%",
          },
        }
      );

      // Line 3
      gsap.fromTo(
        line3Ref.current,
        { opacity: 0, y: 24, filter: "blur(6px)" },
        {
          opacity: 1,
          y: 0,
          filter: "blur(0px)",
          duration: 1.2,
          ease: "power2.out",
          delay: 0.7,
          scrollTrigger: {
            trigger: sectionRef.current,
            start: "top 50%",
          },
        }
      );

      // Handwritten closing sign-off
      gsap.fromTo(
        noteRef.current,
        { opacity: 0, y: 18 },
        {
          opacity: 1,
          y: 0,
          duration: 1.2,
          delay: 1.0,
          ease: "power2.out",
          scrollTrigger: {
            trigger: sectionRef.current,
            start: "top 48%",
          },
        }
      );

      // Pulsing Heart
      gsap.fromTo(
        heartRef.current,
        { opacity: 0, scale: 0 },
        {
          opacity: 1,
          scale: 1,
          duration: 1.2,
          ease: "elastic.out(1, 0.5)",
          delay: 1.3,
          scrollTrigger: {
            trigger: sectionRef.current,
            start: "top 45%",
          },
        }
      );
    }, sectionRef);

    return () => ctx.revert();
  }, []);

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
        background: "linear-gradient(180deg, #faf0ea 0%, #fce7eb 45%, #fff5f7 100%)",
      }}
    >
      {/* Starry night canvas background */}
      <div
        ref={bgRef}
        style={{
          position: "absolute",
          inset: 0,
          zIndex: 0,
          opacity: 0,
        }}
      >
        <StarryNight />

        {/* Ambient deep romantic rose lighting */}
        <div
          className="light-leak"
          style={{
            top: "20%",
            left: "50%",
            transform: "translateX(-50%)",
            width: "75%",
            height: "65%",
            background:
              "radial-gradient(circle, rgba(244,63,94,0.18) 0%, transparent 75%)",
            filter: "blur(95px)",
          }}
        />
      </div>

      {/* Content */}
      <div
        style={{
          position: "relative",
          zIndex: 10,
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          textAlign: "center",
          gap: "clamp(1.2rem, 3vw, 2rem)",
          padding: "clamp(3rem, 8vh, 6rem) clamp(1.5rem, 6vw, 4rem)",
          maxWidth: "850px",
        }}
      >
        <span className="film-edge" style={{ letterSpacing: "0.3em" }}>
          SWEET MEMORIES · FOREVER &amp; ALWAYS
        </span>

        <h1
          ref={line1Ref}
          className="font-display"
          style={{
            fontSize: "clamp(2.5rem, 8vw, 5.6rem)",
            fontWeight: 500,
            fontStyle: "italic",
            color: "#2b141e",
            lineHeight: 1.2,
            letterSpacing: "-0.01em",
            textShadow: "0 0 40px rgba(244,63,94,0.25)",
            opacity: 0,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            gap: "0.35em",
            flexWrap: "wrap",
          }}
        >
          Happy Girlfriend Day
          <HeartSolidIcon
            size={56}
            color="#f43f5e"
            style={{
              filter: "drop-shadow(0 0 14px rgba(244,63,94,0.5))",
              animation: "heartPulse 2s ease-in-out infinite",
            }}
          />
        </h1>

        <div className="chapter-line" style={{ width: "80px" }} />

        <p
          ref={line2Ref}
          className="font-display"
          style={{
            fontSize: "clamp(1.1rem, 2.9vw, 1.8rem)",
            fontWeight: 300,
            fontStyle: "italic",
            color: "#2b141e",
            lineHeight: 1.8,
            letterSpacing: "0.02em",
            opacity: 0,
          }}
        >
          Thank you for every smile, every laugh, every little memory.
        </p>

        <p
          ref={line3Ref}
          className="font-display"
          style={{
            fontSize: "clamp(1rem, 2.5vw, 1.5rem)",
            fontWeight: 300,
            fontStyle: "italic",
            color: "#5c2e40",
            lineHeight: 1.8,
            letterSpacing: "0.02em",
            opacity: 0,
          }}
        >
          I hope this is only the beginning of many more memories.
        </p>

        <p
          ref={noteRef}
          className="font-handwritten"
          style={{
            fontSize: "clamp(1.4rem, 3vw, 2.3rem)",
            color: "#be123c",
            marginTop: "0.4rem",
            opacity: 0,
          }}
        >
          my heart belongs to you, today and forever...
        </p>

        {/* Interactive Pulsing Heart — opens Flower Modal */}
        <div
          ref={heartRef}
          onClick={triggerHeartBurst}
          className="heart-pulse"
          style={{
            fontSize: "clamp(2.4rem, 6vw, 3.8rem)",
            marginTop: "0.6rem",
            position: "relative",
            userSelect: "none",
            opacity: 0,
            cursor: "pointer",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
          }}
          title="Click to open a bouquet of love!"
          aria-label="Open love bouquet"
          role="button"
          tabIndex={0}
          onKeyDown={(e) => e.key === "Enter" && triggerHeartBurst(e as unknown as React.MouseEvent)}
        >
          <HeartSolidIcon
            size={72}
            color="#f43f5e"
            style={{
              filter: "drop-shadow(0 0 20px rgba(244,63,94,0.5))",
            }}
          />
          {/* Burst heart particles */}
          {heartsCount.map((h) => (
            <span
              key={h.id}
              style={{
                position: "absolute",
                left: h.x,
                top: h.y,
                pointerEvents: "none",
                animation: "heartFloat 1.2s ease-out forwards",
                filter: "drop-shadow(0 0 8px rgba(244,63,94,0.6))",
                display: "flex",
              }}
            >
              <HeartSolidIcon size={20} color="#f43f5e" />
            </span>
          ))}
        </div>

        <span style={{ fontSize: "0.65rem", letterSpacing: "0.2em", color: "#be123c", textTransform: "uppercase" }}>
          tap the heart for a surprise
        </span>
      </div>

      {/* Flower Bouquet Modal */}
      <FlowerModal isOpen={showFlowerModal} onClose={() => setShowFlowerModal(false)} />

      <style>{`
        @keyframes heartFloat {
          0%   { opacity: 1; transform: translateY(0) scale(1); }
          100% { opacity: 0; transform: translateY(-70px) scale(1.7); }
        }
        @keyframes heartPulse {
          0%, 100% { transform: scale(1); }
          50%       { transform: scale(1.12); }
        }
      `}</style>
    </section>
  );
}
