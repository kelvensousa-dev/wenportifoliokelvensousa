/**
 * Envio dos formularios publicos (newsletter, contato e orcamento) para
 * POST /api/leads. Retorna uma mensagem de erro pronta para exibir, ou null.
 */
export type LeadSource = 'newsletter' | 'contato' | 'orcamento';

export async function sendLead(form: HTMLFormElement, source: LeadSource): Promise<string | null> {
  const data = new FormData(form);
  const value = (name: string) => {
    const raw = data.get(name);
    return typeof raw === 'string' && raw.trim() ? raw.trim() : undefined;
  };

  try {
    const response = await fetch('/api/leads', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        source,
        email: value('email'),
        name: value('name'),
        subject: value('subject'),
        message: value('message'),
        website: (data.get('website') as string) ?? ''
      })
    });
    if (response.ok) return null;
    const payload = await response.json().catch(() => ({}));
    return payload.message ?? 'Não foi possível enviar. Tente novamente.';
  } catch {
    return 'Falha de conexão. Verifique sua internet e tente novamente.';
  }
}
