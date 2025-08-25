"use client"
import { useEffect, useState } from 'react'
import { GlassCard } from '@/components/ui/glass-card'
import { Button } from '@/components/ui/button'
import { Checkbox } from '@/components/ui/checkbox'
import { toast } from 'sonner'

interface MaterialSummary { id: string; course_id: string; title: string; kind: string; src: string }

export default function MaterialsClient() {
  const [loading, setLoading] = useState(false)
  const [materials, setMaterials] = useState<MaterialSummary[]>([])
  const [selected, setSelected] = useState<Set<string>>(new Set())
  const [batchRunning, setBatchRunning] = useState(false)

  async function loadUnindexed() {
    setLoading(true)
    try {
      const res = await fetch('/api/materials/unindexed', { cache: 'no-store' })
      const json = await res.json()
      if (!res.ok) throw new Error(json.error || 'Ошибка загрузки')
      setMaterials(json.materials || [])
      setSelected(new Set())
    } catch (e:any) {
      toast.error(e.message)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => { loadUnindexed() }, [])

  function toggle(id: string) {
    setSelected(prev => {
      const n = new Set(prev)
      if (n.has(id)) n.delete(id); else n.add(id)
      return n
    })
  }

  async function indexSelected(all = false) {
    const ids = all ? materials.map(m=>m.id) : Array.from(selected)
    if (!ids.length) {
      toast.info('Нет выбранных материалов')
      return
    }
    setBatchRunning(true)
    try {
      const res = await fetch('/api/materials/unindexed', { method: 'POST', headers: { 'Content-Type':'application/json' }, body: JSON.stringify({ ids }) })
      const json = await res.json()
      if (!res.ok) throw new Error(json.error || 'Ошибка')
      const ok = json.results.filter((r:any)=>r.ok).length
      const fail = json.results.length - ok
      toast.success(`Индексировано: ${ok}, ошибок: ${fail}`)
      await loadUnindexed()
    } catch (e:any) {
      toast.error(e.message)
    } finally {
      setBatchRunning(false)
    }
  }

  return (
    <GlassCard className="p-6">
      <div className="flex items-center gap-4 mb-4">
        <Button size="sm" variant="outline" onClick={loadUnindexed} disabled={loading || batchRunning}>Обновить</Button>
        <Button size="sm" onClick={() => indexSelected(false)} disabled={batchRunning || selected.size===0}>Индексировать выбранные ({selected.size})</Button>
        <Button size="sm" variant="secondary" onClick={() => indexSelected(true)} disabled={batchRunning || materials.length===0}>Индексировать все ({materials.length})</Button>
        {batchRunning && <span className="text-xs text-white/60 animate-pulse">Индексируем...</span>}
      </div>
      <div className="overflow-x-auto">
        <table className="w-full text-sm">
          <thead>
            <tr className="text-white/70 border-b border-white/10">
              <th className="py-2 px-2 text-left"><Checkbox checked={selected.size>0 && selected.size===materials.length} onCheckedChange={v=> setSelected(v ? new Set(materials.map(m=>m.id)) : new Set())} /></th>
              <th className="py-2 px-2 text-left">Название</th>
              <th className="py-2 px-2 text-left">Курс</th>
              <th className="py-2 px-2 text-left">Тип</th>
              <th className="py-2 px-2 text-left">Источник</th>
            </tr>
          </thead>
          <tbody>
            {materials.length === 0 && !loading && (
              <tr><td colSpan={5} className="py-6 text-center text-white/50">Все материалы уже индексированы или отсутствуют.</td></tr>
            )}
            {materials.map(m => (
              <tr key={m.id} className="border-b border-white/5 hover:bg-white/5 transition-colors">
                <td className="py-2 px-2">
                  <Checkbox checked={selected.has(m.id)} onCheckedChange={()=>toggle(m.id)} />
                </td>
                <td className="py-2 px-2 text-white font-medium">{m.title}</td>
                <td className="py-2 px-2 text-white/70 text-xs">{m.course_id.slice(0,8)}</td>
                <td className="py-2 px-2"><span className="px-2 py-0.5 rounded bg-white/10 text-white/80 text-xs">{m.kind}</span></td>
                <td className="py-2 px-2 text-white/60 truncate max-w-xs">{m.src}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </GlassCard>
  )
}