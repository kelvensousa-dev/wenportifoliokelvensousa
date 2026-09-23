import { getServerSession } from 'next-auth';
import { redirect } from 'next/navigation';
import { authOptions } from '@/lib/auth';
import { prisma } from '@/lib/prisma';

/**
 * Segunda camada de protecao para paginas administrativas (defesa em
 * profundidade). O middleware ja bloqueia /admin, mas se ele for contornado
 * por uma falha futura ou configuracao errada, a pagina ainda confere o
 * privilegio NO BANCO antes de ler qualquer dado.
 */
export async function requireAdmin(options: { allowWithout2fa?: boolean } = {}) {
  const session = await getServerSession(authOptions);
  if (!session?.user?.id) redirect('/admin/login');

  const user = await prisma.user.findUnique({
    where: { id: session.user.id },
    select: { id: true, isAdmin: true, email: true, totpEnabledAt: true, totpRecoveryHashes: true }
  });

  if (!user?.isAdmin) redirect('/dashboard');

  // 2FA obrigatorio: sem ele, o admin so acessa a tela de configuracao.
  if (!user.totpEnabledAt && !options.allowWithout2fa) redirect('/admin/seguranca');
  return user;
}

/**
 * Mesma regra para rotas de API do admin: devolve o admin (com 2FA ativo)
 * ou null. A rota decide a resposta (401/403).
 */
export async function getAdminForApi(options: { allowWithout2fa?: boolean } = {}) {
  const session = await getServerSession(authOptions);
  if (!session?.user?.id) return null;
  const user = await prisma.user.findUnique({
    where: { id: session.user.id },
    select: { id: true, email: true, isAdmin: true, totpEnabledAt: true, totpPendingSecret: true }
  });
  if (!user?.isAdmin) return null;
  if (!user.totpEnabledAt && !options.allowWithout2fa) return null;
  return user;
}

export async function requireUser(callbackUrl: string) {
  const session = await getServerSession(authOptions);
  if (!session?.user?.id) redirect(`/login?callbackUrl=${encodeURIComponent(callbackUrl)}`);
  return session.user;
}
