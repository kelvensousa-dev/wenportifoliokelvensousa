/**
 * Fonte unica dos documentos legais: alimenta o rodape, a navegacao entre
 * documentos e o sitemap. Para criar uma nova pagina legal, adicione-a aqui.
 */
export const legalLinks = [
  { href: '/termos-de-uso', label: 'Termos de uso' },
  { href: '/politica-de-privacidade', label: 'Política de privacidade' },
  { href: '/politica-de-compra', label: 'Política de compra' },
  { href: '/garantias-e-direitos', label: 'Garantias e direitos' },
  { href: '/atendimento', label: 'Central de atendimento' }
] as const;

/** Atualize sempre que qualquer documento legal mudar de forma relevante. */
export const legalUpdatedAt = '21 de setembro de 2026';
