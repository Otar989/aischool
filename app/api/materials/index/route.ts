import { NextRequest, NextResponse } from 'next/server'
import { supabaseAdmin } from '@/lib/supabaseAdmin'
import { query } from '@/lib/db'
import { z } from 'zod'
import { requireAdmin } from '@/lib/admin'
import OpenAI from 'openai'

export const runtime = 'nodejs'

const schema = z.object({ materialId: z.string().uuid() })

export async function POST(req: NextRequest) {
  try {
  await requireAdmin(req)
    const body = await req.json()
    const { materialId } = schema.parse(body)
    // Fetch material + check already indexed
    const { data: mat, error } = await supabaseAdmin.from('course_materials').select('*').eq('id', materialId).single()
    if (error || !mat) throw new Error('material not found')
    if (mat.indexed_at) {
      return NextResponse.json({ ok: true, skipped: true, reason: 'already indexed', chunks: 0 })
    }
    if (!['pdf','markdown'].includes(mat.kind)) {
      return NextResponse.json({ skipped: true, reason: 'kind not indexable' })
    }

    let fullText = ''
    const bucket = process.env.SUPABASE_STORAGE_BUCKET_MATERIALS || 'materials'
    if (mat.kind === 'markdown') {
      const { data } = await supabaseAdmin.storage.from(bucket).download(mat.src)
      if (!data) throw new Error('md file not found')
      fullText = await data.text()
    } else if (mat.kind === 'pdf') {
      const { data } = await supabaseAdmin.storage.from(bucket).download(mat.src)
      if (!data) throw new Error('pdf file not found')
      let pdfParse: any
      try {
        pdfParse = await import('pdf-parse')
      } catch (err) {
        throw new Error('pdf-parse dependency not installed')
      }
      const buf = Buffer.from(await data.arrayBuffer())
      const parsed = await pdfParse.default(buf)
      fullText = parsed.text
    }

    const chunks: string[] = []
    const max = 1800
    let i = 0
    while (i < fullText.length) {
      const slice = fullText.slice(i, i + max)
      chunks.push(slice)
      i += max
    }

    const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY, baseURL: process.env.OPENAI_API_BASE_URL })
    const model = process.env.EMBEDDING_MODEL || 'text-embedding-3-small'

    const embedded: { chunk: string; embedding: number[] }[] = []
    // Batch embed in groups for efficiency (OpenAI supports multiple inputs)
    const batchSize = 10
    for (let start = 0; start < chunks.length; start += batchSize) {
      const slice = chunks.slice(start, start + batchSize).filter(c => c.trim())
      if (slice.length === 0) continue
      const emb = await openai.embeddings.create({ model, input: slice })
      emb.data.forEach((d, idx) => {
        embedded.push({ chunk: slice[idx], embedding: d.embedding as unknown as number[] })
      })
    }

    if (embedded.length) {
      // Construct multi-values insert with parameterization
      const values: string[] = []
      const params: any[] = []
      embedded.forEach((e, idx) => {
        params.push(materialId, e.chunk, JSON.stringify(e.embedding))
        const base = idx * 3
        values.push(`($${base+1}, $${base+2}, $${base+3})`)
      })
      await query(`INSERT INTO material_chunks (material_id, chunk, embedding) VALUES ${values.join(',')}` , params)
    }
    await query('UPDATE course_materials SET indexed_at = now() WHERE id = $1', [materialId])

    return NextResponse.json({ ok: true, chunks: embedded.length, skipped: false })
  } catch (e:any) {
    return NextResponse.json({ error: e.message }, { status: 400 })
  }
}
