import { NextRequest, NextResponse } from 'next/server'
import { supabaseAdmin } from '@/lib/supabaseAdmin'
import { z } from 'zod'
import { requireAdmin } from '@/lib/admin'

export const runtime = 'nodejs'

const schema = z.object({
  filename: z.string().min(1),
  contentType: z.string().min(1),
  courseId: z.string().uuid().optional(),
  path: z.string().optional()
})

export async function POST(req: NextRequest) {
  try {
    requireAdmin(req)
    const body = await req.json()
    const { filename, contentType, courseId, path } = schema.parse(body)
    const bucket = process.env.SUPABASE_STORAGE_BUCKET_MATERIALS || 'materials'
    const key = path || (courseId ? `${courseId}/${Date.now()}-${filename}` : `${Date.now()}-${filename}`)

    // Создаём пустой объект (0 bytes) чтобы получить подписанный URL PUT не обязателен (Supabase SDK не даёт прямой signed PUT, используем upload + signed download)
    const filePath = key
    const { error } = await supabaseAdmin.storage.from(bucket).upload(filePath, new Blob([new Uint8Array()]), { contentType, upsert: false })
    if (error && !error.message.includes('already exists')) throw error
    const { data: signed } = await supabaseAdmin.storage.from(bucket).createSignedUploadUrl(filePath)
    if (!signed) throw new Error('failed to sign upload url')

    return NextResponse.json({ path: filePath, url: signed.signedUrl, token: signed.token })
  } catch (e:any) {
    return NextResponse.json({ error: e.message }, { status: 400 })
  }
}
