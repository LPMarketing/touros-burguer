import { siteConfig } from '../config/siteConfig';

export function ClicaePromoCard() {
  return (
    <div className="mt-6 w-full">
      <a
        href={siteConfig.clicaeUrl}
        target="_blank"
        rel="noopener noreferrer"
        className="group flex items-center gap-3.5 sm:gap-4 w-full p-[18px] rounded-2xl bg-[#141413] border border-[#FFD000]/20 hover:border-[#FFD000]/45 transition-colors duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#FFD000] focus-visible:ring-offset-2 focus-visible:ring-offset-[#080808]"
      >
        <img
          src={siteConfig.media.clicaeLogoSrc}
          alt="Logo Clicaê"
          width={40}
          height={40}
          loading="lazy"
          referrerPolicy="no-referrer"
          className="w-10 h-10 rounded-full object-cover shrink-0 select-none"
        />

        <div className="flex flex-col items-start text-left min-w-0 flex-1">
          <span className="text-[11px] font-semibold uppercase tracking-[0.16em] text-[#A5A5A5] leading-tight">
            CRIADO POR CLICAÊ
          </span>

          <p className="mt-1 text-[15px] sm:text-base font-semibold text-white leading-snug break-words">
            Sua empresa também pode ter uma bio assim.
          </p>

          <span className="mt-1.5 inline-flex items-center gap-1.5 text-xs sm:text-[13px] font-bold text-[#FFD000] leading-tight">
            <span>Quero o meu</span>
            <span
              className="inline-block transition-transform duration-200 group-hover:translate-x-1"
              aria-hidden="true"
            >
              →
            </span>
          </span>
        </div>
      </a>
    </div>
  );
}
