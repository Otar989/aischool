import type React from "react"
import type { Metadata } from "next"
import { Inter } from "next/font/google"
import localFont from "next/font/local"
import "./globals.css"

const sfPro = localFont({
  src: [
    {
      path: "https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&display=swap",
      weight: "400",
      style: "normal",
    },
  ],
  variable: "--font-sf-pro",
  display: "swap",
  fallback: ["system-ui", "arial"],
})

const inter = Inter({
  subsets: ["latin"],
  display: "swap",
  variable: "--font-inter",
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
    <html lang="ru" className={`${sfPro.variable} ${inter.variable} antialiased`}>
      <body className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-cyan-50">{children}</body>
    </html>
  )
}
