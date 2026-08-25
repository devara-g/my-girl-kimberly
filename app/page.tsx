"use client";

import { useState } from "react";
import dynamic from "next/dynamic";
import LoadingScreen from "@/components/LoadingScreen";
import LenisProvider from "@/components/LenisProvider";
import AudioPlayer from "@/components/AudioPlayer";
import OpeningScene from "@/components/OpeningScene";
import ChapterOne from "@/components/ChapterOne";
import ChapterTwo from "@/components/ChapterTwo";
import EmotionalBuild from "@/components/EmotionalBuild";
import MemoryCollage from "@/components/MemoryCollage";
import FinalScene from "@/components/FinalScene";

// Canvas background components loaded client-side
const ParticleField = dynamic(() => import("@/components/ParticleField"), { ssr: false });
const FloatingHearts = dynamic(() => import("@/components/FloatingHearts"), { ssr: false });

export default function Home() {
  const [loadingComplete, setLoadingComplete] = useState(false);

  return (
    <>
      <LoadingScreen onComplete={() => setLoadingComplete(true)} />

      {/* Fixed Ambient Floating Hearts & Sparkle Background */}
      <ParticleField count={40} />
      <FloatingHearts />

      {/* Floating Audio Player synced with loading complete */}
      <AudioPlayer autoPlayTrigger={loadingComplete} />

      <LenisProvider>
        <main style={{ position: "relative", zIndex: 2 }}>
          <OpeningScene />
          <ChapterOne />
          <ChapterTwo />
          <EmotionalBuild />
          <MemoryCollage />
          <FinalScene />
        </main>
      </LenisProvider>
    </>
  );
}
