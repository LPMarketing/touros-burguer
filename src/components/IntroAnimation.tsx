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
    window.setTimeout(finishIntro, 320);
  }, [finishIntro]);

  useEffect(() => {
    if (hasCustomVideo && !videoFailed) {
      const safetyTimer = window.setTimeout(() => {
        setIsSweeping(true);
        window.setTimeout(finishIntro, 380);
      }, 4500);
      return () => window.clearTimeout(safetyTimer);
    }

    const t1 = window.setTimeout(() => setScene(2), 850);
    const t2 = window.setTimeout(() => setScene(3), 1850);
    const t3 = window.setTimeout(() => setScene(4), 2850);
    const t4 = window.setTimeout(() => {
      setScene(5);
      setIsSweeping(true);
    }, 3450);
    const t5 = window.setTimeout(() => {
      finishIntro();
    }, 3950);

    return () => {
      window.clearTimeout(t1);
      window.clearTimeout(t2);
      window.clearTimeout(t3);
      window.clearTimeout(t4);
      window.clearTimeout(t5);
    };
  }, [finishIntro, hasCustomVideo, videoFailed]);

  return (
    <motion.div
      className="fixed inset-0 h-[100dvh] z-50 flex flex-col items-center justify-center bg-[#080808] overflow-hidden select-none"
      initial={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.3, ease: [0.16, 1, 0.3, 1] }}
      aria-label="Introdução Touros Burguer"
    >
      <button
        type="button"
        onClick={handleSkip}
        className="fixed top-4 right-4 z-50 min-h-[44px] px-4 py-2 rounded-lg text-xs font-semibold tracking-wider uppercase text-[#A5A5A5] hover:text-white bg-[#141413]/80 border border-white/10 backdrop-blur-sm transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#FFD000] active:scale-[0.97]"
        style={{ marginTop: 'env(safe-area-inset-top)' }}
      >
        Pular introdução
      </button>

      <div className="relative flex flex-col items-center justify-center w-full max-w-md px-6">
        {hasCustomVideo && !videoFailed ? (
          <video
            className="w-72 h-72 sm:w-80 sm:h-80 object-contain"
            autoPlay
            muted
            playsInline
            onEnded={() => {
              setIsSweeping(true);
              window.setTimeout(finishIntro, 380);
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

        {/* Logo Oficial abaixo da cena de abertura */}
        <motion.div
          className="mt-2 flex items-center justify-center"
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.15, ease: [0.16, 1, 0.3, 1] }}
        >
          {!logoError ? (
            <img
              src={siteConfig.media.logoSrc}
              alt="Touros Burguer"
              referrerPolicy="no-referrer"
              onError={() => setLogoError(true)}
              className="w-36 sm:w-44 h-auto object-contain"
            />
          ) : (
            <p className="font-display text-2xl sm:text-3xl tracking-wider text-white">
              TOUROS <span className="text-[#FFD000]">BURGUER</span>
            </p>
          )}
        </motion.div>
      </div>

      <AnimatePresence>
        {isSweeping && (
          <motion.div
            className="fixed inset-0 z-50 pointer-events-none"
            initial={{ x: '-105%' }}
            animate={{ x: '105%' }}
            transition={{ duration: 0.62, ease: [0.65, 0, 0.35, 1] }}
            style={{
              background: 'linear-gradient(105deg, #FFD000 0%, #FFDE24 55%, #FFD000 100%)',
            }}
          />
        )}
      </AnimatePresence>
    </motion.div>
  );
}
