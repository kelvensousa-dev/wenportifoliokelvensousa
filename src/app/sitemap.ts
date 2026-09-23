import type { MetadataRoute } from 'next';
import { getActiveCatalog } from '@/lib/catalog-server';
import { legalLinks } from '@/lib/legal';

export const dynamic = 'force-dynamic';

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const base = (process.env.NEXT_PUBLIC_APP_URL ?? 'http://localhost:3000').replace(/\/+$/, '');
  const staticRoutes: string[] = ['', '/dashboard', '/contato', ...legalLinks.map((link) => link.href)];
  const products = await getActiveCatalog();
  return [
    ...staticRoutes.map((path) => ({ url: `${base}${path}`, changeFrequency: 'weekly' as const, priority: path === '' ? 1 : 0.7 })),
    ...products.map((product) => ({ url: `${base}/solucoes/${product.slug}`, changeFrequency: 'weekly' as const, priority: 0.8 }))
  ];
}
