import type React from "react"
import type { Metadata } from "next"
import { Inter } from "next/font/google"
import "./globals.css"

const inter = Inter({
  subsets: ["latin"],
  display: "swap",
  variable: "--font-inter",
  weight: ["400", "500", "600", "700"],
})

const interSerif = Inter({
  subsets: ["latin"],
  display: "swap",
  variable: "--font-inter-serif",
})

export const metadata: Metadata = {
  title: "AI Learning Platform - Персональное обучение с ИИ",
  description:
    "Революционная платформа онлайн-обучения с ИИ-наставником. Изучайте новые навыки с персональным подходом.",
  generator: "AI Learning Platform",
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="ru" className={`${inter.variable} ${interSerif.variable} antialiased`}>
      <body className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-cyan-50">{children}</body>
    </html>
  )
}
