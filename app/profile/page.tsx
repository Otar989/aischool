import { Header } from "@/components/layout/header"
import { Footer } from "@/components/layout/footer"
import { GlassCard } from "@/components/ui/glass-card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { requireAuth } from "@/lib/auth"

export const metadata = {
  title: "Профиль - AI Learning Platform",
  description: "Управление профилем пользователя",
}

export default async function ProfilePage() {
  const user = await requireAuth()

  return (
    <div className="min-h-screen">
      <Header />

      <main className="pt-32 pb-20 px-6">
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-16">
            <Badge variant="secondary" className="mb-6 bg-primary/10 text-primary border-primary/20">
              Профиль
            </Badge>
            <h1 className="text-4xl md:text-5xl font-bold font-sans mb-6">Мой профиль</h1>
            <p className="text-xl text-muted-foreground font-serif">Управление личной информацией и настройками</p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Profile Info */}
            <div className="lg:col-span-1">
              <GlassCard className="p-6 text-center">
                <Avatar className="w-24 h-24 mx-auto mb-4">
                  <AvatarImage src={user.avatar_url || "/placeholder.svg"} />
                  <AvatarFallback className="text-2xl">
                    {user.name?.charAt(0) || user.email.charAt(0).toUpperCase()}
                  </AvatarFallback>
                </Avatar>
                <h3 className="text-xl font-bold font-sans mb-2">{user.name || "Пользователь"}</h3>
                <p className="text-muted-foreground font-serif mb-4">{user.email}</p>
                <Badge variant="secondary">{user.role}</Badge>

                <div className="mt-6 space-y-4">
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-muted-foreground">Курсов завершено</span>
                    <span className="font-semibold">3</span>
                  </div>
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-muted-foreground">Сертификатов</span>
                    <span className="font-semibold">2</span>
                  </div>
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-muted-foreground">Часов обучения</span>
                    <span className="font-semibold">45</span>
                  </div>
                </div>
              </GlassCard>
            </div>

            {/* Profile Form */}
            <div className="lg:col-span-2">
              <GlassCard className="p-8">
                <h2 className="text-2xl font-bold font-sans mb-6">Личная информация</h2>
                <form className="space-y-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium mb-2">Имя</label>
                      <Input defaultValue={user.name || ""} placeholder="Ваше имя" />
                    </div>
                    <div>
                      <label className="block text-sm font-medium mb-2">Email</label>
                      <Input defaultValue={user.email} disabled />
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium mb-2">О себе</label>
                    <Textarea placeholder="Расскажите о себе..." rows={4} />
                  </div>

                  <div>
                    <label className="block text-sm font-medium mb-2">Цели обучения</label>
                    <Textarea placeholder="Какие цели вы хотите достичь с помощью обучения?" rows={3} />
                  </div>

                  <div className="flex gap-4">
                    <Button>Сохранить изменения</Button>
                    <Button variant="outline">Отмена</Button>
                  </div>
                </form>
              </GlassCard>

              <GlassCard className="p-8 mt-8">
                <h2 className="text-2xl font-bold font-sans mb-6">Настройки уведомлений</h2>
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <h4 className="font-semibold">Email уведомления</h4>
                      <p className="text-sm text-muted-foreground">Получать уведомления о новых курсах</p>
                    </div>
                    <input type="checkbox" className="toggle" defaultChecked />
                  </div>
                  <div className="flex items-center justify-between">
                    <div>
                      <h4 className="font-semibold">Напоминания о занятиях</h4>
                      <p className="text-sm text-muted-foreground">Напоминания о запланированных уроках</p>
                    </div>
                    <input type="checkbox" className="toggle" defaultChecked />
                  </div>
                  <div className="flex items-center justify-between">
                    <div>
                      <h4 className="font-semibold">Маркетинговые рассылки</h4>
                      <p className="text-sm text-muted-foreground">Специальные предложения и акции</p>
                    </div>
                    <input type="checkbox" className="toggle" />
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
