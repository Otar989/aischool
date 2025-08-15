"use client"

import type React from "react"
import { useState } from "react"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { GlassCard } from "@/components/ui/glass-card"
import { GradientButton } from "@/components/ui/gradient-button"
import { BookOpen, Mail, ArrowLeft, AlertCircle, CheckCircle, Loader2 } from "lucide-react"
import { createClient } from "@/lib/supabase/client"

function SubmitButton({ isLoading }: { isLoading: boolean }) {
  return (
    <GradientButton type="submit" className="w-full" disabled={isLoading}>
      {isLoading ? (
        <>
          <Loader2 className="mr-2 h-4 w-4 animate-spin" />
          Отправка...
        </>
      ) : (
        "Отправить ссылку для сброса"
      )}
    </GradientButton>
  )
}

export default function ForgotPasswordPage() {
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [success, setSuccess] = useState<string | null>(null)
  const [emailSent, setEmailSent] = useState(false)

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    setIsLoading(true)
    setError(null)
    setSuccess(null)

    const formData = new FormData(e.currentTarget)
    const email = formData.get("email") as string

    if (!email) {
      setError("Введите email адрес")
      setIsLoading(false)
      return
    }

    try {
      const supabase = createClient()
      const { error } = await supabase.auth.resetPasswordForEmail(email, {
        redirectTo: `${window.location.origin}/reset-password`,
      })

      if (error) {
        if (error.message.includes("Invalid email")) {
          setError("Неверный формат email")
        } else if (error.message.includes("not found")) {
          setError("Пользователь с таким email не найден")
        } else {
          setError("Ошибка при отправке: " + error.message)
        }
        return
      }

      setSuccess("Ссылка для сброса пароля отправлена на ваш email")
      setEmailSent(true)
    } catch (err) {
      console.error("[v0] Password reset error:", err)
      setError("Произошла ошибка. Попробуйте еще раз.")
    } finally {
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
            <h1 className="text-2xl font-bold font-sans mb-2">Восстановление пароля</h1>
            <p className="text-muted-foreground font-serif">
              {emailSent
                ? "Проверьте вашу почту для дальнейших инструкций"
                : "Введите email для получения ссылки сброса пароля"}
            </p>
          </div>

          {error && (
            <div className="mb-4 p-3 bg-red-500/10 border border-red-500/20 rounded-lg flex items-center gap-2 text-red-600">
              <AlertCircle className="w-4 h-4" />
              <span className="text-sm">{error}</span>
            </div>
          )}

          {success && (
            <div className="mb-4 p-3 bg-green-500/10 border border-green-500/20 rounded-lg flex items-center gap-2 text-green-600">
              <CheckCircle className="w-4 h-4" />
              <span className="text-sm">{success}</span>
            </div>
          )}

          {!emailSent ? (
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="email">Email</Label>
                <div className="relative">
                  <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-5 h-5" />
                  <Input
                    id="email"
                    name="email"
                    type="email"
                    placeholder="your@email.com"
                    className="pl-10 bg-white/50 border-white/20"
                    required
                  />
                </div>
              </div>

              <SubmitButton isLoading={isLoading} />
            </form>
          ) : (
            <div className="space-y-4">
              <div className="text-center p-4 bg-green-500/10 border border-green-500/20 rounded-lg">
                <CheckCircle className="w-12 h-12 text-green-600 mx-auto mb-2" />
                <p className="text-sm text-green-600">
                  Письмо отправлено! Проверьте папку "Спам", если не видите письмо в основной папке.
                </p>
              </div>

              <Button
                variant="outline"
                className="w-full bg-white/10 backdrop-blur-sm border-white/20"
                onClick={() => {
                  setEmailSent(false)
                  setSuccess(null)
                  setError(null)
                }}
              >
                Отправить повторно
              </Button>
            </div>
          )}

          <div className="mt-6 text-center">
            <Link
              href="/promo"
              className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-primary transition-colors"
            >
              <ArrowLeft className="w-4 h-4" />
              Вернуться к входу
            </Link>
          </div>
        </GlassCard>
      </div>
    </div>
  )
}
