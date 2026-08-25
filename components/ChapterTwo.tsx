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
    src: "/img/G5XU67QbYAATumz.jpg",
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
    src: "/img/G5KCcHCaIAATySf.jpg",
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
      itemRefs.current.forEach((el, i) => {
        if (!el) return;
        const isLeft = MEMORIES[i].position === "left";

        gsap.fromTo(
          el,
          {
            opacity: 0,
            x: isLeft ? -90 : 90,
            y: 50,
            filter: "blur(12px)",
            scale: 0.9,
          },
          {
            opacity: 1,
            x: 0,
            y: 0,
            filter: "blur(0px)",
            scale: 1,
            duration: 1.6,
            ease: "power3.out",
            scrollTrigger: {
              trigger: el,
              start: "top 82%",
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
        padding: "clamp(5rem, 12vh, 9rem) 0",
        position: "relative",
      }}
    >
      {/* Chapter label */}
      <div style={{ textAlign: "center", marginBottom: "clamp(3.5rem, 7vw, 6rem)" }}>
        <span
          style={{
            fontFamily: "'Poppins', sans-serif",
            fontSize: "0.65rem",
            fontWeight: 500,
            letterSpacing: "0.3em",
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
            fontSize: "clamp(1.6rem, 4.5vw, 3rem)",
            fontWeight: 300,
            fontStyle: "italic",
            color: "#0f1d36",
            marginTop: "0.5rem",
          }}
        >
          Capturing Your Shine
        </h2>
        <p className="font-handwritten" style={{ fontSize: "1.35rem", color: "#2563eb", marginTop: "4px" }}>
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
        style={{
          display: "flex",
          flexDirection: "column",
          gap: "clamp(5rem, 12vh, 8rem)",
          position: "relative",
          zIndex: 2,
        }}
      >
        {MEMORIES.map((mem, i) => (
          <div
            key={i}
            ref={(el) => { itemRefs.current[i] = el; }}
            style={{
              display: "grid",
              gridTemplateColumns:
                mem.position === "left"
                  ? "1fr clamp(200px, 26vw, 300px)"
                  : "clamp(200px, 26vw, 300px) 1fr",
              alignItems: "center",
              gap: "clamp(2rem, 5vw, 4rem)",
              maxWidth: "1150px",
              margin: "0 auto",
              padding: "0 clamp(1.2rem, 4vw, 4rem)",
            }}
          >
            {mem.position === "right" && (
              <Caption text={mem.caption} note={mem.handwrittenNote} align="right" />
            )}

            {/* Handcrafted Polaroid Photo Card */}
            <div
              className="polaroid-card"
              style={{
                transform: `rotate(${mem.rotate})`,
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
                    sizes="(max-width: 768px) 90vw, 45vw"
                  />
                )}
                {/* Analog LED timestamp */}
                <div style={{ position: "absolute", bottom: "8px", right: "12px", zIndex: 10 }}>
                  <span className="led-date">{mem.date}</span>
                </div>
              </div>

              {/* Polaroid bottom caption */}
              <div style={{ paddingTop: "14px", textAlign: "center" }}>
                <p className="font-handwritten" style={{ fontSize: "1.3rem", color: "#0f1d36", fontWeight: 500 }}>
                  {mem.handwrittenNote}
                </p>
              </div>
            </div>

            {mem.position === "left" && (
              <Caption text={mem.caption} note={mem.handwrittenNote} align="left" />
            )}
          </div>
        ))}
      </div>
    </section>
  );
}

function Caption({ text, note, align }: { text: string; note: string; align: "left" | "right" }) {
  return (
    <div
      style={{
        textAlign: align,
        padding: "0 1rem",
      }}
    >
      <p
        className="font-display"
        style={{
          fontSize: "clamp(1.2rem, 3vw, 2.2rem)",
          fontStyle: "italic",
          fontWeight: 300,
          color: "#0f1d36",
          lineHeight: 1.6,
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
          margin: align === "left" ? "1.2rem 0 0.8rem 0" : "1.2rem 0 0.8rem auto",
        }}
      />

      <span className="font-handwritten" style={{ fontSize: "1.25rem", color: "#2563eb", opacity: 0.9, display: "inline-flex", alignItems: "center", gap: "5px" }}>
        <HeartSmallIcon size={13} color="#2563eb" />{note}
      </span>
    </div>
  );
}
