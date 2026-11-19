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

  const parallaxY = useTransform(scrollYProgress, [0, 1], [10, -14]);
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
      {/* Subtle warm depth behind real burger photo */}
      <div
        className="absolute -inset-2.5 rounded-3xl pointer-events-none"
        style={{
          background:
            'radial-gradient(circle at 50% 52%, rgba(255, 208, 0, 0.14) 0%, rgba(20, 20, 19, 0.4) 55%, transparent 78%)',
        }}
        aria-hidden="true"
      />

      <motion.div
        className="relative aspect-[16/11] min-[390px]:aspect-[16/11.5] sm:aspect-[4/3.4] lg:aspect-[4/4.3] w-full overflow-hidden rounded-2xl bg-[#141413] border border-white/10 shadow-[0_22px_46px_-18px_rgba(0,0,0,0.88)]"
        animate={
          ready && !reducedMotion
            ? { y: [0, -4, 0] }
            : { y: 0 }
        }
        transition={
          reducedMotion
            ? undefined
            : {
                duration: 5.5,
                repeat: Infinity,
                ease: 'easeInOut',
              }
        }
      >
        {!imgError ? (
          <motion.img
            src={siteConfig.media.heroBurgerSrc}
            alt="Hambúrguer artesanal Touros Burguer com pão brioche, carne suculenta, queijo derretido e onion rings crocantes"
            referrerPolicy="no-referrer"
            onError={() => setImgError(true)}
            style={
              reducedMotion
                ? undefined
                : { y: parallaxY, scale: parallaxScale }
            }
            className="w-full h-full object-cover object-[50%_58%] select-none will-change-transform"
          />
        ) : (
          <div className="w-full h-full flex flex-col items-center justify-center gap-3 p-6 bg-gradient-to-b from-[#141413] to-[#080808]">
            <BrandMark className="w-14 h-14" />
            <p className="font-display text-xl tracking-wider text-white">
              TOUROS BURGUER
            </p>
          </div>
        )}

        {/* Measured edge vignette to anchor the real photo in the dark canvas */}
        <div
          className="absolute inset-0 pointer-events-none"
          style={{
            background:
              'linear-gradient(to top, rgba(8, 8, 8, 0.72) 0%, rgba(8, 8, 8, 0.06) 34%, rgba(8, 8, 8, 0.22) 100%)',
          }}
          aria-hidden="true"
        />
      </motion.div>
    </motion.div>
  );
}
