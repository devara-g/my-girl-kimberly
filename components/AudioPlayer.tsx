"use client";

import { useEffect, useRef, useState } from "react";
import { MusicNoteIcon } from "./Icons";

interface AudioPlayerProps {
  autoPlayTrigger?: boolean;
}

export default function AudioPlayer({ autoPlayTrigger }: AudioPlayerProps) {
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const audioRef = useRef<HTMLAudioElement | null>(null);

  // Play audio safely
  const playAudio = async () => {
    const audio = audioRef.current;
    if (!audio) return;

    try {
      await audio.play();
      setIsPlaying(true);
    } catch {
      // Browser blocked completely unprompted sound, will auto-resume on first gesture/scroll
      setIsPlaying(false);
    }
  };

  const pauseAudio = () => {
    const audio = audioRef.current;
    if (audio) {
      audio.pause();
      setIsPlaying(false);
    }
  };

  const togglePlay = () => {
    if (isPlaying) {
      pauseAudio();
    } else {
      playAudio();
    }
  };

  // Initialize HTMLAudioElement & Auto-play immediately
  useEffect(() => {
    const audio = new Audio("/transform.mp3");
    audio.preload = "auto";
    audio.loop = true;
    audioRef.current = audio;

    const handleLoadedMetadata = () => {
      setDuration(audio.duration || 0);
    };

    const handleTimeUpdate = () => {
      setCurrentTime(audio.currentTime);
    };

    const handleEnded = () => {
      audio.currentTime = 0;
      audio.play().catch(() => {});
    };

    audio.addEventListener("loadedmetadata", handleLoadedMetadata);
    audio.addEventListener("timeupdate", handleTimeUpdate);
    audio.addEventListener("ended", handleEnded);

    // Attempt instant autoplay immediately on page load
    playAudio();

    return () => {
      audio.removeEventListener("loadedmetadata", handleLoadedMetadata);
      audio.removeEventListener("timeupdate", handleTimeUpdate);
      audio.removeEventListener("ended", handleEnded);
      audio.pause();
    };
  }, []);

  // Trigger play when loading screen finishes
  useEffect(() => {
    if (autoPlayTrigger) {
      playAudio();
    }
  }, [autoPlayTrigger]);

  // Comprehensive instant fallback: Auto-play on first scroll, mouse movement, touch, or any user gesture
  useEffect(() => {
    const triggerInstantPlay = () => {
      if (audioRef.current && audioRef.current.paused) {
        audioRef.current.play().then(() => {
          setIsPlaying(true);
        }).catch(() => {});
      }
      cleanupListeners();
    };

    const events = ["scroll", "wheel", "touchstart", "touchmove", "mousemove", "pointerdown", "keydown", "click"];
    const cleanupListeners = () => {
      events.forEach((ev) => window.removeEventListener(ev, triggerInstantPlay));
    };

    events.forEach((ev) => window.addEventListener(ev, triggerInstantPlay, { passive: true }));

    return () => {
      cleanupListeners();
    };
  }, []);

  // Format seconds to mm:ss
  const formatTime = (sec: number) => {
    if (isNaN(sec) || sec < 0) return "00:00";
    const m = Math.floor(sec / 60);
    const s = Math.floor(sec % 60);
    return `${m.toString().padStart(2, "0")}:${s.toString().padStart(2, "0")}`;
  };

  return (
    <div
      className="audio-player-wrapper"
      style={{
        position: "fixed",
        bottom: "max(20px, env(safe-area-inset-bottom, 20px))",
        right: "max(20px, env(safe-area-inset-right, 20px))",
        zIndex: 999,
        display: "flex",
        flexDirection: "column",
        alignItems: "flex-end",
        gap: "8px",
        maxWidth: "calc(100vw - 32px)",
      }}
    >
      <button
        onClick={togglePlay}
        className="glass-panel audio-player-btn"
        style={{
          display: "flex",
          alignItems: "center",
          gap: "10px",
          padding: "8px 16px 8px 10px",
          borderRadius: "30px",
          cursor: "pointer",
          border: isPlaying
            ? "1px solid rgba(59,130,246,0.45)"
            : "1px solid rgba(59,130,246,0.2)",
          color: "#0f1d36",
          transition: "transform 0.3s ease, border-color 0.3s ease, box-shadow 0.3s ease",
          boxShadow: isPlaying ? "0 8px 25px rgba(59,130,246,0.25)" : "0 8px 24px rgba(37,99,235,0.12)",
          maxWidth: "100%",
        }}
        aria-label="Toggle song playback"
      >
        {/* Spinning Vinyl Record Icon */}
        <div
          style={{
            width: "30px",
            height: "30px",
            borderRadius: "50%",
            background: "radial-gradient(circle, #0f1d36 30%, #1e3a8a 70%, #3b82f6 100%)",
            border: "1px solid rgba(59,130,246,0.4)",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            boxShadow: isPlaying ? "0 0 12px rgba(59,130,246,0.5)" : "none",
            flexShrink: 0,
          }}
          className={isPlaying ? "vinyl-spinning" : ""}
        >
          <div
            style={{
              width: "7px",
              height: "7px",
              borderRadius: "50%",
              background: "#ffffff",
            }}
          />
        </div>

        <div style={{ display: "flex", flexDirection: "column", alignItems: "flex-start", overflow: "hidden", minWidth: 0 }}>
          <span
            style={{
              fontSize: "0.58rem",
              letterSpacing: "0.12em",
              color: "#2563eb",
              textTransform: "uppercase",
              fontWeight: 500,
              whiteSpace: "nowrap",
            }}
          >
            {isPlaying ? `Daniel Caesar · ${formatTime(currentTime)} / ${formatTime(duration || 280)}` : "Daniel Caesar · Transform"}
          </span>
          <span
            className="font-handwritten"
            style={{
              fontSize: "clamp(1rem, 2.5vw, 1.15rem)",
              color: "#0f1d36",
              lineHeight: 1.1,
              fontWeight: 500,
              whiteSpace: "nowrap",
              overflow: "hidden",
              textOverflow: "ellipsis",
              maxWidth: "180px",
            }}
          >
            Transform
          </span>
        </div>

        {/* Animated Wave Indicator */}
        {isPlaying && (
          <div style={{ display: "flex", alignItems: "flex-end", gap: "2px", height: "12px", marginLeft: "2px", flexShrink: 0 }}>
            {[1, 2, 3, 4].map((i) => (
              <div
                key={i}
                style={{
                  width: "2px",
                  background: "#3b82f6",
                  borderRadius: "1px",
                  animation: `soundWave 1.2s ease-in-out ${i * 0.2}s infinite alternate`,
                }}
              />
            ))}
          </div>
        )}
      </button>

      <style>{`
        @keyframes soundWave {
          0% { height: 3px; }
          100% { height: 13px; }
        }

        @media (max-width: 480px) {
          .audio-player-wrapper {
            bottom: max(12px, env(safe-area-inset-bottom, 12px)) !important;
            right: max(12px, env(safe-area-inset-right, 12px)) !important;
          }
          .audio-player-btn {
            padding: 6px 12px 6px 8px !important;
          }
        }
      `}</style>
    </div>
  );
}
