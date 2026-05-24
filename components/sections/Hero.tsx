'use client'

import { motion, useScroll, useTransform } from 'framer-motion'
import Link from 'next/link'
import { useRef } from 'react'

interface Props {
  coupleName: string
  weddingDate: string
  subtitle?: string
  heroImageUrl?: string
}

function formatDate(dateStr: string) {
  return new Date(dateStr + 'T12:00:00').toLocaleDateString('pt-BR', {
    day: 'numeric', month: 'long', year: 'numeric',
  })
}

export default function Hero({ coupleName, weddingDate, subtitle, heroImageUrl }: Props) {
  const ref = useRef<HTMLDivElement>(null)
  const { scrollYProgress } = useScroll({ target: ref, offset: ['start start', 'end start'] })
  const y = useTransform(scrollYProgress, [0, 1], ['0%', '30%'])

  const bgImage = heroImageUrl || 'https://images.unsplash.com/photo-1519741497674-611481863552?w=1920&q=80'

  return (
    <section ref={ref} className="relative h-screen min-h-[600px] flex items-center justify-center overflow-hidden">
      <motion.div style={{ y }} className="absolute inset-0 z-0">
        {/* Foto com filtro quente e cinematográfico */}
        <div
          className="w-full h-full bg-cover bg-center"
          style={{
            backgroundImage: `url('${bgImage}')`,
            filter: 'brightness(0.82) contrast(1.08) saturate(1.2)',
          }}
        />
        {/* Vinheta — bordas escuras, centro aberto */}
        <div className="absolute inset-0 z-10" style={{ background: 'radial-gradient(ellipse at center, transparent 35%, rgba(20,14,10,0.75) 100%)' }} />
        {/* Gradiente top→bottom para leitura do texto */}
        <div className="absolute inset-0 bg-gradient-to-b from-black/30 via-transparent to-black/65 z-10" />
        {/* Tinte champagne suave */}
        <div className="absolute inset-0 bg-[#c9a96e]/10 z-10" />
      </motion.div>

      <div className="relative z-20 text-center text-white px-6 max-w-3xl">
        <motion.p
          initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.2 }}
          className="text-sm uppercase tracking-[0.3em] text-[#e8d5b0] mb-6"
        >
          {subtitle || 'Estamos nos casando!'}
        </motion.p>

        <motion.h1
          initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1, delay: 0.4 }}
          className="font-serif text-4xl sm:text-5xl md:text-7xl font-light mb-6 leading-tight"
        >
          {coupleName}
        </motion.h1>

        <motion.div
          initial={{ scaleX: 0 }} animate={{ scaleX: 1 }}
          transition={{ duration: 0.8, delay: 0.8 }}
          className="h-px bg-[#c9a96e] w-32 mx-auto mb-6"
        />

        <motion.p
          initial={{ opacity: 0 }} animate={{ opacity: 1 }}
          transition={{ duration: 0.8, delay: 1 }}
          className="text-lg md:text-xl font-light tracking-wider text-[#e8d5b0]"
        >
          {formatDate(weddingDate)}
        </motion.p>

        <motion.div
          initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 1.3 }}
          className="flex flex-col sm:flex-row gap-4 justify-center mt-10"
        >
          <Link href="/confirmar-presenca" className="px-8 py-3 bg-[#c9a96e] text-white text-sm tracking-widest uppercase hover:bg-[#a07840] transition-colors duration-300">
            Confirmar Presença
          </Link>
          <Link href="/presentes" className="px-8 py-3 border border-white/60 text-white text-sm tracking-widest uppercase hover:bg-white/10 transition-colors duration-300">
            Lista de Presentes
          </Link>
        </motion.div>
      </div>

      <motion.div
        initial={{ opacity: 0 }} animate={{ opacity: 1 }}
        transition={{ delay: 2 }}
        className="absolute bottom-8 left-1/2 -translate-x-1/2 z-20"
      >
        <motion.div
          animate={{ y: [0, 8, 0] }}
          transition={{ repeat: Infinity, duration: 1.5 }}
          className="w-px h-12 bg-gradient-to-b from-white/60 to-transparent mx-auto"
        />
      </motion.div>
    </section>
  )
}
