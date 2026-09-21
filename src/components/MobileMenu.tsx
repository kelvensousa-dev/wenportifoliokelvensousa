'use client';

import { Menu, X } from 'lucide-react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useEffect, useState } from 'react';

export type MenuLink = { href: string; label: string; external?: boolean };

/**
 * Menu para celular e tablet. Antes existia apenas o icone "hamburguer"
 * sem nenhuma acao: no celular nao havia como chegar ao login, ao contato
 * nem ao portfolio.
 */
export default function MobileMenu({ links, breakpoint = 'md' }: { links: MenuLink[]; breakpoint?: 'md' | 'lg' | 'xl' }) {
  const [open, setOpen] = useState(false);
  const pathname = usePathname();

  useEffect(() => setOpen(false), [pathname]);

  useEffect(() => {
    if (!open) return;
    const onKey = (event: KeyboardEvent) => event.key === 'Escape' && setOpen(false);
    document.addEventListener('keydown', onKey);
    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    return () => {
      document.removeEventListener('keydown', onKey);
      document.body.style.overflow = previousOverflow;
    };
  }, [open]);

  const hiddenAt = { md: 'md:hidden', lg: 'lg:hidden', xl: 'xl:hidden' }[breakpoint];

  return (
    <>
      <button
        type="button"
        aria-label={open ? 'Fechar menu' : 'Abrir menu'}
        aria-expanded={open}
        onClick={() => setOpen((value) => !value)}
        className={`rounded-full border border-black/10 bg-white p-2.5 ${hiddenAt}`}
      >
        {open ? <X size={18} /> : <Menu size={18} />}
      </button>
      {open && (
        <div className={`fixed inset-0 z-50 ${hiddenAt}`} role="dialog" aria-modal="true" aria-label="Menu">
          <button type="button" aria-label="Fechar menu" className="absolute inset-0 bg-[#1A202C]/40 backdrop-blur-sm" onClick={() => setOpen(false)} />
          <nav className="absolute right-3 top-3 w-[min(20rem,calc(100vw-1.5rem))] rounded-3xl bg-white p-3 shadow-2xl">
            <div className="flex justify-end">
              <button type="button" aria-label="Fechar menu" onClick={() => setOpen(false)} className="rounded-full p-2 text-[#718096] hover:bg-[#F8F9FA]">
                <X size={18} />
              </button>
            </div>
            <ul className="grid gap-1 pb-2">
              {links.map((link) => (
                <li key={`${link.href}-${link.label}`}>
                  {link.external || link.href.startsWith('#') ? (
                    <a href={link.href} onClick={() => setOpen(false)} className="flex min-h-12 items-center rounded-2xl px-4 text-sm font-bold text-[#1A202C] hover:bg-[#F8F9FA]">
                      {link.label}
                    </a>
                  ) : (
                    <Link href={link.href} className="flex min-h-12 items-center rounded-2xl px-4 text-sm font-bold text-[#1A202C] hover:bg-[#F8F9FA]">
                      {link.label}
                    </Link>
                  )}
                </li>
              ))}
            </ul>
          </nav>
        </div>
      )}
    </>
  );
}
