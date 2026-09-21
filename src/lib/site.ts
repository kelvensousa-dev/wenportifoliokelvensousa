/**
 * Dados de contato, identificacao da empresa e redes sociais, configuraveis
 * por variavel de ambiente. Antes estavam fixos no codigo com valores de
 * exemplo (wa.me/5500000000000, linkedin.com, instagram.com).
 *
 * Variaveis NEXT_PUBLIC_* sao embutidas no build: altere o .env ANTES de
 * rodar `docker compose build`.
 */
export const contactEmail = process.env.NEXT_PUBLIC_CONTACT_EMAIL || 'hello@kelven.studio';

/**
 * Numero do atendimento via WhatsApp (assistente de IA + atendente humano).
 * Formato: DDD + numero. O codigo do pais (55) e acrescentado automaticamente
 * quando ausente. Para trocar, defina NEXT_PUBLIC_WHATSAPP_NUMBER no .env.
 */
const DEFAULT_WHATSAPP_NUMBER = '3599438985';

function withCountryCode(raw: string): string {
  const digits = raw.replace(/\D/g, '');
  // 10 ou 11 digitos = DDD + numero brasileiro, sem o codigo do pais.
  return digits.length === 10 || digits.length === 11 ? `55${digits}` : digits;
}

function formatBrazilPhone(fullDigits: string): string {
  const national = fullDigits.startsWith('55') ? fullDigits.slice(2) : fullDigits;
  if (national.length === 11) return `(${national.slice(0, 2)}) ${national.slice(2, 7)}-${national.slice(7)}`;
  if (national.length === 10) return `(${national.slice(0, 2)}) ${national.slice(2, 6)}-${national.slice(6)}`;
  return `+${fullDigits}`;
}

const configuredWhatsapp = withCountryCode(process.env.NEXT_PUBLIC_WHATSAPP_NUMBER || '');
const whatsappDigits = configuredWhatsapp.length >= 12 ? configuredWhatsapp : withCountryCode(DEFAULT_WHATSAPP_NUMBER);

const whatsappGreeting = 'Olá! Vim pelo site da Kelven Studio e gostaria de atendimento.';

/** Numero formatado para exibir na tela. Ex.: (35) 9943-8985 */
export const whatsappDisplay = formatBrazilPhone(whatsappDigits);
export const whatsappUrl = `https://wa.me/${whatsappDigits}?text=${encodeURIComponent(whatsappGreeting)}`;

/**
 * Identificacao do fornecedor. O Decreto 7.962/2013 (art. 2o) exige que o
 * comercio eletronico exiba, em local de destaque e de facil visualizacao,
 * o nome empresarial, o CNPJ/CPF e o endereco fisico. Preencha no .env;
 * enquanto vazios, os campos nao aparecem no site.
 */
export const company = {
  name: process.env.NEXT_PUBLIC_COMPANY_NAME || 'Kelven Studio',
  document: process.env.NEXT_PUBLIC_COMPANY_DOCUMENT || null,
  address: process.env.NEXT_PUBLIC_COMPANY_ADDRESS || null
};

export const socialLinks = {
  linkedin: process.env.NEXT_PUBLIC_LINKEDIN_URL || null,
  instagram: process.env.NEXT_PUBLIC_INSTAGRAM_URL || null
};
