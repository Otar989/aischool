import { openai } from "@ai-sdk/openai"
import { generateText } from "ai"

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
  try {
    const systemPrompt = `Вы ИИ-наставник для онлайн-школы. Ваша роль:

1. Будьте дружелюбным, но строгим преподавателем
2. Помогайте студенту понять материал, не давая готовые ответы сразу
3. Задавайте наводящие вопросы
4. Адаптируйтесь под уровень студента
5. Если студент делает ошибки 2+ раза, упрощайте объяснения
6. Если студент отвечает правильно 3+ раза подряд, усложняйте вопросы
7. В конце урока дайте 3 ключевых вывода + 1 действие

Контекст урока:
${lessonContext}

Отвечайте на русском языке. Будьте краткими, но информативными.`

    const messages = [
      { role: "system" as const, content: systemPrompt },
      ...conversationHistory.slice(-10), // Keep last 10 messages for context
    ]

    const { text, usage } = await generateText({
      model: openai("gpt-4o-mini"),
      messages,
      maxTokens: 500,
      temperature: 0.7,
    })

    return {
      content: text,
      tokensUsed: usage?.totalTokens || 0,
    }
  } catch (error) {
    console.error("Error generating AI response:", error)
    throw new Error("Failed to generate AI response")
  }
}

interface Question {
  id: string
  type: string
  prompt: string
  correct_answer?: string
  rubric_json?: any
}

export async function gradeAnswer(question: Question, answer: string) {
  try {
    const rubric = question.rubric_json || {}
    const maxPoints = rubric.points || 100

    const gradingPrompt = `Оцените ответ студента на вопрос.

Вопрос: ${question.prompt}
Ответ студента: ${answer}
Правильный ответ (если есть): ${question.correct_answer || "Не указан"}
Критерии оценки: ${JSON.stringify(rubric)}

Дайте оценку от 0 до ${maxPoints} баллов и подробную обратную связь на русском языке.
Объясните, что правильно, что можно улучшить, и дайте конкретные рекомендации.

Ответьте в формате JSON:
{
  "score": число от 0 до ${maxPoints},
  "feedback": "подробная обратная связь",
  "isCorrect": true/false,
  "suggestions": ["совет 1", "совет 2"]
}`

    const { text } = await generateText({
      model: openai("gpt-4o-mini"),
      messages: [{ role: "user", content: gradingPrompt }],
      maxTokens: 300,
      temperature: 0.3,
    })

    const result = JSON.parse(text)
    return {
      score: result.score,
      feedback: result.feedback,
      isCorrect: result.score >= maxPoints * 0.7, // 70% threshold
      suggestions: result.suggestions || [],
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
