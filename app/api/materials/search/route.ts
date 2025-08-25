import { NextRequest, NextResponse } from 'next/server'
import { z } from 'zod'
import OpenAI from 'openai'
import { getEmbeddingFromCache, setEmbeddingCache } from '@/lib/ragCache'
import { query } from '@/lib/db'
import { isAdminRequest } from '@/lib/admin'
import { cookies } from 'next/headers'
import { embeddingsRl } from '@/lib/ratelimit'

export const runtime = 'nodejs'

const schema = z.object({ q: z.string().min(1), limit: z.number().int().min(1).max(50).optional().default(5), course_id: z.string().uuid().optional() })

export async function POST(req: NextRequest) {
  try {
  const body = await req.json()
  const { q, limit, course_id } = schema.parse(body)
  const admin = await isAdminRequest(req)
  const hasPromo = !!cookies().get('promo_session')?.value
    const model = process.env.EMBEDDING_MODEL || 'text-embedding-3-small'
    const TTL = 10 * 60 * 1000
    let vector = getEmbeddingFromCache(q, TTL)
    if (!vector) {
      const embLimit = await embeddingsRl.limit(`emb-search:${admin? 'admin': hasPromo? 'promo':'pub'}:${q.slice(0,32)}`)
      if (!embLimit.success) throw new Error('rate limited')
      const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY, baseURL: process.env.OPENAI_API_BASE_URL })
      const emb = await openai.embeddings.create({ model, input: q })
      vector = emb.data[0].embedding
      setEmbeddingCache(q, vector)
    }
    // cosine similarity = 1 - distance/2 if using L2 normalized, но vector extension имеет оператор <#> для cosine distance (или <=>). Предположим используем <-> для euclidean; упростим с inner product approximation если настроено. Используем cosine_distance(column,vector) если доступно иначе оператор <#>.
    let sql: string
    let params: any[]
    if (course_id) {
      if (admin || hasPromo) {
        sql = 'SELECT mc.material_id, mc.chunk, 1 - (mc.embedding <#> $1::vector) AS score FROM material_chunks mc JOIN course_materials m ON mc.material_id = m.id WHERE m.course_id = $2 ORDER BY mc.embedding <#> $1::vector ASC LIMIT $3'
        params = [vector, course_id, limit]
      } else {
        sql = 'SELECT mc.material_id, mc.chunk, 1 - (mc.embedding <#> $1::vector) AS score FROM material_chunks mc JOIN course_materials m ON mc.material_id = m.id WHERE m.course_id = $2 AND m.is_public = true ORDER BY mc.embedding <#> $1::vector ASC LIMIT $3'
        params = [vector, course_id, limit]
      }
    } else {
      if (admin || hasPromo) {
        sql = 'SELECT mc.material_id, mc.chunk, 1 - (mc.embedding <#> $1::vector) AS score FROM material_chunks mc ORDER BY mc.embedding <#> $1::vector ASC LIMIT $2'
        params = [vector, limit]
      } else {
        sql = 'SELECT mc.material_id, mc.chunk, 1 - (mc.embedding <#> $1::vector) AS score FROM material_chunks mc JOIN course_materials m ON mc.material_id = m.id WHERE m.is_public = true ORDER BY mc.embedding <#> $1::vector ASC LIMIT $2'
        params = [vector, limit]
      }
    }
    const res = await query(sql, params)
    return NextResponse.json({ results: res.rows, admin })
  } catch (e:any) {
    return NextResponse.json({ error: e.message }, { status: 400 })
  }
}