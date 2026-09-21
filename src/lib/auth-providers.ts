/**
 * Fonte unica sobre quais providers OAuth estao configurados.
 * Usada pelas Server Components de login/cadastro para nao renderizar
 * botoes que resultariam em erro de configuracao do NextAuth.
 */
export function enabledOAuthProviders(): Array<'google' | 'github'> {
  const providers: Array<'google' | 'github'> = [];
  if (process.env.GOOGLE_CLIENT_ID && process.env.GOOGLE_CLIENT_SECRET) providers.push('google');
  if (process.env.GITHUB_ID && process.env.GITHUB_SECRET) providers.push('github');
  return providers;
}
