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

// Mock data - in real app this would come from database
const getCourseData = (slug: string) => {
  const courses = {
    "chinese-for-suppliers": {
      id: "550e8400-e29b-41d4-a716-446655440001",
      slug: "chinese-for-suppliers",
      title: "Разговорный китайский для поставщиков: 7 ситуаций",
      description:
        "Практический курс китайского языка для работы с поставщиками. Изучите ключевые фразы и ситуации для успешного ведения бизнеса с китайскими партнерами.",
      longDescription:
        "Этот курс разработан специально для предпринимателей и менеджеров, которые работают с китайскими поставщиками. Вы изучите не только язык, но и культурные особенности ведения бизнеса в Китае.",
      level: "Начальный",
      duration: "12 часов",
      price: 299000,
      originalPrice: 499000,
      currency: "RUB",
      image: "/placeholder-90s8j.png",
      badge: "Хит продаж",
      rating: 4.8,
      reviewCount: 247,
      studentCount: 1247,
      inSubscription: true,
      instructor: {
        name: "Ли Мин",
        avatar: "/chinese-instructor-avatar.png",
        bio: "Преподаватель китайского языка с 15-летним опытом, специалист по деловому китайскому",
      },
      whatYouLearn: [
        "Основные фразы для знакомства и приветствия",
        "Обсуждение цен и условий поставки",
        "Контроль качества и рекламации",
        "Логистика и сроки доставки",
        "Культурные особенности ведения бизнеса",
        "Практические диалоги с ИИ-наставником",
        "Произношение и интонация",
      ],
      requirements: [
        "Базовые знания английского языка",
        "Желание изучать китайский язык",
        "Опыт работы с поставщиками",
      ],
      lessons: [
        {
          id: "550e8400-e29b-41d4-a716-446655440011",
          title: "Знакомство и приветствие",
          duration: 30,
          isDemo: true,
          isCompleted: false,
        },
        {
          id: "550e8400-e29b-41d4-a716-446655440012",
          title: "Обсуждение цен и условий",
          duration: 45,
          isDemo: false,
          isCompleted: false,
        },
        {
          id: "550e8400-e29b-41d4-a716-446655440013",
          title: "Контроль качества",
          duration: 40,
          isDemo: false,
          isCompleted: false,
        },
        {
          id: "550e8400-e29b-41d4-a716-446655440014",
          title: "Логистика и доставка",
          duration: 35,
          isDemo: false,
          isCompleted: false,
        },
        {
          id: "550e8400-e29b-41d4-a716-446655440015",
          title: "Решение проблем и конфликтов",
          duration: 50,
          isDemo: false,
          isCompleted: false,
        },
        {
          id: "550e8400-e29b-41d4-a716-446655440016",
          title: "Долгосрочное сотрудничество",
          duration: 40,
          isDemo: false,
          isCompleted: false,
        },
        {
          id: "550e8400-e29b-41d4-a716-446655440017",
          title: "Итоговая практика и сертификация",
          duration: 60,
          isDemo: false,
          isCompleted: false,
        },
      ],
    },
  }

  return courses[slug as keyof typeof courses] || null
}

export default function CoursePage({ params }: { params: { slug: string } }) {
  const course = getCourseData(params.slug)

  if (!course) {
    notFound()
  }

  const hasAccess = false // TODO: Check user access
  const completedLessons = course.lessons.filter((lesson) => lesson.isCompleted).length
  const progressPercentage = (completedLessons / course.lessons.length) * 100

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
                <Badge className="mb-4 bg-primary text-primary-foreground">{course.badge}</Badge>
                <h1 className="text-3xl md:text-4xl font-bold font-sans mb-4">{course.title}</h1>
                <p className="text-xl text-muted-foreground font-serif mb-6">{course.description}</p>

                <div className="flex flex-wrap items-center gap-6 text-sm text-muted-foreground mb-6">
                  <div className="flex items-center gap-1">
                    <Star className="w-4 h-4 fill-yellow-400 text-yellow-400" />
                    <span className="font-medium">{course.rating}</span>
                    <span>({course.reviewCount} отзывов)</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <Users className="w-4 h-4" />
                    <span>{course.studentCount.toLocaleString()} студентов</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <Clock className="w-4 h-4" />
                    <span>{course.duration}</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <Target className="w-4 h-4" />
                    <span>{course.level}</span>
                  </div>
                </div>

                {/* Instructor */}
                <div className="flex items-center gap-4 p-4 rounded-xl bg-white/5 backdrop-blur-sm border border-white/10">
                  <Image
                    src={course.instructor.avatar || "/placeholder.svg"}
                    alt={course.instructor.name}
                    width={48}
                    height={48}
                    className="rounded-full"
                  />
                  <div>
                    <div className="font-semibold">{course.instructor.name}</div>
                    <div className="text-sm text-muted-foreground">{course.instructor.bio}</div>
                  </div>
                </div>
              </div>

              {/* Course Preview Video */}
              <GlassCard className="mb-8 overflow-hidden">
                <div className="relative aspect-video bg-gradient-to-br from-primary/10 to-blue-600/10">
                  <Image src={course.image || "/placeholder.svg"} alt={course.title} fill className="object-cover" />
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
                    <span className="text-3xl font-bold text-primary">{(course.price / 100).toLocaleString()} ₽</span>
                    {course.originalPrice && (
                      <span className="text-lg text-muted-foreground line-through">
                        {(course.originalPrice / 100).toLocaleString()} ₽
                      </span>
                    )}
                  </div>
                  {course.inSubscription && (
                    <Badge variant="secondary" className="bg-green-500/10 text-green-600 border-green-500/20">
                      Включен в подписку
                    </Badge>
                  )}
                </div>

                <div className="space-y-3 mb-6">
                  {hasAccess ? (
                    <>
                      <GradientButton className="w-full" asChild>
                        <Link href={`/learn/${course.id}/${course.lessons[0].id}`}>
                          Продолжить обучение
                          <ArrowRight className="ml-2 w-4 h-4" />
                        </Link>
                      </GradientButton>
                      <div className="text-center">
                        <div className="text-sm text-muted-foreground mb-2">
                          Прогресс: {completedLessons} из {course.lessons.length} уроков
                        </div>
                        <Progress value={progressPercentage} className="h-2" />
                      </div>
                    </>
                  ) : (
                    <>
                      <GradientButton className="w-full">
                        Купить курс
                        <ArrowRight className="ml-2 w-4 h-4" />
                      </GradientButton>
                      <Button variant="outline" className="w-full bg-white/10 backdrop-blur-sm border-white/20">
                        Добавить в корзину
                      </Button>
                      <Button variant="ghost" className="w-full" asChild>
                        <Link href={`/learn/${course.id}/${course.lessons[0].id}`}>
                          <Play className="mr-2 w-4 h-4" />
                          Демо-урок
                        </Link>
                      </Button>
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
                  {course.whatYouLearn.map((item, index) => (
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
                <p className="text-muted-foreground font-serif leading-relaxed">{course.longDescription}</p>
              </GlassCard>

              {/* Requirements */}
              <GlassCard className="p-6">
                <h2 className="text-2xl font-bold font-sans mb-4">Требования</h2>
                <ul className="space-y-2">
                  {course.requirements.map((requirement, index) => (
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
                  {course.lessons.map((lesson, index) => (
                    <div
                      key={lesson.id}
                      className="flex items-center gap-3 p-3 rounded-lg bg-white/5 backdrop-blur-sm border border-white/10"
                    >
                      <div className="flex-shrink-0">
                        {lesson.isDemo ? (
                          <Play className="w-5 h-5 text-green-500" />
                        ) : hasAccess ? (
                          lesson.isCompleted ? (
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
                        <div className="text-xs text-muted-foreground">{lesson.duration} мин</div>
                      </div>
                      {lesson.isDemo && (
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
