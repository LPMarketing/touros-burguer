import { useEffect, useState } from 'react';
import { AnimatePresence } from 'motion/react';
import { siteConfig } from './config/siteConfig';
import { IntroAnimation } from './components/IntroAnimation';
import { HeroSection } from './components/HeroSection';
import { LinksSection } from './components/LinksSection';
import { LocationSection } from './components/LocationSection';
import { InstagramFooter } from './components/InstagramFooter';

function getInitialReducedMotion(): boolean {
  if (typeof window === 'undefined') return false;
  return window.matchMedia('(prefers-reduced-motion: reduce)').matches;
}

function shouldShowIntroInitially(): boolean {
  if (typeof window === 'undefined') return false;
  if (getInitialReducedMotion()) return false;
  try {
    return sessionStorage.getItem(siteConfig.introStorageKey) !== '1';
  } catch {
    return true;
  }
}

export default function App() {
  const [reducedMotion, setReducedMotion] = useState<boolean>(getInitialReducedMotion);
  const [showIntro, setShowIntro] = useState<boolean>(shouldShowIntroInitially);
  const [contentReady, setContentReady] = useState<boolean>(!shouldShowIntroInitially());

  useEffect(() => {
    const mediaQuery = window.matchMedia('(prefers-reduced-motion: reduce)');
    const handleChange = (event: MediaQueryListEvent) => {
      setReducedMotion(event.matches);
      if (event.matches) {
        setShowIntro(false);
        setContentReady(true);
      }
    };
    mediaQuery.addEventListener('change', handleChange);
    return () => mediaQuery.removeEventListener('change', handleChange);
  }, []);

  const handleIntroComplete = () => {
    setShowIntro(false);
    setContentReady(true);
  };

  return (
    <div className="relative min-h-[100dvh] w-full bg-[#080808] text-white overflow-x-hidden">
      {/* Subtle ambient top studio glow */}
      <div
        className="pointer-events-none fixed inset-x-0 top-0 h-[360px]"
        style={{
          background:
            'radial-gradient(ellipse 85% 55% at 50% -10%, rgba(255, 208, 0, 0.09) 0%, transparent 72%)',
        }}
        aria-hidden="true"
      />

      {/* Cinematic Bull Mascot Intro (once per session, respects prefers-reduced-motion) */}
      <AnimatePresence>
        {showIntro && <IntroAnimation onComplete={handleIntroComplete} />}
      </AnimatePresence>

      {/* Main Touros Burguer Hub — First-fold tuned for mobile Instagram browser */}
      <main className="relative z-10 w-full max-w-[460px] lg:max-w-5xl mx-auto px-4 min-[390px]:px-5 sm:px-6 lg:px-10 pt-safe pt-4 sm:pt-8 lg:py-14">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-5 min-[390px]:gap-6 lg:gap-12 items-start">
          {/* Left Column (Mobile Top): Brand Hero */}
          <div className="lg:col-span-5 lg:sticky lg:top-12 space-y-4 min-[390px]:space-y-5 lg:space-y-6">
            <HeroSection ready={contentReady} reducedMotion={reducedMotion} />
          </div>

          {/* Right Column: Action Links + Location Experience */}
          <div className="lg:col-span-7 space-y-8 sm:space-y-10 lg:pt-2">
            <LinksSection ready={contentReady} reducedMotion={reducedMotion} />
            <LocationSection reducedMotion={reducedMotion} />
          </div>
        </div>

        <InstagramFooter />
      </main>
    </div>
  );
}
