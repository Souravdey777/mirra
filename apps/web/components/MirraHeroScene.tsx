"use client";

import { useCallback, useEffect, useRef, useState } from "react";

const VIDEO_SWITCH_LEAD_SECONDS = 0.32;

export function MirraHeroScene() {
  const [isLooping, setIsLooping] = useState(false);
  const hasSwitchedRef = useRef(false);
  const introVideoRef = useRef<HTMLVideoElement>(null);
  const loopVideoRef = useRef<HTMLVideoElement>(null);

  const playLoopVideo = useCallback(() => {
    if (hasSwitchedRef.current) {
      return;
    }

    hasSwitchedRef.current = true;
    const loopElement = loopVideoRef.current;

    if (!loopElement) {
      setIsLooping(true);
      return;
    }

    try {
      loopElement.currentTime = 0;
    } catch {
      // Some browsers can reject seeking while media metadata is settling.
    }

    const revealLoop = () => {
      requestAnimationFrame(() => {
        setIsLooping(true);
      });
    };

    const revealOnNextVideoFrame = () => {
      const loopWithFrameCallback = loopElement as HTMLVideoElement & {
        requestVideoFrameCallback?: (callback: () => void) => number;
      };

      if (loopWithFrameCallback.requestVideoFrameCallback) {
        loopWithFrameCallback.requestVideoFrameCallback(revealLoop);
        return;
      }

      requestAnimationFrame(() => {
        requestAnimationFrame(revealLoop);
      });
    };

    void loopElement.play().then(revealOnNextVideoFrame).catch(revealLoop);
  }, []);

  function handleIntroProgress() {
    const introElement = introVideoRef.current;

    if (!introElement || !Number.isFinite(introElement.duration)) {
      return;
    }

    if (introElement.duration - introElement.currentTime <= VIDEO_SWITCH_LEAD_SECONDS) {
      playLoopVideo();
    }
  }

  useEffect(() => {
    const loopElement = loopVideoRef.current;

    if (!loopElement) {
      return;
    }

    void loopElement.play().catch(() => {
      // The onEnded fallback will still start the loop if early autoplay is blocked.
    });
  }, []);

  return (
    <div className="mirra-hero-scene" aria-label="Mirra sitting on a sofa and checking the app">
      <div className={`scene-video-stack ${isLooping ? "is-looping" : ""}`}>
        <video
          ref={introVideoRef}
          className="scene-sofa-video scene-sofa-video-intro"
          src="/videos/mirra-mascot-animation.mp4"
          poster="/images/mirra-sofa-hero-upload.png"
          width={1280}
          height={720}
          autoPlay
          muted
          playsInline
          preload="auto"
          onTimeUpdate={handleIntroProgress}
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
          autoPlay
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
