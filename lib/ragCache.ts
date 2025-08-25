// Simple in-memory LRU + TTL cache for embedding vectors
// Key: normalized text; Value: { vector: number[]; ts: number }

interface Entry { vector: number[]; ts: number }

const MAX_ITEMS = 500
const cache = new Map<string, Entry>()

function now() { return Date.now() }

export function getEmbeddingFromCache(text: string, ttlMs: number): number[] | null {
  const key = normalizeKey(text)
  const e = cache.get(key)
  if (!e) return null
  if (now() - e.ts > ttlMs) { cache.delete(key); return null }
  // touch for LRU
  cache.delete(key)
  cache.set(key, e)
  return e.vector
}

export function setEmbeddingCache(text: string, vector: number[]) {
  const key = normalizeKey(text)
  if (cache.size >= MAX_ITEMS) {
    // delete oldest (first inserted)
    const firstKey = cache.keys().next().value as string | undefined
    if (firstKey) cache.delete(firstKey)
  }
  cache.set(key, { vector, ts: now() })
}

export function normalizeKey(t: string) {
  return t.trim().toLowerCase().replace(/\s+/g, ' ')
}

// For tests
export function __clear() { cache.clear() }
export function __size() { return cache.size }
