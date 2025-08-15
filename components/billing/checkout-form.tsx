"use client"

import { useState } from "react"
import { GlassCard } from "@/components/ui/glass-card"
import { GradientButton } from "@/components/ui/gradient-button"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Badge } from "@/components/ui/badge"
import { Loader2, Tag } from "lucide-react"

interface CheckoutFormProps {
  type: "subscription" | "course"
  plan?: "monthly" | "yearly"
  courseId?: string
  courseName?: string
  amount: number
  onSuccess?: (checkoutUrl: string) => void
}

export function CheckoutForm({ type, plan, courseId, courseName, amount, onSuccess }: CheckoutFormProps) {
  const [isLoading, setIsLoading] = useState(false)
  const [couponCode, setCouponCode] = useState("")
  const [appliedCoupon, setAppliedCoupon] = useState<{
    code: string
    discount: number
    type: "percent" | "fixed"
  } | null>(null)

  const finalAmount = appliedCoupon
    ? appliedCoupon.type === "percent"
      ? amount - Math.floor((amount * appliedCoupon.discount) / 100)
      : amount - appliedCoupon.discount
    : amount

  const handleApplyCoupon = async () => {
    if (!couponCode.trim()) return

    try {
      const response = await fetch("/api/billing/validate-coupon", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ code: couponCode }),
      })

      if (response.ok) {
        const coupon = await response.json()
        setAppliedCoupon({
          code: couponCode,
          discount: coupon.discount_percent || coupon.discount_cents,
          type: coupon.discount_percent ? "percent" : "fixed",
        })
      } else {
        // Handle invalid coupon
        console.error("Invalid coupon")
      }
    } catch (error) {
      console.error("Error applying coupon:", error)
    }
  }

  const handleCheckout = async () => {
    setIsLoading(true)

    try {
      const response = await fetch("/api/billing/checkout", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          type,
          plan,
          courseId,
          couponCode: appliedCoupon?.code,
        }),
      })

      if (response.ok) {
        const { checkoutUrl } = await response.json()
        if (onSuccess) {
          onSuccess(checkoutUrl)
        } else {
          window.location.href = checkoutUrl
        }
      } else {
        throw new Error("Checkout failed")
      }
    } catch (error) {
      console.error("Checkout error:", error)
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <GlassCard className="p-6">
      <div className="mb-6">
        <h3 className="text-xl font-bold font-sans mb-2">Оформление заказа</h3>
        <p className="text-muted-foreground">
          {type === "subscription" ? `Подписка: ${plan === "monthly" ? "Месячная" : "Годовая"}` : `Курс: ${courseName}`}
        </p>
      </div>

      {/* Coupon Code */}
      <div className="mb-6">
        <Label htmlFor="coupon">Промокод (необязательно)</Label>
        <div className="flex gap-2 mt-2">
          <Input
            id="coupon"
            value={couponCode}
            onChange={(e) => setCouponCode(e.target.value)}
            placeholder="Введите промокод"
            className="bg-white/50 border-white/20"
            disabled={!!appliedCoupon}
          />
          <Button
            variant="outline"
            onClick={handleApplyCoupon}
            disabled={!couponCode.trim() || !!appliedCoupon}
            className="bg-white/10 backdrop-blur-sm border-white/20"
          >
            <Tag className="w-4 h-4 mr-2" />
            Применить
          </Button>
        </div>
        {appliedCoupon && (
          <div className="mt-2">
            <Badge className="bg-green-500 text-white">
              Промокод "{appliedCoupon.code}" применен (-
              {appliedCoupon.type === "percent" ? `${appliedCoupon.discount}%` : `${appliedCoupon.discount} ₽`})
            </Badge>
          </div>
        )}
      </div>

      {/* Order Summary */}
      <div className="mb-6 p-4 rounded-lg bg-white/5 backdrop-blur-sm border border-white/10">
        <div className="flex justify-between items-center mb-2">
          <span>Стоимость:</span>
          <span>{(amount / 100).toLocaleString()} ₽</span>
        </div>
        {appliedCoupon && (
          <div className="flex justify-between items-center mb-2 text-green-500">
            <span>Скидка:</span>
            <span>
              -
              {appliedCoupon.type === "percent"
                ? `${Math.floor((amount * appliedCoupon.discount) / 100 / 100).toLocaleString()} ₽`
                : `${(appliedCoupon.discount / 100).toLocaleString()} ₽`}
            </span>
          </div>
        )}
        <div className="border-t border-white/10 pt-2">
          <div className="flex justify-between items-center font-bold text-lg">
            <span>Итого:</span>
            <span className="text-primary">{(finalAmount / 100).toLocaleString()} ₽</span>
          </div>
        </div>
      </div>

      <GradientButton className="w-full" onClick={handleCheckout} disabled={isLoading}>
        {isLoading ? (
          <>
            <Loader2 className="w-4 h-4 mr-2 animate-spin" />
            Обработка...
          </>
        ) : (
          <>Оплатить через ЮKassa {(finalAmount / 100).toLocaleString()} ₽</>
        )}
      </GradientButton>

      <p className="text-xs text-muted-foreground text-center mt-4">
        Нажимая "Оплатить", вы соглашаетесь с{" "}
        <a href="/legal/terms" className="text-primary hover:underline">
          условиями использования
        </a>{" "}
        и{" "}
        <a href="/legal/privacy" className="text-primary hover:underline">
          политикой конфиденциальности
        </a>
      </p>
    </GlassCard>
  )
}
