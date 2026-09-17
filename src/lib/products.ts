export type ProductCategory = 'Apps' | 'Web' | 'Landing Pages' | 'Bots WhatsApp';

export type Product = {
  id: string;
  name: string;
  category: ProductCategory;
  description: string;
  price: string;
  accent: string;
  tags: string[];
};

export const products: Product[] = [
  { id: 'orbit-crm', name: 'Orbit CRM', category: 'Apps', description: 'Operação comercial clara para times que precisam crescer sem perder contexto.', price: 'US$ 129', accent: 'from-cyan-100 to-white', tags: ['SaaS', 'Analytics'] },
  { id: 'atlas-store', name: 'Atlas Storefront', category: 'Web', description: 'Uma base veloz e elegante para transformar tráfego em vendas recorrentes.', price: 'US$ 249', accent: 'from-amber-100 to-white', tags: ['Next.js', 'Commerce'] },
  { id: 'signal-launch', name: 'Signal Launch', category: 'Landing Pages', description: 'Landing page de alta conversão com narrativa modular e CMS pronto.', price: 'US$ 89', accent: 'from-rose-100 to-white', tags: ['Conversion', 'CMS'] },
  { id: 'flow-bot', name: 'Flow Bot', category: 'Bots WhatsApp', description: 'Automação conversacional para captar, qualificar e encaminhar oportunidades.', price: 'US$ 179', accent: 'from-emerald-100 to-white', tags: ['WhatsApp', 'Automation'] }
];

export type PortfolioSegment = 'Vendas' | 'Marketing' | 'Sistemas ERP' | 'Apps' | 'WhatsApp' | 'Landing Pages';

export type PortfolioProduct = {
  id: string;
  name: string;
  segment: PortfolioSegment;
  summary: string;
  price: string;
  metric: string;
  metricLabel: string;
  accent: string;
  tags: string[];
  bestSeller?: boolean;
  hot?: boolean;
};

export const portfolioProducts: PortfolioProduct[] = [
  { id: 'orbit-crm-pro', name: 'Orbit CRM Pro', segment: 'Vendas', summary: 'Pipeline inteligente, forecast e uma visão limpa de cada oportunidade.', price: 'A partir de US$ 129', metric: '+38%', metricLabel: 'conversão média', accent: 'from-cyan-100 via-white to-white', tags: ['CRM', 'Analytics'], bestSeller: true, hot: true },
  { id: 'atlas-erp', name: 'Atlas ERP Cloud', segment: 'Sistemas ERP', summary: 'Financeiro, estoque e operação conectados em um único centro de controle.', price: 'A partir de US$ 299', metric: '1 painel', metricLabel: 'para toda operação', accent: 'from-slate-200 via-white to-white', tags: ['ERP', 'Cloud'], bestSeller: true },
  { id: 'signal-engine', name: 'Signal Engine', segment: 'Marketing', summary: 'Automação de campanhas e atribuição para transformar atenção em receita.', price: 'A partir de US$ 149', metric: '4.8x', metricLabel: 'retorno médio', accent: 'from-amber-100 via-white to-white', tags: ['Growth', 'Data'], hot: true },
  { id: 'flow-bot', name: 'Flow Bot', segment: 'WhatsApp', summary: 'Atendimento e vendas automatizados no WhatsApp, com handoff humano.', price: 'A partir de US$ 179', metric: '24/7', metricLabel: 'atendimento ativo', accent: 'from-emerald-100 via-white to-white', tags: ['WhatsApp', 'Automation'], bestSeller: true, hot: true },
  { id: 'orbit-mobile', name: 'Orbit Mobile', segment: 'Apps', summary: 'Aplicativo mobile white-label para colocar sua experiência no bolso.', price: 'A partir de US$ 249', metric: '4.9/5', metricLabel: 'avaliação média', accent: 'from-violet-100 via-white to-white', tags: ['iOS', 'Android'] },
  { id: 'signal-launch-pro', name: 'Signal Launch Pro', segment: 'Landing Pages', summary: 'Landing pages modulares para lançar ofertas com velocidade e precisão.', price: 'A partir de US$ 89', metric: '+62%', metricLabel: 'mais leads', accent: 'from-rose-100 via-white to-white', tags: ['Conversion', 'CMS'], hot: true }
];
