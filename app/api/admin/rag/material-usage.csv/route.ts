import { NextRequest } from 'next/server'
import { requireAdmin } from '@/lib/admin'
import { query } from '@/lib/db'

export const runtime = 'nodejs'

export async function GET(req: NextRequest) {
  await requireAdmin(req)
  const { searchParams } = new URL(req.url)
  const limit = Math.min(Number(searchParams.get('limit')) || 100, 1000)
  const sql = `WITH expanded AS (
    SELECT jsonb_array_elements(meta->'rag') elem
    FROM chat_messages
    WHERE role='assistant' AND meta ? 'rag'
  )
  SELECT (elem->>'material_id') AS material_id, (elem->>'score')::numeric AS score
  FROM expanded
  WHERE (elem->>'material_id') IS NOT NULL
  LIMIT $1` // simple flat list, client агрегирует
  const res = await query(sql, [limit])
  const rows = res.rows as { material_id: string; score: number }[]
  const header = 'material_id,score\n'
  const body = rows.map(r=>`${r.material_id},${r.score}`).join('\n') + '\n'
  return new Response(header + body, {
    headers: {
      'Content-Type': 'text/csv; charset=utf-8',
      'Content-Disposition': 'attachment; filename="material-usage.csv"'
    }
  })
}
