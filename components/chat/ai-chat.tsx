"use client"

import { useState, useRef, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
import { GradientButton } from "@/components/ui/gradient-button"
import { VoiceRecorder } from "./voice-recorder"
import { Send, Volume2, VolumeX, Loader2 } from "lucide-react"
import { toast } from "sonner"

interface ChatMessage {
  role: "user" | "assistant" | "system"
  content: string
  timestamp: Date
  isAudio?: boolean
}

interface AIChatProps {
  sessionId: string
  onMessageSent?: (message: ChatMessage) => void
}

export function AIChat({ sessionId, onMessageSent }: AIChatProps) {
  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      role: "assistant",
      content: "Привет! Я ваш ИИ-наставник. Готовы изучать новый материал? Давайте начнем!",
      timestamp: new Date(),
    },
  ])
  const [inputMessage, setInputMessage] = useState("")
  const [isLoading, setIsLoading] = useState(false)
  const [isSpeaking, setIsSpeaking] = useState(false)
  const [isAudioLoading, setIsAudioLoading] = useState(false)
  const chatEndRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: "smooth" })
  }, [messages])

  const sendMessage = async (content: string, audioBlob?: Blob) => {
    if (!content.trim() && !audioBlob) return

    setIsLoading(true)

    let assistantMessage: ChatMessage | null = null

    try {
      let audioUrl: string | undefined

      // Upload audio if provided
      if (audioBlob) {
        const formData = new FormData()
        formData.append("audio", audioBlob, "recording.webm")

        const uploadResponse = await fetch("/api/upload/audio", {
          method: "POST",
          body: formData,
        })

        if (uploadResponse.ok) {
          const { url } = await uploadResponse.json()
          audioUrl = url
        }
      }

      // Add user message to UI
      const userMessage: ChatMessage = {
        role: "user",
        content: content || "🎤 Голосовое сообщение",
        timestamp: new Date(),
        isAudio: !!audioBlob,
      }

      setMessages((prev) => [...prev, userMessage])
      setInputMessage("")

      // Send to AI
      const response = await fetch("/api/chat/message", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          sessionId,
          text: content,
          audioUrl,
        }),
      })

      if (!response.ok || !response.body) {
        throw new Error("Failed to send message")
      }

      assistantMessage = {
        role: "assistant",
        content: "",
        timestamp: new Date(),
      }

      setMessages((prev) => [...prev, assistantMessage!])

      const reader = response.body.getReader()
      const decoder = new TextDecoder()
      let done = false
      let aiContent = ""

      while (!done) {
        const { value, done: doneReading } = await reader.read()
        done = doneReading
        const chunk = decoder.decode(value || new Uint8Array(), { stream: true })
        aiContent += chunk
        const updatedMessage = { ...assistantMessage, content: aiContent }
        setMessages((prev) => {
          const newMessages = [...prev]
          newMessages[newMessages.length - 1] = updatedMessage
          return newMessages
        })
      }

      const finalMessage = { ...assistantMessage, content: aiContent }
      onMessageSent?.(finalMessage)
    } catch (error) {
      console.error("Error sending message:", error)
      toast.error("Не удалось отправить сообщение")
      setMessages((prev) => {
        const newMessages = [...prev]
        if (assistantMessage) {
          newMessages[newMessages.length - 1] = {
            role: "assistant",
            content: "Извините, произошла ошибка. Попробуйте еще раз.",
            timestamp: new Date(),
          }
          return newMessages
        }
        return [
          ...newMessages,
          {
            role: "assistant",
            content: "Извините, произошла ошибка. Попробуйте еще раз.",
            timestamp: new Date(),
          },
        ]
      })
    } finally {
      setIsLoading(false)
    }
  }

  const handleTextSubmit = () => {
    sendMessage(inputMessage)
  }

  const handleVoiceRecording = (audioBlob: Blob) => {
    sendMessage("", audioBlob)
  }

  const handlePlayAudio = async (text: string) => {
    if (isSpeaking || isAudioLoading) return

    setIsAudioLoading(true)
    try {
      const response = await fetch("/api/chat/voice/tts", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ text }),
      })

      if (!response.ok) {
        throw new Error("Failed to fetch audio")
      }

      const arrayBuffer = await response.arrayBuffer()
      const audioType = response.headers.get("Content-Type") || "audio/mpeg"
      const audioUrl = URL.createObjectURL(new Blob([arrayBuffer], { type: audioType }))

      const audio = new Audio(audioUrl)
      audio.onended = () => {
        setIsSpeaking(false)
        URL.revokeObjectURL(audioUrl)
      }
      audio.onerror = () => {
        setIsSpeaking(false)
        URL.revokeObjectURL(audioUrl)
        toast.error("Не удалось воспроизвести аудио")
      }

      setIsSpeaking(true)
      await audio.play()
    } catch (error) {
      console.error("Error playing audio:", error)
      toast.error("Не удалось воспроизвести аудио")
    } finally {
      setIsAudioLoading(false)
    }
  }

  return (
    <div className="flex flex-col h-full">
      {/* Chat Messages */}
      <div className="flex-1 overflow-y-auto space-y-4 p-4 bg-white/5 rounded-lg mb-4">
        {messages.map((message, index) => (
          <div key={index} className={`flex gap-3 ${message.role === "user" ? "justify-end" : "justify-start"}`}>
            <div
              className={`max-w-xs lg:max-w-md px-4 py-3 rounded-lg ${
                message.role === "user"
                  ? "bg-primary text-primary-foreground"
                  : "bg-white/10 backdrop-blur-sm border border-white/20"
              }`}
            >
              {message.content ? (
                <p className="text-sm whitespace-pre-wrap">{message.content}</p>
              ) : (
                <div className="flex items-center gap-2">
                  <Loader2 className="w-4 h-4 animate-spin" />
                  <span className="text-sm">ИИ-наставник печатает...</span>
                </div>
              )}
              <div className="flex items-center justify-between mt-2">
                <span className="text-xs opacity-70">
                  {message.timestamp.toLocaleTimeString("ru-RU", {
                    hour: "2-digit",
                    minute: "2-digit",
                  })}
                </span>
                {message.role === "assistant" && message.content && (
                  <Button
                    variant="ghost"
                    size="sm"
                    className="h-6 px-2 text-xs ml-2"
                    onClick={() => handlePlayAudio(message.content)}
                    disabled={isSpeaking || isAudioLoading}
                  >
                    {isAudioLoading ? (
                      <Loader2 className="w-3 h-3 animate-spin" />
                    ) : isSpeaking ? (
                      <VolumeX className="w-3 h-3" />
                    ) : (
                      <Volume2 className="w-3 h-3" />
                    )}
                  </Button>
                )}
              </div>
            </div>
          </div>
        ))}

        <div ref={chatEndRef} />
      </div>

      {/* Chat Input */}
      <div className="flex gap-2">
        <div className="flex-1 relative">
          <Textarea
            value={inputMessage}
            onChange={(e) => setInputMessage(e.target.value)}
            placeholder="Задайте вопрос ИИ-наставнику..."
            className="min-h-[60px] bg-white/50 border-white/20 resize-none pr-12"
            onKeyDown={(e) => {
              if (e.key === "Enter" && !e.shiftKey) {
                e.preventDefault()
                handleTextSubmit()
              }
            }}
            disabled={isLoading}
          />
        </div>
        <div className="flex flex-col gap-2">
          <VoiceRecorder onRecordingComplete={handleVoiceRecording} disabled={isLoading} />
          <GradientButton size="icon" onClick={handleTextSubmit} disabled={isLoading || !inputMessage.trim()}>
            {isLoading ? <Loader2 className="w-4 h-4 animate-spin" /> : <Send className="w-4 h-4" />}
          </GradientButton>
        </div>
      </div>
    </div>
  )
}
