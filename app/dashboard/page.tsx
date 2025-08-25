"use client"

// Минимально упрощённая версия личного кабинета.
// Показывает приветствие, одну CTA кнопку и выход.

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { Header } from "@/components/layout/header"
import { Footer } from "@/components/layout/footer"
import { GlassCard } from "@/components/ui/glass-card"
import { GradientButton } from "@/components/ui/gradient-button"
import { Button } from "@/components/ui/button"
import Image from "next/image"
import Link from "next/link"
import { LogOut, ArrowRight, BookOpen } from "lucide-react"
import { createClient } from "@/lib/supabase/client"

interface Profile {
  id: string
  email: string
  full_name: string
  avatar_url?: string
  created_at: string
}

export default function DashboardPage() {
  const [profile, setProfile] = useState<Profile | null>(null)
  const [loading, setLoading] = useState(true)
  const router = useRouter()
  const supabase = createClient()

  useEffect(() => {
    const load = async () => {
      // Проверка промо локального пользователя (временный механизм)
      const promoAuth = typeof window !== "undefined" ? localStorage.getItem("promo_auth") : null
      const promoUserData = typeof window !== "undefined" ? localStorage.getItem("promo_user") : null
      if (promoAuth === "true" && promoUserData) {
        setProfile(JSON.parse(promoUserData))
        setLoading(false)
        return
      }

      const { data } = await supabase.auth.getUser()
      const user = data.user
      if (!user) {
        router.replace("/promo")
        return
      }
      const { data: p } = await supabase.from("users").select("id,email,full_name,avatar_url,created_at").eq("id", user.id).single()
      if (p) setProfile(p)
      setLoading(false)
    }
    load()
  }, [router, supabase])

  const handleSignOut = async () => {
    localStorage.removeItem("promo_auth")
    localStorage.removeItem("promo_user")
    await supabase.auth.signOut()
    router.replace("/")
  }

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-muted-foreground">Загрузка...</div>
      </div>
    )
  }

  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <main className="flex-1 pt-32 pb-16 px-6">
        <div className="max-w-3xl mx-auto space-y-6">
          <h1 className="text-3xl font-bold font-sans">Личный кабинет</h1>
          <GlassCard className="p-6 flex items-center gap-4">
            <Image
              src={profile?.avatar_url || "/placeholder.svg?height=64&width=64&query=avatar"}
              alt="avatar"
              width={64}
              height={64}
              className="rounded-full"
            />
            <div className="flex-1 min-w-0">
              <div className="font-semibold text-lg">{profile?.full_name || "Студент"}</div>
              <div className="text-sm text-muted-foreground truncate">{profile?.email}</div>
              <div className="mt-2 text-xs text-muted-foreground">
                Зарегистрирован: {profile ? new Date(profile.created_at).toLocaleDateString("ru-RU") : "—"}
              </div>
            </div>
            <Button variant="outline" size="sm" onClick={handleSignOut} className="bg-white/10 border-white/20">
              <LogOut className="w-4 h-4 mr-1" /> Выйти
            </Button>
          </GlassCard>

          <GlassCard className="p-8 text-center space-y-4">
            <BookOpen className="w-10 h-10 text-primary mx-auto" />
            <h2 className="text-xl font-semibold">Каталог курсов</h2>
            <p className="text-sm text-muted-foreground max-w-md mx-auto">
              Откройте каталог и выберите курс, чтобы начать обучение с ИИ‑наставником.
            </p>
            <div className="flex justify-center">
              <Button variant="outline" asChild className="bg-white/10 border-white/20">
                <Link href="/courses" className="flex items-center">
                  Перейти
                  <ArrowRight className="w-4 h-4 ml-1" />
                </Link>
              </Button>
            </div>
          </GlassCard>
        </div>
      </main>
      <Footer />
    </div>
  )
}
