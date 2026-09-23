import { prisma } from '@/lib/prisma';
import { catalog, type CatalogProduct } from '@/lib/products';

/**
 * Catalogo VISIVEL no site: os produtos de src/lib/products.ts que estao
 * ATIVOS no banco. Ativar/desativar e feito pelo admin (/admin/produtos).
 *
 * Se o banco falhar, nao mostra nada: melhor uma vitrine vazia por alguns
 * segundos do que exibir um produto que foi retirado de venda.
 */
export async function getActiveCatalog(): Promise<CatalogProduct[]> {
  try {
    const active = await prisma.product.findMany({ where: { active: true }, select: { slug: true } });
    const slugs = new Set(active.map((product) => product.slug));
    return catalog.filter((product) => slugs.has(product.slug));
  } catch (error) {
    console.error('[CATALOG] Falha ao ler produtos ativos', error instanceof Error ? error.message : error);
    return [];
  }
}

export async function getActiveProduct(slug: string): Promise<CatalogProduct | undefined> {
  const products = await getActiveCatalog();
  return products.find((product) => product.slug === slug);
}
