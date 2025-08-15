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

    // Check if user has access to the course
    const hasAccess = await checkCourseAccess(user.id, courseId)
    if (!hasAccess) {
      return NextResponse.json({ error: "Access denied" }, { status: 403 })
    }

    // Create new chat session
    const result = await query(
      `INSERT INTO chat_sessions (user_id, course_id, lesson_id, started_at)
       VALUES ($1, $2, $3, NOW())
       RETURNING id, started_at`,
      [user.id, courseId, lessonId],
    )

    if (result.rows.length === 0) {
      return NextResponse.json({ error: "Failed to create chat session" }, { status: 500 })
    }

    const session = result.rows[0]

    // Add initial system message
    await query(
      `INSERT INTO chat_messages (session_id, role, content_text, created_at) 
       VALUES ($1, $2, $3, NOW())`,
      [
        session.id,
        "system",
        `Вы ИИ-наставник для урока. Ведите диалог дружелюбно, но строго. Помогайте студенту изучать материал, задавайте наводящие вопросы, не давайте готовые ответы сразу.`,
      ],
    )

    // Add welcome message
    await query(
      `INSERT INTO chat_messages (session_id, role, content_text, created_at) 
       VALUES ($1, $2, $3, NOW())`,
      [
        session.id,
        "assistant",
        `Привет! Я ваш ИИ-наставник. Готовы изучать новый материал? Если у вас есть вопросы по уроку, смело задавайте их!`,
      ],
    )

    return NextResponse.json({
      sessionId: session.id,
      startedAt: session.started_at,
    })
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
