/**
 * Utilitarios de seguranca compartilhados.
 */

/**
 * Aceita apenas caminhos internos da aplicacao.
 *
 * A versao anterior checava so `startsWith('/')`. Isso deixava passar
 * `//site-malicioso.com` (URL relativa ao protocolo) e `/\\site.com`, que o
 * navegador trata como dominio externo: um link de login forjado mandava o
 * usuario, ja autenticado, para um site de phishing (open redirect).
 */
export function safeInternalPath(value: string | null | undefined, fallback = '/'): string {
  if (!value || typeof value !== 'string') return fallback;
  if (!value.startsWith('/')) return fallback;
  if (value.startsWith('//') || value.startsWith('/\\')) return fallback;
  if (/[\u0000-\u001f]/.test(value)) return fallback;
  return value;
}

/**
 * Descobre o IP do cliente atras do Nginx.
 * O Nginx sobrescreve `X-Real-IP` com o IP real da conexao, entao ele tem
 * prioridade sobre `X-Forwarded-For` (que o cliente pode forjar).
 */
export function clientIp(headers: Headers | Record<string, string | string[] | undefined> | undefined): string {
  if (!headers) return 'unknown';
  const get = (name: string): string | undefined => {
    if (typeof (headers as Headers).get === 'function') return (headers as Headers).get(name) ?? undefined;
    const raw = (headers as Record<string, string | string[] | undefined>)[name];
    return Array.isArray(raw) ? raw[0] : raw;
  };
  const realIp = get('x-real-ip');
  if (realIp) return realIp.trim();
  const forwarded = get('x-forwarded-for');
  if (forwarded) return forwarded.split(',')[0].trim();
  return 'unknown';
}
