import { NextResponse } from "next/server"
import { createAdminClient } from "@/lib/supabase/admin"

const supabase = createAdminClient()

export async function POST() {
  if (process.env.ENABLE_SEED_COURSE !== "true") {
    return NextResponse.json({ error: "Seeding disabled" }, { status: 403 })
  }
  try {
    // Check if course already exists
    const { data: existingCourse } = await supabase
      .from("courses")
      .select("id")
      .eq("slug", "chinese-for-suppliers")
      .single()

    if (existingCourse) {
      return NextResponse.json({ message: "Course already exists" })
    }

    // Create the course
    const { data: course, error: courseError } = await supabase
      .from("courses")
      .insert({
        title: "Chinese for Suppliers",
        slug: "chinese-for-suppliers",
        description:
          "Learn essential Chinese phrases and business vocabulary for working with suppliers in China. Perfect for procurement professionals and business owners.",
        price: 99.99,
        is_published: true,
        image_url: "/placeholder-hz4hk.png",
      })
      .select()
      .single()

    if (courseError) {
      console.error("[v0] Error creating course:", courseError)
      return NextResponse.json({ error: "Failed to create course" }, { status: 500 })
    }

    // Create sample lessons
    const lessons = [
      {
        title: "Introduction to Chinese Business Culture",
        content: "Learn the basics of Chinese business etiquette and cultural norms when working with suppliers.",
        order_index: 1,
        duration: 15,
        course_id: course.id,
      },
      {
        title: "Essential Supplier Communication Phrases",
        content: "Master key phrases for negotiating prices, discussing quality, and managing timelines.",
        order_index: 2,
        duration: 20,
        course_id: course.id,
      },
      {
        title: "Product Specifications and Quality Control",
        content: "Learn how to communicate technical requirements and quality standards in Chinese.",
        order_index: 3,
        duration: 25,
        course_id: course.id,
      },
    ]

    const { error: lessonsError } = await supabase.from("lessons").insert(lessons)

    if (lessonsError) {
      console.error("[v0] Error creating lessons:", lessonsError)
    }

    return NextResponse.json({ message: "Course created successfully", course })
  } catch (error) {
    console.error("[v0] Seed course error:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}
