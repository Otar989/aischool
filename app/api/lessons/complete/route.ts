import { type NextRequest, NextResponse } from "next/server"
import { getUser } from "@/lib/auth"
import { createClient } from "@/lib/supabase/server"

export async function POST(request: NextRequest) {
  try {
    const user = await getUser()
    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const { lessonId } = await request.json()
    const supabase = createClient()

    // Get lesson details
    const { data: lesson } = await supabase.from("lessons").select("course_id").eq("id", lessonId).single()

    if (!lesson) {
      return NextResponse.json({ error: "Lesson not found" }, { status: 404 })
    }

    // Update or create progress record
    const { error } = await supabase.from("user_progress").upsert({
      user_id: user.id,
      course_id: lesson.course_id,
      lesson_id: lessonId,
      completed: true,
      completed_at: new Date().toISOString(),
    })

    if (error) throw error

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error("Error completing lesson:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}
