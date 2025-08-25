// @vitest-environment node
import { describe, it, expect } from 'vitest'

// Simulate filter logic: admin/promo see all; public only sees is_public
interface Mat { id:string; is_public:boolean }
function filterMaterials(materials:Mat[], admin:boolean, promo:boolean) {
  if (admin || promo) return materials
  return materials.filter(m=>m.is_public)
}

describe('materials visibility filter', () => {
  const mats = [
    { id:'1', is_public:true },
    { id:'2', is_public:false },
  ]
  it('public user sees only public', () => {
    expect(filterMaterials(mats,false,false).map(m=>m.id)).toEqual(['1'])
  })
  it('promo user sees all', () => {
    expect(filterMaterials(mats,false,true).length).toBe(2)
  })
  it('admin sees all', () => {
    expect(filterMaterials(mats,true,false).length).toBe(2)
  })
})
