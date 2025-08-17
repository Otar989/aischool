import Link from "next/link"
import { query } from "@/lib/db"
import { GlassCard } from "@/components/ui/glass-card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Plus, Edit, Trash2 } from "lucide-react"

export default async function CoursesPage() {
  const courses = await query(`
    SELECT 
      c.id, c.title, c.description, c.price_cents, c.is_published, c.created_at,
      COUNT(l.id) as lesson_count,
      COUNT(e.id) as enrollment_count
    FROM courses c
    LEFT JOIN lessons l ON c.id = l.course_id
    LEFT JOIN enrollments e ON c.id = e.course_id
    GROUP BY c.id, c.title, c.description, c.price_cents, c.is_published, c.created_at
    ORDER BY c.created_at DESC
  `)

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-white mb-2">Курсы</h1>
          <p className="text-white/60">Управление курсами и уроками</p>
        </div>
        <Link href="/admin/courses/new">
          <Button className="bg-primary hover:bg-primary/80">
            <Plus className="w-4 h-4 mr-2" />
            Создать курс
          </Button>
        </Link>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {courses.rows.map((course: any) => (
          <GlassCard key={course.id} className="p-6">
            <div className="flex items-start justify-between mb-4">
              <Badge
                className={`${
                  course.is_published ? "bg-green-500/20 text-green-400" : "bg-yellow-500/20 text-yellow-400"
                }`}
              >
                {course.is_published ? "Опубликован" : "Черновик"}
              </Badge>
              <div className="flex gap-2">
                <Button variant="ghost" size="sm" className="text-white/70 hover:text-white">
                  <Edit className="w-4 h-4" />
                </Button>
                <Button variant="ghost" size="sm" className="text-red-400 hover:text-red-300">
                  <Trash2 className="w-4 h-4" />
                </Button>
              </div>
            </div>

            <h3 className="text-lg font-semibold text-white mb-2">{course.title}</h3>
            <p className="text-white/60 text-sm mb-4 line-clamp-2">{course.description}</p>

            <div className="space-y-2 text-sm">
              <div className="flex justify-between">
                <span className="text-white/60">Цена:</span>
                <span className="text-white">{(course.price_cents / 100).toLocaleString()} ₽</span>
              </div>
              <div className="flex justify-between">
                <span className="text-white/60">Уроков:</span>
                <span className="text-white">{course.lesson_count}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-white/60">Студентов:</span>
                <span className="text-white">{course.enrollment_count}</span>
              </div>
            </div>

            <div className="mt-4 pt-4 border-t border-white/10">
              <Link href={`/admin/courses/${course.id}`}>
                <Button variant="outline" className="w-full bg-white/10 border-white/20 text-white hover:bg-white/20">
                  Управление курсом
                </Button>
              </Link>
            </div>
          </GlassCard>
        ))}
      </div>
    </div>
  )
}
