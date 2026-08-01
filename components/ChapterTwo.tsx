"use client";

import { useEffect, useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import Image from "next/image";
import { HeartSmallIcon } from "./Icons";

gsap.registerPlugin(ScrollTrigger);

const MEMORIES = [
  {
    src: "/img/Kimmy JKT48 (1).jpg",
    alt: "A tender moment together",
    caption: "You made ordinary days feel special.",
    handwrittenNote: "our hands entwined, hearts beating as one...",
    date: "'23 10 14",
    rotate: "-3.5deg",
    position: "left",
    aspectRatio: "3/4",
    objectPosition: "center 20%",
  },
  {
    src: "/img/G-ip79SbQAMdqZX.jpg",
    alt: "Watching the sunset together",
    caption: "Some moments deserve to stay forever.",
    handwrittenNote: "the glow of your smile in the light",
    date: "'23 10 21",
    rotate: "2.8deg",
    position: "right",
    aspectRatio: "3/4",
    objectPosition: "center 20%",
  },
  {
    src: "/img/HOED8g1aoAAz4q7.jpg",
    alt: "An autumn walk",
    caption: "I hope you know how much you mean to me.",
    handwrittenNote: "walking side by side, feeling complete",
    date: "'23 11 02",
    rotate: "-2.2deg",
    position: "left",
    aspectRatio: "4/3",
    objectPosition: "center center",
  },
  {
    src: "/img/G5KCcHCaIAATySf.jpg",
    alt: "Cozy together",
    caption: "Every little thing about you is a memory I keep close.",
    handwrittenNote: "your warm smile is my safe place",
    date: "'23 11 18",
    rotate: "3.5deg",
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
          "linear-gradient(180deg, #fdf5f0 0%, #faf0ea 50%, #f8e8e3 100%)",
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
            color: "#be123c",
          }}
        >
          Chapter II — Love Letters &amp; Keepsakes
        </span>
        <div className="chapter-line" />
        <h2
          className="font-display"
          style={{
            fontSize: "clamp(1.6rem, 4.5vw, 3rem)",
            fontWeight: 300,
            fontStyle: "italic",
            color: "#2b141e",
            marginTop: "0.5rem",
          }}
        >
          Cherished Moments
        </h2>
        <p className="font-handwritten" style={{ fontSize: "1.35rem", color: "#be123c", marginTop: "4px" }}>
          sweet memories &amp; whispered love
        </p>
      </div>

      {/* Ambient rose light leaks */}
      <div
        className="light-leak"
        style={{
          top: "15%",
          right: "-10%",
          width: "55%",
          height: "65%",
          background:
            "radial-gradient(circle, rgba(244,63,94,0.12) 0%, transparent 70%)",
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
                  ? "1fr clamp(270px, 36vw, 440px)"
                  : "clamp(270px, 36vw, 440px) 1fr",
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

              {/* Photo */}
              <div
                style={{
                  position: "relative",
                  width: "100%",
                  aspectRatio: mem.aspectRatio,
                  borderRadius: "2px",
                  overflow: "hidden",
                  background: "#faf0ea",
                }}
              >
                <Image
                  src={mem.src}
                  alt={mem.alt}
                  fill
                  loading="lazy"
                  style={{ objectFit: "cover", objectPosition: mem.objectPosition }}
                  sizes="(max-width: 768px) 90vw, 45vw"
                />
                {/* Analog LED timestamp */}
                <div style={{ position: "absolute", bottom: "8px", right: "12px", zIndex: 10 }}>
                  <span className="led-date">{mem.date}</span>
                </div>
              </div>

              {/* Polaroid bottom caption */}
              <div style={{ paddingTop: "14px", textAlign: "center" }}>
                <p className="font-handwritten" style={{ fontSize: "1.3rem", color: "#2b141e", fontWeight: 500 }}>
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
          color: "#2b141e",
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
          background: "rgba(244,63,94,0.45)",
          margin: align === "left" ? "1.2rem 0 0.8rem 0" : "1.2rem 0 0.8rem auto",
        }}
      />

      <span className="font-handwritten" style={{ fontSize: "1.25rem", color: "#be123c", opacity: 0.9, display: "inline-flex", alignItems: "center", gap: "5px" }}>
        <HeartSmallIcon size={13} color="#be123c" />{note}
      </span>
    </div>
  );
}
