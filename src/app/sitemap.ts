import type { MetadataRoute } from 'next';
import { catalog } from '@/lib/products';

export default function sitemap(): MetadataRoute.Sitemap {
  const base = (process.env.NEXT_PUBLIC_APP_URL ?? 'http://localhost:3000').replace(/\/+$/, '');
  const staticRoutes = ['', '/dashboard', '/contato', '/termos-de-uso', '/politica-de-privacidade'];
  return [
    ...staticRoutes.map((path) => ({ url: `${base}${path}`, changeFrequency: 'weekly' as const, priority: path === '' ? 1 : 0.7 })),
    ...catalog.map((product) => ({ url: `${base}/solucoes/${product.slug}`, changeFrequency: 'weekly' as const, priority: 0.8 }))
  ];
}
