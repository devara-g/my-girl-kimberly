"use client";

import { useEffect, useRef } from "react";
import Image from "next/image";
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
  // Render outer rings first (behind), inner rings last (on top)
  return (
    <>
      {rings.map((ring, ri) => (
        <g key={ri}>
          {Array.from({ length: ring.count }, (_, pi) => {
            const angle =
              pi * (360 / ring.count) +
              (ring.offset ?? 0) +
              ri * (180 / ring.count);
            // inner rings bloom first
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
        fill="#ffccd5"
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
        fill="#ffb3d4"
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
        stroke="rgba(80,160,110,0.4)"
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
  // [cx, cy, radius]
  [118, 198, 3.2], [107, 228, 2.5], [96, 212, 2.2], [128, 168, 3],
  [152, 148, 2.8], [172, 132, 2], [200, 138, 3.5], [228, 132, 2],
  [248, 148, 2.8], [272, 168, 3], [292, 212, 2.2], [303, 228, 2.5],
  [282, 198, 3.2], [175, 168, 2], [225, 168, 2], [200, 152, 2.5],
];

/* ─── Main Component ───────────────────────────────────────────────────────── */
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

  const LEFT_PHOTOS  = [
    { src: "/img/G-ip79SbQAMdqZX.jpg", rotate: "-5deg",  delay: "3.0s" },
    { src: "/img/G5XU67QbYAATumz.jpg", rotate: "-2deg",  delay: "3.4s" },
    { src: "/img/kimmy JKT48 (2).jpg", rotate: "-4deg",  delay: "3.8s" },
  ];
  const RIGHT_PHOTOS = [
    { src: "/img/HBSrsfvb0AEsOB-.jpg", rotate: "4deg",  delay: "3.2s" },
    { src: "/img/HF82lq0aEAEcBAe.jpg", rotate: "6deg",  delay: "3.6s" },
    { src: "/img/G5XU68SbMAEoFqg.jpg", rotate: "3deg",  delay: "4.0s" },
  ];

  const PhotoCard = ({ src, rotate, delay }: { src: string; rotate: string; delay: string }) => (
    <div
      onClick={(e) => e.stopPropagation()}
      style={{
        width: "clamp(90px, 10vw, 148px)",
        background: "#fff",
        borderRadius: "3px",
        padding: "5px 5px 24px",
        boxShadow: "0 6px 28px rgba(0,0,0,0.55), 0 2px 8px rgba(244,63,94,0.2)",
        transform: `rotate(${rotate})`,
        animation: `photoReveal 0.5s cubic-bezier(0.34,1.56,0.64,1) ${delay} both`,
        flexShrink: 0,
        cursor: "default",
      }}
    >
      <div style={{ position: "relative", width: "100%", aspectRatio: "3/4", overflow: "hidden", borderRadius: "1px" }}>
        <Image src={src} alt="a memory" fill style={{ objectFit: "cover", objectPosition: "center top" }} sizes="148px" />
      </div>
      <p style={{ margin: "5px 0 0", textAlign: "center", fontSize: "0.48rem", letterSpacing: "0.1em", color: "#be123c", fontFamily: "monospace" }}>
        ✦ with love
      </p>
    </div>
  );

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-label="A bouquet of flowers, just for you"
      onClick={onClose}
      style={{
        position: "fixed",
        inset: 0,
        zIndex: 999999,
        background: "rgba(8,2,18,0.94)",
        backdropFilter: "blur(28px)",
        WebkitBackdropFilter: "blur(28px)",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        gap: "clamp(12px, 2.5vw, 32px)",
        padding: "20px",
        animation: "backdropIn 0.38s ease",
        overflow: "hidden",
      }}
    >
      {/* Left photo column */}
      <div
        style={{
          display: "flex",
          flexDirection: "column",
          gap: "clamp(10px, 1.8vh, 20px)",
          alignItems: "flex-end",
          flexShrink: 0,
        }}
      >
        {LEFT_PHOTOS.map((p, i) => <PhotoCard key={i} {...p} />)}
      </div>

      {/* ── Centre Modal Card ── */}
      <div
        onClick={(e) => e.stopPropagation()}
        style={{
          maxWidth: "400px",
          width: "100%",
          background:
            "linear-gradient(170deg, #160430 0%, #0d0220 55%, #110328 100%)",
          borderRadius: "24px",
          border: "1px solid rgba(244,63,94,0.4)",
          boxShadow:
            "0 0 100px rgba(244,63,94,0.28), 0 0 40px rgba(180,20,80,0.2), 0 35px 70px rgba(0,0,0,0.75), inset 0 1px 0 rgba(255,255,255,0.06)",
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
              "radial-gradient(circle, rgba(244,63,94,0.35) 0%, transparent 70%)",
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
              "radial-gradient(circle, rgba(180,20,120,0.25) 0%, transparent 70%)",
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
            background: "rgba(244,63,94,0.12)",
            border: "1px solid rgba(244,63,94,0.35)",
            color: "rgba(254,205,211,0.85)",
            cursor: "pointer",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            transition: "background 0.2s, transform 0.15s",
          }}
          onMouseEnter={(e) => {
            (e.currentTarget as HTMLElement).style.background =
              "rgba(244,63,94,0.28)";
            (e.currentTarget as HTMLElement).style.transform = "scale(1.1)";
          }}
          onMouseLeave={(e) => {
            (e.currentTarget as HTMLElement).style.background =
              "rgba(244,63,94,0.12)";
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
            {/* Rose — deep crimson */}
            <radialGradient id="fm-deep" cx="32%" cy="28%" r="68%">
              <stop offset="0%" stopColor="#ff8fa6" />
              <stop offset="42%" stopColor="#c01845" />
              <stop offset="100%" stopColor="#76001c" />
            </radialGradient>
            {/* Rose — blush pink */}
            <radialGradient id="fm-blush" cx="32%" cy="28%" r="68%">
              <stop offset="0%" stopColor="#ffd6ea" />
              <stop offset="44%" stopColor="#e0527c" />
              <stop offset="100%" stopColor="#9e224c" />
            </radialGradient>
            {/* Rose inner — cream */}
            <radialGradient id="fm-cream" cx="35%" cy="30%" r="68%">
              <stop offset="0%" stopColor="#fff5f9" />
              <stop offset="50%" stopColor="#ffc8d8" />
              <stop offset="100%" stopColor="#e8829e" />
            </radialGradient>
            {/* Tulip — magenta */}
            <radialGradient id="tulipGrad" cx="32%" cy="28%" r="68%">
              <stop offset="0%" stopColor="#ffb3d9" />
              <stop offset="40%" stopColor="#e91e8c" />
              <stop offset="100%" stopColor="#880058" />
            </radialGradient>
            {/* Leaf */}
            <linearGradient id="leafGrad" x1="0%" y1="0%" x2="75%" y2="100%">
              <stop offset="0%" stopColor="#56bf92" />
              <stop offset="100%" stopColor="#1b4332" />
            </linearGradient>
            {/* Ambient glow behind bouquet */}
            <radialGradient id="glowAmbient" cx="50%" cy="50%" r="50%">
              <stop offset="0%" stopColor="rgba(244,63,94,0.45)" />
              <stop offset="60%" stopColor="rgba(180,20,90,0.12)" />
              <stop offset="100%" stopColor="rgba(244,63,94,0)" />
            </radialGradient>
            {/* Soft drop-shadow filter on flowers */}
            <filter id="petalGlow" x="-30%" y="-30%" width="160%" height="160%">
              <feGaussianBlur in="SourceAlpha" stdDeviation="4" result="blur" />
              <feFlood floodColor="#f43f5e" floodOpacity="0.5" result="clr" />
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
            stroke="#2d6a4f"
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
            stroke="#2d6a4f"
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
            stroke="#2d6a4f"
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
            stroke="#2d6a4f"
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
            stroke="#2d6a4f"
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

          {/* ─── SIDE ROSES (blush) ───────────────────────────────── */}
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

          {/* ─── CENTER ROSE (deep crimson) ──────────────────────── */}
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
                fill="rgba(255,242,250,0.96)"
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
            fill="rgba(244,63,94,0.6)"
            style={{
              animation: "leafUnfurl 0.6s ease-out 0.5s both",
              transformBox: "fill-box" as const,
              transformOrigin: "center 100%",
            }}
          />
          <path
            d="M 165 372 Q 155 360 162 352 Q 170 365 200 362 Q 230 365 238 352 Q 245 360 235 372 Q 217 378 200 380 Q 183 378 165 372 Z"
            fill="rgba(244,63,94,0.45)"
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
                "linear-gradient(90deg, transparent, #f43f5e, transparent)",
              margin: "0 auto 18px",
            }}
          />
          <p
            className="font-display"
            style={{
              fontSize: "clamp(1.15rem, 3.5vw, 1.55rem)",
              fontStyle: "italic",
              fontWeight: 300,
              color: "rgba(254,205,211,0.97)",
              lineHeight: 1.65,
              letterSpacing: "0.01em",
            }}
          >
            "for you, with all my love"
          </p>
          <p
            className="font-handwritten"
            style={{
              fontSize: "clamp(1rem, 2.5vw, 1.2rem)",
              color: "rgba(254,205,211,0.58)",
              marginTop: "10px",
              lineHeight: 1.6,
            }}
          >
            a little bouquet of happiness, just for you ♡
          </p>
        </div>
      </div>

      {/* Right photo column */}
      <div
        style={{
          display: "flex",
          flexDirection: "column",
          gap: "clamp(10px, 1.8vh, 20px)",
          alignItems: "flex-start",
          flexShrink: 0,
        }}
      >
        {RIGHT_PHOTOS.map((p, i) => <PhotoCard key={i} {...p} />)}
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
        @keyframes photoReveal {
          0%   { opacity: 0; transform: translateY(60px) scale(0.8) rotate(var(--r, 0deg)); }
          100% { opacity: 1; transform: translateY(0)   scale(1)   rotate(var(--r, 0deg)); }
        }
      `}</style>
    </div>
  );
}
