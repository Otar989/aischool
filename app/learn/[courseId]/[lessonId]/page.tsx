"use client"

import { useState, useRef, useEffect } from "react"
import { Header } from "@/components/layout/header"
import { GlassCard } from "@/components/ui/glass-card"
import { GradientButton } from "@/components/ui/gradient-button"
import { Button } from "@/components/ui/button"
import { Progress } from "@/components/ui/progress"
import { Badge } from "@/components/ui/badge"
import { Textarea } from "@/components/ui/textarea"
import {
  BookOpen,
  MessageCircle,
  Mic,
  MicOff,
  Send,
  Volume2,
  VolumeX,
  CheckCircle,
  ArrowLeft,
  ArrowRight,
  RotateCcw,
} from "lucide-react"
import Link from "next/link"
import { notFound } from "next/navigation"

// Mock data - in real app this would come from database
const getLessonData = (courseId: string, lessonId: string) => {
  const lessons = {
    "550e8400-e29b-41d4-a716-446655440011": {
      id: "550e8400-e29b-41d4-a716-446655440011",
      courseId: "550e8400-e29b-41d4-a716-446655440001",
      title: "Знакомство и приветствие",
      content: `# Знакомство и приветствие

## Основные фразы

**你好** (nǐ hǎo) - Привет/Здравствуйте
**我叫...** (wǒ jiào...) - Меня зовут...
**很高兴认识您** (hěn gāoxìng rènshi nín) - Очень приятно познакомиться

## Диалог-пример

A: 你好，我叫李明。
B: 你好，李明。我是王小红。很高兴认识您。

## Практическое задание

Представьтесь партнеру по бизнесу, используя изученные фразы.`,
      estimatedMinutes: 30,
      isDemo: true,
      questions: [
        {
          id: "q1",
          type: "multiple_choice",
          prompt: "Как сказать 'Привет' на китайском языке?",
          options: ["你好", "再见", "谢谢", "对不起"],
          correctAnswer: "你好",
        },
      ],
      nextLessonId: "550e8400-e29b-41d4-a716-446655440012",
      prevLessonId: null,
    },
  }

  return lessons[lessonId as keyof typeof lessons] || null
}

export default function LessonPage({ params }: { params: { courseId: string; lessonId: string } }) {
  const lesson = getLessonData(params.courseId, params.lessonId)
  const [activeTab, setActiveTab] = useState<"theory" | "practice" | "chat">("theory")
  const [isRecording, setIsRecording] = useState(false)
  const [isSpeaking, setIsSpeaking] = useState(false)
  const [chatMessage, setChatMessage] = useState("")
  const [chatHistory, setChatHistory] = useState([
    {
      role: "assistant" as const,
      content: "Привет! Я ваш ИИ-наставник. Готовы изучать китайский язык? Давайте начнем с основ приветствия!",
      timestamp: new Date(),
    },
  ])

  const chatEndRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: "smooth" })
  }, [chatHistory])

  if (!lesson) {
    notFound()
  }

  const handleSendMessage = () => {
    if (!chatMessage.trim()) return

    const userMessage = {
      role: "user" as const,
      content: chatMessage,
      timestamp: new Date(),
    }

    setChatHistory((prev) => [...prev, userMessage])
    setChatMessage("")

    // Simulate AI response
    setTimeout(() => {
      const aiResponse = {
        role: "assistant" as const,
        content: "Отличный вопрос! Давайте разберем это подробнее. Произношение 你好 (nǐ hǎo) состоит из двух тонов...",
        timestamp: new Date(),
      }
      setChatHistory((prev) => [...prev, aiResponse])
    }, 1000)
  }

  const handleVoiceToggle = () => {
    setIsRecording(!isRecording)
    // TODO: Implement voice recording
  }

  const handlePlayAudio = (text: string) => {
    setIsSpeaking(true)
    // TODO: Implement TTS
    setTimeout(() => setIsSpeaking(false), 2000)
  }

  return (
    <div className="min-h-screen">
      <Header />

      <div className="pt-24 px-6">
        <div className="max-w-7xl mx-auto">
          {/* Lesson Header */}
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center gap-4">
              <Button variant="ghost" size="icon" asChild>
                <Link href={`/courses/${params.courseId}`}>
                  <ArrowLeft className="w-5 h-5" />
                </Link>
              </Button>
              <div>
                <h1 className="text-2xl font-bold font-sans">{lesson.title}</h1>
                <div className="flex items-center gap-4 text-sm text-muted-foreground">
                  <span>{lesson.estimatedMinutes} минут</span>
                  {lesson.isDemo && <Badge variant="secondary">Демо-урок</Badge>}
                </div>
              </div>
            </div>

            <div className="flex items-center gap-2">
              {lesson.prevLessonId && (
                <Button variant="outline" size="sm" asChild>
                  <Link href={`/learn/${params.courseId}/${lesson.prevLessonId}`}>
                    <ArrowLeft className="w-4 h-4 mr-1" />
                    Предыдущий
                  </Link>
                </Button>
              )}
              {lesson.nextLessonId && (
                <GradientButton size="sm" asChild>
                  <Link href={`/learn/${params.courseId}/${lesson.nextLessonId}`}>
                    Следующий
                    <ArrowRight className="w-4 h-4 ml-1" />
                  </Link>
                </GradientButton>
              )}
            </div>
          </div>

          {/* Progress Bar */}
          <div className="mb-8">
            <div className="flex items-center justify-between text-sm text-muted-foreground mb-2">
              <span>Прогресс урока</span>
              <span>1 из 7 уроков</span>
            </div>
            <Progress value={14} className="h-2" />
          </div>

          {/* Lesson Content */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Main Content */}
            <div className="lg:col-span-2">
              <GlassCard className="p-6">
                {/* Tabs */}
                <div className="flex gap-1 mb-6 p-1 bg-white/5 rounded-lg">
                  {[
                    { id: "theory", label: "Теория", icon: BookOpen },
                    { id: "practice", label: "Практика", icon: CheckCircle },
                    { id: "chat", label: "ИИ-наставник", icon: MessageCircle },
                  ].map((tab) => (
                    <button
                      key={tab.id}
                      onClick={() => setActiveTab(tab.id as any)}
                      className={`flex-1 flex items-center justify-center gap-2 py-2 px-4 rounded-md text-sm font-medium transition-colors ${
                        activeTab === tab.id
                          ? "bg-primary text-primary-foreground"
                          : "text-muted-foreground hover:text-foreground"
                      }`}
                    >
                      <tab.icon className="w-4 h-4" />
                      {tab.label}
                    </button>
                  ))}
                </div>

                {/* Tab Content */}
                {activeTab === "theory" && (
                  <div className="prose prose-invert max-w-none">
                    <div className="whitespace-pre-wrap font-serif leading-relaxed">{lesson.content}</div>
                  </div>
                )}

                {activeTab === "practice" && (
                  <div className="space-y-6">
                    <h3 className="text-xl font-bold font-sans">Практические задания</h3>
                    {lesson.questions.map((question, index) => (
                      <div
                        key={question.id}
                        className="p-4 rounded-lg bg-white/5 backdrop-blur-sm border border-white/10"
                      >
                        <h4 className="font-medium mb-4">
                          Вопрос {index + 1}: {question.prompt}
                        </h4>
                        {question.type === "multiple_choice" && (
                          <div className="space-y-2">
                            {question.options?.map((option, optionIndex) => (
                              <label key={optionIndex} className="flex items-center gap-2 cursor-pointer">
                                <input type="radio" name={`question-${question.id}`} value={option} />
                                <span>{option}</span>
                              </label>
                            ))}
                          </div>
                        )}
                        <Button className="mt-4" size="sm">
                          Проверить ответ
                        </Button>
                      </div>
                    ))}
                  </div>
                )}

                {activeTab === "chat" && (
                  <div className="space-y-4">
                    {/* Chat History */}
                    <div className="h-96 overflow-y-auto space-y-4 p-4 bg-white/5 rounded-lg">
                      {chatHistory.map((message, index) => (
                        <div
                          key={index}
                          className={`flex gap-3 ${message.role === "user" ? "justify-end" : "justify-start"}`}
                        >
                          <div
                            className={`max-w-xs lg:max-w-md px-4 py-2 rounded-lg ${
                              message.role === "user"
                                ? "bg-primary text-primary-foreground"
                                : "bg-white/10 backdrop-blur-sm border border-white/20"
                            }`}
                          >
                            <p className="text-sm">{message.content}</p>
                            {message.role === "assistant" && (
                              <Button
                                variant="ghost"
                                size="sm"
                                className="mt-2 h-6 px-2 text-xs"
                                onClick={() => handlePlayAudio(message.content)}
                              >
                                {isSpeaking ? <VolumeX className="w-3 h-3" /> : <Volume2 className="w-3 h-3" />}
                                Озвучить
                              </Button>
                            )}
                          </div>
                        </div>
                      ))}
                      <div ref={chatEndRef} />
                    </div>

                    {/* Chat Input */}
                    <div className="flex gap-2">
                      <div className="flex-1 relative">
                        <Textarea
                          value={chatMessage}
                          onChange={(e) => setChatMessage(e.target.value)}
                          placeholder="Задайте вопрос ИИ-наставнику..."
                          className="min-h-[60px] bg-white/50 border-white/20 resize-none"
                          onKeyDown={(e) => {
                            if (e.key === "Enter" && !e.shiftKey) {
                              e.preventDefault()
                              handleSendMessage()
                            }
                          }}
                        />
                      </div>
                      <div className="flex flex-col gap-2">
                        <Button
                          variant={isRecording ? "destructive" : "outline"}
                          size="icon"
                          onClick={handleVoiceToggle}
                          className="bg-white/10 backdrop-blur-sm border-white/20"
                        >
                          {isRecording ? <MicOff className="w-4 h-4" /> : <Mic className="w-4 h-4" />}
                        </Button>
                        <GradientButton size="icon" onClick={handleSendMessage}>
                          <Send className="w-4 h-4" />
                        </GradientButton>
                      </div>
                    </div>

                    {isRecording && (
                      <div className="text-center text-sm text-muted-foreground">
                        <div className="flex items-center justify-center gap-2">
                          <div className="w-2 h-2 bg-red-500 rounded-full animate-pulse" />
                          Запись... Говорите сейчас
                        </div>
                      </div>
                    )}
                  </div>
                )}
              </GlassCard>
            </div>

            {/* Sidebar */}
            <div className="lg:col-span-1">
              <GlassCard className="p-6 sticky top-32">
                <h3 className="font-bold font-sans mb-4">Инструменты урока</h3>
                <div className="space-y-3">
                  <Button
                    variant="outline"
                    className="w-full justify-start bg-white/10 backdrop-blur-sm border-white/20"
                  >
                    <RotateCcw className="w-4 h-4 mr-2" />
                    Начать заново
                  </Button>
                  <Button
                    variant="outline"
                    className="w-full justify-start bg-white/10 backdrop-blur-sm border-white/20"
                  >
                    <BookOpen className="w-4 h-4 mr-2" />
                    Конспект урока
                  </Button>
                  <Button
                    variant="outline"
                    className="w-full justify-start bg-white/10 backdrop-blur-sm border-white/20"
                  >
                    <Volume2 className="w-4 h-4 mr-2" />
                    Словарь урока
                  </Button>
                </div>

                <div className="mt-8">
                  <h4 className="font-medium mb-3">Статистика</h4>
                  <div className="space-y-2 text-sm">
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Время в уроке:</span>
                      <span>12 мин</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Сообщений с ИИ:</span>
                      <span>8</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Правильных ответов:</span>
                      <span>85%</span>
                    </div>
                  </div>
                </div>

                <div className="mt-8">
                  <GradientButton className="w-full">
                    <CheckCircle className="w-4 h-4 mr-2" />
                    Завершить урок
                  </GradientButton>
                </div>
              </GlassCard>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
