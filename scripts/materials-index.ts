#!/usr/bin/env ts-node
import 'dotenv/config'

async function main() {
  const materialId = process.argv[2]
  if (!materialId) {
    console.error('Usage: pnpm ts-node scripts/materials-index.ts <material-uuid>')
    process.exit(1)
  }
  const base = process.env.LOCAL_BASE_URL || 'http://localhost:3000'
  const res = await fetch(base + '/api/materials/index', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ materialId }) })
  const json = await res.json()
  console.log(json)
  if (!res.ok) process.exit(1)
}
main().catch(e=>{ console.error(e); process.exit(1) })
