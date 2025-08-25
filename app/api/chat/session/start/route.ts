import { type NextRequest, NextResponse } from "next/server"
import { requireAuth } from "@/lib/auth"
import { query } from "@/lib/db"
import { z } from "zod"

const startSessionSchema = z.object({
  courseId: z.string().uuid(),
  lessonId: z.string().uuid(),
})

export async function POST(request: NextRequest) {
  try {
    const user = await requireAuth()
    const body = await request.json()
    const { courseId, lessonId } = startSessionSchema.parse(body)

    // 1. Access check
    const hasAccess = await checkCourseAccess(user.id, courseId)
    if (!hasAccess) {
      return NextResponse.json({ error: "Access denied" }, { status: 403 })
    }

    // 2. Try to find existing session for this lesson
    const existing = await query(
      `SELECT id, started_at FROM chat_sessions
       WHERE user_id = $1 AND lesson_id = $2
       ORDER BY started_at DESC
       LIMIT 1`,
      [user.id, lessonId],
    )

    let sessionId: string
    let startedAt: string
    if (existing.rows.length > 0) {
      sessionId = existing.rows[0].id
      startedAt = existing.rows[0].started_at
    } else {
      // 3. Create new session
      const createRes = await query(
        `INSERT INTO chat_sessions (user_id, course_id, lesson_id, started_at)
         VALUES ($1,$2,$3,NOW())
         RETURNING id, started_at`,
        [user.id, courseId, lessonId],
      )
      if (createRes.rows.length === 0) {
        return NextResponse.json({ error: "Failed to create chat session" }, { status: 500 })
      }
      sessionId = createRes.rows[0].id
      startedAt = createRes.rows[0].started_at

      // Seed system + greeting messages
      const systemContent = `Вы ИИ-наставник для урока. Ведите диалог дружелюбно, но строго. Помогайте студенту изучать материал, задавайте наводящие вопросы, не давайте готовые ответы сразу.`
      const greetContent = `Привет! Я ваш ИИ-наставник. Готовы изучать новый материал? Если у вас есть вопросы по уроку, смело задавайте их!`

      await query(
        `INSERT INTO chat_messages (session_id, user_id, lesson_id, role, modality, content_text, tokens_used, created_at)
         VALUES ($1,$2,$3,'system','text',$4,$5,NOW()),
                ($1,$2,$3,'assistant','text',$6,$7,NOW())`,
        [
          sessionId,
          user.id,
          lessonId,
          systemContent,
          estimateTokens(systemContent),
          greetContent,
          estimateTokens(greetContent),
        ],
      )
    }

    // 4. Load history (without system if want cleaner UI, but оставим все — фильтрует клиент)
    const historyRes = await query(
      `SELECT role, content_text, created_at FROM chat_messages
       WHERE session_id = $1
       ORDER BY created_at ASC
       LIMIT 100`,
      [sessionId],
    )
    const messages = historyRes.rows.map((r) => ({
      role: r.role,
      content: r.content_text,
      createdAt: r.created_at,
    }))

    return NextResponse.json({ sessionId, startedAt, messages })
  } catch (error) {
    console.error("Error starting chat session:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}

async function checkCourseAccess(userId: string, courseId: string): Promise<boolean> {
  // Check if user has active subscription
  const subscriptionResult = await query(
    "SELECT id FROM subscriptions WHERE user_id = $1 AND status = $2 AND current_period_end > NOW()",
    [userId, "active"],
  )

  if (subscriptionResult.rows.length > 0) {
    return true
  }

  // Check if user purchased the course
  const enrollmentResult = await query("SELECT id FROM enrollments WHERE user_id = $1 AND course_id = $2", [
    userId,
    courseId,
  ])

  return enrollmentResult.rows.length > 0
}

function estimateTokens(text: string): number {
  // Rough estimation: 1 token ≈ 4 characters for Russian text
  return Math.ceil(text.length / 4)
}
