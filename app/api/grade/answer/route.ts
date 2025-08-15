import { type NextRequest, NextResponse } from "next/server"
import { requireAuth } from "@/lib/auth"
import { query } from "@/lib/db"
import { gradeAnswer } from "@/lib/ai"
import { z } from "zod"

const gradeSchema = z.object({
  questionId: z.string().uuid(),
  answer: z.string().min(1),
})

export async function POST(request: NextRequest) {
  try {
    const user = await requireAuth()
    const body = await request.json()
    const { questionId, answer } = gradeSchema.parse(body)

    // Get question details
    const questionResult = await query(
      `SELECT q.*, l.course_id 
       FROM questions q 
       JOIN lessons l ON q.lesson_id = l.id 
       WHERE q.id = $1`,
      [questionId],
    )

    if (questionResult.rows.length === 0) {
      return NextResponse.json({ error: "Question not found" }, { status: 404 })
    }

    const question = questionResult.rows[0]

    // Check if user has access to the course
    const hasAccess = await checkCourseAccess(user.id, question.course_id)
    if (!hasAccess) {
      return NextResponse.json({ error: "Access denied" }, { status: 403 })
    }

    let result

    if (question.type === "multiple_choice") {
      // Simple comparison for multiple choice
      const isCorrect = answer.trim() === question.correct_answer?.trim()
      result = {
        isCorrect,
        score: isCorrect ? 100 : 0,
        feedback: isCorrect
          ? "Правильно! Отличная работа."
          : `Неправильно. Правильный ответ: ${question.correct_answer}`,
        explanation: question.rubric_json?.explanation || "",
      }
    } else {
      // Use AI for grading short answers and case studies
      result = await gradeAnswer(question, answer)
    }

    // Save the attempt
    await query(
      `INSERT INTO user_answers (user_id, question_id, answer_text, score, feedback, created_at) 
       VALUES ($1, $2, $3, $4, $5, NOW())
       ON CONFLICT (user_id, question_id) 
       DO UPDATE SET answer_text = $3, score = $4, feedback = $5, created_at = NOW()`,
      [user.id, questionId, answer, result.score, result.feedback],
    )

    return NextResponse.json(result)
  } catch (error) {
    console.error("Error grading answer:", error)
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
