'use client';

import { ArrowRight, ArrowUpRight, BarChart3, Bell, Check, Flame, LogOut, Menu, Package, Search, ShieldCheck, ShoppingBag, Sparkles, Star, X } from 'lucide-react';
import Link from 'next/link';
import { FormEvent, useMemo, useState } from 'react';
import { signOut, useSession } from 'next-auth/react';
import LanguageSelector from '@/components/LanguageSelector';
import { portfolioProducts, type PortfolioProduct, type PortfolioSegment } from '@/lib/products';

const segments: Array<'Todos' | PortfolioSegment> = ['Todos', 'Vendas', 'Marketing', 'Sistemas ERP', 'Apps', 'WhatsApp', 'Landing Pages'];

const quickStats = [
  { label: 'Produtos no portfólio', value: '24', icon: Package },
  { label: 'Projetos entregues', value: '180+', icon: BarChart3 },
  { label: 'Satisfação média', value: '98%', icon: Star }
];

export default function DashboardPage() {
  const { status } = useSession();
  const [activeSegment, setActiveSegment] = useState<(typeof segments)[number]>('Todos');
  const [search, setSearch] = useState('');
  const [quoteOpen, setQuoteOpen] = useState(false);
  const [quoteSent, setQuoteSent] = useState(false);
  const [cartCount, setCartCount] = useState(0);

  const filteredProducts = useMemo(() => {
    const normalizedSearch = search.toLowerCase().trim();
    return portfolioProducts.filter((product) => {
      const matchesSegment = activeSegment === 'Todos' || product.segment === activeSegment;
      const matchesSearch = !normalizedSearch || `${product.name} ${product.segment} ${product.summary}`.toLowerCase().includes(normalizedSearch);
      return matchesSegment && matchesSearch;
    });
  }, [activeSegment, search]);

  function handleSignOut() {
    signOut({ callbackUrl: '/login' });
  }

  function submitQuote(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setQuoteSent(true);
  }

  // O middleware (server-side) ja bloqueia /dashboard para quem nao tem sessao.
  // Este estado cobre apenas o intervalo de hidratacao da sessao no cliente.
  if (status === 'loading') {
    return <main className="flex min-h-screen items-center justify-center bg-[#F8F9FA] text-sm font-semibold text-[#718096]">Verificando acesso...</main>;
  }

  return (
    <main className="min-h-screen bg-[#F8F9FA] text-[#1A202C]">
      <nav className="sticky top-0 z-30 border-b border-black/5 bg-[#F8F9FA]/90 px-6 py-4 backdrop-blur-xl lg:px-10">
        <div className="mx-auto flex max-w-[1440px] items-center justify-between gap-6"><Link href="/dashboard" className="flex shrink-0 items-center gap-3 font-display text-lg font-bold tracking-tight"><span className="flex h-9 w-9 items-center justify-center rounded-xl bg-[#1A202C] text-sm text-white">K.</span> KELVEN<span className="font-normal text-[#A0AEC0]">/STUDIO</span></Link><div className="hidden items-center gap-7 text-sm font-semibold text-[#718096] xl:flex"><a href="#portfolio" className="text-[#1A202C]">Portfólio</a><a href="#mais-vendidos" className="transition hover:text-[#1A202C]">Mais vendidos</a><a href="#processo" className="transition hover:text-[#1A202C]">Como funciona</a></div><div className="flex items-center gap-2"><LanguageSelector /><button aria-label="Pesquisar produtos" className="hidden rounded-full border border-black/10 bg-white p-2.5 sm:block"><Search size={17} /></button><Link href="/checkout" aria-label="Abrir carrinho" className="relative rounded-full border border-black/10 bg-white p-2.5"><ShoppingBag size={17} />{cartCount > 0 && <span className="absolute -right-1 -top-1 flex h-4 min-w-4 items-center justify-center rounded-full bg-[#36B7C9] px-1 text-[10px] font-bold text-white">{cartCount}</span>}</Link><Link href="/dashboard/notificacoes" aria-label="Notificações" className="hidden rounded-full border border-black/10 bg-white p-2.5 sm:block"><Bell size={17} /></Link><button aria-label="Abrir menu" className="rounded-full border border-black/10 bg-white p-2.5 xl:hidden"><Menu size={17} /></button><button onClick={handleSignOut} className="inline-flex items-center gap-2 rounded-full border border-black/10 px-3 py-2.5 text-xs font-bold text-[#718096] transition hover:bg-white hover:text-[#1A202C]"><LogOut size={15} /><span className="hidden sm:inline">Sair</span></button></div></div>
      </nav>

      <div className="mx-auto max-w-[1440px] px-6 pb-20 lg:px-10">
        <section className="relative mt-8 overflow-hidden rounded-[2rem] bg-[#1A202C] px-7 py-12 text-white shadow-glass md:px-12 md:py-16"><div className="absolute inset-0 opacity-30 [background-image:linear-gradient(rgba(255,255,255,.07)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,.07)_1px,transparent_1px)] [background-size:44px_44px]" /><div className="absolute -right-24 -top-32 h-96 w-96 rounded-full border border-[#36B7C9]/30" /><div className="absolute -right-8 -top-16 h-64 w-64 rounded-full border border-[#9AE6B4]/20" /><div className="relative z-10 max-w-3xl"><div className="mb-6 flex items-center gap-2 text-xs font-extrabold uppercase tracking-[0.2em] text-[#9AE6B4]"><Sparkles size={15} /> Seu portfólio, em movimento</div><h1 className="font-display text-4xl font-bold leading-[.98] tracking-[-.05em] md:text-6xl">Encontre o sistema que faz seu próximo salto acontecer.</h1><p className="mt-6 max-w-2xl text-base leading-7 text-[#CBD5E0]">Soluções digitais prontas para vender mais, operar melhor e criar experiências que o cliente lembra.</p><div className="mt-8 flex flex-col gap-3 sm:flex-row"><button onClick={() => document.getElementById('portfolio')?.scrollIntoView({ behavior: 'smooth' })} className="inline-flex items-center justify-center gap-2 rounded-full bg-[#9AE6B4] px-5 py-3 text-sm font-bold text-[#1A202C] transition hover:bg-white">Explorar soluções <ArrowRight size={17} /></button><button onClick={() => setQuoteOpen(true)} className="inline-flex items-center justify-center gap-2 rounded-full border border-white/20 bg-white/10 px-5 py-3 text-sm font-bold text-white backdrop-blur transition hover:bg-white hover:text-[#1A202C]">Peça seu orçamento <ArrowUpRight size={17} /></button></div></div></section>

        <section className="grid gap-4 py-8 md:grid-cols-3">{quickStats.map(({ label, value, icon: Icon }) => <article key={label} className="flex items-center justify-between rounded-2xl border border-black/5 bg-white p-5 shadow-sm"><div><p className="text-xs font-bold uppercase tracking-wider text-[#A0AEC0]">{label}</p><p className="mt-2 font-display text-3xl font-bold">{value}</p></div><span className="flex h-11 w-11 items-center justify-center rounded-xl bg-[#EFFFFF] text-[#1597A8]"><Icon size={19} /></span></article>)}</section>

        <section id="mais-vendidos" className="py-8"><div className="flex flex-col justify-between gap-4 md:flex-row md:items-end"><div><p className="text-xs font-extrabold uppercase tracking-[0.2em] text-[#36A5B4]">O que está em alta</p><h2 className="mt-2 font-display text-3xl font-bold tracking-[-.04em]">Mais vendidos & mais quentes</h2></div><span className="inline-flex items-center gap-2 text-xs font-bold text-[#718096]"><Flame size={16} className="text-[#F56565]" /> Atualizado hoje</span></div><div className="mt-6 grid gap-5 md:grid-cols-3">{portfolioProducts.filter((product) => product.bestSeller || product.hot).slice(0, 3).map((product) => <ProductCard key={product.id} product={product} onAdd={() => setCartCount((count) => count + 1)} />)}</div></section>

        <section id="portfolio" className="scroll-mt-24 py-12"><div className="flex flex-col justify-between gap-6 lg:flex-row lg:items-end"><div><p className="text-xs font-extrabold uppercase tracking-[0.2em] text-[#36A5B4]">O catálogo completo</p><h2 className="mt-2 font-display text-3xl font-bold tracking-[-.04em] md:text-4xl">Escolha por objetivo.</h2></div><label className="relative block w-full lg:w-72"><Search size={16} className="absolute left-4 top-1/2 -translate-y-1/2 text-[#A0AEC0]" /><input value={search} onChange={(event) => setSearch(event.target.value)} placeholder="Buscar solução..." className="h-11 w-full rounded-full border border-black/10 bg-white pl-11 pr-4 text-sm outline-none transition focus:border-[#36B7C9] focus:ring-4 focus:ring-[#36B7C9]/10" /></label></div><div className="mt-7 flex gap-2 overflow-x-auto pb-2">{segments.map((segment) => <button key={segment} onClick={() => setActiveSegment(segment)} className={`shrink-0 rounded-full px-4 py-2.5 text-xs font-bold transition ${activeSegment === segment ? 'bg-[#1A202C] text-white' : 'border border-black/10 bg-white text-[#718096] hover:text-[#1A202C]'}`}>{segment}</button>)}</div><div className="mt-7 grid gap-5 md:grid-cols-2 xl:grid-cols-3">{filteredProducts.map((product) => <ProductCard key={product.id} product={product} onAdd={() => setCartCount((count) => count + 1)} />)}{filteredProducts.length === 0 && <div className="col-span-full rounded-2xl border border-dashed border-black/15 p-12 text-center text-sm text-[#718096]">Nenhuma solução encontrada. Tente outra busca ou categoria.</div>}</div></section>

        <section id="processo" className="grid gap-5 py-12 lg:grid-cols-[1.1fr_.9fr]"><div className="rounded-[2rem] bg-white p-8 shadow-sm md:p-10"><p className="text-xs font-extrabold uppercase tracking-[0.2em] text-[#36A5B4]">Do briefing ao resultado</p><h2 className="mt-3 max-w-xl font-display text-3xl font-bold tracking-[-.04em]">Uma compra simples. Uma entrega que parece feita para você.</h2><div className="mt-10 grid gap-6 sm:grid-cols-3">{[['01', 'Escolha', 'Encontre uma base pronta para o seu momento.'], ['02', 'Personalize', 'Ajustamos identidade, dados e operação.'], ['03', 'Escale', 'Você recebe suporte, updates e clareza.']].map(([number, title, description]) => <div key={number}><span className="font-display text-sm font-bold text-[#36B7C9]">{number}</span><h3 className="mt-4 font-bold">{title}</h3><p className="mt-2 text-sm leading-6 text-[#718096]">{description}</p></div>)}</div></div><div className="rounded-[2rem] bg-[#EFFFFF] p-8 md:p-10"><span className="flex h-11 w-11 items-center justify-center rounded-xl bg-white text-[#1597A8] shadow-sm"><ShieldCheck size={20} /></span><h2 className="mt-8 font-display text-2xl font-bold">Precisa de algo único?</h2><p className="mt-3 text-sm leading-6 text-[#4A5568]">Conte o que sua operação precisa e receba uma proposta com escopo, prazo e investimento.</p><button onClick={() => setQuoteOpen(true)} className="mt-7 inline-flex items-center gap-2 rounded-full bg-[#1A202C] px-5 py-3 text-xs font-bold text-white transition hover:bg-[#2D3748]">Falar com um especialista <ArrowRight size={16} /></button></div></section>
      </div>

      <footer className="border-t border-black/5 px-6 py-8 lg:px-10"><div className="mx-auto flex max-w-[1440px] flex-col justify-between gap-4 text-xs text-[#A0AEC0] md:flex-row"><span className="font-display font-bold text-[#1A202C]">KELVEN/STUDIO</span><div className="flex flex-wrap gap-4"><Link href="/contato">Contato</Link><Link href="/termos-de-uso">Termos</Link><Link href="/politica-de-privacidade">Privacidade</Link></div><span>© 2026 Kelven Studio</span></div></footer>

      {quoteOpen && <div role="dialog" aria-modal="true" className="fixed inset-0 z-50 flex items-center justify-center bg-[#1A202C]/60 px-6 backdrop-blur-sm"><div className="relative w-full max-w-lg rounded-3xl bg-white p-7 shadow-2xl md:p-9"><button aria-label="Fechar orçamento" onClick={() => setQuoteOpen(false)} className="absolute right-5 top-5 rounded-full p-2 text-[#718096] hover:bg-[#F8F9FA] hover:text-[#1A202C]"><X size={18} /></button>{quoteSent ? <div className="py-10 text-center"><span className="mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-[#E6FFFA] text-[#277C73]"><Check size={24} /></span><h2 className="mt-5 font-display text-2xl font-bold">Pedido recebido.</h2><p className="mt-3 text-sm leading-6 text-[#718096]">Nosso time vai analisar seu contexto e retornar com os próximos passos.</p><button onClick={() => setQuoteOpen(false)} className="mt-7 rounded-full bg-[#1A202C] px-5 py-3 text-xs font-bold text-white">Fechar</button></div> : <><p className="text-xs font-extrabold uppercase tracking-[0.2em] text-[#36A5B4]">Projeto sob medida</p><h2 className="mt-3 font-display text-3xl font-bold tracking-[-.04em]">Peça seu orçamento.</h2><p className="mt-3 text-sm leading-6 text-[#718096]">Diga onde você quer chegar. A primeira conversa é por nossa conta.</p><form onSubmit={submitQuote} className="mt-7 space-y-4"><input required placeholder="Seu nome" className="h-12 w-full rounded-xl border border-black/10 px-4 text-sm outline-none focus:border-[#36B7C9]" /><input required type="email" placeholder="Seu melhor e-mail" className="h-12 w-full rounded-xl border border-black/10 px-4 text-sm outline-none focus:border-[#36B7C9]" /><select required defaultValue="" className="h-12 w-full rounded-xl border border-black/10 bg-white px-4 text-sm text-[#718096] outline-none focus:border-[#36B7C9]"><option value="" disabled>O que você precisa?</option>{segments.slice(1).map((segment) => <option key={segment}>{segment}</option>)}</select><textarea required placeholder="Conte brevemente sobre seu projeto" className="min-h-28 w-full resize-none rounded-xl border border-black/10 p-4 text-sm outline-none focus:border-[#36B7C9]" /><button className="flex h-12 w-full items-center justify-center gap-2 rounded-xl bg-[#1A202C] text-sm font-bold text-white">Enviar briefing <ArrowRight size={17} /></button></form></>}</div></div>}
    </main>
  );
}

function ProductCard({ product, onAdd }: { product: PortfolioProduct; onAdd: () => void }) {
  return <article className={`group relative overflow-hidden rounded-3xl border border-black/5 bg-gradient-to-br ${product.accent} p-6 shadow-sm transition duration-300 hover:-translate-y-1 hover:shadow-glass`}><div className="flex items-start justify-between gap-4"><div className="flex flex-wrap gap-2">{product.bestSeller && <span className="rounded-full bg-[#1A202C] px-3 py-1 text-[10px] font-bold uppercase tracking-wider text-white">Mais vendido</span>}{product.hot && <span className="inline-flex items-center gap-1 rounded-full bg-[#FFF5F5] px-3 py-1 text-[10px] font-bold uppercase tracking-wider text-[#C53030]"><Flame size={11} /> Em alta</span>}</div><button aria-label={`Adicionar ${product.name} ao carrinho`} onClick={onAdd} className="rounded-full bg-white/80 p-2 transition group-hover:bg-[#1A202C] group-hover:text-white"><ShoppingBag size={16} /></button></div><div className="mt-14"><p className="text-[10px] font-extrabold uppercase tracking-[0.18em] text-[#718096]">{product.segment}</p><h3 className="mt-2 font-display text-2xl font-bold tracking-[-.04em]">{product.name}</h3><p className="mt-3 min-h-12 text-sm leading-6 text-[#718096]">{product.summary}</p></div><div className="mt-7 flex items-end justify-between border-t border-black/10 pt-5"><div><p className="font-display text-lg font-bold">{product.price}</p><p className="mt-1 text-[10px] font-bold text-[#718096]">{product.metric} <span className="font-normal">{product.metricLabel}</span></p></div><Link href={`/solucoes/${product.id}`} className="inline-flex items-center gap-1 text-xs font-extrabold underline decoration-[#36B7C9] decoration-2 underline-offset-4">Ver solução <ArrowUpRight size={14} /></Link></div></article>;
}
