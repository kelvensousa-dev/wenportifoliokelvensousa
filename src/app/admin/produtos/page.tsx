import AdminShell from '@/components/AdminShell';
import { prisma } from '@/lib/prisma';
import { requireAdmin } from '@/lib/require-admin';
import { formatPrice } from '@/lib/products';
import { ProductStatusToggle } from '@/components/ProductStatusToggle';

export const dynamic = 'force-dynamic';

/**
 * Produtos do banco. Aqui o admin retira um produto do site ou o coloca de
 * volta a venda. Nome, textos e precos continuam em src/lib/products.ts
 * (aplicados pelo seed a cada deploy); o status ativo/retirado e so daqui.
 */
export default async function ProductsAdminPage() {
  await requireAdmin();

  const products = await prisma.product.findMany({
    orderBy: { name: 'asc' },
    include: { _count: { select: { orderItems: true } } }
  });

  return (
    <AdminShell>
      <div className="mx-auto max-w-7xl">
        <p className="text-xs font-extrabold uppercase tracking-[0.2em] text-[#36A5B4]">Catálogo</p>
        <h1 className="mt-2 font-display text-3xl font-bold tracking-[-.05em] sm:text-4xl">Produtos.</h1>
        <p className="mt-3 text-sm text-[#718096]">Produtos retirados somem do site e não podem ser comprados; pedidos e licenças antigas continuam válidos. Para alterar preço ou nome, edite <code className="rounded bg-white px-1.5 py-0.5 text-xs">src/lib/products.ts</code> e faça o deploy.</p>
        <section className="mt-8 grid gap-3">
          {products.length === 0 && <p className="rounded-2xl border border-dashed border-black/15 bg-white p-8 text-center text-sm text-[#718096]">Nenhum produto no banco. Rode <code>npx prisma db seed</code>.</p>}
          {products.map((product) => (
            <article key={product.id} className="flex flex-col justify-between gap-4 rounded-2xl border border-black/5 bg-white p-5 shadow-sm sm:flex-row sm:items-center">
              <div className="min-w-0">
                <h2 className="font-bold">{product.name}</h2>
                <p className="mt-1 break-all text-xs text-[#718096]"><span className="font-mono">{product.slug}</span> · <span data-no-translate>{formatPrice(product.priceCents, product.currency)}{product.priceBrlCents ? ` · ${formatPrice(product.priceBrlCents, 'BRL')}` : ''}</span> · {product._count.orderItems} pedidos</p>
              </div>
              <div className="flex flex-wrap items-center gap-3 sm:justify-end">
                <span className={`w-fit rounded-full px-3 py-1 text-xs font-bold ${product.active ? 'bg-[#E6FFFA] text-[#277C73]' : 'bg-[#EDF2F7] text-[#718096]'}`}>{product.active ? 'À venda' : 'Retirado'}</span>
                <ProductStatusToggle productId={product.id} productName={product.name} active={product.active} />
              </div>
            </article>
          ))}
        </section>
      </div>
    </AdminShell>
  );
}
