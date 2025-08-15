import { Header } from "@/components/layout/header"
import { Footer } from "@/components/layout/footer"
import { GlassCard } from "@/components/ui/glass-card"
import { GradientButton } from "@/components/ui/gradient-button"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import {
  BookOpen,
  MessageCircle,
  Award,
  Users,
  Clock,
  Star,
  CheckCircle,
  ArrowRight,
  Play,
  Mic,
  Brain,
} from "lucide-react"
import Link from "next/link"
import Image from "next/image"

export default function HomePage() {
  return (
    <div className="min-h-screen">
      <Header />

      {/* Hero Section */}
      <section className="pt-32 pb-20 px-6">
        <div className="max-w-7xl mx-auto text-center">
          <Badge variant="secondary" className="mb-6 bg-primary/10 text-primary border-primary/20">
            🚀 Новая эра онлайн-образования
          </Badge>

          <h1 className="text-4xl md:text-6xl font-bold font-sans mb-6 bg-gradient-to-r from-foreground to-foreground/70 bg-clip-text text-transparent">
            Учитесь с персональным
            <br />
            <span className="bg-gradient-to-r from-primary to-blue-600 bg-clip-text text-transparent">
              ИИ-наставником
            </span>
          </h1>

          <p className="text-xl text-muted-foreground mb-8 max-w-3xl mx-auto font-serif">
            Революционная платформа, где искусственный интеллект адаптируется под ваш стиль обучения, ведет диалог
            голосом и текстом, проверяет задания и помогает достигать целей быстрее.
          </p>

          <div className="flex flex-col sm:flex-row gap-4 justify-center mb-12">
            <GradientButton size="lg" className="text-lg px-8 py-6" asChild>
              <Link href="/promo">
                Начать бесплатно
                <ArrowRight className="ml-2 w-5 h-5" />
              </Link>
            </GradientButton>
            <Button
              size="lg"
              variant="outline"
              className="text-lg px-8 py-6 bg-white/10 backdrop-blur-sm border-white/20"
              asChild
            >
              <Link href="/demo">
                <Play className="mr-2 w-5 h-5" />
                Демо-урок
              </Link>
            </Button>
          </div>

          {/* Hero Visual */}
          <GlassCard className="max-w-4xl mx-auto p-8 relative overflow-hidden">
            <div className="absolute inset-0 bg-gradient-to-br from-primary/5 to-blue-600/5" />
            <div className="relative">
              <Image
                src="/ai-learning-dashboard-chat.png"
                alt="AI Learning Platform Interface"
                width={600}
                height={400}
                className="rounded-xl shadow-2xl mx-auto"
              />
              <div className="absolute -top-4 -right-4 bg-green-500 text-white px-3 py-1 rounded-full text-sm font-medium">
                ИИ онлайн
              </div>
            </div>
          </GlassCard>
        </div>
      </section>

      {/* How It Works */}
      <section className="py-20 px-6">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold font-sans mb-4">Как это работает</h2>
            <p className="text-xl text-muted-foreground font-serif">Три простых шага к эффективному обучению</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[
              {
                step: "01",
                icon: <BookOpen className="w-8 h-8" />,
                title: "Выберите курс",
                description: "Изучите каталог курсов и выберите подходящий для ваших целей и уровня подготовки.",
              },
              {
                step: "02",
                icon: <MessageCircle className="w-8 h-8" />,
                title: "Общайтесь с ИИ",
                description:
                  "Ваш персональный наставник ведет урок, отвечает на вопросы голосом и текстом, адаптируется под вас.",
              },
              {
                step: "03",
                icon: <Award className="w-8 h-8" />,
                title: "Получите сертификат",
                description:
                  "Завершите курс, пройдите финальную оценку и получите официальный сертификат о прохождении.",
              },
            ].map((item, index) => (
              <GlassCard key={index} className="p-8 text-center hover:scale-105 transition-transform duration-300">
                <div className="w-16 h-16 rounded-full bg-gradient-to-br from-primary to-blue-600 flex items-center justify-center mx-auto mb-6 text-white">
                  {item.icon}
                </div>
                <div className="text-sm font-mono text-primary mb-2">{item.step}</div>
                <h3 className="text-xl font-bold font-sans mb-4">{item.title}</h3>
                <p className="text-muted-foreground font-serif">{item.description}</p>
              </GlassCard>
            ))}
          </div>
        </div>
      </section>

      {/* Course Preview */}
      <section className="py-20 px-6 bg-gradient-to-b from-transparent to-primary/5">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold font-sans mb-4">Популярные курсы</h2>
            <p className="text-xl text-muted-foreground font-serif">Начните обучение с самых востребованных программ</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[
              {
                title: "Разговорный китайский для поставщиков",
                description: "7 практических ситуаций для работы с китайскими партнерами",
                level: "Начальный",
                duration: "12 часов",
                price: "2,990 ₽",
                image: "/placeholder-90s8j.png",
                badge: "Хит продаж",
              },
              {
                title: "Telegram Mini Apps за 7 дней",
                description: "От идеи до публикации вашего первого мини-приложения",
                level: "Средний",
                duration: "20 часов",
                price: "4,990 ₽",
                image: "/telegram-mini-app-dev.png",
                badge: "Новинка",
              },
              {
                title: "Инженерия промптов: мастерство работы с ИИ",
                description: "Создавайте эффективные промпты для лучших результатов",
                level: "Продвинутый",
                duration: "8 часов",
                price: "1,990 ₽",
                image: "/ai-prompt-dashboard.png",
                badge: "Эксклюзив",
              },
            ].map((course, index) => (
              <GlassCard key={index} className="overflow-hidden hover:scale-105 transition-transform duration-300">
                <div className="relative">
                  <Image
                    src={course.image || "/placeholder.svg"}
                    alt={course.title}
                    width={300}
                    height={200}
                    className="w-full h-48 object-cover"
                  />
                  <Badge className="absolute top-4 left-4 bg-primary text-primary-foreground">{course.badge}</Badge>
                </div>
                <div className="p-6">
                  <h3 className="font-bold font-sans text-lg mb-2">{course.title}</h3>
                  <p className="text-muted-foreground font-serif text-sm mb-4">{course.description}</p>

                  <div className="flex items-center gap-4 text-sm text-muted-foreground mb-4">
                    <div className="flex items-center gap-1">
                      <Users className="w-4 h-4" />
                      <span>{course.level}</span>
                    </div>
                    <div className="flex items-center gap-1">
                      <Clock className="w-4 h-4" />
                      <span>{course.duration}</span>
                    </div>
                  </div>

                  <div className="flex items-center justify-between">
                    <span className="text-2xl font-bold text-primary">{course.price}</span>
                    <GradientButton size="sm" asChild>
                      <Link href={`/courses/${index + 1}`}>Подробнее</Link>
                    </GradientButton>
                  </div>
                </div>
              </GlassCard>
            ))}
          </div>

          <div className="text-center mt-12">
            <Button variant="outline" size="lg" className="bg-white/10 backdrop-blur-sm border-white/20" asChild>
              <Link href="/courses">
                Все курсы
                <ArrowRight className="ml-2 w-5 h-5" />
              </Link>
            </Button>
          </div>
        </div>
      </section>

      {/* Features */}
      <section className="py-20 px-6">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold font-sans mb-4">Преимущества обучения с ИИ</h2>
            <p className="text-xl text-muted-foreground font-serif">Технологии будущего уже сегодня</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {[
              {
                icon: <Brain className="w-8 h-8" />,
                title: "Адаптивное обучение",
                description: "ИИ анализирует ваш прогресс и подстраивает сложность материала под ваш уровень",
              },
              {
                icon: <Mic className="w-8 h-8" />,
                title: "Голосовое общение",
                description: "Говорите с наставником голосом, как с живым преподавателем",
              },
              {
                icon: <CheckCircle className="w-8 h-8" />,
                title: "Мгновенная проверка",
                description: "Получайте детальную обратную связь по заданиям в режиме реального времени",
              },
              {
                icon: <Clock className="w-8 h-8" />,
                title: "24/7 доступность",
                description: "Учитесь в любое время, ИИ-наставник всегда готов помочь",
              },
              {
                icon: <Users className="w-8 h-8" />,
                title: "Персонализация",
                description: "Индивидуальный подход к каждому студенту на основе данных об обучении",
              },
              {
                icon: <Award className="w-8 h-8" />,
                title: "Сертификация",
                description: "Официальные сертификаты о прохождении курсов для вашего портфолио",
              },
            ].map((feature, index) => (
              <GlassCard key={index} className="p-6 text-center hover:scale-105 transition-transform duration-300">
                <div className="w-16 h-16 rounded-full bg-gradient-to-br from-primary/20 to-blue-600/20 flex items-center justify-center mx-auto mb-4 text-primary">
                  {feature.icon}
                </div>
                <h3 className="font-bold font-sans text-lg mb-2">{feature.title}</h3>
                <p className="text-muted-foreground font-serif text-sm">{feature.description}</p>
              </GlassCard>
            ))}
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section className="py-20 px-6 bg-gradient-to-b from-primary/5 to-transparent">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold font-sans mb-4">Отзывы студентов</h2>
            <p className="text-xl text-muted-foreground font-serif">Что говорят те, кто уже учится с нами</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[
              {
                name: "Анна Петрова",
                role: "Менеджер по закупкам",
                content:
                  "Благодаря курсу китайского я смогла наладить прямое общение с поставщиками. ИИ-наставник терпеливо исправлял произношение и объяснял культурные особенности.",
                rating: 5,
                avatar: "/professional-woman-avatar.png",
              },
              {
                name: "Дмитрий Козлов",
                role: "Frontend разработчик",
                content:
                  "Создал свое первое Telegram Mini App за неделю! Курс очень практичный, а ИИ помогал разбираться с кодом в режиме реального времени.",
                rating: 5,
                avatar: "/male-developer-avatar.png",
              },
              {
                name: "Елена Смирнова",
                role: "Маркетолог",
                content:
                  "Курс по промпт-инженерии кардинально изменил мою работу с ИИ. Теперь получаю в 3 раза лучшие результаты от ChatGPT и других инструментов.",
                rating: 5,
                avatar: "/professional-woman-marketer-avatar.png",
              },
            ].map((testimonial, index) => (
              <GlassCard key={index} className="p-6">
                <div className="flex items-center gap-1 mb-4">
                  {[...Array(testimonial.rating)].map((_, i) => (
                    <Star key={i} className="w-5 h-5 fill-yellow-400 text-yellow-400" />
                  ))}
                </div>
                <p className="text-muted-foreground font-serif mb-6 italic">"{testimonial.content}"</p>
                <div className="flex items-center gap-3">
                  <Image
                    src={testimonial.avatar || "/placeholder.svg"}
                    alt={testimonial.name}
                    width={48}
                    height={48}
                    className="rounded-full"
                  />
                  <div>
                    <div className="font-semibold font-sans">{testimonial.name}</div>
                    <div className="text-sm text-muted-foreground">{testimonial.role}</div>
                  </div>
                </div>
              </GlassCard>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 px-6">
        <div className="max-w-4xl mx-auto text-center">
          <GlassCard className="p-12 relative overflow-hidden">
            <div className="absolute inset-0 bg-gradient-to-br from-primary/10 to-blue-600/10" />
            <div className="relative">
              <h2 className="text-3xl md:text-4xl font-bold font-sans mb-6">Готовы начать обучение?</h2>
              <p className="text-xl text-muted-foreground font-serif mb-8">
                Присоединяйтесь к тысячам студентов, которые уже изменили свою жизнь с помощью ИИ-образования
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <GradientButton size="lg" className="text-lg px-8 py-6" asChild>
                  <Link href="/promo">
                    Начать бесплатно
                    <ArrowRight className="ml-2 w-5 h-5" />
                  </Link>
                </GradientButton>
                <Button
                  size="lg"
                  variant="outline"
                  className="text-lg px-8 py-6 bg-white/10 backdrop-blur-sm border-white/20"
                  asChild
                >
                  <Link href="/courses">Выбрать курс</Link>
                </Button>
              </div>
            </div>
          </GlassCard>
        </div>
      </section>

      <Footer />
    </div>
  )
}
