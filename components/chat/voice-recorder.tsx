"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { useVoiceRecording } from "@/hooks/use-voice-recording"
import { Mic, MicOff, Loader2 } from "lucide-react"

interface VoiceRecorderProps {
  onRecordingComplete: (audioBlob: Blob) => void
  disabled?: boolean
}

export function VoiceRecorder({ onRecordingComplete, disabled }: VoiceRecorderProps) {
  const [isUploading, setIsUploading] = useState(false)

  const handleRecordingComplete = async (audioBlob: Blob) => {
    setIsUploading(true)
    try {
      onRecordingComplete(audioBlob)
    } finally {
      setIsUploading(false)
    }
  }

  const { isRecording, isSupported, toggleRecording } = useVoiceRecording({
    onRecordingComplete: handleRecordingComplete,
    onError: (error) => {
      console.error("Recording error:", error)
      // You could show a toast notification here
    },
  })

  if (!isSupported) {
    return (
      <Button variant="outline" disabled className="bg-white/10 backdrop-blur-sm border-white/20">
        <MicOff className="w-4 h-4" />
      </Button>
    )
  }

  return (
    <Button
      variant={isRecording ? "destructive" : "outline"}
      size="icon"
      onClick={toggleRecording}
      disabled={disabled || isUploading}
      className="bg-white/10 backdrop-blur-sm border-white/20"
    >
      {isUploading ? (
        <Loader2 className="w-4 h-4 animate-spin" />
      ) : isRecording ? (
        <MicOff className="w-4 h-4" />
      ) : (
        <Mic className="w-4 h-4" />
      )}
    </Button>
  )
}
