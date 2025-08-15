"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { Header } from "@/components/layout/header"
import { Footer } from "@/components/layout/footer"
import { GlassCard } from "@/components/ui/glass-card"
import { GradientButton } from "@/components/ui/gradient-button"
import { Button } from "@/components/ui/button"
import { Progress } from "@/components/ui/progress"
import { BookOpen, Award, ArrowRight, Target, LogOut } from "lucide-react"
import Link from "next/link"
import Image from "next/image"
import { createClient } from "@/lib/supabase/client"
import type { User } from "@supabase/supabase-js"

interface UserProfile {
  id: string
  email: string
  full_name: string
  avatar_url?: string
  created_at: string
  role: string
}

interface Course {
  id: string
  title: string
  description: string
  image_url?: string
  total_lessons: number
}

interface UserProgress {
  course_id: string
  completed_lessons: number
  progress_percentage: number
  last_accessed: string
  time_spent_hours: number
}

export default function DashboardPage() {
  const [user, setUser] = useState<User | null>(null)
  const [profile, setProfile] = useState<UserProfile | null>(null)
  const [courses, setCourses] = useState<Course[]>([])
  const [userProgress, setUserProgress] = useState<UserProgress[]>([])
  const [loading, setLoading] = useState(true)
  const router = useRouter()
  const supabase = createClient()

  useEffect(() => {
    const getUser = async () => {
      const {
        data: { user },
      } = await supabase.auth.getUser()

      if (!user) {
        router.push("/login")
        return
      }

      setUser(user)

      // Get user profile
      const { data: profileData } = await supabase.from("users").select("*").eq("id", user.id).single()

      if (profileData) {
        setProfile(profileData)
      }

      // Get user's enrolled courses
      const { data: enrollmentsData } = await supabase
        .from("enrollments")
        .select(`
          course_id,
          completed_lessons,
          progress_percentage,
          last_accessed,
          time_spent_hours,
          courses (
            id,
            title,
            description,
            image_url,
            total_lessons
          )
        `)
        .eq("user_id", user.id)

      if (enrollmentsData) {
        const coursesData = enrollmentsData.map((enrollment) => enrollment.courses).filter(Boolean)
        const progressData = enrollmentsData.map((enrollment) => ({
          course_id: enrollment.course_id,
          completed_lessons: enrollment.completed_lessons,
          progress_percentage: enrollment.progress_percentage,
          last_accessed: enrollment.last_accessed,
          time_spent_hours: enrollment.time_spent_hours,
        }))

        setCourses(coursesData as Course[])
        setUserProgress(progressData)
      }

      setLoading(false)
    }

    getUser()
  }, [router, supabase])

  const handleSignOut = async () => {
    await supabase.auth.signOut()
    router.push("/")
  }

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
          <p className="text-muted-foreground">Загрузка...</p>
        </div>
      </div>
    )
  }

  if (!user || !profile) {
    return null
  }

  const totalLearningTime = userProgress.reduce((sum, progress) => sum + progress.time_spent_hours, 0)
  const activeCourses = userProgress.filter((p) => p.progress_percentage < 100).length
  const completedCourses = userProgress.filter((p) => p.progress_percentage === 100).length
  const currentStreak = 7 // This would be calculated from actual learning activity

  return (
    <div className="min-h-screen">
      <Header />

      <div className="pt-32 pb-20 px-6">
        <div className="max-w-7xl mx-auto">
          {/* Welcome Section */}
          <div className="mb-8">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-4">
                <Image
                  src={profile.avatar_url || "/placeholder.svg?height=64&width=64&query=user avatar"}
                  alt={profile.full_name || "User"}
                  width={64}
                  height={64}
                  className="rounded-full"
                />
                <div>
                  <h1 className="text-3xl font-bold font-sans">Добро пожаловать, {profile.full_name || "Студент"}!</h1>
                  <p className="text-muted-foreground font-serif">Продолжайте свое обучение с ИИ-наставником</p>
                </div>
              </div>
              <Button variant="outline" onClick={handleSignOut} className="bg-white/10 border-white/20">
                <LogOut className="w-4 h-4 mr-2" />
                Выйти
              </Button>
            </div>

            {/* Stats Cards */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <GlassCard className="p-4 text-center">
                <div className="text-2xl font-bold text-primary mb-1">{totalLearningTime}ч</div>
                <div className="text-sm text-muted-foreground">Время обучения</div>
              </GlassCard>
              <GlassCard className="p-4 text-center">
                <div className="text-2xl font-bold text-primary mb-1">{activeCourses}</div>
                <div className="text-sm text-muted-foreground">Активных курсов</div>
              </GlassCard>
              <GlassCard className="p-4 text-center">
                <div className="text-2xl font-bold text-primary mb-1">{completedCourses}</div>
                <div className="text-sm text-muted-foreground">Завершено курсов</div>
              </GlassCard>
              <GlassCard className="p-4 text-center">
                <div className="text-2xl font-bold text-primary mb-1">{currentStreak}</div>
                <div className="text-sm text-muted-foreground">Дней подряд</div>
              </GlassCard>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Main Content */}
            <div className="lg:col-span-2 space-y-8">
              {/* Continue Learning */}
              <section>
                <h2 className="text-2xl font-bold font-sans mb-6">Продолжить обучение</h2>
                {courses.length > 0 ? (
                  <div className="space-y-4">
                    {courses.map((course) => {
                      const progress = userProgress.find((p) => p.course_id === course.id)
                      if (!progress || progress.progress_percentage === 100) return null

                      return (
                        <GlassCard key={course.id} className="p-6">
                          <div className="flex items-start gap-4">
                            <Image
                              src={course.image_url || "/placeholder.svg?height=60&width=80&query=course"}
                              alt={course.title}
                              width={80}
                              height={60}
                              className="rounded-lg object-cover"
                            />
                            <div className="flex-1 min-w-0">
                              <h3 className="font-bold font-sans text-lg mb-2 truncate">{course.title}</h3>
                              <div className="flex items-center gap-4 text-sm text-muted-foreground mb-3">
                                <span>
                                  {progress.completed_lessons} из {course.total_lessons} уроков
                                </span>
                                <span>{progress.time_spent_hours}ч изучено</span>
                              </div>
                              <div className="mb-4">
                                <div className="flex items-center justify-between text-sm mb-1">
                                  <span>Прогресс</span>
                                  <span>{progress.progress_percentage}%</span>
                                </div>
                                <Progress value={progress.progress_percentage} className="h-2" />
                              </div>
                              <div className="flex items-center justify-between">
                                <span className="text-sm text-muted-foreground">
                                  Последний доступ: {new Date(progress.last_accessed).toLocaleDateString("ru-RU")}
                                </span>
                                <GradientButton size="sm" asChild>
                                  <Link href={`/learn/${course.id}/next`}>
                                    Продолжить
                                    <ArrowRight className="ml-1 w-4 h-4" />
                                  </Link>
                                </GradientButton>
                              </div>
                            </div>
                          </div>
                        </GlassCard>
                      )
                    })}
                  </div>
                ) : (
                  <GlassCard className="p-8 text-center">
                    <BookOpen className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
                    <h3 className="font-bold mb-2">Начните свое обучение</h3>
                    <p className="text-muted-foreground mb-4">
                      Выберите курс и начните изучение с персональным ИИ-наставником
                    </p>
                    <GradientButton asChild>
                      <Link href="/courses">Выбрать курс</Link>
                    </GradientButton>
                  </GlassCard>
                )}
              </section>

              {/* Completed Courses */}
              {completedCourses > 0 && (
                <section>
                  <h2 className="text-2xl font-bold font-sans mb-6">Завершенные курсы</h2>
                  <div className="space-y-4">
                    {courses.map((course) => {
                      const progress = userProgress.find((p) => p.course_id === course.id)
                      if (!progress || progress.progress_percentage !== 100) return null

                      return (
                        <GlassCard key={course.id} className="p-6">
                          <div className="flex items-start gap-4">
                            <Image
                              src={course.image_url || "/placeholder.svg?height=60&width=80&query=course"}
                              alt={course.title}
                              width={80}
                              height={60}
                              className="rounded-lg object-cover"
                            />
                            <div className="flex-1 min-w-0">
                              <h3 className="font-bold font-sans text-lg mb-2 truncate">{course.title}</h3>
                              <div className="flex items-center gap-4 text-sm text-muted-foreground mb-3">
                                <span>✅ Курс завершен</span>
                                <span>{progress.time_spent_hours}ч изучено</span>
                              </div>
                              <div className="flex items-center justify-between">
                                <span className="text-sm text-green-600">
                                  Завершен {new Date(progress.last_accessed).toLocaleDateString("ru-RU")}
                                </span>
                                <Button size="sm" variant="outline" className="bg-white/10 border-white/20" asChild>
                                  <Link href={`/certificates/${course.id}`}>
                                    <Award className="w-4 h-4 mr-1" />
                                    Сертификат
                                  </Link>
                                </Button>
                              </div>
                            </div>
                          </div>
                        </GlassCard>
                      )
                    })}
                  </div>
                </section>
              )}
            </div>

            {/* Sidebar */}
            <div className="lg:col-span-1 space-y-6">
              {/* Learning Streak */}
              <GlassCard className="p-6">
                <h3 className="font-bold font-sans mb-4">Серия обучения</h3>
                <div className="text-center">
                  <div className="text-3xl font-bold text-primary mb-2">{currentStreak}</div>
                  <div className="text-sm text-muted-foreground mb-4">дней подряд</div>
                  <div className="grid grid-cols-7 gap-1">
                    {Array.from({ length: 7 }, (_, i) => (
                      <div
                        key={i}
                        className={`w-6 h-6 rounded-sm ${i < currentStreak ? "bg-primary" : "bg-white/10"}`}
                      />
                    ))}
                  </div>
                  <div className="text-xs text-muted-foreground mt-2">Последние 7 дней</div>
                </div>
              </GlassCard>

              {/* Quick Actions */}
              <GlassCard className="p-6">
                <h3 className="font-bold font-sans mb-4">Быстрые действия</h3>
                <div className="space-y-3">
                  <Button
                    variant="outline"
                    className="w-full justify-start bg-white/10 backdrop-blur-sm border-white/20"
                    asChild
                  >
                    <Link href="/courses">
                      <BookOpen className="w-4 h-4 mr-2" />
                      Найти новый курс
                    </Link>
                  </Button>
                  <Button
                    variant="outline"
                    className="w-full justify-start bg-white/10 backdrop-blur-sm border-white/20"
                    asChild
                  >
                    <Link href="/certificates">
                      <Award className="w-4 h-4 mr-2" />
                      Мои сертификаты
                    </Link>
                  </Button>
                  <Button
                    variant="outline"
                    className="w-full justify-start bg-white/10 backdrop-blur-sm border-white/20"
                    asChild
                  >
                    <Link href="/profile">
                      <Target className="w-4 h-4 mr-2" />
                      Настройки профиля
                    </Link>
                  </Button>
                </div>
              </GlassCard>

              {/* User Info */}
              <GlassCard className="p-6">
                <h3 className="font-bold font-sans mb-4">Информация о профиле</h3>
                <div className="space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Email:</span>
                    <span>{profile.email}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Роль:</span>
                    <span>{profile.role === "ADMIN" ? "Администратор" : "Студент"}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Регистрация:</span>
                    <span>{new Date(profile.created_at).toLocaleDateString("ru-RU")}</span>
                  </div>
                </div>
              </GlassCard>
            </div>
          </div>
        </div>
      </div>

      <Footer />
    </div>
  )
}
