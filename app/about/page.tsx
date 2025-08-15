import { Header } from "@/components/layout/header"
import { Footer } from "@/components/layout/footer"
import { GlassCard } from "@/components/ui/glass-card"
import { Badge } from "@/components/ui/badge"
import { Users, Award, BookOpen, Zap } from "lucide-react"

export const metadata = {
  title: "О платформе - AI Learning Platform",
  description: "Узнайте больше о революционной платформе онлайн-обучения с ИИ-наставником",
}

export default function AboutPage() {
  return (
    <div className="min-h-screen">
      <Header />

      <main className="pt-32 pb-20 px-6">
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-16">
            <Badge variant="secondary" className="mb-6 bg-primary/10 text-primary border-primary/20">
              О нас
            </Badge>
            <h1 className="text-4xl md:text-5xl font-bold font-sans mb-6">Революция в онлайн-образовании</h1>
            <p className="text-xl text-muted-foreground font-serif">
              Мы создаем будущее обучения, где каждый студент получает персонального ИИ-наставника
            </p>
          </div>

          <GlassCard className="p-8 mb-12">
            <h2 className="text-2xl font-bold font-sans mb-6">Наша миссия</h2>
            <p className="text-muted-foreground font-serif text-lg leading-relaxed">
              Мы верим, что качественное образование должно быть доступно каждому. Наша платформа использует передовые
              технологии искусственного интеллекта, чтобы предоставить персонализированное обучение, которое
              адаптируется под индивидуальные потребности каждого студента.
            </p>
          </GlassCard>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-12">
            {[
              {
                icon: <Users className="w-8 h-8" />,
                title: "10,000+ студентов",
                description: "Доверяют нашей платформе для изучения новых навыков",
              },
              {
                icon: <BookOpen className="w-8 h-8" />,
                title: "50+ курсов",
                description: "От программирования до изучения языков",
              },
              {
                icon: <Award className="w-8 h-8" />,
                title: "95% успешности",
                description: "Студенты завершают курсы и достигают целей",
              },
              {
                icon: <Zap className="w-8 h-8" />,
                title: "24/7 поддержка ИИ",
                description: "Персональный наставник всегда готов помочь",
              },
            ].map((stat, index) => (
              <GlassCard key={index} className="p-6 text-center">
                <div className="w-16 h-16 rounded-full bg-gradient-to-br from-primary/20 to-blue-600/20 flex items-center justify-center mx-auto mb-4 text-primary">
                  {stat.icon}
                </div>
                <h3 className="text-xl font-bold font-sans mb-2">{stat.title}</h3>
                <p className="text-muted-foreground font-serif">{stat.description}</p>
              </GlassCard>
            ))}
          </div>

          <GlassCard className="p-8">
            <h2 className="text-2xl font-bold font-sans mb-6">Наша команда</h2>
            <p className="text-muted-foreground font-serif text-lg leading-relaxed mb-6">
              Мы — команда экспертов в области образования, искусственного интеллекта и технологий. Наша цель — сделать
              обучение более эффективным, увлекательным и доступным для всех.
            </p>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {[
                {
                  name: "Анна Иванова",
                  role: "CEO & Основатель",
                  description: "15 лет в EdTech, выпускница MIT",
                },
                {
                  name: "Дмитрий Петров",
                  role: "CTO",
                  description: "Эксперт по ИИ, бывший Google",
                },
                {
                  name: "Елена Сидорова",
                  role: "Head of Education",
                  description: "Методист с 20-летним стажем",
                },
              ].map((member, index) => (
                <div key={index} className="text-center">
                  <div className="w-20 h-20 rounded-full bg-gradient-to-br from-primary/20 to-blue-600/20 mx-auto mb-4"></div>
                  <h4 className="font-bold font-sans">{member.name}</h4>
                  <p className="text-primary text-sm mb-2">{member.role}</p>
                  <p className="text-muted-foreground text-sm font-serif">{member.description}</p>
                </div>
              ))}
            </div>
          </GlassCard>
        </div>
      </main>

      <Footer />
    </div>
  )
}
