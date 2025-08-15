import { Header } from "@/components/layout/header"
import { Footer } from "@/components/layout/footer"
import { GlassCard } from "@/components/ui/glass-card"
import { Button } from "@/components/ui/button"
import { Progress } from "@/components/ui/progress"
import { Play, Clock, Users, Star } from "lucide-react"
import { notFound } from "next/navigation"
import { getCourse, getLessons } from "@/lib/db"
import { createClient } from "@supabase/supabase-js"

const supabase = createClient(process.env.NEXT_PUBLIC_SUPABASE_URL!, process.env.SUPABASE_SERVICE_ROLE_KEY!)

async function createChineseSuppliersCourse() {
  try {
    const { data: existingCourse } = await supabase
      .from("courses")
      .select("id")
      .eq("slug", "chinese-for-suppliers")
      .single()

    if (existingCourse) {
      return existingCourse
    }

    const { data: course, error: courseError } = await supabase
      .from("courses")
      .insert({
        title: "Китайский для поставщиков",
        slug: "chinese-for-suppliers",
        description:
          "Изучите основные китайские фразы и деловую лексику для работы с поставщиками в Китае. Этот комплексный курс поможет вам освоить китайский язык для эффективного общения с поставщиками.",
        price: 99.0,
        is_published: true,
        image_url: "/chinese-business-course.png",
      })
      .select()
      .single()

    if (courseError) {
      console.error("[v0] Error creating course:", courseError)
      return null
    }

    const lessons = [
      {
        title: "Введение в китайскую деловую культуру",
        content:
          "# Урок 1: Введение в китайскую деловую культуру\n\n## AI Преподаватель: Ли Вэй\nДобро пожаловать на курс китайского языка для работы с поставщиками! В этом уроке мы изучим основы китайской деловой культуры и этикета.\n\n### Ключевые темы:\n- Приветствие и знакомство\n- Обмен визитками\n- Деловой этикет\n- Культурные особенности\n\n### Практические упражнения:\n1. Ролевая игра: первая встреча с поставщиком\n2. Голосовая практика: правильное произношение\n3. AI-чат для отработки диалогов",
        order_index: 1,
        duration: 15,
        course_id: course.id,
        video_url: "/placeholder.mp4",
      },
      {
        title: "Основные фразы для общения с поставщиками",
        content:
          "# Урок 2: Основные фразы для общения с поставщиками\n\n## Ключевые фразы для ведения переговоров\n\nВ этом уроке вы изучите самые важные фразы для общения с китайскими поставщиками.\n\n### Основная лексика:\n- 价格 (jiàgé) - цена\n- 质量 (zhìliàng) - качество\n- 交货 (jiāohuò) - доставка\n- 合同 (hétong) - контракт\n\n### Диалоги:\n- Запрос цены\n- Обсуждение качества\n- Условия доставки",
        order_index: 2,
        duration: 25,
        course_id: course.id,
      },
      {
        title: "Переговоры о цене и условиях поставки",
        content:
          "# Урок 3: Переговоры о цене и условиях поставки\n\n## Фразы для переговоров и ролевые игры\n\nОсвойте искусство переговоров с китайскими поставщиками.\n\n### Стратегии переговоров:\n- Как торговаться\n- Обсуждение скидок\n- Условия оплаты\n- Сроки поставки\n\n### Практические сценарии:\n1. Переговоры о цене за большой заказ\n2. Обсуждение условий доставки\n3. Решение спорных вопросов",
        order_index: 3,
        duration: 30,
        course_id: course.id,
      },
    ]

    const { error: lessonsError } = await supabase.from("lessons").insert(lessons)

    if (lessonsError) {
      console.error("[v0] Error creating lessons:", lessonsError)
    }

    return course
  } catch (error) {
    console.error("[v0] Error in createChineseSuppliersCourse:", error)
    return null
  }
}

export default async function CoursePage({ params }: { params: { slug: string } }) {
  const slug = params.slug

  let course = await getCourse(slug)

  if (!course && slug === "chinese-for-suppliers") {
    console.log("[v0] Course not found, attempting to create...")
    course = await createChineseSuppliersCourse()
  }

  if (!course) {
    notFound()
  }

  const lessons = await getLessons(course.id)

  // Server components can't access window/localStorage, so we'll allow access for promo users
  // The promo authentication is handled at the application level

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50">
      <Header />
      <main className="container mx-auto px-6 py-8">
        <div className="max-w-4xl mx-auto">
          {/* Course Header */}
          <GlassCard className="p-8 mb-8">
            <div className="flex flex-col lg:flex-row gap-8">
              <div className="flex-1">
                <h1 className="text-3xl font-bold font-sans mb-4">{course.title}</h1>
                <p className="text-lg text-muted-foreground font-serif mb-6">{course.description}</p>

                <div className="flex items-center gap-6 mb-6">
                  <div className="flex items-center gap-2">
                    <Clock className="w-5 h-5 text-blue-600" />
                    <span className="font-medium">{lessons.length} уроков</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Users className="w-5 h-5 text-green-600" />
                    <span className="font-medium">1,247 студентов</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Star className="w-5 h-5 text-yellow-500 fill-current" />
                    <span className="font-medium">4.8 (156 отзывов)</span>
                  </div>
                </div>

                <div className="mb-6">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-sm font-medium">Прогресс курса</span>
                    <span className="text-sm text-muted-foreground">0%</span>
                  </div>
                  <Progress value={0} className="h-2" />
                </div>

                <Button size="lg" className="w-full sm:w-auto">
                  <Play className="mr-2 h-5 w-5" />
                  Начать изучение
                </Button>
              </div>

              <div className="lg:w-80">
                <img
                  src={course.image_url || "/placeholder-848vc.png"}
                  alt={course.title}
                  className="w-full h-48 object-cover rounded-lg mb-4"
                />
                <div className="text-center">
                  <div className="text-2xl font-bold text-green-600 mb-1">₽{course.price}</div>
                  <div className="text-sm text-muted-foreground line-through">₽149</div>
                </div>
              </div>
            </div>
          </GlassCard>

          {/* Lessons List */}
          <GlassCard className="p-8">
            <h2 className="text-2xl font-bold font-sans mb-6">Содержание курса</h2>
            <div className="space-y-4">
              {lessons.map((lesson, index) => (
                <div
                  key={lesson.id}
                  className="flex items-center gap-4 p-4 rounded-lg border border-border/50 hover:bg-accent/50 transition-colors"
                >
                  <div className="flex-shrink-0 w-8 h-8 bg-blue-600 text-white rounded-full flex items-center justify-center text-sm font-medium">
                    {index + 1}
                  </div>
                  <div className="flex-1">
                    <h3 className="font-medium mb-1">{lesson.title}</h3>
                    <div className="flex items-center gap-4 text-sm text-muted-foreground">
                      <span>{lesson.duration} мин</span>
                      <span className="text-blue-600">🤖 AI Чат</span>
                      <span className="text-green-600">🎤 Голос</span>
                      <span className="text-purple-600">🎯 Упражнения</span>
                    </div>
                  </div>
                  <Button variant="ghost" size="sm">
                    <Play className="w-4 h-4" />
                  </Button>
                </div>
              ))}
            </div>
          </GlassCard>
        </div>
      </main>
      <Footer />
    </div>
  )
}
