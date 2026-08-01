"use client";

import { useEffect, useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

export default function EmotionalBuild() {
  const sectionRef  = useRef<HTMLElement>(null);
  const line1Ref    = useRef<HTMLParagraphElement>(null);
  const line2Ref    = useRef<HTMLParagraphElement>(null);
  const overlayRef  = useRef<HTMLDivElement>(null);
  const imgRef      = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const ctx = gsap.context(() => {
      const tl = gsap.timeline({
        scrollTrigger: {
          trigger: sectionRef.current,
          start: "top top",
          end: "+=260%",
          scrub: 2.2,
          pin: true,
          pinSpacing: true,
        },
      });

      // Slow video reveal + scale
      tl.fromTo(
        imgRef.current,
        { scale: 1.15, opacity: 0 },
        { scale: 1.02, opacity: 1, duration: 0.3, ease: "power2.out" }
      );

      // Light overlay deepens
      tl.fromTo(
        overlayRef.current,
        { opacity: 0.3 },
        { opacity: 0.72, duration: 0.2, ease: "power1.inOut" },
        "<"
      );

      // Line 1 fades in with blur reveal
      tl.fromTo(
        line1Ref.current,
        { opacity: 0, y: 32, filter: "blur(12px)" },
        { opacity: 1, y: 0,  filter: "blur(0px)", duration: 0.25, ease: "power2.out" },
        "+=0.06"
      );

      // Heartbeat pause
      tl.to({}, { duration: 0.18 });

      // Line 2 fades in
      tl.fromTo(
        line2Ref.current,
        { opacity: 0, y: 26, filter: "blur(10px)" },
        { opacity: 1, y: 0,  filter: "blur(0px)", duration: 0.25, ease: "power2.out" }
      );
    }, sectionRef);

    return () => ctx.revert();
  }, []);

  return (
    <section
      ref={sectionRef}
      id="emotional-build"
      style={{ height: "100vh", position: "relative", overflow: "hidden", background: "#fdf5f0" }}
    >
      {/* Background video */}
      <div
        ref={imgRef}
        style={{ position: "absolute", inset: "-5%", opacity: 0, zIndex: 0 }}
      >
        <video
          src="/img/ssstwitter.com_1785580369335.mp4"
          autoPlay
          loop
          muted
          playsInline
          style={{
            width: "100%",
            height: "100%",
            objectFit: "cover",
            objectPosition: "center center",
          }}
        />
      </div>

      {/* Light soft rose overlay */}
      <div
        ref={overlayRef}
        style={{
          position: "absolute",
          inset: 0,
          background: "linear-gradient(180deg, rgba(255,252,248,0.78) 0%, rgba(253,245,240,0.65) 50%, rgba(250,236,233,0.85) 100%)",
          zIndex: 1,
        }}
      />

      {/* Rose glow center */}
      <div
        className="light-leak"
        style={{
          top: "30%",
          left: "50%",
          transform: "translateX(-50%)",
          width: "68%",
          height: "58%",
          background:
            "radial-gradient(circle, rgba(244,63,94,0.15) 0%, transparent 70%)",
          zIndex: 2,
        }}
      />

      {/* Film edge tag */}
      <div style={{ position: "absolute", top: "24px", left: "50%", transform: "translateX(-50%)", zIndex: 10 }}>
        <span className="film-edge">PAUSE · FOREVER &amp; ALWAYS</span>
      </div>

      {/* Text block */}
      <div
        style={{
          position: "absolute",
          inset: 0,
          zIndex: 10,
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          textAlign: "center",
          padding: "0 clamp(1.5rem, 6vw, 5rem)",
          gap: "clamp(1.2rem, 2.8vw, 2rem)",
        }}
      >
        <p
          ref={line1Ref}
          className="font-display"
          style={{
            fontSize: "clamp(1.6rem, 4.8vw, 3.4rem)",
            fontStyle: "italic",
            fontWeight: 300,
            color: "#2b141e",
            lineHeight: 1.5,
            textShadow: "0 2px 25px rgba(255,255,255,0.95)",
            opacity: 0,
          }}
        >
          &ldquo;If I could relive one memory over and over...&rdquo;
        </p>

        <p
          ref={line2Ref}
          className="font-display"
          style={{
            fontSize: "clamp(1.6rem, 4.8vw, 3.4rem)",
            fontStyle: "italic",
            fontWeight: 300,
            color: "#be123c",
            lineHeight: 1.5,
            textShadow: "0 2px 25px rgba(255,255,255,0.95), 0 0 20px rgba(244,63,94,0.25)",
            opacity: 0,
          }}
        >
          &ldquo;...I&rsquo;d probably choose every moment with you.&rdquo;
        </p>
      </div>
    </section>
  );
}
