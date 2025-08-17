const isServer = typeof window === 'undefined'

export const OPENAI_API_KEY = isServer
  ? process.env.OPENAI_API_KEY
  : undefined

export const OPENAI_API_BASE_URL =
  process.env.OPENAI_API_BASE_URL ?? 'https://api.openai.com/v1'

export const OPENAI_TTS_MODEL =
  process.env.NEXT_PUBLIC_OPENAI_TTS_MODEL ?? process.env.OPENAI_TTS_MODEL ?? 'gpt-4o-mini-tts'

export const OPENAI_TTS_VOICE =
  process.env.NEXT_PUBLIC_OPENAI_TTS_VOICE ?? process.env.OPENAI_TTS_VOICE ?? 'nova'
