import { NextResponse } from "next/server"

const plans = [
  {
    id: "monthly",
    name: "Месячная подписка",
    description: "Доступ ко всем курсам на месяц",
    price: 199000, // 1990 RUB in kopecks
    currency: "RUB",
    interval: "month",
    features: [
      "Доступ ко всем курсам",
      "ИИ-наставник без ограничений",
      "Сертификаты о прохождении",
      "Приоритетная поддержка",
    ],
    popular: false,
  },
  {
    id: "yearly",
    name: "Годовая подписка",
    description: "Доступ ко всем курсам на год со скидкой",
    price: 199000 * 10, // 19900 RUB (2 months free)
    currency: "RUB",
    interval: "year",
    features: [
      "Доступ ко всем курсам",
      "ИИ-наставник без ограничений",
      "Сертификаты о прохождении",
      "Приоритетная поддержка",
      "2 месяца в подарок",
      "Эксклюзивные курсы",
    ],
    popular: true,
    discount: 17, // percentage
  },
]

export async function GET() {
  return NextResponse.json({ plans })
}
