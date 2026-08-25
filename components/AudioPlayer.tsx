"use client";

import { useEffect, useRef, useState } from "react";

interface AudioPlayerProps {
  autoPlayTrigger?: boolean;
}

interface TrackInfo {
  id: "bazzi" | "daniel";
  src: string;
  artist: string;
  title: string;
  startTime: number;
  endTime: number; // in seconds; 0 means full song
  loop: boolean;
}

const TRACKS: TrackInfo[] = [
  {
    id: "bazzi",
    src: "/bazzi.mp3",
    artist: "Bazzi feat. Camila Cabello",
    title: "Beautiful",
    startTime: 18,
    endTime: 0, // Loops smoothly during browsing
    loop: true,
  },
  {
    id: "daniel",
    src: "/transform.mp3",
    artist: "Daniel Caesar",
    title: "Transform (feat. Charlotte Day Wilson)",
    startTime: 183, // 3:03 climax section to the end
    endTime: 0, // Plays till end of song
    loop: true,
  },
];

export default function AudioPlayer({ autoPlayTrigger }: AudioPlayerProps) {
  const [currentTrackIndex, setCurrentTrackIndex] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(18);
  const [duration, setDuration] = useState(180);

  const audioRef = useRef<HTMLAudioElement | null>(null);
  const currentTrackIndexRef = useRef(0);
  currentTrackIndexRef.current = currentTrackIndex;

  const currentTrack = TRACKS[currentTrackIndex];

  // Switch to specific track index and start playing
  const loadAndPlayTrack = (index: number, autoStart: boolean = true) => {
    const track = TRACKS[index];
    if (!track) return;

    setCurrentTrackIndex(index);
    setCurrentTime(track.startTime);
    setDuration(track.endTime > 0 ? track.endTime : 280);

    if (audioRef.current) {
      audioRef.current.pause();
      audioRef.current.removeAttribute("src");
      audioRef.current.load();
    }

    const audio = new Audio(track.src);
    audio.preload = "auto";
    audio.loop = track.loop;
    audioRef.current = audio;

    const onMeta = () => {
      try {
        if (track.startTime > 0) {
          audio.currentTime = track.startTime;
        }
      } catch {}
      setDuration(track.endTime > 0 ? track.endTime : audio.duration || 0);
    };

    audio.addEventListener("loadedmetadata", onMeta);

    audio.addEventListener("timeupdate", () => {
      setCurrentTime(audio.currentTime);
    });

    audio.addEventListener("ended", () => {
      if (track.loop) {
        audio.currentTime = track.startTime;
        audio.play().catch(() => {});
      }
    });

    if (autoStart) {
      const playPromise = audio.play();
      if (playPromise !== undefined) {
        playPromise
          .then(() => {
            setIsPlaying(true);
            if (track.startTime > 0 && audio.currentTime < track.startTime) {
              audio.currentTime = track.startTime;
            }
          })
          .catch(() => {
            setIsPlaying(false);
          });
      }
    }
  };

  const playAudio = async () => {
    let audio = audioRef.current;
    if (!audio) {
      loadAndPlayTrack(currentTrackIndexRef.current, true);
      return;
    }

    try {
      const track = TRACKS[currentTrackIndexRef.current];
      if (track && track.startTime > 0 && audio.currentTime < track.startTime) {
        audio.currentTime = track.startTime;
      }
      await audio.play();
      setIsPlaying(true);
    } catch {
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

  // Initial setup: start on first track (Bazzi at 0:18)
  useEffect(() => {
    loadAndPlayTrack(0, true);

    // Listen for the special flower bouquet trigger
    const handleFlowerOpen = () => {
      loadAndPlayTrack(1, true); // Index 1 is Daniel Caesar - Transform
    };

    window.addEventListener("openBouquetMusic", handleFlowerOpen);

    return () => {
      window.removeEventListener("openBouquetMusic", handleFlowerOpen);
      if (audioRef.current) {
        audioRef.current.pause();
      }
    };
  }, []);

  // Trigger play when loading screen finishes
  useEffect(() => {
    if (autoPlayTrigger) {
      playAudio();
    }
  }, [autoPlayTrigger]);

  // Fallback: Resume play on first user gesture
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
            {isPlaying
              ? `${currentTrack.artist} · ${formatTime(currentTime)} / ${formatTime(duration || (currentTrack.endTime || 280))}`
              : `${currentTrack.artist} · ${currentTrack.title}`}
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
              maxWidth: "200px",
            }}
          >
            {currentTrack.title}
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
