"use client"

import { useEffect } from "react"
import { Button } from "@/components/ui/button"
import { GlassCard } from "@/components/ui/glass-card"
import { RefreshCw, Home } from "lucide-react"
import Link from "next/link"

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string }
  reset: () => void
}) {
  useEffect(() => {
    console.error(error)
  }, [error])

  return (
    <div className="min-h-screen flex items-center justify-center px-6">
      <GlassCard className="max-w-md w-full p-8 text-center">
        <div className="text-6xl font-bold text-destructive mb-4">500</div>
        <h1 className="text-2xl font-bold font-sans mb-4">Что-то пошло не так</h1>
        <p className="text-muted-foreground font-serif mb-8">
          Произошла ошибка при загрузке страницы. Попробуйте обновить страницу или вернуться на главную.
        </p>
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Button onClick={reset}>
            <RefreshCw className="mr-2 w-4 h-4" />
            Попробовать снова
          </Button>
          <Button variant="outline" asChild>
            <Link href="/">
              <Home className="mr-2 w-4 h-4" />
              На главную
            </Link>
          </Button>
        </div>
      </GlassCard>
    </div>
  )
}
