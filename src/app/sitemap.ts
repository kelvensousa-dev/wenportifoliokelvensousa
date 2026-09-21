import type { MetadataRoute } from 'next';
import { legalLinks } from '@/lib/legal';
import { catalog } from '@/lib/products';

export default function sitemap(): MetadataRoute.Sitemap {
  const base = (process.env.NEXT_PUBLIC_APP_URL ?? 'http://localhost:3000').replace(/\/+$/, '');
  const staticRoutes: string[] = ['', '/dashboard', '/contato', ...legalLinks.map((link) => link.href)];
  return [
    ...staticRoutes.map((path) => ({ url: `${base}${path}`, changeFrequency: 'weekly' as const, priority: path === '' ? 1 : 0.7 })),
    ...catalog.map((product) => ({ url: `${base}/solucoes/${product.slug}`, changeFrequency: 'weekly' as const, priority: 0.8 }))
  ];
}
