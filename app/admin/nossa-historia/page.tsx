'use client'

import { useState, useEffect } from 'react'
import { supabase } from '@/lib/supabase'
import { TimelineEvent } from '@/lib/types'
import toast from 'react-hot-toast'

const empty: Omit<TimelineEvent, 'id' | 'created_at'> = { year: '', title: '', description: null, position: 0 }

export default function AdminNossaHistoriaPage() {
  const [events, setEvents] = useState<TimelineEvent[]>([])
  const [editing, setEditing] = useState<Partial<TimelineEvent> | null>(null)
  const [saving, setSaving] = useState(false)

  const load = async () => {
    const { data } = await supabase.from('timeline_events').select('*').order('position')
    setEvents(data || [])
  }

  useEffect(() => { load() }, [])

  const handleSave = async () => {
    if (!editing?.title?.trim() || !editing?.year?.trim()) {
      toast.error('Ano e título são obrigatórios')
      return
    }
    setSaving(true)
    if (editing.id) {
      await supabase.from('timeline_events').update(editing).eq('id', editing.id)
    } else {
      await supabase.from('timeline_events').insert({ ...empty, ...editing })
    }
    setSaving(false)
    setEditing(null)
    toast.success('Salvo!')
    load()
  }

  const handleDelete = async (id: string) => {
    if (!confirm('Remover este item da timeline?')) return
    await supabase.from('timeline_events').delete().eq('id', id)
    toast.success('Removido')
    load()
  }

  return (
    <div>
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-2xl font-serif text-[#2c2c2c]">Nossa História — Timeline</h1>
          <p className="text-sm text-[#4a4a4a] mt-1">Itens aparecem na página /nossa-historia em ordem de posição.</p>
        </div>
        <button onClick={() => setEditing({ ...empty })} className="px-4 py-2 bg-[#c9a96e] text-white text-sm rounded hover:bg-[#a07840] transition-colors">
          + Adicionar item
        </button>
      </div>

      {editing && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-lg p-8 w-full max-w-md">
            <h2 className="font-serif text-xl text-[#2c2c2c] mb-6">{editing.id ? 'Editar' : 'Novo'} item</h2>
            <div className="space-y-4">
              {[
                { key: 'year', label: 'Ano *', type: 'text', placeholder: 'Ex: 2022' },
                { key: 'title', label: 'Título *', type: 'text', placeholder: 'Ex: Nosso primeiro encontro' },
                { key: 'description', label: 'Descrição', type: 'text', placeholder: 'Uma frase sobre esse momento' },
                { key: 'position', label: 'Posição (ordem)', type: 'number', placeholder: '0' },
              ].map((f) => (
                <div key={f.key}>
                  <label className="block text-xs uppercase tracking-widest text-[#4a4a4a] mb-1">{f.label}</label>
                  <input
                    type={f.type} placeholder={f.placeholder}
                    value={(editing as Record<string, unknown>)[f.key] as string ?? ''}
                    onChange={(e) => setEditing({ ...editing, [f.key]: f.type === 'number' ? Number(e.target.value) : e.target.value || null })}
                    className="w-full border border-gray-200 px-3 py-2 text-sm rounded focus:outline-none focus:border-[#c9a96e]"
                  />
                </div>
              ))}
            </div>
            <div className="flex gap-3 mt-6">
              <button onClick={handleSave} disabled={saving} className="flex-1 py-2 bg-[#c9a96e] text-white text-sm rounded hover:bg-[#a07840]">
                {saving ? 'Salvando...' : 'Salvar'}
              </button>
              <button onClick={() => setEditing(null)} className="flex-1 py-2 border border-gray-200 text-sm rounded hover:bg-gray-50">
                Cancelar
              </button>
            </div>
          </div>
        </div>
      )}

      <div className="bg-white border border-gray-200 rounded-lg overflow-hidden">
        {events.length === 0 ? (
          <p className="text-center text-[#4a4a4a] py-12">Nenhum item na timeline ainda. Adicione o primeiro!</p>
        ) : (
          <table className="w-full text-sm">
            <thead className="bg-gray-50 border-b">
              <tr>
                {['Pos.', 'Ano', 'Título', 'Descrição', ''].map((h) => (
                  <th key={h} className="text-left px-4 py-3 text-xs uppercase tracking-widest text-[#4a4a4a]">{h}</th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {events.map((ev) => (
                <tr key={ev.id} className="hover:bg-gray-50">
                  <td className="px-4 py-3 text-gray-400">{ev.position}</td>
                  <td className="px-4 py-3 text-[#c9a96e] font-medium">{ev.year}</td>
                  <td className="px-4 py-3 font-medium text-[#2c2c2c]">{ev.title}</td>
                  <td className="px-4 py-3 text-[#4a4a4a] text-xs">{ev.description || '—'}</td>
                  <td className="px-4 py-3 text-right space-x-3">
                    <button onClick={() => setEditing(ev)} className="text-[#c9a96e] hover:text-[#a07840] text-xs">Editar</button>
                    <button onClick={() => handleDelete(ev.id)} className="text-red-400 hover:text-red-600 text-xs">Remover</button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  )
}
