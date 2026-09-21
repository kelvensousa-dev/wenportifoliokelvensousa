import { NextResponse } from 'next/server';
import { z } from 'zod';
import * as bcrypt from 'bcryptjs';
import { prisma } from '@/lib/prisma';

export const runtime = 'nodejs';

/**
 * A pagina /cadastre-se existia, mas nao criava usuario nenhum: o formulario
 * chamava `signIn` com credenciais que nunca tinham sido gravadas. Esta rota
 * fecha o fluxo.
 *
 * O `zod` ja estava no package.json sem nenhum uso — aqui ele ganha funcao.
 */
const registerSchema = z.object({
  name: z.string().trim().min(2, 'Informe seu nome.').max(120),
  email: z.string().trim().toLowerCase().email('E-mail invalido.'),
  password: z.string().min(8, 'A senha precisa ter ao menos 8 caracteres.').max(200)
});

export async function POST(request: Request) {
  try {
    const payload = await request.json().catch(() => null);
    const parsed = registerSchema.safeParse(payload);

    if (!parsed.success) {
      return NextResponse.json(
        { message: parsed.error.issues[0]?.message ?? 'Dados invalidos.' },
        { status: 400 }
      );
    }

    const { name, email, password } = parsed.data;

    const existing = await prisma.user.findUnique({ where: { email }, select: { id: true } });
    if (existing) {
      // Mensagem generica de proposito: dizer "e-mail ja cadastrado" permite
      // enumerar quem tem conta na plataforma.
      return NextResponse.json({ message: 'Nao foi possivel criar a conta com esses dados.' }, { status: 409 });
    }

    const passwordHash = await bcrypt.hash(password, 12);

    await prisma.user.create({
      data: {
        name,
        email,
        passwordHash,
        isAdmin: false // nunca vem do corpo da requisicao
      }
    });

    return NextResponse.json({ ok: true }, { status: 201 });
  } catch (error) {
    console.error('[REGISTER_ERROR]', error);
    return NextResponse.json({ message: 'Erro interno.' }, { status: 500 });
  }
}
