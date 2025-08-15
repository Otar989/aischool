import { Header } from "@/components/layout/header"
import { Footer } from "@/components/layout/footer"
import { GlassCard } from "@/components/ui/glass-card"
import { GradientButton } from "@/components/ui/gradient-button"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Play, MessageCircle, Mic, Volume2, ArrowRight, CheckCircle, Star } from "lucide-react"
import Link from "next/link"
import Image from "next/image"

export default function DemoPage() {
  return (
    <div className="min-h-screen">
      <Header />

      {/* Demo Hero */}
      <section className="pt-32 pb-12 px-6">
        <div className="max-w-4xl mx-auto text-center">
          <Badge className="mb-4 bg-green-500/10 text-green-600 border-green-500/20">Бесплатный демо-урок</Badge>
          <h1 className="text-3xl md:text-4xl font-bold font-sans mb-4">Попробуйте AI-обучение прямо сейчас</h1>
          <p className="text-xl text-muted-foreground font-serif mb-8">
            Интерактивный урок китайского языка с ИИ-наставником. Никакой регистрации не требуется.
          </p>

          <div className="flex flex-wrap items-center justify-center gap-6 text-sm text-muted-foreground mb-8">
            <div className="flex items-center gap-1">
              <Star className="w-4 h-4 fill-yellow-400 text-yellow-400" />
              <span>15 минут</span>
            </div>
            <div className="flex items-center gap-1">
              <MessageCircle className="w-4 h-4" />
              <span>ИИ-чат</span>
            </div>
            <div className="flex items-center gap-1">
              <Volume2 className="w-4 h-4" />
              <span>Голосовое общение</span>
            </div>
          </div>
        </div>
      </section>

      {/* Demo Lesson Interface */}
      <section className="pb-12 px-6">
        <div className="max-w-6xl mx-auto">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Main Lesson Content */}
            <div className="lg:col-span-2">
              <GlassCard className="p-6 mb-6">
                <div className="flex items-center justify-between mb-4">
                  <h2 className="text-xl font-bold font-sans">Урок 1: Приветствие на китайском</h2>
                  <Badge variant="secondary">Демо</Badge>
                </div>

                {/* Video/Content Area */}
                <div className="relative aspect-video bg-gradient-to-br from-primary/10 to-blue-600/10 rounded-xl mb-6 overflow-hidden">
                  <Image src="/chinese-teacher-classroom.png" alt="Chinese lesson" fill className="object-cover" />
                  <div className="absolute inset-0 flex items-center justify-center">
                    <Button size="lg" className="rounded-full w-16 h-16 bg-white/20 backdrop-blur-sm hover:bg-white/30">
                      <Play className="w-6 h-6 ml-1" />
                    </Button>
                  </div>
                  <div className="absolute bottom-4 left-4 right-4">
                    <div className="bg-black/50 backdrop-blur-sm rounded-lg p-3 text-white">
                      <p className="text-sm">
                        <strong>Учитель:</strong> 你好! (Nǐ hǎo!) - Привет! Давайте изучим основные приветствия.
                      </p>
                    </div>
                  </div>
                </div>

                {/* Lesson Content */}
                <div className="space-y-4">
                  <div className="p-4 bg-blue-500/10 border border-blue-500/20 rounded-lg">
                    <h3 className="font-semibold mb-2">Новые слова:</h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                      <div className="flex items-center gap-3">
                        <span className="text-2xl">你好</span>
                        <div>
                          <div className="font-medium">Nǐ hǎo</div>
                          <div className="text-sm text-muted-foreground">Привет</div>
                        </div>
                      </div>
                      <div className="flex items-center gap-3">
                        <span className="text-2xl">再见</span>
                        <div>
                          <div className="font-medium">Zàijiàn</div>
                          <div className="text-sm text-muted-foreground">До свидания</div>
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="p-4 bg-green-500/10 border border-green-500/20 rounded-lg">
                    <h3 className="font-semibold mb-2">Попробуйте произнести:</h3>
                    <p className="text-muted-foreground mb-3">Нажмите на микрофон и скажите "你好" (Nǐ hǎo)</p>
                    <div className="flex items-center gap-3">
                      <Button size="sm" variant="outline" className="bg-white/10">
                        <Mic className="w-4 h-4 mr-2" />
                        Записать
                      </Button>
                      <Button size="sm" variant="ghost">
                        <Volume2 className="w-4 h-4 mr-2" />
                        Прослушать
                      </Button>
                    </div>
                  </div>
                </div>
              </GlassCard>

              {/* Continue Learning CTA */}
              <GlassCard className="p-6 text-center">
                <h3 className="text-xl font-bold font-sans mb-2">Понравился урок?</h3>
                <p className="text-muted-foreground mb-4">
                  Получите доступ к полному курсу с 50+ уроками и персональным ИИ-наставником
                </p>
                <div className="flex flex-col sm:flex-row gap-3 justify-center">
                  <GradientButton asChild>
                    <Link href="/promo">
                      Начать обучение
                      <ArrowRight className="ml-2 w-4 h-4" />
                    </Link>
                  </GradientButton>
                  <Button variant="outline" className="bg-white/10 backdrop-blur-sm border-white/20" asChild>
                    <Link href="/courses">Посмотреть курсы</Link>
                  </Button>
                </div>
              </GlassCard>
            </div>

            {/* AI Chat Sidebar */}
            <div className="lg:col-span-1">
              <GlassCard className="p-4 h-[600px] flex flex-col">
                <div className="flex items-center gap-2 mb-4 pb-3 border-b border-white/10">
                  <div className="w-8 h-8 rounded-full bg-gradient-to-br from-primary to-blue-600 flex items-center justify-center">
                    <MessageCircle className="w-4 h-4 text-white" />
                  </div>
                  <div>
                    <div className="font-semibold text-sm">ИИ-Наставник</div>
                    <div className="text-xs text-green-500">В сети</div>
                  </div>
                </div>

                {/* Chat Messages */}
                <div className="flex-1 space-y-3 mb-4 overflow-y-auto">
                  <div className="bg-white/10 rounded-lg p-3">
                    <div className="text-sm">
                      <strong>ИИ:</strong> Привет! Я ваш персональный наставник. Готовы изучать китайский? 🇨🇳
                    </div>
                  </div>

                  <div className="bg-primary/20 rounded-lg p-3 ml-6">
                    <div className="text-sm">
                      <strong>Вы:</strong> Да, готов! Как правильно произносить "你好"?
                    </div>
                  </div>

                  <div className="bg-white/10 rounded-lg p-3">
                    <div className="text-sm">
                      <strong>ИИ:</strong> Отлично! "你好" произносится как "Nǐ hǎo". Попробуйте повторить за мной.
                      Обратите внимание на тоны - это очень важно в китайском языке! 🎵
                    </div>
                  </div>

                  <div className="bg-primary/20 rounded-lg p-3 ml-6">
                    <div className="text-sm">
                      <strong>Вы:</strong> Nǐ hǎo! Правильно?
                    </div>
                  </div>

                  <div className="bg-white/10 rounded-lg p-3">
                    <div className="text-sm">
                      <strong>ИИ:</strong> Превосходно! 👏 Ваше произношение очень хорошее. Теперь попробуем "再见"
                      (Zàijiàn) - "до свидания".
                    </div>
                  </div>
                </div>

                {/* Chat Input */}
                <div className="border-t border-white/10 pt-3">
                  <div className="flex gap-2">
                    <input
                      type="text"
                      placeholder="Задайте вопрос..."
                      className="flex-1 px-3 py-2 bg-white/10 border border-white/20 rounded-lg text-sm placeholder:text-muted-foreground"
                      disabled
                    />
                    <Button size="sm" disabled>
                      <ArrowRight className="w-4 h-4" />
                    </Button>
                  </div>
                  <div className="flex items-center justify-between mt-2">
                    <Button size="sm" variant="ghost" disabled>
                      <Mic className="w-4 h-4 mr-1" />
                      Голос
                    </Button>
                    <div className="text-xs text-muted-foreground">Войдите для полного доступа</div>
                  </div>
                </div>
              </GlassCard>
            </div>
          </div>
        </div>
      </section>

      {/* Features Preview */}
      <section className="py-12 px-6 bg-gradient-to-br from-primary/5 to-blue-600/5">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-2xl font-bold font-sans mb-8">Что вас ждет в полной версии</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <GlassCard className="p-6">
              <CheckCircle className="w-8 h-8 text-green-500 mx-auto mb-3" />
              <h3 className="font-semibold mb-2">50+ интерактивных уроков</h3>
              <p className="text-sm text-muted-foreground">От базового до продвинутого уровня</p>
            </GlassCard>

            <GlassCard className="p-6">
              <MessageCircle className="w-8 h-8 text-blue-500 mx-auto mb-3" />
              <h3 className="font-semibold mb-2">ИИ-наставник 24/7</h3>
              <p className="text-sm text-muted-foreground">Персональная помощь в любое время</p>
            </GlassCard>

            <GlassCard className="p-6">
              <Volume2 className="w-8 h-8 text-purple-500 mx-auto mb-3" />
              <h3 className="font-semibold mb-2">Голосовое общение</h3>
              <p className="text-sm text-muted-foreground">Практикуйте произношение с ИИ</p>
            </GlassCard>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  )
}
