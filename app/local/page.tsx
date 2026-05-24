import { getSiteConfig, defaultConfig } from '@/lib/supabase'
import PageTransition from '@/components/layout/PageTransition'
import AnimatedSection from '@/components/ui/AnimatedSection'

export const revalidate = 60

export default async function LocalPage() {
  const config = await getSiteConfig().catch(() => defaultConfig)

  const mapsUrl = (address: string) =>
    `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(address)}`

  const formattedDate = new Date(config.wedding_date + 'T12:00:00')
    .toLocaleDateString('pt-BR', { weekday: 'long', day: 'numeric', month: 'long', year: 'numeric' })

  return (
    <PageTransition>
      <div className="relative h-48 md:h-64 flex items-end bg-[#2c2c2c] overflow-hidden">
        <div className="absolute inset-0 bg-cover bg-center opacity-20" style={{ backgroundImage: `url('${config.hero_image_url}')` }} />
        <div className="relative z-10 px-6 pb-10 max-w-5xl mx-auto w-full">
          <p className="text-xs uppercase tracking-[0.3em] text-[#c9a96e] mb-2">Onde estaremos</p>
          <h1 className="font-serif text-2xl sm:text-4xl md:text-5xl text-white font-light">Local & Data</h1>
        </div>
      </div>

      <div className="max-w-4xl mx-auto px-6 py-20">
        <AnimatedSection className="text-center mb-16">
          <p className="text-sm uppercase tracking-[0.3em] text-[#c9a96e] mb-3">O Grande Dia</p>
          <h2 className="font-serif text-2xl md:text-3xl text-[#2c2c2c] capitalize">{formattedDate}</h2>
        </AnimatedSection>

        <div className="grid md:grid-cols-2 gap-8">
          <AnimatedSection>
            <div className="bg-white rounded-sm border border-[#e8d5b0] p-5 sm:p-8 h-full">
              <div className="w-12 h-12 rounded-full bg-[#c9a96e]/10 flex items-center justify-center mb-6">
                <span className="text-[#c9a96e] text-xl">⛪</span>
              </div>
              <p className="text-xs uppercase tracking-widest text-[#c9a96e] mb-2">Cerimônia</p>
              {config.ceremony_time && (
                <p className="font-serif text-2xl text-[#2c2c2c] mb-3">{config.ceremony_time}</p>
              )}
              <p className="text-[#4a4a4a] text-sm leading-relaxed mb-6">{config.ceremony_address}</p>
              <a href={mapsUrl(config.ceremony_address)} target="_blank" rel="noopener noreferrer"
                className="inline-flex items-center gap-2 text-sm text-[#c9a96e] uppercase tracking-widest hover:gap-4 transition-all duration-300">
                Ver no Maps →
              </a>
            </div>
          </AnimatedSection>

          <AnimatedSection delay={0.2}>
            <div className="bg-white rounded-sm border border-[#e8d5b0] p-5 sm:p-8 h-full">
              <div className="w-12 h-12 rounded-full bg-[#c9a96e]/10 flex items-center justify-center mb-6">
                <span className="text-[#c9a96e] text-xl">🥂</span>
              </div>
              <p className="text-xs uppercase tracking-widest text-[#c9a96e] mb-2">Recepção</p>
              {config.reception_time && (
                <p className="font-serif text-2xl text-[#2c2c2c] mb-3">{config.reception_time}</p>
              )}
              <p className="text-[#4a4a4a] text-sm leading-relaxed mb-6">{config.reception_address}</p>
              <a href={mapsUrl(config.reception_address)} target="_blank" rel="noopener noreferrer"
                className="inline-flex items-center gap-2 text-sm text-[#c9a96e] uppercase tracking-widest hover:gap-4 transition-all duration-300">
                Ver no Maps →
              </a>
            </div>
          </AnimatedSection>
        </div>

        {(config.dress_code || config.wedding_tips) && (
          <AnimatedSection delay={0.3} className="mt-16 bg-[#2c2c2c] text-white rounded-sm p-8">
            <p className="font-serif text-xl text-center mb-6">Informações importantes</p>
            <div className="grid md:grid-cols-2 gap-6 text-sm text-white/70">
              {config.dress_code && (
                <div>
                  <p className="text-[#c9a96e] mb-1 uppercase tracking-wider text-xs">Código de vestimenta</p>
                  <p>{config.dress_code}</p>
                </div>
              )}
              {config.wedding_tips && (
                <div>
                  <p className="text-[#c9a96e] mb-1 uppercase tracking-wider text-xs">Dicas</p>
                  <p>{config.wedding_tips}</p>
                </div>
              )}
            </div>
          </AnimatedSection>
        )}
      </div>
    </PageTransition>
  )
}
