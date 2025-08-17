import OpenAI from "openai"

const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY })

export async function transcribeAudio(audio: File | Blob): Promise<string> {
  const controller = new AbortController()
  const timeout = setTimeout(() => controller.abort(), 10 * 60 * 1000)
  try {
    const transcription = await openai.audio.transcriptions.create({
      file: audio,
      model: "whisper-1",
      signal: controller.signal,
    })
    return transcription.text
  } catch (error) {
    console.error("Error transcribing audio:", error)
    throw new Error("Failed to transcribe audio")
  } finally {
    clearTimeout(timeout)
  }
}

export async function generateSpeech(
  text: string,
  voice = "nova",
): Promise<Buffer> {
  const controller = new AbortController()
  const timeout = setTimeout(() => controller.abort(), 10 * 60 * 1000)
  try {
    const speech = await openai.audio.speech.create({
      model: "gpt-4o-mini-tts",
      voice,
      input: text,
      signal: controller.signal,
    })
    const buffer = Buffer.from(await speech.arrayBuffer())
    return buffer
  } catch (error) {
    console.error("Error generating speech:", error)
    throw new Error("Failed to generate speech")
  } finally {
    clearTimeout(timeout)
  }
}
