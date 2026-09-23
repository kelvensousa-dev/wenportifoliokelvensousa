import DashboardView from '@/components/views/DashboardView';
import { getActiveCatalog } from '@/lib/catalog-server';

export const dynamic = 'force-dynamic';

export default async function DashboardPage() {
  return <DashboardView products={await getActiveCatalog()} />;
}
