'use client';

import { ArrowRight, Check, Play, Sparkles, X } from 'lucide-react';
import Link from 'next/link';
import { FormEvent, useCallback, useState } from 'react';
import { useSession } from 'next-auth/react';
import { CheckoutButton } from '@/components/CheckoutButton';
import Honeypot from '@/components/Honeypot';
import LanguageSelector from '@/components/LanguageSelector';
import MobileMenu from '@/components/MobileMenu';
import Modal from '@/components/Modal';
import SiteFooter from '@/components/SiteFooter';
import { catalog, formatPrice, segments, type PortfolioSegment } from '@/lib/products';
import { sendLead } from '@/lib/leads-client';

const filters: Array<'Todos' | PortfolioSegment> = ['Todos', ...segments];

export default function HomePage() {
  const { status } = useSession();
  const loggedIn = status === 'authenticated';
  const [activeCategory, setActiveCategory] = useState<(typeof filters)[number]>('Todos');
  const [demoOpen, setDemoOpen] = useState(false);
  const [leadSent, setLeadSent] = useState(false);
  const [leadError, setLeadError] = useState('');
  const [leadLoading, setLeadLoading] = useState(false);
  const closeDemo = useCallback(() => setDemoOpen(false), []);

  const visibleProducts = activeCategory === 'Todos' ? catalog : catalog.filter((product) => product.segment === activeCategory);

  async function submitLead(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setLeadError('');
    setLeadLoading(true);
    const error = await sendLead(event.currentTarget, 'newsletter');
    setLeadLoading(false);
    if (error) setLeadError(error);
    else setLeadSent(true);
  }

  const menuLinks = [
    { href: '#products', label: 'Produtos' },
    { href: '#difference', label: 'Por que nós' },
    { href: '/dashboard', label: 'Portfólio' },
    { href: '/contato', label: 'Contato' },
    loggedIn ? { href: '/dashboard/notificacoes', label: 'Minhas compras' } : { href: '/login', label: 'Entrar' }
  ];

  return (
    <main className="overflow-x-hidden">
      <nav aria-label="Principal" className="mx-auto flex max-w-7xl items-center justify-between gap-3 px-4 py-5 sm:px-6 lg:px-8">
        <a href="#top" className="flex shrink-0 items-center gap-3 font-display text-base font-bold tracking-tight sm:text-lg">
          <span className="flex h-9 w-9 items-center justify-center rounded-xl bg-[#1A202C] text-sm text-white">K.</span>
          <span>KELVEN<span className="font-normal text-[#A0AEC0]">/STUDIO</span></span>
        </a>
        <div className="hidden items-center gap-8 text-sm font-semibold text-[#4A5568] md:flex">
          <a href="#products" className="transition hover:text-[#1A202C]">Produtos</a>
          <a href="#difference" className="transition hover:text-[#1A202C]">Por que nós</a>
          <Link href="/contato" className="transition hover:text-[#1A202C]">Contato</Link>
        </div>
        <div className="flex items-center gap-2">
          <LanguageSelector />
          <Link href={loggedIn ? '/dashboard/notificacoes' : '/login'} className="hidden rounded-full bg-[#1A202C] px-4 py-2.5 text-xs font-bold text-white transition hover:bg-[#2D3748] md:block">
            {loggedIn ? 'Minhas compras' : 'Entrar'}
          </Link>
          <MobileMenu links={menuLinks} />
        </div>
      </nav>

      <section id="top" className="relative mx-auto grid max-w-7xl grid-cols-1 gap-14 px-4 pb-20 pt-10 sm:px-6 sm:pt-16 lg:grid-cols-[1.02fr_.98fr] lg:items-center lg:px-8 lg:pb-24 lg:pt-24">
        <div className="relative z-10">
          <div className="mb-7 flex items-center gap-2 text-xs font-extrabold uppercase tracking-[0.2em] text-[#36A5B4]"><Sparkles size={15} /> Digital, but deliberate.</div>
          <h1 className="max-w-3xl break-words font-display text-4xl font-bold leading-[0.98] tracking-[-0.05em] sm:text-5xl md:text-7xl">Produtos digitais que fazem o trabalho <span className="text-[#36B7C9]">avançar.</span></h1>
          <p className="mt-7 max-w-xl text-base leading-7 text-[#718096] sm:text-lg sm:leading-8">Sistemas, automações e interfaces criados para equipes que preferem clareza ao ruído. Compre, personalize e coloque no ar.</p>
          <div className="mt-9 flex flex-col gap-3 sm:flex-row sm:flex-wrap">
            <a href="#products" className="inline-flex items-center justify-center gap-3 rounded-full bg-[#1A202C] px-6 py-3.5 text-sm font-bold text-white transition hover:-translate-y-0.5">Explorar produtos <ArrowRight size={17} /></a>
            <button type="button" onClick={() => setDemoOpen(true)} className="inline-flex items-center justify-center gap-3 rounded-full border border-black/10 bg-white/60 px-6 py-3.5 text-sm font-bold transition hover:bg-white"><Play size={16} fill="currentColor" /> Ver o estúdio</button>
          </div>
          <div className="mt-12 flex items-center gap-5 text-xs font-semibold text-[#718096]"><div aria-hidden="true" className="flex -space-x-2"><span className="h-8 w-8 rounded-full border-2 border-[#F8F9FA] bg-[#F6AD55]" /><span className="h-8 w-8 rounded-full border-2 border-[#F8F9FA] bg-[#90CDF4]" /><span className="h-8 w-8 rounded-full border-2 border-[#F8F9FA] bg-[#9AE6B4]" /></div><span>Construído para 2.000+ makers e equipes.</span></div>
        </div>
        <div aria-hidden="true" className="relative min-h-[340px] sm:min-h-[420px] lg:min-h-[540px]">
          <div className="grid-paper absolute inset-4 rounded-[2rem] border border-white bg-white/40 shadow-glass sm:inset-8" />
          <div className="animate-drift absolute left-0 top-6 w-[85%] rounded-3xl border border-white/90 bg-white/80 p-5 shadow-glass backdrop-blur-xl sm:top-10 sm:w-[77%]">
            <div className="mb-8 flex items-center justify-between text-xs font-bold text-[#A0AEC0]"><span>WEEKLY SIGNAL</span><span className="text-[#36B7C9]">+24.8%</span></div>
            <div className="flex h-24 items-end gap-2 sm:h-32">{[30, 42, 38, 58, 52, 68, 64, 84, 78, 100].map((height, index) => <span key={index} className="flex-1 rounded-t-md bg-[#1A202C]" style={{ height: `${height}%` }} />)}</div>
            <div className="mt-5 flex items-center justify-between gap-2"><span className="font-display text-xl font-bold sm:text-2xl">$84,290</span><span className="text-xs text-[#A0AEC0]">revenue this month</span></div>
          </div>
          <div className="absolute bottom-4 right-0 w-[75%] rounded-3xl border border-white/80 bg-[#1A202C] p-5 text-white shadow-glass sm:bottom-7 sm:w-[68%] sm:p-6">
            <div className="flex items-start justify-between"><span className="text-xs font-bold uppercase tracking-widest text-[#A0AEC0]">Flow bot</span><span className="rounded-full bg-[#2D3748] px-2 py-1 text-[10px] text-[#9AE6B4]">online</span></div>
            <p className="mt-8 max-w-[220px] font-display text-xl font-bold leading-tight sm:mt-12 sm:text-2xl">Every reply, right on time.</p>
            <div className="mt-5 flex items-center gap-2 text-xs text-[#CBD5E0]"><span className="h-2 w-2 rounded-full bg-[#9AE6B4]" /> 14 conversations automated</div>
          </div>
        </div>
      </section>

      <section id="products" className="scroll-mt-6 border-y border-black/5 bg-white/60 px-4 py-20 sm:px-6 lg:px-8 lg:py-24">
        <div className="mx-auto max-w-7xl">
          <div className="flex flex-col justify-between gap-8 md:flex-row md:items-end">
            <div>
              <p className="text-xs font-extrabold uppercase tracking-[0.2em] text-[#36A5B4]">The catalogue</p>
              <h2 className="mt-3 font-display text-3xl font-bold tracking-[-0.04em] sm:text-4xl md:text-5xl">Escolha seu próximo <span className="text-[#A0AEC0]">salto.</span></h2>
            </div>
            <div className="-mx-4 flex gap-2 overflow-x-auto px-4 pb-2 md:mx-0 md:flex-wrap md:overflow-visible md:px-0">
              {filters.map((category) => (
                <button key={category} type="button" aria-pressed={activeCategory === category} onClick={() => setActiveCategory(category)} className={`shrink-0 rounded-full px-4 py-2 text-xs font-bold transition ${activeCategory === category ? 'bg-[#1A202C] text-white' : 'border border-black/10 bg-white text-[#718096] hover:text-[#1A202C]'}`}>
                  {category}
                </button>
              ))}
            </div>
          </div>
          <div className="mt-12 grid gap-5 md:grid-cols-2 xl:grid-cols-3">
            {visibleProducts.map((product) => (
              <article key={product.slug} className={`group relative flex flex-col overflow-hidden rounded-3xl border border-black/5 bg-gradient-to-br ${product.accent} p-6 transition duration-300 hover:-translate-y-1 hover:shadow-glass sm:p-7`}>
                <div className="flex flex-wrap gap-2">{product.tags.map((tag) => <span key={tag} className="rounded-full border border-black/10 bg-white/50 px-3 py-1 text-[10px] font-bold uppercase tracking-wider text-[#4A5568]">{tag}</span>)}</div>
                <div className="mt-14 flex-1">
                  <p className="text-xs font-bold uppercase tracking-[0.18em] text-[#718096]">{product.segment}</p>
                  <h3 className="mt-2 font-display text-2xl font-bold tracking-[-0.04em] sm:text-3xl">
                    <Link href={`/solucoes/${product.slug}`} className="hover:underline">{product.name}</Link>
                  </h3>
                  <p className="mt-3 text-sm leading-6 text-[#718096]">{product.summary}</p>
                </div>
                <div className="mt-7 flex flex-wrap items-center justify-between gap-3 border-t border-black/10 pt-5">
                  <span className="font-display text-xl font-bold" data-no-translate>{formatPrice(product.priceCents, product.currency)}</span>
                  <CheckoutButton productSlug={product.slug} label="Comprar" />
                </div>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section id="difference" className="mx-auto grid max-w-7xl gap-12 px-4 py-20 sm:px-6 lg:grid-cols-[.7fr_1.3fr] lg:px-8 lg:py-24">
        <div>
          <p className="text-xs font-extrabold uppercase tracking-[0.2em] text-[#36A5B4]">The difference</p>
          <h2 className="mt-3 max-w-md font-display text-3xl font-bold tracking-[-0.04em] sm:text-4xl md:text-5xl">Menos promessa. Mais produto.</h2>
          <p className="mt-5 max-w-md leading-7 text-[#718096]">Cada template nasce de um problema real, com documentação honesta e espaço para a sua própria assinatura.</p>
        </div>
        <div className="overflow-hidden rounded-3xl border border-black/10 bg-white">
          <div className="grid grid-cols-[1.4fr_1fr_1fr] border-b border-black/10 p-4 text-[10px] font-extrabold uppercase tracking-widest text-[#A0AEC0] sm:p-5 sm:text-xs"><span>O que importa</span><span className="text-[#1A202C]">Kelven Studio</span><span>Outros</span></div>
          {([['Código legível', true, false], ['Updates incluídos', true, false], ['Licença comercial', true, true], ['Suporte humano', true, false]] as const).map(([label, ours, others]) => (
            <div key={label} className="grid grid-cols-[1.4fr_1fr_1fr] items-center border-b border-black/5 p-4 text-sm last:border-0 sm:p-5">
              <span className="font-semibold">{label}</span>
              <span>{ours ? <Check className="text-[#36A5B4]" size={19} aria-label="Sim" /> : <X className="text-[#CBD5E0]" size={19} aria-label="Não" />}</span>
              <span>{others ? <Check className="text-[#CBD5E0]" size={19} aria-label="Sim" /> : <X className="text-[#CBD5E0]" size={19} aria-label="Não" />}</span>
            </div>
          ))}
        </div>
      </section>

      <section id="contact" className="mx-4 mb-8 rounded-[2rem] bg-[#1A202C] px-6 py-12 text-white sm:mx-6 sm:px-10 sm:py-14 lg:mx-auto lg:max-w-7xl lg:px-16">
        <div className="flex flex-col justify-between gap-10 md:flex-row md:items-end">
          <div>
            <p className="text-xs font-extrabold uppercase tracking-[0.2em] text-[#9AE6B4]">Stay in the loop</p>
            <h2 className="mt-3 max-w-lg font-display text-3xl font-bold tracking-[-0.04em] sm:text-4xl">Uma boa ideia merece chegar inteira.</h2>
          </div>
          {leadSent ? (
            <p role="status" className="max-w-sm text-sm leading-6 text-[#9AE6B4]">Recebemos seu contato. Em breve você recebe novidades e lançamentos.</p>
          ) : (
            <div className="w-full max-w-md">
              <form onSubmit={submitLead} className="relative flex w-full flex-col gap-2 rounded-3xl bg-white p-1.5 sm:flex-row sm:rounded-full">
                <Honeypot />
                <input required name="email" type="email" maxLength={254} autoComplete="email" placeholder="seu@email.com" aria-label="Seu e-mail" className="h-12 min-w-0 flex-1 bg-transparent px-4 text-sm text-[#1A202C] outline-none" />
                <button disabled={leadLoading} className="rounded-full bg-[#36B7C9] px-5 py-3 text-xs font-extrabold text-[#1A202C] transition hover:bg-[#9AE6B4] disabled:opacity-60">{leadLoading ? 'Enviando...' : 'Me avise'}</button>
              </form>
              {leadError && <p role="alert" className="mt-2 text-xs font-bold text-red-300">{leadError}</p>}
              <p className="mt-2 text-[11px] text-[#A0AEC0]">Ao enviar, você concorda com a <Link href="/politica-de-privacidade" className="underline">política de privacidade</Link>.</p>
            </div>
          )}
        </div>
      </section>

      <SiteFooter />

      <Modal open={demoOpen} onClose={closeDemo} label="Demonstração do estúdio" maxWidth="max-w-2xl">
        <div className="mt-6 aspect-video rounded-2xl bg-[#EDF2F7] p-4 sm:p-8">
          <div className="flex h-full flex-col justify-between rounded-xl border border-black/5 bg-white p-4 sm:p-6">
            <div className="flex justify-between text-xs font-bold text-[#A0AEC0]"><span>STUDIO PREVIEW</span><span className="text-[#36B7C9]">LIVE DEMO</span></div>
            <div><div className="h-4 w-2/3 rounded-full bg-[#1A202C]" /><div className="mt-3 h-3 w-1/2 rounded-full bg-[#CBD5E0]" /></div>
            <div className="flex justify-end"><span className="rounded-full bg-[#1A202C] px-4 py-2 text-xs font-bold text-white">Ready to ship</span></div>
          </div>
        </div>
      </Modal>
    </main>
  );
}
