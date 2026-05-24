'use client'

import { useState } from 'react'
import { motion } from 'framer-motion'
import AnimatedSection from '@/components/ui/AnimatedSection'
import PageTransition from '@/components/layout/PageTransition'
import PixModal from '@/components/ui/PixModal'
import Image from 'next/image'
import { Gift } from '@/lib/types'

function ImageWithFallback({ src, alt }: { src: string; alt: string }) {
  const [error, setError] = useState(false)
  if (error) {
    return (
      <div className="w-full h-full flex items-center justify-center">
        <span className="text-4xl">🎁</span>
      </div>
    )
  }
  return (
    <Image
      src={src}
      alt={alt}
      fill
      className="object-cover group-hover:scale-105 transition-transform duration-500"
      onError={() => setError(true)}
    />
  )
}

interface Props {
  gifts: Gift[]
  pixKey: string
  pixName: string
  heroImageUrl?: string
}

const PAGE_SIZE = 9

export default function PresentsClient({ gifts, pixKey, pixName, heroImageUrl }: Props) {
  const [modal, setModal] = useState<{ gift?: Gift; open: boolean }>({ open: false })
  const [visible, setVisible] = useState(PAGE_SIZE)

  const visibleGifts = gifts.slice(0, visible)
  const remaining = gifts.length - visible

  return (
    <PageTransition>
      {/* Hero */}
      <div className="relative h-48 md:h-64 flex items-end bg-[#2c2c2c] overflow-hidden">
        {heroImageUrl && <div className="absolute inset-0 bg-cover bg-center opacity-20" style={{ backgroundImage: `url('${heroImageUrl}')` }} />}
        <div className="relative z-10 px-6 pb-10 max-w-5xl mx-auto w-full">
          <p className="text-xs uppercase tracking-[0.3em] text-[#c9a96e] mb-2">Presenteie com amor</p>
          <h1 className="font-serif text-2xl sm:text-4xl md:text-5xl text-white font-light">Lista de Presentes</h1>
        </div>
      </div>

      <div className="max-w-5xl mx-auto px-6 py-20">

        {/* PIX banner geral */}
        {pixKey && (
          <AnimatedSection className="mb-16">
            <div className="relative overflow-hidden rounded-2xl bg-[#2c2c2c] p-6 sm:p-8 md:p-12 text-center">
              {heroImageUrl && (
                <div className="absolute inset-0 opacity-10"
                  style={{ backgroundImage: `url('${heroImageUrl}')`, backgroundSize: 'cover', backgroundPosition: 'center' }} />
              )}
              <div className="relative z-10">
                <p className="text-xs uppercase tracking-[0.3em] text-[#c9a96e] mb-3">Prefere presentear em dinheiro?</p>
                <p className="font-serif text-xl sm:text-2xl md:text-3xl text-white mb-2">Qualquer valor é bem-vindo</p>
                <p className="text-white/60 text-sm mb-8">Contribua para os nossos sonhos via PIX, de forma rápida e segura.</p>
                <button
                  onClick={() => setModal({ open: true })}
                  className="px-10 py-3 bg-[#c9a96e] text-white text-sm uppercase tracking-widest hover:bg-[#a07840] transition-colors rounded-full"
                >
                  Presentear via PIX
                </button>
              </div>
            </div>
          </AnimatedSection>
        )}

        {/* Título da grade */}
        <AnimatedSection className="text-center mb-12">
          <p className="text-sm uppercase tracking-[0.3em] text-[#c9a96e] mb-3">Sugestões especiais</p>
          <h2 className="font-serif text-3xl text-[#2c2c2c]">Escolha um presente para o casal</h2>
        </AnimatedSection>

        {/* Grade de presentes */}
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {visibleGifts.map((gift, i) => (
            <motion.div
              key={gift.id}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: '-50px' }}
              transition={{ duration: 0.5, delay: (i % 3) * 0.1 }}
              className="bg-white rounded-2xl overflow-hidden shadow-sm hover:shadow-xl transition-all duration-300 group flex flex-col border border-gray-100"
            >
              {/* Imagem */}
              <div className="relative h-48 overflow-hidden bg-[#f5f0e8]">
                {gift.image_url ? (
                  <ImageWithFallback src={gift.image_url} alt={gift.name} />
                ) : (
                  <div className="w-full h-full flex items-center justify-center">
                    <span className="text-4xl">🎁</span>
                  </div>
                )}
                {gift.price && (
                  <div className="absolute top-3 right-3 bg-white/95 backdrop-blur-sm px-3 py-1 rounded-full text-xs font-semibold text-[#c9a96e] shadow-sm">
                    R$ {gift.price.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
                  </div>
                )}
              </div>

              {/* Conteúdo */}
              <div className="p-5 flex flex-col flex-1">
                <h3 className="font-serif text-lg text-[#2c2c2c] mb-1">{gift.name}</h3>
                {gift.description && (
                  <p className="text-sm text-[#4a4a4a] leading-relaxed flex-1 mb-4">{gift.description}</p>
                )}

                {/* Botões */}
                <div className={`flex gap-2 pt-3 border-t border-gray-100 ${!gift.description ? 'mt-auto' : ''}`}>
                  {pixKey && (
                    <button
                      onClick={() => setModal({ gift, open: true })}
                      className="flex-1 py-2.5 bg-[#c9a96e] text-white text-xs uppercase tracking-wider hover:bg-[#a07840] active:scale-95 transition-all rounded-xl font-medium shadow-sm hover:shadow-md cursor-pointer"
                    >
                      {gift.store_link ? 'PIX' : 'Presentear via PIX'}
                    </button>
                  )}
                  {gift.store_link && (
                    <a
                      href={gift.store_link}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex-1 py-2.5 border border-[#c9a96e] text-[#c9a96e] text-xs uppercase tracking-wider text-center hover:bg-[#c9a96e] hover:text-white active:scale-95 transition-all rounded-xl font-medium shadow-sm hover:shadow-md"
                    >
                      Ver na Loja
                    </a>
                  )}
                  {!pixKey && !gift.store_link && (
                    <span className="text-xs text-gray-300 py-2.5 text-center w-full">Em breve</span>
                  )}
                </div>
              </div>
            </motion.div>
          ))}
        </div>

        {remaining > 0 && (
          <div className="text-center mt-12">
            <button
              onClick={() => setVisible((v) => v + PAGE_SIZE)}
              className="px-10 py-3 border border-[#c9a96e] text-[#c9a96e] text-sm uppercase tracking-widest hover:bg-[#c9a96e] hover:text-white active:scale-95 transition-all rounded-full"
            >
              Ver mais {remaining} presente{remaining !== 1 ? 's' : ''}
            </button>
          </div>
        )}
      </div>

      <PixModal
        isOpen={modal.open}
        onClose={() => setModal({ open: false })}
        pixKey={pixKey}
        pixName={pixName}
        amount={modal.gift?.price || undefined}
        giftName={modal.gift?.name}
        giftId={modal.gift?.id}
      />
    </PageTransition>
  )
}
