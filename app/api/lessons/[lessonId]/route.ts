import { type NextRequest, NextResponse } from "next/server"
import { getUser } from "@/lib/auth"
import { createClient } from "@/lib/supabase/server"
import { hasAccess } from "@/lib/db"

export async function GET(request: NextRequest, { params }: { params: { lessonId: string } }) {
  try {
    const user = await getUser()
    const supabase = createClient()

    // Get lesson details
    const { data: lesson, error: lessonError } = await supabase
      .from("lessons")
      .select(`
        *,
        course:courses(*)
      `)
      .eq("id", params.lessonId)
      .single()

    if (lessonError || !lesson) {
      return NextResponse.json({ error: "Lesson not found" }, { status: 404 })
    }

    // Check user access
    const userHasAccess = user ? await hasAccess(user.id, lesson.course_id) : false

    // Get lesson navigation (prev/next)
    const { data: allLessons } = await supabase
      .from("lessons")
      .select("id, order_index")
      .eq("course_id", lesson.course_id)
      .order("order_index")

    const currentIndex = allLessons?.findIndex((l) => l.id === lesson.id) || 0
    const prevLessonId = currentIndex > 0 ? allLessons?.[currentIndex - 1]?.id : null
    const nextLessonId = currentIndex < (allLessons?.length || 0) - 1 ? allLessons?.[currentIndex + 1]?.id : null

    // Get course progress
    let courseProgress = 0
    if (user) {
      const { data: progress } = await supabase
        .from("user_progress")
        .select("*")
        .eq("user_id", user.id)
        .eq("course_id", lesson.course_id)

      const completedLessons = progress?.filter((p) => p.completed).length || 0
      courseProgress = allLessons?.length ? (completedLessons / allLessons.length) * 100 : 0
    }

    return NextResponse.json({
      ...lesson,
      hasAccess: userHasAccess || lesson.is_demo,
      prevLessonId,
      nextLessonId,
      lessonNumber: currentIndex + 1,
      totalLessons: allLessons?.length || 0,
      courseProgress,
    })
  } catch (error) {
    console.error("Error fetching lesson:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}
