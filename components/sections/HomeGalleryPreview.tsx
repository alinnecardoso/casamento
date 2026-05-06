import Link from 'next/link'
import Image from 'next/image'
import AnimatedSection from '@/components/ui/AnimatedSection'
import { GalleryPhoto } from '@/lib/types'

const placeholders = [
  'https://images.unsplash.com/photo-1511285560929-80b456fea0bc?w=600&q=80',
  'https://images.unsplash.com/photo-1519225421980-715cb0215aed?w=600&q=80',
  'https://images.unsplash.com/photo-1465495976277-4387d4b0b4c6?w=600&q=80',
  'https://images.unsplash.com/photo-1583939003579-730e3918a45a?w=600&q=80',
]

export default function HomeGalleryPreview({ photos }: { photos: GalleryPhoto[] }) {
  const display = photos.length > 0 ? photos.slice(0, 4) : placeholders.map((url, i) => ({
    id: String(i), url, caption: null, position: i, created_at: ''
  }))

  return (
    <section className="py-24 bg-[#faf8f4]">
      <div className="max-w-5xl mx-auto px-6">
        <AnimatedSection className="text-center mb-12">
          <p className="text-sm uppercase tracking-[0.3em] text-[#c9a96e] mb-3">Galeria</p>
          <h2 className="font-serif text-3xl md:text-4xl text-[#2c2c2c]">Nossos momentos</h2>
        </AnimatedSection>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-10">
          {display.map((photo, i) => (
            <AnimatedSection key={typeof photo === 'string' ? photo : photo.id} delay={i * 0.1}>
              <div className="aspect-square overflow-hidden rounded-sm group">
                <Image
                  src={typeof photo === 'string' ? photo : photo.url}
                  alt="Foto do casal"
                  width={300}
                  height={300}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                />
              </div>
            </AnimatedSection>
          ))}
        </div>

        <AnimatedSection className="text-center">
          <Link
            href="/galeria"
            className="inline-flex items-center gap-2 text-sm uppercase tracking-widest text-[#c9a96e] hover:gap-4 transition-all duration-300"
          >
            Ver galeria completa
            <span>→</span>
          </Link>
        </AnimatedSection>
      </div>
    </section>
  )
}
