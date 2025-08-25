import { NextRequest, NextResponse } from 'next/server'
import { requireAdmin } from '@/lib/admin'
import { query } from '@/lib/db'

export const runtime = 'nodejs'

export async function GET(req: NextRequest) {
  await requireAdmin(req)
  const { searchParams } = new URL(req.url)
  const range = (searchParams.get('range') || '7d').toLowerCase()
  let interval: string | null = null
  if (range === '1d') interval = '1 day'
  else if (range === '7d') interval = '7 days'
  else if (range === '30d') interval = '30 days'
  else if (range === 'all') interval = null
  else interval = '7 days'

  const timeFilter = interval ? `AND created_at >= NOW() - INTERVAL '${interval}'` : ''

  const sql = `WITH rag_msgs AS (
    SELECT id, meta, created_at, (meta->'rag') AS rag_array
    FROM chat_messages
    WHERE role='assistant' AND meta ? 'rag' ${timeFilter}
  ), expanded AS (
    SELECT id, (jsonb_array_elements(rag_array)) AS elem
    FROM rag_msgs
  )
  SELECT 
    (SELECT COUNT(*) FROM rag_msgs) AS assistant_with_rag,
    (SELECT COUNT(*) FROM chat_messages WHERE role='assistant' ${timeFilter}) AS total_assistant,
    (SELECT COUNT(*) FROM chat_messages WHERE role='assistant') AS total_assistant_all,
    (SELECT ROUND(AVG( (elem->>'score')::numeric ),4) FROM expanded WHERE (elem->>'score') IS NOT NULL) AS avg_chunk_score,
    (SELECT ROUND(AVG( (elem->>'score')::numeric ),4) FROM (
        SELECT id, (elem->>'score')::numeric AS score, row_number() OVER (PARTITION BY id ORDER BY (elem->>'score')::numeric DESC) rn
        FROM expanded
      ) t WHERE rn=1) AS avg_top1_score,
    (SELECT ROUND(AVG(score),4) FROM (
        SELECT id, AVG( (elem->>'score')::numeric ) AS score
        FROM (
          SELECT id, elem, row_number() OVER (PARTITION BY id ORDER BY (elem->>'score')::numeric DESC) rn
          FROM expanded
        ) s WHERE rn <= 3 GROUP BY id
      ) tt) AS avg_top3_score,
    (SELECT jsonb_object_agg(material_id, usage_count) FROM (
        SELECT (elem->>'material_id') AS material_id, COUNT(*) usage_count
        FROM expanded
        WHERE (elem->>'material_id') IS NOT NULL
        GROUP BY material_id
        ORDER BY usage_count DESC
        LIMIT 50
      ) freq) AS top_material_usage
  `
  const res = await query(sql, [])
  const body = res.rows[0] || {}

  // daily trend (только если есть interval)
  let trend: any[] = []
  if (interval) {
    // вычисляем стартовую дату
    const daysBack = interval.startsWith('1 ') ? 1 : interval.startsWith('7 ') ? 7 : interval.startsWith('30 ') ? 30 : 7
    const trendSql = `WITH days AS (
      SELECT generate_series::date AS day
      FROM generate_series((CURRENT_DATE - INTERVAL '${daysBack - 1} day')::date, CURRENT_DATE, INTERVAL '1 day')
    ), base AS (
      SELECT date_trunc('day', created_at)::date AS day, role, meta
      FROM chat_messages
      WHERE role='assistant' AND created_at >= CURRENT_DATE - INTERVAL '${daysBack - 1} day'
    ), agg AS (
      SELECT day,
        COUNT(*) FILTER (WHERE role='assistant') AS assistant_msgs,
        COUNT(*) FILTER (WHERE role='assistant' AND meta ? 'rag') AS rag_msgs,
        AVG(sub.score) FILTER (WHERE sub.rn=1) AS avg_top1_score
      FROM base
      LEFT JOIN LATERAL (
        SELECT (elem->>'score')::numeric AS score,
               row_number() OVER (ORDER BY (elem->>'score')::numeric DESC) rn
        FROM jsonb_array_elements(base.meta->'rag') elem
        WHERE base.meta ? 'rag'
      ) sub ON true
      GROUP BY day
    )
    SELECT d.day, COALESCE(a.assistant_msgs,0) assistant_msgs, COALESCE(a.rag_msgs,0) rag_msgs, COALESCE(a.avg_top1_score,0) avg_top1_score
    FROM days d
    LEFT JOIN agg a ON d.day = a.day
    ORDER BY d.day`
    const trendRes = await query(trendSql, [])
    trend = trendRes.rows
  }
  return NextResponse.json({ ...body, range, trend })
}
