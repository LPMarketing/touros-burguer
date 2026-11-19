import { useState } from 'react';
import { motion } from 'motion/react';
import { siteConfig } from '../config/siteConfig';
import { BrandMark } from './BrandMark';

export type IntroScene = 1 | 2 | 3 | 4 | 5;

interface BullMascotProps {
  scene: IntroScene;
}

const EMBERS = [
  { id: 1, left: '18%', bottom: '12%', dx: -14, dy: -120, size: 4, delay: 0.1, dur: 2.2 },
  { id: 2, left: '82%', bottom: '16%', dx: 16, dy: -135, size: 3.5, delay: 0.35, dur: 2.5 },
  { id: 3, left: '30%', bottom: '8%', dx: 10, dy: -110, size: 3, delay: 0.6, dur: 2.0 },
  { id: 4, left: '72%', bottom: '10%', dx: -12, dy: -128, size: 3.5, delay: 0.25, dur: 2.4 },
  { id: 5, left: '48%', bottom: '18%', dx: 8, dy: -96, size: 3, delay: 0.8, dur: 2.1 },
  { id: 6, left: '60%', bottom: '14%', dx: -8, dy: -105, size: 2.8, delay: 0.5, dur: 2.3 },
];

export function BullMascot({ scene }: BullMascotProps) {
  const [imgError, setImgError] = useState(false);

  // Smooth, realistic camera choreography over a single cohesive 3D CGI asset
  // Scene 1: Dramatic reveal out of shadow
  // Scene 2: Smooth push-in toward burger & chest crest
  // Scene 3: Heroic pull-back with golden rim-light sweep
  const cameraAnimate =
    scene === 1
      ? { scale: 1.03, y: 0 }
      : scene === 2
        ? { scale: 1.15, y: -12 }
        : { scale: 1.01, y: 0 };

  return (
    <motion.div
      className="relative w-[290px] h-[290px] min-[390px]:w-[330px] min-[390px]:h-[330px] sm:w-[376px] sm:h-[376px] select-none"
      initial={{ opacity: 0, scale: 1.16 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.65, ease: [0.16, 1, 0.3, 1] }}
    >
      {/* Warm Golden Rim Aura behind CGI Bull */}
      <motion.div
        className="absolute -inset-4 rounded-full pointer-events-none"
        animate={{
          opacity: scene >= 3 ? 0.95 : 0.65,
          scale: scene === 2 ? 1.08 : 1,
        }}
        transition={{ duration: 0.8, ease: 'easeOut' }}
        style={{
          background:
            'radial-gradient(circle at 50% 44%, rgba(255, 208, 0, 0.22) 0%, rgba(255, 132, 0, 0.08) 46%, transparent 72%)',
        }}
        aria-hidden="true"
      />

      {/* Feathered Studio Frame so edges melt seamlessly into #080808 */}
      <div className="relative w-full h-full overflow-hidden rounded-full sm:rounded-3xl">
        <motion.div
          className="w-full h-full will-change-transform"
          animate={cameraAnimate}
          transition={{ duration: 0.95, ease: [0.16, 1, 0.3, 1] }}
        >
          {!imgError ? (
            <img
              src={siteConfig.media.introBullImageSrc}
              alt="Mascote 3D realista da Touros Burguer segurando um hambúrguer gourmet"
              referrerPolicy="no-referrer"
              onError={() => setImgError(true)}
              className="w-full h-full object-cover object-center"
            />
          ) : (
            <div className="w-full h-full flex items-center justify-center bg-[#141413]">
              <BrandMark className="w-20 h-20" />
            </div>
          )}
        </motion.div>

        {/* Radial Feathered Vignette blending pitch-black edges into canvas */}
        <div
          className="pointer-events-none absolute inset-0"
          style={{
            background:
              'radial-gradient(circle at 50% 46%, transparent 48%, rgba(8, 8, 8, 0.65) 72%, #080808 96%)',
          }}
          aria-hidden="true"
        />

        {/* Subtle Specular Golden Sweep across scene 2->3 */}
        <motion.div
          className="pointer-events-none absolute inset-y-0 w-28 -skew-x-12 bg-gradient-to-r from-transparent via-[#FFD000]/20 to-transparent"
          initial={{ x: '-140%' }}
          animate={{ x: scene >= 2 ? '420%' : '-140%' }}
          transition={{ duration: 1.15, ease: [0.22, 1, 0.36, 1] }}
          aria-hidden="true"
        />
      </div>

      {/* Floating Grill Embers */}
      <div className="pointer-events-none absolute inset-0 overflow-visible" aria-hidden="true">
        {EMBERS.map((ember) => (
          <motion.span
            key={ember.id}
            className="absolute rounded-full"
            style={{
              left: ember.left,
              bottom: ember.bottom,
              width: ember.size,
              height: ember.size,
              backgroundColor: ember.id % 2 === 0 ? '#FFD000' : '#FF8A00',
            }}
            initial={{ opacity: 0, x: 0, y: 0 }}
            animate={{
              opacity: [0, 0.85, 0],
              x: ember.dx,
              y: ember.dy,
            }}
            transition={{
              duration: ember.dur,
              delay: ember.delay,
              repeat: Infinity,
              ease: 'easeOut',
            }}
          />
        ))}
      </div>
    </motion.div>
  );
}
