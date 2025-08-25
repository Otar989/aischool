"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { cn } from "@/lib/utils"
import { GlassCard } from "@/components/ui/glass-card"
import { BarChart3, Users, BookOpen, MessageSquare, CreditCard, Settings, Home, FileText } from "lucide-react"

const navigation = [
  { name: "Обзор", href: "/admin", icon: Home },
  { name: "Аналитика", href: "/admin/analytics", icon: BarChart3 },
  { name: "Пользователи", href: "/admin/users", icon: Users },
  { name: "Курсы", href: "/admin/courses", icon: BookOpen },
  { name: "Материалы", href: "/admin/materials", icon: FileText },
  { name: "Контент", href: "/admin/content", icon: FileText },
  { name: "Чат-сессии", href: "/admin/chat-sessions", icon: MessageSquare },
  { name: "Платежи", href: "/admin/payments", icon: CreditCard },
  { name: "Настройки", href: "/admin/settings", icon: Settings },
]

export function AdminSidebar() {
  const pathname = usePathname()

  return (
    <div className="w-64 p-4">
      <GlassCard className="p-4 h-full">
        <div className="mb-8">
          <h2 className="text-xl font-bold font-sans text-white">AI Школа</h2>
          <p className="text-sm text-white/60">Админ панель</p>
        </div>

        <nav className="space-y-2">
          {navigation.map((item) => {
            const isActive = pathname === item.href
            return (
              <Link
                key={item.name}
                href={item.href}
                className={cn(
                  "flex items-center px-3 py-2 rounded-lg text-sm font-medium transition-colors",
                  isActive
                    ? "bg-primary/20 text-primary border border-primary/30"
                    : "text-white/70 hover:text-white hover:bg-white/10",
                )}
              >
                <item.icon className="w-4 h-4 mr-3" />
                {item.name}
              </Link>
            )
          })}
        </nav>
      </GlassCard>
    </div>
  )
}
