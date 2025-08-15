import type { Metadata } from "next"
import { GlassCard } from "@/components/ui/glass-card"
import { GradientButton } from "@/components/ui/gradient-button"
import { Button } from "@/components/ui/button"
import { Check, Star } from "lucide-react"
import Link from "next/link"

export const metadata: Metadata = {
  title: "Тарифы - AI Школа",
  description: "Выберите подходящий тариф для изучения языков с ИИ-преподавателем",
}

export default function PricingPage() {
  const plans = [
    {
      name: "Базовый",
      price: "990",
      period: "месяц",
      description: "Идеально для начинающих",
      features: [
        "Доступ к 3 курсам",
        "ИИ-преподаватель 24/7",
        "Базовые упражнения",
        "Сертификат об окончании",
        "Поддержка в чате",
      ],
      popular: false,
    },
    {
      name: "Премиум",
      price: "1990",
      period: "месяц",
      description: "Для серьезного изучения",
      features: [
        "Доступ ко всем курсам",
        "Персональный ИИ-наставник",
        "Продвинутые упражнения",
        "Голосовое общение с ИИ",
        "Индивидуальный план обучения",
        "Приоритетная поддержка",
        "Сертификаты международного образца",
      ],
      popular: true,
    },
    {
      name: "Годовой",
      price: "15990",
      period: "год",
      originalPrice: "23880",
      description: "Максимальная экономия",
      features: [
        "Все возможности Премиум",
        "Скидка 33%",
        "Бонусные мастер-классы",
        "Персональные консультации",
        "Доступ к закрытому сообществу",
        "Гарантия возврата 30 дней",
      ],
      popular: false,
    },
  ]

  return (
    <div className="min-h-screen pt-24 pb-16">
      <div className="container mx-auto px-4">
        {/* Header */}
        <div className="text-center mb-16">
          <h1 className="text-4xl md:text-6xl font-bold mb-6 bg-gradient-to-r from-primary to-blue-600 bg-clip-text text-transparent">
            Выберите свой тариф
          </h1>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
            Начните изучение языков с персональным ИИ-преподавателем уже сегодня
          </p>
        </div>

        {/* Pricing Cards */}
        <div className="grid md:grid-cols-3 gap-8 max-w-6xl mx-auto">
          {plans.map((plan, index) => (
            <GlassCard key={index} className={`relative p-8 ${plan.popular ? "ring-2 ring-primary" : ""}`}>
              {plan.popular && (
                <div className="absolute -top-4 left-1/2 transform -translate-x-1/2">
                  <div className="bg-gradient-to-r from-primary to-blue-600 text-white px-4 py-2 rounded-full text-sm font-medium flex items-center gap-1">
                    <Star className="w-4 h-4" />
                    Популярный
                  </div>
                </div>
              )}

              <div className="text-center mb-8">
                <h3 className="text-2xl font-bold mb-2">{plan.name}</h3>
                <p className="text-muted-foreground mb-4">{plan.description}</p>
                <div className="mb-4">
                  {plan.originalPrice && (
                    <span className="text-lg text-muted-foreground line-through mr-2">{plan.originalPrice} ₽</span>
                  )}
                  <span className="text-4xl font-bold">{plan.price} ₽</span>
                  <span className="text-muted-foreground">/{plan.period}</span>
                </div>
              </div>

              <ul className="space-y-4 mb-8">
                {plan.features.map((feature, featureIndex) => (
                  <li key={featureIndex} className="flex items-start gap-3">
                    <Check className="w-5 h-5 text-primary mt-0.5 flex-shrink-0" />
                    <span className="text-sm">{feature}</span>
                  </li>
                ))}
              </ul>

              <div className="mt-auto">
                {plan.popular ? (
                  <GradientButton className="w-full" asChild>
                    <Link href="/register">Начать обучение</Link>
                  </GradientButton>
                ) : (
                  <Button variant="outline" className="w-full bg-transparent" asChild>
                    <Link href="/register">Выбрать тариф</Link>
                  </Button>
                )}
              </div>
            </GlassCard>
          ))}
        </div>

        {/* FAQ Section */}
        <div className="mt-20 max-w-4xl mx-auto">
          <h2 className="text-3xl font-bold text-center mb-12">Часто задаваемые вопросы</h2>
          <div className="grid md:grid-cols-2 gap-8">
            <GlassCard className="p-6">
              <h3 className="font-semibold mb-3">Можно ли сменить тариф?</h3>
              <p className="text-muted-foreground text-sm">
                Да, вы можете повысить или понизить тариф в любое время в личном кабинете.
              </p>
            </GlassCard>
            <GlassCard className="p-6">
              <h3 className="font-semibold mb-3">Есть ли пробный период?</h3>
              <p className="text-muted-foreground text-sm">Да, первые 7 дней бесплатно для всех новых пользователей.</p>
            </GlassCard>
            <GlassCard className="p-6">
              <h3 className="font-semibold mb-3">Как работает возврат средств?</h3>
              <p className="text-muted-foreground text-sm">
                Мы возвращаем деньги в течение 30 дней без лишних вопросов.
              </p>
            </GlassCard>
            <GlassCard className="p-6">
              <h3 className="font-semibold mb-3">Нужно ли устанавливать приложение?</h3>
              <p className="text-muted-foreground text-sm">
                Нет, все работает в браузере. Но у нас есть мобильное приложение для удобства.
              </p>
            </GlassCard>
          </div>
        </div>
      </div>
    </div>
  )
}
