import OpenAI from "openai"
import { OPENAI_API_KEY, OPENAI_API_BASE_URL } from "./config"

interface ConversationMessage {
  role: "system" | "user" | "assistant"
  content: string
}

interface AIResponse {
  content: string
  tokensUsed: number
}

export async function generateAIResponse(
  conversationHistory: ConversationMessage[],
  lessonContext: string,
): Promise<AIResponse> {
  if (!OPENAI_API_KEY) {
    throw new Error("OPENAI_API_KEY is not configured")
  }

  const client = new OpenAI({ apiKey: OPENAI_API_KEY, baseURL: OPENAI_API_BASE_URL })

  try {
    const messages = [
      {
        role: "system" as const,
        content: `You are an AI tutor. Use the following lesson context to answer the student:\n${lessonContext}`,
      },
      ...conversationHistory,
    ]

    const completion = await client.chat.completions.create({
      model: "gpt-4o-mini",
      messages,
    })

    return {
      content: completion.choices[0]?.message?.content ?? "",
      tokensUsed: completion.usage?.total_tokens ?? 0,
    }
  } catch (error) {
    console.error("Error generating AI response:", error)
    return {
      content: "Извините, произошла техническая ошибка. Попробуйте задать вопрос еще раз.",
      tokensUsed: 0,
    }
  }
}

interface Question {
  id: string
  type: string
  prompt: string
  correct_answer?: string
  rubric_json?: Rubric
}

interface Rubric {
  points?: number
}

export async function gradeAnswer(question: Question, answer: string) {
  // Simulate grading delay
  await new Promise((resolve) => setTimeout(resolve, 1500))

  try {
    const rubric = question.rubric_json || {}
    const maxPoints = rubric.points || 100

    // Simple mock grading logic
    let score = 0
    let isCorrect = false
    let feedback = ""
    let suggestions: string[] = []

    if (question.correct_answer) {
      // Simple text similarity check
      const similarity = calculateSimilarity(answer.toLowerCase(), question.correct_answer.toLowerCase())
      score = Math.floor(similarity * maxPoints)
      isCorrect = score >= maxPoints * 0.7

      if (isCorrect) {
        feedback = "Отличный ответ! Вы правильно понимаете концепцию."
        suggestions = ["Попробуйте применить это знание в практических задачах"]
      } else if (score > maxPoints * 0.4) {
        feedback = "Хороший ответ, но есть неточности. Вы на правильном пути!"
        suggestions = ["Обратите внимание на ключевые термины", "Попробуйте быть более конкретным"]
      } else {
        feedback = "Ответ нуждается в доработке. Рекомендую повторить материал."
        suggestions = ["Перечитайте теоретическую часть", "Обратитесь за помощью к преподавателю"]
      }
    } else {
      // For open-ended questions, give random but reasonable scores
      score = Math.floor(Math.random() * 40) + 60 // 60-100 range
      isCorrect = score >= 70
      feedback = "Спасибо за развернутый ответ! Видно, что вы размышляете над темой."
      suggestions = ["Продолжайте в том же духе", "Попробуйте связать с практическими примерами"]
    }

    return {
      score,
      feedback,
      isCorrect,
      suggestions,
    }
  } catch (error) {
    console.error("Error grading answer:", error)
    return {
      score: 0,
      feedback: "Произошла ошибка при проверке ответа. Попробуйте еще раз.",
      isCorrect: false,
      suggestions: [],
    }
  }
}

// Simple text similarity function
function calculateSimilarity(str1: string, str2: string): number {
  const words1 = str1.split(/\s+/)
  const words2 = str2.split(/\s+/)

  let matches = 0
  words1.forEach((word) => {
    if (words2.some((w) => w.includes(word) || word.includes(w))) {
      matches++
    }
  })

  return matches / Math.max(words1.length, words2.length)
}
