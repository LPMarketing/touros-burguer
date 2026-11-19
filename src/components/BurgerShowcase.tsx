import { useRef, useState } from 'react';
import { motion, useScroll, useTransform } from 'motion/react';
import { siteConfig } from '../config/siteConfig';
import { BrandMark } from './BrandMark';

interface BurgerShowcaseProps {
  ready: boolean;
  reducedMotion: boolean;
}

export function BurgerShowcase({ ready, reducedMotion }: BurgerShowcaseProps) {
  const [imgError, setImgError] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ['start end', 'end start'],
  });

  const parallaxY = useTransform(scrollYProgress, [0, 1], [8, -12]);
  const parallaxScale = useTransform(scrollYProgress, [0, 0.5, 1], [1.02, 1, 1.04]);

  return (
    <motion.div
      ref={containerRef}
      className="relative w-full mx-auto"
      initial={reducedMotion ? false : { opacity: 0, y: 20, scale: 0.97 }}
      animate={
        ready
          ? { opacity: 1, y: 0, scale: 1 }
          : { opacity: 0, y: 20, scale: 0.97 }
      }
      transition={{ duration: 0.6, delay: 0.1, ease: [0.16, 1, 0.3, 1] }}
    >
      {/* Subtle warm sunset glow behind main storefront showcase */}
      <div
        className="absolute -inset-2.5 rounded-3xl pointer-events-none"
        style={{
          background:
            'radial-gradient(circle at 50% 52%, rgba(255, 208, 0, 0.16) 0%, rgba(20, 20, 19, 0.4) 55%, transparent 78%)',
        }}
        aria-hidden="true"
      />

      <motion.div
        className="relative aspect-[16/10] sm:aspect-[16/9.5] w-full overflow-hidden rounded-2xl bg-[#141413] border border-white/10 shadow-[0_22px_46px_-18px_rgba(0,0,0,0.88)]"
        animate={
          ready && !reducedMotion
            ? { y: [0, -3, 0] }
            : { y: 0 }
        }
        transition={
          reducedMotion
            ? undefined
            : {
                duration: 6,
                repeat: Infinity,
                ease: 'easeInOut',
              }
        }
      >
        {!imgError ? (
          <motion.img
            src={siteConfig.media.heroBurgerSrc}
            alt="Fachada da Touros Burguer ao entardecer em Goiânia"
            referrerPolicy="no-referrer"
            onError={() => setImgError(true)}
            style={
              reducedMotion
                ? undefined
                : { y: parallaxY, scale: parallaxScale }
            }
            className="w-full h-full object-cover object-center select-none will-change-transform"
          />
        ) : (
          <div className="w-full h-full flex flex-col items-center justify-center gap-3 p-6 bg-gradient-to-b from-[#141413] to-[#080808]">
            <BrandMark className="w-14 h-14" />
            <p className="font-display text-xl tracking-wider text-white">
              TOUROS BURGUER
            </p>
          </div>
        )}

        {/* Measured edge vignette to anchor the storefront photo smoothly into #080808 */}
        <div
          className="absolute inset-0 pointer-events-none"
          style={{
            background:
              'linear-gradient(to top, rgba(8, 8, 8, 0.58) 0%, rgba(8, 8, 8, 0.04) 36%, rgba(8, 8, 8, 0.18) 100%)',
          }}
          aria-hidden="true"
        />
      </motion.div>
    </motion.div>
  );
}
