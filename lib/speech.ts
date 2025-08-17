import { OPENAI_API_KEY, OPENAI_API_BASE_URL, OPENAI_TTS_MODEL, OPENAI_TTS_VOICE } from "./config"

export async function transcribeAudio(audioUrl: string): Promise<string> {
  if (!OPENAI_API_KEY) {
    throw new Error("OPENAI_API_KEY is not configured")
  }

  try {
    const audioResponse = await fetch(audioUrl)
    if (!audioResponse.ok) {
      throw new Error("Failed to fetch audio for transcription")
    }
    const audioBuffer = await audioResponse.arrayBuffer()
    const formData = new FormData()
    formData.append("file", new Blob([audioBuffer]), "audio.webm")
    formData.append("model", "gpt-4o-mini-transcribe")

    const response = await fetch(`${OPENAI_API_BASE_URL}/audio/transcriptions`, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${OPENAI_API_KEY}`,
      },
      body: formData,
    })

    if (!response.ok) {
      throw new Error(`Transcription failed: ${await response.text()}`)
    }

    const data = await response.json()
    return data.text as string
  } catch (error) {
    console.error("Error transcribing audio:", error)
    throw new Error("Failed to transcribe audio")
  }
}

export async function generateSpeech(text: string, voice = OPENAI_TTS_VOICE): Promise<ArrayBuffer> {
  if (!OPENAI_API_KEY) {
    throw new Error("OPENAI_API_KEY is not configured")
  }

  try {
    const response = await fetch(`${OPENAI_API_BASE_URL}/audio/speech`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${OPENAI_API_KEY}`,
      },
      body: JSON.stringify({
        model: OPENAI_TTS_MODEL,
        voice,
        input: text,
      }),
    })

    if (!response.ok) {
      throw new Error(`Failed to generate speech: ${await response.text()}`)
    }

    return await response.arrayBuffer()
  } catch (error) {
    console.error("Error generating speech:", error)
    throw new Error("Failed to generate speech")
  }
}
