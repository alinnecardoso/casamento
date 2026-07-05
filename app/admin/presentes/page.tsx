'use client'

import { Gift } from '@/lib/types'

const gifts: Gift[] = [
  { id: '1', name: 'Jogo de Panelas', description: 'Para nossa nova cozinha', price: 350, store_link: null, image_url: null, available: true, position: 0, created_at: '' },
  { id: '2', name: 'Jogo de Cama', description: 'Queen size, 300 fios', price: 280, store_link: null, image_url: null, available: true, position: 1, created_at: '' },
  { id: '3', name: 'Lua de Mel', description: 'Contribua para nossa viagem dos sonhos', price: null, store_link: null, image_url: null, available: true, position: 2, created_at: '' },
  { id: '4', name: 'Liquidificador', description: '', price: 180, store_link: null, image_url: null, available: true, position: 3, created_at: '' },
]

export default function AdminPresentesPage() {
  return (
    <div>
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-2xl font-serif text-[#2c2c2c]">Presentes</h1>
          <p className="text-sm text-[#4a4a4a] mt-1">
            Lista definida no código em <code className="bg-gray-100 px-1 rounded">app/presentes/page.tsx</code>.
          </p>
        </div>
      </div>

      <div className="bg-white border border-gray-200 rounded-lg overflow-hidden">
        <table className="w-full text-sm">
          <thead className="bg-gray-50 border-b border-gray-200">
            <tr>
              <th className="text-left px-4 py-3 text-xs uppercase tracking-widest text-[#4a4a4a]">Nome</th>
              <th className="text-left px-4 py-3 text-xs uppercase tracking-widest text-[#4a4a4a]">Descrição</th>
              <th className="text-left px-4 py-3 text-xs uppercase tracking-widest text-[#4a4a4a]">Valor</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100">
            {gifts.map((g) => (
              <tr key={g.id} className="hover:bg-gray-50">
                <td className="px-4 py-3 font-medium text-[#2c2c2c]">{g.name}</td>
                <td className="px-4 py-3 text-[#4a4a4a] text-xs">{g.description || '—'}</td>
                <td className="px-4 py-3 text-[#4a4a4a]">{g.price ? `R$ ${g.price.toFixed(2).replace('.', ',')}` : '—'}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )
}
