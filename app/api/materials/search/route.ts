import { NextRequest, NextResponse } from 'next/server'
import { z } from 'zod'
import OpenAI from 'openai'
import { query } from '@/lib/db'
import { requireAdmin } from '@/lib/admin'

export const runtime = 'nodejs'

const schema = z.object({ q: z.string().min(1), limit: z.number().int().min(1).max(50).optional().default(5), course_id: z.string().uuid().optional() })

export async function POST(req: NextRequest) {
  try {
    await requireAdmin(req) // пока ограничим админам
    const body = await req.json()
    const { q, limit, course_id } = schema.parse(body)
    const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY, baseURL: process.env.OPENAI_API_BASE_URL })
    const model = process.env.EMBEDDING_MODEL || 'text-embedding-3-small'
    const emb = await openai.embeddings.create({ model, input: q })
    const vector = emb.data[0].embedding
    // cosine similarity = 1 - distance/2 if using L2 normalized, но vector extension имеет оператор <#> для cosine distance (или <=>). Предположим используем <-> для euclidean; упростим с inner product approximation если настроено. Используем cosine_distance(column,vector) если доступно иначе оператор <#>.
    const sql = course_id ?
      'SELECT mc.material_id, mc.chunk, 1 - (mc.embedding <#> $1::vector) AS score FROM material_chunks mc JOIN course_materials m ON mc.material_id = m.id WHERE m.course_id = $2 ORDER BY mc.embedding <#> $1::vector ASC LIMIT $3' :
      'SELECT mc.material_id, mc.chunk, 1 - (mc.embedding <#> $1::vector) AS score FROM material_chunks mc ORDER BY mc.embedding <#> $1::vector ASC LIMIT $2'
    const params = course_id ? [vector, course_id, limit] : [vector, limit]
    const res = await query(sql, params)
    return NextResponse.json({ results: res.rows })
  } catch (e:any) {
    return NextResponse.json({ error: e.message }, { status: 400 })
  }
}