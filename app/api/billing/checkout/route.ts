import { type NextRequest, NextResponse } from "next/server"
import { requireAuth } from "@/lib/auth"
import { query } from "@/lib/db"
import { createYooKassaPayment } from "@/lib/payments"
import { z } from "zod"

const checkoutSchema = z.object({
  type: z.enum(["subscription", "course"]),
  plan: z.enum(["monthly", "yearly"]).optional(),
  courseId: z.string().uuid().optional(),
  couponCode: z.string().optional(),
})

export async function POST(request: NextRequest) {
  try {
    const user = await requireAuth()
    const body = await request.json()
    const { type, plan, courseId, couponCode } = checkoutSchema.parse(body)

    let amount = 0
    let description = ""

    if (type === "subscription") {
      if (!plan) {
        return NextResponse.json({ error: "Plan is required for subscription" }, { status: 400 })
      }

      const planPrices = {
        monthly: 199000, // 1990 RUB
        yearly: 199000 * 10, // 19900 RUB
      }

      amount = planPrices[plan]
      description = plan === "monthly" ? "Месячная подписка AI Школа" : "Годовая подписка AI Школа"
    } else if (type === "course") {
      if (!courseId) {
        return NextResponse.json({ error: "Course ID is required for course purchase" }, { status: 400 })
      }

      const courseResult = await query("SELECT title, price_cents FROM courses WHERE id = $1", [courseId])
      if (courseResult.rows.length === 0) {
        return NextResponse.json({ error: "Course not found" }, { status: 404 })
      }

      const course = courseResult.rows[0]
      amount = course.price_cents
      description = `Курс: ${course.title}`
    }

    // Apply coupon if provided
    let discountAmount = 0
    if (couponCode) {
      const couponResult = await query(
        `SELECT * FROM coupons 
         WHERE code = $1 
         AND valid_from <= NOW() 
         AND (valid_to IS NULL OR valid_to >= NOW())
         AND (max_redemptions IS NULL OR redeemed_count < max_redemptions)`,
        [couponCode],
      )

      if (couponResult.rows.length > 0) {
        const coupon = couponResult.rows[0]
        if (coupon.discount_percent) {
          discountAmount = Math.floor((amount * coupon.discount_percent) / 100)
        } else if (coupon.discount_cents) {
          discountAmount = Math.min(coupon.discount_cents, amount)
        }
        amount -= discountAmount
      }
    }

    // Create order record
    const orderResult = await query(
      `INSERT INTO orders (user_id, type, course_id, amount_cents, currency, coupon_code, status) 
       VALUES ($1, $2, $3, $4, $5, $6, $7) 
       RETURNING id`,
      [user.id, type, courseId, amount, "RUB", couponCode, "pending"],
    )

    const orderId = orderResult.rows[0].id

    const checkoutUrl = await createYooKassaPayment({
      orderId,
      amount,
      currency: "RUB",
      description,
      customerEmail: user.email,
      returnUrl: `${process.env.NEXT_PUBLIC_APP_URL}/billing/success?order_id=${orderId}`,
    })

    return NextResponse.json({
      checkoutUrl,
      orderId,
      amount,
      discountAmount,
    })
  } catch (error) {
    console.error("Error creating checkout:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}
