import { type NextRequest, NextResponse } from "next/server"
import { query } from "@/lib/db"

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()

    // YooKassa webhook event
    const { event, object: payment } = body

    if (event === "payment.succeeded") {
      await handlePaymentSucceeded(payment)
    } else if (event === "payment.canceled") {
      await handlePaymentCanceled(payment)
    }

    return NextResponse.json({ received: true })
  } catch (error) {
    console.error("YooKassa webhook error:", error)
    return NextResponse.json({ error: "Webhook handler failed" }, { status: 500 })
  }
}

async function handlePaymentSucceeded(payment: any) {
  const orderId = payment.metadata?.order_id

  if (!orderId) {
    console.error("No order ID in payment metadata")
    return
  }

  // Update order status
  await query("UPDATE orders SET status = $1, provider_payment_id = $2 WHERE id = $3", ["paid", payment.id, orderId])

  // Create payment record
  await query(
    "INSERT INTO payments (order_id, provider_payment_id, status, raw_webhook_json) VALUES ($1, $2, $3, $4)",
    [orderId, payment.id, "succeeded", JSON.stringify(payment)],
  )

  // Get order details
  const orderResult = await query("SELECT * FROM orders WHERE id = $1", [orderId])
  const order = orderResult.rows[0]

  if (order.type === "subscription") {
    // Create subscription
    const plan = order.plan || "monthly"
    const periodEnd = new Date()
    periodEnd.setMonth(periodEnd.getMonth() + (plan === "yearly" ? 12 : 1))

    await query(
      `INSERT INTO subscriptions (user_id, plan, status, current_period_start, current_period_end, yookassa_payment_id) 
       VALUES ($1, $2, $3, NOW(), $4, $5)
       ON CONFLICT (user_id) 
       DO UPDATE SET 
         plan = $2, 
         status = $3, 
         current_period_start = NOW(), 
         current_period_end = $4,
         yookassa_payment_id = $5`,
      [order.user_id, plan, "active", periodEnd, payment.id],
    )
  } else if (order.type === "course") {
    // Create enrollment
    await query(
      "INSERT INTO enrollments (user_id, course_id, access_type, started_at) VALUES ($1, $2, $3, NOW()) ON CONFLICT (user_id, course_id) DO NOTHING",
      [order.user_id, order.course_id, "purchase"],
    )
  }

  // Update coupon usage if applicable
  if (order.coupon_code) {
    await query("UPDATE coupons SET redeemed_count = redeemed_count + 1 WHERE code = $1", [order.coupon_code])
  }
}

async function handlePaymentCanceled(payment: any) {
  const orderId = payment.metadata?.order_id

  if (orderId) {
    await query("UPDATE orders SET status = $1 WHERE id = $2", ["canceled", orderId])
  }
}
