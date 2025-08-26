// Lightweight server-side OpenAI client wrapper with safe fallback.
// We keep it minimal to avoid breaking build if key is absent.
import OpenAI from 'openai'

let client: OpenAI | null = null

export function openaiServer() {
  if (client) return client
  const key = process.env.OPENAI_API_KEY
  if (!key) {
    console.warn('[openaiServer] OPENAI_API_KEY not set – using stub (deterministic fallback)')
    // @ts-ignore create a tiny stub implementing needed subset
    // Provide a very small stub that imitates the method we use. We cast to any to bypass SDK private logic in offline mode.
    client = {
      chat: {
        completions: {
          create: async () => ({
            choices: [ { message: { role: 'assistant', content: JSON.stringify({ plan: { title: 'Demo AI Курс', description: 'Автогенерированный демо курс (OFFLINE MODE)', lessons: [ { title: 'Введение', kind: 'text', body: 'Добро пожаловать! Это демо контент.' }, { title: 'Практика', kind: 'practice', prompt: 'Опишите идею курса, которую хотите создать.' } ] } }) } } ]
          }) as any
        }
      }
    } as any
    return client
  }
  client = new OpenAI({ apiKey: key })
  return client
}
