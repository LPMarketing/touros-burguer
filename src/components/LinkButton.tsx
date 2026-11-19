import { useRef, type MouseEvent, type ReactNode } from 'react';
import { motion } from 'motion/react';
import { ArrowRight, ArrowUpRight } from 'lucide-react';

interface LinkButtonProps {
  title: string;
  subtitle: string;
  href?: string;
  onClick?: () => void;
  icon: ReactNode;
  layout?: 'wide' | 'tile';
  variant?: 'primary' | 'secondary';
  spotlightColor?: string;
  accentHoverClass?: string;
  index: number;
  ready: boolean;
  reducedMotion: boolean;
}

export function LinkButton({
  title,
  subtitle,
  href,
  onClick,
  icon,
  layout = 'wide',
  variant = 'secondary',
  spotlightColor = 'rgba(255, 208, 0, 0.14)',
  accentHoverClass = 'hover:border-[#FFD000]/50',
  index,
  ready,
  reducedMotion,
}: LinkButtonProps) {
  const cardRef = useRef<HTMLDivElement>(null);
  const isPrimary = variant === 'primary';
  const isTile = layout === 'tile';

  const handleMouseMove = (e: MouseEvent<HTMLDivElement>) => {
    if (reducedMotion || !cardRef.current) return;
    const rect = cardRef.current.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    cardRef.current.style.setProperty('--mx', `${x}px`);
    cardRef.current.style.setProperty('--my', `${y}px`);
  };

  const containerClasses = isPrimary
    ? 'group relative overflow-hidden flex items-center justify-between gap-3.5 w-full min-h-[76px] min-[390px]:min-h-[82px] px-4 min-[390px]:px-5 py-3.5 rounded-2xl bg-gradient-to-br from-[#FFDE24] via-[#FFD000] to-[#EAB800] text-[#080808] shadow-[0_14px_34px_-12px_rgba(255,208,0,0.5)] transition-colors duration-150 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#FFDE24] focus-visible:ring-offset-2 focus-visible:ring-offset-[#080808]'
    : isTile
      ? `group relative overflow-hidden flex flex-col justify-between gap-3.5 w-full min-h-[144px] min-[390px]:min-h-[156px] p-3.5 min-[390px]:p-4 sm:p-5 rounded-2xl bg-[#141413] active:bg-[#1E1E1B] hover:bg-[#191917] text-white border border-white/10 ${accentHoverClass} transition-colors duration-150 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#FFD000] focus-visible:ring-offset-2 focus-visible:ring-offset-[#080808]`
      : `group relative overflow-hidden flex items-center justify-between gap-3.5 w-full min-h-[72px] min-[390px]:min-h-[76px] px-4 min-[390px]:px-5 py-3.5 rounded-2xl bg-[#141413] active:bg-[#1E1E1B] hover:bg-[#191917] text-white border border-white/10 ${accentHoverClass} transition-colors duration-150 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#FFD000] focus-visible:ring-offset-2 focus-visible:ring-offset-[#080808]`;

  const innerContent = isTile ? (
    <>
      {/* Subtle touch/hover ambient aura in tile corner */}
      <div
        className="pointer-events-none absolute -top-8 -left-8 w-28 h-28 rounded-full opacity-35 group-hover:opacity-65 group-active:opacity-80 transition-opacity duration-200 blur-2xl"
        style={{ background: spotlightColor }}
        aria-hidden="true"
      />

      {/* Desktop interactive pointer spotlight */}
      <div
        className="pointer-events-none absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-300"
        style={{
          background: `radial-gradient(220px circle at var(--mx, 50%) var(--my, 35%), ${spotlightColor}, transparent 70%)`,
        }}
        aria-hidden="true"
      />

      {/* Top row: expressive icon + corner action arrow */}
      <div className="relative z-10 flex items-start justify-between w-full">
        <div className="transition-transform duration-200 group-hover:scale-105 group-hover:-rotate-3 group-active:scale-95">
          {icon}
        </div>
        <div className="flex items-center justify-center w-8 h-8 rounded-full bg-white/[0.05] border border-white/10 text-[#A5A5A5] group-hover:text-white group-hover:border-white/25 transition-all duration-200">
          <ArrowUpRight
            className="w-4 h-4 transition-transform duration-200 group-hover:translate-x-0.5 group-hover:-translate-y-0.5"
            aria-hidden="true"
          />
        </div>
      </div>

      {/* Bottom row: mobile-safe typography */}
      <div className="relative z-10 flex flex-col text-left">
        <span className="font-display text-[18px] min-[390px]:text-[20px] sm:text-[22px] tracking-wide text-white leading-tight whitespace-nowrap">
          {title}
        </span>
        <span className="mt-1 text-[11px] min-[390px]:text-xs font-medium text-[#A5A5A5] leading-snug">
          {subtitle}
        </span>
      </div>
    </>
  ) : (
    <>
      {/* Special shimmer sweep on primary yellow CTA */}
      {isPrimary && !reducedMotion && (
        <motion.div
          className="pointer-events-none absolute inset-y-0 w-24 -skew-x-12 bg-gradient-to-r from-transparent via-white/45 to-transparent"
          initial={{ x: '-140%' }}
          animate={{ x: ['140%', '140%', '-140%'] }}
          transition={{
            duration: 3.6,
            repeat: Infinity,
            repeatDelay: 2.2,
            ease: 'easeInOut',
          }}
          aria-hidden="true"
        />
      )}

      {/* Subtle corner aura on wide secondary card */}
      {!isPrimary && (
        <>
          <div
            className="pointer-events-none absolute -left-8 top-1/2 -translate-y-1/2 w-28 h-28 rounded-full opacity-35 group-hover:opacity-65 group-active:opacity-80 transition-opacity duration-200 blur-2xl"
            style={{ background: spotlightColor }}
            aria-hidden="true"
          />
          <div
            className="pointer-events-none absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-300"
            style={{
              background: `radial-gradient(260px circle at var(--mx, 25%) var(--my, 50%), ${spotlightColor}, transparent 72%)`,
            }}
            aria-hidden="true"
          />
        </>
      )}

      <div className="relative z-10 flex items-center gap-3 min-[390px]:gap-3.5 sm:gap-4 min-w-0">
        <div className="shrink-0 transition-transform duration-200 group-hover:scale-105 group-hover:-rotate-3 group-active:scale-95">
          {icon}
        </div>
        <div className="flex flex-col text-left min-w-0">
          <span
            className={`font-display text-[20px] min-[390px]:text-[22px] sm:text-[23px] tracking-wide leading-tight truncate ${
              isPrimary ? 'text-[#080808]' : 'text-white'
            }`}
          >
            {title}
          </span>
          <span
            className={`text-xs sm:text-[13px] leading-snug truncate ${
              isPrimary
                ? 'text-[#080808]/80 font-bold'
                : 'text-[#A5A5A5] font-medium'
            }`}
          >
            {subtitle}
          </span>
        </div>
      </div>

      <div
        className={`relative z-10 flex items-center justify-center w-9 h-9 rounded-full shrink-0 transition-all duration-200 ${
          isPrimary
            ? 'bg-[#080808]/10 text-[#080808] group-hover:bg-[#080808] group-hover:text-[#FFD000]'
            : 'bg-white/[0.05] border border-white/10 text-[#A5A5A5] group-hover:text-white group-hover:border-white/25'
        }`}
      >
        <ArrowRight
          className="w-4 h-4 transition-transform duration-200 group-hover:translate-x-0.5"
          aria-hidden="true"
        />
      </div>
    </>
  );

  const tapSpring = reducedMotion
    ? undefined
    : { scale: 0.965, transition: { type: 'spring' as const, stiffness: 520, damping: 30 } };

  return (
    <motion.div
      ref={cardRef}
      onMouseMove={handleMouseMove}
      className={isTile ? 'col-span-1' : 'col-span-2'}
      initial={reducedMotion ? false : { opacity: 0, y: 14 }}
      animate={ready ? { opacity: 1, y: 0 } : { opacity: 0, y: 14 }}
      transition={{
        duration: 0.42,
        delay: 0.14 + index * 0.05,
        ease: [0.16, 1, 0.3, 1],
      }}
    >
      {href ? (
        <motion.a
          href={href}
          target="_blank"
          rel="noopener noreferrer"
          whileTap={tapSpring}
          className={containerClasses}
        >
          {innerContent}
        </motion.a>
      ) : (
        <motion.button
          type="button"
          onClick={onClick}
          whileTap={tapSpring}
          className={containerClasses}
        >
          {innerContent}
        </motion.button>
      )}
    </motion.div>
  );
}
