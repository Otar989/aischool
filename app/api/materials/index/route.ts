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
    // Fetch material
    const { data: mat, error } = await supabaseAdmin.from('course_materials').select('*').eq('id', materialId).single()
    if (error || !mat) throw new Error('material not found')
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
    for (const c of chunks) {
      if (!c.trim()) continue
      const emb = await openai.embeddings.create({ model, input: c })
      embedded.push({ chunk: c, embedding: emb.data[0].embedding as unknown as number[] })
    }

    // Insert chunks
    for (const e of embedded) {
      await query('INSERT INTO material_chunks (material_id, chunk, embedding) VALUES ($1,$2,$3)', [materialId, e.chunk, JSON.stringify(e.embedding)])
    }

    return NextResponse.json({ ok: true, chunks: embedded.length })
  } catch (e:any) {
    return NextResponse.json({ error: e.message }, { status: 400 })
  }
}
