import Link from 'next/link'
import AnimatedSection from '@/components/ui/AnimatedSection'

export default function HomeCTA() {
  return (
    <section className="py-24 bg-white">
      <div className="max-w-4xl mx-auto px-6 text-center">
        <AnimatedSection>
          <div className="mb-4 flex items-center justify-center gap-4">
            <div className="h-px flex-1 bg-gradient-to-r from-transparent to-[#c9a96e]" />
            <span className="text-[#c9a96e] text-xl">✦</span>
            <div className="h-px flex-1 bg-gradient-to-l from-transparent to-[#c9a96e]" />
          </div>
          <h2 className="font-serif text-3xl md:text-4xl text-[#2c2c2c] mb-4">
            Sua presença é o nosso maior presente
          </h2>
          <p className="text-[#4a4a4a] mb-12 max-w-lg mx-auto leading-relaxed">
            Confirme sua presença e, se quiser nos presentear, preparamos uma lista especial para você.
          </p>
        </AnimatedSection>

        <AnimatedSection delay={0.2}>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link
              href="/confirmar-presenca"
              className="px-10 py-4 bg-[#c9a96e] text-white text-sm tracking-widest uppercase hover:bg-[#a07840] transition-colors duration-300"
            >
              Confirmar Presença
            </Link>
            <Link
              href="/presentes"
              className="px-10 py-4 border-2 border-[#c9a96e] text-[#c9a96e] text-sm tracking-widest uppercase hover:bg-[#c9a96e] hover:text-white transition-all duration-300"
            >
              Lista de Presentes
            </Link>
          </div>
        </AnimatedSection>
      </div>
    </section>
  )
}
