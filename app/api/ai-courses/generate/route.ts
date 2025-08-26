export const runtime = 'nodejs'
export const dynamic = 'force-dynamic'

import { NextResponse } from 'next/server'
import { openaiServer } from '@/lib/openaiServer'
import { supabaseAdmin } from '@/lib/supabase/serverClient'

interface GenerateBody {
  topic?: string
  brief?: string
  level?: string
  language?: string
  lessonsCount?: number
}

function slugify(v: string) {
  return v.toLowerCase().normalize('NFKD')
    .replace(/[^a-z0-9\u0400-\u04FF]+/gi,'-')
    .replace(/^-+|-+$/g,'')
    .slice(0,64) || 'course'
}

async function callModelJSON(prompt: string) {
  try {
    const client = openaiServer()
    const resp: any = await (client as any).chat.completions.create({
      model: process.env.OPENAI_MODEL || 'gpt-4o-mini',
      messages: [
        { role: 'system', content: 'You are an assistant that returns ONLY valid JSON.' },
        { role: 'user', content: prompt }
      ],
      response_format: { type: 'json_object' }
    })
    const content = resp.choices?.[0]?.message?.content
    if (!content) throw new Error('empty completion')
    return JSON.parse(content)
  } catch (e) {
    console.warn('[ai-courses/generate] model JSON failed, fallback plan', e)
    return {
      plan: {
        title: 'Demo Автокурс',
        description: 'Локально сгенерированный демо план (без OpenAI).',
        lessons: [
          { title: 'Введение', kind: 'text', body: 'Это демонстрационный вводный урок. Добавьте OPENAI_API_KEY для реального контента.' },
          { title: 'Квиз по введению', kind: 'quiz', question: 'Что нужно для реального AI контента?', options: ['Ничего', 'OPENAI_API_KEY', 'SQL'], correctIndex: 1, explanation: 'Нужен установленный ключ OpenAI.' },
          { title: 'Практика', kind: 'practice', prompt: 'Опишите свои цели обучения.' },
          { title: 'Голос', kind: 'voice', phrase: 'Искуственный интеллект помогает учиться быстрее.' }
        ]
      }
    }
  }
}

export async function POST(req: Request) {
  try {
    const body = await req.json() as GenerateBody
    const topic = body.topic || body.brief || 'Новый практический курс'
    const lessonsCount = Math.min(Math.max(body.lessonsCount || 4, 2), 12)
    const prompt = `Сгенерируй JSON план курса. Формат {"plan": {"title": string, "description": string, "lessons": Array<{title:string, kind:"text"|"quiz"|"practice"|"voice", body?:string, question?:string, options?:string[], correctIndex?:number, explanation?:string, prompt?:string, phrase?:string}>}}. Тема: ${topic}. Кол-во уроков: ${lessonsCount}. Используй разнообразные kind.`

    const modelResult = await callModelJSON(prompt)
    const plan = modelResult.plan || modelResult || {}
    if (!plan.title || !Array.isArray(plan.lessons)) {
      return NextResponse.json({ error: 'bad_plan' }, { status: 500 })
    }

    const supabase = supabaseAdmin()
    // Insert course
    const slugBase = slugify(plan.title)
    const slug = slugBase + '-' + Math.random().toString(36).slice(2,6)
    const { data: course, error: courseErr } = await supabase
      .from('courses')
      .insert({
        title: plan.title,
        slug,
        description: plan.description?.slice(0, 1000) || null,
        price: 0,
        image_url: '/placeholder.svg',
        is_published: true
      })
      .select('*')
      .single()
    if (courseErr) {
      console.error('[ai-courses/generate] course insert error', courseErr)
      return NextResponse.json({ error: 'course_insert_failed', details: courseErr.message }, { status: 500 })
    }

    // Insert lessons sequentially
    const createdLessonIds: string[] = []
    for (let i=0;i<plan.lessons.length;i++) {
      const l = plan.lessons[i]
      const contentObj = { kind: l.kind, body: l.body, question: l.question, options: l.options, correctIndex: l.correctIndex, explanation: l.explanation, prompt: l.prompt, phrase: l.phrase }
      const contentStr = JSON.stringify({ generator: 'ai-course', ...contentObj })
      const { data: lesson, error: lessonErr } = await supabase
        .from('lessons')
        .insert({
          course_id: course.id,
          title: l.title?.slice(0,200) || `Урок ${i+1}`,
          slug: slugify(l.title || ('lesson-'+(i+1)))+'-'+Math.random().toString(36).slice(2,5),
          content: contentStr,
          order_index: i,
          duration: 5,
          is_published: true
        })
        .select('id')
        .single()
      if (lessonErr) {
        console.warn('[ai-courses/generate] lesson insert failed', lessonErr)
        continue
      }
      if (lesson?.id) createdLessonIds.push(lesson.id)
    }

    return NextResponse.json({ course_id: course.id, lesson_ids: createdLessonIds, slug: course.slug })
  } catch (e: any) {
    console.error('[ai-courses/generate] fatal', e)
    return NextResponse.json({ error: 'internal_error', message: e.message }, { status: 500 })
  }
}
