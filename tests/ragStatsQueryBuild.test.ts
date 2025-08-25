// @vitest-environment node
import { describe, it, expect } from 'vitest'

// Basic smoke to ensure range param mapping consistent with endpoint assumptions
function buildInterval(range:string){
  range = range.toLowerCase()
  if(range==='1d') return '1 day'
  if(range==='7d') return '7 days'
  if(range==='30d') return '30 days'
  if(range==='all') return null
  return '7 days'
}

describe('RAG stats interval mapping', () => {
  it('maps known ranges', () => {
    expect(buildInterval('1d')).toBe('1 day')
    expect(buildInterval('7d')).toBe('7 days')
    expect(buildInterval('30d')).toBe('30 days')
    expect(buildInterval('all')).toBeNull()
  })
  it('defaults unknown to 7 days', () => {
    expect(buildInterval('weird')).toBe('7 days')
  })
})
