import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { z } from 'zod';
import { authOptions } from '@/lib/auth';
import { prisma } from '@/lib/prisma';
import { rateLimit } from '@/lib/rate-limit';
import { clientIp } from '@/lib/security';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

/**
 * Recebe newsletter, formulario de contato e pedidos de orcamento.
 * Antes os tres formularios apenas exibiam "Mensagem enviada" e descartavam
 * os dados — todo contato de cliente era perdido.
 */
const leadSchema = z.object({
  email: z.string().trim().toLowerCase().email().max(254),
  name: z.string().trim().max(120).optional(),
  subject: z.string().trim().max(120).optional(),
  message: z.string().trim().max(4000).optional(),
  source: z.enum(['newsletter', 'contato', 'orcamento']),
  // Campo-armadilha: invisivel para humanos, robos costumam preencher.
  website: z.string().max(0).optional()
});

export async function POST(req: Request) {
  try {
    const ip = clientIp(req.headers);
    const limit = await rateLimit(`lead:${ip}`, 8, 60 * 60);
    if (!limit.allowed) {
      return NextResponse.json({ message: 'Muitas mensagens enviadas. Tente mais tarde.' }, { status: 429 });
    }

    const parsed = leadSchema.safeParse(await req.json().catch(() => null));
    if (!parsed.success) {
      return NextResponse.json({ message: 'Confira os dados informados.' }, { status: 400 });
    }

    const session = await getServerSession(authOptions);
    const { email, name, subject, message, source } = parsed.data;

    await prisma.lead.create({
      data: { email, name, subject, message, source, userId: session?.user?.id ?? null }
    });

    return NextResponse.json({ ok: true }, { status: 201 });
  } catch (error) {
    console.error('[LEAD_ERROR]', error);
    return NextResponse.json({ message: 'Nao foi possivel enviar agora. Tente novamente.' }, { status: 500 });
  }
}
