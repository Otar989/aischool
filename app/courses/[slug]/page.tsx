import { Header } from "@/components/layout/header"
import { Footer } from "@/components/layout/footer"
import { GlassCard } from "@/components/ui/glass-card"
import { Button } from "@/components/ui/button"
import { Progress } from "@/components/ui/progress"
import { Play } from "lucide-react"
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
        title: "Контроль качества и reklamacii",
        content: `
# Урок 4: Контроль качества и reklamacii

## AI Преподаватель предупреждает:
Качество - это основа успешного бизнеса! Изучим, как обсуждать проблемы качества.

## Фразы для контроля качества:

### Проверка качества:
- **质量不符合要求** (Zhìliàng bù fúhé yāoqiú) - Качество не соответствует требованиям
- **有缺陷** (Yǒu quēxiàn) - Есть дефекты
- **需要改进** (Xūyào gǎijìn) - Нужно улучшить

### reklamacii:
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
    console.error("Error in createChineseSuppliersCourse:", error)
    return null
  }
}

export default async function CoursePage({ params }) {
  const slug = params.slug
  const user = await getUser()
  const course = await getCourse(slug)
  const lessons = await getLessons(slug)

  if (!course) {
    notFound()
  }

  if (!user || !(await hasAccess(user.id, course.id))) {
    redirect("/login")
  }

  return (
    <div>
      <Header />
      <main>
        <GlassCard>
          <h1>{course.title}</h1>
          <p>{course.description}</p>
          <Progress value={50} max={100} />
          <Button>
            <Play className="mr-2 h-4 w-4" />
            Начать курс
          </Button>
        </GlassCard>
        {lessons.map((lesson) => (
          <div key={lesson.id}>
            <h2>{lesson.title}</h2>
            <p>{lesson.content}</p>
          </div>
        ))}
      </main>
      <Footer />
    </div>
  )
}
