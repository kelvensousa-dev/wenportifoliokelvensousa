'use client';

import { ArrowRight, Check, Menu, Play, Plus, ShoppingBag, Sparkles, X } from 'lucide-react';
import Link from 'next/link';
import { FormEvent, useState } from 'react';
import LanguageSelector from '@/components/LanguageSelector';
import { products, type ProductCategory } from '@/lib/products';

const categories: Array<'All' | ProductCategory> = ['All', 'Apps', 'Web', 'Landing Pages', 'Bots WhatsApp'];

export default function HomePage() {
  const [activeCategory, setActiveCategory] = useState<(typeof categories)[number]>('All');
  const [cartCount, setCartCount] = useState(0);
  const [demoOpen, setDemoOpen] = useState(false);
  const [leadSent, setLeadSent] = useState(false);

  const visibleProducts = activeCategory === 'All' ? products : products.filter((product) => product.category === activeCategory);

  function submitLead(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setLeadSent(true);
  }

  return (
    <main className="overflow-hidden">
      <nav className="mx-auto flex max-w-7xl items-center justify-between px-6 py-6 lg:px-8">
        <a href="#top" className="flex items-center gap-3 font-display text-lg font-bold tracking-tight">
          <span className="flex h-9 w-9 items-center justify-center rounded-xl bg-[#1A202C] text-sm text-white">K.</span>
          KELVEN<span className="font-normal text-[#A0AEC0]">/STUDIO</span>
        </a>
        <div className="hidden items-center gap-8 text-sm font-semibold text-[#4A5568] md:flex">
          <a href="#products" className="transition hover:text-[#1A202C]">Produtos</a>
          <a href="#difference" className="transition hover:text-[#1A202C]">Por que nós</a>
          <a href="#contact" className="transition hover:text-[#1A202C]">Contato</a>
        </div>
        <div className="flex items-center gap-2">
          <LanguageSelector />
          <button aria-label="Abrir carrinho" className="relative rounded-full border border-black/10 p-2.5 transition hover:bg-white"><ShoppingBag size={18} /><span className="absolute -right-1 -top-1 flex h-4 min-w-4 items-center justify-center rounded-full bg-[#36B7C9] px-1 text-[10px] font-bold text-white">{cartCount}</span></button>
          <Link href="/login" className="hidden rounded-full bg-[#1A202C] px-4 py-2.5 text-xs font-bold text-white transition hover:bg-[#2D3748] md:block">Entrar</Link>
          <button aria-label="Abrir menu" className="rounded-full p-2 md:hidden"><Menu size={20} /></button>
        </div>
      </nav>

      <section id="top" className="relative mx-auto grid max-w-7xl grid-cols-1 gap-14 px-6 pb-24 pt-16 lg:grid-cols-[1.02fr_.98fr] lg:items-center lg:px-8 lg:pt-24">
        <div className="relative z-10">
          <div className="mb-7 flex items-center gap-2 text-xs font-extrabold uppercase tracking-[0.2em] text-[#36A5B4]"><Sparkles size={15} /> Digital, but deliberate.</div>
          <h1 className="max-w-3xl font-display text-5xl font-bold leading-[0.98] tracking-[-0.05em] md:text-7xl">Produtos digitais que fazem o trabalho <span className="text-[#36B7C9]">avançar.</span></h1>
          <p className="mt-7 max-w-xl text-lg leading-8 text-[#718096]">Sistemas, automações e interfaces criados para equipes que preferem clareza ao ruído. Compre, personalize e coloque no ar.</p>
          <div className="mt-9 flex flex-wrap gap-3"><a href="#products" className="inline-flex items-center gap-3 rounded-full bg-[#1A202C] px-6 py-3.5 text-sm font-bold text-white transition hover:-translate-y-0.5">Explorar produtos <ArrowRight size={17} /></a><button onClick={() => setDemoOpen(true)} className="inline-flex items-center gap-3 rounded-full border border-black/10 bg-white/60 px-6 py-3.5 text-sm font-bold transition hover:bg-white"><Play size={16} fill="currentColor" /> Ver o estúdio</button></div>
          <div className="mt-12 flex items-center gap-5 text-xs font-semibold text-[#718096]"><div className="flex -space-x-2"><span className="h-8 w-8 rounded-full border-2 border-[#F8F9FA] bg-[#F6AD55]" /><span className="h-8 w-8 rounded-full border-2 border-[#F8F9FA] bg-[#90CDF4]" /><span className="h-8 w-8 rounded-full border-2 border-[#F8F9FA] bg-[#9AE6B4]" /></div><span>Construído para 2.000+ makers e equipes.</span></div>
        </div>
        <div className="relative min-h-[390px] lg:min-h-[540px]">
          <div className="grid-paper absolute inset-8 rounded-[2rem] border border-white bg-white/40 shadow-glass" />
          <div className="animate-drift absolute left-0 top-10 w-[77%] rounded-3xl border border-white/90 bg-white/80 p-5 shadow-glass backdrop-blur-xl"><div className="mb-8 flex items-center justify-between text-xs font-bold text-[#A0AEC0]"><span>WEEKLY SIGNAL</span><span className="text-[#36B7C9]">+24.8%</span></div><div className="flex h-32 items-end gap-2">{[35, 48, 42, 67, 58, 78, 72, 96, 87, 112].map((height, index) => <span key={index} className="flex-1 rounded-t-md bg-[#1A202C]" style={{ height }} />)}</div><div className="mt-5 flex items-center justify-between"><span className="font-display text-2xl font-bold">$84,290</span><span className="text-xs text-[#A0AEC0]">revenue this month</span></div></div>
          <div className="absolute bottom-7 right-0 w-[68%] rounded-3xl border border-white/80 bg-[#1A202C] p-6 text-white shadow-glass"><div className="flex items-start justify-between"><span className="text-xs font-bold uppercase tracking-widest text-[#A0AEC0]">Flow bot</span><span className="rounded-full bg-[#2D3748] px-2 py-1 text-[10px] text-[#9AE6B4]">online</span></div><p className="mt-12 max-w-[220px] font-display text-2xl font-bold leading-tight">Every reply, right on time.</p><div className="mt-5 flex items-center gap-2 text-xs text-[#CBD5E0]"><span className="h-2 w-2 rounded-full bg-[#9AE6B4]" /> 14 conversations automated</div></div>
        </div>
      </section>

      <section id="products" className="border-y border-black/5 bg-white/60 px-6 py-24 lg:px-8"><div className="mx-auto max-w-7xl"><div className="flex flex-col justify-between gap-8 md:flex-row md:items-end"><div><p className="text-xs font-extrabold uppercase tracking-[0.2em] text-[#36A5B4]">The catalogue</p><h2 className="mt-3 font-display text-4xl font-bold tracking-[-0.04em] md:text-5xl">Escolha seu próximo <span className="text-[#A0AEC0]">salto.</span></h2></div><div className="flex flex-wrap gap-2">{categories.map((category) => <button key={category} onClick={() => setActiveCategory(category)} className={`rounded-full px-4 py-2 text-xs font-bold transition ${activeCategory === category ? 'bg-[#1A202C] text-white' : 'border border-black/10 bg-white text-[#718096] hover:text-[#1A202C]'}`}>{category}</button>)}</div></div><div className="mt-12 grid gap-5 md:grid-cols-2">{visibleProducts.map((product) => <article key={product.id} className={`group relative overflow-hidden rounded-3xl border border-black/5 bg-gradient-to-br ${product.accent} p-7 transition duration-300 hover:-translate-y-1 hover:shadow-glass`}><div className="flex items-start justify-between"><div className="flex gap-2">{product.tags.map((tag) => <span key={tag} className="rounded-full border border-black/10 bg-white/50 px-3 py-1 text-[10px] font-bold uppercase tracking-wider text-[#4A5568]">{tag}</span>)}</div><button aria-label={`Adicionar ${product.name} ao carrinho`} onClick={() => setCartCount((count) => count + 1)} className="rounded-full bg-white/70 p-2 transition group-hover:bg-[#1A202C] group-hover:text-white"><Plus size={17} /></button></div><div className="mt-20 max-w-md"><p className="text-xs font-bold uppercase tracking-[0.18em] text-[#718096]">{product.category}</p><h3 className="mt-2 font-display text-3xl font-bold tracking-[-0.04em]">{product.name}</h3><p className="mt-3 text-sm leading-6 text-[#718096]">{product.description}</p></div><div className="mt-7 flex items-center justify-between border-t border-black/10 pt-5"><span className="font-display text-xl font-bold">{product.price}</span><button onClick={() => setDemoOpen(true)} className="text-xs font-extrabold underline decoration-[#36B7C9] decoration-2 underline-offset-4">Demo ao vivo</button></div></article>)}</div></div></section>

      <section id="difference" className="mx-auto grid max-w-7xl gap-12 px-6 py-24 lg:grid-cols-[.7fr_1.3fr] lg:px-8"><div><p className="text-xs font-extrabold uppercase tracking-[0.2em] text-[#36A5B4]">The difference</p><h2 className="mt-3 max-w-md font-display text-4xl font-bold tracking-[-0.04em] md:text-5xl">Menos promessa. Mais produto.</h2><p className="mt-5 max-w-md leading-7 text-[#718096]">Cada template nasce de um problema real, com documentação honesta e espaço para a sua própria assinatura.</p></div><div className="overflow-hidden rounded-3xl border border-black/10 bg-white"><div className="grid grid-cols-[1fr_1fr_1fr] border-b border-black/10 p-5 text-xs font-extrabold uppercase tracking-widest text-[#A0AEC0]"><span>O que importa</span><span className="text-[#1A202C]">Kelven Studio</span><span>Outros</span></div>{[['Código legível', true, false], ['Updates incluídos', true, false], ['Licença comercial', true, true], ['Suporte humano', true, false]].map(([label, ours, others]) => <div key={String(label)} className="grid grid-cols-[1fr_1fr_1fr] items-center border-b border-black/5 p-5 text-sm last:border-0"><span className="font-semibold">{label}</span><span>{ours ? <Check className="text-[#36A5B4]" size={19} /> : <X className="text-[#CBD5E0]" size={19} />}</span><span>{others ? <Check className="text-[#CBD5E0]" size={19} /> : <X className="text-[#CBD5E0]" size={19} />}</span></div>)}</div></section>

      <section id="contact" className="mx-6 mb-8 rounded-[2rem] bg-[#1A202C] px-7 py-14 text-white lg:mx-auto lg:max-w-7xl lg:px-16"><div className="flex flex-col justify-between gap-10 md:flex-row md:items-end"><div><p className="text-xs font-extrabold uppercase tracking-[0.2em] text-[#9AE6B4]">Stay in the loop</p><h2 className="mt-3 max-w-lg font-display text-4xl font-bold tracking-[-0.04em]">Uma boa ideia merece chegar inteira.</h2></div>{leadSent ? <p className="max-w-sm text-sm leading-6 text-[#9AE6B4]">Recebemos seu contato. Em breve você recebe novidades e lançamentos.</p> : <form onSubmit={submitLead} className="flex w-full max-w-md gap-2 rounded-full bg-white p-1.5"><input required type="email" placeholder="seu@email.com" aria-label="Seu e-mail" className="min-w-0 flex-1 bg-transparent px-4 text-sm text-[#1A202C] outline-none" /><button className="rounded-full bg-[#36B7C9] px-5 py-3 text-xs font-extrabold text-[#1A202C] transition hover:bg-[#9AE6B4]">Me avise</button></form>}</div></section>

      <footer className="mx-auto flex max-w-7xl flex-col gap-6 px-6 pb-10 pt-4 text-xs text-[#A0AEC0] md:flex-row md:items-center md:justify-between lg:px-8"><span className="font-display font-bold text-[#1A202C]">KELVEN/STUDIO</span><span>SSL 256-bit · PCI-DSS · LGPD</span><span>© 2026 Kelven Studio. Feito com intenção.</span></footer>

      {demoOpen && <div role="dialog" aria-modal="true" className="fixed inset-0 z-50 flex items-center justify-center bg-[#1A202C]/60 px-6 backdrop-blur-sm"><div className="relative w-full max-w-2xl rounded-3xl bg-white p-5 shadow-2xl"><button aria-label="Fechar demonstração" onClick={() => setDemoOpen(false)} className="absolute right-5 top-5 rounded-full bg-white p-2 shadow"><X size={18} /></button><div className="aspect-video rounded-2xl bg-[#EDF2F7] p-8"><div className="flex h-full flex-col justify-between rounded-xl border border-black/5 bg-white p-6"><div className="flex justify-between text-xs font-bold text-[#A0AEC0]"><span>STUDIO PREVIEW</span><span className="text-[#36B7C9]">LIVE DEMO</span></div><div><div className="h-4 w-2/3 rounded-full bg-[#1A202C]" /><div className="mt-3 h-3 w-1/2 rounded-full bg-[#CBD5E0]" /></div><div className="flex justify-end"><span className="rounded-full bg-[#1A202C] px-4 py-2 text-xs font-bold text-white">Ready to ship</span></div></div></div></div></div>}
    </main>
  );
}
