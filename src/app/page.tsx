import HomeView from '@/components/views/HomeView';
import { getActiveCatalog } from '@/lib/catalog-server';

// Le no banco quais produtos estao ativos a cada visita (retirar um produto no admin reflete na hora).
export const dynamic = 'force-dynamic';

export default async function HomePage() {
  return <HomeView products={await getActiveCatalog()} />;
}
