import { defaultConfig, defaultTimeline } from '@/lib/supabase'
import PageTransition from '@/components/layout/PageTransition'
import AnimatedSection from '@/components/ui/AnimatedSection'
import Image from 'next/image'

export default function NossaHistoriaPage() {
  const config = defaultConfig
  const timelineItems = defaultTimeline

  return (
    <PageTransition>
      <div className="relative h-56 md:h-80 flex items-end bg-[#2c2c2c] overflow-hidden">
        <div
          className="absolute inset-0 bg-cover bg-center"
          style={{
            backgroundImage: `url('${config.hero_image_url}')`,
            filter: 'brightness(0.82) contrast(1.08) saturate(1.2)',
          }}
        />
        <div className="absolute inset-0 z-10" style={{ background: 'radial-gradient(ellipse at center, transparent 35%, rgba(20,14,10,0.75) 100%)' }} />
        <div className="absolute inset-0 z-10 bg-gradient-to-b from-black/30 via-transparent to-black/65" />
        <div className="absolute inset-0 z-10 bg-[#c9a96e]/10" />
        <div className="relative z-20 px-4 sm:px-6 pb-8 md:pb-12 max-w-5xl mx-auto w-full">
          <p className="text-xs uppercase tracking-[0.3em] text-[#c9a96e] mb-2">Nossa História</p>
          <h1 className="font-serif text-2xl sm:text-4xl md:text-5xl text-white font-light">{config.couple_name}</h1>
        </div>
      </div>

      <div className="max-w-5xl mx-auto px-4 sm:px-6 py-12 md:py-20">
        <div className="grid md:grid-cols-2 gap-8 md:gap-16 items-start">
          <AnimatedSection>
            <div className="relative">
              <div className="aspect-[3/4] overflow-hidden rounded-sm">
                <Image src={config.story_image_url} alt={config.couple_name} width={600} height={800} className="w-full h-full object-cover" style={{ filter: 'brightness(0.92) contrast(1.05) saturate(0.9) sepia(0.15)' }} />
              </div>
              <div className="absolute -bottom-3 -left-3 sm:-bottom-6 sm:-left-6 w-20 h-20 sm:w-32 sm:h-32 border-2 border-[#c9a96e] -z-10" />
            </div>
          </AnimatedSection>

          <AnimatedSection delay={0.2} className="pt-4">
            <p className="text-sm uppercase tracking-[0.3em] text-[#c9a96e] mb-6">A nossa história</p>
            <div className="text-[#4a4a4a] leading-relaxed space-y-4 text-base md:text-lg">
              {config.our_story_text.split('\n').filter(Boolean).map((p, i) => (
                <p key={i}>{p}</p>
              ))}
            </div>
          </AnimatedSection>
        </div>

        <AnimatedSection delay={0.3} className="mt-16 md:mt-24">
          <div className="text-center mb-10 md:mb-16">
            <p className="text-sm uppercase tracking-[0.3em] text-[#c9a96e] mb-3">Nossa Jornada</p>
            <h2 className="font-serif text-2xl md:text-3xl text-[#2c2c2c]">Momentos que nos trouxeram até aqui</h2>
          </div>
          <div className="relative">
            <div className="absolute left-1/2 -translate-x-px top-0 bottom-0 w-px bg-[#e8d5b0] hidden md:block" />
            {timelineItems.map((item, i) => (
              <div key={item.id} className={`flex items-center gap-6 md:gap-8 mb-10 md:mb-12 flex-col md:flex-row ${i % 2 === 0 ? 'md:flex-row' : 'md:flex-row-reverse'}`}>
                <div className={`flex-1 text-center ${i % 2 === 0 ? 'md:text-right' : 'md:text-left'}`}>
                  <p className="text-[#c9a96e] text-sm uppercase tracking-widest mb-1">{item.year}</p>
                  <h3 className="font-serif text-lg md:text-xl text-[#2c2c2c] mb-2">{item.title}</h3>
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
