import { Suspense } from 'react'
import MaterialsClient from '@/app/admin/materials/materials-client'

export const runtime = 'nodejs'
export const dynamic = 'force-dynamic'
export const fetchCache = 'force-no-store'

export default function MaterialsPage() {
  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold text-white">Материалы</h1>
      <p className="text-white/60 text-sm">Просмотр и индексирование материалов курса (RAG).</p>
      <Suspense fallback={<div className="text-white/60">Загрузка...</div>}>
        <MaterialsClient />
      </Suspense>
    </div>
  )
}