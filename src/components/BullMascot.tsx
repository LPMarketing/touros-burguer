import { motion } from 'motion/react';

export type IntroScene = 1 | 2 | 3 | 4 | 5;

interface BullMascotProps {
  scene: IntroScene;
}

const CRUMBS = [
  { id: 1, cx: 192, cy: 192, dx: -16, dy: 44, size: 3.5, delay: 0.08 },
  { id: 2, cx: 204, cy: 198, dx: 12, dy: 52, size: 2.8, delay: 0.14 },
  { id: 3, cx: 185, cy: 202, dx: -8, dy: 38, size: 2.5, delay: 0.2 },
  { id: 4, cx: 210, cy: 194, dx: 18, dy: 46, size: 3.2, delay: 0.12 },
];

export function BullMascot({ scene }: BullMascotProps) {
  const isBiteOne = scene === 2;
  const isBiteTwo = scene === 3;
  const isChewing = scene === 2 || scene === 3;
  const isFinished = scene >= 4;

  // Coherent bite progress: 0 = full burger, 1 = 1st bite taken, 2 = 2nd bite taken, 3 = finished
  const burgerStage = scene === 1 ? 0 : scene === 2 ? 1 : scene === 3 ? 2 : 3;

  // Hands & burger travel smoothly up to mouth during bites
  const burgerTargetY = scene === 1 ? 0 : scene === 2 ? -42 : scene === 3 ? -46 : 24;
  const burgerScale = scene === 1 ? 1 : scene === 2 ? 0.94 : scene === 3 ? 0.86 : 0.4;

  return (
    <motion.div
      className="relative w-[268px] h-[292px] min-[390px]:w-[310px] min-[390px]:h-[340px] sm:w-[350px] sm:h-[380px] select-none"
      initial={{ scale: 0.92, opacity: 0 }}
      animate={{
        scale: scene === 1 ? 1 : scene === 2 ? 1.03 : scene === 3 ? 1.05 : 1.02,
        opacity: 1,
      }}
      transition={{ duration: 0.85, ease: [0.16, 1, 0.3, 1] }}
    >
      {/* Subtle warm radial stage light behind the bull */}
      <div
        className="absolute inset-4 rounded-full pointer-events-none"
        style={{
          background:
            'radial-gradient(circle at 50% 45%, rgba(255, 208, 0, 0.14) 0%, rgba(255, 208, 0, 0.04) 45%, transparent 72%)',
        }}
      />

      <svg
        viewBox="0 0 400 420"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        className="w-full h-full overflow-visible"
        role="img"
        aria-label="Mascote Touro da Touros Burguer comendo um hambúrguer gourmet"
      >
        <defs>
          {/* 3D Stylized Fur & Leather Shading Gradients */}
          <radialGradient id="furBase" cx="45%" cy="35%" r="65%">
            <stop offset="0%" stopColor="#945832" />
            <stop offset="55%" stopColor="#6B3A1E" />
            <stop offset="100%" stopColor="#3B1E0E" />
          </radialGradient>

          <radialGradient id="furDark" cx="50%" cy="30%" r="70%">
            <stop offset="0%" stopColor="#7A4424" />
            <stop offset="100%" stopColor="#32180A" />
          </radialGradient>

          <radialGradient id="snoutGrad" cx="50%" cy="35%" r="65%">
            <stop offset="0%" stopColor="#C48F6C" />
            <stop offset="65%" stopColor="#9B6746" />
            <stop offset="100%" stopColor="#6D4127" />
          </radialGradient>

          <linearGradient id="hornGrad" x1="0" y1="0" x2="1" y2="1">
            <stop offset="0%" stopColor="#FFF7DC" />
            <stop offset="55%" stopColor="#EAD6A3" />
            <stop offset="100%" stopColor="#B89038" />
          </linearGradient>

          <linearGradient id="apronGrad" x1="200" y1="210" x2="200" y2="400" gradientUnits="userSpaceOnUse">
            <stop offset="0%" stopColor="#20201E" />
            <stop offset="100%" stopColor="#0D0D0C" />
          </linearGradient>

          <linearGradient id="goldGrad" x1="0" y1="0" x2="1" y2="1">
            <stop offset="0%" stopColor="#FFDE24" />
            <stop offset="100%" stopColor="#D99B00" />
          </linearGradient>

          <linearGradient id="bunTop" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="#F2A949" />
            <stop offset="60%" stopColor="#D2781F" />
            <stop offset="100%" stopColor="#9B4D0F" />
          </linearGradient>

          <linearGradient id="bunBottom" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="#D67E26" />
            <stop offset="100%" stopColor="#8E470D" />
          </linearGradient>

          <linearGradient id="pattyGrad" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="#5C2D18" />
            <stop offset="100%" stopColor="#2F1308" />
          </linearGradient>

          {/* Progressive Bite Masks — coherent crescent bites */}
          <clipPath id="burgerBiteClip">
            {burgerStage === 0 && <rect x="80" y="160" width="240" height="200" />}
            {burgerStage === 1 && (
              <path d="M80 160 H218 C210 176 218 196 238 198 C252 199 264 192 272 184 V360 H80 Z" />
            )}
            {burgerStage === 2 && (
              <path d="M80 185 H176 C172 204 185 224 210 226 C228 228 240 218 248 210 V360 H80 Z" />
            )}
            {burgerStage === 3 && <rect x="0" y="0" width="0" height="0" />}
          </clipPath>
        </defs>

        {/* Ground Shadow */}
        <ellipse cx="200" cy="396" rx="112" ry="14" fill="#000000" fillOpacity="0.6" />

        {/* Muscular Shoulders & Torso */}
        <motion.g
          animate={{
            y: isChewing ? [0, -2.5, 0] : [0, -1.5, 0],
          }}
          transition={{
            duration: isChewing ? 0.35 : 2.4,
            repeat: Infinity,
            ease: 'easeInOut',
          }}
        >
          {/* Back/Shoulders fur silhouette */}
          <path
            d="M104 260 C104 205 144 176 200 176 C256 176 296 205 296 260 L306 382 C306 390 294 394 282 394 H118 C106 394 94 390 94 382 Z"
            fill="url(#furDark)"
          />

          {/* Black Gourmet Apron with Yellow Straps & Stitching */}
          <path
            d="M132 222 L152 212 L248 212 L268 222 L284 386 C284 392 276 394 268 394 H132 C124 394 116 392 116 386 Z"
            fill="url(#apronGrad)"
            stroke="#2E2E2B"
            strokeWidth="1.5"
          />
          {/* Apron Yellow Straps */}
          <path d="M148 186 L156 226" stroke="#FFD000" strokeWidth="8" strokeLinecap="round" />
          <path d="M252 186 L244 226" stroke="#FFD000" strokeWidth="8" strokeLinecap="round" />
          {/* Apron Yellow Brass Rivets */}
          <circle cx="156" cy="226" r="4" fill="#FFDE24" />
          <circle cx="244" cy="226" r="4" fill="#FFDE24" />

          {/* Apron Touros Burguer Crest Emblem */}
          <g transform="translate(200, 318)">
            <circle r="24" fill="#141413" stroke="#FFD000" strokeWidth="1.8" strokeOpacity="0.85" />
            <path
              d="M-11 -9 C-12 -3 -8.5 1 -4.5 2 L-5.5 11 C-5.5 13.8 -2.5 15.5 0 15.5 C2.5 15.5 5.5 13.8 5.5 11 L4.5 2 C8.5 1 12 -3 11 -9 C9 -5 6 -3.5 3 -3.5 H-3 C-6 -3.5 -9 -5 -11 -9 Z"
              fill="#FFD000"
            />
          </g>

          {/* HEAD & HORNS GROUP */}
          <motion.g
            style={{ originX: '200px', originY: '165px' }}
            animate={{
              rotate: scene === 1 ? [0, -1.5, 0] : isChewing ? [-2, 2.5, -1.5] : [0, 1.5, 0],
              y: isChewing ? [0, 3, 0] : [0, -1, 0],
            }}
            transition={{
              duration: isChewing ? 0.32 : 1.4,
              repeat: isChewing ? 3 : 0,
              ease: 'easeInOut',
            }}
          >
            {/* Ears */}
            <path
              d="M126 116 C100 112 88 126 98 138 C108 148 124 140 132 132 Z"
              fill="url(#furDark)"
            />
            <path
              d="M274 116 C300 112 312 126 302 138 C292 148 276 140 268 132 Z"
              fill="url(#furDark)"
            />

            {/* Big Curved 3D Horns */}
            <path
              d="M142 96 C112 86 88 58 98 28 C102 18 112 20 112 30 C112 52 128 68 152 76 Z"
              fill="url(#hornGrad)"
            />
            <path
              d="M258 96 C288 86 312 58 302 28 C298 18 288 20 288 30 C288 52 272 68 248 76 Z"
              fill="url(#hornGrad)"
            />
            {/* Horn Rim Highlights */}
            <path
              d="M102 33 C98 56 116 78 144 86"
              stroke="#FFFFFF"
              strokeOpacity="0.45"
              strokeWidth="2.5"
              strokeLinecap="round"
            />
            <path
              d="M298 33 C302 56 284 78 256 86"
              stroke="#FFFFFF"
              strokeOpacity="0.45"
              strokeWidth="2.5"
              strokeLinecap="round"
            />

            {/* Cranium / Head */}
            <path
              d="M130 118 C130 74 160 58 200 58 C240 58 270 74 270 118 C270 156 246 184 200 184 C154 184 130 156 130 118 Z"
              fill="url(#furBase)"
            />

            {/* Confident Brow Ridge & Forehead Tuft */}
            <path
              d="M182 62 C192 48 210 46 218 62 C210 64 205 70 200 72 C195 70 190 64 182 62 Z"
              fill="#4E2611"
            />

            {/* Eyes — look down at burger in Scene 1, happy squint in Scene 3, confident bright grin in Scene 4 */}
            {scene === 3 ? (
              <g stroke="#140A05" strokeWidth="4.5" strokeLinecap="round">
                <path d="M158 114 Q170 102 182 114" />
                <path d="M218 114 Q230 102 242 114" />
              </g>
            ) : (
              <g>
                {/* Eye whites */}
                <ellipse cx="170" cy="112" rx="12" ry="13" fill="#FFFDF8" />
                <ellipse cx="230" cy="112" rx="12" ry="13" fill="#FFFDF8" />
                {/* Pupils */}
                <motion.circle
                  cx="170"
                  cy={scene === 1 ? 116 : 112}
                  r="6"
                  fill="#140A05"
                  animate={{ cy: scene === 1 ? 117 : 112 }}
                  transition={{ duration: 0.35 }}
                />
                <motion.circle
                  cx="230"
                  cy={scene === 1 ? 116 : 112}
                  r="6"
                  fill="#140A05"
                  animate={{ cy: scene === 1 ? 117 : 112 }}
                  transition={{ duration: 0.35 }}
                />
                {/* Eye catchlights */}
                <circle cx="172.5" cy={scene === 1 ? 114 : 109.5} r="2.2" fill="#FFFFFF" />
                <circle cx="232.5" cy={scene === 1 ? 114 : 109.5} r="2.2" fill="#FFFFFF" />
              </g>
            )}

            {/* Expressive Eyebrows */}
            <motion.path
              d="M154 95 Q170 86 184 95"
              stroke="#2C1307"
              strokeWidth="6"
              strokeLinecap="round"
              animate={{ y: scene === 1 ? 2 : isFinished ? -3 : 0 }}
              transition={{ duration: 0.3 }}
            />
            <motion.path
              d="M216 95 Q230 86 246 95"
              stroke="#2C1307"
              strokeWidth="6"
              strokeLinecap="round"
              animate={{ y: scene === 1 ? 2 : isFinished ? -3 : 0 }}
              transition={{ duration: 0.3 }}
            />

            {/* Lower Jaw (Animated for Bite / Chew / Smile) */}
            <motion.path
              d="M164 166 C164 192 180 202 200 202 C220 202 236 192 236 166 Z"
              fill="#7A4C32"
              animate={{
                y: isBiteOne ? [0, 14, 2, 10, 0] : isBiteTwo ? [0, 12, 0, 10, 0] : 0,
              }}
              transition={{
                duration: 0.72,
                ease: 'easeInOut',
              }}
            />

            {/* Mouth Interior & Confident Smile */}
            <motion.path
              d={
                isFinished
                  ? 'M172 164 Q200 184 228 164'
                  : 'M174 164 Q200 176 226 164'
              }
              stroke="#1E0C04"
              strokeWidth={isChewing ? 8 : 5}
              strokeLinecap="round"
              fill={isChewing ? '#2A0F06' : 'none'}
              animate={{
                scaleY: isChewing ? [1, 1.45, 0.85, 1.35, 1] : 1,
              }}
              transition={{ duration: 0.7 }}
            />

            {/* Teeth Highlight during happy smile */}
            {isFinished && (
              <path
                d="M180 165 Q200 177 220 165 Q200 171 180 165 Z"
                fill="#FFFFFF"
              />
            )}

            {/* Sculpted Broad Bull Snout */}
            <path
              d="M148 144 C148 124 170 118 200 118 C230 118 252 124 252 144 C252 164 232 172 200 172 C168 172 148 164 148 144 Z"
              fill="url(#snoutGrad)"
            />
            {/* Nostrils */}
            <ellipse cx="180" cy="144" rx="7" ry="5" transform="rotate(-14 180 144)" fill="#381B0D" />
            <ellipse cx="220" cy="144" rx="7" ry="5" transform="rotate(14 220 144)" fill="#381B0D" />

            {/* Iconic Golden Nose Ring */}
            <path
              d="M188 152 C186 165 192 174 200 174 C208 174 214 165 212 152"
              stroke="url(#goldGrad)"
              strokeWidth="4.8"
              strokeLinecap="round"
            />
          </motion.g>

          {/* GOURMET BURGER HELD BY BULL (with coherent bite clipPath) */}
          {burgerStage < 3 && (
            <motion.g
              animate={{
                y: burgerTargetY,
                scale: burgerScale,
              }}
              transition={{
                duration: 0.48,
                ease: [0.16, 1, 0.3, 1],
              }}
              style={{ originX: '200px', originY: '255px' }}
            >
              <g clipPath="url(#burgerBiteClip)">
                {/* Bottom Brioche Bun */}
                <path
                  d="M132 278 H268 C268 294 252 302 200 302 C148 302 132 294 132 278 Z"
                  fill="url(#bunBottom)"
                />
                {/* Golden Signature Sauce */}
                <path
                  d="M128 273 Q150 284 172 274 Q200 288 228 274 Q250 284 272 273 Z"
                  fill="#FFBE2E"
                />
                {/* Thick Seared Beef Patty */}
                <rect x="126" y="252" width="148" height="24" rx="11" fill="url(#pattyGrad)" />
                {/* Melted Cheddar Cheese Drip */}
                <path
                  d="M128 248 H272 L264 260 L246 254 L228 268 L210 254 L188 266 L168 254 L144 262 Z"
                  fill="#FFD000"
                />
                {/* Crispy Bacon Strips */}
                <path
                  d="M130 242 Q165 234 200 242 Q235 248 270 240 L268 248 Q232 254 200 248 Q165 242 132 249 Z"
                  fill="#9E2A1C"
                />
                {/* Fresh Crisp Lettuce */}
                <path
                  d="M124 234 Q142 224 162 234 Q182 224 200 234 Q218 224 238 234 Q258 224 276 234 Q258 244 238 238 Q218 245 200 238 Q182 245 162 238 Q142 244 124 234 Z"
                  fill="#52A438"
                />
                {/* Glossy Top Brioche Bun */}
                <path
                  d="M128 230 C128 190 156 176 200 176 C244 176 272 190 272 230 Z"
                  fill="url(#bunTop)"
                />
                {/* Brioche Highlight & Sesame Seeds */}
                <path
                  d="M148 202 C164 186 196 182 226 188"
                  stroke="#FFD79A"
                  strokeOpacity="0.45"
                  strokeWidth="4"
                  strokeLinecap="round"
                />
                <ellipse cx="168" cy="196" rx="4" ry="2" transform="rotate(-18 168 196)" fill="#FFF2D2" />
                <ellipse cx="196" cy="189" rx="4" ry="2" transform="rotate(8 196 189)" fill="#FFF2D2" />
                <ellipse cx="222" cy="196" rx="4" ry="2" transform="rotate(20 222 196)" fill="#FFF2D2" />
                <ellipse cx="182" cy="208" rx="4" ry="2" transform="rotate(-8 182 208)" fill="#FFF2D2" />
                <ellipse cx="212" cy="207" rx="4" ry="2" transform="rotate(14 212 207)" fill="#FFF2D2" />
              </g>
            </motion.g>
          )}

          {/* Controlled Crumbs during Bite 1 & Bite 2 */}
          {(scene === 2 || scene === 3) &&
            CRUMBS.map((c) => (
              <motion.circle
                key={`${scene}-${c.id}`}
                cx={c.cx}
                cy={c.cy}
                r={c.size}
                fill={c.id % 2 === 0 ? '#FFD000' : '#E28E36'}
                initial={{ opacity: 0, x: 0, y: 0, scale: 0.6 }}
                animate={{
                  opacity: [0, 1, 0],
                  x: c.dx,
                  y: c.dy,
                  scale: [0.6, 1, 0.4],
                }}
                transition={{ duration: 0.72, delay: c.delay, ease: 'easeOut' }}
              />
            ))}

          {/* LEFT ARM & HAND */}
          <motion.g
            animate={{
              y: isFinished ? 28 : burgerTargetY,
              x: isFinished ? -12 : 0,
              rotate: isFinished ? -10 : 0,
            }}
            transition={{ duration: 0.48, ease: [0.16, 1, 0.3, 1] }}
            style={{ originX: '115px', originY: '265px' }}
          >
            {/* Left Forearm */}
            <path
              d="M96 254 C84 282 96 306 124 298 L142 282 C130 272 126 262 124 246 Z"
              fill="url(#furBase)"
            />
            {/* Left Hand gripping burger */}
            <rect x="114" y="252" width="32" height="36" rx="14" fill="url(#furBase)" stroke="#3B1E0E" strokeWidth="1.5" />
            <path d="M126 258 H142 M126 268 H142 M126 278 H140" stroke="#3B1E0E" strokeWidth="2.2" strokeLinecap="round" />
          </motion.g>

          {/* RIGHT ARM & HAND — Holds burger, then lifts into OK gesture in Scene 4 */}
          {!isFinished ? (
            <motion.g
              animate={{
                y: burgerTargetY,
              }}
              transition={{ duration: 0.48, ease: [0.16, 1, 0.3, 1] }}
            >
              <path
                d="M304 254 C316 282 304 306 276 298 L258 282 C270 272 274 262 276 246 Z"
                fill="url(#furBase)"
              />
              <rect x="254" y="252" width="32" height="36" rx="14" fill="url(#furBase)" stroke="#3B1E0E" strokeWidth="1.5" />
              <path d="M258 258 H274 M258 268 H274 M260 278 H274" stroke="#3B1E0E" strokeWidth="2.2" strokeLinecap="round" />
            </motion.g>
          ) : (
            <motion.g
              initial={{ opacity: 0, y: 24, scale: 0.9 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              transition={{ duration: 0.42, ease: [0.16, 1, 0.3, 1] }}
            >
              {/* Raised Right Arm */}
              <path
                d="M276 256 C298 258 312 240 308 212 L284 212 C282 230 276 238 262 242 Z"
                fill="url(#furBase)"
              />
              {/* OK Hand Gesture 👌 */}
              <g transform="translate(294, 198)">
                {/* Extended 3 fingers */}
                <path
                  d="M4 -8 L12 -32 M12 -4 L24 -26 M17 4 L32 -14"
                  stroke="#945832"
                  strokeWidth="7.5"
                  strokeLinecap="round"
                />
                {/* Palm */}
                <circle cx="4" cy="6" r="15" fill="url(#furBase)" />
                {/* Thumb + Index forming crisp OK circle */}
                <circle
                  cx="-6"
                  cy="-6"
                  r="9"
                  fill="none"
                  stroke="#C48F6C"
                  strokeWidth="5.5"
                />
                {/* Subtle Yellow Approval Spark Lines */}
                <motion.g
                  initial={{ scale: 0.5, opacity: 0 }}
                  animate={{ scale: 1, opacity: 1 }}
                  transition={{ delay: 0.15, duration: 0.35 }}
                >
                  <path d="M-24 -22 L-32 -30" stroke="#FFD000" strokeWidth="3" strokeLinecap="round" />
                  <path d="M-12 -32 L-14 -42" stroke="#FFDE24" strokeWidth="3" strokeLinecap="round" />
                  <path d="M32 -28 L42 -34" stroke="#FFD000" strokeWidth="3" strokeLinecap="round" />
                </motion.g>
              </g>
            </motion.g>
          )}
        </motion.g>
      </svg>
    </motion.div>
  );
}
