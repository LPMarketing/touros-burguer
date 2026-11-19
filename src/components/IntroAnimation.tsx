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
      }, 4600);
      return () => window.clearTimeout(safetyTimer);
    }

    const sweepTimer = window.setTimeout(() => {
      setScene(5);
      setIsSweeping(true);
    }, 3550);

    const completeTimer = window.setTimeout(() => {
      finishIntro();
    }, 4150);

    return () => {
      window.clearTimeout(sweepTimer);
      window.clearTimeout(completeTimer);
    };
  }, [finishIntro, hasCustomVideo, videoFailed]);

  return (
    <motion.div
      className="fixed inset-0 h-[100dvh] z-50 bg-[#080808] overflow-hidden select-none"
      initial={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.28, ease: [0.16, 1, 0.3, 1] }}
      aria-label="Introdução 3D Touros Burguer"
    >
      {/* Full-Viewport Open 3D Stage (no circular box) */}
      <div className="absolute inset-0 w-full h-full">
        {hasCustomVideo && !videoFailed ? (
          <div className="w-full h-full flex items-center justify-center">
            <video
              className="w-full max-w-md h-auto object-contain"
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
          </div>
        ) : (
          <BullMascot onSceneChange={setScene} />
        )}
      </div>

      {/* Discreet Skip Button (solid surface without backdrop-blur over WebGL) */}
      <motion.button
        type="button"
        onClick={handleSkip}
        whileTap={{ scale: 0.95 }}
        className="fixed top-4 right-4 z-50 min-h-[44px] px-4 py-2 rounded-lg text-xs font-semibold tracking-wider uppercase text-[#A5A5A5] hover:text-white bg-[#141413]/95 border border-white/15 transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#FFD000]"
        style={{ marginTop: 'env(safe-area-inset-top)' }}
      >
        Pular introdução
      </motion.button>

      {/* Bottom Brand Signature & Thin Progress Line */}
      <motion.div
        className="pointer-events-none fixed inset-x-0 bottom-0 z-20 flex flex-col items-center pb-8 pt-12 px-6"
        style={{
          paddingBottom: 'max(2rem, env(safe-area-inset-bottom))',
          background:
            'linear-gradient(to top, rgba(8, 8, 8, 0.95) 0%, rgba(8, 8, 8, 0.55) 55%, transparent 100%)',
        }}
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.15, ease: [0.16, 1, 0.3, 1] }}
      >
        {!logoError ? (
          <img
            src={siteConfig.media.logoSrc}
            alt="Touros Burguer"
            referrerPolicy="no-referrer"
            onError={() => setLogoError(true)}
            className="w-36 min-[390px]:w-40 sm:w-44 h-auto object-contain"
          />
        ) : (
          <p className="font-display text-2xl sm:text-3xl tracking-wider text-white">
            TOUROS <span className="text-[#FFD000]">BURGUER</span>
          </p>
        )}

        <div className="mt-3 w-36 h-[2px] rounded-full bg-white/15 overflow-hidden">
          <motion.div
            className="h-full bg-[#FFD000]"
            initial={{ scaleX: 0 }}
            animate={{ scaleX: scene >= 5 ? 1 : 1 }}
            transition={{ duration: 3.55, ease: 'linear' }}
            style={{ originX: 0 }}
          />
        </div>
      </motion.div>

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
