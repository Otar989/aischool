import { Header } from "@/components/layout/header"
import { Footer } from "@/components/layout/footer"
import { GlassCard } from "@/components/ui/glass-card"
import { GradientButton } from "@/components/ui/gradient-button"
import { Button } from "@/components/ui/button"
import { Progress } from "@/components/ui/progress"
import { BookOpen, Award, MessageCircle, ArrowRight, CheckCircle, Target } from "lucide-react"
import Link from "next/link"
import Image from "next/image"

// Mock user data - in real app this would come from database
const userData = {
  name: "Анна Петрова",
  email: "anna@example.com",
  avatar: "/professional-woman-avatar.png",
  joinDate: "2024-01-15",
  totalLearningTime: 45, // hours
  completedCourses: 2,
  activeCourses: 3,
  certificates: 2,
  currentStreak: 7, // days
  totalPoints: 1250,
}

const enrolledCourses = [
  {
    id: "1",
    title: "Разговорный китайский для поставщиков",
    progress: 65,
    totalLessons: 7,
    completedLessons: 4,
    lastAccessed: "2024-01-20",
    nextLesson: "Логистика и доставка",
    image: "/placeholder-90s8j.png",
    timeSpent: 8, // hours
  },
  {
    id: "2",
    title: "Telegram Mini Apps: старт за 7 дней",
    progress: 30,
    totalLessons: 10,
    completedLessons: 3,
    lastAccessed: "2024-01-18",
    nextLesson: "Создание интерфейса",
    image: "/telegram-mini-app-dev.png",
    timeSpent: 6, // hours
  },
  {
    id: "3",
    title: "Инженерия промптов: мастерство работы с ИИ",
    progress: 100,
    totalLessons: 6,
    completedLessons: 6,
    lastAccessed: "2024-01-10",
    nextLesson: null,
    image: "/ai-prompt-dashboard.png",
    timeSpent: 8, // hours
    completed: true,
  },
]

const recentActivity = [
  {
    type: "lesson_completed",
    title: "Завершен урок 'Контроль качества'",
    course: "Разговорный китайский для поставщиков",
    timestamp: "2 часа назад",
    points: 50,
  },
  {
    type: "chat_session",
    title: "Сессия с ИИ-наставником",
    course: "Telegram Mini Apps",
    timestamp: "1 день назад",
    duration: "25 минут",
  },
  {
    type: "certificate_earned",
    title: "Получен сертификат",
    course: "Инженерия промптов",
    timestamp: "3 дня назад",
    points: 100,
  },
  {
    type: "course_started",
    title: "Начат новый курс",
    course: "Разговорный китайский для поставщиков",
    timestamp: "1 неделя назад",
    points: 25,
  },
]

const achievements = [
  {
    id: "first_course",
    title: "Первый курс",
    description: "Завершите свой первый курс",
    icon: "🎓",
    earned: true,
    earnedDate: "2024-01-10",
  },
  {
    id: "week_streak",
    title: "Неделя подряд",
    description: "Учитесь 7 дней подряд",
    icon: "🔥",
    earned: true,
    earnedDate: "2024-01-20",
  },
  {
    id: "ai_master",
    title: "Мастер ИИ",
    description: "Проведите 50 сессий с ИИ-наставником",
    icon: "🤖",
    earned: false,
    progress: 32,
    target: 50,
  },
  {
    id: "polyglot",
    title: "Полиглот",
    description: "Изучите 3 языка",
    icon: "🌍",
    earned: false,
    progress: 1,
    target: 3,
  },
]

export default function DashboardPage() {
  return (
    <div className="min-h-screen">
      <Header />

      <div className="pt-32 pb-20 px-6">
        <div className="max-w-7xl mx-auto">
          {/* Welcome Section */}
          <div className="mb-8">
            <div className="flex items-center gap-4 mb-4">
              <Image
                src={userData.avatar || "/placeholder.svg"}
                alt={userData.name}
                width={64}
                height={64}
                className="rounded-full"
              />
              <div>
                <h1 className="text-3xl font-bold font-sans">Добро пожаловать, {userData.name}!</h1>
                <p className="text-muted-foreground font-serif">Продолжайте свое обучение с ИИ-наставником</p>
              </div>
            </div>

            {/* Stats Cards */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <GlassCard className="p-4 text-center">
                <div className="text-2xl font-bold text-primary mb-1">{userData.totalLearningTime}ч</div>
                <div className="text-sm text-muted-foreground">Время обучения</div>
              </GlassCard>
              <GlassCard className="p-4 text-center">
                <div className="text-2xl font-bold text-primary mb-1">{userData.activeCourses}</div>
                <div className="text-sm text-muted-foreground">Активных курсов</div>
              </GlassCard>
              <GlassCard className="p-4 text-center">
                <div className="text-2xl font-bold text-primary mb-1">{userData.certificates}</div>
                <div className="text-sm text-muted-foreground">Сертификатов</div>
              </GlassCard>
              <GlassCard className="p-4 text-center">
                <div className="text-2xl font-bold text-primary mb-1">{userData.currentStreak}</div>
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
                <div className="space-y-4">
                  {enrolledCourses
                    .filter((course) => !course.completed)
                    .map((course) => (
                      <GlassCard key={course.id} className="p-6">
                        <div className="flex items-start gap-4">
                          <Image
                            src={course.image || "/placeholder.svg"}
                            alt={course.title}
                            width={80}
                            height={60}
                            className="rounded-lg object-cover"
                          />
                          <div className="flex-1 min-w-0">
                            <h3 className="font-bold font-sans text-lg mb-2 truncate">{course.title}</h3>
                            <div className="flex items-center gap-4 text-sm text-muted-foreground mb-3">
                              <span>
                                {course.completedLessons} из {course.totalLessons} уроков
                              </span>
                              <span>{course.timeSpent}ч изучено</span>
                            </div>
                            <div className="mb-4">
                              <div className="flex items-center justify-between text-sm mb-1">
                                <span>Прогресс</span>
                                <span>{course.progress}%</span>
                              </div>
                              <Progress value={course.progress} className="h-2" />
                            </div>
                            {course.nextLesson && (
                              <div className="flex items-center justify-between">
                                <span className="text-sm text-muted-foreground">
                                  Следующий урок: {course.nextLesson}
                                </span>
                                <GradientButton size="sm" asChild>
                                  <Link href={`/learn/${course.id}/next`}>
                                    Продолжить
                                    <ArrowRight className="ml-1 w-4 h-4" />
                                  </Link>
                                </GradientButton>
                              </div>
                            )}
                          </div>
                        </div>
                      </GlassCard>
                    ))}
                </div>
              </section>

              {/* Recent Activity */}
              <section>
                <h2 className="text-2xl font-bold font-sans mb-6">Последняя активность</h2>
                <GlassCard className="p-6">
                  <div className="space-y-4">
                    {recentActivity.map((activity, index) => (
                      <div key={index} className="flex items-start gap-3 pb-4 border-b border-white/10 last:border-b-0">
                        <div className="w-8 h-8 rounded-full bg-primary/20 flex items-center justify-center flex-shrink-0 mt-1">
                          {activity.type === "lesson_completed" && <CheckCircle className="w-4 h-4 text-primary" />}
                          {activity.type === "chat_session" && <MessageCircle className="w-4 h-4 text-primary" />}
                          {activity.type === "certificate_earned" && <Award className="w-4 h-4 text-primary" />}
                          {activity.type === "course_started" && <BookOpen className="w-4 h-4 text-primary" />}
                        </div>
                        <div className="flex-1 min-w-0">
                          <div className="font-medium">{activity.title}</div>
                          <div className="text-sm text-muted-foreground">{activity.course}</div>
                          <div className="flex items-center gap-4 text-xs text-muted-foreground mt-1">
                            <span>{activity.timestamp}</span>
                            {activity.points && <span>+{activity.points} баллов</span>}
                            {activity.duration && <span>{activity.duration}</span>}
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </GlassCard>
              </section>
            </div>

            {/* Sidebar */}
            <div className="lg:col-span-1 space-y-6">
              {/* Achievements */}
              <GlassCard className="p-6">
                <h3 className="font-bold font-sans mb-4">Достижения</h3>
                <div className="space-y-3">
                  {achievements.map((achievement) => (
                    <div
                      key={achievement.id}
                      className={`flex items-center gap-3 p-3 rounded-lg ${
                        achievement.earned
                          ? "bg-green-500/10 border border-green-500/20"
                          : "bg-white/5 border border-white/10"
                      }`}
                    >
                      <div className="text-2xl">{achievement.icon}</div>
                      <div className="flex-1 min-w-0">
                        <div className="font-medium text-sm">{achievement.title}</div>
                        <div className="text-xs text-muted-foreground">{achievement.description}</div>
                        {!achievement.earned && achievement.progress && (
                          <div className="mt-1">
                            <Progress value={(achievement.progress / achievement.target!) * 100} className="h-1" />
                            <div className="text-xs text-muted-foreground mt-1">
                              {achievement.progress}/{achievement.target}
                            </div>
                          </div>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              </GlassCard>

              {/* Learning Streak */}
              <GlassCard className="p-6">
                <h3 className="font-bold font-sans mb-4">Серия обучения</h3>
                <div className="text-center">
                  <div className="text-3xl font-bold text-primary mb-2">{userData.currentStreak}</div>
                  <div className="text-sm text-muted-foreground mb-4">дней подряд</div>
                  <div className="grid grid-cols-7 gap-1">
                    {Array.from({ length: 7 }, (_, i) => (
                      <div
                        key={i}
                        className={`w-6 h-6 rounded-sm ${i < userData.currentStreak ? "bg-primary" : "bg-white/10"}`}
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

              {/* Recommendations */}
              <GlassCard className="p-6">
                <h3 className="font-bold font-sans mb-4">Рекомендации</h3>
                <div className="space-y-3">
                  <div className="p-3 rounded-lg bg-white/5 border border-white/10">
                    <div className="font-medium text-sm mb-1">Python для автоматизации</div>
                    <div className="text-xs text-muted-foreground mb-2">
                      На основе ваших интересов к программированию
                    </div>
                    <Button size="sm" variant="outline" className="w-full bg-white/10 border-white/20">
                      Подробнее
                    </Button>
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
