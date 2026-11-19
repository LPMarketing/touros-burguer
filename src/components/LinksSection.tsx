import { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { ArrowUpRight, X } from 'lucide-react';
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

function WhatsAppSvg({ className = 'w-7 h-7', color = '#25D366' }: { className?: string; color?: string }) {
  return (
    <svg viewBox="0 0 32 32" fill="none" className={className} aria-hidden="true">
      <path
        d="M16 5.2C10.1 5.2 5.2 10 5.2 15.9C5.2 18 5.8 19.9 6.8 21.6L5.4 26.8L10.8 25.4C12.4 26.3 14.1 26.7 16 26.7C21.9 26.7 26.8 21.9 26.8 16C26.8 10 21.9 5.2 16 5.2ZM22.1 20.3C21.8 21 20.6 21.7 20 21.8C19.4 21.9 18.8 21.9 18 21.7C17.5 21.5 16.8 21.3 15.9 20.9C12.3 19.3 10 15.7 9.8 15.5C9.6 15.2 8.4 13.6 8.4 11.8C8.4 10 9.3 9.1 9.6 8.8C9.9 8.5 10.3 8.4 10.6 8.4H11.3C11.5 8.4 11.8 8.4 12.1 9.1C12.4 9.8 13.1 11.5 13.2 11.7C13.3 11.9 13.3 12.2 13.2 12.5C13.1 12.8 13 12.9 12.7 13.2C12.4 13.5 12.2 13.7 12 14C11.7 14.3 11.5 14.5 11.8 15C12.1 15.5 12.9 16.8 14.1 17.9C15.7 19.3 17 19.8 17.5 20C18 20.2 18.3 20.1 18.6 19.8C18.9 19.5 19.7 18.5 20 18.1C20.3 17.7 20.6 17.7 21 17.9C21.4 18.1 23.2 19 23.6 19.2C24 19.4 24.3 19.5 24.4 19.7C24.5 19.9 22.4 19.6 22.1 20.3Z"
        fill={color}
      />
      <path
        d="M25.5 7.5C27 9 28 10.9 28.2 13"
        stroke={color}
        strokeWidth="1.6"
        strokeLinecap="round"
        className="opacity-0 group-hover:opacity-100 transition-opacity duration-200"
      />
    </svg>
  );
}

function CreativeWhatsAppEmblem() {
  return (
    <div className="relative flex items-center justify-center w-12 h-12 rounded-xl bg-[#25D366]/15 border border-[#25D366]/35">
      <WhatsAppSvg className="w-7 h-7" />
    </div>
  );
}

export function LinksSection({ ready, reducedMotion }: LinksSectionProps) {
  const [menuNoticeVisible, setMenuNoticeVisible] = useState(false);
  const [whatsappPopupOpen, setWhatsappPopupOpen] = useState(false);

  const hasMenuUrl = MENU_URL.trim().length > 0;

  const handleEmptyMenuClick = () => {
    setMenuNoticeVisible(true);
    window.setTimeout(() => {
      setMenuNoticeVisible(false);
    }, 4500);
  };

  useEffect(() => {
    if (!whatsappPopupOpen) return;

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        setWhatsappPopupOpen(false);
      }
    };

    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    window.addEventListener('keydown', handleKeyDown);

    return () => {
      document.body.style.overflow = previousOverflow;
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [whatsappPopupOpen]);

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
              <span className="text-[#FFD000] font-semibold">WhatsApp</span> logo abaixo.
            </motion.div>
          )}
        </AnimatePresence>

        {/* Botão 2 — WHATSAPP (Wide Interactive Card que abre o pop-up com os 2 números) */}
        <LinkButton
          layout="wide"
          variant="secondary"
          title="FALE COM A GENTE"
          subtitle="Atendimento pelo WhatsApp"
          onClick={() => setWhatsappPopupOpen(true)}
          icon={<CreativeWhatsAppEmblem />}
          spotlightColor="rgba(37, 211, 102, 0.16)"
          accentHoverClass="hover:border-[#25D366]/55"
          index={1}
          ready={ready}
          reducedMotion={reducedMotion}
        />
      </div>

      {/* Pop-up de seleção entre os 2 WhatsApps */}
      <AnimatePresence>
        {whatsappPopupOpen && (
          <motion.div
            className="fixed inset-0 z-50 flex items-end sm:items-center justify-center p-4 bg-black/75 backdrop-blur-[2px]"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: reducedMotion ? 0.01 : 0.2 }}
            onClick={() => setWhatsappPopupOpen(false)}
          >
            <motion.div
              role="dialog"
              aria-modal="true"
              aria-labelledby="whatsapp-popup-title"
              onClick={(e) => e.stopPropagation()}
              initial={reducedMotion ? { opacity: 0 } : { opacity: 0, y: 20, scale: 0.96 }}
              animate={reducedMotion ? { opacity: 1 } : { opacity: 1, y: 0, scale: 1 }}
              exit={reducedMotion ? { opacity: 0 } : { opacity: 0, y: 16, scale: 0.96 }}
              transition={{ duration: 0.24, ease: [0.16, 1, 0.3, 1] }}
              className="w-full max-w-sm rounded-2xl bg-[#141413] border border-white/15 p-5 shadow-[0_24px_60px_-16px_rgba(0,0,0,0.9)]"
              style={{ marginBottom: 'env(safe-area-inset-bottom)' }}
            >
              <div className="flex items-start justify-between gap-3">
                <div className="flex items-center gap-3 min-w-0">
                  <div className="flex items-center justify-center w-10 h-10 rounded-xl bg-[#25D366]/15 border border-[#25D366]/35 shrink-0">
                    <WhatsAppSvg className="w-6 h-6" />
                  </div>
                  <div className="min-w-0">
                    <h3
                      id="whatsapp-popup-title"
                      className="font-display uppercase tracking-wide text-xl text-white leading-tight"
                    >
                      FALE COM A GENTE
                    </h3>
                    <p className="mt-0.5 text-xs text-[#A5A5A5] font-medium">
                      Escolha um WhatsApp para enviar mensagem
                    </p>
                  </div>
                </div>

                <button
                  type="button"
                  onClick={() => setWhatsappPopupOpen(false)}
                  aria-label="Fechar opções de WhatsApp"
                  className="flex items-center justify-center w-11 h-11 -mr-2 -mt-2 rounded-xl text-[#A5A5A5] hover:text-white hover:bg-white/[0.06] transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#FFD000]"
                >
                  <X className="w-5 h-5" aria-hidden="true" />
                </button>
              </div>

              <div className="mt-4 space-y-2.5">
                {siteConfig.whatsappChannels.map((channel) => (
                  <motion.a
                    key={channel.id}
                    href={channel.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    onClick={() => setWhatsappPopupOpen(false)}
                    whileTap={reducedMotion ? undefined : { scale: 0.97 }}
                    className="group flex items-center justify-between gap-3 w-full min-h-[64px] px-4 py-3 rounded-xl bg-[#0D0D0C] hover:bg-[#191917] border border-white/10 hover:border-[#25D366]/55 transition-colors duration-150 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#25D366]"
                  >
                    <div className="flex items-center gap-3 min-w-0">
                      <div className="flex items-center justify-center w-10 h-10 rounded-lg bg-[#25D366]/15 border border-[#25D366]/30 shrink-0">
                        <WhatsAppSvg className="w-5 h-5" />
                      </div>
                      <div className="flex flex-col text-left min-w-0">
                        <span className="font-display text-lg tracking-wide text-white leading-tight">
                          {channel.title}
                        </span>
                        <span className="text-xs sm:text-[13px] font-semibold text-[#25D366] tabular-nums">
                          {channel.displayNumber}
                        </span>
                      </div>
                    </div>

                    <div className="flex items-center justify-center w-9 h-9 rounded-full bg-white/[0.05] border border-white/10 text-[#A5A5A5] group-hover:text-[#25D366] group-hover:border-[#25D366]/40 transition-colors shrink-0">
                      <ArrowUpRight
                        className="w-4 h-4 transition-transform duration-150 group-hover:translate-x-0.5 group-hover:-translate-y-0.5"
                        aria-hidden="true"
                      />
                    </div>
                  </motion.a>
                ))}
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </section>
  );
}
