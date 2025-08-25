import { NextResponse } from 'next/server'
import { query } from '@/lib/db'
export const runtime = 'nodejs'

export async function GET() {
  try {
    const r = await query('SELECT COUNT(*)::int AS c FROM courses WHERE is_published = true')
    return NextResponse.json({ count: r.rows[0].c })
  } catch (e:any) {
    return NextResponse.json({ error: e.message }, { status: 500 })
  }
}
