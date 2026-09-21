import type { AuthOptions } from 'next-auth';
import CredentialsProvider from 'next-auth/providers/credentials';
import GoogleProvider from 'next-auth/providers/google';
import GitHubProvider from 'next-auth/providers/github';
import { PrismaAdapter } from '@next-auth/prisma-adapter';
import { prisma } from '@/lib/prisma';
import * as bcrypt from 'bcryptjs';

/**
 * Providers OAuth sao registrados apenas quando as credenciais existem.
 * Antes, `clientId: process.env.X || ''` registrava um provider quebrado:
 * o botao "Continuar com Google" aparecia e devolvia erro de configuracao.
 */
const providers: AuthOptions['providers'] = [
  CredentialsProvider({
    name: 'Credentials',
    credentials: {
      email: { label: 'Email', type: 'email' },
      password: { label: 'Senha', type: 'password' }
    },
    async authorize(credentials) {
      if (!credentials?.email || !credentials?.password) return null;

      const user = await prisma.user.findUnique({
        where: { email: credentials.email.toLowerCase().trim() }
      });

      if (!user?.passwordHash) return null;

      const isPasswordValid = await bcrypt.compare(credentials.password, user.passwordHash);
      if (!isPasswordValid) return null;

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
        return token;
      }

      // Revalida o privilegio no banco quando o cliente chama `update()`.
      // Sem isto, promover ou rebaixar um admin so surtia efeito no proximo
      // login. Nao revalidamos a cada request de proposito: seria uma ida ao
      // banco em toda navegacao.
      if (trigger === 'update' && token.id) {
        const dbUser = await prisma.user.findUnique({
          where: { id: token.id },
          select: { isAdmin: true }
        });
        token.isAdmin = Boolean(dbUser?.isAdmin);
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
