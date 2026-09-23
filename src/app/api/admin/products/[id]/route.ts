import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { z } from 'zod';
import { authOptions } from '@/lib/auth';
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
  const session = await getServerSession(authOptions);
  if (!session?.user?.id) return NextResponse.json({ message: 'Não autenticado.' }, { status: 401 });

  // Confere o privilegio NO BANCO (o token da sessao pode estar desatualizado).
  const admin = await prisma.user.findUnique({ where: { id: session.user.id }, select: { isAdmin: true } });
  if (!admin?.isAdmin) return NextResponse.json({ message: 'Acesso negado.' }, { status: 403 });

  const parsed = bodySchema.safeParse(await req.json().catch(() => null));
  if (!parsed.success) return NextResponse.json({ message: 'Dados inválidos.' }, { status: 400 });

  const { count } = await prisma.product.updateMany({ where: { id: params.id }, data: { active: parsed.data.active } });
  if (count === 0) return NextResponse.json({ message: 'Produto não encontrado.' }, { status: 404 });

  return NextResponse.json({ ok: true, active: parsed.data.active });
}
