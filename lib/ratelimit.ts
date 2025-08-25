import { Ratelimit } from '@upstash/ratelimit'
import { Redis } from '@upstash/redis'

interface RatelimitResponseLike {
  success: boolean
  limit: number
  remaining: number
  reset: number
  pending: number
}

function createNoopRatelimit(): any {
  return {
    limit: async (_id: string) => ({ success: true, limit: 1000, remaining: 999, reset: Date.now() + 60000, pending: Promise.resolve() })
  }
}

let rlImpl: Pick<Ratelimit, 'limit'>
const url = process.env.UPSTASH_REDIS_REST_URL
const token = process.env.UPSTASH_REDIS_REST_TOKEN
if (!url || !token) {
  console.warn('[ratelimit] Upstash env vars missing, rate limiting disabled')
  rlImpl = createNoopRatelimit()
} else {
  rlImpl = new Ratelimit({
    redis: new Redis({ url, token }),
    limiter: Ratelimit.slidingWindow(10, '10 m'),
    analytics: false,
  })
}

export const rl = rlImpl
