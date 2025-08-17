import { Header } from "@/components/layout/header"
import { Footer } from "@/components/layout/footer"
import { GlassCard } from "@/components/ui/glass-card"
import { Button } from "@/components/ui/button"
import { Progress } from "@/components/ui/progress"
import { Play, Clock, Users, Star } from "lucide-react"
import { notFound } from "next/navigation"
import { getCourse, getLessons } from "@/lib/db"
import Link from "next/link"
import Image from "next/image"

export default async function CoursePage({ params }: { params: { slug: string } }) {
  const slug = params.slug
  if (process.env.NODE_ENV === "development") {
    console.log("[v0] Fetching course with slug:", slug)
  }

  const course = await getCourse(slug)
  if (process.env.NODE_ENV === "development") {
    console.log("[v0] Course data:", course)
  }

  if (!course) {
    notFound()
  }

  const lessons = await getLessons(course.id)
  const firstLesson = lessons[0]

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50">
      <Header />
      <main className="container mx-auto px-6 py-8 pt-24">
        <div className="max-w-4xl mx-auto">
          {/* Course Header */}
          <GlassCard className="p-8 mb-8">
            <div className="flex flex-col lg:flex-row gap-8">
              <div className="flex-1">
                <h1 className="text-3xl font-bold font-sans mb-4">{course.title}</h1>
                <p className="text-lg text-muted-foreground font-serif mb-6 leading-relaxed break-words whitespace-pre-wrap">
                  {course.description}
                </p>

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

                {firstLesson ? (
                  <Link href={`/courses/${slug}/lessons/${firstLesson.id}`}>
                    <Button size="lg" className="w-full sm:w-auto">
                      <Play className="mr-2 h-5 w-5" />
                      Начать изучение
                    </Button>
                  </Link>
                ) : (
                  <Button size="lg" className="w-full sm:w-auto" disabled>
                    <Play className="mr-2 h-5 w-5" />
                    Уроки скоро появятся
                  </Button>
                )}
              </div>

              <div className="lg:w-80">
                <Image
                  src={course.image_url || "/placeholder-848vc.png"}
                  alt={course.title}
                  width={320}
                  height={192}
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
                  <Link href={`/courses/${slug}/lessons/${lesson.id}`}>
                    <Button variant="ghost" size="sm">
                      <Play className="w-4 h-4" />
                    </Button>
                  </Link>
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
