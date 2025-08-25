import { describe, it, expect } from 'vitest'

function mapRange(r: string){
  switch(r){
    case '1d': return 1
    case '7d': return 7
    case '30d': return 30
    default: return 90
  }
}

describe('rag stats range mapping', () => {
  it('maps known values', () => {
    expect(mapRange('1d')).toBe(1)
    expect(mapRange('7d')).toBe(7)
    expect(mapRange('30d')).toBe(30)
  })
  it('defaults others', () => {
    expect(mapRange('all')).toBe(90)
  })
})
