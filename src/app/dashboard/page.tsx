'use client';

import { ArrowRight, ArrowUpRight, BarChart3, Check, Flame, LogIn, LogOut, Package, Search, ShieldCheck, ShoppingBag, Sparkles, Star, X } from 'lucide-react';
import Link from 'next/link';
import { useSearchParams } from 'next/navigation';
import { FormEvent, Suspense, useCallback, useMemo, useState } from 'react';
import { signOut, useSession } from 'next-auth/react';
import Honeypot from '@/components/Honeypot';
import LanguageSelector from '@/components/LanguageSelector';
import MobileMenu from '@/components/MobileMenu';
import Modal from '@/components/Modal';
import { catalog, formatPrice, segments, type CatalogProduct, type PortfolioSegment } from '@/lib/products';
import { sendLead } from '@/lib/leads-client';

const filters: Array<'Todos' | PortfolioSegment> = ['Todos', ...segments];

const quickStats = [
  { label: 'Produtos no portfólio', value: String(catalog.length), icon: Package },
  { label: 'Projetos entregues', value: '180+', icon: BarChart3 },
  { label: 'Satisfação média', value: '98%', icon: Star }
];

/**
 * Portfolio publico. Antes esta pagina exigia login (o middleware protegia
 * /dashboard), entao o link "Portfolio" do site levava visitantes ao login.
 * Tambem removido o "carrinho" que so incrementava um numero e nao levava a
 * lugar nenhum: cada produto agora tem compra direta.
 */
function DashboardContent() {
  const { status } = useSession();
  const searchParams = useSearchParams();
  const loggedIn = status === 'authenticated';
  const [activeSegment, setActiveSegment] = useState<(typeof filters)[number]>('Todos');
  const [search, setSearch] = useState('');
  const [quoteOpen, setQuoteOpen] = useState(false);
  const [quoteSent, setQuoteSent] = useState(false);
  const [quoteError, setQuoteError] = useState('');
  const [quoteLoading, setQuoteLoading] = useState(false);
  const [successVisible, setSuccessVisible] = useState(searchParams.get('success') === 'true');
  const closeQuote = useCallback(() => setQuoteOpen(false), []);

  const filteredProducts = useMemo(() => {
    const normalizedSearch = search.toLowerCase().trim();
    return catalog.filter((product) => {
      const matchesSegment = activeSegment === 'Todos' || product.segment === activeSegment;
      const matchesSearch = !normalizedSearch || `${product.name} ${product.segment} ${product.summary}`.toLowerCase().includes(normalizedSearch);
      return matchesSegment && matchesSearch;
    });
  }, [activeSegment, search]);

  async function submitQuote(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setQuoteError('');
    setQuoteLoading(true);
    const error = await sendLead(event.currentTarget, 'orcamento');
    setQuoteLoading(false);
    if (error) setQuoteError(error);
    else setQuoteSent(true);
  }

  const menuLinks = [
    { href: '/', label: 'Início' },
    { href: '#portfolio', label: 'Portfólio' },
    { href: '#mais-vendidos', label: 'Mais vendidos' },
    { href: '#processo', label: 'Como funciona' },
    { href: '/contato', label: 'Contato' },
    loggedIn ? { href: '/dashboard/notificacoes', label: 'Minhas compras' } : { href: '/login?callbackUrl=%2Fdashboard', label: 'Entrar' }
  ];

  return (
    <main className="min-h-screen bg-[#F8F9FA] text-[#1A202C]">
      <nav aria-label="Principal" className="sticky top-0 z-30 border-b border-black/5 bg-[#F8F9FA]/90 px-4 py-4 backdrop-blur-xl sm:px-6 lg:px-10">
        <div className="mx-auto flex max-w-[1440px] items-center justify-between gap-4">
          <Link href="/" className="flex shrink-0 items-center gap-3 font-display text-base font-bold tracking-tight sm:text-lg">
            <span className="flex h-9 w-9 items-center justify-center rounded-xl bg-[#1A202C] text-sm text-white">K.</span>
            <span className="hidden min-[380px]:inline">KELVEN<span className="font-normal text-[#A0AEC0]">/STUDIO</span></span>
          </Link>
          <div className="hidden items-center gap-7 text-sm font-semibold text-[#718096] lg:flex">
            <a href="#portfolio" className="text-[#1A202C]">Portfólio</a>
            <a href="#mais-vendidos" className="transition hover:text-[#1A202C]">Mais vendidos</a>
            <a href="#processo" className="transition hover:text-[#1A202C]">Como funciona</a>
          </div>
          <div className="flex items-center gap-2">
            <LanguageSelector />
            {loggedIn ? (
              <>
                <Link href="/dashboard/notificacoes" aria-label="Minhas compras" className="hidden rounded-full border border-black/10 bg-white p-2.5 sm:block"><ShoppingBag size={17} /></Link>
                <button type="button" onClick={() => signOut({ callbackUrl: '/' })} className="hidden items-center gap-2 rounded-full border border-black/10 px-3 py-2.5 text-xs font-bold text-[#718096] transition hover:bg-white hover:text-[#1A202C] sm:inline-flex"><LogOut size={15} /> Sair</button>
              </>
            ) : (
              <Link href="/login?callbackUrl=%2Fdashboard" className="hidden items-center gap-2 rounded-full bg-[#1A202C] px-4 py-2.5 text-xs font-bold text-white sm:inline-flex"><LogIn size={15} /> Entrar</Link>
            )}
            <MobileMenu links={menuLinks} breakpoint="lg" />
          </div>
        </div>
      </nav>

      <div className="mx-auto max-w-[1440px] px-4 pb-20 sm:px-6 lg:px-10">
        {successVisible && (
          <div role="status" className="mt-6 flex items-start justify-between gap-4 rounded-2xl border border-[#9AE6B4] bg-[#F0FFF4] p-5 text-sm text-[#276749]">
            <div className="flex gap-3">
              <Check size={18} className="mt-0.5 shrink-0" />
              <p><strong>Pagamento recebido.</strong> Assim que o provedor confirmar, sua licença aparece em <Link href="/dashboard/notificacoes" className="font-bold underline">Minhas compras</Link>.</p>
            </div>
            <button type="button" aria-label="Fechar aviso" onClick={() => setSuccessVisible(false)}><X size={16} /></button>
          </div>
        )}

        <section className="relative mt-6 overflow-hidden rounded-[2rem] bg-[#1A202C] px-6 py-10 text-white shadow-glass sm:mt-8 sm:px-10 md:px-12 md:py-16">
          <div aria-hidden="true" className="absolute inset-0 opacity-30 [background-image:linear-gradient(rgba(255,255,255,.07)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,.07)_1px,transparent_1px)] [background-size:44px_44px]" />
          <div aria-hidden="true" className="absolute -right-24 -top-32 h-96 w-96 rounded-full border border-[#36B7C9]/30" />
          <div className="relative z-10 max-w-3xl">
            <div className="mb-6 flex items-center gap-2 text-xs font-extrabold uppercase tracking-[0.2em] text-[#9AE6B4]"><Sparkles size={15} /> Seu portfólio, em movimento</div>
            <h1 className="break-words font-display text-3xl font-bold leading-[1.02] tracking-[-.05em] sm:text-4xl md:text-6xl">Encontre o sistema que faz seu próximo salto acontecer.</h1>
            <p className="mt-6 max-w-2xl text-base leading-7 text-[#CBD5E0]">Soluções digitais prontas para vender mais, operar melhor e criar experiências que o cliente lembra.</p>
            <div className="mt-8 flex flex-col gap-3 sm:flex-row">
              <a href="#portfolio" className="inline-flex items-center justify-center gap-2 rounded-full bg-[#9AE6B4] px-5 py-3 text-sm font-bold text-[#1A202C] transition hover:bg-white">Explorar soluções <ArrowRight size={17} /></a>
              <button type="button" onClick={() => setQuoteOpen(true)} className="inline-flex items-center justify-center gap-2 rounded-full border border-white/20 bg-white/10 px-5 py-3 text-sm font-bold text-white backdrop-blur transition hover:bg-white hover:text-[#1A202C]">Peça seu orçamento <ArrowUpRight size={17} /></button>
            </div>
          </div>
        </section>

        <section className="grid gap-4 py-8 sm:grid-cols-3">
          {quickStats.map(({ label, value, icon: Icon }) => (
            <article key={label} className="flex items-center justify-between rounded-2xl border border-black/5 bg-white p-5 shadow-sm">
              <div><p className="text-xs font-bold uppercase tracking-wider text-[#A0AEC0]">{label}</p><p className="mt-2 font-display text-3xl font-bold">{value}</p></div>
              <span className="flex h-11 w-11 items-center justify-center rounded-xl bg-[#EFFFFF] text-[#1597A8]"><Icon size={19} /></span>
            </article>
          ))}
        </section>

        <section id="mais-vendidos" className="scroll-mt-24 py-8">
          <div className="flex flex-col justify-between gap-4 md:flex-row md:items-end">
            <div><p className="text-xs font-extrabold uppercase tracking-[0.2em] text-[#36A5B4]">O que está em alta</p><h2 className="mt-2 font-display text-2xl font-bold tracking-[-.04em] sm:text-3xl">Mais vendidos & mais quentes</h2></div>
          </div>
          <div className="mt-6 grid gap-5 md:grid-cols-2 xl:grid-cols-3">
            {catalog.filter((product) => product.bestSeller || product.hot).slice(0, 3).map((product) => <ProductCard key={product.slug} product={product} />)}
          </div>
        </section>

        <section id="portfolio" className="scroll-mt-24 py-12">
          <div className="flex flex-col justify-between gap-6 lg:flex-row lg:items-end">
            <div><p className="text-xs font-extrabold uppercase tracking-[0.2em] text-[#36A5B4]">O catálogo completo</p><h2 className="mt-2 font-display text-2xl font-bold tracking-[-.04em] sm:text-3xl md:text-4xl">Escolha por objetivo.</h2></div>
            <label className="relative block w-full lg:w-72">
              <span className="sr-only">Buscar solução</span>
              <Search size={16} className="absolute left-4 top-1/2 -translate-y-1/2 text-[#A0AEC0]" />
              <input value={search} onChange={(event) => setSearch(event.target.value)} maxLength={80} type="search" placeholder="Buscar solução..." className="h-11 w-full rounded-full border border-black/10 bg-white pl-11 pr-4 text-sm outline-none transition focus:border-[#36B7C9] focus:ring-4 focus:ring-[#36B7C9]/10" />
            </label>
          </div>
          <div className="-mx-4 mt-7 flex gap-2 overflow-x-auto px-4 pb-2 sm:mx-0 sm:px-0">
            {filters.map((segment) => <button key={segment} type="button" aria-pressed={activeSegment === segment} onClick={() => setActiveSegment(segment)} className={`shrink-0 rounded-full px-4 py-2.5 text-xs font-bold transition ${activeSegment === segment ? 'bg-[#1A202C] text-white' : 'border border-black/10 bg-white text-[#718096] hover:text-[#1A202C]'}`}>{segment}</button>)}
          </div>
          <div className="mt-7 grid gap-5 md:grid-cols-2 xl:grid-cols-3">
            {filteredProducts.map((product) => <ProductCard key={product.slug} product={product} />)}
            {filteredProducts.length === 0 && <div className="col-span-full rounded-2xl border border-dashed border-black/15 p-12 text-center text-sm text-[#718096]">Nenhuma solução encontrada. Tente outra busca ou categoria.</div>}
          </div>
        </section>

        <section id="processo" className="grid scroll-mt-24 gap-5 py-12 lg:grid-cols-[1.1fr_.9fr]">
          <div className="rounded-[2rem] bg-white p-6 shadow-sm sm:p-8 md:p-10">
            <p className="text-xs font-extrabold uppercase tracking-[0.2em] text-[#36A5B4]">Do briefing ao resultado</p>
            <h2 className="mt-3 max-w-xl font-display text-2xl font-bold tracking-[-.04em] sm:text-3xl">Uma compra simples. Uma entrega que parece feita para você.</h2>
            <div className="mt-10 grid gap-6 sm:grid-cols-3">
              {[['01', 'Escolha', 'Encontre uma base pronta para o seu momento.'], ['02', 'Personalize', 'Ajustamos identidade, dados e operação.'], ['03', 'Escale', 'Você recebe suporte, updates e clareza.']].map(([number, title, description]) => (
                <div key={number}><span className="font-display text-sm font-bold text-[#36B7C9]">{number}</span><h3 className="mt-4 font-bold">{title}</h3><p className="mt-2 text-sm leading-6 text-[#718096]">{description}</p></div>
              ))}
            </div>
          </div>
          <div className="rounded-[2rem] bg-[#EFFFFF] p-6 sm:p-8 md:p-10">
            <span className="flex h-11 w-11 items-center justify-center rounded-xl bg-white text-[#1597A8] shadow-sm"><ShieldCheck size={20} /></span>
            <h2 className="mt-8 font-display text-2xl font-bold">Precisa de algo único?</h2>
            <p className="mt-3 text-sm leading-6 text-[#4A5568]">Conte o que sua operação precisa e receba uma proposta com escopo, prazo e investimento.</p>
            <button type="button" onClick={() => setQuoteOpen(true)} className="mt-7 inline-flex items-center gap-2 rounded-full bg-[#1A202C] px-5 py-3 text-xs font-bold text-white transition hover:bg-[#2D3748]">Falar com um especialista <ArrowRight size={16} /></button>
          </div>
        </section>
      </div>

      <footer className="border-t border-black/5 px-4 py-8 sm:px-6 lg:px-10">
        <div className="mx-auto flex max-w-[1440px] flex-col justify-between gap-4 text-xs text-[#A0AEC0] md:flex-row">
          <span className="font-display font-bold text-[#1A202C]">KELVEN/STUDIO</span>
          <div className="flex flex-wrap gap-4"><Link href="/contato">Contato</Link><Link href="/termos-de-uso">Termos</Link><Link href="/politica-de-privacidade">Privacidade</Link></div>
          <span>© {new Date().getFullYear()} Kelven Studio</span>
        </div>
      </footer>

      <Modal open={quoteOpen} onClose={closeQuote} label="Pedir orçamento">
        {quoteSent ? (
          <div className="py-10 text-center">
            <span className="mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-[#E6FFFA] text-[#277C73]"><Check size={24} /></span>
            <h2 className="mt-5 font-display text-2xl font-bold">Pedido recebido.</h2>
            <p className="mt-3 text-sm leading-6 text-[#718096]">Nosso time vai analisar seu contexto e retornar com os próximos passos.</p>
            <button type="button" onClick={closeQuote} className="mt-7 rounded-full bg-[#1A202C] px-5 py-3 text-xs font-bold text-white">Fechar</button>
          </div>
        ) : (
          <>
            <p className="text-xs font-extrabold uppercase tracking-[0.2em] text-[#36A5B4]">Projeto sob medida</p>
            <h2 className="mt-3 font-display text-2xl font-bold tracking-[-.04em] sm:text-3xl">Peça seu orçamento.</h2>
            <p className="mt-3 text-sm leading-6 text-[#718096]">Diga onde você quer chegar. A primeira conversa é por nossa conta.</p>
            <form onSubmit={submitQuote} className="relative mt-7 space-y-4">
              <Honeypot />
              <input required name="name" maxLength={120} autoComplete="name" placeholder="Seu nome" aria-label="Seu nome" className="h-12 w-full rounded-xl border border-black/10 px-4 text-sm outline-none focus:border-[#36B7C9]" />
              <input required name="email" type="email" maxLength={254} autoComplete="email" placeholder="Seu melhor e-mail" aria-label="Seu e-mail" className="h-12 w-full rounded-xl border border-black/10 px-4 text-sm outline-none focus:border-[#36B7C9]" />
              <select required name="subject" defaultValue="" aria-label="O que você precisa?" className="h-12 w-full rounded-xl border border-black/10 bg-white px-4 text-sm text-[#718096] outline-none focus:border-[#36B7C9]">
                <option value="" disabled>O que você precisa?</option>
                {segments.map((segment) => <option key={segment}>{segment}</option>)}
              </select>
              <textarea required name="message" maxLength={4000} placeholder="Conte brevemente sobre seu projeto" aria-label="Sobre o projeto" className="min-h-28 w-full resize-y rounded-xl border border-black/10 p-4 text-sm outline-none focus:border-[#36B7C9]" />
              {quoteError && <p role="alert" className="text-xs font-bold text-red-500">{quoteError}</p>}
              <button disabled={quoteLoading} className="flex h-12 w-full items-center justify-center gap-2 rounded-xl bg-[#1A202C] text-sm font-bold text-white disabled:opacity-60">{quoteLoading ? 'Enviando...' : 'Enviar briefing'} <ArrowRight size={17} /></button>
            </form>
          </>
        )}
      </Modal>
    </main>
  );
}

function ProductCard({ product }: { product: CatalogProduct }) {
  return (
    <article className={`group relative flex flex-col overflow-hidden rounded-3xl border border-black/5 bg-gradient-to-br ${product.accent} p-6 shadow-sm transition duration-300 hover:-translate-y-1 hover:shadow-glass`}>
      <div className="flex flex-wrap gap-2">
        {product.bestSeller && <span className="rounded-full bg-[#1A202C] px-3 py-1 text-[10px] font-bold uppercase tracking-wider text-white">Mais vendido</span>}
        {product.hot && <span className="inline-flex items-center gap-1 rounded-full bg-[#FFF5F5] px-3 py-1 text-[10px] font-bold uppercase tracking-wider text-[#C53030]"><Flame size={11} /> Em alta</span>}
      </div>
      <div className="mt-12 flex-1">
        <p className="text-[10px] font-extrabold uppercase tracking-[0.18em] text-[#718096]">{product.segment}</p>
        <h3 className="mt-2 font-display text-2xl font-bold tracking-[-.04em]">{product.name}</h3>
        <p className="mt-3 text-sm leading-6 text-[#718096]">{product.summary}</p>
      </div>
      <div className="mt-7 flex flex-wrap items-end justify-between gap-3 border-t border-black/10 pt-5">
        <div>
          <p className="font-display text-lg font-bold" data-no-translate>{formatPrice(product.priceCents, product.currency)}</p>
          <p className="mt-1 text-[10px] font-bold text-[#718096]">{product.metric} <span className="font-normal">{product.metricLabel}</span></p>
        </div>
        <Link href={`/solucoes/${product.slug}`} className="inline-flex min-h-10 items-center gap-1 text-xs font-extrabold underline decoration-[#36B7C9] decoration-2 underline-offset-4">Ver solução <ArrowUpRight size={14} /></Link>
      </div>
    </article>
  );
}

export default function DashboardPage() {
  // useSearchParams exige um limite de Suspense no App Router.
  return (
    <Suspense fallback={<main className="flex min-h-screen items-center justify-center bg-[#F8F9FA] text-sm font-semibold text-[#718096]">Carregando...</main>}>
      <DashboardContent />
    </Suspense>
  );
}
