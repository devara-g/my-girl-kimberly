"use client";

import { useEffect, useRef } from "react";
import { CloseIcon } from "./Icons";

interface Props {
  isOpen: boolean;
  onClose: () => void;
}

/* ─── Path Helpers ─────────────────────────────────────────────────────────── */

// Organic petal path: grows from (0,0) upward to height h, width ±w
const petalPath = (h: number, w: number) =>
  `M 0 0 C ${-w} ${-h * 0.28} ${-w} ${-h * 0.85} 0 ${-h} C ${w} ${-h * 0.85} ${w} ${-h * 0.28} 0 0 Z`;

// Leaf path: symmetric teardrop going upward
const leafPath = (h: number, w: number) =>
  `M 0 0 C ${-w} ${-h * 0.22} ${-w * 1.1} ${-h * 0.75} 0 ${-h} C ${w * 1.1} ${-h * 0.75} ${w} ${-h * 0.22} 0 0 Z`;

/* ─── Sub-components ───────────────────────────────────────────────────────── */

interface RoseRing {
  count: number;
  h: number;
  w: number;
  grad: string;
  offset?: number;
}

function Rose({
  cx,
  cy,
  rings,
  delay,
}: {
  cx: number;
  cy: number;
  rings: RoseRing[];
  delay: number;
}) {
  return (
    <>
      {rings.map((ring, ri) => (
        <g key={ri}>
          {Array.from({ length: ring.count }, (_, pi) => {
            const angle =
              pi * (360 / ring.count) +
              (ring.offset ?? 0) +
              ri * (180 / ring.count);
            const ringDelay = delay + (rings.length - 1 - ri) * 0.28 + pi * 0.04;
            return (
              <g
                key={pi}
                transform={`translate(${cx},${cy}) rotate(${angle})`}
              >
                <path
                  d={petalPath(ring.h, ring.w)}
                  fill={`url(#${ring.grad})`}
                  style={{
                    transformBox: "fill-box" as const,
                    transformOrigin: "center 100%",
                    animation: `petalBloom 0.8s cubic-bezier(0.34, 1.56, 0.64, 1) ${ringDelay}s both`,
                  }}
                />
              </g>
            );
          })}
        </g>
      ))}
      {/* Rose center glow dot */}
      <circle
        cx={cx}
        cy={cy}
        r={rings[rings.length - 1]?.w ? rings[rings.length - 1].w * 0.55 : 4}
        fill="#bae6fd"
        style={{
          transformBox: "fill-box" as const,
          transformOrigin: "center center",
          animation: `centerBloom 0.45s ease-out ${delay + 0.95}s both`,
        }}
      />
    </>
  );
}

function Tulip({ cx, cy, delay }: { cx: number; cy: number; delay: number }) {
  const petals = [
    { angle: -28, h: 52, w: 13 },
    { angle: -14, h: 60, w: 12 },
    { angle: 0,   h: 64, w: 13 },
    { angle: 14,  h: 60, w: 12 },
    { angle: 28,  h: 52, w: 13 },
  ];
  return (
    <>
      {petals.map((p, i) => (
        <g key={i} transform={`translate(${cx},${cy}) rotate(${p.angle})`}>
          <path
            d={petalPath(p.h, p.w)}
            fill="url(#tulipGrad)"
            style={{
              transformBox: "fill-box" as const,
              transformOrigin: "center 100%",
              animation: `petalBloom 0.72s cubic-bezier(0.34, 1.56, 0.64, 1) ${delay + i * 0.07}s both`,
            }}
          />
        </g>
      ))}
      {/* Tulip stamen */}
      <circle
        cx={cx}
        cy={cy - 10}
        r={3}
        fill="#93c5fd"
        style={{
          transformBox: "fill-box" as const,
          transformOrigin: "center center",
          animation: `centerBloom 0.4s ease-out ${delay + 0.6}s both`,
        }}
      />
    </>
  );
}

function Leaf({
  tx, ty, rot, h, w, delay,
}: {
  tx: number; ty: number; rot: number; h: number; w: number; delay: number;
}) {
  return (
    <g transform={`translate(${tx},${ty}) rotate(${rot})`}>
      <path
        d={leafPath(h, w)}
        fill="url(#leafGrad)"
        style={{
          transformBox: "fill-box" as const,
          transformOrigin: "center 100%",
          animation: `leafUnfurl 0.8s cubic-bezier(0.34, 1.56, 0.64, 1) ${delay}s both`,
        }}
      />
      {/* Leaf midrib vein */}
      <line
        x1="0"
        y1="0"
        x2="0"
        y2={-h * 0.9}
        stroke="rgba(56,189,248,0.4)"
        strokeWidth="1"
        style={{
          animation: `leafUnfurl 0.8s ease-out ${delay + 0.05}s both`,
          transformBox: "fill-box" as const,
          transformOrigin: "center 100%",
        }}
      />
    </g>
  );
}

/* ─── Baby's Breath positions ──────────────────────────────────────────────── */
const BABIES: [number, number, number][] = [
  [118, 198, 3.2], [107, 228, 2.5], [96, 212, 2.2], [128, 168, 3],
  [152, 148, 2.8], [172, 132, 2], [200, 138, 3.5], [228, 132, 2],
  [248, 148, 2.8], [272, 168, 3], [292, 212, 2.2], [303, 228, 2.5],
  [282, 198, 3.2], [175, 168, 2], [225, 168, 2], [200, 152, 2.5],
];

/* ─── Main Modal Component ─────────────────────────────────────────────────── */

export default function FlowerModal({ isOpen, onClose }: Props) {
  const closeBtnRef = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    const down = (e: KeyboardEvent) => e.key === "Escape" && onClose();
    if (isOpen) {
      window.addEventListener("keydown", down);
      setTimeout(() => closeBtnRef.current?.focus(), 120);
    }
    return () => window.removeEventListener("keydown", down);
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-label="A birthday bouquet of flowers for Ratu Bunga Syakira"
      onClick={onClose}
      style={{
        position: "fixed",
        inset: 0,
        zIndex: 999999,
        background: "rgba(5,12,30,0.94)",
        backdropFilter: "blur(28px)",
        WebkitBackdropFilter: "blur(28px)",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        padding: "20px",
        animation: "backdropIn 0.38s ease",
        overflow: "hidden",
      }}
    >
      {/* ── Centre Modal Card ── */}
      <div
        onClick={(e) => e.stopPropagation()}
        style={{
          maxWidth: "440px",
          width: "100%",
          background:
            "linear-gradient(170deg, #0b1938 0%, #060e22 55%, #08142c 100%)",
          borderRadius: "24px",
          border: "1px solid rgba(59,130,246,0.45)",
          boxShadow:
            "0 0 100px rgba(59,130,246,0.28), 0 0 40px rgba(37,99,235,0.2), 0 35px 70px rgba(0,0,0,0.75), inset 0 1px 0 rgba(255,255,255,0.08)",
          animation: "modalIn 0.52s cubic-bezier(0.34, 1.56, 0.64, 1)",
          position: "relative",
          overflow: "hidden",
          flexShrink: 0,
        }}
      >
        {/* Corner sparkle glow */}
        <div
          style={{
            position: "absolute",
            top: "-30px",
            right: "-30px",
            width: "130px",
            height: "130px",
            background:
              "radial-gradient(circle, rgba(59,130,246,0.35) 0%, transparent 70%)",
            pointerEvents: "none",
          }}
        />
        <div
          style={{
            position: "absolute",
            bottom: "-30px",
            left: "-30px",
            width: "110px",
            height: "110px",
            background:
              "radial-gradient(circle, rgba(2,132,199,0.25) 0%, transparent 70%)",
            pointerEvents: "none",
          }}
        />

        {/* Close button */}
        <button
          ref={closeBtnRef}
          onClick={onClose}
          aria-label="Close bouquet"
          style={{
            position: "absolute",
            top: "14px",
            right: "14px",
            zIndex: 20,
            width: "34px",
            height: "34px",
            borderRadius: "50%",
            background: "rgba(59,130,246,0.15)",
            border: "1px solid rgba(59,130,246,0.4)",
            color: "rgba(224,242,254,0.9)",
            cursor: "pointer",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            transition: "background 0.2s, transform 0.15s",
          }}
          onMouseEnter={(e) => {
            (e.currentTarget as HTMLElement).style.background =
              "rgba(59,130,246,0.35)";
            (e.currentTarget as HTMLElement).style.transform = "scale(1.1)";
          }}
          onMouseLeave={(e) => {
            (e.currentTarget as HTMLElement).style.background =
              "rgba(59,130,246,0.15)";
            (e.currentTarget as HTMLElement).style.transform = "scale(1)";
          }}
        >
          <CloseIcon size={14} />
        </button>

        {/* ── BOUQUET SVG ─────────────────────────────────────── */}
        <svg
          viewBox="0 0 400 400"
          width="100%"
          height="330"
          style={{ display: "block", overflow: "visible" }}
          role="img"
          aria-label="Animated blooming flower bouquet"
        >
          <defs>
            {/* Rose — Royal Sapphire Blue */}
            <radialGradient id="fm-deep" cx="32%" cy="28%" r="68%">
              <stop offset="0%" stopColor="#93c5fd" />
              <stop offset="42%" stopColor="#2563eb" />
              <stop offset="100%" stopColor="#1e3a8a" />
            </radialGradient>
            {/* Rose — Soft Powder Baby Blue */}
            <radialGradient id="fm-blush" cx="32%" cy="28%" r="68%">
              <stop offset="0%" stopColor="#e0f2fe" />
              <stop offset="44%" stopColor="#60a5fa" />
              <stop offset="100%" stopColor="#1d4ed8" />
            </radialGradient>
            {/* Rose inner — Icy Cloud */}
            <radialGradient id="fm-cream" cx="35%" cy="30%" r="68%">
              <stop offset="0%" stopColor="#ffffff" />
              <stop offset="50%" stopColor="#dbeafe" />
              <stop offset="100%" stopColor="#93c5fd" />
            </radialGradient>
            {/* Tulip — Electric Sky Blue */}
            <radialGradient id="tulipGrad" cx="32%" cy="28%" r="68%">
              <stop offset="0%" stopColor="#bae6fd" />
              <stop offset="40%" stopColor="#0284c7" />
              <stop offset="100%" stopColor="#0369a1" />
            </radialGradient>
            {/* Leaf — Sage / Teal */}
            <linearGradient id="leafGrad" x1="0%" y1="0%" x2="75%" y2="100%">
              <stop offset="0%" stopColor="#38bdf8" />
              <stop offset="100%" stopColor="#0f766e" />
            </linearGradient>
            {/* Ambient glow behind bouquet */}
            <radialGradient id="glowAmbient" cx="50%" cy="50%" r="50%">
              <stop offset="0%" stopColor="rgba(59,130,246,0.45)" />
              <stop offset="60%" stopColor="rgba(37,99,235,0.12)" />
              <stop offset="100%" stopColor="rgba(59,130,246,0)" />
            </radialGradient>
            {/* Soft drop-shadow filter on flowers */}
            <filter id="petalGlow" x="-30%" y="-30%" width="160%" height="160%">
              <feGaussianBlur in="SourceAlpha" stdDeviation="4" result="blur" />
              <feFlood floodColor="#3b82f6" floodOpacity="0.5" result="clr" />
              <feComposite in="clr" in2="blur" operator="in" result="glow" />
              <feMerge>
                <feMergeNode in="glow" />
                <feMergeNode in="SourceGraphic" />
              </feMerge>
            </filter>
            {/* Baby's breath glow */}
            <filter id="babyGlow" x="-80%" y="-80%" width="360%" height="360%">
              <feGaussianBlur in="SourceGraphic" stdDeviation="2" result="blur" />
              <feMerge>
                <feMergeNode in="blur" />
                <feMergeNode in="SourceGraphic" />
              </feMerge>
            </filter>
          </defs>

          {/* Ambient glow behind flowers */}
          <ellipse
            cx="200"
            cy="230"
            rx="165"
            ry="110"
            fill="url(#glowAmbient)"
            opacity="0.45"
          />

          {/* ─── STEMS ─────────────────────────────────────────────── */}
          {/* Center */}
          <path
            d="M 200 395 L 200 195"
            stroke="#0d9488"
            strokeWidth="4.5"
            fill="none"
            strokeLinecap="round"
            style={{
              strokeDasharray: 210,
              strokeDashoffset: 210,
              animation: "stemGrow 0.9s ease-out 0.08s forwards",
            }}
          />
          {/* Left center */}
          <path
            d="M 196 395 Q 172 340 146 218"
            stroke="#0d9488"
            strokeWidth="3.8"
            fill="none"
            strokeLinecap="round"
            style={{
              strokeDasharray: 225,
              strokeDashoffset: 225,
              animation: "stemGrow 0.9s ease-out 0.14s forwards",
            }}
          />
          {/* Right center */}
          <path
            d="M 204 395 Q 228 340 254 218"
            stroke="#0d9488"
            strokeWidth="3.8"
            fill="none"
            strokeLinecap="round"
            style={{
              strokeDasharray: 225,
              strokeDashoffset: 225,
              animation: "stemGrow 0.9s ease-out 0.14s forwards",
            }}
          />
          {/* Far left */}
          <path
            d="M 188 395 Q 148 368 88 262"
            stroke="#0d9488"
            strokeWidth="3.2"
            fill="none"
            strokeLinecap="round"
            style={{
              strokeDasharray: 210,
              strokeDashoffset: 210,
              animation: "stemGrow 0.85s ease-out 0.2s forwards",
            }}
          />
          {/* Far right */}
          <path
            d="M 212 395 Q 252 368 312 262"
            stroke="#0d9488"
            strokeWidth="3.2"
            fill="none"
            strokeLinecap="round"
            style={{
              strokeDasharray: 210,
              strokeDashoffset: 210,
              animation: "stemGrow 0.85s ease-out 0.2s forwards",
            }}
          />

          {/* ─── LEAVES ────────────────────────────────────────────── */}
          <Leaf tx={178} ty={338} rot={-48} h={68} w={16} delay={0.65} />
          <Leaf tx={222} ty={338} rot={48}  h={68} w={16} delay={0.70} />
          <Leaf tx={158} ty={285} rot={-62} h={50} w={12} delay={0.85} />
          <Leaf tx={242} ty={285} rot={62}  h={50} w={12} delay={0.90} />
          <Leaf tx={125} ty={248} rot={-72} h={36} w={9}  delay={1.00} />
          <Leaf tx={275} ty={248} rot={72}  h={36} w={9}  delay={1.05} />

          {/* ─── TULIPS ────────────────────────────────────────────── */}
          <g filter="url(#petalGlow)">
            <Tulip cx={88}  cy={258} delay={0.60} />
            <Tulip cx={312} cy={258} delay={0.65} />
          </g>

          {/* ─── SIDE ROSES (Soft Powder Blue) ─────────────────────── */}
          <g filter="url(#petalGlow)">
            <Rose
              cx={146} cy={208}
              rings={[
                { count: 8, h: 30, w: 10, grad: "fm-blush", offset: 8 },
                { count: 5, h: 19, w:  7, grad: "fm-cream",  offset: 0 },
              ]}
              delay={1.00}
            />
            <Rose
              cx={254} cy={208}
              rings={[
                { count: 8, h: 30, w: 10, grad: "fm-blush", offset: 8 },
                { count: 5, h: 19, w:  7, grad: "fm-cream",  offset: 0 },
              ]}
              delay={1.08}
            />
          </g>

          {/* ─── CENTER ROSE (Royal Sapphire Blue) ─────────────────── */}
          <g filter="url(#petalGlow)">
            <Rose
              cx={200} cy={188}
              rings={[
                { count: 10, h: 40, w: 14, grad: "fm-deep",  offset: 0  },
                { count:  8, h: 28, w: 10, grad: "fm-deep",  offset: 16 },
                { count:  6, h: 17, w:  7, grad: "fm-blush", offset: 0  },
              ]}
              delay={1.28}
            />
          </g>

          {/* ─── BABY'S BREATH ─────────────────────────────────────── */}
          <g filter="url(#babyGlow)">
            {BABIES.map(([bx, by, br], bi) => (
              <circle
                key={bi}
                cx={bx}
                cy={by}
                r={br}
                fill="rgba(240,249,255,0.96)"
                style={{
                  transformBox: "fill-box" as const,
                  transformOrigin: "center center",
                  animation: `sparkle 0.55s ease-out ${1.85 + bi * 0.055}s both`,
                }}
              />
            ))}
          </g>

          {/* ─── RIBBON at base ────────────────────────────────────── */}
          <path
            d="M 162 372 Q 200 363 238 372 Q 225 382 200 385 Q 175 382 162 372 Z"
            fill="rgba(59,130,246,0.65)"
            style={{
              animation: "leafUnfurl 0.6s ease-out 0.5s both",
              transformBox: "fill-box" as const,
              transformOrigin: "center 100%",
            }}
          />
          <path
            d="M 165 372 Q 155 360 162 352 Q 170 365 200 362 Q 230 365 238 352 Q 245 360 235 372 Q 217 378 200 380 Q 183 378 165 372 Z"
            fill="rgba(37,99,235,0.45)"
            style={{
              animation: "leafUnfurl 0.6s ease-out 0.5s both",
              transformBox: "fill-box" as const,
              transformOrigin: "center 100%",
            }}
          />
        </svg>

        {/* ── MESSAGE ──────────────────────────────────────────── */}
        <div
          style={{
            textAlign: "center",
            padding: "4px 32px 32px",
            position: "relative",
            zIndex: 10,
          }}
        >
          <div
            style={{
              width: "64px",
              height: "1px",
              background:
                "linear-gradient(90deg, transparent, #3b82f6, transparent)",
              margin: "0 auto 18px",
            }}
          />
          <p
            className="font-display"
            style={{
              fontSize: "clamp(1.15rem, 3.5vw, 1.55rem)",
              fontStyle: "italic",
              fontWeight: 300,
              color: "rgba(224,242,254,0.98)",
              lineHeight: 1.65,
              letterSpacing: "0.01em",
            }}
          >
            &ldquo;Happy Birthday, Ratu Bunga Syakira&rdquo;
          </p>
          <p
            className="font-handwritten"
            style={{
              fontSize: "clamp(1rem, 2.5vw, 1.2rem)",
              color: "rgba(186,230,253,0.75)",
              marginTop: "10px",
              lineHeight: 1.6,
            }}
          >
            semoga harimu selalu dipenuhi cinta, tawa ceria, dan mimpi indah yang mekar sempurna ♡
          </p>
        </div>
      </div>

      {/* ── KEYFRAMES ────────────────────────────────────────────── */}
      <style>{`
        @keyframes backdropIn {
          from { opacity: 0; }
          to   { opacity: 1; }
        }
        @keyframes modalIn {
          0%   { transform: scale(0.78) translateY(40px); opacity: 0; }
          100% { transform: scale(1)    translateY(0);    opacity: 1; }
        }
        @keyframes stemGrow {
          to { stroke-dashoffset: 0; }
        }
        @keyframes petalBloom {
          0%   { transform: scaleX(0) scaleY(0); opacity: 0; }
          58%  { transform: scaleX(1.1) scaleY(1.12); opacity: 1; }
          100% { transform: scaleX(1) scaleY(1); opacity: 1; }
        }
        @keyframes centerBloom {
          0%   { transform: scale(0); opacity: 0; }
          68%  { transform: scale(1.6); opacity: 1; }
          100% { transform: scale(1); opacity: 1; }
        }
        @keyframes leafUnfurl {
          0%   { transform: scaleX(0) scaleY(0); opacity: 0; }
          60%  { transform: scaleX(1.08) scaleY(1.1); opacity: 1; }
          100% { transform: scaleX(1) scaleY(1); opacity: 1; }
        }
        @keyframes sparkle {
          0%   { transform: scale(0); opacity: 0; }
          52%  { transform: scale(1.5); opacity: 1; }
          100% { transform: scale(1); opacity: 0.92; }
        }
      `}</style>
    </div>
  );
}
