import type { Metadata } from 'next';
import AuthShell from '@/components/AuthShell';
import { enabledOAuthProviders } from '@/lib/auth-providers';

export const metadata: Metadata = {
  title: 'Entrar | Kelven Studio',
  robots: { index: false, follow: false }
};

export default function LoginPage() {
  // Server Component: le o ambiente e so envia ao cliente os providers
  // realmente configurados.
  return <AuthShell mode="login" oauthProviders={enabledOAuthProviders()} />;
}
