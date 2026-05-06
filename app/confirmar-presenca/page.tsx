import { getSiteConfig, defaultConfig } from '@/lib/supabase'
import PageTransition from '@/components/layout/PageTransition'
import RSVPForm from './RSVPForm'

export const revalidate = 60

export default async function ConfirmarPresencaPage() {
  const config = await getSiteConfig().catch(() => defaultConfig)

  return (
    <PageTransition>
      <div className="relative h-48 md:h-64 flex items-end bg-[#2c2c2c] overflow-hidden">
        <div className="absolute inset-0 bg-cover bg-center opacity-20" style={{ backgroundImage: `url('${config.hero_image_url}')` }} />
        <div className="relative z-10 px-6 pb-10 max-w-5xl mx-auto w-full">
          <p className="text-xs uppercase tracking-[0.3em] text-[#c9a96e] mb-2">Sua presença importa</p>
          <h1 className="font-serif text-4xl md:text-5xl text-white font-light">Confirmação de Presença</h1>
        </div>
      </div>

      <div className="max-w-2xl mx-auto px-6 py-20">
        <div className="text-center mb-12">
          <p className="text-[#4a4a4a] leading-relaxed">
            Por favor, confirme sua presença até{' '}
            <strong className="text-[#2c2c2c]">{config.rsvp_deadline || '31 de outubro de 2026'}</strong>.
            <br />Sua resposta nos ajuda a planejar um dia perfeito.
          </p>
        </div>
        <RSVPForm />
      </div>
    </PageTransition>
  )
}
