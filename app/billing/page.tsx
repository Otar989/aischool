import { Header } from "@/components/layout/header"
import { Footer } from "@/components/layout/footer"
import { GlassCard } from "@/components/ui/glass-card"
import { GradientButton } from "@/components/ui/gradient-button"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Check, CreditCard, Calendar, Download, RefreshCw } from "lucide-react"
import Link from "next/link"

// Mock data - in real app this would come from database
const subscriptionData = {
  isActive: true,
  plan: "yearly",
  status: "active",
  currentPeriodEnd: "2024-12-15",
  nextBillingAmount: 19900,
  currency: "RUB",
}

const paymentHistory = [
  {
    id: "1",
    date: "2024-01-15",
    description: "Годовая подписка AI Школа",
    amount: 19900,
    status: "paid",
    invoice: "/invoices/inv_001.pdf",
  },
  {
    id: "2",
    date: "2023-12-15",
    description: "Курс: Разговорный китайский для поставщиков",
    amount: 2990,
    status: "paid",
    invoice: "/invoices/inv_002.pdf",
  },
  {
    id: "3",
    date: "2023-11-20",
    description: "Месячная подписка AI Школа",
    amount: 1990,
    status: "refunded",
    invoice: "/invoices/inv_003.pdf",
  },
]

const plans = [
  {
    id: "monthly",
    name: "Месячная подписка",
    price: 1990,
    interval: "месяц",
    features: [
      "Доступ ко всем курсам",
      "ИИ-наставник без ограничений",
      "Сертификаты о прохождении",
      "Приоритетная поддержка",
    ],
  },
  {
    id: "yearly",
    name: "Годовая подписка",
    price: 19900,
    originalPrice: 23880,
    interval: "год",
    popular: true,
    features: [
      "Доступ ко всем курсам",
      "ИИ-наставник без ограничений",
      "Сертификаты о прохождении",
      "Приоритетная поддержка",
      "2 месяца в подарок",
      "Эксклюзивные курсы",
    ],
  },
]

export default function BillingPage() {
  const currentPlan = plans.find((plan) => plan.id === subscriptionData.plan)

  return (
    <div className="min-h-screen">
      <Header />

      <div className="pt-32 pb-20 px-6">
        <div className="max-w-4xl mx-auto">
          <div className="mb-8">
            <h1 className="text-3xl font-bold font-sans mb-2">Управление подпиской</h1>
            <p className="text-muted-foreground font-serif">
              Управляйте своей подпиской и просматривайте историю платежей
            </p>
          </div>

          {/* Current Subscription */}
          <GlassCard className="p-6 mb-8">
            <div className="flex items-start justify-between mb-6">
              <div>
                <h2 className="text-xl font-bold font-sans mb-2">Текущая подписка</h2>
                {subscriptionData.isActive ? (
                  <div className="flex items-center gap-2">
                    <Badge className="bg-green-500 text-white">Активна</Badge>
                    <span className="text-sm text-muted-foreground">
                      до {new Date(subscriptionData.currentPeriodEnd).toLocaleDateString("ru-RU")}
                    </span>
                  </div>
                ) : (
                  <Badge variant="secondary">Неактивна</Badge>
                )}
              </div>
              <div className="text-right">
                <div className="text-2xl font-bold text-primary">
                  {subscriptionData.nextBillingAmount.toLocaleString()} ₽
                </div>
                <div className="text-sm text-muted-foreground">следующий платеж</div>
              </div>
            </div>

            {currentPlan && (
              <div className="mb-6">
                <h3 className="font-semibold mb-2">{currentPlan.name}</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                  {currentPlan.features.map((feature, index) => (
                    <div key={index} className="flex items-center gap-2">
                      <Check className="w-4 h-4 text-green-500" />
                      <span className="text-sm">{feature}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}

            <div className="flex flex-wrap gap-3">
              <Button variant="outline" className="bg-white/10 backdrop-blur-sm border-white/20">
                <RefreshCw className="w-4 h-4 mr-2" />
                Изменить план
              </Button>
              <Button variant="outline" className="bg-white/10 backdrop-blur-sm border-white/20">
                <CreditCard className="w-4 h-4 mr-2" />
                Способ оплаты
              </Button>
              <Button
                variant="outline"
                className="bg-white/10 backdrop-blur-sm border-white/20 text-red-400 border-red-400/20"
              >
                Отменить подписку
              </Button>
            </div>
          </GlassCard>

          {/* Available Plans */}
          <section className="mb-8">
            <h2 className="text-2xl font-bold font-sans mb-6">Доступные тарифы</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {plans.map((plan) => (
                <GlassCard key={plan.id} className={`p-6 relative ${plan.popular ? "ring-2 ring-primary" : ""}`}>
                  {plan.popular && (
                    <Badge className="absolute -top-3 left-1/2 transform -translate-x-1/2 bg-primary text-primary-foreground">
                      Популярный
                    </Badge>
                  )}

                  <div className="text-center mb-6">
                    <h3 className="text-xl font-bold font-sans mb-2">{plan.name}</h3>
                    <div className="flex items-center justify-center gap-2 mb-2">
                      <span className="text-3xl font-bold text-primary">{plan.price.toLocaleString()} ₽</span>
                      {plan.originalPrice && (
                        <span className="text-lg text-muted-foreground line-through">
                          {plan.originalPrice.toLocaleString()} ₽
                        </span>
                      )}
                    </div>
                    <div className="text-sm text-muted-foreground">за {plan.interval}</div>
                  </div>

                  <div className="space-y-3 mb-6">
                    {plan.features.map((feature, index) => (
                      <div key={index} className="flex items-center gap-2">
                        <Check className="w-4 h-4 text-green-500" />
                        <span className="text-sm">{feature}</span>
                      </div>
                    ))}
                  </div>

                  <GradientButton
                    className="w-full"
                    variant={subscriptionData.plan === plan.id ? "secondary" : "primary"}
                    disabled={subscriptionData.plan === plan.id}
                  >
                    {subscriptionData.plan === plan.id ? "Текущий план" : "Выбрать план"}
                  </GradientButton>
                </GlassCard>
              ))}
            </div>
          </section>

          {/* Payment History */}
          <section>
            <h2 className="text-2xl font-bold font-sans mb-6">История платежей</h2>
            <GlassCard className="p-6">
              <div className="space-y-4">
                {paymentHistory.map((payment) => (
                  <div
                    key={payment.id}
                    className="flex items-center justify-between p-4 rounded-lg bg-white/5 backdrop-blur-sm border border-white/10"
                  >
                    <div className="flex items-center gap-4">
                      <div className="w-10 h-10 rounded-full bg-primary/20 flex items-center justify-center">
                        <CreditCard className="w-5 h-5 text-primary" />
                      </div>
                      <div>
                        <div className="font-medium">{payment.description}</div>
                        <div className="text-sm text-muted-foreground flex items-center gap-2">
                          <Calendar className="w-4 h-4" />
                          {new Date(payment.date).toLocaleDateString("ru-RU")}
                        </div>
                      </div>
                    </div>

                    <div className="flex items-center gap-4">
                      <div className="text-right">
                        <div className="font-semibold">{payment.amount.toLocaleString()} ₽</div>
                        <Badge
                          variant={
                            payment.status === "paid"
                              ? "default"
                              : payment.status === "refunded"
                                ? "secondary"
                                : "destructive"
                          }
                          className={
                            payment.status === "paid"
                              ? "bg-green-500 text-white"
                              : payment.status === "refunded"
                                ? "bg-yellow-500 text-white"
                                : ""
                          }
                        >
                          {payment.status === "paid"
                            ? "Оплачено"
                            : payment.status === "refunded"
                              ? "Возвращено"
                              : "Ошибка"}
                        </Badge>
                      </div>
                      <Button variant="ghost" size="icon" asChild>
                        <Link href={payment.invoice}>
                          <Download className="w-4 h-4" />
                        </Link>
                      </Button>
                    </div>
                  </div>
                ))}
              </div>

              {paymentHistory.length === 0 && (
                <div className="text-center py-8 text-muted-foreground">
                  <CreditCard className="w-12 h-12 mx-auto mb-4 opacity-50" />
                  <p>История платежей пуста</p>
                </div>
              )}
            </GlassCard>
          </section>
        </div>
      </div>

      <Footer />
    </div>
  )
}
