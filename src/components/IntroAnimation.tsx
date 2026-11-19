import { useEffect, useState, useCallback } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { siteConfig } from '../config/siteConfig';
import { BullMascot, type IntroScene } from './BullMascot';

interface IntroAnimationProps {
  onComplete: () => void;
}

export function IntroAnimation({ onComplete }: IntroAnimationProps) {
  const [scene, setScene] = useState<IntroScene>(1);
  const [isSweeping, setIsSweeping] = useState(false);
  const [videoFailed, setVideoFailed] = useState(false);
  const [logoError, setLogoError] = useState(false);

  const hasCustomVideo = Boolean(
    siteConfig.media.introVideoWebmSrc || siteConfig.media.introVideoMp4Src
  );

  const finishIntro = useCallback(() => {
    try {
      sessionStorage.setItem(siteConfig.introStorageKey, '1');
    } catch {
      // Ignore storage access errors in restricted webviews
    }
    onComplete();
  }, [onComplete]);

  const handleSkip = useCallback(() => {
    setIsSweeping(true);
    window.setTimeout(finishIntro, 360);
  }, [finishIntro]);

  useEffect(() => {
    if (hasCustomVideo && !videoFailed) {
      const safetyTimer = window.setTimeout(() => {
        setIsSweeping(true);
        window.setTimeout(finishIntro, 420);
      }, 4500);
      return () => window.clearTimeout(safetyTimer);
    }

    const t1 = window.setTimeout(() => setScene(2), 950);
    const t2 = window.setTimeout(() => setScene(3), 2050);
    const t3 = window.setTimeout(() => {
      setScene(4);
      setIsSweeping(true);
    }, 3150);
    const t4 = window.setTimeout(() => {
      finishIntro();
    }, 3750);

    return () => {
      window.clearTimeout(t1);
      window.clearTimeout(t2);
      window.clearTimeout(t3);
      window.clearTimeout(t4);
    };
  }, [finishIntro, hasCustomVideo, videoFailed]);

  return (
    <motion.div
      className="fixed inset-0 h-[100dvh] z-50 flex flex-col items-center justify-center bg-[#080808] overflow-hidden select-none"
      initial={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.28, ease: [0.16, 1, 0.3, 1] }}
      aria-label="Introdução Touros Burguer"
    >
      {/* Subtle studio floor vignette */}
      <div
        className="pointer-events-none absolute inset-0"
        style={{
          background:
            'radial-gradient(circle at 50% 46%, rgba(255, 208, 0, 0.08) 0%, rgba(8, 8, 8, 0.94) 68%)',
        }}
        aria-hidden="true"
      />

      {/* Discreet Skip Button */}
      <motion.button
        type="button"
        onClick={handleSkip}
        whileTap={{ scale: 0.95 }}
        className="fixed top-4 right-4 z-50 min-h-[44px] px-4 py-2 rounded-lg text-xs font-semibold tracking-wider uppercase text-[#A5A5A5] hover:text-white bg-[#141413]/85 border border-white/10 backdrop-blur-sm transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#FFD000]"
        style={{ marginTop: 'env(safe-area-inset-top)' }}
      >
        Pular introdução
      </motion.button>

      {/* Main Intro Stage */}
      <div className="relative z-10 flex flex-col items-center justify-center w-full max-w-md px-6">
        {hasCustomVideo && !videoFailed ? (
          <video
            className="w-72 h-72 sm:w-80 sm:h-80 object-contain"
            autoPlay
            muted
            playsInline
            onEnded={() => {
              setIsSweeping(true);
              window.setTimeout(finishIntro, 420);
            }}
            onError={() => setVideoFailed(true)}
          >
            {siteConfig.media.introVideoWebmSrc && (
              <source src={siteConfig.media.introVideoWebmSrc} type="video/webm" />
            )}
            {siteConfig.media.introVideoMp4Src && (
              <source src={siteConfig.media.introVideoMp4Src} type="video/mp4" />
            )}
          </video>
        ) : (
          <BullMascot scene={scene} />
        )}

        {/* Official Logo Staging + Cinematic Progress Line */}
        <motion.div
          className="mt-2 flex flex-col items-center"
          initial={{ opacity: 0, y: 12, scale: 0.94 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          transition={{ duration: 0.55, delay: 0.14, ease: [0.16, 1, 0.3, 1] }}
        >
          {!logoError ? (
            <img
              src={siteConfig.media.logoSrc}
              alt="Touros Burguer"
              referrerPolicy="no-referrer"
              onError={() => setLogoError(true)}
              className="w-40 min-[390px]:w-44 sm:w-48 h-auto object-contain drop-shadow-[0_10px_24px_rgba(0,0,0,0.85)]"
            />
          ) : (
            <p className="font-display text-2xl sm:text-3xl tracking-wider text-white">
              TOUROS <span className="text-[#FFD000]">BURGUER</span>
            </p>
          )}

          {/* Sleek 2px Progress Bar */}
          <div className="mt-3.5 w-32 h-[2px] rounded-full bg-white/10 overflow-hidden">
            <motion.div
              className="h-full bg-[#FFD000]"
              initial={{ scaleX: 0 }}
              animate={{ scaleX: 1 }}
              transition={{ duration: 3.15, ease: 'linear' }}
              style={{ originX: 0 }}
            />
          </div>
        </motion.div>
      </div>

      {/* Staggered Diagonal Brand Slash Transition */}
      <AnimatePresence>
        {isSweeping && (
          <>
            <motion.div
              className="fixed inset-y-0 -inset-x-24 z-50 pointer-events-none"
              initial={{ x: '-110%', skewX: -12 }}
              animate={{ x: '115%', skewX: -12 }}
              transition={{ duration: 0.58, ease: [0.76, 0, 0.24, 1] }}
              style={{
                background:
                  'linear-gradient(90deg, #FFD000 0%, #FFDE24 55%, #FFD000 100%)',
              }}
            />
            <motion.div
              className="fixed inset-y-0 -inset-x-24 z-50 pointer-events-none bg-[#080808]"
              initial={{ x: '-115%', skewX: -12 }}
              animate={{ x: '115%', skewX: -12 }}
              transition={{ duration: 0.62, delay: 0.08, ease: [0.76, 0, 0.24, 1] }}
            />
          </>
        )}
      </AnimatePresence>
    </motion.div>
  );
}
