import { Suspense } from 'react'
import { AdminSidebar } from '@/components/admin/admin-sidebar'
import RAGStatsClient from './index-client'

export const dynamic = 'force-dynamic'

export default function RAGPage() {
  return (
    <div className="flex min-h-screen">
      <AdminSidebar />
      <main className="flex-1 p-8 space-y-8">
        <h1 className="text-2xl font-bold">RAG Аналитика</h1>
        <Suspense fallback={<div>Загрузка статистики...</div>}>
          <RAGStatsClient />
        </Suspense>
      </main>
    </div>
  )
}
