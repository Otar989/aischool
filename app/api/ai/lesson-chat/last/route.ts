import { NextRequest, NextResponse } from 'next/server'
import { requireAuth } from '@/lib/auth'
import { query } from '@/lib/db'
import { z } from 'zod'

export const runtime = 'nodejs'

const schema = z.object({ sessionId: z.string().uuid() })

export async function GET(req: NextRequest) {
  try {
    const user = await requireAuth()
    const { searchParams } = new URL(req.url)
    const sessionId = searchParams.get('sessionId')
    if (!sessionId) return NextResponse.json({ error: 'sessionId required' }, { status: 400 })
    const { sessionId: sid } = schema.parse({ sessionId })

    // verify ownership
    const own = await query('SELECT id FROM chat_sessions WHERE id = $1 AND user_id = $2 LIMIT 1', [sid, user.id])
    if (own.rows.length === 0) return NextResponse.json({ error: 'not found' }, { status: 404 })

    const res = await query(
      `SELECT id, role, content_text, meta, created_at FROM chat_messages 
       WHERE session_id = $1 AND role = 'assistant' ORDER BY created_at DESC LIMIT 1`,
      [sid]
    )
    if (res.rows.length === 0) return NextResponse.json({ message: null })
    return NextResponse.json({ message: res.rows[0] })
  } catch (e: any) {
    return NextResponse.json({ error: e.message }, { status: 400 })
  }
}
