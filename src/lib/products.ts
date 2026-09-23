/**
 * Catalogo unico da plataforma.
 *
 * Antes existiam duas listas diferentes (`products` na home e
 * `portfolioProducts` no portfolio) com IDs que nao batiam com o banco.
 * Resultado: o botao "Comprar" da home enviava IDs que so existiam no seed,
 * e as paginas /solucoes/[id] apontavam para produtos que nao existiam no
 * banco — o checkout nunca funcionava a partir delas.
 *
 * Agora esta e a UNICA fonte. O `prisma/seed.ts` importa esta lista, entao o
 * `slug` daqui e exatamente o `slug` gravado no banco. O preco cobrado vem
 * SEMPRE do banco (nunca do navegador).
 *
 * ATENCAO: os precos abaixo (US$ e R$) sao SIMULACOES para testes. Defina os
 * precos reais antes de operar em producao.
 */

export type PortfolioSegment = 'Vendas' | 'Marketing' | 'Sistemas ERP' | 'Apps' | 'WhatsApp' | 'Landing Pages';

/** Espelha o enum `ProductCategory` do Prisma. */
export type DbCategory = 'APP' | 'WEB' | 'LANDING_PAGE' | 'WHATSAPP_BOT';

export type CatalogProduct = {
  /** Identificador publico usado na URL e no banco (Product.slug). */
  slug: string;
  name: string;
  segment: PortfolioSegment;
  dbCategory: DbCategory;
  tagline: string;
  summary: string;
  /** Preco em dolar (centavos), cobrado pelo Stripe. */
  priceCents: number;
  currency: 'USD';
  /**
   * Preco em reais (centavos), cobrado pelo Asaas (Pix, boleto, cartao BR).
   * Omitido = produto ainda nao vendido em reais. Minimo aceito: 500 (R$ 5,00).
   */
  priceBrlCents?: number;
  metric: string;
  metricLabel: string;
  accent: string;
  tags: string[];
  bestSeller?: boolean;
  hot?: boolean;
};

export const catalog: CatalogProduct[] = [
  { slug: 'orbit-crm-pro', name: 'Orbit CRM Pro', segment: 'Vendas', dbCategory: 'WEB', tagline: 'Pipeline inteligente e forecast', summary: 'Pipeline inteligente, forecast e uma visão limpa de cada oportunidade.', priceCents: 12900, currency: 'USD', priceBrlCents: 64900, metric: '+38%', metricLabel: 'conversão média', accent: 'from-cyan-100 via-white to-white', tags: ['CRM', 'Analytics'], bestSeller: true, hot: true },
  { slug: 'atlas-erp', name: 'Atlas ERP Cloud', segment: 'Sistemas ERP', dbCategory: 'WEB', tagline: 'Operação conectada em um só lugar', summary: 'Financeiro, estoque e operação conectados em um único centro de controle.', priceCents: 29900, currency: 'USD', priceBrlCents: 149900, metric: '1 painel', metricLabel: 'para toda operação', accent: 'from-slate-200 via-white to-white', tags: ['ERP', 'Cloud'], bestSeller: true },
  { slug: 'signal-engine', name: 'Signal Engine', segment: 'Marketing', dbCategory: 'WEB', tagline: 'Automação de campanhas e atribuição', summary: 'Automação de campanhas e atribuição para transformar atenção em receita.', priceCents: 14900, currency: 'USD', priceBrlCents: 74900, metric: '4.8x', metricLabel: 'retorno médio', accent: 'from-amber-100 via-white to-white', tags: ['Growth', 'Data'], hot: true },
  { slug: 'flow-bot', name: 'Flow Bot', segment: 'WhatsApp', dbCategory: 'WHATSAPP_BOT', tagline: 'Atendimento automatizado no WhatsApp', summary: 'Atendimento e vendas automatizados no WhatsApp, com handoff humano.', priceCents: 17900, currency: 'USD', priceBrlCents: 89900, metric: '24/7', metricLabel: 'atendimento ativo', accent: 'from-emerald-100 via-white to-white', tags: ['WhatsApp', 'Automation'], bestSeller: true, hot: true },
  { slug: 'orbit-mobile', name: 'Orbit Mobile', segment: 'Apps', dbCategory: 'APP', tagline: 'App white-label para iOS e Android', summary: 'Aplicativo mobile white-label para colocar sua experiência no bolso.', priceCents: 24900, currency: 'USD', priceBrlCents: 124900, metric: '4.9/5', metricLabel: 'avaliação média', accent: 'from-violet-100 via-white to-white', tags: ['iOS', 'Android'] },
  { slug: 'signal-launch-pro', name: 'Signal Launch Pro', segment: 'Landing Pages', dbCategory: 'LANDING_PAGE', tagline: 'Landing pages modulares', summary: 'Landing pages modulares para lançar ofertas com velocidade e precisão.', priceCents: 8900, currency: 'USD', priceBrlCents: 44900, metric: '+62%', metricLabel: 'mais leads', accent: 'from-rose-100 via-white to-white', tags: ['Conversion', 'CMS'], hot: true }
];

export const segments: PortfolioSegment[] = ['Vendas', 'Marketing', 'Sistemas ERP', 'Apps', 'WhatsApp', 'Landing Pages'];

export function findProduct(slug: string | null | undefined): CatalogProduct | undefined {
  if (!slug) return undefined;
  return catalog.find((item) => item.slug === slug);
}

/** Formata centavos com o locale informado. Ex.: 12900 -> "US$ 129,00". */
export function formatPrice(cents: number, currency = 'USD', locale = 'pt-BR'): string {
  return (cents / 100).toLocaleString(locale, { style: 'currency', currency, minimumFractionDigits: 0, maximumFractionDigits: 2 });
}
