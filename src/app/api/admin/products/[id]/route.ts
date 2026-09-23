import { NextResponse } from 'next/server';
import { z } from 'zod';
import { getAdminForApi } from '@/lib/require-admin';
import { prisma } from '@/lib/prisma';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

const bodySchema = z.object({ active: z.boolean() });

/**
 * Retira um produto do site (active=false) ou recoloca a venda (active=true).
 *
 * Nao existe "excluir" de verdade: um produto com pedidos precisa continuar no
 * banco para o historico de compras e as licencas dos clientes.
 */
export async function PATCH(req: Request, { params }: { params: { id: string } }) {
  // Admin com 2FA ativo, conferido no banco.
  const admin = await getAdminForApi();
  if (!admin) return NextResponse.json({ message: 'Acesso negado.' }, { status: 403 });

  const parsed = bodySchema.safeParse(await req.json().catch(() => null));
  if (!parsed.success) return NextResponse.json({ message: 'Dados inválidos.' }, { status: 400 });

  const { count } = await prisma.product.updateMany({ where: { id: params.id }, data: { active: parsed.data.active } });
  if (count === 0) return NextResponse.json({ message: 'Produto não encontrado.' }, { status: 404 });

  return NextResponse.json({ ok: true, active: parsed.data.active });
}
