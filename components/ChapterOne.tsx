"use client";

import { useEffect, useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

/* ── Animated floating light orbs drawn on canvas ── */
function AuroraCanvas() {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const resize = () => {
      canvas.width  = canvas.offsetWidth;
      canvas.height = canvas.offsetHeight;
    };
    resize();
    window.addEventListener("resize", resize);

    type Orb = {
      x: number; y: number;
      r: number;
      vx: number; vy: number;
      color: string;
      opacity: number;
      phase: number; speed: number;
    };

    const palette = [
      "59,130,246",   // blue
      "96,165,250",   // light blue
      "147,197,253",  // sky
      "37,99,235",    // deep blue
      "191,219,254",  // pale blue
      "251,191,36",   // warm gold accent
      "224,242,254",  // mist
    ];

    const orbs: Orb[] = Array.from({ length: 14 }, () => ({
      x: Math.random() * canvas.width,
      y: Math.random() * canvas.height,
      r: Math.random() * 220 + 80,
      vx: (Math.random() - 0.5) * 0.22,
      vy: (Math.random() - 0.5) * 0.18,
      color: palette[Math.floor(Math.random() * palette.length)],
      opacity: Math.random() * 0.15 + 0.05,
      phase: Math.random() * Math.PI * 2,
      speed: Math.random() * 0.006 + 0.003,
    }));

    // Twinkling star dots
    type Star = { x: number; y: number; r: number; alpha: number; phase: number; speed: number };
    const stars: Star[] = Array.from({ length: 120 }, () => ({
      x: Math.random() * canvas.width,
      y: Math.random() * canvas.height,
      r: Math.random() * 1.2 + 0.3,
      alpha: Math.random(),
      phase: Math.random() * Math.PI * 2,
      speed: Math.random() * 0.025 + 0.008,
    }));

    let raf: number;
    let t = 0;

    const draw = () => {
      t += 1;
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      // Base dark navy gradient
      const bg = ctx.createLinearGradient(0, 0, 0, canvas.height);
      bg.addColorStop(0,   "#060e1f");
      bg.addColorStop(0.4, "#0c1a36");
      bg.addColorStop(1,   "#0a1628");
      ctx.fillStyle = bg;
      ctx.fillRect(0, 0, canvas.width, canvas.height);

      // Floating aurora orbs
      orbs.forEach(o => {
        o.x += o.vx;
        o.y += o.vy;
        if (o.x < -o.r) o.x = canvas.width + o.r;
        if (o.x > canvas.width + o.r)  o.x = -o.r;
        if (o.y < -o.r) o.y = canvas.height + o.r;
        if (o.y > canvas.height + o.r) o.y = -o.r;

        const breathe = Math.sin(t * o.speed + o.phase) * 0.04;
        const grad = ctx.createRadialGradient(o.x, o.y, 0, o.x, o.y, o.r);
        grad.addColorStop(0,   `rgba(${o.color},${(o.opacity + breathe).toFixed(3)})`);
        grad.addColorStop(0.5, `rgba(${o.color},${((o.opacity + breathe) * 0.4).toFixed(3)})`);
        grad.addColorStop(1,   `rgba(${o.color},0)`);
        ctx.fillStyle = grad;
        ctx.beginPath();
        ctx.arc(o.x, o.y, o.r, 0, Math.PI * 2);
        ctx.fill();
      });

      // Twinkling stars
      stars.forEach(s => {
        const a = (Math.sin(t * s.speed + s.phase) + 1) / 2;
        ctx.globalAlpha = a * 0.75 + 0.05;
        ctx.fillStyle = "#dbeafe";
        ctx.beginPath();
        ctx.arc(s.x, s.y, s.r, 0, Math.PI * 2);
        ctx.fill();
      });
      ctx.globalAlpha = 1;

      raf = requestAnimationFrame(draw);
    };
    raf = requestAnimationFrame(draw);

    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener("resize", resize);
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      style={{ position: "absolute", inset: 0, width: "100%", height: "100%", display: "block" }}
    />
  );
}

export default function ChapterOne() {
  const sectionRef = useRef<HTMLElement>(null);
  const textRef    = useRef<HTMLDivElement>(null);
  const labelRef   = useRef<HTMLSpanElement>(null);
  const noteRef    = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const ctx = gsap.context(() => {
      const isMobile = window.innerWidth < 768;
      const tl = gsap.timeline({
        scrollTrigger: {
          trigger: sectionRef.current,
          start: "top top",
          end: isMobile ? "+=130%" : "+=200%",
          scrub: 1.5,
          pin: true,
          pinSpacing: true,
        },
      });

      tl.fromTo(labelRef.current,
        { opacity: 0, y: 20 },
        { opacity: 1, y: 0, duration: 0.2, ease: "power2.out" }
      );
      tl.fromTo(textRef.current,
        { opacity: 0, y: 40, filter: "blur(10px)" },
        { opacity: 1, y: 0, filter: "blur(0px)", duration: 0.35, ease: "power2.out" },
        "+=0.05"
      );
      tl.fromTo(noteRef.current,
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
      style={{
        minHeight: "100svh",
        height: "100dvh",
        position: "relative",
        overflow: "hidden",
        background: "#060e1f",
      }}
    >
      {/* Animated aurora canvas */}
      <AuroraCanvas />

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
          padding: "0 clamp(1.2rem, 5vw, 4rem)",
          gap: "1.2rem",
          maxWidth: "880px",
          margin: "0 auto",
        }}
      >
        <span
          ref={labelRef}
          className="film-edge"
          style={{ opacity: 0, color: "rgba(147,197,253,0.65)", fontSize: "clamp(0.58rem, 1.2vw, 0.68rem)", letterSpacing: "0.26em" }}
        >
          CHAPTER I — THE BLOOMING STAR
        </span>

        <div className="chapter-line" style={{ background: "rgba(96,165,250,0.35)" }} />

        <div ref={textRef} style={{ opacity: 0, maxWidth: "820px", width: "100%" }}>
          <h2
            className="font-display"
            style={{
              fontSize: "clamp(1.75rem, 5vw, 3.8rem)",
              fontWeight: 300,
              fontStyle: "italic",
              color: "rgba(255,255,255,0.92)",
              lineHeight: 1.3,
              letterSpacing: "-0.01em",
            }}
          >
            &ldquo;Bagaikan ratu yang menebar pesona,
            <br />
            seindah bunga yang selalu merekah.&rdquo;
          </h2>
        </div>

        <div ref={noteRef} style={{ opacity: 0, marginTop: "0.4rem" }}>
          <p
            className="font-handwritten"
            style={{ fontSize: "clamp(1.15rem, 2.8vw, 1.85rem)", color: "rgba(147,197,253,0.88)" }}
          >
            setiap langkah dan senyumanmu membawa kehangatan yang tak tergantikan...
          </p>
        </div>
      </div>
    </section>
  );
}
