'use client';

import { Check, ChevronDown, Globe2 } from 'lucide-react';
import { useLanguage } from '@/components/LanguageContext';
import { useEffect, useState } from 'react';

type Language = { code: string; label: string; nativeLabel: string };

const languages: Language[] = [
  { code: 'pt-BR', label: 'PT', nativeLabel: 'Português' },
  { code: 'es', label: 'ES', nativeLabel: 'Español' },
  { code: 'en-US', label: 'EN-US', nativeLabel: 'English (US)' }
];

export default function LanguageSelector() {
  const { language, setLanguage, translate } = useLanguage();
  const [open, setOpen] = useState(false);
  const selectedLanguage = languages.find((item) => item.code === language) ?? languages[0];

  useEffect(() => {
    const savedLanguage = window.localStorage.getItem('kelven-language');
    if (savedLanguage && languages.some((item) => item.code === savedLanguage)) setLanguage(savedLanguage as 'pt-BR' | 'es' | 'en-US');
  }, []);

  function selectLanguage(language: Language) {
    setLanguage(language.code as 'pt-BR' | 'es' | 'en-US');
    setOpen(false);
  }

  return <div className="relative block"><button type="button" aria-haspopup="listbox" aria-expanded={open} aria-label={translate('selectLanguage')} onClick={() => setOpen((value) => !value)} className="inline-flex min-h-10 items-center gap-1 rounded-full border border-black/10 bg-white px-2.5 py-2 text-xs font-bold transition hover:border-[#36B7C9] sm:px-3"><Globe2 size={14} /> {selectedLanguage.label} <ChevronDown size={13} className={open ? 'rotate-180 transition' : 'transition'} /></button>{open && <div role="listbox" aria-label="Idiomas disponíveis" className="absolute right-0 top-12 z-40 w-48 max-w-[calc(100vw-2rem)] overflow-hidden rounded-2xl border border-black/10 bg-white p-1.5 shadow-xl">{languages.map((languageOption) => <button type="button" role="option" aria-selected={languageOption.code === language} key={languageOption.code} onClick={() => selectLanguage(languageOption)} className="flex min-h-11 w-full items-center justify-between rounded-xl px-3 py-2.5 text-left text-xs font-semibold text-[#4A5568] transition hover:bg-[#F8F9FA] hover:text-[#1A202C]"><span><strong className="mr-2 text-[#1A202C]">{languageOption.label}</strong>{languageOption.nativeLabel}</span>{languageOption.code === language && <Check size={14} className="text-[#36B7C9]" />}</button>)}</div>}</div>;
}
