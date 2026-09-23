import { NextResponse } from 'next/server';
import { z } from 'zod';
import { prisma } from '@/lib/prisma';
import { rateLimit } from '@/lib/rate-limit';
import { getAdminForApi } from '@/lib/require-admin';
import { decryptSecret, generateRecoveryCodes, hashRecoveryCode, verifyTotp } from '@/lib/totp';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

const bodySchema = z.object({ code: z.string().trim().regex(/^\d{3}\s?\d{3}$/) });

/**
 * Passo 2: confere o primeiro codigo do app. Se estiver certo, ativa o 2FA e
 * devolve os codigos de recuperacao — mostrados UMA unica vez.
 */
export async function POST(req: Request) {
  const admin = await getAdminForApi({ allowWithout2fa: true });
  if (!admin) return NextResponse.json({ message: 'Acesso negado.' }, { status: 403 });
  if (admin.totpEnabledAt) return NextResponse.json({ message: 'O 2FA já está ativo nesta conta.' }, { status: 409 });
  if (!admin.totpPendingSecret) return NextResponse.json({ message: 'Gere o QR Code primeiro.' }, { status: 400 });

  const limit = await rateLimit(`2fa-enable:${admin.id}`, 10, 15 * 60);
  if (!limit.allowed) return NextResponse.json({ message: 'Muitas tentativas. Aguarde alguns minutos.' }, { status: 429 });

  const parsed = bodySchema.safeParse(await req.json().catch(() => null));
  if (!parsed.success) return NextResponse.json({ message: 'Digite os 6 números do aplicativo.' }, { status: 400 });

  const secret = decryptSecret(admin.totpPendingSecret);
  const step = verifyTotp(secret, parsed.data.code, null);
  if (step === null) {
    return NextResponse.json({ message: 'Código incorreto. Confira se o horário do celular está automático e tente o código atual.' }, { status: 400 });
  }

  const recoveryCodes = generateRecoveryCodes();
  const { count } = await prisma.user.updateMany({
    where: { id: admin.id, totpEnabledAt: null, totpPendingSecret: admin.totpPendingSecret },
    data: {
      totpSecret: admin.totpPendingSecret,
      totpPendingSecret: null,
      totpEnabledAt: new Date(),
      totpLastStep: step,
      totpRecoveryHashes: recoveryCodes.map(hashRecoveryCode)
    }
  });
  if (count !== 1) return NextResponse.json({ message: 'A configuração mudou. Recarregue a página.' }, { status: 409 });

  console.warn(`[2FA] Ativado para admin=${admin.id}`);
  return NextResponse.json({ recoveryCodes }, { headers: { 'Cache-Control': 'no-store' } });
}
