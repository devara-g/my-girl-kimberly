"use client";

import { useEffect, useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import Image from "next/image";

gsap.registerPlugin(ScrollTrigger);

export default function ChapterOne() {
  const sectionRef = useRef<HTMLElement>(null);
  const imgRef     = useRef<HTMLDivElement>(null);
  const textRef    = useRef<HTMLDivElement>(null);
  const labelRef   = useRef<HTMLSpanElement>(null);
  const noteRef    = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const ctx = gsap.context(() => {
      const tl = gsap.timeline({
        scrollTrigger: {
          trigger: sectionRef.current,
          start: "top top",
          end: "+=220%",
          scrub: 2,
          pin: true,
          pinSpacing: true,
        },
      });

      // 1. Zoom into the moment
      tl.fromTo(
        imgRef.current,
        { scale: 1, filter: "blur(0px)" },
        { scale: 1.14, filter: "blur(3px)", duration: 0.5, ease: "power1.inOut" }
      );

      // 2. Reveal chapter label
      tl.fromTo(
        labelRef.current,
        { opacity: 0, y: 20 },
        { opacity: 1, y: 0, duration: 0.2, ease: "power2.out" },
        "-=0.3"
      );

      // 3. Reveal main quote line
      tl.fromTo(
        textRef.current,
        { opacity: 0, y: 40, filter: "blur(10px)" },
        { opacity: 1, y: 0, filter: "blur(0px)", duration: 0.35, ease: "power2.out" },
        "+=0.05"
      );

      // 4. Reveal handwritten note
      tl.fromTo(
        noteRef.current,
        { opacity: 0, y: 20 },
        { opacity: 1, y: 0, duration: 0.25, ease: "power2.out" },
        "+=0.05"
      );
    }, sectionRef);

    return () => ctx.revert();
  }, []);

  return (
    <section
      ref={sectionRef}
      id="chapter-one"
      style={{ height: "105vh", position: "relative", overflow: "hidden", background: "#fdf5f0" }}
    >
      {/* Fullscreen image */}
      <div
        ref={imgRef}
        style={{ position: "absolute", inset: "-10%", zIndex: 0 }}
      >
        <Image
          src="/img/G-YwRhebsAAWz6T.jpg"
          alt="Chapter One — Fullscreen moment"
          fill
          loading="lazy"
          style={{ objectFit: "cover", objectPosition: "center 25%" }}
          sizes="100vw"
        />
      </div>

      {/* Atmospheric light gradient overlays */}
      <div
        style={{
          position: "absolute",
          inset: 0,
          background:
            "linear-gradient(180deg, rgba(255,252,248,0.75) 0%, rgba(253,245,240,0.85) 50%, rgba(250,236,233,0.92) 100%)",
          zIndex: 1,
        }}
      />

      {/* Ambient Rose Light Leak */}
      <div
        className="light-leak"
        style={{
          top: "20%",
          left: "50%",
          transform: "translateX(-50%)",
          width: "70%",
          height: "60%",
          background:
            "radial-gradient(circle, rgba(244,63,94,0.18) 0%, transparent 70%)",
          zIndex: 2,
        }}
      />

      {/* Content */}
      <div
        style={{
          position: "relative",
          zIndex: 10,
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          height: "100%",
          textAlign: "center",
          padding: "0 clamp(1.5rem, 6vw, 4rem)",
          gap: "1.2rem",
        }}
      >
        <span
          ref={labelRef}
          className="film-edge"
          style={{ opacity: 0 }}
        >
          CHAPTER I — THE FIRST SPARK
        </span>

        <div className="chapter-line" />

        <div ref={textRef} style={{ opacity: 0, maxWidth: "880px" }}>
          <h2
            className="font-display"
            style={{
              fontSize: "clamp(1.8rem, 5vw, 3.8rem)",
              fontWeight: 300,
              fontStyle: "italic",
              color: "#2b141e",
              lineHeight: 1.3,
              letterSpacing: "-0.01em",
            }}
          >
            &ldquo;My girl, my girl, my girl... don&rsquo;t you know you&rsquo;re my world?&rdquo;
          </h2>
        </div>

        <div ref={noteRef} style={{ opacity: 0, marginTop: "0.5rem" }}>
          <p className="font-handwritten" style={{ fontSize: "clamp(1.3rem, 2.8vw, 2rem)", color: "#be123c" }}>
            the autumn leaves fell, but I fell for you even harder...
          </p>
        </div>
      </div>
    </section>
  );
}
