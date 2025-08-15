import { openai } from "@ai-sdk/openai"

export async function transcribeAudio(audioUrl: string): Promise<string> {
  try {
    // Fetch audio file
    const response = await fetch(audioUrl)
    if (!response.ok) {
      throw new Error("Failed to fetch audio file")
    }

    const audioBuffer = await response.arrayBuffer()
    const audioFile = new File([audioBuffer], "audio.webm", { type: "audio/webm" })

    // Use OpenAI Whisper for transcription
    const transcription = await openai.audio.transcriptions.create({
      file: audioFile,
      model: "whisper-1",
      language: "ru", // Russian language
    })

    return transcription.text
  } catch (error) {
    console.error("Error transcribing audio:", error)
    throw new Error("Failed to transcribe audio")
  }
}

export async function generateSpeech(text: string, voice = "nova"): Promise<string> {
  try {
    const response = await openai.audio.speech.create({
      model: "tts-1",
      voice: voice as any,
      input: text,
    })

    const audioBuffer = await response.arrayBuffer()

    // In a real app, you would upload this to your storage service
    // For now, we'll create a blob URL (this is temporary and won't persist)
    const blob = new Blob([audioBuffer], { type: "audio/mpeg" })
    const audioUrl = URL.createObjectURL(blob)

    return audioUrl
  } catch (error) {
    console.error("Error generating speech:", error)
    throw new Error("Failed to generate speech")
  }
}
