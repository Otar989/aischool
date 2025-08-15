import { Pool } from "pg"

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: process.env.NODE_ENV === "production" ? { rejectUnauthorized: false } : false,
})

export async function query(text: string, params?: any[]) {
  const client = await pool.connect()
  try {
    const result = await client.query(text, params)
    return result
  } finally {
    client.release()
  }
}

export async function getUser(email: string) {
  const result = await query("SELECT id, email, name, role, avatar_url, email_verified FROM users WHERE email = $1", [
    email,
  ])
  return result.rows[0] || null
}

export async function createUser(email: string, name: string, passwordHash: string) {
  const result = await query(
    "INSERT INTO users (email, name, password_hash) VALUES ($1, $2, $3) RETURNING id, email, name, role, avatar_url",
    [email, name, passwordHash],
  )
  return result.rows[0]
}

export async function getCourses(limit = 20, offset = 0) {
  const result = await query(
    "SELECT * FROM courses WHERE is_active = true ORDER BY created_at DESC LIMIT $1 OFFSET $2",
    [limit, offset],
  )
  return result.rows
}

export async function getCourse(slug: string) {
  const result = await query("SELECT * FROM courses WHERE slug = $1 AND is_active = true", [slug])
  return result.rows[0] || null
}

export async function getLessons(courseId: string) {
  const result = await query("SELECT * FROM lessons WHERE course_id = $1 ORDER BY order_index ASC", [courseId])
  return result.rows
}

export async function hasAccess(userId: string, courseId: string): Promise<boolean> {
  // Check if user has active subscription
  const subscriptionResult = await query(
    "SELECT id FROM subscriptions WHERE user_id = $1 AND status = $2 AND current_period_end > NOW()",
    [userId, "active"],
  )

  if (subscriptionResult.rows.length > 0) {
    return true
  }

  // Check if user purchased the course
  const enrollmentResult = await query("SELECT id FROM enrollments WHERE user_id = $1 AND course_id = $2", [
    userId,
    courseId,
  ])

  return enrollmentResult.rows.length > 0
}
