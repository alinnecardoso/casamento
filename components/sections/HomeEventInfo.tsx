import Link from 'next/link'
import AnimatedSection from '@/components/ui/AnimatedSection'

interface Props {
  weddingDate: string
  ceremonyAddress: string
  ceremonyTime?: string
  receptionAddress: string
  receptionTime?: string
}

function formatDate(dateStr: string) {
  const date = new Date(dateStr + 'T12:00:00')
  return {
    day: date.getDate(),
    month: date.toLocaleDateString('pt-BR', { month: 'long' }),
    year: date.getFullYear(),
    weekday: date.toLocaleDateString('pt-BR', { weekday: 'long' }),
  }
}

export default function HomeEventInfo({ weddingDate, ceremonyAddress, ceremonyTime, receptionAddress, receptionTime }: Props) {
  const d = formatDate(weddingDate)

  return (
    <section className="py-24 bg-[#2c2c2c] text-white">
      <div className="max-w-5xl mx-auto px-6 text-center">
        <AnimatedSection>
          <p className="text-sm uppercase tracking-[0.3em] text-[#c9a96e] mb-4">O Grande Dia</p>
          <div className="font-serif mb-12">
            <span className="text-7xl md:text-9xl font-light text-white/10 block leading-none">{d.day}</span>
            <span className="text-2xl md:text-3xl capitalize -mt-6 block">{d.month} de {d.year}</span>
            <span className="text-sm text-[#c9a96e] capitalize tracking-widest">{d.weekday}</span>
          </div>
        </AnimatedSection>

        <AnimatedSection delay={0.2}>
          <div className="grid md:grid-cols-2 gap-8 max-w-2xl mx-auto mb-12">
            <div className="border border-white/10 rounded-sm p-6">
              <p className="text-xs uppercase tracking-widest text-[#c9a96e] mb-2">Cerimônia</p>
              {ceremonyTime && <p className="text-white font-serif text-lg mb-2">{ceremonyTime}</p>}
              <p className="text-white/70 text-sm leading-relaxed">{ceremonyAddress}</p>
            </div>
            <div className="border border-white/10 rounded-sm p-6">
              <p className="text-xs uppercase tracking-widest text-[#c9a96e] mb-2">Recepção</p>
              {receptionTime && <p className="text-white font-serif text-lg mb-2">{receptionTime}</p>}
              <p className="text-white/70 text-sm leading-relaxed">{receptionAddress}</p>
            </div>
          </div>
          <Link href="/local" className="inline-flex items-center gap-2 text-sm uppercase tracking-widest text-[#c9a96e] hover:gap-4 transition-all duration-300">
            Ver localização completa <span>→</span>
          </Link>
        </AnimatedSection>
      </div>
    </section>
  )
}
