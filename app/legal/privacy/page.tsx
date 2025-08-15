import { Header } from "@/components/layout/header"
import { Footer } from "@/components/layout/footer"
import { GlassCard } from "@/components/ui/glass-card"
import { Badge } from "@/components/ui/badge"

export const metadata = {
  title: "Политика конфиденциальности - AI Learning Platform",
  description: "Политика обработки персональных данных AI Learning Platform",
}

export default function PrivacyPage() {
  return (
    <div className="min-h-screen">
      <Header />

      <main className="pt-32 pb-20 px-6">
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-16">
            <Badge variant="secondary" className="mb-6 bg-primary/10 text-primary border-primary/20">
              Конфиденциальность
            </Badge>
            <h1 className="text-4xl md:text-5xl font-bold font-sans mb-6">Политика конфиденциальности</h1>
            <p className="text-xl text-muted-foreground font-serif">
              Как мы собираем, используем и защищаем ваши данные
            </p>
          </div>

          <GlassCard className="p-8 space-y-8">
            <section>
              <h2 className="text-2xl font-bold font-sans mb-4">1. Сбор информации</h2>
              <p className="text-muted-foreground font-serif leading-relaxed mb-4">
                Мы собираем следующие типы информации:
              </p>
              <ul className="list-disc list-inside text-muted-foreground font-serif space-y-2">
                <li>Личная информация: имя, email, телефон при регистрации</li>
                <li>Данные об обучении: прогресс, результаты тестов, время занятий</li>
                <li>Техническая информация: IP-адрес, браузер, устройство</li>
                <li>Голосовые записи для функции распознавания речи</li>
              </ul>
            </section>

            <section>
              <h2 className="text-2xl font-bold font-sans mb-4">2. Использование данных</h2>
              <p className="text-muted-foreground font-serif leading-relaxed mb-4">
                Мы используем собранную информацию для:
              </p>
              <ul className="list-disc list-inside text-muted-foreground font-serif space-y-2">
                <li>Предоставления персонализированного обучения</li>
                <li>Улучшения качества ИИ-наставника</li>
                <li>Отправки уведомлений о курсах и обновлениях</li>
                <li>Обеспечения безопасности платформы</li>
                <li>Анализа эффективности обучения</li>
              </ul>
            </section>

            <section>
              <h2 className="text-2xl font-bold font-sans mb-4">3. Защита данных</h2>
              <p className="text-muted-foreground font-serif leading-relaxed">
                Мы применяем современные методы защиты: шифрование данных, безопасные серверы, ограниченный доступ
                сотрудников к персональной информации, регулярные аудиты безопасности.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-bold font-sans mb-4">4. Передача данных третьим лицам</h2>
              <p className="text-muted-foreground font-serif leading-relaxed">
                Мы не продаем и не передаем персональные данные третьим лицам, за исключением случаев, необходимых для
                работы платформы (платежные системы, облачные сервисы) или по требованию закона.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-bold font-sans mb-4">5. Ваши права</h2>
              <p className="text-muted-foreground font-serif leading-relaxed mb-4">Вы имеете право:</p>
              <ul className="list-disc list-inside text-muted-foreground font-serif space-y-2">
                <li>Запросить доступ к своим персональным данным</li>
                <li>Исправить неточную информацию</li>
                <li>Удалить свой аккаунт и данные</li>
                <li>Ограничить обработку данных</li>
                <li>Отозвать согласие на обработку</li>
              </ul>
            </section>

            <section>
              <h2 className="text-2xl font-bold font-sans mb-4">6. Cookies и аналитика</h2>
              <p className="text-muted-foreground font-serif leading-relaxed">
                Мы используем cookies для улучшения работы сайта и анализа поведения пользователей. Вы можете отключить
                cookies в настройках браузера.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-bold font-sans mb-4">7. Контакты</h2>
              <p className="text-muted-foreground font-serif leading-relaxed">
                По вопросам обработки персональных данных обращайтесь: privacy@ailearning.ru
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
