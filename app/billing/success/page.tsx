import { Header } from "@/components/layout/header"
import { GlassCard } from "@/components/ui/glass-card"
import { GradientButton } from "@/components/ui/gradient-button"
import { CheckCircle, ArrowRight } from "lucide-react"
import Link from "next/link"

export default function PaymentSuccessPage() {
  return (
    <div className="min-h-screen">
      <Header />

      <div className="pt-32 pb-20 px-6">
        <div className="max-w-2xl mx-auto text-center">
          <GlassCard className="p-12">
            <div className="w-16 h-16 rounded-full bg-green-500 flex items-center justify-center mx-auto mb-6">
              <CheckCircle className="w-8 h-8 text-white" />
            </div>

            <h1 className="text-3xl font-bold font-sans mb-4">Платеж успешно обработан!</h1>
            <p className="text-xl text-muted-foreground font-serif mb-8">
              Спасибо за покупку. Теперь у вас есть доступ к выбранному контенту.
            </p>

            <div className="space-y-4">
              <GradientButton size="lg" asChild>
                <Link href="/dashboard">
                  Перейти к обучению
                  <ArrowRight className="ml-2 w-5 h-5" />
                </Link>
              </GradientButton>

              <div className="text-sm text-muted-foreground">
                <p>Квитанция отправлена на вашу электронную почту</p>
              </div>
            </div>
          </GlassCard>
        </div>
      </div>
    </div>
  )
}
