import { NextRequest, NextResponse } from 'next/server'
import { supabaseAdmin } from '@/lib/supabaseAdmin'
import { requireAdmin } from '@/lib/admin'

export const runtime = 'edge'

export async function GET(req: NextRequest) {
  try {
    await requireAdmin(req)
    const { data, error } = await supabaseAdmin.from('course_materials')
      .select('id, course_id, title, kind, src')
      .is('indexed_at', null)
      .limit(200)
    if (error) throw error
    return NextResponse.json({ materials: data })
  } catch (e:any) {
    return NextResponse.json({ error: e.message }, { status: 400 })
  }
}

export async function POST(req: NextRequest) {
  try {
    await requireAdmin(req)
    const body = await req.json().catch(()=>({})) as any
    const ids: string[] = Array.isArray(body?.ids) ? body.ids : []
    if (!ids.length) return NextResponse.json({ error: 'no ids' }, { status: 400 })
    // Fire-and-forget sequential (simple). Could be parallel with Promise.allSettled (rate limits caution)
    const results: any[] = []
    for (const id of ids) {
      try {
        const res = await fetch(`${process.env.NEXT_PUBLIC_BASE_URL || ''}/api/materials/index`, { method: 'POST', headers: { 'Content-Type':'application/json' }, body: JSON.stringify({ materialId: id }) })
        const json = await res.json()
        results.push({ id, ok: res.ok, ...json })
      } catch (err:any) {
        results.push({ id, ok: false, error: err.message })
      }
    }
    return NextResponse.json({ results })
  } catch (e:any) {
    return NextResponse.json({ error: e.message }, { status: 400 })
  }
}