"use client";

import { useEffect, useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import Image from "next/image";

import { HeartSmallIcon } from "./Icons";

gsap.registerPlugin(ScrollTrigger);

const MEMORIES = [
  {
    src: "/img/ratu_snap2.mp4",
    type: "video",
    alt: "A radiant moment of Ratu Bunga Syakira",
    caption: "Your bright, honest smile brings warmth wherever you go.",
    handwrittenNote: "pancaran senyum yang selalu membahagiakan...",
    date: "'10 08 25",
    rotate: "-3deg",
    position: "left",
    aspectRatio: "3/4",
    objectPosition: "center 20%",
  },
  {
    src: "/img/ratu_snap3.mp4",
    type: "video",
    alt: "Shining in her journey",
    caption: "With every step, you continue to blossom so beautifully.",
    handwrittenNote: "langkah demi langkah penuh pesona",
    date: "'24 08 25",
    rotate: "2.5deg",
    position: "right",
    aspectRatio: "3/4",
    objectPosition: "center 20%",
  },
  {
    src: "/img/snap_new.jpg",
    type: "image",
    alt: "Pure laughter and joy",
    caption: "May your days always be filled with laughter, peace, and endless light.",
    handwrittenNote: "semoga kebahagiaan selalu memelukmu erat",
    date: "'25 08 25",
    rotate: "-2.2deg",
    position: "left",
    aspectRatio: "3/4",
    objectPosition: "center 25%",
  },
  {
    src: "/img/snap_new2.jpg",
    type: "image",
    alt: "Dreams and milestones ahead",
    caption: "Stay true to your kind heart — the world is ready for your brilliance.",
    handwrittenNote: "terbanglah tinggi meraih seluruh impianmu",
    date: "'26 08 25",
    rotate: "3deg",
    position: "right",
    aspectRatio: "3/4",
    objectPosition: "center 20%",
  },
];

export default function ChapterTwo() {
  const sectionRef = useRef<HTMLElement>(null);
  const itemRefs   = useRef<(HTMLDivElement | null)[]>([]);

  useEffect(() => {
    const ctx = gsap.context(() => {
      itemRefs.current.forEach((el) => {
        if (!el) return;

        gsap.fromTo(
          el,
          {
            opacity: 0,
            y: 40,
            filter: "blur(10px)",
            scale: 0.95,
          },
          {
            opacity: 1,
            y: 0,
            filter: "blur(0px)",
            scale: 1,
            duration: 1.2,
            ease: "power3.out",
            scrollTrigger: {
              trigger: el,
              start: "top 85%",
              toggleActions: "play none none reverse",
            },
          }
        );
      });
    }, sectionRef);

    return () => ctx.revert();
  }, []);

  return (
    <section
      ref={sectionRef}
      id="chapter-two"
      style={{
        background:
          "linear-gradient(180deg, #edf4fc 0%, #e2eef9 50%, #dbeafe 100%)",
        padding: "clamp(4rem, 10vh, 8rem) 0",
        position: "relative",
        overflow: "hidden",
      }}
    >
      {/* Chapter label */}
      <div style={{ textAlign: "center", marginBottom: "clamp(2.5rem, 6vw, 5rem)", padding: "0 1.2rem" }}>
        <span
          style={{
            fontFamily: "'Poppins', sans-serif",
            fontSize: "0.65rem",
            fontWeight: 500,
            letterSpacing: "0.28em",
            textTransform: "uppercase",
            color: "#2563eb",
          }}
        >
          Chapter II — Moments &amp; Milestones
        </span>
        <div className="chapter-line" />
        <h2
          className="font-display"
          style={{
            fontSize: "clamp(1.7rem, 4.5vw, 3rem)",
            fontWeight: 300,
            fontStyle: "italic",
            color: "#0f1d36",
            marginTop: "0.4rem",
            lineHeight: 1.25,
          }}
        >
          Capturing Your Shine
        </h2>
        <p className="font-handwritten" style={{ fontSize: "clamp(1.15rem, 2.8vw, 1.4rem)", color: "#2563eb", marginTop: "4px" }}>
          a little celebration of your wonderful journey
        </p>
      </div>

      {/* Ambient sky blue light leaks */}
      <div
        className="light-leak"
        style={{
          top: "15%",
          right: "-10%",
          width: "55%",
          height: "65%",
          background:
            "radial-gradient(circle, rgba(59,130,246,0.12) 0%, transparent 70%)",
          zIndex: 0,
        }}
      />

      {/* Memory items */}
      <div
        className="chapter-two-container"
        style={{
          display: "flex",
          flexDirection: "column",
          gap: "clamp(3.5rem, 9vh, 7rem)",
          position: "relative",
          zIndex: 2,
          maxWidth: "1150px",
          margin: "0 auto",
          padding: "0 clamp(1rem, 4vw, 3rem)",
        }}
      >
        {MEMORIES.map((mem, i) => (
          <div
            key={i}
            ref={(el) => { itemRefs.current[i] = el; }}
            className={`chapter-two-item pos-${mem.position}`}
          >
            {/* Desktop Left-aligned caption for right-placed photo */}
            {mem.position === "right" && (
              <div className="desktop-caption">
                <Caption text={mem.caption} note={mem.handwrittenNote} align="right" />
              </div>
            )}

            {/* Handcrafted Polaroid Photo Card */}
            <div className="polaroid-wrapper">
              <div
                className="polaroid-card"
                style={{
                  transform: `rotate(${mem.rotate})`,
                  width: "100%",
                  maxWidth: "340px",
                  margin: "0 auto",
                }}
              >
                {/* Tape visual effect */}
                <div className="polaroid-tape" />

                {/* Photo or Video */}
                <div
                  style={{
                    position: "relative",
                    width: "100%",
                    aspectRatio: mem.aspectRatio,
                    borderRadius: "2px",
                    overflow: "hidden",
                    background: "#0a1628",
                  }}
                >
                  {mem.type === "video" ? (
                    <video
                      src={mem.src}
                      autoPlay
                      loop
                      muted
                      playsInline
                      style={{
                        position: "absolute",
                        inset: 0,
                        width: "100%",
                        height: "100%",
                        objectFit: "cover",
                        objectPosition: mem.objectPosition,
                      }}
                    />
                  ) : (
                    <Image
                      src={mem.src}
                      alt={mem.alt}
                      fill
                      loading="lazy"
                      style={{ objectFit: "cover", objectPosition: mem.objectPosition }}
                      sizes="(max-width: 768px) 85vw, 340px"
                    />
                  )}
                  {/* Analog LED timestamp */}
                  <div style={{ position: "absolute", bottom: "8px", right: "12px", zIndex: 10 }}>
                    <span className="led-date">{mem.date}</span>
                  </div>
                </div>

                {/* Polaroid bottom handwritten caption */}
                <div style={{ paddingTop: "12px", textAlign: "center" }}>
                  <p className="font-handwritten" style={{ fontSize: "clamp(1.15rem, 3.2vw, 1.35rem)", color: "#0f1d36", fontWeight: 500, lineHeight: 1.3 }}>
                    {mem.handwrittenNote}
                  </p>
                </div>
              </div>
            </div>

            {/* Desktop Right-aligned caption for left-placed photo */}
            {mem.position === "left" && (
              <div className="desktop-caption">
                <Caption text={mem.caption} note={mem.handwrittenNote} align="left" />
              </div>
            )}

            {/* Mobile / Tablet Caption (Always below the card in single column) */}
            <div className="mobile-caption">
              <Caption text={mem.caption} note={mem.handwrittenNote} align="center" />
            </div>
          </div>
        ))}
      </div>

      <style>{`
        .chapter-two-item {
          display: grid;
          align-items: center;
          gap: clamp(1.5rem, 4vw, 3.5rem);
          width: 100%;
        }

        /* Desktop: 2-column layout */
        @media (min-width: 769px) {
          .chapter-two-item.pos-left {
            grid-template-columns: 340px 1fr;
          }
          .chapter-two-item.pos-right {
            grid-template-columns: 1fr 340px;
          }
          .mobile-caption {
            display: none;
          }
          .desktop-caption {
            display: block;
          }
        }

        /* Mobile & Tablet: 1-column clean stack */
        @media (max-width: 768px) {
          .chapter-two-item {
            display: flex;
            flex-direction: column;
            align-items: center;
            text-align: center;
            gap: 1.2rem;
          }
          .desktop-caption {
            display: none;
          }
          .mobile-caption {
            display: block;
            width: 100%;
            max-width: 330px;
            margin: 0 auto;
          }
          .polaroid-wrapper {
            width: 100%;
            display: flex;
            justify-content: center;
            padding: 0 12px;
          }
          .polaroid-wrapper .polaroid-card {
            max-width: 300px !important;
            padding: 10px 10px 34px 10px !important;
          }
        }
      `}</style>
    </section>
  );
}

function Caption({ text, note, align }: { text: string; note: string; align: "left" | "right" | "center" }) {
  const isCenter = align === "center";
  return (
    <div
      style={{
        textAlign: align,
        padding: isCenter ? "0 0.5rem" : "0 1rem",
      }}
    >
      <p
        className="font-display"
        style={{
          fontSize: "clamp(1.15rem, 2.8vw, 2.1rem)",
          fontStyle: "italic",
          fontWeight: 300,
          color: "#0f1d36",
          lineHeight: 1.55,
          letterSpacing: "0.01em",
        }}
      >
        &ldquo;{text}&rdquo;
      </p>

      <div
        style={{
          width: "36px",
          height: "1px",
          background: "rgba(59,130,246,0.45)",
          margin: isCenter ? "0.9rem auto 0.6rem auto" : align === "left" ? "1.2rem 0 0.8rem 0" : "1.2rem 0 0.8rem auto",
        }}
      />

      <span className="font-handwritten" style={{ fontSize: "clamp(1.1rem, 2.6vw, 1.25rem)", color: "#2563eb", opacity: 0.9, display: "inline-flex", alignItems: "center", gap: "5px", justifyContent: isCenter ? "center" : "flex-start" }}>
        <HeartSmallIcon size={13} color="#2563eb" />{note}
      </span>
    </div>
  );
}

