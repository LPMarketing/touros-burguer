import { Instagram } from 'lucide-react';
import { siteConfig } from '../config/siteConfig';

export function InstagramFooter() {
  return (
    <footer className="w-full mt-12 pt-8 border-t border-white/10 pb-safe flex flex-col items-center text-center gap-3">
      <a
        href={siteConfig.instagramUrl}
        target="_blank"
        rel="noopener noreferrer"
        className="inline-flex items-center gap-2 min-h-[44px] px-4 py-2 rounded-xl text-sm font-semibold text-[#A5A5A5] hover:text-[#FFD000] transition-colors duration-150 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#FFD000]"
      >
        <Instagram className="w-4 h-4 shrink-0" aria-hidden="true" />
        <span>{siteConfig.instagramHandle}</span>
      </a>

      <p className="text-[11px] font-semibold tracking-[0.18em] text-[#A5A5A5]/65 uppercase">
        {siteConfig.copyright}
      </p>
    </footer>
  );
}
