'use client'

import { defaultTimeline } from '@/lib/supabase'

export default function AdminNossaHistoriaPage() {
  return (
    <div>
      <div className="mb-8">
        <h1 className="text-2xl font-serif text-[#2c2c2c]">Nossa História — Timeline</h1>
        <p className="text-sm text-[#4a4a4a] mt-1">
          Itens definidos diretamente no código em <code className="bg-gray-100 px-1 rounded">lib/supabase.ts</code>.
        </p>
      </div>

      <div className="bg-white border border-gray-200 rounded-lg overflow-hidden">
        <table className="w-full text-sm">
          <thead className="bg-gray-50 border-b">
            <tr>
              {['Pos.', 'Ano', 'Título', 'Descrição'].map((h) => (
                <th key={h} className="text-left px-4 py-3 text-xs uppercase tracking-widest text-[#4a4a4a]">{h}</th>
              ))}
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100">
            {defaultTimeline.map((ev) => (
              <tr key={ev.id} className="hover:bg-gray-50">
                <td className="px-4 py-3 text-gray-400">{ev.position}</td>
                <td className="px-4 py-3 text-[#c9a96e] font-medium">{ev.year}</td>
                <td className="px-4 py-3 font-medium text-[#2c2c2c]">{ev.title}</td>
                <td className="px-4 py-3 text-[#4a4a4a] text-xs">{ev.description || '—'}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )
}
