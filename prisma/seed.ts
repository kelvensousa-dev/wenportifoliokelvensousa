import { PrismaClient, ProductCategory } from "@prisma/client";
import * as bcrypt from "bcryptjs";

const prisma = new PrismaClient();

async function main() {
  console.log("Start seeding products...");

  // Products from lib/products.ts
  const productsToSeed: Array<{
    id: string;
    slug: string;
    name: string;
    category: ProductCategory;
    tagline: string;
    description: string;
    priceCents: number;
    currency: string;
  }> = [
      {
        id: "orbit-crm",
        slug: "orbit-crm",
        name: "Orbit CRM",
        category: ProductCategory.APP,
        tagline: "Operação comercial clara",
        description: "Operação comercial clara para times que precisam crescer sem perder contexto.",
        priceCents: 12900,
        currency: "USD",
      },
      {
        id: "atlas-store",
        slug: "atlas-store",
        name: "Atlas Storefront",
        category: ProductCategory.WEB,
        tagline: "Transforme tráfego em vendas",
        description: "Uma base veloz e elegante para transformar tráfego em vendas recorrentes.",
        priceCents: 24900,
        currency: "USD",
      },
      {
        id: "signal-launch",
        slug: "signal-launch",
        name: "Signal Launch",
        category: ProductCategory.LANDING_PAGE,
        tagline: "Landing page de alta conversão",
        description: "Landing page de alta conversão com narrativa modular e CMS pronto.",
        priceCents: 8900,
        currency: "USD",
      },
      {
        id: "flow-bot",
        slug: "flow-bot",
        name: "Flow Bot",
        category: ProductCategory.WHATSAPP_BOT,
        tagline: "Automação conversacional",
        description: "Automação conversacional para captar, qualificar e encaminhar oportunidades.",
        priceCents: 17900,
        currency: "USD",
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
        category: p.category,
        tagline: p.tagline,
        description: p.description,
        priceCents: p.priceCents,
        currency: p.currency,
      },
    });
    console.log(`Created product: ${product.name}`);
  }

  // O seed anterior criava admin@empresa.com com a senha "123456" e essas
  // credenciais eram impressas na tela de login. Agora as duas informacoes
  // vem do ambiente e o seed falha em vez de criar uma porta fraca.
  const adminEmail = process.env.SEED_ADMIN_EMAIL;
  const adminPassword = process.env.SEED_ADMIN_PASSWORD;

  if (!adminEmail || !adminPassword) {
    console.log("SEED_ADMIN_EMAIL / SEED_ADMIN_PASSWORD ausentes: nenhum admin criado.");
  } else if (adminPassword.length < 12) {
    throw new Error("SEED_ADMIN_PASSWORD precisa ter ao menos 12 caracteres.");
  } else {
    const hash = await bcrypt.hash(adminPassword, 12);
    const admin = await prisma.user.upsert({
      where: { email: adminEmail.toLowerCase() },
      update: { passwordHash: hash, isAdmin: true },
      create: {
        email: adminEmail.toLowerCase(),
        name: "Administrador",
        passwordHash: hash,
        isAdmin: true,
      },
    });
    console.log(`Admin pronto: ${admin.email}`);
  }

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
