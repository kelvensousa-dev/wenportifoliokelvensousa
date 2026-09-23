import { createCipheriv, createDecipheriv, createHash, createHmac, hkdfSync, randomBytes, timingSafeEqual } from 'crypto';

/**
 * TOTP (RFC 6238) — o codigo de 6 digitos que muda a cada 30 segundos nos
 * apps Google Authenticator, Microsoft Authenticator, Authy etc.
 *
 * Implementado aqui (sem biblioteca) porque o algoritmo e curto e padrao:
 * HMAC-SHA1 do numero do intervalo de 30s, truncado para 6 digitos.
 */

const STEP_SECONDS = 30;
const DIGITS = 6;
/** Aceita 1 intervalo antes/depois: tolera relogio do celular ~30s adiantado/atrasado. */
const WINDOW = 1;
const BASE32 = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ234567';

// ── Base32 (formato do segredo nos apps autenticadores) ──────────

export function base32Encode(buffer: Buffer): string {
  let bits = 0;
  let value = 0;
  let output = '';
  for (const byte of buffer) {
    value = (value << 8) | byte;
    bits += 8;
    while (bits >= 5) {
      output += BASE32[(value >>> (bits - 5)) & 31];
      bits -= 5;
    }
  }
  if (bits > 0) output += BASE32[(value << (5 - bits)) & 31];
  return output;
}

export function base32Decode(input: string): Buffer {
  const clean = input.toUpperCase().replace(/[^A-Z2-7]/g, '');
  let bits = 0;
  let value = 0;
  const bytes: number[] = [];
  for (const char of clean) {
    value = (value << 5) | BASE32.indexOf(char);
    bits += 5;
    if (bits >= 8) {
      bytes.push((value >>> (bits - 8)) & 255);
      bits -= 8;
    }
  }
  return Buffer.from(bytes);
}

// ── Geracao e verificacao ────────────────────────────────────────

/** Segredo novo de 160 bits (tamanho recomendado pela RFC 4226). */
export function generateTotpSecret(): string {
  return base32Encode(randomBytes(20));
}

export function currentStep(now = Date.now()): number {
  return Math.floor(now / 1000 / STEP_SECONDS);
}

export function totpAt(secret: string, step: number): string {
  const counter = Buffer.alloc(8);
  counter.writeBigUInt64BE(BigInt(step));
  const hmac = createHmac('sha1', base32Decode(secret)).update(counter).digest();
  const offset = hmac[hmac.length - 1] & 15;
  const binary = (hmac.readUInt32BE(offset) & 0x7fffffff) % 10 ** DIGITS;
  return binary.toString().padStart(DIGITS, '0');
}

/**
 * Confere o codigo. Retorna o intervalo usado (para bloquear reuso) ou null.
 * `lastStep`: ultimo intervalo ja aceito — um codigo igual ou anterior e recusado.
 */
export function verifyTotp(secret: string, code: string, lastStep: number | null, now = Date.now()): number | null {
  const clean = code.replace(/\s/g, '');
  if (!/^\d{6}$/.test(clean)) return null;
  const step = currentStep(now);
  for (let delta = -WINDOW; delta <= WINDOW; delta += 1) {
    const candidate = step + delta;
    if (lastStep !== null && candidate <= lastStep) continue;
    const expected = Buffer.from(totpAt(secret, candidate));
    if (timingSafeEqual(expected, Buffer.from(clean))) return candidate;
  }
  return null;
}

/** Link lido pelo QR Code nos apps autenticadores. */
export function otpauthUri(secret: string, account: string, issuer = 'Kelven Studio'): string {
  const label = encodeURIComponent(`${issuer}:${account}`);
  const params = new URLSearchParams({ secret, issuer, algorithm: 'SHA1', digits: String(DIGITS), period: String(STEP_SECONDS) });
  return `otpauth://totp/${label}?${params.toString()}`;
}

// ── Codigos de recuperacao (celular perdido) ─────────────────────

export function generateRecoveryCodes(count = 8): string[] {
  return Array.from({ length: count }, () => {
    const raw = base32Encode(randomBytes(5)).slice(0, 8);
    return `${raw.slice(0, 4)}-${raw.slice(4)}`;
  });
}

export function normalizeRecoveryCode(code: string): string {
  return code.toUpperCase().replace(/[^A-Z2-7]/g, '');
}

export function hashRecoveryCode(code: string): string {
  return createHash('sha256').update(`kelven-recovery:${normalizeRecoveryCode(code)}`).digest('hex');
}

// ── Criptografia do segredo no banco ─────────────────────────────

/**
 * O segredo TOTP fica criptografado no banco: quem obtiver uma copia do banco
 * (ou de um backup) nao consegue gerar codigos. A chave e derivada do
 * NEXTAUTH_SECRET, que so existe no .env do servidor.
 * ATENCAO: trocar o NEXTAUTH_SECRET invalida o 2FA configurado (refazer).
 */
function encryptionKey(): Buffer {
  const secret = process.env.NEXTAUTH_SECRET;
  if (!secret) throw new Error('NEXTAUTH_SECRET nao configurada.');
  return Buffer.from(hkdfSync('sha256', secret, 'kelven-totp-salt', 'totp-secret-v1', 32));
}

export function encryptSecret(plain: string): string {
  const iv = randomBytes(12);
  const cipher = createCipheriv('aes-256-gcm', encryptionKey(), iv);
  const data = Buffer.concat([cipher.update(plain, 'utf8'), cipher.final()]);
  return ['v1', iv.toString('base64'), cipher.getAuthTag().toString('base64'), data.toString('base64')].join(':');
}

export function decryptSecret(payload: string): string {
  const [version, iv, tag, data] = payload.split(':');
  if (version !== 'v1' || !iv || !tag || !data) throw new Error('Segredo 2FA em formato desconhecido.');
  const decipher = createDecipheriv('aes-256-gcm', encryptionKey(), Buffer.from(iv, 'base64'));
  decipher.setAuthTag(Buffer.from(tag, 'base64'));
  return Buffer.concat([decipher.update(Buffer.from(data, 'base64')), decipher.final()]).toString('utf8');
}
