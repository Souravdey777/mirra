"use client";

import { useCallback, useEffect, useRef, useState } from "react";

const VIDEO_SWITCH_LEAD_SECONDS = 0.32;
const FALLBACK_IMAGE_SRC = "/images/mirra-sofa-hero-upload.png";

export function MirraHeroScene() {
  const [isLooping, setIsLooping] = useState(false);
  const [isFallbackVisible, setIsFallbackVisible] = useState(true);
  const hasSwitchedRef = useRef(false);
  const hasLoopFailedRef = useRef(false);
  const introVideoRef = useRef<HTMLVideoElement>(null);
  const loopVideoRef = useRef<HTMLVideoElement>(null);

  const showFallback = useCallback(() => {
    setIsFallbackVisible(true);
  }, []);

  const hideFallback = useCallback(() => {
    setIsFallbackVisible(false);
  }, []);

  const playLoopVideo = useCallback(() => {
    if (hasSwitchedRef.current) {
      return;
    }

    if (hasLoopFailedRef.current) {
      showFallback();
      return;
    }

    hasSwitchedRef.current = true;
    const loopElement = loopVideoRef.current;

    if (!loopElement) {
      showFallback();
      return;
    }

    try {
      loopElement.currentTime = 0;
    } catch {
      // Some browsers can reject seeking while media metadata is settling.
    }

    const revealLoop = () => {
      requestAnimationFrame(() => {
        if (hasLoopFailedRef.current) {
          showFallback();
          return;
        }

        hideFallback();
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

    void loopElement
      .play()
      .then(revealOnNextVideoFrame)
      .catch(() => {
        if (hasLoopFailedRef.current) {
          showFallback();
          return;
        }

        revealLoop();
      });
  }, [hideFallback, showFallback]);

  function handleIntroProgress() {
    const introElement = introVideoRef.current;

    if (!introElement || !Number.isFinite(introElement.duration)) {
      return;
    }

    if (introElement.duration - introElement.currentTime <= VIDEO_SWITCH_LEAD_SECONDS) {
      playLoopVideo();
    }
  }

  const handleIntroError = useCallback(() => {
    showFallback();
    playLoopVideo();
  }, [playLoopVideo, showFallback]);

  const handleLoopReady = useCallback(() => {
    if (hasSwitchedRef.current) {
      hideFallback();
    }
  }, [hideFallback]);

  const handleLoopError = useCallback(() => {
    hasLoopFailedRef.current = true;

    if (hasSwitchedRef.current) {
      showFallback();
    }
  }, [showFallback]);

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
      <div
        className={`scene-video-stack ${isLooping ? "is-looping" : ""} ${
          isFallbackVisible ? "is-fallback-visible" : ""
        }`}
      >
        <img
          className="scene-sofa-fallback"
          src={FALLBACK_IMAGE_SRC}
          width={1672}
          height={941}
          alt=""
          aria-hidden="true"
          loading="eager"
          decoding="async"
        />
        <video
          ref={introVideoRef}
          className="scene-sofa-video scene-sofa-video-intro"
          src="/videos/mirra-mascot-animation.mp4"
          poster={FALLBACK_IMAGE_SRC}
          width={1280}
          height={720}
          autoPlay
          muted
          playsInline
          preload="auto"
          onLoadedData={hideFallback}
          onPlaying={hideFallback}
          onTimeUpdate={handleIntroProgress}
          onEnded={playLoopVideo}
          onError={handleIntroError}
          aria-label="Mirra sitting on a warm brown sofa and looking at her phone"
        />
        <video
          ref={loopVideoRef}
          className="scene-sofa-video scene-sofa-video-loop"
          src="/videos/mirra-sofa-loop.mp4"
          poster={FALLBACK_IMAGE_SRC}
          width={1920}
          height={1080}
          autoPlay
          muted
          loop
          playsInline
          preload="auto"
          onLoadedData={handleLoopReady}
          onPlaying={handleLoopReady}
          onError={handleLoopError}
          aria-hidden
        />
      </div>
    </div>
  );
}
