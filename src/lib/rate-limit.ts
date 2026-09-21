import Redis from 'ioredis';

/**
 * Limitador de tentativas (janela fixa).
 *
 * Usa o Redis que ja existe no docker-compose, assim o limite vale para todas
 * as instancias da aplicacao. Se o Redis estiver indisponivel, cai para um
 * contador em memoria — a aplicacao continua funcionando, apenas com um
 * limite por instancia.
 *
 * Protege: login (forca bruta de senha), cadastro, formularios de contato e
 * criacao de sessoes de pagamento.
 */

let redis: Redis | null = null;
let redisDisabled = false;

function getRedis(): Redis | null {
  if (redisDisabled || !process.env.REDIS_URL) return null;
  if (redis) return redis;
  try {
    redis = new Redis(process.env.REDIS_URL, {
      maxRetriesPerRequest: 1,
      enableOfflineQueue: false,
      lazyConnect: false
    });
    redis.on('error', (error) => {
      // Evita derrubar o processo por erro de conexao; o fallback em memoria assume.
      console.error('[RATE_LIMIT_REDIS]', error.message);
    });
    return redis;
  } catch {
    redisDisabled = true;
    return null;
  }
}

const memory = new Map<string, { count: number; resetAt: number }>();

function memoryHit(key: string, windowMs: number): number {
  const now = Date.now();
  const entry = memory.get(key);
  if (!entry || entry.resetAt <= now) {
    memory.set(key, { count: 1, resetAt: now + windowMs });
    if (memory.size > 10_000) {
      memory.forEach((value, mapKey) => {
        if (value.resetAt <= now) memory.delete(mapKey);
      });
    }
    return 1;
  }
  entry.count += 1;
  return entry.count;
}

export type RateLimitResult = { allowed: boolean; remaining: number };

/**
 * @param key      identificador (ex.: `login:${ip}`)
 * @param limit    numero maximo de tentativas na janela
 * @param windowSec tamanho da janela em segundos
 */
export async function rateLimit(key: string, limit: number, windowSec: number): Promise<RateLimitResult> {
  const fullKey = `rl:${key}`;
  const client = getRedis();

  if (client && client.status === 'ready') {
    try {
      const count = await client.incr(fullKey);
      if (count === 1) await client.expire(fullKey, windowSec);
      return { allowed: count <= limit, remaining: Math.max(0, limit - count) };
    } catch (error) {
      console.error('[RATE_LIMIT]', error);
    }
  }

  const count = memoryHit(fullKey, windowSec * 1000);
  return { allowed: count <= limit, remaining: Math.max(0, limit - count) };
}
