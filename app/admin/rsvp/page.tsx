'use client'

import { useState, useEffect } from 'react'

interface RsvpRow {
  id: string
  created_at: string
  guest_name: string
  email: string
  phone: string
  attending: boolean
  guests_count: number
  companion_names: string | null
  message: string | null
}

function parseCompanions(raw: string | null): string[] {
  if (!raw) return []
  try { return JSON.parse(raw) } catch { return [] }
}

export default function AdminRsvpPage() {
  const [responses, setResponses] = useState<RsvpRow[]>([])
  const [filter, setFilter] = useState<'all' | 'yes' | 'no'>('all')
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetch('/api/admin/rsvp')
      .then((r) => r.json())
      .then((data) => { setResponses(data); setLoading(false) })
      .catch(() => setLoading(false))
  }, [])

  const filtered = responses.filter((r) => {
    if (filter === 'yes') return r.attending
    if (filter === 'no') return !r.attending
    return true
  })

  const totalGuests = responses.filter((r) => r.attending).reduce((sum, r) => sum + r.guests_count, 0)

  const exportCsv = () => {
    const header = 'Nome,Email,Telefone,Vai,Total,Acompanhantes,Mensagem,Data\n'
    const rows = responses.map((r) => {
      const companions = parseCompanions(r.companion_names)
      return `"${r.guest_name}","${r.email || ''}","${r.phone || ''}","${r.attending ? 'Sim' : 'Não'}",${r.guests_count},"${companions.join('; ')}","${r.message || ''}","${r.created_at}"`
    }).join('\n')
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
          <p className="text-sm text-[#4a4a4a] mt-1">Total de pessoas confirmadas: <strong>{totalGuests}</strong></p>
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
        {loading ? (
          <p className="text-center text-[#4a4a4a] py-12">Carregando...</p>
        ) : filtered.length === 0 ? (
          <p className="text-center text-[#4a4a4a] py-12">Nenhuma confirmação ainda.</p>
        ) : (
          <table className="w-full text-sm">
            <thead className="bg-gray-50 border-b">
              <tr>
                {['Nome', 'Contato', 'Vai?', 'Acompanhantes', 'Data'].map((h) => (
                  <th key={h} className="text-left px-4 py-3 text-xs uppercase tracking-widest text-[#4a4a4a]">{h}</th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {filtered.map((r) => {
                const companions = parseCompanions(r.companion_names)
                return (
                  <tr key={r.id} className="hover:bg-gray-50">
                    <td className="px-4 py-3 font-medium text-[#2c2c2c]">
                      {r.guest_name}
                      {r.message && <p className="text-xs text-[#4a4a4a] font-normal italic mt-1">&ldquo;{r.message}&rdquo;</p>}
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
                    <td className="px-4 py-3 text-[#4a4a4a]">
                      {companions.length > 0 ? (
                        <ul className="text-xs space-y-0.5">
                          {companions.map((name, i) => (
                            <li key={i} className="flex items-center gap-1">
                              <span className="text-[#c9a96e]">·</span> {name}
                            </li>
                          ))}
                        </ul>
                      ) : (
                        <span className="text-xs text-gray-400">Somente {r.guest_name.split(' ')[0]}</span>
                      )}
                    </td>
                    <td className="px-4 py-3 text-[#4a4a4a] text-xs">{r.created_at}</td>
                  </tr>
                )
              })}
            </tbody>
          </table>
        )}
      </div>
    </div>
  )
}
