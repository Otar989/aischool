import { type NextRequest, NextResponse } from "next/server"
import { requireAuth } from "@/lib/auth"
import { query } from "@/lib/db"
import { generateAIResponse } from "@/lib/ai"
import { transcribeAudio } from "@/lib/speech"
import { z } from "zod"

const messageSchema = z.object({
  sessionId: z.string().uuid(),
  text: z.string().optional(),
  audioUrl: z.string().url().optional(),
})

export async function POST(request: NextRequest) {
  try {
    const user = await requireAuth()
    const body = await request.json()
    const { sessionId, text, audioUrl } = messageSchema.parse(body)

    // Verify session belongs to user
    const sessionResult = await query("SELECT * FROM chat_sessions WHERE id = $1 AND user_id = $2", [
      sessionId,
      user.id,
    ])

    if (sessionResult.rows.length === 0) {
      return NextResponse.json({ error: "Session not found" }, { status: 404 })
    }

    const session = sessionResult.rows[0]

    // Check session limits
    const messageCount = await query("SELECT COUNT(*) FROM chat_messages WHERE session_id = $1 AND role = 'user'", [
      sessionId,
    ])

    const userMessageCount =
      messageCount.rows.length > 0 ? Number.parseInt(messageCount.rows[0].count) : 0
    const maxMessages = Number.parseInt(process.env.MAX_MESSAGES_PER_LESSON || "50")
    const maxTokens = Number.parseInt(process.env.MAX_TOKENS_PER_LESSON || "100000")

    if (userMessageCount >= maxMessages) {
      return NextResponse.json({ error: "Message limit reached for this lesson" }, { status: 429 })
    }

    if (session.total_tokens >= maxTokens) {
      return NextResponse.json({ error: "Token limit reached for this lesson" }, { status: 429 })
    }

    let messageText = text
    let modality = "text"

    // If audio URL provided, transcribe it
    if (audioUrl) {
      try {
        messageText = await transcribeAudio(audioUrl)
        modality = "voice"
      } catch (error) {
        console.error("Transcription error:", error)
        return NextResponse.json({ error: "Failed to transcribe audio" }, { status: 400 })
      }
    }

    if (!messageText?.trim()) {
      return NextResponse.json({ error: "Message content is required" }, { status: 400 })
    }

    const promptTokens = estimateTokens(messageText)

    // Save user message
    await query(
      `INSERT INTO chat_messages (session_id, role, modality, content_text, tokens_used, created_at)
       VALUES ($1, $2, $3, $4, $5, NOW())`,
      [sessionId, "user", modality, messageText, promptTokens],
    )

    if (session.total_tokens + promptTokens >= maxTokens) {
      return NextResponse.json({ error: "Token limit reached for this lesson" }, { status: 429 })
    }

    // Get conversation history
    const historyResult = await query(
      `SELECT role, content_text FROM chat_messages 
       WHERE session_id = $1 
       ORDER BY created_at ASC`,
      [sessionId],
    )

    const conversationHistory = historyResult.rows.map((row) => ({
      role: row.role,
      content: row.content_text,
    }))

    // Get lesson context for RAG
    const lessonContext = await getLessonContext(session.lesson_id)

    // Generate AI response
    let aiResponse
    try {
      aiResponse = await generateAIResponse(conversationHistory, lessonContext)
    } catch (error: any) {
      console.error("AI response error:", error)
      if (error?.status === 429) {
        return NextResponse.json({ error: "AI rate limit exceeded" }, { status: 429 })
      }
      return NextResponse.json({ error: "Failed to generate AI response" }, { status: 500 })
    }

    if (session.total_tokens + aiResponse.tokensUsed > maxTokens) {
      return NextResponse.json({ error: "Token limit reached for this lesson" }, { status: 429 })
    }

    // Save AI response
    await query(
      `INSERT INTO chat_messages (session_id, role, modality, content_text, tokens_used, created_at) 
       VALUES ($1, $2, $3, $4, $5, NOW())`,
      [sessionId, "assistant", "text", aiResponse.content, aiResponse.tokensUsed],
    )

    // Update session token count
    await query(
      `UPDATE chat_sessions
       SET total_tokens = total_tokens + $1
       WHERE id = $2`,
      [aiResponse.tokensUsed, sessionId],
    )

    return NextResponse.json({
      message: {
        role: "assistant",
        content: aiResponse.content,
        timestamp: new Date().toISOString(),
      },
      tokensUsed: aiResponse.tokensUsed,
    })
  } catch (error) {
    console.error("Error processing chat message:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}

async function getLessonContext(lessonId: string) {
  const lessonResult = await query("SELECT title, content_md FROM lessons WHERE id = $1", [lessonId])

  if (lessonResult.rows.length === 0) {
    return ""
  }

  const lesson = lessonResult.rows[0]
  return `Урок: ${lesson.title}\n\nМатериал урока:\n${lesson.content_md}`
}

function estimateTokens(text: string): number {
  // Rough estimation: 1 token ≈ 4 characters for Russian text
  return Math.ceil(text.length / 4)
}
