import { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { MENU_URL, siteConfig } from '../config/siteConfig';
import { LinkButton } from './LinkButton';

interface LinksSectionProps {
  ready: boolean;
  reducedMotion: boolean;
}

function CreativeBurgerEmblem() {
  return (
    <div className="relative flex items-center justify-center w-13 h-13 rounded-xl bg-[#080808] shadow-inner">
      <svg
        viewBox="0 0 36 36"
        fill="none"
        className="w-8 h-8"
        aria-hidden="true"
      >
        {/* Top Sesame Brioche */}
        <path
          d="M7 15.5C7 9.8 11.8 6.5 18 6.5C24.2 6.5 29 9.8 29 15.5H7Z"
          fill="#FFD000"
        />
        <ellipse cx="14" cy="10.5" rx="1.4" ry="0.8" transform="rotate(-15 14 10.5)" fill="#080808" />
        <ellipse cx="18.5" cy="9.2" rx="1.4" ry="0.8" fill="#080808" />
        <ellipse cx="22.5" cy="11" rx="1.4" ry="0.8" transform="rotate(15 22.5 11)" fill="#080808" />
        {/* Onion Ring / Crisp Layer */}
        <rect x="6" y="17.2" width="24" height="2.6" rx="1.3" fill="#FFDE24" />
        {/* Melted Cheese Drip & Patty */}
        <path
          d="M6.5 21.5H29.5C29.5 23.8 27.8 25.2 18 25.2C8.2 25.2 6.5 23.8 6.5 21.5Z"
          fill="#FFFFFF"
        />
        <path
          d="M12 21.5L14 25.5L16.5 21.5L21 26L23.5 21.5Z"
          fill="#FFD000"
        />
        {/* Bottom Bun */}
        <path
          d="M8 27.2H28C28 29.2 24.5 30.2 18 30.2C11.5 30.2 8 29.2 8 27.2Z"
          fill="#FFD000"
        />
      </svg>
    </div>
  );
}

function CreativeIFoodEmblem() {
  return (
    <div className="relative flex items-center justify-center w-14 h-14 rounded-2xl bg-gradient-to-br from-[#EA1D2C] to-[#B70F1C] shadow-[0_10px_24px_-8px_rgba(234,29,44,0.65)] overflow-hidden">
      {/* Subtle diagonal speed streaks */}
      <svg viewBox="0 0 56 56" fill="none" className="w-full h-full" aria-hidden="true">
        <path d="M-4 14L18 4" stroke="#FFFFFF" strokeOpacity="0.16" strokeWidth="2" />
        <path d="M36 52L58 40" stroke="#FFFFFF" strokeOpacity="0.16" strokeWidth="2" />
        <text
          x="28"
          y="27"
          textAnchor="middle"
          fill="#FFFFFF"
          fontFamily="Manrope, sans-serif"
          fontWeight="800"
          fontSize="13.5"
          letterSpacing="-0.4"
        >
          iFood
        </text>
        {/* Expressive Smile Curve */}
        <path
          d="M15 35C21.5 41.5 34.5 41.5 41 33.5"
          stroke="#FFFFFF"
          strokeWidth="3"
          strokeLinecap="round"
          className="origin-center transition-transform duration-300 group-hover:scale-110"
        />
        <path
          d="M37.5 32.8L41.8 33L41 37.2"
          stroke="#FFFFFF"
          strokeWidth="2.6"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      </svg>
    </div>
  );
}

function Creative99FoodEmblem() {
  return (
    <div className="relative flex items-center justify-center w-14 h-14 rounded-2xl bg-gradient-to-br from-[#FFDE24] to-[#F5B800] shadow-[0_10px_24px_-8px_rgba(255,204,0,0.55)] overflow-hidden">
      <svg viewBox="0 0 56 56" fill="none" className="w-full h-full" aria-hidden="true">
        {/* Kinetic arcs */}
        <circle
          cx="28"
          cy="28"
          r="23"
          stroke="#080808"
          strokeOpacity="0.12"
          strokeWidth="1.5"
          strokeDasharray="6 4"
        />
        <rect x="9" y="13" width="38" height="30" rx="9" fill="#080808" />
        <text
          x="28"
          y="34.5"
          textAnchor="middle"
          fill="#FFCC00"
          fontFamily="Manrope, sans-serif"
          fontWeight="800"
          fontSize="19"
          letterSpacing="-0.8"
        >
          99
        </text>
        {/* Dynamic yellow speed dot */}
        <circle cx="42" cy="18" r="2.2" fill="#FFDE24" />
      </svg>
    </div>
  );
}

function CreativeWhatsAppEmblem() {
  return (
    <div className="relative flex items-center justify-center w-12 h-12 rounded-xl bg-[#25D366]/15 border border-[#25D366]/35">
      <svg viewBox="0 0 32 32" fill="none" className="w-7 h-7" aria-hidden="true">
        <path
          d="M16 5.2C10.1 5.2 5.2 10 5.2 15.9C5.2 18 5.8 19.9 6.8 21.6L5.4 26.8L10.8 25.4C12.4 26.3 14.1 26.7 16 26.7C21.9 26.7 26.8 21.9 26.8 16C26.8 10 21.9 5.2 16 5.2ZM22.1 20.3C21.8 21 20.6 21.7 20 21.8C19.4 21.9 18.8 21.9 18 21.7C17.5 21.5 16.8 21.3 15.9 20.9C12.3 19.3 10 15.7 9.8 15.5C9.6 15.2 8.4 13.6 8.4 11.8C8.4 10 9.3 9.1 9.6 8.8C9.9 8.5 10.3 8.4 10.6 8.4H11.3C11.5 8.4 11.8 8.4 12.1 9.1C12.4 9.8 13.1 11.5 13.2 11.7C13.3 11.9 13.3 12.2 13.2 12.5C13.1 12.8 13 12.9 12.7 13.2C12.4 13.5 12.2 13.7 12 14C11.7 14.3 11.5 14.5 11.8 15C12.1 15.5 12.9 16.8 14.1 17.9C15.7 19.3 17 19.8 17.5 20C18 20.2 18.3 20.1 18.6 19.8C18.9 19.5 19.7 18.5 20 18.1C20.3 17.7 20.6 17.7 21 17.9C21.4 18.1 23.2 19 23.6 19.2C24 19.4 24.3 19.5 24.4 19.7C24.5 19.9 22.4 19.6 22.1 20.3Z"
          fill="#25D366"
        />
        {/* Subtle chat wave arcs */}
        <path
          d="M25.5 7.5C27 9 28 10.9 28.2 13"
          stroke="#25D366"
          strokeWidth="1.6"
          strokeLinecap="round"
          className="opacity-0 group-hover:opacity-100 transition-opacity duration-200"
        />
      </svg>
    </div>
  );
}

export function LinksSection({ ready, reducedMotion }: LinksSectionProps) {
  const [menuNoticeVisible, setMenuNoticeVisible] = useState(false);

  const hasMenuUrl = MENU_URL.trim().length > 0;

  const handleEmptyMenuClick = () => {
    setMenuNoticeVisible(true);
    window.setTimeout(() => {
      setMenuNoticeVisible(false);
    }, 4500);
  };

  return (
    <section aria-label="Canais de atendimento e pedidos" className="w-full">
      <div className="grid grid-cols-2 gap-3.5">
        {/* Botão 1 — CARDÁPIO (Hero Full-Width Tile) */}
        <LinkButton
          layout="wide"
          variant="primary"
          title="EXPLORAR CARDÁPIO"
          subtitle="Conheça todas as nossas delícias"
          href={hasMenuUrl ? MENU_URL : undefined}
          onClick={hasMenuUrl ? undefined : handleEmptyMenuClick}
          icon={<CreativeBurgerEmblem />}
          index={0}
          ready={ready}
          reducedMotion={reducedMotion}
        />

        <AnimatePresence>
          {menuNoticeVisible && !hasMenuUrl && (
            <motion.div
              role="status"
              initial={{ opacity: 0, y: -4 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -4 }}
              transition={{ duration: 0.2 }}
              className="col-span-2 px-4 py-2.5 rounded-xl bg-[#141413] border border-[#FFD000]/35 text-xs text-white/90 leading-relaxed"
            >
              Nosso cardápio digital direto está sendo atualizado. Enquanto isso, faça seu pedido pelo{' '}
              <span className="text-[#FFD000] font-semibold">iFood</span>,{' '}
              <span className="text-[#FFD000] font-semibold">99Food</span> ou{' '}
              <span className="text-[#FFD000] font-semibold">WhatsApp</span> logo abaixo.
            </motion.div>
          )}
        </AnimatePresence>

        {/* Botão 2 — IFOOD (Bento Tile) */}
        <LinkButton
          layout="tile"
          variant="secondary"
          title="PEÇA PELO IFOOD"
          subtitle="Seu pedido pelo iFood"
          href={siteConfig.ifoodUrl}
          icon={<CreativeIFoodEmblem />}
          spotlightColor="rgba(234, 29, 44, 0.22)"
          accentHoverClass="hover:border-[#EA1D2C]/55"
          index={1}
          ready={ready}
          reducedMotion={reducedMotion}
        />

        {/* Botão 3 — 99FOOD (Bento Tile) */}
        <LinkButton
          layout="tile"
          variant="secondary"
          title="PEÇA PELO 99FOOD"
          subtitle="Peça pelo app da 99"
          href={siteConfig.food99Url}
          icon={<Creative99FoodEmblem />}
          spotlightColor="rgba(255, 204, 0, 0.18)"
          accentHoverClass="hover:border-[#FFCC00]/55"
          index={2}
          ready={ready}
          reducedMotion={reducedMotion}
        />

        {/* Botão 4 — WHATSAPP (Wide Interactive Tile) */}
        <LinkButton
          layout="wide"
          variant="secondary"
          title="FALE COM A GENTE"
          subtitle="Atendimento pelo WhatsApp"
          href={siteConfig.whatsappUrl}
          icon={<CreativeWhatsAppEmblem />}
          spotlightColor="rgba(37, 211, 102, 0.16)"
          accentHoverClass="hover:border-[#25D366]/55"
          index={3}
          ready={ready}
          reducedMotion={reducedMotion}
        />
      </div>
    </section>
  );
}
