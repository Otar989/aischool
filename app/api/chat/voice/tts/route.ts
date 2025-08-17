import { type NextRequest, NextResponse } from "next/server"
import { requireAuth } from "@/lib/auth"
import { generateSpeech } from "@/lib/speech"
import { z } from "zod"

const ttsSchema = z.object({
  text: z.string().min(1).max(1000),
  voice: z.enum(["alloy", "echo", "fable", "onyx", "nova", "shimmer"]).optional().default("nova"),
})

export async function POST(request: NextRequest) {
  try {
    await requireAuth()
    const body = await request.json()
    const { text, voice } = ttsSchema.parse(body)

    const audioBuffer = await generateSpeech(text, voice)

    return new NextResponse(audioBuffer, {
      status: 200,
      headers: {
        "Content-Type": "audio/mpeg",
        "Content-Length": audioBuffer.byteLength.toString(),
      },
    })
  } catch (error) {
    console.error("Error generating speech:", error)
    return NextResponse.json({ error: "Failed to generate speech" }, { status: 500 })
  }
}
