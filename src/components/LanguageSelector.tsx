'use client';

import { Check, ChevronDown, Globe2 } from 'lucide-react';
import { useEffect, useRef, useState } from 'react';
import { useLanguage, type SiteLanguage } from '@/components/LanguageContext';

type Language = { code: SiteLanguage; label: string; nativeLabel: string };

const languages: Language[] = [
  { code: 'pt-BR', label: 'PT', nativeLabel: 'Português' },
  { code: 'es', label: 'ES', nativeLabel: 'Español' },
  { code: 'en-US', label: 'EN', nativeLabel: 'English (US)' }
];

/** `tone="dark"` adapta o botao para fundos escuros (home). */
export default function LanguageSelector({ tone = 'light' }: { tone?: 'light' | 'dark' }) {
  const { language, setLanguage, translate } = useLanguage();
  const [open, setOpen] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);
  const selectedLanguage = languages.find((item) => item.code === language) ?? languages[0];

  // Fecha ao clicar fora ou apertar Esc (antes o menu so fechava escolhendo um idioma).
  useEffect(() => {
    if (!open) return;
    const onPointer = (event: PointerEvent) => {
      if (containerRef.current && !containerRef.current.contains(event.target as Node)) setOpen(false);
    };
    const onKey = (event: KeyboardEvent) => {
      if (event.key === 'Escape') setOpen(false);
    };
    document.addEventListener('pointerdown', onPointer);
    document.addEventListener('keydown', onKey);
    return () => {
      document.removeEventListener('pointerdown', onPointer);
      document.removeEventListener('keydown', onKey);
    };
  }, [open]);

  return (
    <div ref={containerRef} className="relative block" data-no-translate>
      <button
        type="button"
        aria-haspopup="listbox"
        aria-expanded={open}
        aria-label={translate('selectLanguage')}
        onClick={() => setOpen((value) => !value)}
        className={`inline-flex min-h-10 items-center gap-1 rounded-full border px-2.5 py-2 text-xs font-bold transition sm:px-3 ${
          tone === 'dark' ? 'border-studio-edge bg-studio-surface text-studio-text hover:border-studio-amber' : 'border-black/10 bg-white hover:border-[#36B7C9]'
        }`}
      >
        <Globe2 size={14} /> {selectedLanguage.label}
        <ChevronDown size={13} className={open ? 'rotate-180 transition' : 'transition'} />
      </button>
      {open && (
        <div role="listbox" aria-label={translate('selectLanguage')} className="absolute right-0 top-12 z-50 w-48 max-w-[calc(100vw-2rem)] overflow-hidden rounded-2xl border border-black/10 bg-white p-1.5 shadow-xl">
          {languages.map((option) => (
            <button
              type="button"
              role="option"
              aria-selected={option.code === language}
              key={option.code}
              onClick={() => {
                setLanguage(option.code);
                setOpen(false);
              }}
              className="flex min-h-11 w-full items-center justify-between rounded-xl px-3 py-2.5 text-left text-xs font-semibold text-[#4A5568] transition hover:bg-[#F8F9FA] hover:text-[#1A202C]"
            >
              <span>
                <strong className="mr-2 text-[#1A202C]">{option.label}</strong>
                {option.nativeLabel}
              </span>
              {option.code === language && <Check size={14} className="text-[#36B7C9]" />}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
