"use client";

import { useEffect, useState } from "react";
import { SparkleIcon } from "./Icons";

export default function ScrollGuideHint() {
  const [visible, setVisible] = useState(true);
  const [hasScrolled, setHasScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      // If user scrolls past 350px, gently fade the hint out
      if (window.scrollY > 350) {
        setVisible(false);
        setHasScrolled(true);
      } else if (!hasScrolled) {
        setVisible(true);
      }
    };

    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, [hasScrolled]);

  return (
    <div
      className={`scroll-guide-hint ${visible ? "is-visible" : "is-hidden"}`}
      style={{
        position: "fixed",
        bottom: "clamp(20px, 4vh, 32px)",
        left: "50%",
        transform: "translateX(-50%)",
        zIndex: 40,
        pointerEvents: "none",
        transition: "opacity 0.6s ease, transform 0.6s ease",
      }}
    >
      <div
        style={{
          display: "inline-flex",
          alignItems: "center",
          gap: "8px",
          padding: "8px 18px",
          borderRadius: "9999px",
          background: "rgba(10, 22, 44, 0.82)",
          backdropFilter: "blur(16px)",
          WebkitBackdropFilter: "blur(16px)",
          border: "1px solid rgba(147, 197, 253, 0.35)",
          boxShadow: "0 10px 25px -5px rgba(0, 0, 0, 0.4), 0 0 20px rgba(59, 130, 246, 0.25)",
          color: "#ffffff",
          fontSize: "clamp(0.72rem, 2.2vw, 0.8rem)",
          fontWeight: 400,
          letterSpacing: "0.03em",
          whiteSpace: "nowrap",
        }}
      >
        <span style={{ color: "#60a5fa", display: "flex", alignItems: "center" }}>
          <SparkleIcon size={13} color="#60a5fa" />
        </span>
        <span>
          Scroll perlahan ke bawah untuk membuka cerita...
        </span>
        <span
          style={{
            display: "inline-block",
            animation: "hintBounce 1.6s ease-in-out infinite",
            fontSize: "0.75rem",
            color: "#93c5fd",
            marginLeft: "2px",
          }}
        >
          ↓
        </span>
      </div>

      <style jsx>{`
        .scroll-guide-hint.is-visible {
          opacity: 1;
          transform: translateX(-50%) translateY(0);
        }
        .scroll-guide-hint.is-hidden {
          opacity: 0;
          transform: translateX(-50%) translateY(12px);
          pointer-events: none;
        }
        @keyframes hintBounce {
          0%, 100% {
            transform: translateY(0);
          }
          50% {
            transform: translateY(4px);
          }
        }
      `}</style>
    </div>
  );
}
