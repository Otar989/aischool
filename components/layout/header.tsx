"use client"

import Link from "next/link"
import { Button } from "@/components/ui/button"
import { GradientButton } from "@/components/ui/gradient-button"
import { GlassCard } from "@/components/ui/glass-card"
import { Menu, X, BookOpen } from "lucide-react"
import { useState } from "react"

export function Header() {
  const [isMenuOpen, setIsMenuOpen] = useState(false)

  return (
    <header className="fixed top-0 left-0 right-0 z-50 p-4">
      <GlassCard className="mx-auto max-w-7xl px-6 py-4">
        <nav className="flex items-center justify-between">
          {/* Logo */}
          <Link href="/" className="flex items-center gap-2 font-bold text-xl">
            <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-primary to-blue-600 flex items-center justify-center">
              <BookOpen className="w-5 h-5 text-white" />
            </div>
            <span className="font-sans">AI Школа</span>
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center gap-8">
            <Link href="/courses" className="text-foreground/80 hover:text-foreground transition-colors">
              Курсы
            </Link>
            <Link href="/about" className="text-foreground/80 hover:text-foreground transition-colors">
              О платформе
            </Link>
            <Link href="/pricing" className="text-foreground/80 hover:text-foreground transition-colors">
              Тарифы
            </Link>
          </div>

          {/* Desktop Auth Buttons */}
          <div className="hidden md:flex items-center gap-4">
            <Button variant="ghost" asChild>
              <Link href="/login">Войти</Link>
            </Button>
            <GradientButton asChild>
              <Link href="/register">Начать обучение</Link>
            </GradientButton>
          </div>

          {/* Mobile Menu Button */}
          <Button variant="ghost" size="icon" className="md:hidden" onClick={() => setIsMenuOpen(!isMenuOpen)}>
            {isMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </Button>
        </nav>

        {/* Mobile Menu */}
        {isMenuOpen && (
          <div className="md:hidden mt-4 pt-4 border-t border-white/20">
            <div className="flex flex-col gap-4">
              <Link href="/courses" className="text-foreground/80 hover:text-foreground transition-colors">
                Курсы
              </Link>
              <Link href="/about" className="text-foreground/80 hover:text-foreground transition-colors">
                О платформе
              </Link>
              <Link href="/pricing" className="text-foreground/80 hover:text-foreground transition-colors">
                Тарифы
              </Link>
              <div className="flex flex-col gap-2 pt-4 border-t border-white/20">
                <Button variant="ghost" asChild>
                  <Link href="/login">Войти</Link>
                </Button>
                <GradientButton asChild>
                  <Link href="/register">Начать обучение</Link>
                </GradientButton>
              </div>
            </div>
          </div>
        )}
      </GlassCard>
    </header>
  )
}
