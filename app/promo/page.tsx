"use client"

import type React from "react"
import { useState } from "react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { GlassCard } from "@/components/ui/glass-card"
import { GradientButton } from "@/components/ui/gradient-button"
import { BookOpen, Key, AlertCircle, Loader2 } from "lucide-react"

function SubmitButton({ isLoading }: { isLoading: boolean }) {
  return (
    <GradientButton type="submit" className="w-full" disabled={isLoading}>
      {isLoading ? (
        <>
          <Loader2 className="mr-2 h-4 w-4 animate-spin" />
          Проверка...
        </>
      ) : (
        "Войти"
      )}
    </GradientButton>
  )
}

export default function PromoPage() {
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [promoCode, setPromoCode] = useState("")
  const router = useRouter()

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    setIsLoading(true)
    setError(null)

    const formData = new FormData(e.currentTarget)
    const code = formData.get("promoCode") as string

    if (code.toLowerCase() === "welcomeai") {
      localStorage.setItem("promo_auth", "true")
      localStorage.setItem(
        "promo_user",
        JSON.stringify({
          id: "promo-user",
          email: "promo@aischool.ru",
          full_name: "Пользователь по промокоду",
          role: "student",
          created_at: new Date().toISOString(),
        }),
      )

      setTimeout(() => {
        router.push("/dashboard")
      }, 500)
    } else {
      setError("Неверный промокод. Попробуйте еще раз.")
      setIsLoading(false)
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center px-6 py-12">
      <div className="w-full max-w-md">
        {/* Logo */}
        <div className="text-center mb-8">
          <Link href="/" className="inline-flex items-center gap-2 font-bold text-2xl">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-primary to-blue-600 flex items-center justify-center">
              <BookOpen className="w-6 h-6 text-white" />
            </div>
            <span className="font-sans">AI Школа</span>
          </Link>
        </div>

        <GlassCard className="p-8">
          <div className="text-center mb-6">
            <h1 className="text-2xl font-bold font-sans mb-2">Вход по промокоду</h1>
            <p className="text-muted-foreground font-serif">Введите промокод для доступа к платформе</p>
          </div>

          {error && (
            <div className="mb-4 p-3 bg-red-500/10 border border-red-500/20 rounded-lg flex items-center gap-2 text-red-600">
              <AlertCircle className="w-4 h-4" />
              <span className="text-sm">{error}</span>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="promoCode">Промокод</Label>
              <div className="relative">
                <Key className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-5 h-5" />
                <Input
                  id="promoCode"
                  name="promoCode"
                  type="text"
                  placeholder="Введите промокод"
                  className="pl-10 bg-white/50 border-white/20"
                  value={promoCode}
                  onChange={(e) => setPromoCode(e.target.value)}
                  required
                />
              </div>
            </div>

            <SubmitButton isLoading={isLoading} />
          </form>

          <div className="mt-6 text-center">
            <p className="text-sm text-muted-foreground">
              Нет промокода?{" "}
              <Link href="/" className="text-primary hover:underline font-medium">
                Вернуться на главную
              </Link>
            </p>
          </div>
        </GlassCard>
      </div>
    </div>
  )
}
