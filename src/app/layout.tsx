import type { Metadata } from 'next';
import { LanguageProvider } from '@/components/LanguageContext';
import './globals.css';

export const metadata: Metadata = {
  title: 'Kelven Studio | Digital products with a point of view',
  description: 'Software, automations and digital systems built to move ambitious teams forward.'
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="pt-BR">
      <body><LanguageProvider>{children}</LanguageProvider></body>
    </html>
  );
}
