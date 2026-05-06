import { getSiteConfig, getTimelineEvents, defaultConfig } from '@/lib/supabase'
import PageTransition from '@/components/layout/PageTransition'
import AnimatedSection from '@/components/ui/AnimatedSection'
import Image from 'next/image'

export const revalidate = 60

const defaultTimeline = [
  { id: '1', year: '2019', title: 'Nosso primeiro encontro', description: 'Quando tudo começou...', position: 0, created_at: '' },
  { id: '2', year: '2021', title: 'Nos tornamos inseparáveis', description: 'A vida ficou mais bonita...', position: 1, created_at: '' },
  { id: '3', year: '2024', title: 'O pedido de casamento', description: 'Um sim que mudou tudo...', position: 2, created_at: '' },
  { id: '4', year: '2026', title: 'O grande dia', description: 'Nossa história continua...', position: 3, created_at: '' },
]

export default async function NossaHistoriaPage() {
  const [config, timeline] = await Promise.all([
    getSiteConfig().catch(() => defaultConfig),
    getTimelineEvents().catch(() => defaultTimeline),
  ])

  const timelineItems = timeline.length > 0 ? timeline : defaultTimeline

  return (
    <PageTransition>
      <div className="relative h-64 md:h-80 flex items-end bg-[#2c2c2c] overflow-hidden">
        <div className="absolute inset-0 bg-cover bg-center opacity-30" style={{ backgroundImage: `url('${config.story_image_url}')` }} />
        <div className="relative z-10 px-6 pb-12 max-w-5xl mx-auto w-full">
          <p className="text-xs uppercase tracking-[0.3em] text-[#c9a96e] mb-2">Nossa História</p>
          <h1 className="font-serif text-4xl md:text-5xl text-white font-light">{config.couple_name}</h1>
        </div>
      </div>

      <div className="max-w-5xl mx-auto px-6 py-20">
        <div className="grid md:grid-cols-2 gap-16 items-start">
          <AnimatedSection>
            <div className="relative">
              <div className="aspect-[3/4] overflow-hidden rounded-sm">
                <Image src={config.story_image_url} alt={config.couple_name} width={600} height={800} className="w-full h-full object-cover" />
              </div>
              <div className="absolute -bottom-6 -left-6 w-32 h-32 border-2 border-[#c9a96e] -z-10" />
            </div>
          </AnimatedSection>

          <AnimatedSection delay={0.2} className="pt-4">
            <p className="text-sm uppercase tracking-[0.3em] text-[#c9a96e] mb-6">A nossa história</p>
            <div className="text-[#4a4a4a] leading-relaxed space-y-4 text-lg">
              {config.our_story_text.split('\n').filter(Boolean).map((p, i) => (
                <p key={i}>{p}</p>
              ))}
            </div>
          </AnimatedSection>
        </div>

        <AnimatedSection delay={0.3} className="mt-24">
          <div className="text-center mb-16">
            <p className="text-sm uppercase tracking-[0.3em] text-[#c9a96e] mb-3">Nossa Jornada</p>
            <h2 className="font-serif text-3xl text-[#2c2c2c]">Momentos que nos trouxeram até aqui</h2>
          </div>
          <div className="relative">
            <div className="absolute left-1/2 -translate-x-px top-0 bottom-0 w-px bg-[#e8d5b0] hidden md:block" />
            {timelineItems.map((item, i) => (
              <div key={item.id} className={`flex items-center gap-8 mb-12 flex-col md:flex-row ${i % 2 === 0 ? 'md:flex-row' : 'md:flex-row-reverse'}`}>
                <div className={`flex-1 text-center md:text-${i % 2 === 0 ? 'right' : 'left'}`}>
                  <p className="text-[#c9a96e] text-sm uppercase tracking-widest mb-1">{item.year}</p>
                  <h3 className="font-serif text-xl text-[#2c2c2c] mb-2">{item.title}</h3>
                  {item.description && <p className="text-[#4a4a4a] text-sm">{item.description}</p>}
                </div>
                <div className="w-4 h-4 rounded-full bg-[#c9a96e] border-4 border-white shadow flex-shrink-0 relative z-10" />
                <div className="flex-1 hidden md:block" />
              </div>
            ))}
          </div>
        </AnimatedSection>
      </div>
    </PageTransition>
  )
}
