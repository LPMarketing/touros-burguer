import { useState } from 'react';
import { motion } from 'motion/react';
import { siteConfig } from '../config/siteConfig';
import { BrandMark } from './BrandMark';

interface HeroSectionProps {
  ready: boolean;
  reducedMotion: boolean;
}

export function HeroSection({ ready, reducedMotion }: HeroSectionProps) {
  const [logoError, setLogoError] = useState(false);

  return (
    <motion.header
      className="flex flex-col items-center lg:items-start text-center lg:text-left"
      initial={reducedMotion ? false : { opacity: 0, y: 16 }}
      animate={ready ? { opacity: 1, y: 0 } : { opacity: 0, y: 16 }}
      transition={{ duration: 0.5, delay: 0.04, ease: [0.16, 1, 0.3, 1] }}
    >
      {/* Logo Oficial Touros Burguer */}
      <div className="relative mb-2 sm:mb-3.5 flex items-center justify-center lg:justify-start">
        <div
          className="absolute -inset-5 rounded-full pointer-events-none"
          style={{
            background:
              'radial-gradient(circle, rgba(255, 208, 0, 0.14) 0%, transparent 68%)',
          }}
          aria-hidden="true"
        />
        {!logoError ? (
          <img
            src={siteConfig.media.logoSrc}
            alt="Logo oficial Touros Burguer"
            referrerPolicy="no-referrer"
            onError={() => setLogoError(true)}
            className="relative w-36 min-[390px]:w-40 sm:w-44 lg:w-52 h-auto object-contain select-none drop-shadow-[0_10px_24px_rgba(0,0,0,0.75)]"
          />
        ) : (
          <div className="flex items-center gap-3">
            <BrandMark className="w-11 h-11 shrink-0" />
            <span className="font-display text-3xl tracking-wider text-white">
              TOUROS <span className="text-[#FFD000]">BURGUER</span>
            </span>
          </div>
        )}
      </div>

      <h1
        className="font-display uppercase tracking-wide text-white leading-[0.94] text-balance"
        style={{ fontSize: 'clamp(2.2rem, 8.8vw, 3.85rem)' }}
      >
        <span className="sr-only">{siteConfig.brand} — </span>
        {siteConfig.slogan}
      </h1>

      {/* Sutil detalhe amarelo abaixo do título */}
      <div
        className="mt-2.5 mb-2.5 h-[3px] w-12 sm:w-14 rounded-full bg-[#FFD000]"
        aria-hidden="true"
      />

      <p className="text-[13px] min-[390px]:text-sm sm:text-[15px] text-[#A5A5A5] font-medium leading-snug max-w-[34ch]">
        {siteConfig.sinceText}
      </p>
    </motion.header>
  );
}
