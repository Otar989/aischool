import { NextRequest, NextResponse } from 'next/server'
import { supabaseAdmin } from '@/lib/supabaseAdmin'
import { z } from 'zod'
import { isAdminRequest } from '@/lib/admin'

export const runtime = 'edge'

const QuerySchema = z.object({
  lessonId: z.string().uuid().optional(),
  moduleId: z.string().uuid().optional(),
  kind: z.string().optional(),
  publishedOnly: z.coerce.boolean().optional().default(true)
})

export async function GET(req: NextRequest, { params }: { params: { courseId: string } }) {
  try {
    const { searchParams } = new URL(req.url)
    const parsed = QuerySchema.parse(Object.fromEntries(searchParams.entries()))
    const { courseId } = params

    let query = supabaseAdmin.from('course_materials').select('*').eq('course_id', courseId)

    if (parsed.lessonId) query = query.eq('lesson_id', parsed.lessonId)
    if (parsed.moduleId) query = query.eq('module_id', parsed.moduleId)
    if (parsed.kind) query = query.eq('kind', parsed.kind)
    if (parsed.publishedOnly && !isAdminRequest(req)) query = query.eq('is_published', true)

    const { data, error } = await query.order('position', { ascending: true })
    if (error) throw error

    return NextResponse.json({ materials: data })
  } catch (e:any) {
    return NextResponse.json({ error: e.message }, { status: 400 })
  }
}
