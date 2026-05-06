'use client'

import { useState, useEffect } from 'react'
import { supabase } from '@/lib/supabase'
import { RsvpResponse } from '@/lib/types'

export default function AdminRsvpPage() {
  const [responses, setResponses] = useState<RsvpResponse[]>([])
  const [filter, setFilter] = useState<'all' | 'yes' | 'no'>('all')

  useEffect(() => {
    supabase.from('rsvp_responses').select('*').order('created_at', { ascending: false })
      .then(({ data }) => setResponses(data || []))
  }, [])

  const filtered = responses.filter((r) => {
    if (filter === 'yes') return r.attending
    if (filter === 'no') return !r.attending
    return true
  })

  const totalGuests = responses.filter((r) => r.attending).reduce((sum, r) => sum + r.guests_count, 0)

  const exportCsv = () => {
    const header = 'Nome,Email,Telefone,Vai,Acompanhantes,Restrições,Mensagem,Data\n'
    const rows = responses.map((r) =>
      `"${r.guest_name}","${r.email || ''}","${r.phone || ''}","${r.attending ? 'Sim' : 'Não'}",${r.guests_count},"${r.dietary_restrictions || ''}","${r.message || ''}","${new Date(r.created_at).toLocaleDateString('pt-BR')}"`
    ).join('\n')
    const blob = new Blob([header + rows], { type: 'text/csv' })
    const a = document.createElement('a')
    a.href = URL.createObjectURL(blob)
    a.download = 'confirmacoes.csv'
    a.click()
  }

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-serif text-[#2c2c2c]">Confirmações de Presença</h1>
          <p className="text-sm text-[#4a4a4a] mt-1">Total de convidados confirmados: <strong>{totalGuests}</strong></p>
        </div>
        <button onClick={exportCsv} className="px-4 py-2 bg-[#2c2c2c] text-white text-sm rounded hover:bg-[#4a4a4a] transition-colors">
          Exportar CSV
        </button>
      </div>

      <div className="flex gap-2 mb-6">
        {[{ val: 'all', label: `Todos (${responses.length})` }, { val: 'yes', label: `✅ Vão (${responses.filter(r => r.attending).length})` }, { val: 'no', label: `❌ Não vão (${responses.filter(r => !r.attending).length})` }].map((f) => (
          <button
            key={f.val}
            onClick={() => setFilter(f.val as typeof filter)}
            className={`px-4 py-2 text-sm rounded transition-colors ${filter === f.val ? 'bg-[#c9a96e] text-white' : 'bg-white border border-gray-200 text-[#4a4a4a] hover:border-[#c9a96e]'}`}
          >
            {f.label}
          </button>
        ))}
      </div>

      <div className="bg-white border border-gray-200 rounded-lg overflow-hidden">
        {filtered.length === 0 ? (
          <p className="text-center text-[#4a4a4a] py-12">Nenhuma confirmação ainda.</p>
        ) : (
          <table className="w-full text-sm">
            <thead className="bg-gray-50 border-b">
              <tr>
                {['Nome', 'Contato', 'Vai?', 'Acompanhantes', 'Restrições', 'Data'].map((h) => (
                  <th key={h} className="text-left px-4 py-3 text-xs uppercase tracking-widest text-[#4a4a4a]">{h}</th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {filtered.map((r) => (
                <tr key={r.id} className="hover:bg-gray-50">
                  <td className="px-4 py-3 font-medium text-[#2c2c2c]">
                    {r.guest_name}
                    {r.message && <p className="text-xs text-[#4a4a4a] font-normal italic mt-1">"{r.message}"</p>}
                  </td>
                  <td className="px-4 py-3 text-[#4a4a4a]">
                    <p>{r.email}</p>
                    <p>{r.phone}</p>
                  </td>
                  <td className="px-4 py-3">
                    <span className={`text-xs px-2 py-1 rounded-full ${r.attending ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-600'}`}>
                      {r.attending ? 'Sim' : 'Não'}
                    </span>
                  </td>
                  <td className="px-4 py-3 text-center text-[#4a4a4a]">{r.guests_count}</td>
                  <td className="px-4 py-3 text-[#4a4a4a] text-xs">{r.dietary_restrictions || '—'}</td>
                  <td className="px-4 py-3 text-[#4a4a4a] text-xs">{new Date(r.created_at).toLocaleDateString('pt-BR')}</td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  )
}
