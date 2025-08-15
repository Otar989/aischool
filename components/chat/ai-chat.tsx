"use client"

import { useState, useRef, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
import { GradientButton } from "@/components/ui/gradient-button"
import { VoiceRecorder } from "./voice-recorder"
import { Send, Volume2, VolumeX, Loader2 } from "lucide-react"

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
  const chatEndRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: "smooth" })
  }, [messages])

  const sendMessage = async (content: string, audioBlob?: Blob) => {
    if (!content.trim() && !audioBlob) return

    setIsLoading(true)

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

      if (!response.ok) {
        throw new Error("Failed to send message")
      }

      const { message: aiMessage } = await response.json()

      const assistantMessage: ChatMessage = {
        role: "assistant",
        content: aiMessage.content,
        timestamp: new Date(aiMessage.timestamp),
      }

      setMessages((prev) => [...prev, assistantMessage])
      onMessageSent?.(assistantMessage)
    } catch (error) {
      console.error("Error sending message:", error)
      // Add error message
      setMessages((prev) => [
        ...prev,
        {
          role: "assistant",
          content: "Извините, произошла ошибка. Попробуйте еще раз.",
          timestamp: new Date(),
        },
      ])
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
    if (isSpeaking) return

    setIsSpeaking(true)
    try {
      const response = await fetch("/api/chat/voice/tts", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ text }),
      })

      if (response.ok) {
        const { audioUrl } = await response.json()
        const audio = new Audio(audioUrl)
        audio.onended = () => setIsSpeaking(false)
        audio.onerror = () => setIsSpeaking(false)
        await audio.play()
      }
    } catch (error) {
      console.error("Error playing audio:", error)
      setIsSpeaking(false)
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
              <p className="text-sm whitespace-pre-wrap">{message.content}</p>
              <div className="flex items-center justify-between mt-2">
                <span className="text-xs opacity-70">
                  {message.timestamp.toLocaleTimeString("ru-RU", {
                    hour: "2-digit",
                    minute: "2-digit",
                  })}
                </span>
                {message.role === "assistant" && (
                  <Button
                    variant="ghost"
                    size="sm"
                    className="h-6 px-2 text-xs ml-2"
                    onClick={() => handlePlayAudio(message.content)}
                    disabled={isSpeaking}
                  >
                    {isSpeaking ? <VolumeX className="w-3 h-3" /> : <Volume2 className="w-3 h-3" />}
                  </Button>
                )}
              </div>
            </div>
          </div>
        ))}

        {isLoading && (
          <div className="flex justify-start">
            <div className="bg-white/10 backdrop-blur-sm border border-white/20 px-4 py-3 rounded-lg">
              <div className="flex items-center gap-2">
                <Loader2 className="w-4 h-4 animate-spin" />
                <span className="text-sm">ИИ-наставник печатает...</span>
              </div>
            </div>
          </div>
        )}

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
