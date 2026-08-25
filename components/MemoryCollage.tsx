"use client";

import { useEffect, useRef, useState } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import Image from "next/image";
import { HeartSmallIcon } from "./Icons";

gsap.registerPlugin(ScrollTrigger);

// 3 Curated Moments for Ratu Bunga Syakira
const COLLAGE_ITEMS = [
  {
    src: "/img/collage_video1.mp4",
    type: "video" as const,
    alt: "Pancaran pesona manis Syakira",
    note: "pesona indah yang selalu memikat hati...",
    date: "'10 08 25",
    rotate: "-3deg",
    aspectRatio: "3/4",
    objectPosition: "center 20%",
    column: 1,
  },
  {
    src: "/img/collage_video2.mp4",
    type: "video" as const,
    alt: "Senyum hangat dan tawa ceria Syakira",
    note: "senyuman manis pembawa kehangatan dunia",
    date: "'25 08 25",
    rotate: "2.8deg",
    aspectRatio: "3/4",
    objectPosition: "center 25%",
    column: 2,
  },
  {
    src: "/img/collage_video3.mp4",
    type: "video" as const,
    alt: "Setiap langkah anggun dan penuh mimpi",
    note: "setiap langkah anggun menggapai mimpi indah",
    date: "'25 08 25",
    rotate: "-2.8deg",
    aspectRatio: "3/4",
    objectPosition: "center 25%",
    column: 3,
  },
];

export default function MemoryCollage() {
  const sectionRef = useRef<HTMLElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const itemRefs   = useRef<(HTMLDivElement | null)[]>([]);
  const titleRef   = useRef<HTMLDivElement>(null);

  const [activePhoto, setActivePhoto] = useState<{
    src: string;
    type?: "video" | "image";
    note: string;
    date: string;
    aspectRatio: string;
    objectPosition: string;
  } | null>(null);

  useEffect(() => {
    const ctx = gsap.context(() => {
      // Zoom-out reveal of the whole grid
      gsap.fromTo(
        containerRef.current,
        { scale: 1.06, opacity: 0 },
        {
          scale: 1,
          opacity: 1,
          duration: 1.6,
          ease: "power2.out",
          scrollTrigger: {
            trigger: sectionRef.current,
            start: "top 70%",
            toggleActions: "play none none reverse",
          },
        }
      );

      // Title reveal
      gsap.fromTo(
        titleRef.current,
        { opacity: 0, y: 24 },
        {
          opacity: 1,
          y: 0,
          duration: 1.0,
          ease: "power2.out",
          scrollTrigger: {
            trigger: sectionRef.current,
            start: "top 75%",
          },
        }
      );

      // Individual collage pieces stagger in
      itemRefs.current.forEach((el, i) => {
        if (!el) return;
        gsap.fromTo(
          el,
          { opacity: 0, scale: 0.94, y: 28 },
          {
            opacity: 1,
            scale: 1,
            y: 0,
            duration: 0.8,
            delay: i * 0.08,
            ease: "power2.out",
            scrollTrigger: {
              trigger: sectionRef.current,
              start: "top 70%",
              toggleActions: "play none none none",
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
      id="collage"
      style={{
        position: "relative",
        background: "linear-gradient(180deg, #f4f8fd 0%, #ebf4fc 50%, #f0f7ff 100%)",
        padding: "clamp(60px, 10vh, 120px) clamp(16px, 4vw, 40px)",
        overflow: "hidden",
      }}
    >
      {/* Background Soft Glows */}
      <div
        style={{
          position: "absolute",
          top: "15%",
          left: "5%",
          width: "450px",
          height: "450px",
          borderRadius: "50%",
          background: "radial-gradient(circle, rgba(59,130,246,0.08) 0%, transparent 70%)",
          pointerEvents: "none",
        }}
      />
      <div
        style={{
          position: "absolute",
          bottom: "10%",
          right: "5%",
          width: "400px",
          height: "400px",
          borderRadius: "50%",
          background: "radial-gradient(circle, rgba(37,99,235,0.07) 0%, transparent 70%)",
          pointerEvents: "none",
        }}
      />

      {/* Section Header */}
      <div
        ref={titleRef}
        style={{
          textAlign: "center",
          marginBottom: "clamp(36px, 6vw, 64px)",
          position: "relative",
          zIndex: 2,
          opacity: 0,
        }}
      >
        <span
          className="film-edge"
          style={{
            fontSize: "clamp(0.6rem, 1.3vw, 0.72rem)",
            letterSpacing: "0.28em",
            color: "#2563eb",
            display: "block",
            marginBottom: "10px",
          }}
        >
          GALLERY OF BEAUTIFUL MOMENTS
        </span>
        <h2
          className="font-display"
          style={{
            fontSize: "clamp(1.75rem, 4.5vw, 3rem)",
            fontWeight: 300,
            fontStyle: "italic",
            color: "#0f1d36",
          }}
        >
          Treasured Moments of Syakira
        </h2>
        <p className="font-handwritten" style={{ fontSize: "1.25rem", color: "#2563eb", marginTop: "4px" }}>
          (klik foto untuk melihat ucapan manis)
        </p>
      </div>

      {/* Responsive Scrapbook Container */}
      <div
        ref={containerRef}
        className="collage-grid-container"
        style={{
          position: "relative",
          zIndex: 2,
          opacity: 0,
        }}
      >
        {COLLAGE_ITEMS.map((item, idx) => (
          <div
            key={idx}
            className={`collage-col col-offset-${idx + 1}`}
            style={{
              width: "100%",
              display: "flex",
              justifyContent: "center",
            }}
          >
            <div
              ref={(el) => { itemRefs.current[idx] = el; }}
              onClick={() => setActivePhoto(item)}
              className="polaroid-card collage-card"
              style={{
                transform: `rotate(${item.rotate})`,
                cursor: "pointer",
                opacity: 0,
                display: "flex",
                flexDirection: "column",
                background: "#ffffff",
                padding: "12px 12px 18px 12px",
                borderRadius: "4px",
                border: "1px solid rgba(59,130,246,0.15)",
                boxShadow:
                  "0 14px 32px -6px rgba(37,99,235,0.12), 0 4px 12px rgba(15,29,54,0.04)",
                transition:
                  "transform 0.4s cubic-bezier(0.175, 0.885, 0.32, 1.275), box-shadow 0.4s ease",
                maxWidth: "320px",
                width: "100%",
                margin: "0 auto",
              }}
            >
              {/* Washi Tape Accent */}
              <div className="polaroid-tape" style={{ width: "70px", height: "20px", top: "-10px" }} />

              {/* Photo / Video Container */}
              <div
                style={{
                  position: "relative",
                  width: "100%",
                  aspectRatio: item.aspectRatio,
                  borderRadius: "2px",
                  overflow: "hidden",
                  background: "#0a1628",
                }}
              >
                {item.type === "video" ? (
                  <video
                    src={item.src}
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
                      objectPosition: item.objectPosition,
                    }}
                  />
                ) : (
                  <Image
                    src={item.src}
                    alt={item.alt}
                    fill
                    loading="lazy"
                    style={{ objectFit: "cover", objectPosition: item.objectPosition }}
                    sizes="(max-width: 768px) 85vw, 320px"
                  />
                )}
                <div
                  style={{
                    position: "absolute",
                    inset: 0,
                    background:
                      "linear-gradient(180deg, transparent 75%, rgba(0,0,0,0.3) 100%)",
                    pointerEvents: "none",
                  }}
                />
                <span className="led-date" style={{ position: "absolute", bottom: "6px", right: "8px", fontSize: "0.65rem", zIndex: 10 }}>
                  {item.date}
                </span>
              </div>

              {/* Polaroid Handwritten Caption */}
              <div style={{ paddingTop: "12px", textAlign: "center", paddingBottom: "4px" }}>
                <span
                  className="font-handwritten"
                  style={{
                    fontSize: "clamp(1.15rem, 3.2vw, 1.35rem)",
                    color: "#0f1d36",
                    display: "inline-flex",
                    alignItems: "center",
                    justifyContent: "center",
                    gap: "6px",
                    fontWeight: 500,
                    lineHeight: 1.3,
                  }}
                >
                  <HeartSmallIcon size={13} color="#2563eb" />
                  {item.note}
                </span>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Lightbox Modal when clicking a photo */}
      {activePhoto && (
        <div
          onClick={() => setActivePhoto(null)}
          style={{
            position: "fixed",
            inset: 0,
            zIndex: 99999,
            background: "rgba(235,244,252,0.92)",
            backdropFilter: "blur(20px)",
            WebkitBackdropFilter: "blur(20px)",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            padding: "16px",
          }}
        >
          <div
            onClick={(e) => e.stopPropagation()}
            className="polaroid-card"
            style={{
              maxWidth: "min(420px, 92vw)",
              width: "100%",
              transform: "rotate(-1deg)",
              animation: "modalPop 0.4s cubic-bezier(0.175, 0.885, 0.32, 1.275)",
              background: "#ffffff",
              padding: "14px 14px 18px 14px",
              borderRadius: "4px",
              boxShadow: "0 25px 60px rgba(37,99,235,0.2)",
            }}
          >
            <div className="polaroid-tape" />
            <div
              style={{
                position: "relative",
                aspectRatio: activePhoto.aspectRatio,
                width: "100%",
                maxHeight: "65vh",
                borderRadius: "2px",
                overflow: "hidden",
                background: "#0a1628",
              }}
            >
              {activePhoto.type === "video" ? (
                <video
                  src={activePhoto.src}
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
                    objectPosition: activePhoto.objectPosition,
                  }}
                />
              ) : (
                <Image
                  src={activePhoto.src}
                  alt={activePhoto.note}
                  fill
                  style={{ objectFit: "cover", objectPosition: activePhoto.objectPosition }}
                />
              )}
              <span className="led-date" style={{ position: "absolute", bottom: "10px", right: "10px", zIndex: 10 }}>
                {activePhoto.date}
              </span>
            </div>
            <div style={{ paddingTop: "14px", textAlign: "center" }}>
              <p className="font-handwritten" style={{ fontSize: "clamp(1.25rem, 3.8vw, 1.6rem)", color: "#0f1d36", fontWeight: 500 }}>
                &ldquo;{activePhoto.note}&rdquo;
              </p>
              <button
                onClick={() => setActivePhoto(null)}
                style={{
                  marginTop: "10px",
                  fontSize: "0.7rem",
                  letterSpacing: "0.15em",
                  textTransform: "uppercase",
                  color: "#2563eb",
                  background: "none",
                  border: "none",
                  cursor: "pointer",
                  fontWeight: 600,
                  padding: "8px 16px",
                }}
              >
                close ✕
              </button>
            </div>
          </div>
        </div>
      )}

      <style>{`
        .collage-grid-container {
          display: flex;
          flex-direction: column;
          align-items: center;
          gap: 32px;
          max-width: 340px;
          margin: 0 auto;
          width: 100%;
        }

        /* Desktop: 3 columns with artistic staggered offsets */
        @media (min-width: 769px) {
          .collage-grid-container {
            display: grid;
            grid-template-columns: repeat(3, 1fr);
            max-width: 1160px;
            gap: clamp(20px, 3.5vw, 36px);
            align-items: start;
          }
          .collage-col.col-offset-1 {
            margin-top: 0px;
          }
          .collage-col.col-offset-2 {
            margin-top: 40px;
          }
          .collage-col.col-offset-3 {
            margin-top: 16px;
          }
        }

        @keyframes modalPop {
          0% { transform: scale(0.8) rotate(-3deg); opacity: 0; }
          100% { transform: scale(1) rotate(-1deg); opacity: 1; }
        }
      `}</style>
    </section>
  );
}
