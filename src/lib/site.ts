/**
 * Dados de contato e redes sociais, configuraveis por variavel de ambiente.
 * Antes estavam fixos no codigo com valores de exemplo
 * (wa.me/5500000000000, linkedin.com, instagram.com).
 *
 * Variaveis NEXT_PUBLIC_* sao embutidas no build: altere o .env ANTES de
 * rodar `docker compose build`.
 */
export const contactEmail = process.env.NEXT_PUBLIC_CONTACT_EMAIL || 'hello@kelven.studio';

const whatsappDigits = (process.env.NEXT_PUBLIC_WHATSAPP_NUMBER || '').replace(/\D/g, '');
export const whatsappUrl = whatsappDigits.length >= 10 ? `https://wa.me/${whatsappDigits}` : null;

export const socialLinks = {
  linkedin: process.env.NEXT_PUBLIC_LINKEDIN_URL || null,
  instagram: process.env.NEXT_PUBLIC_INSTAGRAM_URL || null
};
