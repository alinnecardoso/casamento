'use client'

import { useState, useEffect } from 'react'
import { supabase } from '@/lib/supabase'
import { Gift } from '@/lib/types'

const emptyGift: Omit<Gift, 'id' | 'created_at'> = {
  name: '', description: null, price: null, store_link: null,
  image_url: null, available: true, position: 0,
}

export default function AdminPresentesPage() {
  const [gifts, setGifts] = useState<Gift[]>([])
  const [editing, setEditing] = useState<Partial<Gift> | null>(null)
  const [saving, setSaving] = useState(false)

  const load = async () => {
    const { data } = await supabase.from('gifts').select('*').order('position')
    setGifts(data || [])
  }

  useEffect(() => { load() }, [])

  const handleSave = async () => {
    if (!editing) return
    setSaving(true)
    if (editing.id) {
      await supabase.from('gifts').update(editing).eq('id', editing.id)
    } else {
      await supabase.from('gifts').insert({ ...emptyGift, ...editing })
    }
    setSaving(false)
    setEditing(null)
    load()
  }

  const handleDelete = async (id: string) => {
    if (!confirm('Remover este presente?')) return
    await supabase.from('gifts').delete().eq('id', id)
    load()
  }

  const toggleAvailable = async (gift: Gift) => {
    await supabase.from('gifts').update({ available: !gift.available }).eq('id', gift.id)
    load()
  }

  return (
    <div>
      <div className="flex items-center justify-between mb-8">
        <h1 className="text-2xl font-serif text-[#2c2c2c]">Presentes</h1>
        <button
          onClick={() => setEditing({ ...emptyGift })}
          className="px-4 py-2 bg-[#c9a96e] text-white text-sm rounded hover:bg-[#a07840] transition-colors"
        >
          + Adicionar presente
        </button>
      </div>

      {editing && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-lg p-8 w-full max-w-lg">
            <h2 className="font-serif text-xl text-[#2c2c2c] mb-6">{editing.id ? 'Editar' : 'Novo'} presente</h2>
            <div className="space-y-4">
              {[
                { key: 'name', label: 'Nome *', type: 'text' },
                { key: 'description', label: 'Descrição', type: 'text' },
                { key: 'price', label: 'Valor sugerido (R$)', type: 'number' },
                { key: 'store_link', label: 'Link da loja', type: 'url' },
                { key: 'image_url', label: 'URL da imagem', type: 'url' },
                { key: 'position', label: 'Posição (ordem)', type: 'number' },
              ].map((f) => (
                <div key={f.key}>
                  <label className="block text-xs uppercase tracking-widest text-[#4a4a4a] mb-1">{f.label}</label>
                  <input
                    type={f.type}
                    value={(editing as Record<string, unknown>)[f.key] as string ?? ''}
                    onChange={(e) => setEditing({ ...editing, [f.key]: f.type === 'number' ? Number(e.target.value) || null : e.target.value || null })}
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
        {gifts.length === 0 ? (
          <p className="text-center text-[#4a4a4a] py-12">Nenhum presente cadastrado ainda.</p>
        ) : (
          <table className="w-full text-sm">
            <thead className="bg-gray-50 border-b border-gray-200">
              <tr>
                <th className="text-left px-4 py-3 text-xs uppercase tracking-widest text-[#4a4a4a]">Nome</th>
                <th className="text-left px-4 py-3 text-xs uppercase tracking-widest text-[#4a4a4a]">Valor</th>
                <th className="text-center px-4 py-3 text-xs uppercase tracking-widest text-[#4a4a4a]">Status</th>
                <th className="px-4 py-3" />
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {gifts.map((g) => (
                <tr key={g.id} className="hover:bg-gray-50">
                  <td className="px-4 py-3 font-medium text-[#2c2c2c]">{g.name}</td>
                  <td className="px-4 py-3 text-[#4a4a4a]">{g.price ? `R$ ${g.price.toFixed(2).replace('.', ',')}` : '—'}</td>
                  <td className="px-4 py-3 text-center">
                    <button onClick={() => toggleAvailable(g)} className={`text-xs px-2 py-1 rounded-full ${g.available ? 'bg-green-100 text-green-700' : 'bg-gray-100 text-gray-500'}`}>
                      {g.available ? 'Ativo' : 'Inativo'}
                    </button>
                  </td>
                  <td className="px-4 py-3 text-right space-x-2">
                    <button onClick={() => setEditing(g)} className="text-[#c9a96e] hover:text-[#a07840] text-xs">Editar</button>
                    <button onClick={() => handleDelete(g.id)} className="text-red-400 hover:text-red-600 text-xs">Remover</button>
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
