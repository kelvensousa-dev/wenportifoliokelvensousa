import CheckoutView from '@/components/views/CheckoutView';
import { getActiveCatalog } from '@/lib/catalog-server';

export const dynamic = 'force-dynamic';

export default async function CheckoutPage() {
  return <CheckoutView products={await getActiveCatalog()} />;
}
