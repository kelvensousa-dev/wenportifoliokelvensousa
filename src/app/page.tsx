import type { Viewport } from 'next';
import HomeView from '@/components/views/HomeView';
import { getActiveCatalog } from '@/lib/catalog-server';

// Le no banco quais produtos estao ativos a cada visita (retirar um produto no admin reflete na hora).
export const dynamic = 'force-dynamic';

// A home usa o tema escuro: a barra do navegador no celular acompanha o fundo.
export const viewport: Viewport = { themeColor: '#0E0C0A' };

export default async function HomePage() {
  return <HomeView products={await getActiveCatalog()} />;
}
