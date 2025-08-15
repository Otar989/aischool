import { type NextRequest, NextResponse } from "next/server"
import { requireAuth } from "@/lib/auth"
import { query } from "@/lib/db"

export async function POST(request: NextRequest) {
  try {
    const user = await requireAuth()
    const formData = await request.formData()
    const audioFile = formData.get("audio") as File

    if (!audioFile) {
      return NextResponse.json({ error: "No audio file provided" }, { status: 400 })
    }

    // Validate file type
    if (!audioFile.type.startsWith("audio/")) {
      return NextResponse.json({ error: "Invalid file type" }, { status: 400 })
    }

    // Validate file size (max 10MB)
    const maxSize = 10 * 1024 * 1024
    if (audioFile.size > maxSize) {
      return NextResponse.json({ error: "File too large" }, { status: 400 })
    }

    // In a real app, you would upload to your storage service (S3, etc.)
    // For now, we'll create a temporary blob URL
    const arrayBuffer = await audioFile.arrayBuffer()
    const blob = new Blob([arrayBuffer], { type: audioFile.type })
    const url = URL.createObjectURL(blob)

    // Save file record to database
    const result = await query(
      `INSERT INTO audio_files (user_id, file_url, file_size, mime_type)
       VALUES ($1, $2, $3, $4)
       RETURNING id, file_url`,
      [user.id, url, audioFile.size, audioFile.type],
    )

    if (result.rows.length === 0) {
      return NextResponse.json({ error: "Failed to save audio file" }, { status: 500 })
    }

    return NextResponse.json({
      id: result.rows[0].id,
      url: result.rows[0].file_url,
    })
  } catch (error) {
    console.error("Error uploading audio:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}
