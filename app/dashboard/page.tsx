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

interface RecentLesson {
  lessonId: string
  lessonTitle: string
  courseId: string
  courseTitle: string
  courseSlug: string
  viewedAt: string
}

export default function DashboardPage() {
  const [profile, setProfile] = useState<Profile | null>(null)
  const [loading, setLoading] = useState(true)
  const [recent, setRecent] = useState<RecentLesson[]>([])
  const router = useRouter()
  const supabase = createClient()

  useEffect(() => {
    const load = async () => {
      try {
        // 1. Пробуем Supabase сессию (если пользователь входил классически)
        const { data } = await supabase.auth.getUser()
        if (data.user) {
          const { data: p } = await supabase
            .from("users")
            .select("id,email,full_name,avatar_url,created_at")
            .eq("id", data.user.id)
            .single()
          if (p) {
            setProfile(p)
            setLoading(false)
            return
          }
        }
        // 2. Иначе проверяем promo_session
        const promoResp = await fetch('/api/promo/session', { cache: 'no-store' })
        if (promoResp.ok) {
          const js = await promoResp.json().catch(()=>null)
          const exp = js?.payload?.exp ? new Date(js.payload.exp * 1000).toISOString() : new Date().toISOString()
            setProfile({
              id: 'promo',
              email: js?.payload?.bypass ? 'bypass@promo.local' : 'promo@user.local',
              full_name: 'Участник',
              avatar_url: undefined,
              created_at: exp
            })
          setLoading(false)
          return
        }
        // 3. Нет ни supabase, ни промо
        router.replace('/promo')
      } catch {
        router.replace('/promo')
      }
    }
    load()
  }, [router, supabase])

  // Загрузка последних уроков из localStorage
  useEffect(() => {
    if (typeof window === 'undefined') return
    try {
      const raw = localStorage.getItem('recent_lessons')
      if (raw) {
        const arr: RecentLesson[] = JSON.parse(raw)
        setRecent(arr)
      }
    } catch {}
  }, [])

  const handleSignOut = async () => {
    try { await fetch('/api/promo/logout', { method: 'POST' }) } catch {}
    await supabase.auth.signOut().catch(()=>{})
    router.replace('/')
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

          {/* Быстрый возврат */}
          {recent.length > 0 && (
            <GlassCard className="p-6 space-y-4">
              <div className="flex items-center justify-between">
                <h2 className="text-lg font-semibold flex items-center gap-2"><BookOpen className="w-5 h-5" /> Недавно просмотренные</h2>
                <Button variant="ghost" size="sm" onClick={() => { localStorage.removeItem('recent_lessons'); setRecent([]) }} className="text-xs opacity-60 hover:opacity-100">Очистить</Button>
              </div>
              <ul className="space-y-2">
                {recent.slice(0,5).map((l, i) => (
                  <li key={l.lessonId} className="flex items-center justify-between group">
                    <div className="min-w-0">
                      <Link href={`/courses/${l.courseSlug}/lessons/${l.lessonId}`} className="font-medium truncate block group-hover:underline">
                        {l.lessonTitle}
                      </Link>
                      <span className="text-xs text-muted-foreground">{l.courseTitle} • {new Date(l.viewedAt).toLocaleString('ru-RU', { hour: '2-digit', minute: '2-digit', day: '2-digit', month: '2-digit' })}</span>
                    </div>
                    {i === 0 && (
                      <Button size="sm" variant="secondary" asChild>
                        <Link href={`/courses/${l.courseSlug}/lessons/${l.lessonId}`}>Продолжить</Link>
                      </Button>
                    )}
                  </li>
                ))}
              </ul>
            </GlassCard>
          )}

          {/* Каталог */}
          <GlassCard className="p-8 text-center space-y-4">
              <BookOpen className="w-10 h-10 text-primary mx-auto" />
              <h2 className="text-xl font-semibold">Каталог курсов</h2>
              <p className="text-sm text-muted-foreground max-w-md mx-auto">
                {recent.length === 0 ? 'Начните обучение — выберите первый курс из каталога.' : 'Выберите другой курс для изучения.'}
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
