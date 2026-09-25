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
const themes = {
  light: {
    footer: 'border-black/5 bg-white text-[#1A202C]',
    card: 'border-black/5 bg-[#F8F9FA] hover:border-[#36B7C9]',
    iconBox: 'bg-[#EFFFFF] text-[#1597A8]',
    muted: 'text-[#718096]',
    faint: 'text-[#A0AEC0]',
    link: 'hover:text-[#1A202C]',
    divider: 'border-black/5',
    logo: 'bg-[#1A202C] text-white',
    social: 'border-black/10 text-[#718096] hover:text-[#1A202C]',
    panel: 'bg-[#F8F9FA]',
    button: 'bg-[#1A202C] text-white hover:bg-[#2D3748]',
    whatsIcon: 'text-[#277C73]',
    accentIcon: 'text-[#1597A8]'
  },
  dark: {
    footer: 'border-studio-line bg-studio-bg text-studio-text',
    card: 'border-studio-line bg-studio-surface hover:border-studio-amber',
    iconBox: 'bg-studio-amber/15 text-studio-amber',
    muted: 'text-studio-muted',
    faint: 'text-studio-faint',
    link: 'hover:text-studio-amber',
    divider: 'border-studio-line',
    logo: 'bg-studio-amber text-studio-ink',
    social: 'border-studio-edge text-studio-muted hover:text-studio-amber',
    panel: 'bg-studio-surface',
    button: 'bg-studio-amber text-studio-ink hover:bg-studio-amber-hover',
    whatsIcon: 'text-studio-amber',
    accentIcon: 'text-studio-amber'
  }
} as const;

/** `tone="dark"` e usado na home (tema escuro ambar); o padrao segue claro. */
export default function SiteFooter({ tone = 'light' }: { tone?: 'light' | 'dark' }) {
  const { translate } = useLanguage();
  const t = themes[tone];

  return (
    <footer className={`border-t px-6 py-12 lg:px-10 ${t.footer}`}>
      <div className="mx-auto grid max-w-7xl gap-4 sm:grid-cols-3">
        {consumerHighlights.map(({ href, icon: Icon, title, text }) => (
          <Link key={href} href={href} className={`group flex items-start gap-4 rounded-2xl border p-5 transition ${t.card}`}>
            <span className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-xl ${t.iconBox}`}><Icon size={18} /></span>
            <span>
              <strong className="block text-sm">{title}</strong>
              <small className={`mt-1 block text-xs leading-5 ${t.muted}`}>{text}</small>
            </span>
          </Link>
        ))}
      </div>

      <div className={`mx-auto mt-12 grid max-w-7xl gap-10 border-t pt-12 sm:grid-cols-2 lg:grid-cols-[1.4fr_.8fr_1fr_1.3fr] ${t.divider}`}>
        <div>
          <Link href="/" className="flex items-center gap-3 font-display text-lg font-bold tracking-tight">
            <span className={`flex h-9 w-9 items-center justify-center rounded-xl text-sm ${t.logo}`}>K.</span> KELVEN/STUDIO
          </Link>
          <p className={`mt-4 max-w-xs text-sm leading-6 ${t.muted}`}>{translate('digitalProducts')}</p>
          <ul className={`mt-5 grid gap-2 text-sm ${t.muted}`}>
            <li>
              <a href={whatsappUrl} target="_blank" rel="noopener noreferrer" className={`inline-flex items-center gap-2 ${t.link}`}>
                <MessageCircle size={15} className={t.whatsIcon} /> <span data-no-translate>{whatsappDisplay}</span>
              </a>
            </li>
            <li>
              <a href={`mailto:${contactEmail}`} className={`inline-flex items-center gap-2 break-all ${t.link}`}>
                <Mail size={15} className={t.accentIcon} /> <span data-no-translate>{contactEmail}</span>
              </a>
            </li>
          </ul>
          <div className="mt-5 flex gap-2">
            {socialLinks.linkedin && (
              <a href={socialLinks.linkedin} target="_blank" rel="noopener noreferrer" aria-label="LinkedIn" className={`rounded-full border p-2 ${t.social}`}><Linkedin size={15} /></a>
            )}
            {socialLinks.instagram && (
              <a href={socialLinks.instagram} target="_blank" rel="noopener noreferrer" aria-label="Instagram" className={`rounded-full border p-2 ${t.social}`}><Instagram size={15} /></a>
            )}
          </div>
        </div>
        <div>
          <p className={`text-xs font-extrabold uppercase tracking-[0.18em] ${t.faint}`}>Produto</p>
          <div className={`mt-4 grid gap-3 text-sm ${t.muted}`}>
            <Link href="/dashboard" className={t.link}>{translate('portfolio')}</Link>
            <Link href="/contato" className={t.link}>{translate('contact')}</Link>
          </div>
        </div>
        <nav aria-label="Informações legais">
          <p className={`text-xs font-extrabold uppercase tracking-[0.18em] ${t.faint}`}>Informações legais</p>
          <ul className={`mt-4 grid gap-3 text-sm ${t.muted}`}>
            {legalLinks.map((link) => (
              <li key={link.href}><Link href={link.href} className={t.link}>{link.label}</Link></li>
            ))}
          </ul>
        </nav>
        <div className="grid content-start gap-4">
          <div className={`rounded-2xl p-5 ${t.panel}`}>
            <MessageCircle size={20} className={t.whatsIcon} />
            <p className="mt-3 text-sm font-bold">Central de atendimento</p>
            <p className={`mt-2 text-xs leading-5 ${t.muted}`}>Assistente virtual com IA no WhatsApp, 24 horas por dia. Peça um atendente humano quando quiser.</p>
            <a href={whatsappUrl} target="_blank" rel="noopener noreferrer" className={`mt-4 inline-flex items-center gap-2 rounded-full px-4 py-2 text-xs font-bold transition ${t.button}`}>Falar no WhatsApp</a>
          </div>
          <div className={`rounded-2xl p-5 ${t.panel}`}>
            <ShieldCheck size={20} className={t.accentIcon} />
            <p className="mt-3 text-sm font-bold">Compra protegida</p>
            <p className={`mt-2 text-xs leading-5 ${t.muted}`}>Conexão criptografada (HTTPS). Pagamentos processados pelo Stripe — os dados do cartão nunca passam pelos nossos servidores.</p>
          </div>
        </div>
      </div>

      <div className={`mx-auto mt-10 flex max-w-7xl flex-col justify-between gap-4 border-t pt-6 text-xs leading-5 md:flex-row ${t.divider} ${t.faint}`}>
        <div>
          <p data-no-translate>© {new Date().getFullYear()} {company.name}{company.document ? ` · ${company.document}` : ''}</p>
          {company.address && <p data-no-translate>{company.address}</p>}
        </div>
        <span>Pagamentos via Stripe · LGPD</span>
      </div>
    </footer>
  );
}
