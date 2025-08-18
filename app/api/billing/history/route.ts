export const runtime = "nodejs"
export const dynamic = "force-dynamic"

import { NextResponse } from "next/server"
import { requireAuth } from "@/lib/auth"
import { query } from "@/lib/db"

export async function GET() {
  try {
    if (!process.env.NEON_DATABASE_URL) {
      return NextResponse.json({
        orders: [],
        subscriptions: [],
      })
    }

    const user = await requireAuth()

    const ordersResult = await query(
      `SELECT o.*, c.title as course_title, p.status as payment_status
       FROM orders o
       LEFT JOIN courses c ON o.course_id = c.id
       LEFT JOIN payments p ON o.id = p.order_id
       WHERE o.user_id = $1
       ORDER BY o.created_at DESC`,
      [user.id],
    )

    const subscriptionsResult = await query(
      `SELECT * FROM subscriptions 
       WHERE user_id = $1 
       ORDER BY created_at DESC`,
      [user.id],
    )

    return NextResponse.json({
      orders: ordersResult.rows,
      subscriptions: subscriptionsResult.rows,
    })
  } catch (error) {
    console.error("Error fetching billing history:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}
