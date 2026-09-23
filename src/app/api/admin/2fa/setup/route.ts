import { NextResponse } from 'next/server';
import QRCode from 'qrcode';
import { prisma } from '@/lib/prisma';
import { rateLimit } from '@/lib/rate-limit';
import { getAdminForApi } from '@/lib/require-admin';
import { encryptSecret, generateTotpSecret, otpauthUri } from '@/lib/totp';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

/**
 * Passo 1 da configuracao do 2FA: gera um segredo novo, guarda como
 * "pendente" (criptografado) e devolve o QR Code para o app autenticador.
 * O 2FA so e ativado no passo 2, quando o admin prova que o app funciona.
 */
export async function POST() {
  const admin = await getAdminForApi({ allowWithout2fa: true });
  if (!admin) return NextResponse.json({ message: 'Acesso negado.' }, { status: 403 });

  // Com 2FA ja ativo, trocar o segredo exige o procedimento pelo servidor.
  if (admin.totpEnabledAt) return NextResponse.json({ message: 'O 2FA já está ativo nesta conta.' }, { status: 409 });

  const limit = await rateLimit(`2fa-setup:${admin.id}`, 10, 60 * 60);
  if (!limit.allowed) return NextResponse.json({ message: 'Muitas tentativas. Aguarde.' }, { status: 429 });

  const secret = generateTotpSecret();
  await prisma.user.update({ where: { id: admin.id }, data: { totpPendingSecret: encryptSecret(secret) } });

  const uri = otpauthUri(secret, admin.email);
  const qr = await QRCode.toDataURL(uri, { errorCorrectionLevel: 'M', margin: 1, width: 240 });

  return NextResponse.json(
    // O segredo tambem vai em texto para quem prefere digitar no app.
    { qr, secret: secret.match(/.{1,4}/g)?.join(' ') ?? secret },
    { headers: { 'Cache-Control': 'no-store' } }
  );
}
