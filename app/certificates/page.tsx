import { Header } from "@/components/layout/header"
import { Footer } from "@/components/layout/footer"
import { GlassCard } from "@/components/ui/glass-card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Award, Download, Share, Eye } from "lucide-react"
import { requireAuth } from "@/lib/auth"

export const metadata = {
  title: "Мои сертификаты - AI Learning Platform",
  description: "Просмотр и загрузка сертификатов о прохождении курсов",
}

export default async function CertificatesPage() {
  const user = await requireAuth()

  // Mock certificates data - replace with real data from database
  const certificates = [
    {
      id: 1,
      courseName: "Разговорный китайский для поставщиков",
      completedAt: "2024-01-15",
      grade: "Отлично",
      certificateUrl: "/certificates/cert-1.pdf",
    },
    {
      id: 2,
      courseName: "Telegram Mini Apps за 7 дней",
      completedAt: "2024-01-10",
      grade: "Хорошо",
      certificateUrl: "/certificates/cert-2.pdf",
    },
  ]

  return (
    <div className="min-h-screen">
      <Header />

      <main className="pt-32 pb-20 px-6">
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-16">
            <Badge variant="secondary" className="mb-6 bg-primary/10 text-primary border-primary/20">
              Достижения
            </Badge>
            <h1 className="text-4xl md:text-5xl font-bold font-sans mb-6">Мои сертификаты</h1>
            <p className="text-xl text-muted-foreground font-serif">Ваши достижения в обучении с ИИ-наставником</p>
          </div>

          {certificates.length === 0 ? (
            <GlassCard className="p-12 text-center">
              <Award className="w-16 h-16 text-muted-foreground mx-auto mb-4" />
              <h3 className="text-xl font-bold font-sans mb-2">Пока нет сертификатов</h3>
              <p className="text-muted-foreground font-serif mb-6">
                Завершите курс, чтобы получить свой первый сертификат
              </p>
              <Button asChild>
                <a href="/courses">Выбрать курс</a>
              </Button>
            </GlassCard>
          ) : (
            <div className="space-y-6">
              {certificates.map((cert) => (
                <GlassCard key={cert.id} className="p-6">
                  <div className="flex items-start justify-between">
                    <div className="flex gap-4">
                      <div className="w-16 h-16 rounded-full bg-gradient-to-br from-primary/20 to-blue-600/20 flex items-center justify-center">
                        <Award className="w-8 h-8 text-primary" />
                      </div>
                      <div>
                        <h3 className="text-xl font-bold font-sans mb-2">{cert.courseName}</h3>
                        <div className="space-y-1 text-sm text-muted-foreground font-serif">
                          <p>Завершен: {new Date(cert.completedAt).toLocaleDateString("ru-RU")}</p>
                          <p>
                            Оценка: <span className="text-primary font-semibold">{cert.grade}</span>
                          </p>
                        </div>
                      </div>
                    </div>
                    <div className="flex gap-2">
                      <Button size="sm" variant="outline">
                        <Eye className="w-4 h-4 mr-2" />
                        Просмотр
                      </Button>
                      <Button size="sm" variant="outline">
                        <Download className="w-4 h-4 mr-2" />
                        Скачать
                      </Button>
                      <Button size="sm" variant="outline">
                        <Share className="w-4 h-4 mr-2" />
                        Поделиться
                      </Button>
                    </div>
                  </div>
                </GlassCard>
              ))}
            </div>
          )}
        </div>
      </main>

      <Footer />
    </div>
  )
}
