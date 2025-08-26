export const runtime = 'nodejs'
export const dynamic = 'force-dynamic'

import { NextResponse } from 'next/server'

export async function POST() {
  try {
    // Call generate 3 times if there are no published courses yet.
    const base = process.env.NEXT_PUBLIC_BASE_URL || 'http://localhost:3000'
    const existingResp = await fetch(base + '/api/courses/count', { cache: 'no-store' })
    let existing = 0
    if (existingResp.ok) {
      try { const js = await existingResp.json(); existing = js.count || 0 } catch {}
    }
    if (existing > 0) {
      return NextResponse.json({ skipped: true, reason: 'already_have_courses', count: existing })
    }
    const briefs = [
      'Практический курс по ChatGPT для ежедневной работы',
      'Интенсив по быстрому созданию MVP с AI инструментами',
      'Основы цифрового маркетинга с применением AI'
    ]
    const created: string[] = []
    for (const brief of briefs) {
      try {
        const r = await fetch(base + '/api/ai-courses/generate', { method: 'POST', headers: { 'content-type': 'application/json' }, body: JSON.stringify({ brief, lessonsCount: 5 }) })
        if (r.ok) {
          const js = await r.json()
            if (js.course_id) created.push(js.course_id)
        } else {
          console.warn('[ai-courses/seed] generate fail', await r.text())
        }
      } catch (e) {
        console.warn('[ai-courses/seed] generate error', e)
      }
    }
    return NextResponse.json({ course_ids: created })
  } catch (e: any) {
    return NextResponse.json({ error: 'seed_failed', message: e.message }, { status: 500 })
  }
}
