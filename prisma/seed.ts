import { PrismaClient } from "@prisma/client";
import * as bcrypt from "bcryptjs";

const prisma = new PrismaClient();

async function main() {
  console.log("Start seeding products...");

  // Products from lib/products.ts
  const productsToSeed = [
    {
      id: "orbit-crm",
      slug: "orbit-crm",
      name: "Orbit CRM",
      category: "APP",
      tagline: "Operação comercial clara",
      description: "Operação comercial clara para times que precisam crescer sem perder contexto.",
      priceCents: 12900,
      currency: "BRL",
    },
    {
      id: "atlas-store",
      slug: "atlas-store",
      name: "Atlas Storefront",
      category: "WEB",
      tagline: "Transforme tráfego em vendas",
      description: "Uma base veloz e elegante para transformar tráfego em vendas recorrentes.",
      priceCents: 24900,
      currency: "BRL",
    },
    {
      id: "signal-launch",
      slug: "signal-launch",
      name: "Signal Launch",
      category: "LANDING_PAGE",
      tagline: "Landing page de alta conversão",
      description: "Landing page de alta conversão com narrativa modular e CMS pronto.",
      priceCents: 8900,
      currency: "BRL",
    },
    {
      id: "flow-bot",
      slug: "flow-bot",
      name: "Flow Bot",
      category: "WHATSAPP_BOT",
      tagline: "Automação conversacional",
      description: "Automação conversacional para captar, qualificar e encaminhar oportunidades.",
      priceCents: 17900,
      currency: "BRL",
    },
  ];

  for (const p of productsToSeed) {
    const product = await prisma.product.upsert({
      where: { slug: p.slug },
      update: {},
      create: {
        id: p.id,
        slug: p.slug,
        name: p.name,
        category: p.category as any,
        tagline: p.tagline,
        description: p.description,
        priceCents: p.priceCents,
        currency: p.currency,
      },
    });
    console.log(`Created product: ${product.name}`);
  }

  const hash = await bcrypt.hash('123456', 10);
  const admin = await prisma.user.upsert({
    where: { email: 'admin@empresa.com' },
    update: { passwordHash: hash },
    create: {
      email: 'admin@empresa.com',
      name: 'Administrador',
      passwordHash: hash,
      isAdmin: true,
    },
  });
  console.log(`Created admin user: ${admin.email}`);

  console.log("Seeding finished.");
}

main()
  .then(async () => {
    await prisma.$disconnect();
  })
  .catch(async (e) => {
    console.error(e);
    await prisma.$disconnect();
    process.exit(1);
  });
