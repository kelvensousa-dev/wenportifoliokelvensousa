'use client';

import Link from 'next/link';
import { useSession } from 'next-auth/react';
import LanguageSelector from '@/components/LanguageSelector';
import MobileMenu from '@/components/MobileMenu';
import SiteFooter from '@/components/SiteFooter';
import { useLanguage } from '@/components/LanguageContext';

export default function PublicShell({ children }: Readonly<{ children: React.ReactNode }>) {
  const { translate } = useLanguage();
  const { status } = useSession();
  const loggedIn = status === 'authenticated';

  const menuLinks = [
    { href: '/', label: translate('home') },
    { href: '/dashboard', label: translate('portfolio') },
    { href: '/contato', label: translate('contact') },
    loggedIn ? { href: '/dashboard/notificacoes', label: 'Minhas compras' } : { href: '/login', label: 'Entrar' }
  ];

  return (
    <div className="flex min-h-screen flex-col bg-[#F8F9FA] text-[#1A202C]">
      <header className="sticky top-0 z-40 border-b border-black/5 bg-[#F8F9FA]/90 px-4 py-4 backdrop-blur-xl sm:px-6 lg:px-10">
        <div className="mx-auto flex max-w-7xl items-center justify-between gap-4">
          <Link href="/" className="flex shrink-0 items-center gap-3 font-display text-base font-bold tracking-tight sm:text-lg">
            <span className="flex h-9 w-9 items-center justify-center rounded-xl bg-[#1A202C] text-sm text-white">K.</span>
            <span>
              KELVEN<span className="font-normal text-[#A0AEC0]">/STUDIO</span>
            </span>
          </Link>
          <nav aria-label="Principal" className="hidden items-center gap-7 text-sm font-semibold text-[#718096] md:flex">
            <Link href="/" className="hover:text-[#1A202C]">{translate('home')}</Link>
            <Link href="/dashboard" className="hover:text-[#1A202C]">{translate('portfolio')}</Link>
            <Link href="/contato" className="hover:text-[#1A202C]">{translate('contact')}</Link>
          </nav>
          <div className="flex items-center gap-2">
            <LanguageSelector />
            <Link
              href={loggedIn ? '/dashboard/notificacoes' : '/login'}
              className="hidden rounded-full border border-black/10 bg-white px-4 py-2 text-xs font-bold transition hover:bg-[#1A202C] hover:text-white md:inline-flex"
            >
              {loggedIn ? 'Minhas compras' : 'Entrar'}
            </Link>
            <MobileMenu links={menuLinks} />
          </div>
        </div>
      </header>

      <main className="flex-1">{children}</main>

      <SiteFooter />
    </div>
  );
}
