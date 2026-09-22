import type { Metadata } from 'next';
import AuthShell from '@/components/AuthShell';
import { enabledOAuthProviders } from '@/lib/auth-providers';

// Renderiza no servidor a cada acesso: as chaves OAuth existem so em runtime
// (o estagio de build do Docker nao recebe o .env). Como pagina estatica, os
// botoes Google/GitHub nunca apareceriam, mesmo configurados.
export const dynamic = 'force-dynamic';

export const metadata: Metadata = {
  title: 'Entrar | Kelven Studio',
  robots: { index: false, follow: false }
};

export default function LoginPage() {
  // Server Component: le o ambiente e so envia ao cliente os providers
  // realmente configurados.
  return <AuthShell mode="login" oauthProviders={enabledOAuthProviders()} />;
}
