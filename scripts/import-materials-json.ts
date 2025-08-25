#!/usr/bin/env ts-node
import 'dotenv/config'
import fs from 'fs'

interface Item { course_id: string; lesson_id?: string; kind: string; title: string; src: string; description?: string; is_public?: boolean; position?: number }

async function main() {
  const file = process.argv[2]
  if (!file) { console.error('Usage: ts-node scripts/import-materials-json.ts <file.json>'); process.exit(1) }
  const raw = fs.readFileSync(file,'utf8')
  const arr: Item[] = JSON.parse(raw)
  const base = process.env.LOCAL_BASE_URL || 'http://localhost:3000'
  let ok=0, fail=0
  for (const it of arr) {
    try {
      const res = await fetch(base + '/api/materials', { method:'POST', headers:{'Content-Type':'application/json'}, body: JSON.stringify(it) })
      if(!res.ok) throw new Error(await res.text())
      ok++
    } catch(e:any){
      console.error('Fail', it.title, e.message); fail++
    }
  }
  console.log('Done ok=%d fail=%d', ok, fail)
  if (fail>0) process.exit(1)
}
main()
