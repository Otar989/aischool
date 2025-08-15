import { createClient } from "@supabase/supabase-js"
import { Pool } from "pg"

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY
const databaseUrl = process.env.DATABASE_URL

if (!supabaseUrl || !supabaseKey) {
  console.error("[v0] Missing Supabase configuration")
  process.exit(1)
}

if (!databaseUrl) {
  console.error("[v0] Missing DATABASE_URL environment variable")
  process.exit(1)
}

const supabase = createClient(supabaseUrl, supabaseKey)
const pool = new Pool({ connectionString: databaseUrl })

export async function query(text: string, params?: any[]) {
  try {
    const { rows } = await pool.query(text, params)
    return { rows }
  } catch (error) {
    console.error("[v0] Error executing query:", error)
    throw error
  }
}

export async function getUser(email: string) {
  const { data, error } = await supabase
    .from("users")
    .select("id, email, name, role, avatar_url, email_verified")
    .eq("email", email)
    .single()

  if (error) {
    console.log("[v0] Error fetching user:", error)
    return null
  }
  return data
}

export async function createUser(email: string, name: string, passwordHash: string) {
  const { data, error } = await supabase
    .from("users")
    .insert({ email, name, password_hash: passwordHash })
    .select("id, email, name, role, avatar_url")
    .single()

  if (error) {
    console.log("[v0] Error creating user:", error)
    throw error
  }
  return data
}

export async function getCourses(limit = 20, offset = 0) {
  const { data, error } = await supabase
    .from("courses")
    .select("*")
    .eq("is_published", true)
    .order("created_at", { ascending: false })
    .range(offset, offset + limit - 1)

  if (error) {
    console.log("[v0] Error fetching courses:", error)
    return []
  }
  return data || []
}

export async function getCourse(slug: string) {
  console.log("[v0] Fetching course with slug:", slug)

  const { data, error } = await supabase
    .from("courses")
    .select("*")
    .eq("slug", slug)
    .eq("is_published", true)
    .maybeSingle() // Use maybeSingle() instead of single() to handle no results gracefully

  if (error) {
    console.log("[v0] Error fetching course:", error)
    return null
  }

  console.log("[v0] Course data:", data)
  return data
}

export async function getLessons(courseId: string) {
  const { data, error } = await supabase
    .from("lessons")
    .select("*")
    .eq("course_id", courseId)
    .order("order_index", { ascending: true })

  if (error) {
    console.log("[v0] Error fetching lessons:", error)
    return []
  }
  return data || []
}

export async function hasAccess(userId: string, courseId: string): Promise<boolean> {
  // Check if user has active subscription
  const { data: subscription } = await supabase
    .from("subscriptions")
    .select("id")
    .eq("user_id", userId)
    .eq("status", "active")
    .gt("current_period_end", new Date().toISOString())
    .single()

  if (subscription) {
    return true
  }

  // Check if user purchased the course
  const { data: enrollment } = await supabase
    .from("enrollments")
    .select("id")
    .eq("user_id", userId)
    .eq("course_id", courseId)
    .single()

  return !!enrollment
}

export async function getRevenueAnalytics() {
  const thirtyDaysAgo = new Date()
  thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30)

  const { data, error } = await supabase
    .from("orders")
    .select("created_at, amount_cents")
    .eq("status", "paid")
    .gte("created_at", thirtyDaysAgo.toISOString())
    .order("created_at")

  if (error) {
    console.log("[v0] Error fetching revenue analytics:", error)
    return []
  }

  // Group by day
  const grouped = data?.reduce((acc: any, order: any) => {
    const date = new Date(order.created_at).toDateString()
    if (!acc[date]) {
      acc[date] = { date, revenue: 0, orders: 0 }
    }
    acc[date].revenue += order.amount_cents
    acc[date].orders += 1
    return acc
  }, {})

  return Object.values(grouped || {})
}

export async function getUserGrowthAnalytics() {
  const thirtyDaysAgo = new Date()
  thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30)

  const { data, error } = await supabase
    .from("users")
    .select("created_at")
    .eq("role", "user")
    .gte("created_at", thirtyDaysAgo.toISOString())
    .order("created_at")

  if (error) {
    console.log("[v0] Error fetching user growth:", error)
    return []
  }

  // Group by day
  const grouped = data?.reduce((acc: any, user: any) => {
    const date = new Date(user.created_at).toDateString()
    if (!acc[date]) {
      acc[date] = { date, new_users: 0 }
    }
    acc[date].new_users += 1
    return acc
  }, {})

  return Object.values(grouped || {})
}

export async function getCoursePerformanceAnalytics() {
  const { data: courses, error: coursesError } = await supabase
    .from("courses")
    .select(`
      id,
      title,
      enrollments:enrollments(count),
      course_progress:course_progress(progress_percent)
    `)
    .limit(10)

  if (coursesError) {
    console.log("[v0] Error fetching course performance:", coursesError)
    return []
  }

  return (
    courses?.map((course) => ({
      title: course.title,
      enrollments: course.enrollments?.length || 0,
      avg_progress:
        course.course_progress?.length > 0
          ? course.course_progress.reduce((sum: number, p: any) => sum + p.progress_percent, 0) /
            course.course_progress.length
          : 0,
    })) || []
  )
}

export async function getChatAnalytics() {
  const thirtyDaysAgo = new Date()
  thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30)

  const { data, error } = await supabase
    .from("chat_sessions")
    .select("created_at, message_count")
    .gte("created_at", thirtyDaysAgo.toISOString())
    .order("created_at")

  if (error) {
    console.log("[v0] Error fetching chat analytics:", error)
    return []
  }

  // Group by day
  const grouped = data?.reduce((acc: any, session: any) => {
    const date = new Date(session.created_at).toDateString()
    if (!acc[date]) {
      acc[date] = { date, sessions: 0, total_messages: 0 }
    }
    acc[date].sessions += 1
    acc[date].total_messages += session.message_count || 0
    return acc
  }, {})

  return Object.values(grouped || {}).map((day: any) => ({
    ...day,
    avg_messages: day.sessions > 0 ? day.total_messages / day.sessions : 0,
  }))
}
