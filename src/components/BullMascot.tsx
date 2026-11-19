import { motion } from 'motion/react';

export type IntroScene = 1 | 2 | 3 | 4 | 5;

interface BullMascotProps {
  scene: IntroScene;
}

export function BullMascot({ scene }: BullMascotProps) {
  const isLifting = scene === 2;
  const isBiting = scene === 2 || scene === 3;
  const isChewing = scene === 3;
  const isApproved = scene >= 4;

  return (
    <div
      className="relative flex items-center justify-center w-full h-full px-6"
      role="img"
      aria-label="Animação do mascote Touro comendo o hambúrguer da Touros Burguer"
    >
      {/* Subtle warm ambient studio glow behind the character */}
      <motion.div
        aria-hidden="true"
        className="pointer-events-none absolute w-72 h-72 sm:w-96 sm:h-96 rounded-full"
        style={{
          background:
            'radial-gradient(circle, rgba(255, 208, 0, 0.16) 0%, rgba(255, 168, 0, 0.05) 45%, transparent 72%)',
        }}
        animate={{
          scale: isBiting ? [1, 1.12, 1.04] : [0.95, 1.05, 0.98],
          opacity: isApproved ? 0.95 : 0.78,
        }}
        transition={{ duration: 0.9, ease: 'easeInOut' }}
      />

      <motion.svg
        viewBox="0 0 360 360"
        className="relative z-10 w-[270px] h-[270px] min-[390px]:w-[300px] min-[390px]:h-[300px] sm:w-[340px] sm:h-[340px] overflow-visible drop-shadow-[0_24px_40px_rgba(0,0,0,0.75)]"
        initial={{ opacity: 0, scale: 0.88, y: 18 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        transition={{ duration: 0.45, ease: [0.16, 1, 0.3, 1] }}
      >
        <defs>
          <linearGradient id="furBody" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="#8B4A23" />
            <stop offset="100%" stopColor="#5C2D12" />
          </linearGradient>
          <linearGradient id="furHead" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="#9A5328" />
            <stop offset="100%" stopColor="#6A3516" />
          </linearGradient>
          <linearGradient id="snoutGrad" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="#D49A6A" />
            <stop offset="100%" stopColor="#B3774B" />
          </linearGradient>
          <linearGradient id="hornGrad" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="#FFF7DF" />
            <stop offset="70%" stopColor="#E9D6A3" />
            <stop offset="100%" stopColor="#B69B5C" />
          </linearGradient>
          <linearGradient id="bunTopGrad" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="#F5A63B" />
            <stop offset="100%" stopColor="#CC7018" />
          </linearGradient>
          <linearGradient id="apronGrad" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="#222220" />
            <stop offset="100%" stopColor="#111110" />
          </linearGradient>

          {/* Animated bite clip masks so the burger literally gets bitten */}
          <clipPath id="burgerBiteClip">
            {scene <= 1 ? (
              <rect x="0" y="0" width="360" height="360" />
            ) : scene === 2 ? (
              <path d="M90,140 L205,140 Q192,165 204,185 Q186,204 202,226 L202,290 L90,290 Z" />
            ) : (
              <path d="M90,140 L178,140 Q165,165 178,186 Q160,206 176,228 L176,290 L90,290 Z" />
            )}
          </clipPath>
        </defs>

        {/* Ground Shadow */}
        <ellipse cx="180" cy="336" rx="92" ry="13" fill="#000000" fillOpacity="0.55" />

        {/* Torso & Muscular Shoulders */}
        <motion.g
          animate={{
            y: isChewing ? [0, -3, 0, -2, 0] : [0, -2, 0],
          }}
          transition={{
            duration: isChewing ? 0.5 : 1.6,
            repeat: isChewing ? 2 : Infinity,
            ease: 'easeInOut',
          }}
        >
          {/* Black T-Shirt & Arms Base */}
          <path
            d="M92,222 C90,185 118,166 180,166 C242,166 270,185 268,222 L256,318 C256,326 246,330 236,330 L124,330 C114,330 104,326 104,318 Z"
            fill="#191918"
            stroke="#2B2B28"
            strokeWidth="2"
          />

          {/* Apron Body */}
          <path
            d="M126,188 L234,188 L244,328 L116,328 Z"
            fill="url(#apronGrad)"
            stroke="#30302C"
            strokeWidth="2"
          />

          {/* Yellow Apron Straps */}
          <path
            d="M132,168 L138,196"
            stroke="#FFD000"
            strokeWidth="10"
            strokeLinecap="round"
          />
          <path
            d="M228,168 L222,196"
            stroke="#FFD000"
            strokeWidth="10"
            strokeLinecap="round"
          />
          <circle cx="138" cy="196" r="4" fill="#FFDE24" />
          <circle cx="222" cy="196" r="4" fill="#FFDE24" />

          {/* Small Touros Emblem on Apron */}
          <path
            d="M167,226 C166,232 170,237 175,238 L173,247 C173,250 176,253 180,253 C184,253 187,250 187,247 L185,238 C190,237 194,232 193,226 C191,230 187,232 183,232 L177,232 C173,232 169,230 167,226 Z"
            fill="#FFD000"
          />

          {/* NECK */}
          <path d="M148,140 L212,140 L216,178 L144,178 Z" fill="url(#furBody)" />

          {/* HEAD GROUP */}
          <motion.g
            animate={{
              rotate: isLifting ? -5 : isChewing ? [0, 3, -2, 2, 0] : isApproved ? -2 : 0,
              y: isLifting ? 4 : isChewing ? [0, 3, 0, 2, 0] : 0,
            }}
            transition={{ duration: 0.42, ease: 'easeInOut' }}
            style={{ originX: '180px', originY: '130px' }}
          >
            {/* Left & Right Ears */}
            <motion.path
              d="M122,94 C98,86 84,96 86,108 C88,118 106,120 124,110 Z"
              fill="#6A3516"
              stroke="#48210B"
              strokeWidth="2"
              animate={{ rotate: isChewing ? [0, -8, 4, 0] : 0 }}
              style={{ originX: '122px', originY: '102px' }}
            />
            <motion.path
              d="M238,94 C262,86 276,96 274,108 C272,118 254,120 236,110 Z"
              fill="#6A3516"
              stroke="#48210B"
              strokeWidth="2"
              animate={{ rotate: isChewing ? [0, 8, -4, 0] : 0 }}
              style={{ originX: '238px', originY: '102px' }}
            />

            {/* Curved Horns */}
            <path
              d="M132,76 C100,72 86,46 98,20 C98,38 112,56 140,62 Z"
              fill="url(#hornGrad)"
              stroke="#A38648"
              strokeWidth="2"
            />
            <path
              d="M228,76 C260,72 274,46 262,20 C262,38 248,56 220,62 Z"
              fill="url(#hornGrad)"
              stroke="#A38648"
              strokeWidth="2"
            />

            {/* Cranium */}
            <path
              d="M122,108 C118,70 142,52 180,52 C218,52 242,70 238,108 C236,136 218,154 180,154 C142,154 124,136 122,108 Z"
              fill="url(#furHead)"
              stroke="#48210B"
              strokeWidth="2"
            />

            {/* Forehead Fur Tuft */}
            <path
              d="M162,56 Q172,42 180,54 Q190,40 198,56"
              fill="#5C2D12"
            />

            {/* Expressive Eyes */}
            {isChewing ? (
              <>
                <path
                  d="M144,96 Q154,88 164,96"
                  fill="none"
                  stroke="#1C0C04"
                  strokeWidth="4"
                  strokeLinecap="round"
                />
                <path
                  d="M196,96 Q206,88 216,96"
                  fill="none"
                  stroke="#1C0C04"
                  strokeWidth="4"
                  strokeLinecap="round"
                />
              </>
            ) : (
              <>
                <ellipse cx="154" cy="96" rx="10" ry="11" fill="#FFFDF7" />
                <circle cx="155" cy="97" r="6" fill="#2A1406" />
                <circle cx="157" cy="94" r="2.2" fill="#FFFFFF" />

                <ellipse cx="206" cy="96" rx="10" ry="11" fill="#FFFDF7" />
                <circle cx="205" cy="97" r="6" fill="#2A1406" />
                <circle cx="207" cy="94" r="2.2" fill="#FFFFFF" />
              </>
            )}

            {/* Eyebrows */}
            <motion.path
              d="M139,82 Q153,75 167,84"
              fill="none"
              stroke="#3B1A08"
              strokeWidth="4.5"
              strokeLinecap="round"
              animate={{ y: isLifting ? -3 : 0 }}
            />
            <motion.path
              d="M221,82 Q207,75 193,84"
              fill="none"
              stroke="#3B1A08"
              strokeWidth="4.5"
              strokeLinecap="round"
              animate={{ y: isLifting ? -3 : 0 }}
            />

            {/* Lower Jaw & Mouth Opening for Bite */}
            <motion.g
              animate={{
                y: isLifting ? [0, 14, 2] : isChewing ? [0, 7, 0, 6, 0] : 0,
              }}
              transition={{
                duration: isLifting ? 0.55 : 0.45,
                repeat: isChewing ? 2 : 0,
                ease: 'easeInOut',
              }}
            >
              {/* Dark Mouth Cavity */}
              <ellipse cx="180" cy="138" rx="28" ry={isLifting ? 15 : 8} fill="#360908" />
              {/* Teeth & Happy Tongue */}
              <path d="M158,134 L202,134 L198,140 L162,140 Z" fill="#FFF8EA" />
              <ellipse cx="180" cy="144" rx="14" ry="6" fill="#D95358" />
              {/* Chin */}
              <path
                d="M148,142 Q180,164 212,142"
                fill="url(#snoutGrad)"
                stroke="#85512D"
                strokeWidth="2"
              />
            </motion.g>

            {/* Snout / Nose Pad */}
            <rect
              x="140"
              y="108"
              width="80"
              height="34"
              rx="17"
              fill="url(#snoutGrad)"
              stroke="#85512D"
              strokeWidth="2"
            />
            <ellipse cx="160" cy="122" rx="6" ry="5" fill="#3B180A" />
            <ellipse cx="200" cy="122" rx="6" ry="5" fill="#3B180A" />

            {/* Gold Nose Ring */}
            <path
              d="M168,136 A13,13 0 1,0 192,136"
              fill="none"
              stroke="#FFD000"
              strokeWidth="5"
              strokeLinecap="round"
            />
            <path
              d="M168,136 A13,13 0 1,0 192,136"
              fill="none"
              stroke="#FFF2A6"
              strokeWidth="1.5"
              strokeLinecap="round"
              strokeDasharray="6 14"
            />
          </motion.g>

          {/* GOURMET BURGER (Hides in Scene 4 after being eaten!) */}
          <motion.g
            initial={{ opacity: 1, y: 0, x: 0, scale: 1 }}
            animate={
              scene === 1
                ? { opacity: 1, x: 0, y: 0, scale: 1 }
                : scene === 2
                  ? { opacity: 1, x: 0, y: -44, scale: 1.03 }
                  : scene === 3
                    ? { opacity: 1, x: 0, y: -26, scale: 0.94 }
                    : { opacity: 0, x: 0, y: -40, scale: 0.6 }
            }
            transition={{ duration: 0.42, ease: [0.16, 1, 0.3, 1] }}
          >
            <g clipPath="url(#burgerBiteClip)">
              {/* Bottom Bun */}
              <rect x="128" y="246" width="104" height="18" rx="8" fill="#CF741C" />
              {/* Seared Beef Patty */}
              <rect x="122" y="226" width="116" height="22" rx="10" fill="#461E0D" />
              {/* Melted Cheddar + Drips */}
              <path
                d="M122,222 L238,222 L234,234 L216,229 L204,242 L192,228 L170,238 L156,227 L136,236 L124,228 Z"
                fill="#FFD000"
              />
              {/* Crispy Lettuce */}
              <path
                d="M122,216 Q134,208 146,216 Q158,208 170,216 Q182,208 194,216 Q206,208 218,216 Q230,208 240,216 L236,223 L124,223 Z"
                fill="#4EAE34"
              />
              {/* Top Brioche Crown + Sesame Seeds */}
              <path
                d="M126,212 C126,184 150,174 180,174 C210,174 234,184 234,212 Z"
                fill="url(#bunTopGrad)"
              />
              <ellipse cx="156" cy="190" rx="4" ry="2" fill="#FFF3CF" transform="rotate(-15 156 190)" />
              <ellipse cx="180" cy="184" rx="4" ry="2" fill="#FFF3CF" />
              <ellipse cx="204" cy="191" rx="4" ry="2" fill="#FFF3CF" transform="rotate(15 204 191)" />
              <ellipse cx="168" cy="199" rx="3.5" ry="1.8" fill="#FFF3CF" />
              <ellipse cx="192" cy="200" rx="3.5" ry="1.8" fill="#FFF3CF" />
            </g>

            {/* Left & Right Bull Hands Gripping the Burger */}
            {scene <= 3 && (
              <>
                <g transform="translate(110, 218)">
                  <ellipse cx="12" cy="12" rx="18" ry="15" fill="#7C3F1C" stroke="#48210B" strokeWidth="2" />
                  <ellipse cx="24" cy="6" rx="7" ry="5" fill="#2A1409" />
                  <ellipse cx="26" cy="15" rx="7" ry="5" fill="#2A1409" />
                </g>
                <g transform="translate(226, 218)">
                  <ellipse cx="12" cy="12" rx="18" ry="15" fill="#7C3F1C" stroke="#48210B" strokeWidth="2" />
                  <ellipse cx="0" cy="6" rx="7" ry="5" fill="#2A1409" />
                  <ellipse cx="-2" cy="15" rx="7" ry="5" fill="#2A1409" />
                </g>
              </>
            )}
          </motion.g>

          {/* Left Arm Relaxed + Right Hand Thumbs-Up Approval in Scene 4 */}
          {isApproved && (
            <motion.g
              initial={{ opacity: 0, scale: 0.75, y: 16 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              transition={{ duration: 0.36, ease: [0.16, 1, 0.3, 1] }}
            >
              {/* Relaxed Left Hand on Hip */}
              <ellipse cx="104" cy="272" rx="17" ry="15" fill="#7C3F1C" stroke="#48210B" strokeWidth="2" />

              {/* Raised Right Thumbs-Up */}
              <g transform="translate(248, 200)">
                <path
                  d="M-8,68 Q18,46 16,12"
                  fill="none"
                  stroke="#7C3F1C"
                  strokeWidth="26"
                  strokeLinecap="round"
                />
                <ellipse cx="16" cy="8" rx="18" ry="16" fill="#7C3F1C" stroke="#48210B" strokeWidth="2" />
                {/* Extended Thumb */}
                <rect
                  x="6"
                  y="-24"
                  width="13"
                  height="28"
                  rx="6.5"
                  fill="#B3774B"
                  stroke="#48210B"
                  strokeWidth="2"
                />
                {/* Curled Fist Fingers */}
                <rect x="-2" y="-2" width="18" height="8" rx="4" fill="#5C2D12" />
                <rect x="-2" y="7" width="19" height="8" rx="4" fill="#5C2D12" />
                <rect x="-1" y="16" width="17" height="8" rx="4" fill="#5C2D12" />
              </g>
            </motion.g>
          )}
        </motion.g>

        {/* Flying Bite Crumbs during Scene 2 & Scene 3 */}
        {isBiting && (
          <g>
            <motion.circle
              cx="208"
              cy="154"
              r="4.5"
              fill="#FFD000"
              initial={{ opacity: 1, x: 0, y: 0 }}
              animate={{ opacity: 0, x: 28, y: -18 }}
              transition={{ duration: 0.65, ease: 'easeOut' }}
            />
            <motion.circle
              cx="214"
              cy="168"
              r="3.5"
              fill="#F5A63B"
              initial={{ opacity: 1, x: 0, y: 0 }}
              animate={{ opacity: 0, x: 34, y: 16 }}
              transition={{ duration: 0.7, ease: 'easeOut' }}
            />
            <motion.rect
              x="196"
              y="148"
              width="6"
              height="6"
              rx="1.5"
              fill="#CC7018"
              initial={{ opacity: 1, x: 0, y: 0, rotate: 0 }}
              animate={{ opacity: 0, x: 18, y: -32, rotate: 90 }}
              transition={{ duration: 0.6, ease: 'easeOut' }}
            />
          </g>
        )}

        {/* Approval Sparkles in Scene 4 */}
        {isApproved && (
          <g>
            <motion.path
              d="M286,154 L290,164 L300,168 L290,172 L286,182 L282,172 L272,168 L282,164 Z"
              fill="#FFD000"
              initial={{ opacity: 0, scale: 0 }}
              animate={{ opacity: [0, 1, 0.85], scale: [0.4, 1.15, 1] }}
              transition={{ duration: 0.45 }}
            />
            <motion.path
              d="M84,118 L87,125 L94,128 L87,131 L84,138 L81,131 L74,128 L81,125 Z"
              fill="#FFDE24"
              initial={{ opacity: 0, scale: 0 }}
              animate={{ opacity: [0, 1, 0.8], scale: [0.4, 1.1, 0.95] }}
              transition={{ duration: 0.5, delay: 0.08 }}
            />
          </g>
        )}
      </motion.svg>
    </div>
  );
}
