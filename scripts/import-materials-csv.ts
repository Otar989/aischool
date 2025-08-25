#!/usr/bin/env ts-node
import 'dotenv/config'
import fs from 'fs'
import { parse } from 'csv-parse/sync'

interface Row { course_id: string; lesson_id?: string; kind: string; title: string; src: string; description?: string; is_public?: string; position?: string }

async function main() {
  const file = process.argv[2]
  if (!file) {
    console.error('Usage: ts-node scripts/import-materials-csv.ts <file.csv>')
    process.exit(1)
  }
  const text = fs.readFileSync(file, 'utf8')
  const records: Row[] = parse(text, { columns: true, skip_empty_lines: true })
  const base = process.env.LOCAL_BASE_URL || 'http://localhost:3000'
  let ok = 0, fail = 0
  for (const r of records) {
    try {
      const payload = {
        course_id: r.course_id,
        lesson_id: r.lesson_id || undefined,
        kind: r.kind as any,
        title: r.title,
        src: r.src,
        description: r.description || undefined,
        is_public: r.is_public === 'true' || r.is_public === '1',
        position: r.position ? parseInt(r.position,10) : 0
      }
      const res = await fetch(base + '/api/materials', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(payload) })
      if (!res.ok) throw new Error(await res.text())
      ok++
    } catch (e:any) {
      console.error('Row failed', r.title, e.message)
      fail++
    }
  }
  console.log('Done. ok=%d fail=%d', ok, fail)
  if (fail>0) process.exit(1)
}
main()
