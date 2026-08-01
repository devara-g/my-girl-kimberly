"use client";

import { useEffect, useRef, useState } from "react";

interface LoadingScreenProps {
  onComplete?: () => void;
}

export default function LoadingScreen({ onComplete }: LoadingScreenProps) {
  const ref = useRef<HTMLDivElement>(null);
  const [gone, setGone] = useState(false);

  useEffect(() => {
    const t = setTimeout(() => {
      if (ref.current) {
        ref.current.style.opacity = "0";
        ref.current.style.transition = "opacity 1.2s cubic-bezier(0.4, 0, 0.2, 1)";
      }
      setTimeout(() => {
        setGone(true);
        onComplete?.();
      }, 1200);
    }, 2200);

    return () => clearTimeout(t);
  }, [onComplete]);

  if (gone) return null;

  return (
    <div
      ref={ref}
      style={{
        position: "fixed",
        inset: 0,
        zIndex: 99999,
        background: "#fffcf8",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        gap: "1.5rem",
      }}
    >
      {/* Pulsing Loading Rings */}
      <div style={{ position: "relative", width: "72px", height: "72px" }}>
        <div
          style={{
            position: "absolute",
            inset: 0,
            borderRadius: "50%",
            border: "1.5px solid rgba(244,63,94,0.2)",
            animation: "ping 2.2s cubic-bezier(0, 0, 0.2, 1) infinite",
          }}
        />
        <div
          style={{
            position: "absolute",
            inset: "8px",
            borderRadius: "50%",
            border: "1.5px solid rgba(244,63,94,0.4)",
            animation: "ping 2.2s cubic-bezier(0, 0, 0.2, 1) 0.4s infinite",
          }}
        />
        <div
          style={{
            position: "absolute",
            inset: "16px",
            borderRadius: "50%",
            background: "radial-gradient(circle, #f43f5e 0%, #be123c 100%)",
            boxShadow: "0 0 25px rgba(244,63,94,0.4)",
          }}
        />
      </div>

      <div style={{ textAlign: "center", display: "flex", flexDirection: "column", gap: "6px" }}>
        <span
          className="font-display"
          style={{
            fontSize: "1.4rem",
            fontStyle: "italic",
            letterSpacing: "0.08em",
            color: "#2b141e",
          }}
        >
          Unfolding Memories...
        </span>
        <span
          style={{
            fontSize: "0.65rem",
            letterSpacing: "0.3em",
            textTransform: "uppercase",
            color: "#be123c",
          }}
        >
          WE FELL IN LOVE IN OCTOBER
        </span>
      </div>

      <style>{`
        @keyframes ping {
          75%, 100% {
            transform: scale(2);
            opacity: 0;
          }
        }
      `}</style>
    </div>
  );
}
