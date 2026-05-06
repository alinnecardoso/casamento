'use client'

import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import AnimatedSection from '@/components/ui/AnimatedSection'

function pad(n: number) { return String(n).padStart(2, '0') }

function getTimeLeft(dateStr: string) {
  const target = new Date(dateStr + 'T12:00:00').getTime()
  const now = Date.now()
  const diff = target - now
  if (diff <= 0) return { days: 0, hours: 0, minutes: 0, seconds: 0 }
  return {
    days: Math.floor(diff / 86400000),
    hours: Math.floor((diff % 86400000) / 3600000),
    minutes: Math.floor((diff % 3600000) / 60000),
    seconds: Math.floor((diff % 60000) / 1000),
  }
}

function FlipUnit({ value, label }: { value: string; label: string }) {
  return (
    <div className="flex flex-col items-center gap-2">
      <div className="relative bg-[#2c2c2c] rounded-lg w-20 md:w-28 h-20 md:h-28 flex items-center justify-center overflow-hidden">
        <AnimatePresence mode="wait">
          <motion.span
            key={value}
            initial={{ y: -40, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            exit={{ y: 40, opacity: 0 }}
            transition={{ duration: 0.3 }}
            className="font-serif text-4xl md:text-5xl text-white absolute"
          >
            {value}
          </motion.span>
        </AnimatePresence>
      </div>
      <span className="text-xs uppercase tracking-widest text-[#c9a96e]">{label}</span>
    </div>
  )
}

export default function Countdown({ weddingDate }: { weddingDate: string }) {
  const [time, setTime] = useState(getTimeLeft(weddingDate))

  useEffect(() => {
    const timer = setInterval(() => setTime(getTimeLeft(weddingDate)), 1000)
    return () => clearInterval(timer)
  }, [weddingDate])

  return (
    <section className="py-24 bg-[#faf8f4]">
      <div className="max-w-4xl mx-auto px-6 text-center">
        <AnimatedSection>
          <p className="text-sm uppercase tracking-[0.3em] text-[#c9a96e] mb-3">Contagem Regressiva</p>
          <h2 className="font-serif text-3xl md:text-4xl text-[#2c2c2c] mb-12">Falta pouco para o grande dia</h2>
        </AnimatedSection>
        <AnimatedSection delay={0.2}>
          <div className="flex items-center justify-center gap-4 md:gap-8">
            <FlipUnit value={String(time.days)} label="dias" />
            <span className="font-serif text-3xl text-[#c9a96e] mb-8">:</span>
            <FlipUnit value={pad(time.hours)} label="horas" />
            <span className="font-serif text-3xl text-[#c9a96e] mb-8">:</span>
            <FlipUnit value={pad(time.minutes)} label="minutos" />
            <span className="font-serif text-3xl text-[#c9a96e] mb-8">:</span>
            <FlipUnit value={pad(time.seconds)} label="segundos" />
          </div>
        </AnimatedSection>
      </div>
    </section>
  )
}
