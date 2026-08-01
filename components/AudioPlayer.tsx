"use client";

import { useEffect, useRef, useState } from "react";
import { MusicNoteIcon } from "./Icons";

interface AudioPlayerProps {
  autoPlayTrigger?: boolean;
}

export default function AudioPlayer({ autoPlayTrigger }: AudioPlayerProps) {
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(25);
  const [isBlocked, setIsBlocked] = useState(false);
  const audioRef = useRef<HTMLAudioElement | null>(null);

  const START_TIME = 25; // 00:25
  const END_TIME = 90;   // 01:30

  // Play audio starting from START_TIME
  const playAudio = async () => {
    const audio = audioRef.current;
    if (!audio) return;

    try {
      if (audio.currentTime < START_TIME || audio.currentTime >= END_TIME) {
        audio.currentTime = START_TIME;
      }
      await audio.play();
      setIsPlaying(true);
      setIsBlocked(false);
    } catch {
      // Autoplay blocked by browser policy
      setIsBlocked(true);
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

  // Initialize HTMLAudioElement
  useEffect(() => {
    const audio = new Audio("/song.mp3");
    audio.preload = "auto";
    audio.currentTime = START_TIME;
    audioRef.current = audio;

    const handleTimeUpdate = () => {
      setCurrentTime(audio.currentTime);
      // Loop between 00:25 and 01:00
      if (audio.currentTime >= END_TIME) {
        audio.currentTime = START_TIME;
      }
    };

    const handleEnded = () => {
      audio.currentTime = START_TIME;
      audio.play().catch(() => {});
    };

    audio.addEventListener("timeupdate", handleTimeUpdate);
    audio.addEventListener("ended", handleEnded);

    return () => {
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

  // Fallback: Listen for first click/scroll if browser blocked initial autoplay
  useEffect(() => {
    const handleUserInteraction = () => {
      if (!isPlaying && audioRef.current) {
        playAudio();
      }
      window.removeEventListener("click", handleUserInteraction);
      window.removeEventListener("touchstart", handleUserInteraction);
    };

    window.addEventListener("click", handleUserInteraction, { once: true });
    window.addEventListener("touchstart", handleUserInteraction, { once: true });

    return () => {
      window.removeEventListener("click", handleUserInteraction);
      window.removeEventListener("touchstart", handleUserInteraction);
    };
  }, [isPlaying]);

  // Format seconds to mm:ss
  const formatTime = (sec: number) => {
    const m = Math.floor(sec / 60);
    const s = Math.floor(sec % 60);
    return `${m.toString().padStart(2, "0")}:${s.toString().padStart(2, "0")}`;
  };

  return (
    <div
      style={{
        position: "fixed",
        bottom: "24px",
        right: "24px",
        zIndex: 999,
        display: "flex",
        flexDirection: "column",
        alignItems: "flex-end",
        gap: "8px",
      }}
    >
      {/* Autoplay hint if browser blocked audio initially */}
      {isBlocked && !isPlaying && (
        <div
          className="glass-panel"
          style={{
            padding: "6px 14px",
            borderRadius: "20px",
            fontSize: "0.75rem",
            color: "#be123c",
            fontWeight: 500,
            letterSpacing: "0.05em",
            animation: "bounce 2s infinite",
          }}
        >
          <MusicNoteIcon size={13} color="#be123c" style={{ marginRight: "5px", verticalAlign: "middle" }} />
          Tap anywhere to enable soundtrack
        </div>
      )}

      <button
        onClick={togglePlay}
        className="glass-panel"
        style={{
          display: "flex",
          alignItems: "center",
          gap: "12px",
          padding: "8px 18px 8px 12px",
          borderRadius: "30px",
          cursor: "pointer",
          border: isPlaying
            ? "1px solid rgba(244,63,94,0.4)"
            : "1px solid rgba(244,63,94,0.18)",
          color: "#2b141e",
          transition: "transform 0.3s ease, border-color 0.3s ease, box-shadow 0.3s ease",
          boxShadow: isPlaying ? "0 8px 25px rgba(244,63,94,0.25)" : "0 8px 24px rgba(180,60,90,0.12)",
        }}
        aria-label="Toggle song playback"
      >
        {/* Spinning Vinyl Record Icon */}
        <div
          style={{
            width: "30px",
            height: "30px",
            borderRadius: "50%",
            background: "radial-gradient(circle, #2b141e 30%, #5c2e40 70%, #f43f5e 100%)",
            border: "1px solid rgba(244,63,94,0.3)",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            boxShadow: isPlaying ? "0 0 12px rgba(244,63,94,0.5)" : "none",
            flexShrink: 0,
          }}
          className={isPlaying ? "vinyl-spinning" : ""}
        >
          <div
            style={{
              width: "8px",
              height: "8px",
              borderRadius: "50%",
              background: "#ffffff",
            }}
          />
        </div>

        <div style={{ display: "flex", flexDirection: "column", alignItems: "flex-start" }}>
          <span
            style={{
              fontSize: "0.6rem",
              letterSpacing: "0.15em",
              color: "#be123c",
              textTransform: "uppercase",
              fontWeight: 500,
            }}
          >
            {isPlaying ? `Girl in Red · ${formatTime(currentTime)} / 01:30` : "Play Song (0:25 - 1:30)"}
          </span>
          <span className="font-handwritten" style={{ fontSize: "1.15rem", color: "#2b141e", lineHeight: 1, fontWeight: 500 }}>
            We Fell in Love in October
          </span>
        </div>

        {/* Animated Wave Indicator */}
        {isPlaying && (
          <div style={{ display: "flex", alignItems: "flex-end", gap: "2px", height: "14px", marginLeft: "4px" }}>
            {[1, 2, 3, 4].map((i) => (
              <div
                key={i}
                style={{
                  width: "2px",
                  background: "#f43f5e",
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
          0% { height: 4px; }
          100% { height: 14px; }
        }
        @keyframes bounce {
          0%, 100% { transform: translateY(0); }
          50% { transform: translateY(-4px); }
        }
      `}</style>
    </div>
  );
}
