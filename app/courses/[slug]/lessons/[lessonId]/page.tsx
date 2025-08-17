"use client"

import { Header } from "@/components/layout/header"
import { Footer } from "@/components/layout/footer"
import { GlassCard } from "@/components/ui/glass-card"
import { Button } from "@/components/ui/button"
import { Progress } from "@/components/ui/progress"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Textarea } from "@/components/ui/textarea"
import {
  ArrowLeft,
  ArrowRight,
  MessageCircle,
  Mic,
  BookOpen,
  Send,
  MicIcon,
  Square,
  Volume2,
  Pause,
} from "lucide-react"
import { notFound } from "next/navigation"
import { createClient } from "@/lib/supabase/client"
import Link from "next/link"
import { useState, useEffect, useRef } from "react"

const supabase = createClient()

const getAIResponse = (message: string, lessonTitle: string) => {
  const responses = {
    chatgpt: [
      "ChatGPT может автоматизировать создание контента, отвечать на вопросы клиентов и помогать в анализе данных.",
      "Для эффективного использования ChatGPT важно правильно формулировать промпты и задавать контекст.",
      "ChatGPT особенно полезен для создания email-рассылок, описаний товаров и ответов в социальных сетях.",
    ],
    business: [
      "В бизнесе AI помогает экономить время на рутинных задачах и улучшать качество коммуникации с клиентами.",
      "Автоматизация с помощью AI может увеличить продуктивность команды на 40-60%.",
      "Важно начинать внедрение AI с простых задач, постепенно расширяя область применения.",
    ],
    default: [
      "Отличный вопрос! Этот материал поможет вам лучше понять практическое применение изученных концепций.",
      "Рекомендую попробовать применить эти знания на практике в своих проектах.",
      "Если у вас есть конкретные примеры из вашей работы, я помогу адаптировать материал под ваши задачи.",
    ],
  }

  const messageKey =
    message.toLowerCase().includes("chatgpt") || message.toLowerCase().includes("чат")
      ? "chatgpt"
      : message.toLowerCase().includes("бизнес") || message.toLowerCase().includes("автоматизация")
        ? "business"
        : "default"

  const responseArray = responses[messageKey]
  return responseArray[Math.floor(Math.random() * responseArray.length)]
}

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
  const [course, setCourse] = useState<any>(null)
  const [lesson, setLesson] = useState<any>(null)
  const [lessons, setLessons] = useState<any[]>([])
  const [loading, setLoading] = useState(true)

  const [chatOpen, setChatOpen] = useState(false)
  const [voiceOpen, setVoiceOpen] = useState(false)
  const [exerciseOpen, setExerciseOpen] = useState(false)
  const [chatMessage, setChatMessage] = useState("")
  const [chatHistory, setChatHistory] = useState<{ role: string; content: string }[]>([])
  const [isRecording, setIsRecording] = useState(false)
  const [exerciseAnswer, setExerciseAnswer] = useState("")

  const [currentPhrase, setCurrentPhrase] = useState("")
  const [currentExercise, setCurrentExercise] = useState<any>(null)
  const [isPlaying, setIsPlaying] = useState(false)
  const [recordingTime, setRecordingTime] = useState(0)
  const [aiTyping, setAiTyping] = useState(false)

  const recordingInterval = useRef<NodeJS.Timeout>()

  useEffect(() => {
    async function loadData() {
      const { data: courseData } = await supabase
        .from("courses")
        .select("*")
        .eq("slug", slug)
        .eq("is_published", true)
        .maybeSingle()
      if (!courseData) {
        notFound()
        return
      }

      const { data: lessonsData } = await supabase
        .from("lessons")
        .select("*")
        .eq("course_id", courseData.id)
        .order("order_index", { ascending: true })

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
    }

    loadData()
  }, [slug, lessonId])

  const handleSendMessage = async () => {
    if (!chatMessage.trim()) return

    const newMessage = { role: "user", content: chatMessage }
    setChatHistory((prev) => [...prev, newMessage])
    setChatMessage("")
    setAiTyping(true)

    setTimeout(() => {
      const aiResponse = {
        role: "assistant",
        content: getAIResponse(chatMessage, lesson?.title || ""),
      }
      setChatHistory((prev) => [...prev, aiResponse])
      setAiTyping(false)
    }, 1500)
  }

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
        alert(
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

    alert(`Упражнение отправлено! ${feedback}`)
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
              <span className="text-sm text-muted-foreground">0%</span>
            </div>
            <Progress value={0} className="h-2" />
          </div>

          {/* Lesson Content */}
          <GlassCard className="p-8 mb-6">
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
                <div key={idx} className={`flex ${msg.role === "user" ? "justify-end" : "justify-start"}`}>
                  <div
                    className={`max-w-xs p-3 rounded-lg ${
                      msg.role === "user" ? "bg-blue-600 text-white" : "bg-gray-100 text-gray-900"
                    }`}
                  >
                    {msg.content}
                  </div>
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
              <Textarea
                value={chatMessage}
                onChange={(e) => setChatMessage(e.target.value)}
                placeholder="Задайте вопрос..."
                className="flex-1"
                onKeyPress={(e) => e.key === "Enter" && !e.shiftKey && (e.preventDefault(), handleSendMessage())}
              />
              <Button onClick={handleSendMessage} disabled={aiTyping}>
                <Send className="h-4 w-4" />
              </Button>
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
