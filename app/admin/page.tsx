import { supabase, supabaseAdmin } from '@/lib/supabase'

export default async function AdminDashboard() {
  const [{ count: rsvpYes }, { count: rsvpNo }, { count: gifts }, pixResult] = await Promise.all([
    supabase.from('rsvp_responses').select('*', { count: 'exact', head: true }).eq('attending', true),
    supabase.from('rsvp_responses').select('*', { count: 'exact', head: true }).eq('attending', false),
    supabase.from('gifts').select('*', { count: 'exact', head: true }).eq('available', true),
    supabaseAdmin.from('payment_confirmations').select('*', { count: 'exact', head: true }).then((r) => r).catch(() => ({ count: 0 })),
  ])

  const cards = [
    { label: 'Confirmados', value: rsvpYes ?? 0, icon: '✅', color: 'bg-green-50 border-green-200' },
    { label: 'Não vão', value: rsvpNo ?? 0, icon: '❌', color: 'bg-red-50 border-red-200' },
    { label: 'Presentes ativos', value: gifts ?? 0, icon: '🎁', color: 'bg-amber-50 border-amber-200' },
    { label: 'PIX confirmados', value: (pixResult as { count?: number | null }).count ?? 0, icon: '💰', color: 'bg-[#c9a96e]/10 border-[#c9a96e]/30' },
  ]

  return (
    <div>
      <h1 className="text-2xl font-serif text-[#2c2c2c] mb-8">Dashboard</h1>
      <div className="grid grid-cols-2 md:grid-cols-4 gap-6 mb-12">
        {cards.map((card) => (
          <div key={card.label} className={`${card.color} border rounded-lg p-6`}>
            <div className="text-3xl mb-2">{card.icon}</div>
            <div className="text-3xl font-serif text-[#2c2c2c] mb-1">{card.value}</div>
            <div className="text-sm text-[#4a4a4a]">{card.label}</div>
          </div>
        ))}
      </div>

      <div className="bg-white rounded-lg border border-gray-200 p-6">
        <h2 className="font-medium text-[#2c2c2c] mb-4">Acesso rápido</h2>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
          {[
            { href: '/admin/configuracoes', label: 'Editar site', icon: '⚙️' },
            { href: '/admin/presentes', label: 'Gerenciar presentes', icon: '🎁' },
            { href: '/admin/galeria', label: 'Galeria de fotos', icon: '🖼️' },
            { href: '/admin/rsvp', label: 'Ver confirmações', icon: '📋' },
          ].map((item) => (
            <a
              key={item.href}
              href={item.href}
              className="flex flex-col items-center gap-2 p-4 bg-gray-50 rounded-lg hover:bg-[#c9a96e]/10 transition-colors text-center"
            >
              <span className="text-2xl">{item.icon}</span>
              <span className="text-xs text-[#4a4a4a]">{item.label}</span>
            </a>
          ))}
        </div>
      </div>
    </div>
  )
}
