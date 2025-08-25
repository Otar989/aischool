#!/usr/bin/env ts-node
import 'dotenv/config'

async function main() {
  const base = process.env.LOCAL_BASE_URL || 'http://localhost:3000'
  const list = await fetch(base + '/api/materials/unindexed').then(r=>r.json())
  if (list.error) throw new Error(list.error)
  const ids: string[] = (list.materials||[]).map((m:any)=>m.id)
  console.log('Unindexed count:', ids.length)
  let ok=0, fail=0
  for (const id of ids) {
    try {
      const res = await fetch(base + '/api/materials/index', { method:'POST', headers:{'Content-Type':'application/json'}, body: JSON.stringify({ materialId: id }) })
      const j = await res.json()
      if(!res.ok || j.error) throw new Error(j.error||'fail')
      ok++
      process.stdout.write('.')
    } catch (e:any) {
      fail++
      process.stdout.write('x')
    }
  }
  console.log('\nDone. ok=%d fail=%d', ok, fail)
  if (fail>0) process.exit(1)
}
main().catch(e=>{ console.error('Error', e); process.exit(1) })
