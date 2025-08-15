import { Header } from "@/components/layout/header"
import { Footer } from "@/components/layout/footer"
import { GlassCard } from "@/components/ui/glass-card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Mail, Phone, MapPin, Clock } from "lucide-react"

export const metadata = {
  title: "Контакты - AI Learning Platform",
  description: "Свяжитесь с нами для получения поддержки или консультации",
}

export default function ContactsPage() {
  return (
    <div className="min-h-screen">
      <Header />

      <main className="pt-32 pb-20 px-6">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-16">
            <Badge variant="secondary" className="mb-6 bg-primary/10 text-primary border-primary/20">
              Контакты
            </Badge>
            <h1 className="text-4xl md:text-5xl font-bold font-sans mb-6">Свяжитесь с нами</h1>
            <p className="text-xl text-muted-foreground font-serif">
              Мы всегда готовы помочь и ответить на ваши вопросы
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
            {/* Contact Form */}
            <GlassCard className="p-8">
              <h2 className="text-2xl font-bold font-sans mb-6">Напишите нам</h2>
              <form className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium mb-2">Имя</label>
                    <Input placeholder="Ваше имя" />
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-2">Email</label>
                    <Input type="email" placeholder="your@email.com" />
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-medium mb-2">Тема</label>
                  <Input placeholder="Тема сообщения" />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-2">Сообщение</label>
                  <Textarea placeholder="Расскажите, чем мы можем помочь..." rows={6} />
                </div>
                <Button className="w-full">Отправить сообщение</Button>
              </form>
            </GlassCard>

            {/* Contact Info */}
            <div className="space-y-8">
              <GlassCard className="p-6">
                <div className="flex items-start gap-4">
                  <div className="w-12 h-12 rounded-full bg-primary/20 flex items-center justify-center text-primary">
                    <Mail className="w-6 h-6" />
                  </div>
                  <div>
                    <h3 className="font-bold font-sans mb-2">Email</h3>
                    <p className="text-muted-foreground font-serif">support@ailearning.ru</p>
                    <p className="text-muted-foreground font-serif">info@ailearning.ru</p>
                  </div>
                </div>
              </GlassCard>

              <GlassCard className="p-6">
                <div className="flex items-start gap-4">
                  <div className="w-12 h-12 rounded-full bg-primary/20 flex items-center justify-center text-primary">
                    <Phone className="w-6 h-6" />
                  </div>
                  <div>
                    <h3 className="font-bold font-sans mb-2">Телефон</h3>
                    <p className="text-muted-foreground font-serif">+7 (495) 123-45-67</p>
                    <p className="text-muted-foreground font-serif">+7 (800) 555-01-23</p>
                  </div>
                </div>
              </GlassCard>

              <GlassCard className="p-6">
                <div className="flex items-start gap-4">
                  <div className="w-12 h-12 rounded-full bg-primary/20 flex items-center justify-center text-primary">
                    <MapPin className="w-6 h-6" />
                  </div>
                  <div>
                    <h3 className="font-bold font-sans mb-2">Адрес</h3>
                    <p className="text-muted-foreground font-serif">
                      г. Москва, ул. Тверская, д. 1<br />
                      БЦ "Технопарк", офис 501
                    </p>
                  </div>
                </div>
              </GlassCard>

              <GlassCard className="p-6">
                <div className="flex items-start gap-4">
                  <div className="w-12 h-12 rounded-full bg-primary/20 flex items-center justify-center text-primary">
                    <Clock className="w-6 h-6" />
                  </div>
                  <div>
                    <h3 className="font-bold font-sans mb-2">Время работы</h3>
                    <p className="text-muted-foreground font-serif">
                      Пн-Пт: 9:00 - 18:00
                      <br />
                      Сб-Вс: 10:00 - 16:00
                    </p>
                  </div>
                </div>
              </GlassCard>
            </div>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  )
}
