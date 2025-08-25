import { NextRequest } from 'next/server'
import { requireAuth } from '@/lib/auth'
import { rl } from '@/lib/ratelimit'
import { query } from '@/lib/db'
import OpenAI from 'openai'
import { getEmbeddingFromCache, setEmbeddingCache } from '@/lib/ragCache'
import { supabaseAdmin } from '@/lib/supabaseAdmin'
import { z } from 'zod'

const bodySchema = z.object({
  sessionId: z.string().uuid(),
  lessonId: z.string(),
  message: z.string().min(1)
})

export const runtime = 'nodejs'

export async function POST(req: NextRequest) {
  try {
    const user = await requireAuth()

    const { success, pending, limit, reset } = await rl.limit(`lesson-chat:${user.id}`)
    if (!success) {
      return new Response('Rate limit exceeded', { status: 429, headers: { 'Retry-After': Math.max(0, reset - Date.now()).toString() } })
    }

    const json = await req.json()
    const { lessonId, sessionId, message } = bodySchema.parse(json)

    // validate session ownership & lesson consistency
    const sessionRes = await query('SELECT id, user_id, lesson_id FROM chat_sessions WHERE id = $1 LIMIT 1', [sessionId])
    if (sessionRes.rows.length === 0 || sessionRes.rows[0].user_id !== user.id) {
      return new Response('Session not found', { status: 404 })
    }
    if (sessionRes.rows[0].lesson_id && sessionRes.rows[0].lesson_id !== lessonId) {
      return new Response('Lesson mismatch', { status: 400 })
    }

  const lessonRes = await query('SELECT title, content_md, course_id FROM lessons WHERE id = $1 LIMIT 1', [lessonId])
    if (lessonRes.rows.length === 0) {
      return new Response('Lesson not found', { status: 404 })
    }
  const { title, content_md, course_id } = lessonRes.rows[0]

    // === RAG: поиск релевантных материалов по сообщению пользователя ===
  let ragText = ''
  let ragDocs: { chunk: string; score: number; material_id?: string }[] = []
    try {
      if (message.length > 5) {
        const embModel = process.env.EMBEDDING_MODEL || 'text-embedding-3-small'
        // 10 минут TTL
        const TTL = 10 * 60 * 1000
        let vector = getEmbeddingFromCache(message, TTL)
        if (!vector) {
          const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY, baseURL: process.env.OPENAI_API_BASE_URL })
          const emb = await openai.embeddings.create({ model: embModel, input: message })
          vector = emb.data[0].embedding
          setEmbeddingCache(message, vector)
        }
        const ragRes = await query(
          'SELECT mc.material_id, mc.chunk, 1 - (mc.embedding <#> $1::vector) AS score FROM material_chunks mc JOIN course_materials m ON mc.material_id = m.id WHERE m.course_id = $2 ORDER BY mc.embedding <#> $1::vector ASC LIMIT 5',
          [vector, course_id]
        )
        ragDocs = ragRes.rows.map((r:any)=> ({ chunk: r.chunk, score: Number(r.score), material_id: r.material_id }))
        ragText = ragDocs.map((r,i)=>`[DOC${i+1} score=${r.score.toFixed(3)}]\n${r.chunk}`).join('\n\n')
      }
    } catch (e) {
      console.error('RAG fetch failed', e)
    }

    const systemPrompt = `You are an AI tutor. Help the student understand the lesson. Lesson title: ${title}. Use only information from lesson or the provided supplemental documents when relevant and answer in Russian. If unsure, ask for clarification. Keep answers concise.`
    const context = (content_md || '').toString().slice(0, 8000) + (ragText ? `\n\nSupplemental Docs:\n${ragText}` : '')

    const openaiKey = process.env.OPENAI_API_KEY
    if (!openaiKey) {
      return new Response('OPENAI_API_KEY not configured', { status: 500 })
    }

    const client = new OpenAI({ apiKey: openaiKey, baseURL: process.env.OPENAI_API_BASE_URL })

    // Persist user message first
    const userTokens = estimateTokens(message)
    await query(
      `INSERT INTO chat_messages (session_id, user_id, lesson_id, role, modality, content_text, tokens_used, created_at)
       VALUES ($1,$2,$3,'user','text',$4,$5,NOW())`,
      [sessionId, user.id, lessonId, message, userTokens]
    )

    // Load last N messages from DB to build history
    const historyRes = await query(
      `SELECT role, content_text FROM chat_messages WHERE session_id = $1 ORDER BY created_at ASC LIMIT 50`,
      [sessionId]
    )
  const trimmed = historyRes.rows.map((r: any) => ({ role: (r.role === 'system' ? 'system' : r.role === 'assistant' ? 'assistant' : 'user') as 'user' | 'assistant' | 'system', content: r.content_text }))
    const chatMessages: OpenAI.Chat.ChatCompletionMessageParam[] = [
      { role: 'system', content: systemPrompt + '\n\nLesson Content (truncated):\n' + context },
      ...trimmed
    ]

    const completion = await client.chat.completions.create({
      model: 'gpt-4o-mini',
      stream: true,
      messages: chatMessages,
    })

    const encoder = new TextEncoder()

  let fullResponse = ''

    const stream = new ReadableStream<Uint8Array>({
      async start(controller) {
        try {
          for await (const part of completion) {
            const delta = part.choices[0]?.delta?.content || ''
            if (delta) {
              fullResponse += delta
              controller.enqueue(encoder.encode(delta))
            }
          }
        } catch (err: any) {
          console.error('Streaming error:', err)
          controller.enqueue(encoder.encode('\n[Ошибка генерации ответа]'))
        } finally {
          controller.close()
          // Save assistant message & best-effort update tokens
          try {
            const assistantTokens = estimateTokens(fullResponse)
            await query(
              `INSERT INTO chat_messages (session_id, user_id, lesson_id, role, modality, content_text, tokens_used, created_at, meta)
               VALUES ($1,$2,$3,'assistant','text',$4,$5,NOW(), $6::jsonb)`,
              [sessionId, user.id, lessonId, fullResponse, assistantTokens, JSON.stringify({ rag: ragDocs })]
            )
            // Optional: update aggregate if column exists
            try { await query(`UPDATE chat_sessions SET total_tokens = COALESCE(total_tokens,0) + $1 WHERE id = $2`, [userTokens + assistantTokens, sessionId]) } catch {}
          } catch (e) {
            console.error('Persist assistant failed', e)
          }
        }
      }
    })

    return new Response(stream, {
      headers: {
        'Content-Type': 'text/plain; charset=utf-8',
        'X-RateLimit-Limit': limit.toString(),
        'X-RateLimit-Remaining': pending.toString(),
      }
    })
  } catch (e: any) {
    console.error('lesson-chat endpoint error', e)
    return new Response('Internal error', { status: 500 })
  }
}

function estimateTokens(text: string): number {
  return Math.ceil(text.length / 4)
}
