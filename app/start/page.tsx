import { cookies } from 'next/headers'
import { redirect } from 'next/navigation'
import { jwtVerify } from 'jose'
import { getCourses, getLessons } from '@/lib/db'

// Интеллектуальный старт обучения:
// 1. Проверяем промо-сессию
// 2. Находим первый опубликованный курс
// 3. Находим его первый урок
// 4. Редиректим прямо на страницу урока
// Fallback: если что-то отсутствует — /courses (или /promo если нет доступа)
export default async function StartPage() {
  const cookieStore = cookies()
  const token = cookieStore.get('promo_session')?.value
  if (!token) {
    redirect('/promo')
  }
  try {
    const secret = new TextEncoder().encode(process.env.JWT_SECRET!)
    const { payload } = await jwtVerify(token, secret)
    if ((payload as any).scope !== 'promo') throw new Error('bad scope')

    const courses = await getCourses('', 10, 0)
    if (!courses.length) {
      redirect('/courses')
    }
    const course = courses[0]
    const lessons = await getLessons(course.id)
    if (!lessons.length) {
      redirect(`/courses/${course.slug}`)
    }
    const firstLesson = lessons[0]
    redirect(`/courses/${course.slug}/lessons/${firstLesson.id}`)
  } catch {
    redirect('/promo')
  }
}
