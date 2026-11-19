import { motion } from 'motion/react';

export type IntroScene = 1 | 2 | 3 | 4 | 5;

interface BullMascotProps {
  scene: IntroScene;
}

const CRUMBS = [
  { id: 1, cx: 196, cy: 186, dx: -26, dy: 56, rot: -45, size: 4.2, delay: 0.08 },
  { id: 2, cx: 218, cy: 192, dx: 24, dy: 64, rot: 55, size: 3.4, delay: 0.12 },
  { id: 3, cx: 188, cy: 198, dx: -14, dy: 48, rot: -25, size: 2.8, delay: 0.16 },
  { id: 4, cx: 226, cy: 188, dx: 30, dy: 52, rot: 70, size: 3.8, delay: 0.1 },
  { id: 5, cx: 208, cy: 196, dx: 4, dy: 68, rot: 20, size: 3.0, delay: 0.18 },
];

const EMBERS = [
  { id: 1, x: 96, y: 340, dx: -12, dy: -160, size: 2.8, delay: 0.1, dur: 2.4 },
  { id: 2, x: 326, y: 350, dx: 14, dy: -180, size: 3.2, delay: 0.4, dur: 2.6 },
  { id: 3, x: 138, y: 370, dx: 8, dy: -145, size: 2.2, delay: 0.7, dur: 2.2 },
  { id: 4, x: 288, y: 360, dx: -10, dy: -170, size: 2.5, delay: 0.25, dur: 2.5 },
  { id: 5, x: 74, y: 290, dx: 10, dy: -130, size: 2.0, delay: 0.9, dur: 2.1 },
  { id: 6, x: 344, y: 285, dx: -8, dy: -135, size: 2.4, delay: 0.55, dur: 2.3 },
];

export function BullMascot({ scene }: BullMascotProps) {
  const isBiteOne = scene === 2;
  const isBiteTwo = scene === 3;
  const isChewing = scene === 2 || scene === 3;
  const isFinished = scene >= 4;

  const burgerStage = scene === 1 ? 0 : scene === 2 ? 1 : scene === 3 ? 2 : 3;
  const burgerTargetY = scene === 1 ? 0 : scene === 2 ? -50 : scene === 3 ? -54 : 26;
  const burgerScale = scene === 1 ? 1 : scene === 2 ? 0.95 : scene === 3 ? 0.88 : 0.4;

  return (
    <motion.div
      className="relative w-[280px] h-[300px] min-[390px]:w-[324px] min-[390px]:h-[346px] sm:w-[370px] sm:h-[390px] select-none"
      initial={{ scale: 1.14, opacity: 0 }}
      animate={{
        scale:
          scene === 1
            ? 1
            : scene === 2
              ? 1.05
              : scene === 3
                ? 1.08
                : 1.03,
        x: isBiteOne || isBiteTwo ? [0, -3, 3, -1.5, 0] : 0,
        y: isBiteOne || isBiteTwo ? [0, 3, -2, 1, 0] : 0,
        opacity: 1,
      }}
      transition={{
        scale: { duration: 0.75, ease: [0.16, 1, 0.3, 1] },
        opacity: { duration: 0.45, ease: 'easeOut' },
        x: { duration: 0.32, delay: 0.12, ease: 'easeOut' },
        y: { duration: 0.32, delay: 0.12, ease: 'easeOut' },
      }}
    >
      {/* Dramatic Grill / Rim Backlight */}
      <motion.div
        className="absolute inset-2 rounded-full pointer-events-none"
        animate={{
          scale: isFinished ? [1, 1.1, 1.04] : [0.95, 1.04, 0.98],
          opacity: isFinished ? 0.95 : 0.75,
        }}
        transition={{ duration: 1.4, ease: 'easeInOut' }}
        style={{
          background:
            'radial-gradient(circle at 50% 42%, rgba(255, 208, 0, 0.24) 0%, rgba(255, 136, 0, 0.08) 42%, transparent 72%)',
        }}
      />

      <svg
        viewBox="0 0 420 420"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        className="w-full h-full overflow-visible"
        role="img"
        aria-label="Mascote Touro da Touros Burguer comendo um hambúrguer gourmet"
      >
        <defs>
          {/* High-contrast Stylized 3D Shading */}
          <radialGradient id="furChiseled" cx="46%" cy="32%" r="68%">
            <stop offset="0%" stopColor="#9C5D34" />
            <stop offset="52%" stopColor="#6D3A1C" />
            <stop offset="100%" stopColor="#2F1508" />
          </radialGradient>

          <radialGradient id="furShadow" cx="50%" cy="25%" r="72%">
            <stop offset="0%" stopColor="#773F1E" />
            <stop offset="100%" stopColor="#261005" />
          </radialGradient>

          <radialGradient id="snoutSculpt" cx="50%" cy="32%" r="65%">
            <stop offset="0%" stopColor="#CA926B" />
            <stop offset="65%" stopColor="#9B633F" />
            <stop offset="100%" stopColor="#61371E" />
          </radialGradient>

          <linearGradient id="hornIvory" x1="0" y1="0" x2="1" y2="1">
            <stop offset="0%" stopColor="#FFF8E2" />
            <stop offset="52%" stopColor="#E6CE92" />
            <stop offset="100%" stopColor="#9A7222" />
          </linearGradient>

          <linearGradient id="apronLeather" x1="210" y1="205" x2="210" y2="400" gradientUnits="userSpaceOnUse">
            <stop offset="0%" stopColor="#242422" />
            <stop offset="55%" stopColor="#141413" />
            <stop offset="100%" stopColor="#080808" />
          </linearGradient>

          <linearGradient id="goldShine" x1="0" y1="0" x2="1" y2="1">
            <stop offset="0%" stopColor="#FFDE24" />
            <stop offset="55%" stopColor="#FFD000" />
            <stop offset="100%" stopColor="#C48B00" />
          </linearGradient>

          <linearGradient id="briocheTop" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="#F8B554" />
            <stop offset="55%" stopColor="#D87D20" />
            <stop offset="100%" stopColor="#8F430B" />
          </linearGradient>

          <linearGradient id="briocheBottom" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="#DC8124" />
            <stop offset="100%" stopColor="#853F0A" />
          </linearGradient>

          <linearGradient id="searedPatty" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="#5F2E18" />
            <stop offset="100%" stopColor="#260E05" />
          </linearGradient>

          {/* Scalloped Bite Masks for realistic progressive bites */}
          <clipPath id="burgerBiteClip">
            {burgerStage === 0 && <rect x="80" y="150" width="260" height="210" />}
            {burgerStage === 1 && (
              <path d="M80 150 H226 C220 166 230 176 242 178 C240 192 252 200 266 196 C276 193 284 185 292 176 V360 H80 Z" />
            )}
            {burgerStage === 2 && (
              <path d="M80 178 H182 C178 194 188 206 202 208 C202 222 216 230 230 226 C242 222 252 214 260 205 V360 H80 Z" />
            )}
            {burgerStage === 3 && <rect x="0" y="0" width="0" height="0" />}
          </clipPath>
        </defs>

        {/* Rising Charcoal / Grill Embers */}
        {EMBERS.map((e) => (
          <motion.circle
            key={e.id}
            cx={e.x}
            cy={e.y}
            r={e.size}
            fill={e.id % 2 === 0 ? '#FFD000' : '#FF8A00'}
            initial={{ opacity: 0, y: 0, x: 0 }}
            animate={{
              opacity: [0, 0.85, 0],
              y: e.dy,
              x: e.dx,
            }}
            transition={{
              duration: e.dur,
              delay: e.delay,
              repeat: Infinity,
              ease: 'easeOut',
            }}
          />
        ))}

        {/* Ground Shadow */}
        <ellipse cx="210" cy="400" rx="122" ry="15" fill="#000000" fillOpacity="0.65" />

        {/* Muscular Torso & Shoulders */}
        <motion.g
          animate={{
            y: isChewing ? [0, -3.5, 0] : [0, -2, 0],
          }}
          transition={{
            duration: isChewing ? 0.3 : 2.2,
            repeat: Infinity,
            ease: 'easeInOut',
          }}
        >
          {/* Broad Muscular Shoulders */}
          <path
            d="M104 264 C104 202 150 172 210 172 C270 172 316 202 316 264 L328 386 C328 394 314 398 300 398 H120 C106 398 92 394 92 386 Z"
            fill="url(#furShadow)"
          />

          {/* Rim Light Edge on Shoulders */}
          <path
            d="M106 254 C112 208 148 182 184 176"
            stroke="#FFD000"
            strokeOpacity="0.32"
            strokeWidth="2.5"
            strokeLinecap="round"
          />
          <path
            d="M314 254 C308 208 272 182 236 176"
            stroke="#FFD000"
            strokeOpacity="0.32"
            strokeWidth="2.5"
            strokeLinecap="round"
          />

          {/* Black Grillmaster Apron */}
          <path
            d="M138 222 L160 212 H260 L282 222 L298 390 C298 395 290 398 282 398 H138 C130 398 122 395 122 390 Z"
            fill="url(#apronLeather)"
            stroke="#343430"
            strokeWidth="1.6"
          />
          {/* Apron Yellow Straps & Stitching */}
          <path d="M156 184 L164 226" stroke="#FFD000" strokeWidth="8.5" strokeLinecap="round" />
          <path d="M264 184 L256 226" stroke="#FFD000" strokeWidth="8.5" strokeLinecap="round" />
          <circle cx="164" cy="226" r="4.2" fill="#FFDE24" />
          <circle cx="256" cy="226" r="4.2" fill="#FFDE24" />

          {/* Apron Touros Burguer Fierce Chest Emblem */}
          <g transform="translate(210, 322)">
            <circle r="25" fill="#080808" stroke="#FFD000" strokeWidth="2" strokeOpacity="0.9" />
            <path
              d="M-12 -10 C-15 -4 -12 1 -7 2 L-8 11 C-8 14 -4 16 0 16 C4 16 8 14 8 11 L7 2 C12 1 15 -4 12 -10 C10 -6 6 -4 3 -4 H-3 C-6 -4 -10 -6 -12 -10 Z"
              fill="#FFD000"
            />
          </g>

          {/* FIERCE CHISELED HEAD & HORNS */}
          <motion.g
            style={{ originX: '210px', originY: '165px' }}
            animate={{
              rotate:
                scene === 1
                  ? [0, -2, 0]
                  : isChewing
                    ? [-2.5, 3, -2]
                    : [0, 1.5, 0],
              y: isChewing ? [0, 4, 0] : [0, -1, 0],
            }}
            transition={{
              duration: isChewing ? 0.28 : 1.2,
              repeat: isChewing ? 3 : 0,
              ease: 'easeInOut',
            }}
          >
            {/* Pointed Ears */}
            <path
              d="M132 114 C102 108 88 122 100 136 C110 146 128 138 136 128 Z"
              fill="url(#furShadow)"
            />
            <path
              d="M288 114 C318 108 332 122 320 136 C310 146 292 138 284 128 Z"
              fill="url(#furShadow)"
            />

            {/* Sweeping Massive Horns (echoing official logo curve) */}
            <path
              d="M148 94 C110 88 76 58 88 16 C92 8 100 12 100 22 C100 48 122 68 156 76 Z"
              fill="url(#hornIvory)"
            />
            <path
              d="M272 94 C310 88 344 58 332 16 C328 8 320 12 320 22 C320 48 298 68 264 76 Z"
              fill="url(#hornIvory)"
            />
            {/* Horn Rim Specular Light */}
            <path
              d="M93 22 C88 50 112 76 146 84"
              stroke="#FFD000"
              strokeOpacity="0.65"
              strokeWidth="2.4"
              strokeLinecap="round"
            />
            <path
              d="M327 22 C332 50 308 76 274 84"
              stroke="#FFD000"
              strokeOpacity="0.65"
              strokeWidth="2.4"
              strokeLinecap="round"
            />

            {/* Angular Chiseled Cranium */}
            <path
              d="M136 112 C136 68 166 54 210 54 C254 54 284 68 284 112 L276 154 C272 174 248 188 210 188 C172 188 148 174 144 154 Z"
              fill="url(#furChiseled)"
            />

            {/* Forehead Fur Mark (subtle nod to the official logo's X brow crease) */}
            <path
              d="M196 68 L224 78 M224 68 L196 78"
              stroke="#341709"
              strokeWidth="3.2"
              strokeLinecap="round"
              strokeOpacity="0.7"
            />

            {/* Eyes: Intense & locked on burger in S1-S2, satisfied squint in S3, golden glint in S4 */}
            {scene === 3 ? (
              <g stroke="#140803" strokeWidth="5" strokeLinecap="round">
                <path d="M164 112 Q178 98 192 112" />
                <path d="M228 112 Q242 98 256 112" />
              </g>
            ) : (
              <g>
                {/* Fierce Slanted Eye Shapes */}
                <path
                  d="M160 104 L194 112 L190 124 C178 126 164 120 160 104 Z"
                  fill="#FFFDF6"
                />
                <path
                  d="M260 104 L226 112 L230 124 C242 126 256 120 260 104 Z"
                  fill="#FFFDF6"
                />
                {/* Intense Golden-Amber Irises */}
                <motion.circle
                  cx="179"
                  cy={scene === 1 ? 116 : 114}
                  r="5.8"
                  fill="#140803"
                  stroke="#FFD000"
                  strokeWidth="1.6"
                  animate={{ cy: scene === 1 ? 117 : 113 }}
                  transition={{ duration: 0.3 }}
                />
                <motion.circle
                  cx="241"
                  cy={scene === 1 ? 116 : 114}
                  r="5.8"
                  fill="#140803"
                  stroke="#FFD000"
                  strokeWidth="1.6"
                  animate={{ cy: scene === 1 ? 117 : 113 }}
                  transition={{ duration: 0.3 }}
                />
                <circle cx="181" cy={scene === 1 ? 114 : 111} r="2" fill="#FFFFFF" />
                <circle cx="243" cy={scene === 1 ? 114 : 111} r="2" fill="#FFFFFF" />
              </g>
            )}

            {/* Heavy Furrowed Brows */}
            <motion.path
              d="M156 96 Q178 100 196 110"
              stroke="#200B03"
              strokeWidth="6.8"
              strokeLinecap="round"
              animate={{ y: scene === 1 ? 2 : isFinished ? -3 : 0 }}
              transition={{ duration: 0.28 }}
            />
            <motion.path
              d="M264 96 Q242 100 224 110"
              stroke="#200B03"
              strokeWidth="6.8"
              strokeLinecap="round"
              animate={{ y: scene === 1 ? 2 : isFinished ? -3 : 0 }}
              transition={{ duration: 0.28 }}
            />

            {/* Lower Jaw (Heavy Chomp & Chew) */}
            <motion.path
              d="M170 166 C170 194 188 206 210 206 C232 206 250 194 250 166 Z"
              fill="#7A492E"
              animate={{
                y: isBiteOne ? [0, 17, 2, 12, 0] : isBiteTwo ? [0, 15, 0, 11, 0] : 0,
              }}
              transition={{ duration: 0.68, ease: 'easeInOut' }}
            />

            {/* Mouth & Confident Smirk */}
            <motion.path
              d={
                isFinished
                  ? 'M180 164 Q210 186 240 164'
                  : 'M182 164 Q210 176 238 164'
              }
              stroke="#1A0802"
              strokeWidth={isChewing ? 9 : 5}
              strokeLinecap="round"
              fill={isChewing ? '#2A0C04' : 'none'}
              animate={{
                scaleY: isChewing ? [1, 1.55, 0.8, 1.4, 1] : 1,
              }}
              transition={{ duration: 0.68 }}
            />

            {isFinished && (
              <path
                d="M188 165 Q210 178 232 165 Q210 172 188 165 Z"
                fill="#FFFFFF"
              />
            )}

            {/* Sculpted Broad Snout */}
            <path
              d="M156 144 C156 123 178 117 210 117 C242 117 264 123 264 144 C264 165 244 174 210 174 C176 174 156 165 156 144 Z"
              fill="url(#snoutSculpt)"
            />
            <ellipse cx="189" cy="144" rx="7.5" ry="5.2" transform="rotate(-14 189 144)" fill="#2B1207" />
            <ellipse cx="231" cy="144" rx="7.5" ry="5.2" transform="rotate(14 231 144)" fill="#2B1207" />

            {/* Heavy Gold Nose Ring */}
            <path
              d="M197 152 C195 166 201 176 210 176 C219 176 225 166 223 152"
              stroke="url(#goldShine)"
              strokeWidth="5.2"
              strokeLinecap="round"
            />
          </motion.g>

          {/* GOURMET BURGER (with realistic scalloped progressive bites) */}
          {burgerStage < 3 && (
            <motion.g
              animate={{
                y: burgerTargetY,
                scale: burgerScale,
              }}
              transition={{
                duration: 0.44,
                ease: [0.16, 1, 0.3, 1],
              }}
              style={{ originX: '210px', originY: '255px' }}
            >
              <g clipPath="url(#burgerBiteClip)">
                <path
                  d="M138 280 H282 C282 296 264 305 210 305 C156 305 138 296 138 280 Z"
                  fill="url(#briocheBottom)"
                />
                <path
                  d="M134 275 Q158 286 182 276 Q210 290 238 276 Q262 286 286 275 Z"
                  fill="#FFBE2E"
                />
                <rect x="132" y="252" width="156" height="25" rx="12" fill="url(#searedPatty)" />
                {/* Charred Grill Stripes */}
                <path
                  d="M158 256 L172 274 M192 256 L206 274 M226 256 L240 274"
                  stroke="#180702"
                  strokeWidth="3.5"
                  strokeLinecap="round"
                  strokeOpacity="0.65"
                />
                {/* Dripping Melted Cheddar */}
                <path
                  d="M134 248 H286 L276 262 L256 254 L238 270 L218 255 L196 268 L176 255 L150 264 Z"
                  fill="#FFD000"
                />
                {/* Crispy Bacon */}
                <path
                  d="M136 242 Q174 233 210 242 Q246 248 284 240 L282 248 Q244 255 210 248 Q174 242 138 249 Z"
                  fill="#A12B1C"
                />
                {/* Crisp Lettuce */}
                <path
                  d="M130 234 Q148 223 170 234 Q190 223 210 234 Q230 223 250 234 Q270 223 290 234 Q270 245 250 238 Q230 246 210 238 Q190 246 170 238 Q148 245 130 234 Z"
                  fill="#54A838"
                />
                {/* Glossy Brioche Crown */}
                <path
                  d="M134 230 C134 188 164 174 210 174 C256 174 286 188 286 230 Z"
                  fill="url(#briocheTop)"
                />
                <path
                  d="M156 200 C174 184 206 180 238 186"
                  stroke="#FFE0AC"
                  strokeOpacity="0.5"
                  strokeWidth="4.2"
                  strokeLinecap="round"
                />
                <ellipse cx="176" cy="194" rx="4.2" ry="2.1" transform="rotate(-18 176 194)" fill="#FFF2D2" />
                <ellipse cx="206" cy="187" rx="4.2" ry="2.1" transform="rotate(8 206 187)" fill="#FFF2D2" />
                <ellipse cx="234" cy="194" rx="4.2" ry="2.1" transform="rotate(20 234 194)" fill="#FFF2D2" />
                <ellipse cx="192" cy="206" rx="4.2" ry="2.1" transform="rotate(-8 192 206)" fill="#FFF2D2" />
                <ellipse cx="222" cy="205" rx="4.2" ry="2.1" transform="rotate(14 222 205)" fill="#FFF2D2" />
              </g>
            </motion.g>
          )}

          {/* Kinetic Bite Impact Rays + Flying Crumbs */}
          {(scene === 2 || scene === 3) && (
            <>
              <motion.g
                key={`impact-${scene}`}
                initial={{ scale: 0.5, opacity: 0 }}
                animate={{ scale: [0.6, 1.15, 1.25], opacity: [0, 1, 0] }}
                transition={{ duration: 0.42, delay: 0.1, ease: 'easeOut' }}
                style={{ originX: '210px', originY: '180px' }}
              >
                <path d="M136 168 L118 158" stroke="#FFD000" strokeWidth="3.5" strokeLinecap="round" />
                <path d="M132 186 L112 188" stroke="#FFDE24" strokeWidth="3" strokeLinecap="round" />
                <path d="M284 168 L302 158" stroke="#FFD000" strokeWidth="3.5" strokeLinecap="round" />
                <path d="M288 186 L308 188" stroke="#FFDE24" strokeWidth="3" strokeLinecap="round" />
              </motion.g>

              {CRUMBS.map((c) => (
                <motion.rect
                  key={`${scene}-${c.id}`}
                  x={c.cx}
                  y={c.cy}
                  width={c.size}
                  height={c.size}
                  rx="1"
                  fill={c.id % 2 === 0 ? '#FFD000' : '#E89238'}
                  initial={{ opacity: 0, x: 0, y: 0, rotate: 0, scale: 0.6 }}
                  animate={{
                    opacity: [0, 1, 0],
                    x: c.dx,
                    y: c.dy,
                    rotate: c.rot,
                    scale: [0.6, 1.1, 0.3],
                  }}
                  transition={{ duration: 0.68, delay: c.delay, ease: 'easeOut' }}
                />
              ))}
            </>
          )}

          {/* LEFT ARM & HAND */}
          <motion.g
            animate={{
              y: isFinished ? 30 : burgerTargetY,
              x: isFinished ? -14 : 0,
              rotate: isFinished ? -12 : 0,
            }}
            transition={{ duration: 0.44, ease: [0.16, 1, 0.3, 1] }}
            style={{ originX: '120px', originY: '265px' }}
          >
            <path
              d="M96 254 C84 282 98 308 128 298 L148 282 C136 272 130 262 128 246 Z"
              fill="url(#furChiseled)"
            />
            <rect x="120" y="252" width="34" height="36" rx="14" fill="url(#furChiseled)" stroke="#2F1508" strokeWidth="1.6" />
            <path d="M132 258 H148 M132 268 H148 M132 278 H146" stroke="#2F1508" strokeWidth="2.2" strokeLinecap="round" />
          </motion.g>

          {/* RIGHT ARM & HAND — Holds burger, then throws bold OK gesture in Scene 4 */}
          {!isFinished ? (
            <motion.g
              animate={{ y: burgerTargetY }}
              transition={{ duration: 0.44, ease: [0.16, 1, 0.3, 1] }}
            >
              <path
                d="M324 254 C336 282 322 308 292 298 L272 282 C284 272 290 262 292 246 Z"
                fill="url(#furChiseled)"
              />
              <rect x="266" y="252" width="34" height="36" rx="14" fill="url(#furChiseled)" stroke="#2F1508" strokeWidth="1.6" />
              <path d="M272 258 H288 M272 268 H288 M274 278 H288" stroke="#2F1508" strokeWidth="2.2" strokeLinecap="round" />
            </motion.g>
          ) : (
            <motion.g
              initial={{ opacity: 0, y: 26, scale: 0.85 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              transition={{ type: 'spring', stiffness: 360, damping: 22 }}
            >
              <path
                d="M288 256 C312 258 326 238 320 208 L294 208 C292 228 286 238 272 242 Z"
                fill="url(#furChiseled)"
              />
              <g transform="translate(306, 194)">
                <path
                  d="M4 -8 L13 -34 M13 -4 L26 -28 M18 4 L34 -15"
                  stroke="#9C5D34"
                  strokeWidth="8"
                  strokeLinecap="round"
                />
                <circle cx="4" cy="6" r="16" fill="url(#furChiseled)" />
                <circle cx="-6" cy="-6" r="9.5" fill="none" stroke="#CA926B" strokeWidth="5.8" />
                <motion.g
                  initial={{ scale: 0.4, opacity: 0 }}
                  animate={{ scale: [0.4, 1.15, 1], opacity: 1 }}
                  transition={{ delay: 0.12, duration: 0.4 }}
                >
                  <path d="M-24 -22 L-34 -32" stroke="#FFD000" strokeWidth="3.4" strokeLinecap="round" />
                  <path d="M-12 -34 L-14 -46" stroke="#FFDE24" strokeWidth="3.4" strokeLinecap="round" />
                  <path d="M34 -28 L46 -36" stroke="#FFD000" strokeWidth="3.4" strokeLinecap="round" />
                </motion.g>
              </g>
            </motion.g>
          )}
        </motion.g>
      </svg>
    </motion.div>
  );
}
