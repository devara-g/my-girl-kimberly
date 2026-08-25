"use client";

import { useEffect, useRef, useState } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import Image from "next/image";
import { HeartSmallIcon } from "./Icons";

gsap.registerPlugin(ScrollTrigger);

// 6 Curated High-Aesthetic Photos for Ratu Bunga Syakira
const COLLAGE_ITEMS = [
  // Column 1
  {
    src: "/img/G-ip79SbQAMdqZX.jpg",
    alt: "Senyum manis mempesona",
    note: "senyum manis yang tak pernah pudar",
    date: "'10 08 25",
    rotate: "-3deg",
    aspectRatio: "3/4",
    objectPosition: "center 20%",
    column: 1,
  },
  {
    src: "/img/HOED8g2aAAAIjFx.jpg",
    alt: "Penuh kehangatan",
    note: "pancaran hangat di setiap tatapan",
    date: "'24 08 25",
    rotate: "2.2deg",
    aspectRatio: "4/3",
    objectPosition: "center center",
    column: 1,
  },

  // Column 2 (Staggered down for organic scrapbook feel)
  {
    src: "/img/G5XU67QbYAATumz.jpg",
    alt: "Tawa ceria",
    note: "tawa riang pembawa kebahagiaan",
    date: "'25 08 25",
    rotate: "2.8deg",
    aspectRatio: "3/4",
    objectPosition: "center 25%",
    column: 2,
  },
  {
    src: "/img/kimmy JKT48 (2).jpg",
    alt: "Sosok anggun",
    note: "anggun dan penuh pesona",
    date: "'26 08 25",
    rotate: "-2.5deg",
    aspectRatio: "3/4",
    objectPosition: "center top",
    column: 2,
  },

  // Column 3
  {
    src: "/img/HBSrsfvb0AEsOB-.jpg",
    alt: "Merajut mimpi",
    note: "setiap mimpi indah yang kau rajut",
    date: "'25 08 25",
    rotate: "-2.8deg",
    aspectRatio: "3/4",
    objectPosition: "center 25%",
    column: 3,
  },
  {
    src: "/img/HF82lq0aEAEcBAe.jpg",
    alt: "Terus bersinar",
    note: "tetaplah bersinar, Ratu Bunga Syakira",
    date: "'26 08 25",
    rotate: "3deg",
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
        { opacity: 0, y: 30, filter: "blur(8px)" },
        {
          opacity: 1,
          y: 0,
          filter: "blur(0px)",
          duration: 1.4,
          ease: "power3.out",
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
          { opacity: 0, scale: 0.88, y: 35, filter: "blur(8px)" },
          {
            opacity: 1,
            scale: 1,
            y: 0,
            filter: "blur(0px)",
            duration: 1.1,
            delay: i * 0.07,
            ease: "power2.out",
            scrollTrigger: {
              trigger: sectionRef.current,
              start: "top 65%",
              toggleActions: "play none none none",
            },
          }
        );
      });
    }, sectionRef);

    return () => ctx.revert();
  }, []);

  // Organize items by columns for clean 3-column masonry layout
  const col1 = COLLAGE_ITEMS.filter((item) => item.column === 1);
  const col2 = COLLAGE_ITEMS.filter((item) => item.column === 2);
  const col3 = COLLAGE_ITEMS.filter((item) => item.column === 3);

  const columns = [
    { items: col1, offset: "0px" },
    { items: col2, offset: "36px" }, // Staggered down for organic feel
    { items: col3, offset: "12px" },
  ];

  return (
    <section
      ref={sectionRef}
      id="collage"
      style={{
        background:
          "linear-gradient(180deg, #e2eef9 0%, #ebf4fc 60%, #f4f8fd 100%)",
        padding: "clamp(5rem, 12vh, 10rem) clamp(1.2rem, 5vw, 4rem)",
        position: "relative",
        overflow: "hidden",
      }}
    >
      {/* Ambient Light Leak */}
      <div
        className="light-leak"
        style={{
          top: "10%",
          left: "50%",
          transform: "translateX(-50%)",
          width: "85%",
          height: "75%",
          background:
            "radial-gradient(circle, rgba(59,130,246,0.12) 0%, transparent 65%)",
          filter: "blur(100px)",
          zIndex: 0,
        }}
      />

      {/* Title Header */}
      <div
        ref={titleRef}
        style={{
          textAlign: "center",
          marginBottom: "clamp(3.5rem, 8vw, 6rem)",
          position: "relative",
          zIndex: 2,
          opacity: 0,
        }}
      >
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
          GALLERY OF BEAUTIFUL MOMENTS
        </span>
        <div className="chapter-line" />
        <h2
          className="font-display"
          style={{
            fontSize: "clamp(1.6rem, 4.5vw, 3rem)",
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

      {/* Handcrafted 3-Column Masonry Scrapbook */}
      <div
        ref={containerRef}
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fit, minmax(290px, 1fr))",
          gap: "clamp(24px, 3.5vw, 42px)",
          maxWidth: "1160px",
          margin: "0 auto",
          position: "relative",
          zIndex: 2,
          opacity: 0,
        }}
      >
        {columns.map((col, colIdx) => (
          <div
            key={colIdx}
            style={{
              display: "flex",
              flexDirection: "column",
              gap: "clamp(28px, 4vw, 48px)",
              marginTop: col.offset,
            }}
          >
            {col.items.map((item, itemIdx) => {
              const globalIdx = colIdx * 3 + itemIdx;
              return (
                <div
                  key={itemIdx}
                  ref={(el) => { itemRefs.current[globalIdx] = el; }}
                  onClick={() => setActivePhoto(item)}
                  className="polaroid-card"
                  style={{
                    transform: `rotate(${item.rotate})`,
                    cursor: "pointer",
                    opacity: 0,
                    display: "flex",
                    flexDirection: "column",
                    background: "#ffffff",
                    padding: "12px 12px 16px 12px",
                    borderRadius: "4px",
                    border: "1px solid rgba(59,130,246,0.15)",
                    boxShadow:
                      "0 14px 32px -6px rgba(37,99,235,0.12), 0 4px 12px rgba(15,29,54,0.04)",
                    transition:
                      "transform 0.4s cubic-bezier(0.175, 0.885, 0.32, 1.275), box-shadow 0.4s ease",
                  }}
                >
                  {/* Washi Tape Accent */}
                  <div className="polaroid-tape" style={{ width: "70px", height: "20px", top: "-10px" }} />

                  {/* Photo Container */}
                  <div
                    style={{
                      position: "relative",
                      width: "100%",
                      aspectRatio: item.aspectRatio,
                      borderRadius: "2px",
                      overflow: "hidden",
                      background: "#e8f2fa",
                    }}
                  >
                    <Image
                      src={item.src}
                      alt={item.alt}
                      fill
                      loading="lazy"
                      style={{ objectFit: "cover", objectPosition: item.objectPosition }}
                      sizes="(max-width: 768px) 90vw, 30vw"
                    />
                    <div
                      style={{
                        position: "absolute",
                        inset: 0,
                        background:
                          "linear-gradient(180deg, transparent 75%, rgba(0,0,0,0.3) 100%)",
                      }}
                    />
                    <span className="led-date" style={{ position: "absolute", bottom: "6px", right: "8px", fontSize: "0.65rem" }}>
                      {item.date}
                    </span>
                  </div>

                  {/* Polaroid Handwritten Caption */}
                  <div style={{ paddingTop: "12px", textAlign: "center" }}>
                    <span
                      className="font-handwritten"
                      style={{
                        fontSize: "1.25rem",
                        color: "#0f1d36",
                        display: "inline-flex",
                        alignItems: "center",
                        gap: "5px",
                        fontWeight: 500,
                      }}
                    >
                      <HeartSmallIcon size={12} color="#2563eb" />
                      {item.note}
                    </span>
                  </div>
                </div>
              );
            })}
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
            padding: "20px",
          }}
        >
          <div
            onClick={(e) => e.stopPropagation()}
            className="polaroid-card"
            style={{
              maxWidth: activePhoto.aspectRatio === "3/4" ? "420px" : activePhoto.aspectRatio === "1/1" ? "460px" : "560px",
              width: "100%",
              transform: "rotate(-1deg)",
              animation: "modalPop 0.4s cubic-bezier(0.175, 0.885, 0.32, 1.275)",
              background: "#ffffff",
              padding: "16px 16px 20px 16px",
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
                maxHeight: "70vh",
                borderRadius: "2px",
                overflow: "hidden",
              }}
            >
              <Image
                src={activePhoto.src}
                alt={activePhoto.note}
                fill
                style={{ objectFit: "cover", objectPosition: activePhoto.objectPosition }}
              />
              <span className="led-date" style={{ position: "absolute", bottom: "12px", right: "12px" }}>
                {activePhoto.date}
              </span>
            </div>
            <div style={{ paddingTop: "16px", textAlign: "center" }}>
              <p className="font-handwritten" style={{ fontSize: "1.65rem", color: "#0f1d36", fontWeight: 500 }}>
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
                }}
              >
                close x
              </button>
            </div>
          </div>
        </div>
      )}

      <style>{`
        @keyframes modalPop {
          0% { transform: scale(0.8) rotate(-3deg); opacity: 0; }
          100% { transform: scale(1) rotate(-1deg); opacity: 1; }
        }
      `}</style>
    </section>
  );
}
