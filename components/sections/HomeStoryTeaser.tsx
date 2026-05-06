import Link from 'next/link'
import Image from 'next/image'
import AnimatedSection from '@/components/ui/AnimatedSection'

interface Props {
  text: string
  coupleName: string
  storyImageUrl?: string
}

export default function HomeStoryTeaser({ text, coupleName, storyImageUrl }: Props) {
  const imgUrl = storyImageUrl || 'https://images.unsplash.com/photo-1606216794074-735e91aa2c92?w=800&q=80'

  return (
    <section className="py-24 bg-white">
      <div className="max-w-5xl mx-auto px-6 grid md:grid-cols-2 gap-16 items-center">
        <AnimatedSection>
          <div className="relative">
            <div className="aspect-[3/4] overflow-hidden rounded-sm">
              <Image src={imgUrl} alt={coupleName} width={600} height={800} className="w-full h-full object-cover" />
            </div>
            <div className="absolute -bottom-6 -right-6 w-40 h-40 border-2 border-[#c9a96e] rounded-sm -z-10" />
          </div>
        </AnimatedSection>

        <AnimatedSection delay={0.2}>
          <p className="text-sm uppercase tracking-[0.3em] text-[#c9a96e] mb-4">Nossa História</p>
          <h2 className="font-serif text-3xl md:text-4xl text-[#2c2c2c] mb-6 leading-tight">Uma história de amor</h2>
          <div className="h-px w-12 bg-[#c9a96e] mb-6" />
          <p className="text-[#4a4a4a] leading-relaxed mb-8 line-clamp-4">{text}</p>
          <Link href="/nossa-historia" className="inline-flex items-center gap-2 text-sm uppercase tracking-widest text-[#c9a96e] hover:gap-4 transition-all duration-300">
            Conheça nossa história <span>→</span>
          </Link>
        </AnimatedSection>
      </div>
    </section>
  )
}
