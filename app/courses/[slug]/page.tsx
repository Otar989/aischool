import { Header } from "@/components/layout/header"
import { Footer } from "@/components/layout/footer"
import { GlassCard } from "@/components/ui/glass-card"
import { GradientButton } from "@/components/ui/gradient-button"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import {
  BookOpen,
  Clock,
  Users,
  Star,
  CheckCircle,
  Play,
  Lock,
  Award,
  MessageCircle,
  ArrowRight,
  Globe,
  Target,
} from "lucide-react"
import Link from "next/link"
import Image from "next/image"
import { notFound } from "next/navigation"
import { getCourse, getLessons, hasAccess } from "@/lib/db"
import { getUser } from "@/lib/auth"

export default async function CoursePage({ params }: { params: { slug: string } }) {
  const course = await getCourse(params.slug)
  const user = await getUser()

  if (!course) {
    notFound()
  }

  const lessons = await getLessons(course.id)
  const userHasAccess = user ? await hasAccess(user.id, course.id) : false

  const completedLessons = lessons.filter((lesson) => lesson.is_completed).length
  const progressPercentage = lessons.length > 0 ? (completedLessons / lessons.length) * 100 : 0

  return (
    <div className="min-h-screen">
      <Header />

      {/* Course Hero */}
      <section className="pt-32 pb-12 px-6">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
            {/* Main Content */}
            <div className="lg:col-span-2">
              <div className="mb-6">
                <Badge className="mb-4 bg-primary text-primary-foreground">{course.level}</Badge>
                <h1 className="text-3xl md:text-4xl font-bold font-sans mb-4">{course.title}</h1>
                <p className="text-xl text-muted-foreground font-serif mb-6">{course.description}</p>

                <div className="flex flex-wrap items-center gap-6 text-sm text-muted-foreground mb-6">
                  <div className="flex items-center gap-1">
                    <Star className="w-4 h-4 fill-yellow-400 text-yellow-400" />
                    <span className="font-medium">{course.rating || 4.8}</span>
                    <span>({course.review_count || 0} отзывов)</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <Users className="w-4 h-4" />
                    <span>{course.student_count || 0} студентов</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <Clock className="w-4 h-4" />
                    <span>{course.duration_hours} часов</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <Target className="w-4 h-4" />
                    <span>{course.level}</span>
                  </div>
                </div>

                {/* Instructor */}
                <div className="flex items-center gap-4 p-4 rounded-xl bg-white/5 backdrop-blur-sm border border-white/10">
                  <Image
                    src={course.instructor_avatar || "/placeholder.svg"}
                    alt={course.instructor_name || "Instructor"}
                    width={48}
                    height={48}
                    className="rounded-full"
                  />
                  <div>
                    <div className="font-semibold">{course.instructor_name}</div>
                    <div className="text-sm text-muted-foreground">{course.instructor_bio}</div>
                  </div>
                </div>
              </div>

              {/* Course Preview Video */}
              <GlassCard className="mb-8 overflow-hidden">
                <div className="relative aspect-video bg-gradient-to-br from-primary/10 to-blue-600/10">
                  <Image
                    src={course.image_url || "/placeholder.svg"}
                    alt={course.title}
                    fill
                    className="object-cover"
                  />
                  <div className="absolute inset-0 flex items-center justify-center">
                    <Button size="lg" className="rounded-full w-16 h-16 bg-white/20 backdrop-blur-sm hover:bg-white/30">
                      <Play className="w-6 h-6 ml-1" />
                    </Button>
                  </div>
                </div>
              </GlassCard>
            </div>

            {/* Sidebar */}
            <div className="lg:col-span-1">
              <GlassCard className="p-6 sticky top-32">
                <div className="text-center mb-6">
                  <div className="flex items-center justify-center gap-2 mb-2">
                    <span className="text-3xl font-bold text-primary">
                      {course.price_cents ? (course.price_cents / 100).toLocaleString() : "Бесплатно"} ₽
                    </span>
                    {course.original_price_cents && (
                      <span className="text-lg text-muted-foreground line-through">
                        {(course.original_price_cents / 100).toLocaleString()} ₽
                      </span>
                    )}
                  </div>
                  {course.in_subscription && (
                    <Badge variant="secondary" className="bg-green-500/10 text-green-600 border-green-500/20">
                      Включен в подписку
                    </Badge>
                  )}
                </div>

                <div className="space-y-3 mb-6">
                  {userHasAccess ? (
                    <>
                      <GradientButton className="w-full" asChild>
                        <Link href={`/learn/${course.id}/${lessons[0]?.id || ""}`}>
                          Продолжить обучение
                          <ArrowRight className="ml-2 w-4 h-4" />
                        </Link>
                      </GradientButton>
                      <div className="text-center">
                        <div className="text-sm text-muted-foreground mb-2">
                          Прогресс: {completedLessons} из {lessons.length} уроков
                        </div>
                        <Progress value={progressPercentage} className="h-2" />
                      </div>
                    </>
                  ) : (
                    <>
                      <GradientButton className="w-full" asChild>
                        <Link href="/pricing">
                          Купить курс
                          <ArrowRight className="ml-2 w-4 h-4" />
                        </Link>
                      </GradientButton>
                      <Button variant="outline" className="w-full bg-white/10 backdrop-blur-sm border-white/20">
                        Добавить в корзину
                      </Button>
                      {lessons.some((lesson) => lesson.is_demo) && (
                        <Button variant="ghost" className="w-full" asChild>
                          <Link href={`/learn/${course.id}/${lessons.find((l) => l.is_demo)?.id}`}>
                            <Play className="mr-2 w-4 h-4" />
                            Демо-урок
                          </Link>
                        </Button>
                      )}
                    </>
                  )}
                </div>

                <div className="text-center text-sm text-muted-foreground">
                  <div className="flex items-center justify-center gap-1 mb-2">
                    <Award className="w-4 h-4" />
                    <span>Сертификат о прохождении</span>
                  </div>
                  <div className="flex items-center justify-center gap-1 mb-2">
                    <MessageCircle className="w-4 h-4" />
                    <span>ИИ-наставник 24/7</span>
                  </div>
                  <div className="flex items-center justify-center gap-1">
                    <Globe className="w-4 h-4" />
                    <span>Пожизненный доступ</span>
                  </div>
                </div>
              </GlassCard>
            </div>
          </div>
        </div>
      </section>

      {/* Course Content */}
      <section className="py-12 px-6">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
            <div className="lg:col-span-2 space-y-8">
              {/* What You'll Learn */}
              <GlassCard className="p-6">
                <h2 className="text-2xl font-bold font-sans mb-4">Что вы изучите</h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                  {(course.learning_objectives || []).map((item: string, index: number) => (
                    <div key={index} className="flex items-start gap-2">
                      <CheckCircle className="w-5 h-5 text-green-500 mt-0.5 flex-shrink-0" />
                      <span className="text-sm">{item}</span>
                    </div>
                  ))}
                </div>
              </GlassCard>

              {/* Course Description */}
              <GlassCard className="p-6">
                <h2 className="text-2xl font-bold font-sans mb-4">Описание курса</h2>
                <p className="text-muted-foreground font-serif leading-relaxed">
                  {course.long_description || course.description}
                </p>
              </GlassCard>

              {/* Requirements */}
              <GlassCard className="p-6">
                <h2 className="text-2xl font-bold font-sans mb-4">Требования</h2>
                <ul className="space-y-2">
                  {(course.requirements || []).map((requirement: string, index: number) => (
                    <li key={index} className="flex items-start gap-2">
                      <div className="w-1.5 h-1.5 rounded-full bg-primary mt-2 flex-shrink-0" />
                      <span className="text-muted-foreground">{requirement}</span>
                    </li>
                  ))}
                </ul>
              </GlassCard>
            </div>

            {/* Course Curriculum */}
            <div className="lg:col-span-1">
              <GlassCard className="p-6">
                <h2 className="text-xl font-bold font-sans mb-4">Программа курса</h2>
                <div className="space-y-3">
                  {lessons.map((lesson, index) => (
                    <div
                      key={lesson.id}
                      className="flex items-center gap-3 p-3 rounded-lg bg-white/5 backdrop-blur-sm border border-white/10"
                    >
                      <div className="flex-shrink-0">
                        {lesson.is_demo ? (
                          <Play className="w-5 h-5 text-green-500" />
                        ) : userHasAccess ? (
                          lesson.is_completed ? (
                            <CheckCircle className="w-5 h-5 text-green-500" />
                          ) : (
                            <BookOpen className="w-5 h-5 text-primary" />
                          )
                        ) : (
                          <Lock className="w-5 h-5 text-muted-foreground" />
                        )}
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="font-medium text-sm truncate">{lesson.title}</div>
                        <div className="text-xs text-muted-foreground">{lesson.duration_minutes} мин</div>
                      </div>
                      {lesson.is_demo && (
                        <Badge variant="secondary" className="text-xs">
                          Демо
                        </Badge>
                      )}
                    </div>
                  ))}
                </div>
              </GlassCard>
            </div>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  )
}
