'use client';

import { ArrowRight, Check, KeyRound, LayoutGrid, MessageCircle, MonitorSmartphone, Zap } from 'lucide-react';
import Link from 'next/link';
import { FormEvent, useState } from 'react';
import { useSession } from 'next-auth/react';
import Honeypot from '@/components/Honeypot';
import LanguageSelector from '@/components/LanguageSelector';
import MobileMenu from '@/components/MobileMenu';
import SiteFooter from '@/components/SiteFooter';
import StudioVideo from '@/components/StudioVideo';
import { formatPrice, segments, type CatalogProduct, type PortfolioSegment } from '@/lib/products';
import { sendLead } from '@/lib/leads-client';
import { whatsappUrl } from '@/lib/site';

const filters: Array<'Todos' | PortfolioSegment> = ['Todos', ...segments];

const offerings = [
  { icon: LayoutGrid, title: 'Sistemas ERP', text: 'Estoque, vendas e financeiro num só lugar, acessível do computador ou do celular.' },
  { icon: MonitorSmartphone, title: 'Landing pages', text: 'Páginas rápidas e responsivas, pensadas para transformar visita em cliente.' },
  { icon: Zap, title: 'Automações', text: 'Tarefas repetitivas rodando sozinhas, para você focar no que importa.' },
  { icon: KeyRound, title: 'Licenças', text: 'Acesso liberado no seu painel, com chave de ativação e atualizações.' }
];

const steps = [
  { number: '01', title: 'Escolha o produto', text: 'Veja o catálogo e abra os detalhes de cada solução antes de decidir.' },
  { number: '02', title: 'Pague como preferir', text: 'Pix, boleto ou cartão em reais. Clientes do exterior pagam no cartão internacional.' },
  { number: '03', title: 'Receba o acesso no painel', text: 'Assim que o pagamento é confirmado, a licença aparece na sua área de cliente.' }
];

const paymentMethods = ['Pix', 'Boleto', 'Cartão'];

/** Preco exibido no card: reais quando o produto e vendido em reais; senao, dolar. */
function displayPrice(product: CatalogProduct): string {
  return product.priceBrlCents ? formatPrice(product.priceBrlCents, 'BRL') : formatPrice(product.priceCents, product.currency);
}

function SectionLabel({ children }: { children: React.ReactNode }) {
  return <p className="font-mono text-xs uppercase tracking-[0.08em] text-studio-amber sm:text-[13px]">{children}</p>;
}

export default function HomeView({ products }: { products: CatalogProduct[] }) {
  const { status } = useSession();
  const loggedIn = status === 'authenticated';
  const [activeCategory, setActiveCategory] = useState<(typeof filters)[number]>('Todos');
  const [activeStep, setActiveStep] = useState(1);
  const [leadSent, setLeadSent] = useState(false);
  const [leadError, setLeadError] = useState('');
  const [leadLoading, setLeadLoading] = useState(false);

  const visibleProducts = activeCategory === 'Todos' ? products : products.filter((product) => product.segment === activeCategory);
  const accountHref = loggedIn ? '/dashboard/notificacoes' : '/login';
  const accountLabel = loggedIn ? 'Minhas compras' : 'Entrar';

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
    { href: '#como-funciona', label: 'Como funciona' },
    { href: '#sobre', label: 'Sobre' },
    { href: '/contato', label: 'Contato' },
    { href: accountHref, label: accountLabel }
  ];

  return (
    <main className="min-h-screen overflow-x-hidden bg-studio-bg text-studio-text">
      <header className="sticky top-0 z-40 border-b border-studio-line bg-studio-bg/85 backdrop-blur-xl">
        <nav aria-label="Principal" className="mx-auto flex max-w-7xl items-center justify-between gap-3 px-4 py-4 sm:px-6 lg:px-8">
          <a href="#top" className="flex shrink-0 items-center gap-3">
            <span className="flex h-9 w-9 items-center justify-center rounded-[10px] bg-studio-amber font-brand text-xl font-extrabold text-studio-ink">K</span>
            <span className="font-brand text-lg font-bold tracking-tight sm:text-xl">Kelven Studio</span>
          </a>
          <div className="hidden items-center gap-8 text-[15px] font-medium lg:flex">
            <a href="#products" className="transition hover:text-studio-amber">Produtos</a>
            <a href="#como-funciona" className="transition hover:text-studio-amber">Como funciona</a>
            <a href="#sobre" className="transition hover:text-studio-amber">Sobre</a>
            <Link href="/contato" className="transition hover:text-studio-amber">Contato</Link>
            <Link href={accountHref} className="transition hover:text-studio-amber">{accountLabel}</Link>
          </div>
          <div className="flex items-center gap-2">
            <LanguageSelector tone="dark" />
            <a href="#products" className="hidden rounded-full bg-studio-amber px-5 py-3 text-sm font-bold text-studio-ink transition hover:bg-studio-amber-hover lg:inline-flex">Ver catálogo</a>
            <MobileMenu links={menuLinks} breakpoint="lg" tone="dark" />
          </div>
        </nav>
      </header>

      {/* HERO */}
      <section id="top" className="relative mx-auto grid max-w-7xl grid-cols-1 items-center gap-6 px-4 pt-10 sm:px-6 sm:pt-14 lg:min-h-[calc(100vh-73px)] lg:grid-cols-[1fr_1.05fr] lg:gap-0 lg:px-8 lg:pt-0">
        <div className="relative z-10 flex flex-col gap-7 lg:py-16">
          <div className="flex items-center gap-2.5 font-mono text-xs uppercase tracking-[0.08em] text-studio-amber sm:text-[13px]">
            <span aria-hidden="true" className="h-2 w-2 shrink-0 rounded-full bg-studio-amber" />
            <span>Produtos digitais, licenças e automações</span>
          </div>
          <h1 className="text-balance font-brand text-[2.75rem] font-extrabold leading-[0.98] tracking-[-0.035em] sm:text-6xl xl:text-[4.75rem]">
            Sistemas que trabalham <span className="text-studio-amber">enquanto você cresce.</span>
          </h1>
          <p className="max-w-[32rem] text-base leading-7 text-studio-soft sm:text-lg sm:leading-8">
            ERPs, landing pages e automações prontos para o seu negócio. Você escolhe, paga como preferir e recebe o acesso direto no seu painel.
          </p>
          <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
            <a href="#products" className="inline-flex items-center justify-center gap-2 rounded-full bg-studio-amber px-7 py-4 text-base font-bold text-studio-ink transition hover:bg-studio-amber-hover">
              Ver catálogo <ArrowRight size={18} aria-hidden="true" />
            </a>
            <a href={whatsappUrl} target="_blank" rel="noopener noreferrer" className="inline-flex items-center justify-center gap-2 rounded-full border border-studio-edge px-7 py-4 text-base font-semibold transition hover:border-studio-amber">
              Falar comigo
            </a>
          </div>
          <ul className="flex flex-col gap-3 text-sm text-studio-muted sm:flex-row sm:gap-7">
            <li className="flex items-center gap-2"><Check size={16} className="shrink-0 text-studio-amber" aria-hidden="true" /> Pix, boleto e cartão</li>
            <li className="flex items-center gap-2"><Check size={16} className="shrink-0 text-studio-amber" aria-hidden="true" /> Suporte direto com o desenvolvedor</li>
          </ul>
        </div>

        <div className="relative mx-auto w-full max-w-[34rem] self-end lg:max-w-none">
          <div aria-hidden="true" className="pointer-events-none absolute left-1/2 top-[8%] aspect-square w-[88%] -translate-x-1/2 rounded-full bg-[radial-gradient(circle_at_55%_55%,rgba(255,191,31,0.24),rgba(255,191,31,0)_62%)]" />
          <div aria-hidden="true" className="pointer-events-none absolute left-1/2 top-[14%] aspect-square w-[70%] -translate-x-1/2 rounded-full border border-studio-amber/25" />
          {/* eslint-disable-next-line @next/next/no-img-element -- o otimizador de imagens esta desligado (next.config) */}
          <img
            src="/brand/lobo-capa.webp"
            alt="Mascote do Kelven Studio: um lobo-guará de óculos escuros segurando um tablet"
            width={1364}
            height={1294}
            decoding="async"
            className="relative block h-auto w-full"
          />
        </div>
      </section>

      {/* O QUE EU CRIO */}
      <section className="border-t border-studio-line px-4 py-20 sm:px-6 lg:px-8 lg:py-28">
        <div className="mx-auto max-w-7xl">
          <div className="flex flex-col justify-between gap-6 lg:flex-row lg:items-end">
            <div className="flex flex-col gap-4">
              <SectionLabel>O que eu crio</SectionLabel>
              <h2 className="max-w-[40rem] font-brand text-4xl font-bold leading-[1.02] tracking-[-0.03em] sm:text-5xl lg:text-[3.5rem]">Ferramentas digitais feitas para rodar de verdade.</h2>
            </div>
            <p className="max-w-[25rem] text-base leading-7 text-studio-muted sm:text-[17px]">Cada produto nasce de um problema real de negócio e chega pronto para uso, com licença e atualizações.</p>
          </div>
          <div className="mt-12 grid gap-5 sm:grid-cols-2 xl:grid-cols-4">
            {offerings.map(({ icon: Icon, title, text }) => (
              <article key={title} className="flex flex-col gap-4 rounded-[20px] border border-studio-line bg-studio-surface p-7 sm:p-8">
                <Icon size={32} strokeWidth={1.6} className="text-studio-amber" aria-hidden="true" />
                <h3 className="font-brand text-2xl font-bold">{title}</h3>
                <p className="text-[15px] leading-relaxed text-studio-muted">{text}</p>
              </article>
            ))}
          </div>
        </div>
      </section>

      {/* COMO FUNCIONA */}
      <section id="como-funciona" className="scroll-mt-20 border-y border-studio-line bg-studio-deep px-4 py-20 sm:px-6 lg:px-8 lg:py-28">
        <div className="mx-auto grid max-w-7xl items-center gap-12 lg:grid-cols-[minmax(0,0.78fr)_minmax(0,1.22fr)] lg:gap-14">
          <div className="flex flex-col gap-9">
            <div className="flex flex-col gap-4">
              <SectionLabel>Como funciona</SectionLabel>
              <h2 className="font-brand text-4xl font-bold leading-[1.02] tracking-[-0.03em] sm:text-5xl">Do clique ao acesso em três passos.</h2>
            </div>
            <ol className="flex flex-col gap-3.5">
              {steps.map((step, index) => {
                const active = index === activeStep;
                return (
                  <li key={step.number}>
                    <button
                      type="button"
                      aria-expanded={active}
                      onClick={() => setActiveStep(index)}
                      className={`flex w-full items-start gap-5 rounded-2xl border px-6 py-5 text-left transition ${active ? 'border-studio-amber bg-studio-raised' : 'border-studio-line hover:border-studio-edge'}`}
                    >
                      <span className={`w-7 shrink-0 pt-0.5 font-mono text-sm ${active ? 'text-studio-amber' : 'text-studio-faint'}`}>{step.number}</span>
                      <span className="flex flex-col gap-1.5">
                        <span className={`text-lg font-bold ${active ? 'text-studio-text' : 'text-studio-soft'}`}>{step.title}</span>
                        {active && <span className="text-[15px] leading-relaxed text-studio-muted">{step.text}</span>}
                      </span>
                    </button>
                  </li>
                );
              })}
            </ol>
            <div className="flex flex-wrap items-center gap-2.5">
              <span className="mr-1.5 text-sm text-studio-muted">Formas de pagamento:</span>
              {paymentMethods.map((method) => (
                <span key={method} className="rounded-xl border border-studio-line bg-studio-surface px-4 py-2.5 text-sm font-semibold">{method}</span>
              ))}
            </div>
          </div>
          <div className="overflow-hidden rounded-[28px] border border-studio-line bg-[#0E1419]">
            <StudioVideo
              sources={[
                { src: '/brand/lobo-tablet.webm', type: 'video/webm' },
                { src: '/brand/lobo-tablet.mp4', type: 'video/mp4' }
              ]}
              poster="/brand/lobo-tablet-poster.webp"
              label="Vídeo do mascote do Kelven Studio escolhendo e comprando um produto no tablet"
              className="block aspect-video h-auto w-full object-cover"
            />
          </div>
        </div>
      </section>

      {/* CATALOGO */}
      <section id="products" className="scroll-mt-20 px-4 py-20 sm:px-6 lg:px-8 lg:py-28">
        <div className="mx-auto max-w-7xl">
          <div className="flex flex-col justify-between gap-8 lg:flex-row lg:items-end">
            <div className="flex flex-col gap-4">
              <SectionLabel>Catálogo</SectionLabel>
              <h2 className="font-brand text-4xl font-bold leading-[1.02] tracking-[-0.03em] sm:text-5xl lg:text-[3.5rem]">Escolha e comece hoje.</h2>
            </div>
            <div className="-mx-4 flex gap-2 overflow-x-auto px-4 pb-2 lg:mx-0 lg:flex-wrap lg:justify-end lg:overflow-visible lg:px-0 lg:pb-0">
              {filters.map((category) => (
                <button
                  key={category}
                  type="button"
                  aria-pressed={activeCategory === category}
                  onClick={() => setActiveCategory(category)}
                  className={`min-h-11 shrink-0 rounded-full px-4 text-xs font-bold transition ${activeCategory === category ? 'bg-studio-amber text-studio-ink' : 'border border-studio-edge text-studio-muted hover:text-studio-text'}`}
                >
                  {category}
                </button>
              ))}
            </div>
          </div>
          <div className="mt-12 grid gap-6 md:grid-cols-2 xl:grid-cols-3">
            {visibleProducts.length === 0 && (
              <div className="col-span-full rounded-3xl border border-dashed border-studio-edge bg-studio-surface p-12 text-center text-sm text-studio-muted">
                {products.length === 0 ? 'Novas soluções chegando em breve. Fale com a gente para um projeto sob medida.' : 'Nenhuma solução nesta categoria por enquanto.'}
              </div>
            )}
            {visibleProducts.map((product) => (
              <article key={product.slug} className="flex flex-col rounded-[22px] border border-studio-line bg-studio-surface p-7">
                <div className="flex flex-wrap gap-2">
                  {product.tags.map((tag) => (
                    <span key={tag} className="rounded-full border border-studio-edge px-3 py-1 text-[11px] font-semibold text-studio-muted">{tag}</span>
                  ))}
                </div>
                <div className="mt-10 flex flex-1 flex-col gap-3">
                  <p className="font-mono text-xs uppercase tracking-[0.06em] text-studio-amber">{product.segment}</p>
                  <h3 className="font-brand text-2xl font-bold">
                    <Link href={`/solucoes/${product.slug}`} className="hover:text-studio-amber">{product.name}</Link>
                  </h3>
                  <p className="text-[15px] leading-relaxed text-studio-muted">{product.summary}</p>
                </div>
                <div className="mt-7 flex flex-wrap items-center justify-between gap-3 border-t border-studio-line pt-5">
                  <span className="font-brand text-2xl font-bold" data-no-translate>{displayPrice(product)}</span>
                  <Link
                    href={`/checkout?produto=${encodeURIComponent(product.slug)}`}
                    className="inline-flex min-h-11 items-center gap-2 rounded-full bg-studio-amber px-5 text-sm font-bold text-studio-ink transition hover:bg-studio-amber-hover"
                  >
                    Comprar <ArrowRight size={15} aria-hidden="true" />
                  </Link>
                </div>
              </article>
            ))}
          </div>
        </div>
      </section>

      {/* SOBRE */}
      <section id="sobre" className="scroll-mt-20 px-4 pb-20 sm:px-6 lg:px-8 lg:pb-28">
        <div className="mx-auto grid max-w-7xl overflow-hidden rounded-[28px] border border-studio-line bg-studio-surface md:grid-cols-[minmax(0,0.8fr)_minmax(0,1.2fr)]">
          {/* eslint-disable-next-line @next/next/no-img-element -- o otimizador de imagens esta desligado (next.config) */}
          <img
            src="/brand/kelven-sousa.webp"
            alt="Kelven Sousa, criador do Kelven Studio"
            width={900}
            height={1144}
            loading="lazy"
            decoding="async"
            className="block aspect-[4/3] h-full w-full object-cover object-[center_30%] md:aspect-auto md:min-h-[32rem]"
          />
          <div className="flex flex-col justify-center gap-6 p-8 sm:p-12 lg:p-16">
            <SectionLabel>Quem está por trás</SectionLabel>
            <h2 className="font-brand text-4xl font-bold leading-[1.02] tracking-[-0.03em] sm:text-5xl">Oi, eu sou o Kelven.</h2>
            <p className="max-w-[38rem] text-base leading-7 text-studio-soft sm:text-lg sm:leading-8">
              Sou o desenvolvedor por trás do Kelven Studio. Crio os sistemas, automações e páginas do catálogo e atendo você diretamente, do primeiro contato ao suporte depois da compra.
            </p>
            <div className="flex flex-col gap-3 sm:flex-row">
              <a href={whatsappUrl} target="_blank" rel="noopener noreferrer" className="inline-flex items-center justify-center gap-2 rounded-full border border-studio-edge px-6 py-3.5 text-[15px] font-semibold transition hover:border-studio-amber">
                <MessageCircle size={17} aria-hidden="true" /> Falar no WhatsApp
              </a>
              <Link href="/contato" className="inline-flex items-center justify-center rounded-full border border-studio-edge px-6 py-3.5 text-[15px] font-semibold transition hover:border-studio-amber">
                Enviar mensagem
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* CTA + NEWSLETTER */}
      <section id="contact" className="px-4 pb-20 sm:px-6 lg:px-8 lg:pb-24">
        <div className="mx-auto flex max-w-7xl flex-col justify-between gap-10 rounded-[28px] bg-studio-amber px-7 py-12 text-studio-ink sm:px-12 lg:flex-row lg:items-end lg:px-16 lg:py-16">
          <div className="flex max-w-2xl flex-col gap-4">
            <h2 className="font-brand text-4xl font-extrabold leading-none tracking-[-0.035em] sm:text-5xl lg:text-[3.75rem]">Pronto para automatizar o seu negócio?</h2>
            <p className="text-base font-medium leading-7 text-studio-ink/80">Receba novidades e lançamentos do catálogo por e-mail.</p>
          </div>
          {leadSent ? (
            <p role="status" className="max-w-sm text-base font-bold leading-7">Recebemos seu contato. Em breve você recebe novidades e lançamentos.</p>
          ) : (
            <div className="w-full max-w-md">
              <form onSubmit={submitLead} className="relative flex w-full flex-col gap-2 rounded-3xl bg-studio-ink p-1.5 focus-within:ring-2 focus-within:ring-studio-ink focus-within:ring-offset-2 focus-within:ring-offset-studio-amber sm:flex-row sm:rounded-full">
                <Honeypot />
                <input
                  required
                  name="email"
                  type="email"
                  maxLength={254}
                  autoComplete="email"
                  placeholder="seu@email.com"
                  aria-label="Seu e-mail"
                  className="h-12 min-w-0 flex-1 bg-transparent px-4 text-sm text-studio-text placeholder:text-studio-muted focus-visible:outline-none"
                />
                <button disabled={leadLoading} className="rounded-full bg-studio-amber px-6 py-3 text-sm font-extrabold text-studio-ink transition hover:bg-studio-amber-hover disabled:opacity-60">
                  {leadLoading ? 'Enviando...' : 'Me avise'}
                </button>
              </form>
              {leadError && <p role="alert" className="mt-2 text-xs font-bold text-[#7A1F0B]">{leadError}</p>}
              <p className="mt-3 text-xs text-studio-ink/75">
                Ao enviar, você concorda com a <Link href="/politica-de-privacidade" className="font-semibold underline">política de privacidade</Link>.
              </p>
            </div>
          )}
        </div>
      </section>

      <SiteFooter tone="dark" />
    </main>
  );
}
