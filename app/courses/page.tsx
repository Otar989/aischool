import { Header } from "@/components/layout/header"
import { Footer } from "@/components/layout/footer"
import { GlassCard } from "@/components/ui/glass-card"
import { GradientButton } from "@/components/ui/gradient-button"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Search, Filter, Users, Clock, Star, BookOpen, ArrowRight } from "lucide-react"
import Link from "next/link"
import Image from "next/image"
import { getCourses } from "@/lib/db"

export default async function CoursesPage() {
  const coursesData = await getCourses()

  const staticCourses = [
    {
      id: 1,
      slug: "chinese-for-suppliers",
      title: "Разговорный китайский для поставщиков: 7 ситуаций",
      description:
        "Практический курс китайского языка для работы с поставщиками. Изучите ключевые фразы и ситуации для успешного ведения бизнеса.",
      level: "Начальный",
      duration: "12 часов",
      price: "2,990 ₽",
      originalPrice: "4,990 ₽",
      image: "/chinese-business-course.png",
      badge: "Хит продаж",
      rating: 4.8,
      students: 1247,
      inSubscription: true,
    },
    {
      id: 2,
      slug: "telegram-mini-apps",
      title: "Telegram Mini Apps: старт за 7 дней",
      description: "Создайте свое первое мини-приложение для Telegram с нуля. От идеи до публикации в App Store.",
      level: "Средний",
      duration: "20 часов",
      price: "4,990 ₽",
      image: "/telegram-mini-app-dev.png",
      badge: "Новинка",
      rating: 4.9,
      students: 856,
      inSubscription: true,
    },
    {
      id: 3,
      slug: "ai-prompt-engineering",
      title: "Инженерия промптов: мастерство работы с ИИ",
      description: "Научитесь создавать эффективные промпты для получения лучших результатов от ИИ-систем.",
      level: "Продвинутый",
      duration: "8 часов",
      price: "1,990 ₽",
      image: "/ai-prompt-dashboard.png",
      badge: "Эксклюзив",
      rating: 4.7,
      students: 2134,
      inSubscription: false,
    },
    {
      id: 4,
      slug: "python-automation",
      title: "Python для автоматизации бизнес-процессов",
      description: "Автоматизируйте рутинные задачи с помощью Python. Практические кейсы для офисной работы.",
      level: "Средний",
      duration: "16 часов",
      price: "3,990 ₽",
      image: "/python-automation-business.png",
      badge: "Популярный",
      rating: 4.6,
      students: 1876,
      inSubscription: true,
    },
    {
      id: 5,
      slug: "excel-advanced",
      title: "Excel: от новичка до эксперта",
      description: "Полный курс по Excel с практическими заданиями. Формулы, сводные таблицы, макросы и BI.",
      level: "Все уровни",
      duration: "24 часа",
      price: "2,490 ₽",
      image: "/placeholder-sxs4e.png",
      badge: "Бестселлер",
      rating: 4.8,
      students: 3421,
      inSubscription: true,
    },
    {
      id: 6,
      slug: "digital-marketing",
      title: "Цифровой маркетинг: полный гид",
      description: "Изучите все каналы цифрового маркетинга: SEO, контекст, соцсети, email и аналитику.",
      level: "Начальный",
      duration: "18 часов",
      price: "3,490 ₽",
      image: "/digital-marketing-dashboard.png",
      badge: "Актуальный",
      rating: 4.5,
      students: 2987,
      inSubscription: true,
    },
  ]

  const courses =
    coursesData && coursesData.length > 0
      ? coursesData.map((course) => ({
          id: course.id,
          slug: course.slug,
          title: course.title,
          description: course.description,
          level: "Все уровни",
          duration: "Различная",
          price: course.price ? `${course.price.toLocaleString()} ₽` : "Бесплатно",
          image: course.image_url || "/placeholder.svg",
          badge: "Доступен",
          rating: 4.8,
          students: 1000,
          inSubscription: true,
        }))
      : staticCourses

  const categories = ["Все курсы", "Языки", "Программирование", "Бизнес", "Маркетинг", "Дизайн", "Аналитика"]

  return (
    <div className="min-h-screen">
      <Header />

      {/* Hero Section */}
      <section className="pt-32 pb-12 px-6">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-12">
            <h1 className="text-4xl md:text-5xl font-bold font-sans mb-4">Каталог курсов</h1>
            <p className="text-xl text-muted-foreground font-serif max-w-2xl mx-auto">
              Выберите курс и начните обучение с персональным ИИ-наставником уже сегодня
            </p>
          </div>

          {/* Search and Filters */}
          <GlassCard className="p-6 mb-8">
            <div className="flex flex-col md:flex-row gap-4">
              <div className="flex-1 relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-5 h-5" />
                <Input placeholder="Поиск курсов..." className="pl-10 bg-white/50 border-white/20" />
              </div>
              <Button variant="outline" className="bg-white/10 backdrop-blur-sm border-white/20">
                <Filter className="w-4 h-4 mr-2" />
                Фильтры
              </Button>
            </div>

            {/* Categories */}
            <div className="flex flex-wrap gap-2 mt-4">
              {categories.map((category, index) => (
                <Button
                  key={category}
                  variant={index === 0 ? "default" : "outline"}
                  size="sm"
                  className={index === 0 ? "" : "bg-white/10 backdrop-blur-sm border-white/20"}
                >
                  {category}
                </Button>
              ))}
            </div>
          </GlassCard>
        </div>
      </section>

      {/* Courses Grid */}
      <section className="pb-20 px-6">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {courses.map((course) => (
              <GlassCard key={course.id} className="overflow-hidden hover:scale-105 transition-transform duration-300">
                <div className="relative">
                  <Image
                    src={course.image || "/placeholder.svg"}
                    alt={course.title}
                    width={300}
                    height={200}
                    className="w-full h-48 object-cover"
                  />
                  <Badge className="absolute top-4 left-4 bg-primary text-primary-foreground">{course.badge}</Badge>
                  {course.inSubscription && (
                    <Badge className="absolute top-4 right-4 bg-green-500 text-white">В подписке</Badge>
                  )}
                </div>

                <div className="p-6">
                  <h3 className="font-bold font-sans text-lg mb-2 line-clamp-2">{course.title}</h3>
                  <p className="text-muted-foreground font-serif text-sm mb-4 line-clamp-3">{course.description}</p>

                  {/* Course Stats */}
                  <div className="flex items-center gap-4 text-sm text-muted-foreground mb-4">
                    <div className="flex items-center gap-1">
                      <Users className="w-4 h-4" />
                      <span>{course.level}</span>
                    </div>
                    <div className="flex items-center gap-1">
                      <Clock className="w-4 h-4" />
                      <span>{course.duration}</span>
                    </div>
                    <div className="flex items-center gap-1">
                      <Star className="w-4 h-4 fill-yellow-400 text-yellow-400" />
                      <span>{course.rating}</span>
                    </div>
                  </div>

                  <div className="flex items-center gap-2 text-sm text-muted-foreground mb-4">
                    <BookOpen className="w-4 h-4" />
                    <span>{course.students.toLocaleString()} студентов</span>
                  </div>

                  {/* Price and CTA */}
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <span className="text-2xl font-bold text-primary">{course.price}</span>
                      {course.originalPrice && (
                        <span className="text-sm text-muted-foreground line-through">{course.originalPrice}</span>
                      )}
                    </div>
                    <GradientButton size="sm" asChild>
                      <Link href={`/courses/${course.slug}`}>
                        Подробнее
                        <ArrowRight className="ml-1 w-4 h-4" />
                      </Link>
                    </GradientButton>
                  </div>
                </div>
              </GlassCard>
            ))}
          </div>

          {/* Load More */}
          <div className="text-center mt-12">
            <Button variant="outline" size="lg" className="bg-white/10 backdrop-blur-sm border-white/20">
              Загрузить еще курсы
            </Button>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  )
}
