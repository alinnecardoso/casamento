import { defaultTimeline } from '@/lib/supabase'

async function getRsvpCounts() {
  try {
    const base = process.env.VERCEL_URL
      ? `https://${process.env.VERCEL_URL}`
      : 'http://localhost:3000'
    const res = await fetch(`${base}/api/admin/rsvp`, { cache: 'no-store' })
    if (!res.ok) return { yes: 0, no: 0 }
    const data = await res.json()
    return {
      yes: data.filter((r: { attending: boolean }) => r.attending).length,
      no: data.filter((r: { attending: boolean }) => !r.attending).length,
    }
  } catch {
    return { yes: 0, no: 0 }
  }
}

export default async function AdminDashboard() {
  const counts = await getRsvpCounts()

  const cards = [
    { label: 'Confirmados', value: counts.yes, icon: '✅', color: 'bg-green-50 border-green-200' },
    { label: 'Não vão', value: counts.no, icon: '❌', color: 'bg-red-50 border-red-200' },
    { label: 'Eventos na timeline', value: defaultTimeline.length, icon: '📖', color: 'bg-amber-50 border-amber-200' },
  ]

  return (
    <div>
      <h1 className="text-2xl font-serif text-[#2c2c2c] mb-8">Dashboard</h1>
      <div className="grid grid-cols-2 md:grid-cols-3 gap-6 mb-12">
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
        <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
          {[
            { href: '/admin/rsvp', label: 'Ver confirmações', icon: '📋' },
            { href: '/admin/nossa-historia', label: 'Nossa História', icon: '📖' },
            { href: '/admin/presentes', label: 'Presentes', icon: '🎁' },
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
