import type { Metadata } from 'next';
import { ArrowLeft, ArrowRight, Check, Flame, ShieldCheck, Sparkles } from 'lucide-react';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import PublicShell from '@/components/PublicShell';
import { catalog, findProduct, formatPrice } from '@/lib/products';

type SolutionPageProps = { params: { id: string } };

export function generateStaticParams() {
  return catalog.map((product) => ({ id: product.slug }));
}

export function generateMetadata({ params }: SolutionPageProps): Metadata {
  const product = findProduct(params.id);
  if (!product) return { title: 'Solução não encontrada' };
  return { title: product.name, description: product.summary };
}

export default function SolutionPage({ params }: SolutionPageProps) {
  const product = findProduct(params.id);
  if (!product) notFound();

  // Antes: "Comprar solucao" ia para /checkout sem informar o produto, e o
  // checkout sempre mostrava "Orbit CRM Pro".
  const checkoutHref = `/checkout?produto=${encodeURIComponent(product.slug)}`;
  const price = formatPrice(product.priceCents, product.currency);

  return (
    <PublicShell>
      <div className="mx-auto max-w-7xl px-4 py-10 sm:px-6 lg:px-8 lg:py-20">
        <Link href="/dashboard" className="inline-flex items-center gap-2 text-xs font-bold text-[#718096] hover:text-[#1A202C]"><ArrowLeft size={15} /> Voltar ao portfólio</Link>
        <section className="mt-8 grid gap-10 lg:grid-cols-[1.1fr_.9fr] lg:items-center">
          <div>
            <div className="flex flex-wrap items-center gap-2 text-xs font-extrabold uppercase tracking-[0.18em] text-[#36A5B4]"><Sparkles size={15} /> {product.segment}{product.hot && <span className="inline-flex items-center gap-1 rounded-full bg-[#FFF5F5] px-3 py-1 text-[#C53030]"><Flame size={12} /> Em alta</span>}</div>
            <h1 className="mt-5 max-w-3xl break-words font-display text-4xl font-bold leading-[.98] tracking-[-.05em] sm:text-5xl md:text-7xl">{product.name}<span className="text-[#36B7C9]">.</span></h1>
            <p className="mt-7 max-w-2xl text-base leading-7 text-[#718096] sm:text-lg sm:leading-8">{product.summary} Uma solução pensada para sair do briefing e chegar ao resultado sem camadas desnecessárias.</p>
            <div className="mt-8 flex flex-col gap-3 sm:flex-row sm:flex-wrap">
              <Link href={checkoutHref} className="inline-flex items-center justify-center gap-2 rounded-full bg-[#1A202C] px-6 py-3.5 text-sm font-bold text-white transition hover:bg-[#2D3748]">Comprar solução <ArrowRight size={17} /></Link>
              <Link href="/contato" className="inline-flex items-center justify-center gap-2 rounded-full border border-black/10 bg-white px-6 py-3.5 text-sm font-bold hover:bg-[#F8F9FA]">Falar com especialista</Link>
            </div>
          </div>
          <div className={`rounded-[2rem] bg-gradient-to-br ${product.accent} p-5 shadow-glass sm:p-7`}>
            <div className="rounded-2xl border border-white/80 bg-white/70 p-5 backdrop-blur sm:p-6">
              <div className="flex items-center justify-between text-xs font-bold text-[#A0AEC0]"><span>PRODUCT SIGNAL</span><span className="text-[#36B7C9]">READY TO SHIP</span></div>
              <div className="mt-12 h-3 w-2/3 rounded-full bg-[#1A202C] sm:mt-16" />
              <div className="mt-3 h-3 w-1/2 rounded-full bg-[#CBD5E0]" />
              <div className="mt-10 grid grid-cols-2 gap-3">
                <div className="rounded-xl bg-white p-4"><p className="font-display text-xl font-bold sm:text-2xl">{product.metric}</p><p className="mt-1 text-xs text-[#718096]">{product.metricLabel}</p></div>
                <div className="rounded-xl bg-[#1A202C] p-4 text-white"><p className="font-display text-xl font-bold sm:text-2xl" data-no-translate>{price}</p><p className="mt-1 text-xs text-[#CBD5E0]">licença inicial</p></div>
              </div>
            </div>
          </div>
        </section>
        <section className="mt-16 grid gap-5 border-t border-black/10 pt-12 md:grid-cols-3 lg:mt-20">
          <div><h2 className="font-display text-2xl font-bold">O que você recebe</h2><p className="mt-3 text-sm leading-6 text-[#718096]">Uma base pronta para personalizar, lançar e evoluir com seu negócio.</p></div>
          <div className="grid gap-3 sm:grid-cols-2 md:col-span-2">
            {['Código organizado e documentado', 'Updates e melhorias contínuas', 'Licença comercial para sua operação', 'Suporte humano na implementação'].map((item) => <div key={item} className="flex items-center gap-3 rounded-xl border border-black/5 bg-white p-4 text-sm font-semibold"><Check size={17} className="shrink-0 text-[#36B7C9]" /> {item}</div>)}
          </div>
        </section>
        <section className="mt-12 flex flex-col justify-between gap-5 rounded-3xl bg-[#1A202C] p-6 text-white sm:p-7 md:flex-row md:items-center md:p-10">
          <div className="flex items-start gap-4"><ShieldCheck className="mt-1 shrink-0 text-[#9AE6B4]" size={22} /><div><h2 className="font-display text-2xl font-bold">Pronto para colocar no ar?</h2><p className="mt-2 text-sm text-[#CBD5E0]">Checkout seguro e entrega digital após a confirmação do pagamento.</p></div></div>
          <Link href={checkoutHref} className="inline-flex items-center justify-center gap-2 rounded-full bg-[#9AE6B4] px-5 py-3 text-sm font-bold text-[#1A202C]">Começar agora <ArrowRight size={16} /></Link>
        </section>
      </div>
    </PublicShell>
  );
}
