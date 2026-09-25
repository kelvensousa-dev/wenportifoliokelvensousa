import type { Metadata, Viewport } from 'next';
import { Bricolage_Grotesque, JetBrains_Mono, Manrope, Space_Grotesk } from 'next/font/google';
import { LanguageProvider } from '@/components/LanguageContext';
import Providers from '@/components/Providers';
import './globals.css';

/**
 * As fontes eram referenciadas no Tailwind (`var(--font-manrope)` e
 * `var(--font-space-grotesk)`), mas nunca carregadas: o site inteiro caia
 * na fonte padrao do sistema. `next/font` hospeda os arquivos localmente
 * (sem requisicao ao Google no navegador, compativel com a CSP e a LGPD).
 */
const manrope = Manrope({ subsets: ['latin'], variable: '--font-manrope', display: 'swap' });
const spaceGrotesk = Space_Grotesk({ subsets: ['latin'], variable: '--font-space-grotesk', display: 'swap' });
// Fontes da identidade visual da home (titulos e rotulos tecnicos).
const bricolage = Bricolage_Grotesque({ subsets: ['latin'], variable: '--font-bricolage', display: 'swap' });
const jetbrains = JetBrains_Mono({ subsets: ['latin'], weight: ['500'], variable: '--font-jetbrains', display: 'swap' });

const appUrl = process.env.NEXT_PUBLIC_APP_URL ?? 'http://localhost:3000';

export const metadata: Metadata = {
  metadataBase: new URL(appUrl),
  title: {
    default: 'Kelven Studio | Produtos digitais, sistemas e automações',
    template: '%s | Kelven Studio'
  },
  description: 'Software, automações e sistemas digitais para equipes que querem operar melhor.',
  openGraph: {
    type: 'website',
    siteName: 'Kelven Studio',
    title: 'Kelven Studio | Produtos digitais, sistemas e automações',
    description: 'Software, automações e sistemas digitais para equipes que querem operar melhor.',
    locale: 'pt_BR'
  },
  robots: { index: true, follow: true }
};

export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
  themeColor: '#F8F9FA'
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="pt-BR" className={`${manrope.variable} ${spaceGrotesk.variable} ${bricolage.variable} ${jetbrains.variable}`}>
      <body className="font-sans antialiased">
        <Providers>
          <LanguageProvider>{children}</LanguageProvider>
        </Providers>
      </body>
    </html>
  );
}
