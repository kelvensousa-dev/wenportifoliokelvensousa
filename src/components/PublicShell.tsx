'use client';

import { Instagram, Linkedin, Mail, ShieldCheck } from 'lucide-react';
import Link from 'next/link';
import { useSession } from 'next-auth/react';
import LanguageSelector from '@/components/LanguageSelector';
import MobileMenu from '@/components/MobileMenu';
import { useLanguage } from '@/components/LanguageContext';
import { contactEmail, socialLinks } from '@/lib/site';

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

      <footer className="border-t border-black/5 bg-white px-6 py-12 lg:px-10">
        <div className="mx-auto grid max-w-7xl gap-10 sm:grid-cols-2 md:grid-cols-[1.5fr_1fr_1fr_1fr]">
          <div>
            <Link href="/" className="flex items-center gap-3 font-display text-lg font-bold tracking-tight">
              <span className="flex h-9 w-9 items-center justify-center rounded-xl bg-[#1A202C] text-sm text-white">K.</span> KELVEN/STUDIO
            </Link>
            <p className="mt-4 max-w-xs text-sm leading-6 text-[#718096]">{translate('digitalProducts')}</p>
            <div className="mt-5 flex gap-2">
              {socialLinks.linkedin && (
                <a href={socialLinks.linkedin} target="_blank" rel="noopener noreferrer" aria-label="LinkedIn" className="rounded-full border border-black/10 p-2 text-[#718096] hover:text-[#1A202C]"><Linkedin size={15} /></a>
              )}
              {socialLinks.instagram && (
                <a href={socialLinks.instagram} target="_blank" rel="noopener noreferrer" aria-label="Instagram" className="rounded-full border border-black/10 p-2 text-[#718096] hover:text-[#1A202C]"><Instagram size={15} /></a>
              )}
              <a href={`mailto:${contactEmail}`} aria-label="E-mail" className="rounded-full border border-black/10 p-2 text-[#718096] hover:text-[#1A202C]"><Mail size={15} /></a>
            </div>
          </div>
          <div>
            <p className="text-xs font-extrabold uppercase tracking-[0.18em] text-[#A0AEC0]">Produto</p>
            <div className="mt-4 grid gap-3 text-sm text-[#718096]">
              <Link href="/dashboard">{translate('portfolio')}</Link>
              <Link href="/contato">{translate('contact')}</Link>
            </div>
          </div>
          <div>
            <p className="text-xs font-extrabold uppercase tracking-[0.18em] text-[#A0AEC0]">Empresa</p>
            <div className="mt-4 grid gap-3 text-sm text-[#718096]">
              <Link href="/termos-de-uso">Termos de uso</Link>
              <Link href="/politica-de-privacidade">Privacidade</Link>
            </div>
          </div>
          <div className="rounded-2xl bg-[#F8F9FA] p-5">
            <ShieldCheck size={20} className="text-[#36A5B4]" />
            <p className="mt-3 text-sm font-bold">Compra protegida</p>
            <p className="mt-2 text-xs leading-5 text-[#718096]">Conexão criptografada (HTTPS). Pagamentos processados pelo Stripe — os dados do cartão nunca passam pelos nossos servidores.</p>
          </div>
        </div>
        <div className="mx-auto mt-10 flex max-w-7xl flex-col justify-between gap-3 border-t border-black/5 pt-6 text-xs text-[#A0AEC0] md:flex-row">
          <span>© {new Date().getFullYear()} Kelven Studio</span>
          <span>Pagamentos via Stripe · LGPD</span>
        </div>
      </footer>
    </div>
  );
}
