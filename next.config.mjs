/** @type {import('next').NextConfig} */

const isDev = process.env.NODE_ENV !== 'production';
// So forca HTTPS quando o site realmente roda em HTTPS; do contrario o
// primeiro deploy (ainda sem certificado) ficaria sem CSS/JS.
const isHttps = (process.env.NEXT_PUBLIC_APP_URL ?? '').startsWith('https://');

/**
 * Content-Security-Policy.
 * - 'unsafe-inline' em script-src e necessario para os scripts de hidratacao
 *   do Next 14 sem nonce. 'unsafe-eval' apenas em desenvolvimento.
 * - O pagamento acontece na pagina hospedada do Stripe (redirecionamento),
 *   entao nenhum dado de cartao passa por este site.
 */
const csp = [
  "default-src 'self'",
  `script-src 'self' 'unsafe-inline'${isDev ? " 'unsafe-eval'" : ''}`,
  "style-src 'self' 'unsafe-inline'",
  "img-src 'self' data: blob: https:",
  "font-src 'self' data:",
  "connect-src 'self'",
  "frame-ancestors 'none'",
  "base-uri 'self'",
  "form-action 'self' https://checkout.stripe.com https://accounts.google.com https://github.com",
  "object-src 'none'",
  ...(isHttps ? ['upgrade-insecure-requests'] : [])
].join('; ');

const securityHeaders = [
  { key: 'Content-Security-Policy', value: csp },
  ...(isHttps ? [{ key: 'Strict-Transport-Security', value: 'max-age=31536000; includeSubDomains' }] : []),
  { key: 'X-Frame-Options', value: 'DENY' },
  { key: 'X-Content-Type-Options', value: 'nosniff' },
  { key: 'Referrer-Policy', value: 'strict-origin-when-cross-origin' },
  { key: 'Permissions-Policy', value: 'camera=(), microphone=(), geolocation=(), payment=()' },
  { key: 'Cross-Origin-Opener-Policy', value: 'same-origin' }
];

const nextConfig = {
  output: 'standalone',
  poweredByHeader: false,
  // O site nao usa next/image. Desligar o otimizador remove a superficie de
  // ataque de /_next/image (varios avisos de seguranca do Next 14 sem patch).
  images: { unoptimized: true },
  reactStrictMode: true,
  // `typedRoutes` (experimental) foi desligado: ele obrigava `as any` em
  // varios redirecionamentos e quebrava o build com rotas montadas em tempo
  // de execucao, sem ganho real de seguranca.
  async headers() {
    return [
      { source: '/:path*', headers: securityHeaders },
      // Areas privadas nunca devem ficar em cache de proxy/CDN.
      { source: '/admin/:path*', headers: [{ key: 'Cache-Control', value: 'no-store' }, { key: 'X-Robots-Tag', value: 'noindex, nofollow' }] },
      { source: '/dashboard/:path*', headers: [{ key: 'Cache-Control', value: 'no-store' }] },
      { source: '/api/:path*', headers: [{ key: 'Cache-Control', value: 'no-store' }] }
    ];
  }
};

export default nextConfig;
