import { PrismaClient, ProductCategory } from '@prisma/client';
import * as bcrypt from 'bcryptjs';
import { catalog } from '../src/lib/products';

const prisma = new PrismaClient();

/**
 * Sincroniza o banco com o catalogo unico (src/lib/products.ts).
 *
 * Correcoes:
 * - `update: {}` impedia que mudancas de preco/nome chegassem ao banco.
 *   Agora o seed atualiza os dados a cada execucao.
 * - Produtos que sairam do catalogo sao desativados (nao apagados, para
 *   preservar o historico de pedidos).
 */
async function main() {
  console.log('Sincronizando catalogo...');

  for (const item of catalog) {
    const data = {
      name: item.name,
      category: item.dbCategory as ProductCategory,
      tagline: item.tagline,
      description: item.summary,
      priceCents: item.priceCents,
      currency: item.currency,
      priceBrlCents: item.priceBrlCents ?? null,
      featured: Boolean(item.bestSeller),
      active: true
    };
    const product = await prisma.product.upsert({
      where: { slug: item.slug },
      update: data,
      create: { id: item.slug, slug: item.slug, ...data }
    });
    console.log(`  ok: ${product.name} (${product.priceCents / 100} ${product.currency})`);
  }

  const { count } = await prisma.product.updateMany({
    where: { slug: { notIn: catalog.map((item) => item.slug) }, active: true },
    data: { active: false }
  });
  if (count) console.log(`  ${count} produto(s) fora do catalogo foram desativados.`);

  // Admin: credenciais apenas via ambiente, nunca fixas no codigo.
  const adminEmail = process.env.SEED_ADMIN_EMAIL?.trim().toLowerCase();
  const adminPassword = process.env.SEED_ADMIN_PASSWORD;

  if (!adminEmail || !adminPassword) {
    console.log('SEED_ADMIN_EMAIL / SEED_ADMIN_PASSWORD ausentes: nenhum admin criado.');
  } else if (adminPassword.length < 12) {
    throw new Error('SEED_ADMIN_PASSWORD precisa ter ao menos 12 caracteres.');
  } else {
    const hash = await bcrypt.hash(adminPassword, 12);
    const admin = await prisma.user.upsert({
      where: { email: adminEmail },
      update: { passwordHash: hash, isAdmin: true },
      create: { email: adminEmail, name: 'Administrador', passwordHash: hash, isAdmin: true }
    });
    console.log(`Admin pronto: ${admin.email}`);
  }

  console.log('Seed concluido.');
}

main()
  .then(async () => {
    await prisma.$disconnect();
  })
  .catch(async (error) => {
    console.error(error);
    await prisma.$disconnect();
    process.exit(1);
  });
