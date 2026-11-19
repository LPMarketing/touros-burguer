import { useState } from 'react';
import { motion } from 'motion/react';
import { Navigation } from 'lucide-react';
import { siteConfig } from '../config/siteConfig';

interface LocationSectionProps {
  reducedMotion: boolean;
}

function BullHeadPinMarker({ reducedMotion }: { reducedMotion: boolean }) {
  return (
    <motion.a
      href={siteConfig.mapsUrl}
      target="_blank"
      rel="noopener noreferrer"
      aria-label="Abrir localização da Touros Burguer no Google Maps"
      whileTap={reducedMotion ? undefined : { scale: 0.92 }}
      className="relative flex items-center justify-center w-28 h-28 rounded-full focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#FFD000]"
    >
      {/* Ondas de radar pulsando / pingando na localização */}
      {!reducedMotion && (
        <>
          <motion.span
            className="absolute w-14 h-14 rounded-full border-2 border-[#FFD000]/75"
            initial={{ scale: 0.45, opacity: 0.85 }}
            animate={{ scale: 2.25, opacity: 0 }}
            transition={{
              duration: 2.1,
              repeat: Infinity,
              ease: 'easeOut',
            }}
          />
          <motion.span
            className="absolute w-14 h-14 rounded-full border border-[#FFDE24]/55"
            initial={{ scale: 0.45, opacity: 0.7 }}
            animate={{ scale: 2.25, opacity: 0 }}
            transition={{
              duration: 2.1,
              delay: 1.05,
              repeat: Infinity,
              ease: 'easeOut',
            }}
          />
        </>
      )}

      {/* Sombra no chão do mapa sincronizada com a cabeça de touro pingando */}
      <motion.span
        className="absolute bottom-5 w-7 h-2 rounded-full bg-[#FFD000]/45 blur-[2px]"
        animate={
          reducedMotion
            ? undefined
            : { scaleX: [1, 0.72, 1], opacity: [0.6, 0.3, 0.6] }
        }
        transition={{
          duration: 1.4,
          repeat: Infinity,
          ease: 'easeInOut',
        }}
        aria-hidden="true"
      />

      {/* Cabeça de Touro estilizada em formato de Pin pingando no ponto exato */}
      <motion.div
        className="relative z-10 -mt-3"
        animate={
          reducedMotion
            ? undefined
            : { y: [0, -8, 0] }
        }
        transition={{
          duration: 1.4,
          repeat: Infinity,
          ease: [0.37, 0, 0.63, 1],
        }}
      >
        <svg
          viewBox="0 0 80 88"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
          className="w-16 h-[70px] drop-shadow-[0_10px_18px_rgba(0,0,0,0.85)]"
          aria-hidden="true"
        >
          <path d="M40 84L31 64H49L40 84Z" fill="#FFD000" />
          <circle cx="40" cy="44" r="24" fill="#080808" stroke="#FFD000" strokeWidth="3" />
          <path d="M22 33C13 28 9 18 13 8C15 15 20 20 27 22Z" fill="#FFD000" />
          <path d="M58 33C67 28 71 18 67 8C65 15 60 20 53 22Z" fill="#FFD000" />
          <path
            d="M25 27C25 22 31 19 40 19C49 19 55 22 55 27L53 43C52 50 47 56 40 56C33 56 28 50 27 43L25 27Z"
            fill="#FFD000"
          />
          <path d="M29 29L36 33" stroke="#080808" strokeWidth="2.6" strokeLinecap="round" />
          <path d="M51 29L44 33" stroke="#080808" strokeWidth="2.6" strokeLinecap="round" />
          <path d="M30 34L36 36L32 39Z" fill="#080808" />
          <path d="M50 34L44 36L48 39Z" fill="#080808" />
          <ellipse cx="40" cy="48" rx="8.5" ry="5.5" fill="#080808" />
          <circle cx="36.8" cy="47.8" r="1.5" fill="#FFD000" />
          <circle cx="43.2" cy="47.8" r="1.5" fill="#FFD000" />
        </svg>
      </motion.div>
    </motion.a>
  );
}

export function LocationSection({ reducedMotion }: LocationSectionProps) {
  const [photoError, setPhotoError] = useState(false);
  const hasRealPhoto =
    siteConfig.media.locationPhotoSrc.trim().length > 0 && !photoError;

  return (
    <motion.section
      aria-labelledby="location-heading"
      className="w-full"
      initial={reducedMotion ? false : { opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.15 }}
      transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
    >
      {/* Cabeçalho da Seção */}
      <div className="mb-3.5 sm:mb-4">
        <h2
          id="location-heading"
          className="font-display uppercase tracking-wide text-2xl sm:text-[28px] text-white leading-tight text-balance"
        >
          {siteConfig.locationTitle}
        </h2>
        <p className="mt-1 text-sm text-[#A5A5A5] font-medium">
          {siteConfig.locationSubtitle}
        </p>
      </div>

      {/* Card com Mapinha Dark Mode de Goiânia + Cabeça de Touro Pingando */}
      <div className="relative overflow-hidden rounded-2xl border border-white/10 bg-[#111110] min-h-[296px] sm:min-h-[330px] flex flex-col justify-between">
        {hasRealPhoto && (
          <img
            src={siteConfig.media.locationPhotoSrc}
            alt="Ambiente da Touros Burguer no Setor Cristina em Goiânia"
            referrerPolicy="no-referrer"
            onError={() => setPhotoError(true)}
            className="absolute inset-0 w-full h-full object-cover object-center opacity-35"
          />
        )}

        {/* Mapinha Dark Vetorial do Setor Cristina — Goiânia, GO */}
        <div className="absolute inset-0 pointer-events-none" aria-hidden="true">
          <svg
            className="w-full h-full"
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 560 360"
            preserveAspectRatio="xMidYMid slice"
          >
            <rect width="560" height="360" fill="#10100F" />

            <g fill="#181816" stroke="#222220" strokeWidth="1">
              <rect x="28" y="24" width="84" height="58" rx="5" />
              <rect x="128" y="24" width="96" height="58" rx="5" />
              <rect x="242" y="24" width="108" height="52" rx="5" />
              <rect x="370" y="24" width="92" height="62" rx="5" />
              <rect x="476" y="24" width="64" height="62" rx="5" />

              <rect x="28" y="98" width="84" height="72" rx="5" />
              <rect x="128" y="98" width="96" height="68" rx="5" />
              <rect x="242" y="92" width="108" height="74" rx="5" />
              <rect x="370" y="102" width="88" height="64" rx="5" />
              <rect x="476" y="102" width="64" height="64" rx="5" />

              <rect x="34" y="188" width="78" height="68" rx="5" />
              <rect x="128" y="182" width="96" height="72" rx="5" />
              <rect x="242" y="182" width="108" height="72" rx="5" />
              <rect x="370" y="182" width="96" height="72" rx="5" />
            </g>

            <rect x="374" y="106" width="80" height="56" rx="5" fill="#162218" opacity="0.7" />

            <g stroke="#292926" strokeWidth="5" strokeLinecap="round">
              <path d="M0 90 H560" />
              <path d="M0 174 H560" />
              <path d="M120 0 V360" />
              <path d="M233 0 V360" />
              <path d="M360 0 V360" />
              <path d="M468 0 V360" />
            </g>

            <path
              d="M-10 218 Q180 164 280 174 T570 118"
              fill="none"
              stroke="#34342F"
              strokeWidth="10"
              strokeLinecap="round"
            />
            <path
              d="M-10 218 Q180 164 280 174 T570 118"
              fill="none"
              stroke="#FFD000"
              strokeOpacity="0.24"
              strokeWidth="2"
              strokeDasharray="6 6"
            />

            <circle cx="233" cy="174" r="14" fill="#10100F" stroke="#34342F" strokeWidth="5" />

            <text
              x="44"
              y="167"
              fill="#6F6F69"
              fontFamily="Manrope, sans-serif"
              fontSize="8.5"
              fontWeight="700"
              letterSpacing="1.1"
            >
              SETOR CRISTINA
            </text>
            <text
              x="388"
              y="138"
              fill="#6F6F69"
              fontFamily="Manrope, sans-serif"
              fontSize="8"
              fontWeight="700"
              letterSpacing="0.8"
            >
              GOIÂNIA · GO
            </text>
          </svg>

          <div
            className="absolute inset-0"
            style={{
              background:
                'radial-gradient(circle at 50% 44%, rgba(255, 208, 0, 0.11) 0%, rgba(8, 8, 8, 0.25) 48%, rgba(8, 8, 8, 0.9) 100%)',
            }}
          />
        </div>

        <div
          className="absolute inset-0 pointer-events-none"
          style={{
            background:
              'linear-gradient(to top, rgba(8, 8, 8, 0.97) 0%, rgba(8, 8, 8, 0.78) 42%, rgba(8, 8, 8, 0.08) 100%)',
          }}
          aria-hidden="true"
        />

        {/* Coordenadas discretas no topo do mapinha */}
        <div className="relative z-10 px-4 sm:px-5 pt-4 flex items-center justify-between">
          <span className="text-[11px] font-semibold tracking-wider text-[#A5A5A5]/80 tabular-nums">
            {siteConfig.locationCoordinates}
          </span>
          <span className="text-[11px] font-semibold tracking-wider uppercase text-[#FFD000]/90">
            Setor Cristina
          </span>
        </div>

        {/* Cabeça de Touro Pingando (clicável para abrir o mapa no celular) */}
        <div className="relative z-10 flex-1 flex items-center justify-center py-2">
          <BullHeadPinMarker reducedMotion={reducedMotion} />
        </div>

        {/* Informações e Botão Amarelo TRAÇAR ROTA */}
        <div className="relative z-10 p-4 sm:p-6 flex flex-col sm:flex-row sm:items-end justify-between gap-3.5 sm:gap-4">
          <div>
            <p className="font-display uppercase tracking-wider text-xl sm:text-2xl text-white leading-none">
              {siteConfig.locationCtaTitle}
            </p>
            <p className="mt-1 text-sm text-[#A5A5A5] font-medium">
              {siteConfig.locationAddress}
            </p>
          </div>

          <motion.a
            href={siteConfig.mapsUrl}
            target="_blank"
            rel="noopener noreferrer"
            whileTap={reducedMotion ? undefined : { scale: 0.965 }}
            className="inline-flex items-center justify-center gap-2 w-full sm:w-auto min-h-[48px] px-5 py-2.5 rounded-xl bg-[#FFD000] hover:bg-[#FFDE24] text-[#080808] font-bold text-xs sm:text-sm tracking-wider uppercase whitespace-nowrap shrink-0 transition-colors duration-150 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#FFDE24] focus-visible:ring-offset-2 focus-visible:ring-offset-[#080808]"
          >
            <Navigation className="w-4 h-4 shrink-0" strokeWidth={2.4} aria-hidden="true" />
            <span>TRAÇAR ROTA</span>
          </motion.a>
        </div>
      </div>
    </motion.section>
  );
}
