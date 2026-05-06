'use client'

import { useState } from 'react'
import Image from 'next/image'
import { motion } from 'framer-motion'
import Lightbox from '@/components/ui/Lightbox'
import AnimatedSection from '@/components/ui/AnimatedSection'
import PageTransition from '@/components/layout/PageTransition'
import { GalleryPhoto } from '@/lib/types'

export default function GalleryClient({ photos, heroImageUrl }: { photos: GalleryPhoto[]; heroImageUrl?: string }) {
  const [selected, setSelected] = useState<number | null>(null)

  const handlePrev = () => setSelected((s) => (s === null ? null : s === 0 ? photos.length - 1 : s - 1))
  const handleNext = () => setSelected((s) => (s === null ? null : s === photos.length - 1 ? 0 : s + 1))

  return (
    <PageTransition>
      <div className="relative h-48 md:h-64 flex items-end bg-[#2c2c2c] overflow-hidden">
        {heroImageUrl && <div className="absolute inset-0 bg-cover bg-center opacity-20" style={{ backgroundImage: `url('${heroImageUrl}')` }} />}
        <div className="relative z-10 px-6 pb-10 max-w-5xl mx-auto w-full">
          <p className="text-xs uppercase tracking-[0.3em] text-[#c9a96e] mb-2">Memórias</p>
          <h1 className="font-serif text-4xl md:text-5xl text-white font-light">Galeria de Fotos</h1>
        </div>
      </div>

      <div className="max-w-6xl mx-auto px-6 py-16">
        <AnimatedSection className="text-center mb-12">
          <p className="text-[#4a4a4a]">Clique em qualquer foto para ampliar</p>
        </AnimatedSection>

        <div className="columns-2 md:columns-3 lg:columns-4 gap-3 space-y-3">
          {photos.map((photo, i) => (
            <motion.div
              key={photo.id}
              initial={{ opacity: 0, scale: 0.95 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true, margin: '-50px' }}
              transition={{ duration: 0.5, delay: (i % 4) * 0.1 }}
              className="break-inside-avoid cursor-pointer overflow-hidden rounded-sm group"
              onClick={() => setSelected(i)}
            >
              <Image
                src={photo.url}
                alt={photo.caption || `Foto ${i + 1}`}
                width={400}
                height={500}
                className="w-full object-cover group-hover:scale-105 transition-transform duration-500"
              />
              {photo.caption && (
                <p className="text-xs text-[#4a4a4a] px-1 pt-1 pb-2">{photo.caption}</p>
              )}
            </motion.div>
          ))}
        </div>
      </div>

      <Lightbox
        photo={selected !== null ? photos[selected] : null}
        onClose={() => setSelected(null)}
        onPrev={handlePrev}
        onNext={handleNext}
      />
    </PageTransition>
  )
}
