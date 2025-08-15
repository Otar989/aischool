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
  Mic,
  Bot,
} from "lucide-react"
import Link from "next/link"
import Image from "next/image"
import { notFound, redirect } from "next/navigation"
import { getCourse, getLessons, hasAccess } from "@/lib/db"
import { getUser } from "@/lib/auth"
import { createClient } from "@supabase/supabase-js"

const supabase = createClient(process.env.NEXT_PUBLIC_SUPABASE_URL!, process.env.SUPABASE_SERVICE_ROLE_KEY!)

async function createChineseSuppliersCourse() {
  try {
    // Check if course already exists
    const { data: existingCourse } = await supabase
      .from("courses")
      .select("id")
      .eq("slug", "chinese-for-suppliers")
      .single()

    if (existingCourse) {
      return existingCourse
    }

    // Create the course with comprehensive data
    const { data: course, error: courseError } = await supabase
      .from("courses")
      .insert({
        title: "Китайский для поставщиков",
        slug: "chinese-for-suppliers",
        description:
          "Изучите основные китайские фразы и деловую лексику для работы с поставщиками в Китае. Идеально подходит для специалистов по закупкам и владельцев бизнеса.",
        long_description:
          "Этот комплексный курс поможет вам освоить китайский язык для эффективного общения с поставщиками. Вы изучите деловую терминологию, культурные особенности ведения бизнеса в Китае, и получите практические навыки переговоров. Курс включает интерактивные уроки с AI-преподавателем, голосовые упражнения и реальные бизнес-сценарии.",
        price_cents: 9900,
        original_price_cents: 14900,
        is_published: true,
        level: "Начинающий",
        duration_hours: 12,
        student_count: 1247,
        rating: 4.8,
        review_count: 156,
        instructor_name: "Ли Вэй",
        instructor_bio: "Преподаватель китайского языка с 15-летним опытом работы в международном бизнесе",
        instructor_avatar: "/chinese-teacher.png",
        image_url: "/placeholder-848vc.png",
        learning_objectives: [
          "Освоите базовую деловую лексику на китайском языке",
          "Научитесь вести переговоры с поставщиками",
          "Изучите культурные особенности ведения бизнеса в Китае",
          "Сможете обсуждать качество продукции и сроки поставки",
          "Получите навыки письменного общения на китайском",
          "Освоите этикет деловых встреч и презентаций",
        ],
        requirements: [
          "Базовые знания английского языка",
          "Желание изучать китайский язык",
          "Опыт работы в сфере закупок (желательно)",
          "Компьютер или мобильное устройство с интернетом",
        ],
        in_subscription: true,
      })
      .select()
      .single()

    if (courseError) {
      console.error("[v0] Error creating course:", courseError)
      return null
    }

    // Create comprehensive lessons with AI teacher integration
    const lessons = [
      {
        title: "Введение в китайскую деловую культуру",
        content: `
# Урок 1: Введение в китайскую деловую культуру

## AI Преподаватель: Ли Вэй
Добро пожаловать на курс китайского языка для работы с поставщиками! Меня зовут Ли Вэй, и я буду вашим AI-преподавателем.

## Основы деловой культуры

### Важные принципы:
- **Гуаньси (关系)** - отношения и связи
- **Мяньцзы (面子)** - сохранение лица и репутации  
- **Иерархия** - уважение к старшим и руководству

### Голосовые упражнения:
🎤 **Произнесите фразы:**
- 你好 (Nǐ hǎo) - Здравствуйте
- 很高兴见到您 (Hěn gāoxìng jiàn dào nín) - Очень рад встрече с вами
- 我是... (Wǒ shì...) - Меня зовут...

### AI Чат-помощник
💬 Задайте мне любые вопросы о китайской культуре или произношении!
        `,
        order_index: 1,
        duration_minutes: 15,
        course_id: course.id,
        is_demo: true,
        video_url: "/placeholder.mp4",
        has_ai_chat: true,
        has_voice_practice: true,
      },
      {
        title: "Основные фразы для общения с поставщиками",
        content: `
# Урок 2: Основные фразы для общения с поставщиками

## AI Преподаватель говорит:
В этом уроке мы изучим ключевые фразы для ведения переговоров с китайскими поставщиками.

## Ключевые фразы:

### Знакомство и представление:
- **我们想采购...** (Wǒmen xiǎng cǎigòu...) - Мы хотим закупить...
- **您能提供什么价格?** (Nín néng tígōng shénme jiàgé?) - Какую цену вы можете предложить?
- **最小订购量是多少?** (Zuìxiǎo dìnggòu liàng shì duōshǎo?) - Какой минимальный объем заказа?

### Обсуждение качества:
- **质量怎么样?** (Zhìliàng zěnmeyàng?) - Какое качество?
- **有质量证书吗?** (Yǒu zhìliàng zhèngshū ma?) - Есть ли сертификаты качества?
- **可以看样品吗?** (Kěyǐ kàn yàngpǐn ma?) - Можно посмотреть образцы?

### Голосовая практика с AI:
🎤 Повторите за мной каждую фразу. Я оценю ваше произношение!

### Интерактивный диалог:
💬 Давайте проведем диалог! Я буду поставщиком, а вы - покупателем.
        `,
        order_index: 2,
        duration_minutes: 25,
        course_id: course.id,
        has_ai_chat: true,
        has_voice_practice: true,
        has_interactive_exercises: true,
      },
      {
        title: "Переговоры о цене и условиях поставки",
        content: `
# Урок 3: Переговоры о цене и условиях поставки

## AI Преподаватель объясняет:
Переговоры - это искусство! Давайте изучим, как эффективно обсуждать цены и условия.

## Фразы для переговоров:

### Обсуждение цены:
- **价格太高了** (Jiàgé tài gāo le) - Цена слишком высокая
- **能便宜一点吗?** (Néng piányí yīdiǎn ma?) - Можете сделать дешевле?
- **如果订购量大，有折扣吗?** (Rúguǒ dìnggòu liàng dà, yǒu zhékòu ma?) - Если заказ большой, есть скидка?

### Условия поставки:
- **什么时候能发货?** (Shénme shíhòu néng fāhuò?) - Когда можете отправить?
- **运费多少钱?** (Yùnfèi duōshǎo qián?) - Сколько стоит доставка?
- **付款方式是什么?** (Fùkuǎn fāngshì shì shénme?) - Какие условия оплаты?

### Практические сценарии:
🎭 **Ролевая игра с AI:**
Я буду играть роль поставщика, а вы - покупателя. Попробуйте договориться о лучшей цене!

### Голосовой тренажер:
🎤 Произнесите фразы с правильной интонацией. Помните: в китайском языке тон очень важен!

### AI Анализ:
📊 После каждого упражнения я дам вам обратную связь по произношению и использованию фраз.
        `,
        order_index: 3,
        duration_minutes: 30,
        course_id: course.id,
        has_ai_chat: true,
        has_voice_practice: true,
        has_interactive_exercises: true,
        has_role_play: true,
      },
      {
        title: "Контроль качества и рекламации",
        content: `
# Урок 4: Контроль качества и рекламации

## AI Преподаватель предупреждает:
Качество - это основа успешного бизнеса! Изучим, как обсуждать проблемы качества.

## Фразы для контроля качества:

### Проверка качества:
- **质量不符合要求** (Zhìliàng bù fúhé yāoqiú) - Качество не соответствует требованиям
- **有缺陷** (Yǒu quēxiàn) - Есть дефекты
- **需要改进** (Xūyào gǎijìn) - Нужно улучшить

### Рекламации:
- **我们发现了问题** (Wǒmen fāxiàn le wèntí) - Мы обнаружили проблему
- **需要退货** (Xūyào tuìhuò) - Нужен возврат
- **要求赔偿** (Yāoqiú péicháng) - Требуем компенсацию

### Интерактивные упражнения:
🎯 **Ситуационные задачи:**
AI создаст различные проблемные ситуации, а вы должны правильно отреагировать на китайском языке.

### Голосовая практика:
🎤 Тренируйте произношение сложных технических терминов с помощью AI-тренера.
        `,
        order_index: 4,
        duration_minutes: 20,
        course_id: course.id,
        has_ai_chat: true,
        has_voice_practice: true,
        has_interactive_exercises: true,
      },
      {
        title: "Деловая переписка и документооборот",
        content: `
# Урок 5: Деловая переписка и документооборот

## AI Преподаватель учит:
Письменное общение не менее важно! Изучим основы деловой переписки на китайском.

## Структура делового письма:

### Обращение:
- **尊敬的...先生/女士** (Zūnjìng de... xiānshēng/nǚshì) - Уважаемый господин/госпожа...
- **亲爱的合作伙伴** (Qīn'ài de hézuò huǒbàn) - Дорогой партнер

### Основные фразы:
- **感谢您的来信** (Gǎnxiè nín de láixìn) - Спасибо за ваше письмо
- **关于您的询价** (Guānyú nín de xúnjià) - Относительно вашего запроса цены
- **请查收附件** (Qǐng chá shōu fùjiàn) - Пожалуйста, проверьте вложение

### AI Помощник по письмам:
✍️ **Генератор писем:**
Опишите ситуацию, и AI поможет составить правильное деловое письмо на китайском языке.

### Проверка грамматики:
📝 Напишите письмо, и AI проверит грамматику и стиль.
        `,
        order_index: 5,
        duration_minutes: 25,
        course_id: course.id,
        has_ai_chat: true,
        has_writing_practice: true,
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
  console.log("[v0] Fetching course with slug:", params.slug)
  const course = await getCourse(params.slug)
  const user = await getUser()

  if (!course && params.slug === "chinese-for-suppliers") {
    console.log("[v0] Course not found, creating course...")
    const createdCourse = await createChineseSuppliersCourse() // Fixed variable name here
    if (createdCourse) {
      redirect(`/courses/${params.slug}`)
    }
  }

  if (!course) {
    console.log("[v0] Course data:", course)
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

                <div className="mt-6 grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="flex items-center gap-3 p-4 rounded-xl bg-gradient-to-r from-blue-500/10 to-purple-500/10 border border-blue-500/20">
                    <Bot className="w-8 h-8 text-blue-500" />
                    <div>
                      <div className="font-semibold text-blue-400">AI Преподаватель</div>
                      <div className="text-sm text-muted-foreground">Персональный помощник 24/7</div>
                    </div>
                  </div>
                  <div className="flex items-center gap-3 p-4 rounded-xl bg-gradient-to-r from-green-500/10 to-teal-500/10 border border-green-500/20">
                    <Mic className="w-8 h-8 text-green-500" />
                    <div>
                      <div className="font-semibold text-green-400">Голосовая практика</div>
                      <div className="text-sm text-muted-foreground">Тренировка произношения с AI</div>
                    </div>
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
                        <div className="text-xs text-muted-foreground flex items-center gap-2">
                          <span>{lesson.duration_minutes} мин</span>
                          {lesson.has_ai_chat && <Bot className="w-3 h-3 text-blue-400" />}
                          {lesson.has_voice_practice && <Mic className="w-3 h-3 text-green-400" />}
                        </div>
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
</merged_code>
