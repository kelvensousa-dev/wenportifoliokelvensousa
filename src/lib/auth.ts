import type { AuthOptions } from 'next-auth';
import CredentialsProvider from 'next-auth/providers/credentials';
import GoogleProvider from 'next-auth/providers/google';
import GitHubProvider from 'next-auth/providers/github';
import { PrismaAdapter } from '@next-auth/prisma-adapter';
import { prisma } from '@/lib/prisma';
import { rateLimit } from '@/lib/rate-limit';
import { clientIp } from '@/lib/security';
import * as bcrypt from 'bcryptjs';

/**
 * Hash "falso" usado quando o e-mail nao existe. Sem ele, o login respondia
 * instantaneamente para e-mails inexistentes e ~250 ms para e-mails
 * cadastrados — a diferenca de tempo permitia descobrir quem tem conta.
 */
let dummyHash: Promise<string> | null = null;
function getDummyHash(): Promise<string> {
  if (!dummyHash) dummyHash = bcrypt.hash('dummy-password-never-matches', 12);
  return dummyHash;
}

/** Intervalo para revalidar o privilegio de admin no banco. */
const ADMIN_RECHECK_MS = 5 * 60 * 1000;

const providers: AuthOptions['providers'] = [
  CredentialsProvider({
    name: 'Credentials',
    credentials: {
      email: { label: 'Email', type: 'email' },
      password: { label: 'Senha', type: 'password' }
    },
    async authorize(credentials, req) {
      const email = credentials?.email?.toLowerCase().trim();
      const password = credentials?.password;
      if (!email || !password || email.length > 254 || password.length > 200) return null;

      // Protecao contra forca bruta: por IP e por conta.
      const ip = clientIp(req?.headers as Record<string, string | undefined> | undefined);
      const [byIp, byEmail] = await Promise.all([
        rateLimit(`login:ip:${ip}`, 20, 15 * 60),
        rateLimit(`login:email:${email}`, 8, 15 * 60)
      ]);
      if (!byIp.allowed || !byEmail.allowed) {
        console.warn(`[AUTH] Limite de tentativas atingido ip=${ip}`);
        return null;
      }

      const user = await prisma.user.findUnique({ where: { email } });
      const hash = user?.passwordHash ?? (await getDummyHash());
      const isPasswordValid = await bcrypt.compare(password, hash);
      if (!user?.passwordHash || !isPasswordValid) return null;

      return {
        id: user.id,
        email: user.email,
        name: user.name,
        isAdmin: user.isAdmin
      };
    }
  })
];

if (process.env.GOOGLE_CLIENT_ID && process.env.GOOGLE_CLIENT_SECRET) {
  providers.push(
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET
    })
  );
}

if (process.env.GITHUB_ID && process.env.GITHUB_SECRET) {
  providers.push(
    GitHubProvider({
      clientId: process.env.GITHUB_ID,
      clientSecret: process.env.GITHUB_SECRET
    })
  );
}

export const authOptions: AuthOptions = {
  adapter: PrismaAdapter(prisma),
  providers,
  secret: process.env.NEXTAUTH_SECRET,
  session: {
    strategy: 'jwt',
    maxAge: 60 * 60 * 24 * 7
  },
  callbacks: {
    async jwt({ token, user, trigger }) {
      // Primeiro login: copia os dados do usuario para o token.
      if (user) {
        token.id = user.id;
        token.isAdmin = Boolean(user.isAdmin);
        token.checkedAt = Date.now();
        return token;
      }

      // Revalida o privilegio no banco a cada 5 minutos (ou quando o cliente
      // chama `update()`). Antes, um admin rebaixado continuava com acesso
      // ate o token expirar — ate 7 dias.
      const stale = !token.checkedAt || Date.now() - token.checkedAt > ADMIN_RECHECK_MS;
      if (token.id && (trigger === 'update' || stale)) {
        const dbUser = await prisma.user.findUnique({
          where: { id: token.id },
          select: { isAdmin: true }
        });
        token.isAdmin = Boolean(dbUser?.isAdmin);
        token.checkedAt = Date.now();
      }

      return token;
    },
    async session({ session, token }) {
      if (session.user) {
        session.user.id = token.id;
        session.user.isAdmin = Boolean(token.isAdmin);
      }
      return session;
    }
  },
  pages: {
    signIn: '/login',
    error: '/login'
  }
};
