import type { DefaultSession } from 'next-auth';

/**
 * Augmentacao de tipos do NextAuth.
 * Sem este arquivo, `session.user.isAdmin` e `token.isAdmin` nao existem
 * para o TypeScript — era a origem dos `as any` espalhados pelo projeto.
 */
declare module 'next-auth' {
  interface User {
    id: string;
    isAdmin: boolean;
  }

  interface Session {
    user: {
      id: string;
      isAdmin: boolean;
    } & DefaultSession['user'];
  }
}

declare module 'next-auth/jwt' {
  interface JWT {
    id: string;
    isAdmin: boolean;
  }
}
