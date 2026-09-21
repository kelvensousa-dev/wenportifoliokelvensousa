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
export async function requireAdmin() {
  const session = await getServerSession(authOptions);
  if (!session?.user?.id) redirect('/admin/login');

  const user = await prisma.user.findUnique({
    where: { id: session.user.id },
    select: { id: true, isAdmin: true, email: true }
  });

  if (!user?.isAdmin) redirect('/dashboard');
  return user;
}

export async function requireUser(callbackUrl: string) {
  const session = await getServerSession(authOptions);
  if (!session?.user?.id) redirect(`/login?callbackUrl=${encodeURIComponent(callbackUrl)}`);
  return session.user;
}
