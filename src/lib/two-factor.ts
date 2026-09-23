import { prisma } from '@/lib/prisma';
import { decryptSecret, hashRecoveryCode, normalizeRecoveryCode, verifyTotp } from '@/lib/totp';

/**
 * Confere o segundo fator de um usuario com 2FA ativo.
 * Aceita o codigo de 6 digitos do app OU um codigo de recuperacao (XXXX-XXXX).
 *
 * As atualizacoes sao condicionais (updateMany com WHERE), entao duas
 * tentativas simultaneas com o mesmo codigo nao passam as duas.
 */
export async function verifySecondFactor(userId: string, input: string): Promise<boolean> {
  const user = await prisma.user.findUnique({
    where: { id: userId },
    select: { totpSecret: true, totpEnabledAt: true, totpLastStep: true, totpRecoveryHashes: true }
  });
  if (!user?.totpEnabledAt || !user.totpSecret) return false;

  const code = input.trim();

  // Codigo do app (6 digitos)
  if (/^\d{3}\s?\d{3}$/.test(code)) {
    const step = verifyTotp(decryptSecret(user.totpSecret), code, user.totpLastStep);
    if (step === null) return false;
    const { count } = await prisma.user.updateMany({
      where: { id: userId, OR: [{ totpLastStep: null }, { totpLastStep: { lt: step } }] },
      data: { totpLastStep: step }
    });
    return count === 1;
  }

  // Codigo de recuperacao (uso unico)
  if (normalizeRecoveryCode(code).length === 8) {
    const hash = hashRecoveryCode(code);
    if (!user.totpRecoveryHashes.includes(hash)) return false;
    const { count } = await prisma.user.updateMany({
      where: { id: userId, totpRecoveryHashes: { has: hash } },
      data: { totpRecoveryHashes: user.totpRecoveryHashes.filter((item) => item !== hash) }
    });
    if (count === 1) console.warn(`[2FA] Codigo de recuperacao usado user=${userId}`);
    return count === 1;
  }

  return false;
}
