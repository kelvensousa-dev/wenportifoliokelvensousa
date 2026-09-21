import type { Metadata } from 'next';
import AuthShell from '@/components/AuthShell';
import { enabledOAuthProviders } from '@/lib/auth-providers';

export const metadata: Metadata = {
  title: 'Criar conta | Kelven Studio',
  robots: { index: false, follow: false }
};

export default function SignupPage() {
  return <AuthShell mode="signup" oauthProviders={enabledOAuthProviders()} />;
}
