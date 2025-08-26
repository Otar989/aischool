"use client"

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { Header } from '@/components/layout/header'
import { Footer } from '@/components/layout/footer'
import { GlassCard } from '@/components/ui/glass-card'
import { Button } from '@/components/ui/button'
import { Textarea } from '@/components/ui/textarea'
import { Input } from '@/components/ui/input'
import { Progress } from '@/components/ui/progress'
import { Loader2, Sparkles } from 'lucide-react'

export default function AICourseNewPage() {
  const router = useRouter()
  const [topic, setTopic] = useState('Практический курс по применению AI в ежедневной работе')
  const [lessons, setLessons] = useState(6)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [log, setLog] = useState<string[]>([])
  const [progress, setProgress] = useState(0)

  async function handleGenerate(e: React.FormEvent) {
    e.preventDefault()
    if (!topic.trim()) return
    setLoading(true)
    setError(null)
    setLog(['Отправляем запрос модели...'])
    setProgress(5)
    try {
      const resp = await fetch('/api/ai-courses/generate', {
        method: 'POST',
        headers: { 'content-type': 'application/json' },
        body: JSON.stringify({ topic: topic.trim(), lessonsCount: lessons })
      })
      if (!resp.ok) {
        const txt = await resp.text()
        setError('Ошибка генерации: ' + txt)
        return
      }
      setProgress(70)
      const js = await resp.json()
      setLog(l => [...l, 'Курс сохранён в базе'])
      setProgress(90)
      if (js.slug) {
        setLog(l => [...l, 'Переход к курсу...'])
        setProgress(100)
        setTimeout(() => router.push('/courses/' + js.slug), 400)
      } else {
        setError('Не получили slug курса')
      }
    } catch (e: any) {
      setError(e.message || 'Неизвестная ошибка')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <main className="flex-1 container mx-auto px-6 pt-24 pb-16 max-w-3xl">
        <h1 className="text-3xl font-bold mb-6 flex items-center gap-2"><Sparkles className="w-7 h-7 text-purple-600"/> Генерация AI курса</h1>
        <GlassCard className="p-8 space-y-6">
          <p className="text-muted-foreground text-sm leading-relaxed">Опишите тему, целевую аудиторию или задачи обучения — система сгенерирует структуру курса и уроки (текст, квизы, практику). Нужен действующий OPENAI_API_KEY на сервере. При отсутствии ключа будет создан демонстрационный курс.</p>
          <form onSubmit={handleGenerate} className="space-y-5">
            <div className="space-y-2">
              <label className="text-sm font-medium">Тема / бриф</label>
              <Textarea rows={4} value={topic} onChange={e=>setTopic(e.target.value)} placeholder="Например: Быстрый старт по внедрению AI в отдел маркетинга"/>
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium">Количество уроков (2-12)</label>
              <Input type="number" min={2} max={12} value={lessons} onChange={e=> setLessons(Math.min(12, Math.max(2, Number(e.target.value)||6)))} />
            </div>
            <div className="space-y-3">
              <Button type="submit" disabled={loading} className="min-w-56">
                {loading && <Loader2 className="w-4 h-4 mr-2 animate-spin"/>}
                {loading ? 'Генерируем...' : 'Сгенерировать курс'}
              </Button>
              {loading && <Progress value={progress} className="h-2"/>}
            </div>
          </form>
          {error && <div className="p-3 rounded border border-red-300 bg-red-50 text-sm text-red-700">{error}</div>}
          {log.length > 0 && (
            <div className="text-xs space-y-1">
              {log.map((l,i)=>(<div key={i} className="text-muted-foreground">{l}</div>))}
            </div>
          )}
          <div className="pt-4 border-t text-xs text-muted-foreground leading-relaxed">
            <p><strong>Примечание:</strong> Курс создаётся сразу опубликованным (is_published = true). Если нужно ограничить доступ — отредактируйте запись в таблице courses.</p>
          </div>
        </GlassCard>
      </main>
      <Footer />
    </div>
  )
}
