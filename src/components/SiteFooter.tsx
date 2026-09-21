'use client';

import { Headset, Instagram, Linkedin, Mail, MessageCircle, RotateCcw, Scale, ShieldCheck } from 'lucide-react';
import Link from 'next/link';
import { useLanguage } from '@/components/LanguageContext';
import { legalLinks } from '@/lib/legal';
import { company, contactEmail, socialLinks, whatsappDisplay, whatsappUrl } from '@/lib/site';

/** Direitos do consumidor sempre visiveis (CDC / Decreto 7.962/2013). */
const consumerHighlights = [
  { href: '/politica-de-compra', icon: RotateCcw, title: '7 dias para desistir', text: 'Direito de arrependimento nas compras online (CDC, art. 49).' },
  { href: '/garantias-e-direitos', icon: Scale, title: 'Garantia legal', text: 'Proteção contra defeitos e oferta descumprida, conforme a lei.' },
  { href: '/atendimento', icon: Headset, title: 'Amparo ao consumidor', text: 'WhatsApp com assistente virtual (IA) e equipe humana.' }
];

/**
 * Rodape unico do site. Antes a home e o portfolio tinham rodapes proprios,
 * so com 3 links, e apenas as paginas dentro do PublicShell tinham o completo.
 */
export default function SiteFooter() {
  const { translate } = useLanguage();

  return (
    <footer className="border-t border-black/5 bg-white px-6 py-12 lg:px-10">
      <div className="mx-auto grid max-w-7xl gap-4 sm:grid-cols-3">
        {consumerHighlights.map(({ href, icon: Icon, title, text }) => (
          <Link key={href} href={href} className="group flex items-start gap-4 rounded-2xl border border-black/5 bg-[#F8F9FA] p-5 transition hover:border-[#36B7C9]">
            <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-[#EFFFFF] text-[#1597A8]"><Icon size={18} /></span>
            <span>
              <strong className="block text-sm">{title}</strong>
              <small className="mt-1 block text-xs leading-5 text-[#718096]">{text}</small>
            </span>
          </Link>
        ))}
      </div>

      <div className="mx-auto mt-12 grid max-w-7xl gap-10 border-t border-black/5 pt-12 sm:grid-cols-2 lg:grid-cols-[1.4fr_.8fr_1fr_1.3fr]">
        <div>
          <Link href="/" className="flex items-center gap-3 font-display text-lg font-bold tracking-tight">
            <span className="flex h-9 w-9 items-center justify-center rounded-xl bg-[#1A202C] text-sm text-white">K.</span> KELVEN/STUDIO
          </Link>
          <p className="mt-4 max-w-xs text-sm leading-6 text-[#718096]">{translate('digitalProducts')}</p>
          <ul className="mt-5 grid gap-2 text-sm text-[#718096]">
            <li>
              <a href={whatsappUrl} target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-2 hover:text-[#1A202C]">
                <MessageCircle size={15} className="text-[#277C73]" /> <span data-no-translate>{whatsappDisplay}</span>
              </a>
            </li>
            <li>
              <a href={`mailto:${contactEmail}`} className="inline-flex items-center gap-2 break-all hover:text-[#1A202C]">
                <Mail size={15} className="text-[#1597A8]" /> <span data-no-translate>{contactEmail}</span>
              </a>
            </li>
          </ul>
          <div className="mt-5 flex gap-2">
            {socialLinks.linkedin && (
              <a href={socialLinks.linkedin} target="_blank" rel="noopener noreferrer" aria-label="LinkedIn" className="rounded-full border border-black/10 p-2 text-[#718096] hover:text-[#1A202C]"><Linkedin size={15} /></a>
            )}
            {socialLinks.instagram && (
              <a href={socialLinks.instagram} target="_blank" rel="noopener noreferrer" aria-label="Instagram" className="rounded-full border border-black/10 p-2 text-[#718096] hover:text-[#1A202C]"><Instagram size={15} /></a>
            )}
          </div>
        </div>
        <div>
          <p className="text-xs font-extrabold uppercase tracking-[0.18em] text-[#A0AEC0]">Produto</p>
          <div className="mt-4 grid gap-3 text-sm text-[#718096]">
            <Link href="/dashboard" className="hover:text-[#1A202C]">{translate('portfolio')}</Link>
            <Link href="/contato" className="hover:text-[#1A202C]">{translate('contact')}</Link>
          </div>
        </div>
        <nav aria-label="Informações legais">
          <p className="text-xs font-extrabold uppercase tracking-[0.18em] text-[#A0AEC0]">Informações legais</p>
          <ul className="mt-4 grid gap-3 text-sm text-[#718096]">
            {legalLinks.map((link) => (
              <li key={link.href}><Link href={link.href} className="hover:text-[#1A202C]">{link.label}</Link></li>
            ))}
          </ul>
        </nav>
        <div className="grid content-start gap-4">
          <div className="rounded-2xl bg-[#F8F9FA] p-5">
            <MessageCircle size={20} className="text-[#277C73]" />
            <p className="mt-3 text-sm font-bold">Central de atendimento</p>
            <p className="mt-2 text-xs leading-5 text-[#718096]">Assistente virtual com IA no WhatsApp, 24 horas por dia. Peça um atendente humano quando quiser.</p>
            <a href={whatsappUrl} target="_blank" rel="noopener noreferrer" className="mt-4 inline-flex items-center gap-2 rounded-full bg-[#1A202C] px-4 py-2 text-xs font-bold text-white transition hover:bg-[#2D3748]">Falar no WhatsApp</a>
          </div>
          <div className="rounded-2xl bg-[#F8F9FA] p-5">
            <ShieldCheck size={20} className="text-[#36A5B4]" />
            <p className="mt-3 text-sm font-bold">Compra protegida</p>
            <p className="mt-2 text-xs leading-5 text-[#718096]">Conexão criptografada (HTTPS). Pagamentos processados pelo Stripe — os dados do cartão nunca passam pelos nossos servidores.</p>
          </div>
        </div>
      </div>

      <div className="mx-auto mt-10 flex max-w-7xl flex-col justify-between gap-4 border-t border-black/5 pt-6 text-xs leading-5 text-[#A0AEC0] md:flex-row">
        <div>
          <p data-no-translate>© {new Date().getFullYear()} {company.name}{company.document ? ` · ${company.document}` : ''}</p>
          {company.address && <p data-no-translate>{company.address}</p>}
        </div>
        <span>Pagamentos via Stripe · LGPD</span>
      </div>
    </footer>
  );
}
