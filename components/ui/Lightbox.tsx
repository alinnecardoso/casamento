'use client'

import { useEffect, useRef } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import Image from 'next/image'
import { GalleryPhoto } from '@/lib/types'

interface Props {
  photo: GalleryPhoto | null
  onClose: () => void
  onPrev: () => void
  onNext: () => void
}

export default function Lightbox({ photo, onClose, onPrev, onNext }: Props) {
  const touchStartX = useRef<number | null>(null)

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose()
      if (e.key === 'ArrowLeft') onPrev()
      if (e.key === 'ArrowRight') onNext()
    }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [onClose, onPrev, onNext])

  const handleTouchStart = (e: React.TouchEvent) => {
    touchStartX.current = e.touches[0].clientX
  }

  const handleTouchEnd = (e: React.TouchEvent) => {
    if (touchStartX.current === null) return
    const diff = touchStartX.current - e.changedTouches[0].clientX
    if (Math.abs(diff) > 50) {
      diff > 0 ? onNext() : onPrev()
    }
    touchStartX.current = null
  }

  return (
    <AnimatePresence>
      {photo && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 bg-black/95 z-50 flex items-center justify-center"
          onClick={onClose}
          onTouchStart={handleTouchStart}
          onTouchEnd={handleTouchEnd}
        >
          <motion.div
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.9, opacity: 0 }}
            transition={{ duration: 0.25 }}
            className="relative max-w-5xl max-h-[90vh] w-full mx-4"
            onClick={(e) => e.stopPropagation()}
          >
            <Image
              src={photo.url}
              alt={photo.caption || 'Foto'}
              width={1200}
              height={800}
              className="w-full h-full object-contain max-h-[85vh] rounded-lg"
            />
            {photo.caption && (
              <p className="text-white/60 text-center mt-3 text-sm">{photo.caption}</p>
            )}
          </motion.div>

          <button onClick={onClose} className="absolute top-4 right-4 text-white/60 hover:text-white text-2xl w-12 h-12 flex items-center justify-center">✕</button>
          <button onClick={(e) => { e.stopPropagation(); onPrev() }} className="absolute left-1 md:left-4 top-1/2 -translate-y-1/2 text-white/60 hover:text-white text-5xl w-12 h-16 flex items-center justify-center">‹</button>
          <button onClick={(e) => { e.stopPropagation(); onNext() }} className="absolute right-1 md:right-4 top-1/2 -translate-y-1/2 text-white/60 hover:text-white text-5xl w-12 h-16 flex items-center justify-center">›</button>
        </motion.div>
      )}
    </AnimatePresence>
  )
}
