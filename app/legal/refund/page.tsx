import { Header } from "@/components/layout/header"
import { Footer } from "@/components/layout/footer"
import { GlassCard } from "@/components/ui/glass-card"
import { Badge } from "@/components/ui/badge"
import { CheckCircle, XCircle, Clock } from "lucide-react"

export const metadata = {
  title: "Политика возврата - AI Learning Platform",
  description: "Условия возврата средств за курсы AI Learning Platform",
}

export default function RefundPage() {
  return (
    <div className="min-h-screen">
      <Header />

      <main className="pt-32 pb-20 px-6">
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-16">
            <Badge variant="secondary" className="mb-6 bg-primary/10 text-primary border-primary/20">
              Возврат средств
            </Badge>
            <h1 className="text-4xl md:text-5xl font-bold font-sans mb-6">Политика возврата</h1>
            <p className="text-xl text-muted-foreground font-serif">Справедливые условия возврата средств за курсы</p>
          </div>

          <div className="space-y-8">
            <GlassCard className="p-8">
              <h2 className="text-2xl font-bold font-sans mb-6">Условия возврата</h2>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="text-center">
                  <div className="w-16 h-16 rounded-full bg-green-500/20 flex items-center justify-center mx-auto mb-4">
                    <CheckCircle className="w-8 h-8 text-green-500" />
                  </div>
                  <h3 className="font-bold font-sans mb-2">100% возврат</h3>
                  <p className="text-sm text-muted-foreground font-serif">
                    В течение 7 дней, если пройдено менее 10% курса
                  </p>
                </div>
                <div className="text-center">
                  <div className="w-16 h-16 rounded-full bg-yellow-500/20 flex items-center justify-center mx-auto mb-4">
                    <Clock className="w-8 h-8 text-yellow-500" />
                  </div>
                  <h3 className="font-bold font-sans mb-2">50% возврат</h3>
                  <p className="text-sm text-muted-foreground font-serif">
                    В течение 14 дней, если пройдено менее 30% курса
                  </p>
                </div>
                <div className="text-center">
                  <div className="w-16 h-16 rounded-full bg-red-500/20 flex items-center justify-center mx-auto mb-4">
                    <XCircle className="w-8 h-8 text-red-500" />
                  </div>
                  <h3 className="font-bold font-sans mb-2">Без возврата</h3>
                  <p className="text-sm text-muted-foreground font-serif">
                    После 14 дней или при прохождении более 30% курса
                  </p>
                </div>
              </div>
            </GlassCard>

            <GlassCard className="p-8">
              <h2 className="text-2xl font-bold font-sans mb-4">Основания для возврата</h2>
              <div className="space-y-4">
                <div className="flex items-start gap-3">
                  <CheckCircle className="w-5 h-5 text-green-500 mt-1 flex-shrink-0" />
                  <div>
                    <h4 className="font-semibold font-sans">Технические проблемы</h4>
                    <p className="text-muted-foreground font-serif text-sm">
                      Если курс недоступен из-за технических неполадок более 48 часов
                    </p>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <CheckCircle className="w-5 h-5 text-green-500 mt-1 flex-shrink-0" />
                  <div>
                    <h4 className="font-semibold font-sans">Несоответствие описанию</h4>
                    <p className="text-muted-foreground font-serif text-sm">
                      Если содержание курса кардинально не соответствует описанию
                    </p>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <CheckCircle className="w-5 h-5 text-green-500 mt-1 flex-shrink-0" />
                  <div>
                    <h4 className="font-semibold font-sans">Дублирующая покупка</h4>
                    <p className="text-muted-foreground font-serif text-sm">
                      Случайная повторная покупка того же курса
                    </p>
                  </div>
                </div>
              </div>
            </GlassCard>

            <GlassCard className="p-8">
              <h2 className="text-2xl font-bold font-sans mb-4">Как запросить возврат</h2>
              <div className="space-y-6">
                <div className="flex gap-4">
                  <div className="w-8 h-8 rounded-full bg-primary text-primary-foreground flex items-center justify-center text-sm font-bold">
                    1
                  </div>
                  <div>
                    <h4 className="font-semibold font-sans mb-1">Отправьте заявку</h4>
                    <p className="text-muted-foreground font-serif text-sm">
                      Напишите на support@ailearning.ru с указанием причины возврата
                    </p>
                  </div>
                </div>
                <div className="flex gap-4">
                  <div className="w-8 h-8 rounded-full bg-primary text-primary-foreground flex items-center justify-center text-sm font-bold">
                    2
                  </div>
                  <div>
                    <h4 className="font-semibold font-sans mb-1">Рассмотрение заявки</h4>
                    <p className="text-muted-foreground font-serif text-sm">
                      Мы рассмотрим вашу заявку в течение 3 рабочих дней
                    </p>
                  </div>
                </div>
                <div className="flex gap-4">
                  <div className="w-8 h-8 rounded-full bg-primary text-primary-foreground flex items-center justify-center text-sm font-bold">
                    3
                  </div>
                  <div>
                    <h4 className="font-semibold font-sans mb-1">Возврат средств</h4>
                    <p className="text-muted-foreground font-serif text-sm">
                      При одобрении средства вернутся на карту в течение 5-10 рабочих дней
                    </p>
                  </div>
                </div>
              </div>
            </GlassCard>

            <GlassCard className="p-8">
              <h2 className="text-2xl font-bold font-sans mb-4">Исключения</h2>
              <ul className="space-y-2 text-muted-foreground font-serif">
                <li className="flex items-start gap-2">
                  <XCircle className="w-4 h-4 text-red-500 mt-1 flex-shrink-0" />
                  Курсы, приобретенные со скидкой более 50%
                </li>
                <li className="flex items-start gap-2">
                  <XCircle className="w-4 h-4 text-red-500 mt-1 flex-shrink-0" />
                  Подарочные сертификаты и промокоды
                </li>
                <li className="flex items-start gap-2">
                  <XCircle className="w-4 h-4 text-red-500 mt-1 flex-shrink-0" />
                  Курсы, полностью пройденные с получением сертификата
                </li>
              </ul>
            </GlassCard>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  )
}
