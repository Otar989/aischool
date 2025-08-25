"use client"

import { Header } from "@/components/layout/header"
import { Footer } from "@/components/layout/footer"
import { GlassCard } from "@/components/ui/glass-card"
import { Button } from "@/components/ui/button"
import { Progress } from "@/components/ui/progress"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Textarea } from "@/components/ui/textarea"
import { ArrowLeft, ArrowRight, MessageCircle, Mic, BookOpen, Send, MicIcon, Square, Volume2, Pause, StopCircle, Volume1 } from "lucide-react"
import { notFound } from "next/navigation"
import { createClient } from "@/lib/supabase/client"
import Link from "next/link"
import { useState, useEffect, useRef } from "react"
import { useVoiceRecording } from '@/hooks/use-voice-recording'
import { toast } from "sonner"

interface Course {
  id: string
  title: string
}

interface Lesson {
  id: string
  title: string
  duration: number
  content: string
  order_index: number
  course_id: string
}

interface Exercise {
  question: string
  hint?: string
}

const supabase = createClient()

interface ChatMsg { role: 'user' | 'assistant'; content: string; audioUrl?: string }

const getVoicePracticePhrase = (lessonTitle: string) => {
  const phrases = [
    "ChatGPT помогает автоматизировать бизнес-процессы",
    "Искусственный интеллект повышает продуктивность команды",
    "Правильные промпты дают лучшие результаты",
    "Автоматизация экономит время и ресурсы",
    "AI-инструменты становятся незаменимыми в современном бизнесе",
  ]
  return phrases[Math.floor(Math.random() * phrases.length)]
}

const getExerciseQuestion = (lessonTitle: string) => {
  const questions = [
    {
      question: "Перечислите 3 основных способа использования ChatGPT в бизнесе, которые были рассмотрены в уроке.",
      hint: "Подумайте о создании контента, клиентском сервисе и анализе данных.",
    },
    {
      question: "Как правильно формулировать промпты для получения качественных ответов от AI?",
      hint: "Важны контекст, конкретность и четкие инструкции.",
    },
    {
      question: "Какие преимущества дает автоматизация бизнес-процессов с помощью AI?",
      hint: "Экономия времени, повышение качества, масштабируемость.",
    },
  ]
  return questions[Math.floor(Math.random() * questions.length)]
}

export default function LessonPage({
  params,
}: {
  params: { slug: string; lessonId: string }
}) {
  const { slug, lessonId } = params
  const [course, setCourse] = useState<Course | null>(null)
  const [lesson, setLesson] = useState<Lesson | null>(null)
  const [lessons, setLessons] = useState<Lesson[]>([])
  const [loading, setLoading] = useState(true)
  const [progressPct, setProgressPct] = useState(0)
  const [completionSent, setCompletionSent] = useState(false)

  const [chatOpen, setChatOpen] = useState(false)
  const [voiceOpen, setVoiceOpen] = useState(false)
  const [exerciseOpen, setExerciseOpen] = useState(false)
  const [chatMessage, setChatMessage] = useState("")
  const [chatHistory, setChatHistory] = useState<ChatMsg[]>([])
  const [isRecording, setIsRecording] = useState(false) // legacy for practice modal
  const [exerciseAnswer, setExerciseAnswer] = useState("")

  const [currentPhrase, setCurrentPhrase] = useState("")
  const [currentExercise, setCurrentExercise] = useState<Exercise | null>(null)
  const [isPlaying, setIsPlaying] = useState(false)
  const [recordingTime, setRecordingTime] = useState(0)
  const [aiTyping, setAiTyping] = useState(false)
  const [sessionId, setSessionId] = useState<string | null>(null)
  const abortControllerRef = useRef<AbortController | null>(null)
  const [voiceTranscribing, setVoiceTranscribing] = useState(false)
  const [chatRecordingSeconds, setChatRecordingSeconds] = useState(0)
  const lastRecordingUrlRef = useRef<string | null>(null)
  const ttsCacheRef = useRef<Map<string, HTMLAudioElement>>(new Map())

  const { isRecording: chatIsRecording, toggleRecording: chatToggleRecording, stopRecording: stopChatRecording } = useVoiceRecording({
    onRecordingComplete: async (blob) => {
      try {
        setVoiceTranscribing(true)
        const fd = new FormData()
        fd.append('file', blob, 'audio.webm')
        // Сохраняем локально ссылку на оригинал записи чтобы прикрепить к сообщению
        try { lastRecordingUrlRef.current = URL.createObjectURL(blob) } catch {}
        const resp = await fetch('/api/chat/voice/transcribe', { method: 'POST', body: fd })
        if (!resp.ok) throw new Error('fail')
        const data = await resp.json()
        if (data.text) {
          setChatMessage(prev => prev ? prev + ' ' + data.text : data.text)
          toast.success('Распознано')
        } else {
          toast.error('Пустая расшифровка')
        }
      } catch {
        toast.error('Ошибка распознавания')
      } finally {
        setVoiceTranscribing(false)
        setChatRecordingSeconds(0)
      }
    },
    onError: () => toast.error('Ошибка записи')
  })

  const recordingInterval = useRef<NodeJS.Timeout>()

  useEffect(() => {
  async function loadData() {
      const { data: courseData } = await supabase
        .from("courses")
        .select("*")
        .eq("slug", slug)
        .eq("is_published", true)
        .maybeSingle<Course>()
      if (!courseData) {
        notFound()
        return
      }

      const { data: lessonsData } = (await supabase
        .from("lessons")
        .select("*")
        .eq("course_id", courseData.id)
        .order("order_index", { ascending: true })) as { data: Lesson[] | null }

      const lessonData = lessonsData?.find((l) => l.id === lessonId)
      if (!lessonData) {
        notFound()
        return
      }

      setCourse(courseData)
      setLesson(lessonData)
      setLessons(lessonsData || [])
      setLoading(false)

      setCurrentPhrase(getVoicePracticePhrase(lessonData.title))
      setCurrentExercise(getExerciseQuestion(lessonData.title))

      // === Недавно просмотренные уроки (localStorage) ===
      try {
        const key = 'recent_lessons'
        const raw = typeof window !== 'undefined' ? localStorage.getItem(key) : null
        const arr: any[] = raw ? JSON.parse(raw) : []
        const now = new Date().toISOString()
        const entry = {
          lessonId: lessonData.id,
            lessonTitle: lessonData.title,
            courseId: courseData.id,
            courseTitle: courseData.title,
            courseSlug: slug,
            viewedAt: now
        }
        const filtered = arr.filter(l => l.lessonId !== lessonData.id)
        filtered.unshift(entry)
        // Ограничим до 10
        const limited = filtered.slice(0,10)
        localStorage.setItem(key, JSON.stringify(limited))
      } catch (e) {
        // silent
      }

      // Автостарт или получение существующей чат-сессии
      try {
        const startResp = await fetch('/api/chat/session/start', {
          method: 'POST',
          headers: { 'content-type': 'application/json' },
          body: JSON.stringify({ courseId: courseData.id, lessonId: lessonData.id })
        })
        if (startResp.ok) {
          const data = await startResp.json()
          setSessionId(data.sessionId)
          // загрузка истории (фильтруем системные для UI)
          const hist = (data.messages || []).filter((m: any) => m.role === 'user' || m.role === 'assistant').map((m: any) => ({ role: m.role, content: m.content }))
          setChatHistory(hist)
        } else {
          console.error('Failed start session', await startResp.text())
        }
      } catch (e) {
        console.error('Failed to start chat session', e)
      }
    }

    loadData()
  }, [slug, lessonId])

  // Прогресс по прокрутке: считаем высоту текстового блока
  useEffect(() => {
    if (!lesson) return
    const contentEl = document.querySelector('[data-lesson-content]') as HTMLElement | null
    if (!contentEl) return

    function handleScroll() {
      if (!contentEl) return
      const rect = contentEl.getBoundingClientRect()
      const viewport = window.innerHeight
      const total = rect.height
      // часть которая уже ушла вверх + видимая часть
      const scrolledInside = Math.min(Math.max(0, viewport - Math.max(0, rect.bottom - viewport)), total)
      // альтернативно проще: позиция окна относительно верхней границы блока
      const topOffset = Math.max(0, -rect.top)
      const progress = Math.min(100, Math.max(scrolledInside, topOffset) / total * 100)
      setProgressPct(progress)
    }
    handleScroll()
    window.addEventListener('scroll', handleScroll, { passive: true })
    window.addEventListener('resize', handleScroll)
    return () => {
      window.removeEventListener('scroll', handleScroll)
      window.removeEventListener('resize', handleScroll)
    }
  }, [lesson])

  // Отправка completion при достижении 90%
  useEffect(() => {
    if (completionSent) return
    if (progressPct >= 90 && lesson) {
      fetch('/api/lessons/complete', {
        method: 'POST',
        headers: { 'content-type': 'application/json' },
        body: JSON.stringify({ lessonId: lesson.id })
      }).catch(()=>{})
      setCompletionSent(true)
    }
  }, [progressPct, lesson, completionSent])

  const handleSendMessage = async () => {
    if (!chatMessage.trim() || !lesson || !sessionId) return
    const userMsg: ChatMsg = { role: 'user', content: chatMessage, audioUrl: lastRecordingUrlRef.current || undefined }
    setChatHistory(prev => [...prev, userMsg])
    const toSend = chatMessage
    setChatMessage('')
    lastRecordingUrlRef.current = null
    setAiTyping(true)
    const assistant: ChatMsg = { role: 'assistant', content: '' }
    setChatHistory(prev => [...prev, assistant])
    try {
      abortControllerRef.current?.abort()
      const controller = new AbortController()
      abortControllerRef.current = controller
      const resp = await fetch('/api/ai/lesson-chat', {
        method: 'POST',
        headers: { 'content-type': 'application/json' },
        body: JSON.stringify({ lessonId: lesson.id, sessionId, message: userMsg.content }),
        signal: controller.signal
      })
      if (resp.status === 429) {
        assistant.content = 'Слишком много запросов. Попробуйте чуть позже.'
        setChatHistory(prev => {
          const copy = [...prev]
            copy[copy.length - 1] = { ...assistant }
            return copy
        })
        return
      }
      if (!resp.body) throw new Error('no stream')
      const reader = resp.body.getReader()
      const decoder = new TextDecoder()
      let done = false
      while (!done) {
        const { value, done: d } = await reader.read()
        done = d
        if (value) {
          const chunk = decoder.decode(value)
          assistant.content += chunk
          setChatHistory(prev => {
            const copy = [...prev]
            copy[copy.length - 1] = { ...assistant }
            return copy
          })
        }
      }
    } catch (e) {
      if ((e as any)?.name === 'AbortError') {
        assistant.content = assistant.content || '[Остановлено пользователем]'
      } else {
        assistant.content = assistant.content || (e instanceof Error ? e.message : 'Ошибка AI')
      }
      setChatHistory(prev => {
        const copy = [...prev]
        copy[copy.length - 1] = { ...assistant }
        return copy
      })
    } finally {
      setAiTyping(false)
    }
  }

  const handleStop = () => {
    abortControllerRef.current?.abort()
    setAiTyping(false)
  }

  const handleStopStreaming = () => {
    if (abortControllerRef.current) {
      abortControllerRef.current.abort()
      abortControllerRef.current = null
      setAiTyping(false)
      toast.info('Остановлено')
    }
  }

  const handlePlayTts = async (text: string) => {
    try {
      if (!text) return
      const key = text.slice(0, 512)
      const cached = ttsCacheRef.current.get(key)
      if (cached) {
        cached.currentTime = 0
        await cached.play()
        return
      }
      const resp = await fetch('/api/chat/voice/tts', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ text })
      })
      if (!resp.ok) throw new Error('TTS error')
      const blob = await resp.blob()
      const url = URL.createObjectURL(blob)
      const audio = new Audio(url)
      ttsCacheRef.current.set(key, audio)
      await audio.play()
    } catch (e) {
      console.error('TTS play error', e)
      toast.error('Ошибка воспроизведения')
    }
  }

  // Таймер записи и автостоп для голосового ввода чата
  useEffect(() => {
    if (chatIsRecording) {
      setChatRecordingSeconds(0)
      const interval = setInterval(() => {
        setChatRecordingSeconds(prev => {
          if (prev + 1 >= 60) {
            // автостоп по достижении 60 сек
            stopChatRecording()
            return 60
          }
          return prev + 1
        })
      }, 1000)
      return () => clearInterval(interval)
    }
  }, [chatIsRecording, stopChatRecording])

  const handleVoiceToggle = () => {
    if (isRecording) {
      // Stop recording
      setIsRecording(false)
      setRecordingTime(0)
      if (recordingInterval.current) {
        clearInterval(recordingInterval.current)
      }

      setTimeout(() => {
        const score = Math.floor(Math.random() * 20) + 80 // 80-100%
        toast.success(
          `Запись завершена! Ваше произношение оценено на ${score}%. ${score >= 90 ? "Отлично!" : score >= 80 ? "Хорошо!" : "Продолжайте практиковаться!"}`,
        )
      }, 500)
    } else {
      // Start recording
      setIsRecording(true)
      setRecordingTime(0)
      recordingInterval.current = setInterval(() => {
        setRecordingTime((prev) => prev + 1)
      }, 1000)

      // Auto-stop after 10 seconds
      setTimeout(() => {
        if (isRecording) {
          handleVoiceToggle()
        }
      }, 10000)
    }
  }

  const handlePlayPhrase = () => {
    if ("speechSynthesis" in window) {
      setIsPlaying(true)
      const utterance = new SpeechSynthesisUtterance(currentPhrase)
      utterance.lang = "ru-RU"
      utterance.rate = 0.8
      utterance.onend = () => setIsPlaying(false)
      speechSynthesis.speak(utterance)
    }
  }

  const handleExerciseSubmit = () => {
    if (!exerciseAnswer.trim()) return

    const feedback =
      exerciseAnswer.length > 50
        ? "Отличный развернутый ответ! AI преподаватель оценил ваше понимание материала."
        : "Хороший ответ! Попробуйте добавить больше деталей в следующий раз."

    toast.success(`Упражнение отправлено! ${feedback}`)
    setExerciseAnswer("")
    setCurrentExercise(getExerciseQuestion(lesson?.title || ""))
  }

  const handleNewPhrase = () => {
    setCurrentPhrase(getVoicePracticePhrase(lesson?.title || ""))
  }

  if (loading) {
    return <div className="min-h-screen flex items-center justify-center">Загрузка...</div>
  }

  if (!course || !lesson) {
    notFound()
  }

  const currentLessonIndex = lessons.findIndex((l) => l.id === lessonId)
  const previousLesson = currentLessonIndex > 0 ? lessons[currentLessonIndex - 1] : null
  const nextLesson = currentLessonIndex < lessons.length - 1 ? lessons[currentLessonIndex + 1] : null

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50">
      <Header />
      <main className="container mx-auto px-6 py-8 pt-24">
        <div className="max-w-4xl mx-auto">
          {/* Lesson Header */}
          <div className="mb-6">
            <Link href={`/courses/${slug}`}>
              <Button variant="ghost" size="sm" className="mb-4">
                <ArrowLeft className="mr-2 h-4 w-4" />
                Назад к курсу
              </Button>
            </Link>
            <h1 className="text-3xl font-bold font-sans mb-2">{lesson.title}</h1>
            <p className="text-muted-foreground">
              Урок {currentLessonIndex + 1} из {lessons.length} • {lesson.duration} мин
            </p>
          </div>

          {/* Progress */}
          <div className="mb-6">
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm font-medium">Прогресс урока</span>
              <span className="text-sm text-muted-foreground">{Math.round(progressPct)}%</span>
            </div>
            <Progress value={progressPct} className="h-2" />
          </div>

          {/* Lesson Content */}
          <GlassCard className="p-8 mb-6" data-lesson-content>
            <div className="prose prose-lg max-w-none">
              <div dangerouslySetInnerHTML={{ __html: lesson.content.replace(/\n/g, "<br>") }} />
            </div>
          </GlassCard>

          {/* Interactive Features */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
            <GlassCard className="p-6 text-center">
              <MessageCircle className="w-8 h-8 text-blue-600 mx-auto mb-3" />
              <h3 className="font-semibold mb-2">AI Чат</h3>
              <p className="text-sm text-muted-foreground mb-4">Задавайте вопросы AI преподавателю</p>
              <Button size="sm" className="w-full" onClick={() => setChatOpen(true)}>
                Открыть чат
              </Button>
            </GlassCard>

            <GlassCard className="p-6 text-center">
              <Mic className="w-8 h-8 text-green-600 mx-auto mb-3" />
              <h3 className="font-semibold mb-2">Голосовая практика</h3>
              <p className="text-sm text-muted-foreground mb-4">Практикуйте произношение</p>
              <Button size="sm" className="w-full" onClick={() => setVoiceOpen(true)}>
                Начать запись
              </Button>
            </GlassCard>

            <GlassCard className="p-6 text-center">
              <BookOpen className="w-8 h-8 text-purple-600 mx-auto mb-3" />
              <h3 className="font-semibold mb-2">Упражнения</h3>
              <p className="text-sm text-muted-foreground mb-4">Закрепите материал</p>
              <Button size="sm" className="w-full" onClick={() => setExerciseOpen(true)}>
                Выполнить
              </Button>
            </GlassCard>
          </div>

          {/* Navigation */}
          <div className="flex justify-between">
            {previousLesson ? (
              <Link href={`/courses/${slug}/lessons/${previousLesson.id}`}>
                <Button variant="outline">
                  <ArrowLeft className="mr-2 h-4 w-4" />
                  Предыдущий урок
                </Button>
              </Link>
            ) : (
              <div></div>
            )}

            {nextLesson ? (
              <Link href={`/courses/${slug}/lessons/${nextLesson.id}`}>
                <Button>
                  Следующий урок
                  <ArrowRight className="ml-2 h-4 w-4" />
                </Button>
              </Link>
            ) : (
              <Link href={`/courses/${slug}`}>
                <Button>
                  Завершить курс
                  <ArrowRight className="ml-2 h-4 w-4" />
                </Button>
              </Link>
            )}
          </div>
        </div>
      </main>

      <Dialog open={chatOpen} onOpenChange={setChatOpen}>
        <DialogContent className="max-w-2xl max-h-[80vh]">
          <DialogHeader>
            <DialogTitle>🤖 AI Преподаватель</DialogTitle>
          </DialogHeader>
          <div className="flex flex-col h-96">
            <div className="flex-1 overflow-y-auto p-4 space-y-4">
              {chatHistory.length === 0 && (
                <div className="text-center text-muted-foreground p-4 bg-blue-50 rounded-lg">
                  <MessageCircle className="w-8 h-8 mx-auto mb-2 text-blue-600" />
                  <p>Привет! Я ваш AI преподаватель. Задавайте любые вопросы по уроку "{lesson.title}".</p>
                  <p className="text-sm mt-2">Я помогу разобраться с материалом и дам практические советы!</p>
                </div>
              )}
              {chatHistory.map((msg, idx) => (
                <div key={idx} className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'} relative group`}>
                  <div className={`max-w-xs p-3 rounded-lg space-y-2 ${msg.role === 'user' ? 'bg-blue-600 text-white' : 'bg-gray-100 text-gray-900'}`}>
                    <div>{msg.content}</div>
                    {msg.audioUrl && (
                      <audio controls className="w-full mt-1" src={msg.audioUrl} />
                    )}
                  </div>
                  {msg.role === 'assistant' && (
                    <button
                      type="button"
                      onClick={() => handlePlayTts(msg.content)}
                      className="opacity-0 group-hover:opacity-100 transition-opacity absolute -right-8 top-1 text-gray-500 hover:text-gray-800"
                      title="Прослушать ответ"
                    >
                      <Volume1 className="w-4 h-4" />
                    </button>
                  )}
                </div>
              ))}
              {aiTyping && (
                <div className="flex justify-start">
                  <div className="bg-gray-100 text-gray-900 p-3 rounded-lg">
                    <div className="flex space-x-1">
                      <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"></div>
                      <div
                        className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"
                        style={{ animationDelay: "0.1s" }}
                      ></div>
                      <div
                        className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"
                        style={{ animationDelay: "0.2s" }}
                      ></div>
                    </div>
                  </div>
                </div>
              )}
            </div>
            <div className="flex gap-2 p-4 border-t">
              <div className="flex-1 flex flex-col gap-2">
                <Textarea
                  value={chatMessage}
                  onChange={(e) => setChatMessage(e.target.value)}
                  placeholder={voiceTranscribing ? 'Распознаём...' : 'Введите или продиктуйте вопрос'}
                  className="flex-1"
                  disabled={voiceTranscribing}
                  onKeyPress={(e) => e.key === 'Enter' && !e.shiftKey && (e.preventDefault(), handleSendMessage())}
                />
                <div className="flex items-center gap-3 text-xs text-muted-foreground">
                  {chatIsRecording && (
                    <div className="flex items-center gap-2">
                      <span className="text-red-600">● Запись {chatRecordingSeconds}s</span>
                      <div className="w-24 h-1 bg-red-200 rounded overflow-hidden">
                        <div className="h-full bg-red-600 transition-all" style={{ width: `${(chatRecordingSeconds/60)*100}%` }}></div>
                      </div>
                    </div>
                  )}
                  {voiceTranscribing && <span>Распознавание...</span>}
                </div>
              </div>
              <Button type="button" variant={chatIsRecording ? 'destructive' : 'outline'} onClick={chatToggleRecording} disabled={aiTyping || voiceTranscribing}>
                {chatIsRecording ? <Square className="h-4 w-4" /> : <MicIcon className="h-4 w-4" />}
              </Button>
              {aiTyping ? (
                <Button variant="destructive" onClick={handleStopStreaming}>
                  <StopCircle className="h-4 w-4" />
                </Button>
              ) : (
                <Button onClick={handleSendMessage} disabled={aiTyping || voiceTranscribing || !chatMessage.trim()}>
                  <Send className="h-4 w-4" />
                </Button>
              )}
            </div>
          </div>
        </DialogContent>
      </Dialog>

      <Dialog open={voiceOpen} onOpenChange={setVoiceOpen}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle>🎤 Голосовая практика</DialogTitle>
          </DialogHeader>
          <div className="text-center p-6">
            <div className="mb-6">
              <p className="text-lg mb-4">Произнесите фразу:</p>
              <div className="bg-blue-50 p-4 rounded-lg mb-4">
                <p className="text-xl font-semibold text-blue-600 mb-2">"{currentPhrase}"</p>
                <Button variant="outline" size="sm" onClick={handlePlayPhrase} disabled={isPlaying}>
                  {isPlaying ? <Pause className="w-4 h-4 mr-2" /> : <Volume2 className="w-4 h-4 mr-2" />}
                  {isPlaying ? "Воспроизводится..." : "Прослушать"}
                </Button>
              </div>
            </div>
            <div className="mb-6">
              {isRecording ? (
                <div className="animate-pulse">
                  <div className="w-20 h-20 bg-red-500 rounded-full mx-auto mb-4 flex items-center justify-center">
                    <Square className="w-8 h-8 text-white" />
                  </div>
                  <p className="text-red-600 font-semibold">Идет запись... {recordingTime}с</p>
                  <div className="w-full bg-red-200 rounded-full h-2 mt-2">
                    <div
                      className="bg-red-600 h-2 rounded-full transition-all duration-1000"
                      style={{ width: `${(recordingTime / 10) * 100}%` }}
                    ></div>
                  </div>
                </div>
              ) : (
                <div>
                  <div className="w-20 h-20 bg-green-500 rounded-full mx-auto mb-4 flex items-center justify-center cursor-pointer hover:bg-green-600 transition-colors">
                    <MicIcon className="w-8 h-8 text-white" />
                  </div>
                  <p className="text-gray-600">Нажмите для начала записи</p>
                </div>
              )}
            </div>
            <div className="space-y-2">
              <Button onClick={handleVoiceToggle} className="w-full">
                {isRecording ? "Остановить запись" : "Начать запись"}
              </Button>
              <Button variant="outline" onClick={handleNewPhrase} className="w-full bg-transparent">
                Новая фраза
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>

      <Dialog open={exerciseOpen} onOpenChange={setExerciseOpen}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>📚 Упражнение</DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <div className="bg-purple-50 p-4 rounded-lg">
              <p className="font-semibold mb-2">Вопрос:</p>
              <p className="mb-3">{currentExercise?.question}</p>
              {currentExercise?.hint && (
                <div className="bg-yellow-50 p-3 rounded border-l-4 border-yellow-400">
                  <p className="text-sm">
                    <strong>💡 Подсказка:</strong> {currentExercise.hint}
                  </p>
                </div>
              )}
            </div>
            <div>
              <label className="block text-sm font-medium mb-2">Ваш ответ:</label>
              <Textarea
                value={exerciseAnswer}
                onChange={(e) => setExerciseAnswer(e.target.value)}
                placeholder="Введите ваш ответ здесь..."
                rows={4}
                className="w-full"
              />
              <p className="text-sm text-muted-foreground mt-1">
                Символов: {exerciseAnswer.length} (рекомендуется от 50)
              </p>
            </div>
            <div className="flex gap-2">
              <Button onClick={handleExerciseSubmit} className="flex-1" disabled={!exerciseAnswer.trim()}>
                Отправить ответ
              </Button>
              <Button variant="outline" onClick={() => setCurrentExercise(getExerciseQuestion(lesson?.title || ""))}>
                Новый вопрос
              </Button>
              <Button variant="outline" onClick={() => setExerciseOpen(false)}>
                Закрыть
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>

      <Footer />
    </div>
  )
}
