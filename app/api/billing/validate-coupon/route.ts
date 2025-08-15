import { type NextRequest, NextResponse } from "next/server"
import { requireAuth } from "@/lib/auth"
import { query } from "@/lib/db"
import { z } from "zod"

const couponSchema = z.object({
  code: z.string().min(1),
})

export async function POST(request: NextRequest) {
  try {
    await requireAuth()
    const body = await request.json()
    const { code } = couponSchema.parse(body)

    const couponResult = await query(
      `SELECT * FROM coupons 
       WHERE code = $1 
       AND valid_from <= NOW() 
       AND (valid_to IS NULL OR valid_to >= NOW())
       AND (max_redemptions IS NULL OR redeemed_count < max_redemptions)`,
      [code],
    )

    if (couponResult.rows.length === 0) {
      return NextResponse.json({ error: "Invalid or expired coupon" }, { status: 404 })
    }

    const coupon = couponResult.rows[0]

    return NextResponse.json({
      code: coupon.code,
      discount_percent: coupon.discount_percent,
      discount_cents: coupon.discount_cents,
      valid: true,
    })
  } catch (error) {
    console.error("Error validating coupon:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}
