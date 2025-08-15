import { Header } from "@/components/layout/header"
import { Footer } from "@/components/layout/footer"
import { GlassCard } from "@/components/ui/glass-card"
import { Badge } from "@/components/ui/badge"

export const metadata = {
  title: "Пользовательское соглашение - AI Learning Platform",
  description: "Условия использования платформы AI Learning Platform",
}

export default function TermsPage() {
  return (
    <div className="min-h-screen">
      <Header />

      <main className="pt-32 pb-20 px-6">
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-16">
            <Badge variant="secondary" className="mb-6 bg-primary/10 text-primary border-primary/20">
              Правовая информация
            </Badge>
            <h1 className="text-4xl md:text-5xl font-bold font-sans mb-6">Пользовательское соглашение</h1>
            <p className="text-xl text-muted-foreground font-serif">
              Условия использования платформы AI Learning Platform
            </p>
          </div>

          <GlassCard className="p-8 space-y-8">
            <section>
              <h2 className="text-2xl font-bold font-sans mb-4">1. Общие положения</h2>
              <p className="text-muted-foreground font-serif leading-relaxed">
                Настоящее Пользовательское соглашение регулирует отношения между ООО "AI Learning Platform" и
                пользователями платформы. Используя наши услуги, вы соглашаетесь с условиями данного соглашения.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-bold font-sans mb-4">2. Предоставляемые услуги</h2>
              <p className="text-muted-foreground font-serif leading-relaxed mb-4">
                AI Learning Platform предоставляет:
              </p>
              <ul className="list-disc list-inside text-muted-foreground font-serif space-y-2">
                <li>Доступ к онлайн-курсам с ИИ-наставником</li>
                <li>Интерактивные уроки с голосовым взаимодействием</li>
                <li>Персонализированные программы обучения</li>
                <li>Сертификаты о прохождении курсов</li>
                <li>Техническую поддержку пользователей</li>
              </ul>
            </section>

            <section>
              <h2 className="text-2xl font-bold font-sans mb-4">3. Права и обязанности пользователя</h2>
              <p className="text-muted-foreground font-serif leading-relaxed mb-4">Пользователь имеет право:</p>
              <ul className="list-disc list-inside text-muted-foreground font-serif space-y-2 mb-4">
                <li>Получать доступ к оплаченным курсам</li>
                <li>Получать техническую поддержку</li>
                <li>Запрашивать возврат средств в соответствии с политикой возврата</li>
              </ul>
              <p className="text-muted-foreground font-serif leading-relaxed mb-4">Пользователь обязуется:</p>
              <ul className="list-disc list-inside text-muted-foreground font-serif space-y-2">
                <li>Предоставлять достоверную информацию при регистрации</li>
                <li>Не передавать доступ к аккаунту третьим лицам</li>
                <li>Соблюдать авторские права на учебные материалы</li>
                <li>Не использовать платформу в противоправных целях</li>
              </ul>
            </section>

            <section>
              <h2 className="text-2xl font-bold font-sans mb-4">4. Оплата и возврат средств</h2>
              <p className="text-muted-foreground font-serif leading-relaxed">
                Оплата курсов производится через безопасные платежные системы. Возврат средств возможен в течение 14
                дней с момента покупки при условии прохождения менее 20% курса.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-bold font-sans mb-4">5. Ответственность</h2>
              <p className="text-muted-foreground font-serif leading-relaxed">
                Компания не несет ответственности за временные технические сбои, а также за результаты обучения, которые
                зависят от индивидуальных особенностей и усилий пользователя.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-bold font-sans mb-4">6. Изменения соглашения</h2>
              <p className="text-muted-foreground font-serif leading-relaxed">
                Компания оставляет за собой право изменять условия соглашения с уведомлением пользователей за 30 дней до
                вступления изменений в силу.
              </p>
            </section>

            <div className="pt-8 border-t border-border">
              <p className="text-sm text-muted-foreground font-serif">
                Последнее обновление: {new Date().toLocaleDateString("ru-RU")}
              </p>
            </div>
          </GlassCard>
        </div>
      </main>

      <Footer />
    </div>
  )
}
