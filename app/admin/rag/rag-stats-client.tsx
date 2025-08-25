"use client"
import { useEffect, useState } from 'react'

interface Stats {
  assistant_with_rag: number
  total_assistant: number
  avg_chunk_score: number
  avg_top1_score: number
  avg_top3_score: number
  top_material_usage: Record<string, number>
}

export default function RAGStatsClient() {
  const [stats, setStats] = useState<Stats | null>(null)
  const [error, setError] = useState<string | null>(null)
  const [loading, setLoading] = useState(false)
  const [range, setRange] = useState<'1d'|'7d'|'30d'|'all'>('7d')

  useEffect(() => {
    async function load() {
      setLoading(true)
      try {
        const resp = await fetch(`/api/admin/rag/stats?range=${range}`, { cache: 'no-store' })
        if (!resp.ok) throw new Error(await resp.text())
        const data = await resp.json()
        setStats(data)
      } catch (e:any) {
        setError(e.message)
      } finally { setLoading(false) }
    }
    load()
  }, [range])

  if (loading) return <div>Загрузка...</div>
  if (error) return <div className="text-red-600 text-sm">Ошибка: {error}</div>
  if (!stats) return <div>Нет данных</div>

  const coverage = stats.total_assistant ? (stats.assistant_with_rag / stats.total_assistant * 100).toFixed(1) : '0'

  return (
    <div className="space-y-8">
      <div className="flex items-center gap-4">
        <div className="text-sm text-muted-foreground">Диапазон:</div>
        <div className="flex gap-2">
          {(['1d','7d','30d','all'] as const).map(r => (
            <button key={r} onClick={()=>setRange(r)} className={`px-2 py-1 rounded text-xs border ${range===r?'bg-primary text-white border-primary':'hover:bg-white/40'}`}>{r}</button>
          ))}
        </div>
        <button onClick={()=>setRange(range)} className="ml-auto text-xs underline" disabled={loading}>Обновить</button>
      </div>
      <div className="grid md:grid-cols-3 gap-4">
        <StatCard label="Ответов с RAG" value={stats.assistant_with_rag} subtitle={`из ${stats.total_assistant} (${coverage}%)`} />
        <StatCard label="Avg Score (Top1)" value={stats.avg_top1_score?.toFixed(3)} subtitle="средний лучший" />
        <StatCard label="Avg Score (Top3)" value={stats.avg_top3_score?.toFixed(3)} subtitle="среднее по топ-3" />
      </div>
      <div className="grid md:grid-cols-2 gap-6">
        <div className="p-4 rounded-lg border bg-white/50 backdrop-blur">
          <h2 className="font-semibold mb-2">Распределение материалов</h2>
          {stats.top_material_usage ? (
            <ul className="space-y-1 max-h-72 overflow-y-auto text-sm">
              {Object.entries(stats.top_material_usage).map(([mid,count]) => (
                <li key={mid} className="flex justify-between"><span className="font-mono">{mid}</span><span>{count}</span></li>
              ))}
            </ul>
          ) : <div className="text-sm text-muted-foreground">Нет данных</div>}
        </div>
        <div className="p-4 rounded-lg border bg-white/50 backdrop-blur">
          <h2 className="font-semibold mb-2">Средние показатели</h2>
          <table className="w-full text-sm">
            <tbody>
              <tr><td className="py-1 pr-4 text-muted-foreground">Avg Chunk Score</td><td>{stats.avg_chunk_score?.toFixed(3)}</td></tr>
              <tr><td className="py-1 pr-4 text-muted-foreground">Top1</td><td>{stats.avg_top1_score?.toFixed(3)}</td></tr>
              <tr><td className="py-1 pr-4 text-muted-foreground">Top3</td><td>{stats.avg_top3_score?.toFixed(3)}</td></tr>
            </tbody>
          </table>
        </div>
      </div>
    </div>
  )
}

function StatCard({ label, value, subtitle }: { label: string; value: any; subtitle?: string }) {
  return (
    <div className="p-4 rounded-lg border bg-white/50 backdrop-blur">
      <div className="text-xs uppercase tracking-wide text-muted-foreground mb-1">{label}</div>
      <div className="text-2xl font-bold">{value ?? '—'}</div>
      {subtitle && <div className="text-xs text-muted-foreground mt-1">{subtitle}</div>}
    </div>
  )
}
