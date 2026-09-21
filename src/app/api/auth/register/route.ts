import { NextResponse } from 'next/server';
import { z } from 'zod';
import * as bcrypt from 'bcryptjs';
import { Prisma } from '@prisma/client';
import { prisma } from '@/lib/prisma';
import { rateLimit } from '@/lib/rate-limit';
import { clientIp } from '@/lib/security';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

const registerSchema = z.object({
  name: z.string().trim().min(2, 'Informe seu nome.').max(120),
  email: z.string().trim().toLowerCase().email('E-mail inválido.').max(254),
  password: z
    .string()
    .min(8, 'A senha precisa ter ao menos 8 caracteres.')
    .max(200)
    .refine((value) => /[A-Za-z]/.test(value) && /[0-9]/.test(value), 'Use letras e números na senha.'),
  acceptedTerms: z.literal(true, { errorMap: () => ({ message: 'Aceite os termos para continuar.' }) })
});

const GENERIC_CONFLICT = 'Não foi possível criar a conta com esses dados.';

export async function POST(request: Request) {
  try {
    const ip = clientIp(request.headers);
    const limit = await rateLimit(`register:${ip}`, 5, 60 * 60);
    if (!limit.allowed) {
      return NextResponse.json({ message: 'Muitas tentativas. Tente novamente mais tarde.' }, { status: 429 });
    }

    const parsed = registerSchema.safeParse(await request.json().catch(() => null));
    if (!parsed.success) {
      return NextResponse.json({ message: parsed.error.issues[0]?.message ?? 'Dados inválidos.' }, { status: 400 });
    }

    const { name, email, password } = parsed.data;

    const existing = await prisma.user.findUnique({ where: { email }, select: { id: true } });
    if (existing) {
      // Mensagem generica de proposito: evita enumerar contas existentes.
      return NextResponse.json({ message: GENERIC_CONFLICT }, { status: 409 });
    }

    const passwordHash = await bcrypt.hash(password, 12);

    await prisma.user.create({
      data: { name, email, passwordHash, isAdmin: false } // isAdmin nunca vem do cliente
    });

    return NextResponse.json({ ok: true }, { status: 201 });
  } catch (error) {
    // Dois cadastros simultaneos com o mesmo e-mail: antes virava erro 500.
    if (error instanceof Prisma.PrismaClientKnownRequestError && error.code === 'P2002') {
      return NextResponse.json({ message: GENERIC_CONFLICT }, { status: 409 });
    }
    console.error('[REGISTER_ERROR]', error);
    return NextResponse.json({ message: 'Erro interno.' }, { status: 500 });
  }
}
