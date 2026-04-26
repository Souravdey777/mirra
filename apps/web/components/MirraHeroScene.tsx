"use client";

import { useRef, useState } from "react";

export function MirraHeroScene() {
  const [isLooping, setIsLooping] = useState(false);
  const loopVideoRef = useRef<HTMLVideoElement>(null);

  function playLoopVideo() {
    const loopElement = loopVideoRef.current;

    if (!loopElement) {
      setIsLooping(true);
      return;
    }

    loopElement.currentTime = 0;
    setIsLooping(true);
    void loopElement.play().catch(() => {
      setIsLooping(true);
    });
  }

  return (
    <div className="mirra-hero-scene" aria-label="Mirra sitting on a sofa and checking the app">
      <div className={`scene-video-stack ${isLooping ? "is-looping" : ""}`}>
        <video
          className="scene-sofa-video scene-sofa-video-intro"
          src="/videos/mirra-mascot-animation.mp4"
          poster="/images/mirra-sofa-hero-upload.png"
          width={1280}
          height={720}
          autoPlay
          muted
          playsInline
          preload="auto"
          onEnded={playLoopVideo}
          aria-label="Mirra sitting on a warm brown sofa and looking at her phone"
        />
        <video
          ref={loopVideoRef}
          className="scene-sofa-video scene-sofa-video-loop"
          src="/videos/mirra-sofa-loop.mp4"
          poster="/images/mirra-sofa-hero-upload.png"
          width={1920}
          height={1080}
          muted
          loop
          playsInline
          preload="auto"
          aria-hidden
        />
      </div>
    </div>
  );
}
