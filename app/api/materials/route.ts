import { NextRequest, NextResponse } from 'next/server'
import { supabaseAdmin } from '@/lib/supabaseAdmin'
import { requireAdmin } from '@/lib/admin'
import { z } from 'zod'

export const runtime = 'nodejs'

const createSchema = z.object({
  course_id: z.string().uuid(),
  module_id: z.string().uuid().optional().nullable(),
  lesson_id: z.string().uuid().optional().nullable(),
  kind: z.enum(['video','audio','pdf','image','markdown','link','download']),
  title: z.string().min(1),
  description: z.string().optional().nullable(),
  src: z.string().min(1),
  meta: z.any().optional(),
  is_public: z.boolean().optional().default(false),
  position: z.number().int().min(0).optional().default(0)
})

const updateSchema = createSchema.partial().extend({ id: z.string().uuid() })

export async function POST(req: NextRequest) {
  try {
    await requireAdmin(req)
    const body = await req.json()
    const data = createSchema.parse(body)
    const { error, data: inserted } = await supabaseAdmin.from('course_materials').insert(data).select('*').single()
    if (error) throw error
    return NextResponse.json({ material: inserted })
  } catch (e:any) {
    return NextResponse.json({ error: e.message }, { status: 400 })
  }
}

export async function PATCH(req: NextRequest) {
  try {
    await requireAdmin(req)
    const body = await req.json()
    const data = updateSchema.parse(body)
    const id = data.id
    const updates = { ...data }
    delete (updates as any).id
    const { error, data: updated } = await supabaseAdmin.from('course_materials').update(updates).eq('id', id).select('*').single()
    if (error) throw error
    return NextResponse.json({ material: updated })
  } catch (e:any) {
    return NextResponse.json({ error: e.message }, { status: 400 })
  }
}

export async function DELETE(req: NextRequest) {
  try {
    await requireAdmin(req)
    const { searchParams } = new URL(req.url)
    const id = searchParams.get('id')
    if (!id) throw new Error('missing id')
    const { error } = await supabaseAdmin.from('course_materials').delete().eq('id', id)
    if (error) throw error
    return NextResponse.json({ ok: true })
  } catch (e:any) {
    return NextResponse.json({ error: e.message }, { status: 400 })
  }
}

export async function GET(req: NextRequest) {
  try {
    await requireAdmin(req)
    const { searchParams } = new URL(req.url)
    const id = searchParams.get('id')
    if (id) {
      const { data, error } = await supabaseAdmin.from('course_materials').select('*').eq('id', id).single()
      if (error) throw error
      return NextResponse.json({ material: data })
    }
    const courseId = searchParams.get('course_id')
    let query = supabaseAdmin.from('course_materials').select('*')
    if (courseId) query = query.eq('course_id', courseId)
    const { data, error } = await query.order('created_at', { ascending: false }).limit(200)
    if (error) throw error
    return NextResponse.json({ materials: data })
  } catch (e:any) {
    return NextResponse.json({ error: e.message }, { status: 400 })
  }
}