"use client"
import { useEffect, useState } from 'react'
import { GlassCard } from '@/components/ui/glass-card'
import { Button } from '@/components/ui/button'
import { Checkbox } from '@/components/ui/checkbox'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { toast } from 'sonner'

interface MaterialSummary { id: string; course_id: string; title: string; kind: string; src: string }

export default function MaterialsClient() {
  const [loading, setLoading] = useState(false)
  const [materials, setMaterials] = useState<MaterialSummary[]>([])
  const [selected, setSelected] = useState<Set<string>>(new Set())
  const [batchRunning, setBatchRunning] = useState(false)
  const [showForm, setShowForm] = useState(false)
  const [formLoading, setFormLoading] = useState(false)
  const [editingId, setEditingId] = useState<string | null>(null)
  const [form, setForm] = useState<any>({ course_id: '', kind: 'markdown', title: '', src: '', description: '', is_public: false, position: 0 })

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
        <Button size="sm" variant={showForm ? 'destructive':'default'} onClick={()=>{ setShowForm(v=>!v); if(!showForm){ setEditingId(null); setForm({ course_id: '', kind: 'markdown', title: '', src: '', description: '', is_public: false, position: 0 }) } }}>{showForm ? 'Закрыть форму':'Новый материал'}</Button>
        {batchRunning && <span className="text-xs text-white/60 animate-pulse">Индексируем...</span>}
      </div>
      {showForm && (
        <div className="mb-6 border border-white/10 rounded p-4 space-y-3 bg-white/5">
          <h3 className="text-white font-semibold text-sm">{editingId ? 'Редактирование':'Создание'} материала</h3>
          <div className="grid md:grid-cols-3 gap-3">
            <div className="space-y-1">
              <label className="text-xs text-white/60">Course ID</label>
              <Input value={form.course_id} onChange={e=> setForm({...form, course_id: e.target.value})} placeholder="uuid курса" className="bg-white/10 border-white/20 text-white" />
            </div>
            <div className="space-y-1">
              <label className="text-xs text-white/60">Lesson ID (опц.)</label>
              <Input value={form.lesson_id||''} onChange={e=> setForm({...form, lesson_id: e.target.value||null})} placeholder="uuid" className="bg-white/10 border-white/20 text-white" />
            </div>
            <div className="space-y-1">
              <label className="text-xs text-white/60">Тип</label>
              <select value={form.kind} onChange={e=> setForm({...form, kind: e.target.value})} className="bg-white/10 border border-white/20 rounded px-2 py-1 text-white text-sm">
                {['video','audio','pdf','image','markdown','link','download'].map(k=> <option key={k} value={k}>{k}</option>)}
              </select>
            </div>
            <div className="space-y-1 md:col-span-2">
              <label className="text-xs text-white/60">Заголовок</label>
              <Input value={form.title} onChange={e=> setForm({...form, title: e.target.value})} placeholder="Название" className="bg-white/10 border-white/20 text-white" />
            </div>
            <div className="space-y-1">
              <label className="text-xs text-white/60">Позиция</label>
              <Input type="number" value={form.position} onChange={e=> setForm({...form, position: parseInt(e.target.value||'0',10)})} className="bg-white/10 border-white/20 text-white" />
            </div>
            <div className="space-y-1 md:col-span-3">
              <label className="text-xs text-white/60">Источник (src / путь файла / URL)</label>
              <Input value={form.src} onChange={e=> setForm({...form, src: e.target.value})} placeholder="напр. course1/intro.pdf" className="bg-white/10 border-white/20 text-white" />
            </div>
            <div className="space-y-1 md:col-span-3">
              <label className="text-xs text-white/60">Описание</label>
              <Textarea value={form.description||''} onChange={e=> setForm({...form, description: e.target.value})} rows={3} className="bg-white/10 border-white/20 text-white text-sm" />
            </div>
            <div className="flex items-center gap-2 md:col-span-3">
              <Checkbox checked={form.is_public} onCheckedChange={v=> setForm({...form, is_public: !!v})} />
              <span className="text-xs text-white/70">Публичный</span>
            </div>
          </div>
          <div className="flex gap-2">
            <Button size="sm" disabled={formLoading} onClick={async ()=>{
              setFormLoading(true)
              try {
                const method = editingId ? 'PATCH':'POST'
                const payload = editingId ? { ...form, id: editingId } : form
                const res = await fetch('/api/materials', { method, headers:{'Content-Type':'application/json'}, body: JSON.stringify(payload) })
                const json = await res.json()
                if(!res.ok) throw new Error(json.error||'Ошибка сохранения')
                toast.success(editingId? 'Обновлено':'Создано')
                setEditingId(null)
                setForm({ course_id: '', kind: 'markdown', title: '', src: '', description: '', is_public: false, position: 0 })
                setShowForm(false)
                // refresh unindexed list (maybe new item not indexed yet)
                await loadUnindexed()
              } catch(e:any){ toast.error(e.message) } finally { setFormLoading(false) }
            }}>{editingId ? 'Сохранить':'Создать'}</Button>
            {editingId && <Button size="sm" variant="outline" onClick={()=>{ setEditingId(null); setForm({ course_id: '', kind: 'markdown', title: '', src: '', description: '', is_public: false, position: 0 }); }}>Отмена</Button>}
          </div>
        </div>
      )}
      <div className="overflow-x-auto">
        <table className="w-full text-sm">
          <thead>
            <tr className="text-white/70 border-b border-white/10">
              <th className="py-2 px-2 text-left"><Checkbox checked={selected.size>0 && selected.size===materials.length} onCheckedChange={v=> setSelected(v ? new Set(materials.map(m=>m.id)) : new Set())} /></th>
              <th className="py-2 px-2 text-left">Название</th>
              <th className="py-2 px-2 text-left">Курс</th>
              <th className="py-2 px-2 text-left">Тип</th>
              <th className="py-2 px-2 text-left">Источник</th>
              <th className="py-2 px-2 text-left">Действия</th>
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
                <td className="py-2 px-2 text-white/60 text-xs flex gap-2">
                  <button className="underline hover:text-white" onClick={()=>{ setEditingId(m.id); setShowForm(true); setForm({ ...form, ...m }); }}>Ред.</button>
                  <button className="text-red-400 hover:text-red-300" onClick={async()=>{ if(!confirm('Удалить материал?')) return; try{ const r= await fetch('/api/materials?id='+m.id,{method:'DELETE'}); const j= await r.json(); if(!r.ok) throw new Error(j.error||'Ошибка удаления'); toast.success('Удалено'); await loadUnindexed(); }catch(e:any){ toast.error(e.message) } }}>Удал.</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </GlassCard>
  )
}