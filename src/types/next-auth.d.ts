import type { DefaultSession } from 'next-auth';

/**
 * Augmentacao de tipos do NextAuth.
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
    /** Momento (ms) da ultima conferencia do privilegio no banco. */
    checkedAt?: number;
  }
}
