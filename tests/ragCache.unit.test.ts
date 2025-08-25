// @vitest-environment node
import { describe, it, expect, beforeEach, vi } from 'vitest'
import { getEmbeddingFromCache, setEmbeddingCache, __clear, __size } from '../lib/ragCache'

describe('ragCache', () => {
  beforeEach(()=> __clear())

  it('stores and retrieves within TTL', () => {
    setEmbeddingCache('Hello World', [1,2,3])
    const got = getEmbeddingFromCache('hello   world', 1000)
    expect(got).toEqual([1,2,3])
  })

  it('expires after TTL', () => {
    vi.useFakeTimers()
    setEmbeddingCache('Key', [0])
    // advance beyond ttl
    vi.advanceTimersByTime(2)
    const got1 = getEmbeddingFromCache('Key', 1)
    expect(got1).toBeNull()
    vi.useRealTimers()
  })

  it('evicts oldest when max exceeded', () => {
    for (let i=0;i<510;i++) setEmbeddingCache('k'+i, [i])
    expect(__size()).toBeLessThanOrEqual(500)
  })
})
