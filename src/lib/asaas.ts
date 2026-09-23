/**
 * Cliente minimo da API v3 do Asaas (pagamentos em reais).
 *
 * Sem SDK: o Asaas nao publica um SDK oficial para Node, e a API e REST/JSON
 * simples. Um wrapper pequeno sobre `fetch` e mais facil de auditar.
 *
 * Configuracao (variaveis de ambiente, apenas no servidor):
 *   ASAAS_API_URL        https://api-sandbox.asaas.com/v3 (testes)
 *                        https://api.asaas.com/v3         (producao)
 *   ASAAS_API_KEY        chave da conta; pode ser gravada SEM o "$" inicial
 *   ASAAS_WEBHOOK_TOKEN  segredo enviado pelo Asaas no header asaas-access-token
 *
 * Como no Stripe, a leitura e preguicosa: o `next build` importa este modulo
 * sem variaveis de ambiente e nao pode quebrar por isso.
 */

const SANDBOX_URL = 'https://api-sandbox.asaas.com/v3';
const TIMEOUT_MS = 15_000;

export class AsaasError extends Error {
  constructor(
    message: string,
    readonly status: number,
    readonly errors: Array<{ code?: string; description?: string }> = []
  ) {
    super(message);
    this.name = 'AsaasError';
  }
}

function config() {
  const rawKey = process.env.ASAAS_API_KEY?.trim();
  if (!rawKey) throw new Error('ASAAS_API_KEY nao configurada no ambiente.');

  // As chaves do Asaas comecam com "$" ($aact_...). Tanto o Docker Compose
  // quanto o carregador de .env do Next tratam "$" como variavel e apagam o
  // inicio da chave. Por isso aceitamos a chave gravada sem o "$".
  const apiKey = rawKey.startsWith('$') ? rawKey : `$${rawKey}`;
  const baseUrl = (process.env.ASAAS_API_URL?.trim() || SANDBOX_URL).replace(/\/+$/, '');
  return { apiKey, baseUrl };
}

export function isAsaasConfigured(): boolean {
  return Boolean(process.env.ASAAS_API_KEY?.trim());
}

async function request<T>(method: 'GET' | 'POST' | 'PUT', path: string, body?: unknown): Promise<T> {
  const { apiKey, baseUrl } = config();

  const res = await fetch(`${baseUrl}${path}`, {
    method,
    headers: {
      accept: 'application/json',
      'content-type': 'application/json',
      'user-agent': 'KelvenStudio/0.1',
      access_token: apiKey
    },
    body: body === undefined ? undefined : JSON.stringify(body),
    cache: 'no-store',
    signal: AbortSignal.timeout(TIMEOUT_MS)
  });

  const data = await res.json().catch(() => ({}));
  if (!res.ok) {
    const errors = Array.isArray(data?.errors) ? data.errors : [];
    const detail = errors.map((e: { description?: string }) => e.description).filter(Boolean).join(' | ');
    throw new AsaasError(`Asaas ${method} ${path} -> ${res.status}${detail ? `: ${detail}` : ''}`, res.status, errors);
  }
  return data as T;
}

// ── Tipos (apenas os campos que o sistema usa) ──────────────────

export type AsaasCustomer = { id: string; name: string; cpfCnpj: string; deleted?: boolean };

export type AsaasPaymentStatus =
  | 'PENDING'
  | 'RECEIVED'
  | 'CONFIRMED'
  | 'OVERDUE'
  | 'REFUNDED'
  | 'RECEIVED_IN_CASH'
  | 'REFUND_REQUESTED'
  | 'REFUND_IN_PROGRESS'
  | 'CHARGEBACK_REQUESTED'
  | 'CHARGEBACK_DISPUTE'
  | 'AWAITING_CHARGEBACK_REVERSAL'
  | 'DUNNING_REQUESTED'
  | 'DUNNING_RECEIVED'
  | 'AWAITING_RISK_ANALYSIS';

export type AsaasPayment = {
  id: string;
  customer: string;
  status: AsaasPaymentStatus;
  value: number;
  billingType: string;
  invoiceUrl: string;
  externalReference: string | null;
  deleted?: boolean;
};

// ── Operacoes ────────────────────────────────────────────────────

export function createCustomer(input: { name: string; email?: string | null; cpfCnpj: string; externalReference: string }) {
  return request<AsaasCustomer>('POST', '/customers', {
    name: input.name,
    email: input.email ?? undefined,
    cpfCnpj: input.cpfCnpj,
    externalReference: input.externalReference,
    // A fatura e a confirmacao ja sao mostradas pelo site; evita e-mail/SMS
    // duplicados do Asaas para o cliente.
    notificationDisabled: true
  });
}

export function updateCustomer(id: string, input: { name?: string; cpfCnpj?: string }) {
  return request<AsaasCustomer>('PUT', `/customers/${encodeURIComponent(id)}`, input);
}

export function createPayment(input: {
  customer: string;
  valueCents: number;
  dueDate: string;
  description: string;
  externalReference: string;
  successUrl?: string;
}) {
  return request<AsaasPayment>('POST', '/payments', {
    customer: input.customer,
    // UNDEFINED = o cliente escolhe Pix, boleto ou cartao na fatura do Asaas.
    billingType: 'UNDEFINED',
    value: input.valueCents / 100,
    dueDate: input.dueDate,
    description: input.description.slice(0, 500),
    externalReference: input.externalReference,
    ...(input.successUrl ? { callback: { successUrl: input.successUrl, autoRedirect: true } } : {})
  });
}

export function getPayment(id: string) {
  return request<AsaasPayment>('GET', `/payments/${encodeURIComponent(id)}`);
}

/** Status em que o dinheiro foi efetivamente pago/confirmado. */
export const PAID_STATUSES: ReadonlySet<AsaasPaymentStatus> = new Set(['RECEIVED', 'CONFIRMED', 'RECEIVED_IN_CASH']);

/** Converte o valor do Asaas (reais, numero decimal) para centavos sem erro de ponto flutuante. */
export function toCents(value: number): number {
  return Math.round(value * 100);
}
