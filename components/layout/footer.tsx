import React from "react"
import Link from "next/link"
import { BookOpen, Mail, Phone } from "lucide-react"

export function Footer() {
  return (
    <footer className="bg-gradient-to-t from-gray-900/50 to-transparent backdrop-blur-sm border-t border-white/10">
      <div className="max-w-7xl mx-auto px-6 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* Logo and Description */}
          <div className="col-span-1 md:col-span-2">
            <div className="flex items-center gap-2 mb-4">
              <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-primary to-blue-600 flex items-center justify-center">
                <BookOpen className="w-5 h-5 text-white" />
              </div>
              <span className="font-bold text-xl font-sans">AI Школа</span>
            </div>
            <p className="text-muted-foreground mb-4 max-w-md">
              Революционная платформа онлайн-обучения с персональным ИИ-наставником. Изучайте новые навыки эффективно и
              с удовольствием.
            </p>
            <div className="flex items-center gap-4 text-sm text-muted-foreground">
              <div className="flex items-center gap-1">
                <Mail className="w-4 h-4" />
                <span>support@ai-school.ru</span>
              </div>
              <div className="flex items-center gap-1">
                <Phone className="w-4 h-4" />
                <span>+7 (495) 123-45-67</span>
              </div>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="font-semibold mb-4">Обучение</h3>
            <div className="flex flex-col gap-2 text-sm">
              <Link href="/courses" className="text-muted-foreground hover:text-foreground transition-colors">
                Каталог курсов
              </Link>
              <Link href="/pricing" className="text-muted-foreground hover:text-foreground transition-colors">
                Тарифы
              </Link>
              <Link href="/certificates" className="text-muted-foreground hover:text-foreground transition-colors">
                Сертификаты
              </Link>
              <Link href="/demo" className="text-muted-foreground hover:text-foreground transition-colors">
                Демо-урок
              </Link>
            </div>
          </div>

          {/* Company */}
          <div>
            <h3 className="font-semibold mb-4">Компания</h3>
            <div className="flex flex-col gap-2 text-sm">
              <Link href="/about" className="text-muted-foreground hover:text-foreground transition-colors">
                О нас
              </Link>
              <Link href="/contacts" className="text-muted-foreground hover:text-foreground transition-colors">
                Контакты
              </Link>
              <Link href="/legal/terms" className="text-muted-foreground hover:text-foreground transition-colors">
                Условия использования
              </Link>
              <Link href="/legal/privacy" className="text-muted-foreground hover:text-foreground transition-colors">
                Политика конфиденциальности
              </Link>
            </div>
          </div>
        </div>

        <div className="border-t border-white/10 mt-8 pt-8 text-center text-sm text-muted-foreground">
          <p>&copy; 2024 AI Школа. Все права защищены.</p>
        </div>
      </div>
    </footer>
  )
}
