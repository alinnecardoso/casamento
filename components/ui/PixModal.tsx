'use client'

import { useEffect, useRef, useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { generatePixPayload } from '@/lib/pix'
import { supabase } from '@/lib/supabase'

interface Props {
  isOpen: boolean
  onClose: () => void
  pixKey: string
  pixName: string
  amount?: number
  giftName?: string
  giftId?: string
}

type Step = 'qr' | 'confirm' | 'done'

export default function PixModal({ isOpen, onClose, pixKey, pixName, amount, giftName, giftId }: Props) {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const [copied, setCopied] = useState(false)
  const [qrError, setQrError] = useState(false)
  const [step, setStep] = useState<Step>('qr')
  const [guestName, setGuestName] = useState('')
  const [message, setMessage] = useState('')
  const [saving, setSaving] = useState(false)
  const [canShare, setCanShare] = useState(false)

  useEffect(() => {
    setCanShare(typeof navigator !== 'undefined' && !!navigator.share)
  }, [])

  useEffect(() => {
    if (!isOpen) {
      setTimeout(() => {
        setStep('qr')
        setGuestName('')
        setMessage('')
        setQrError(false)
      }, 300)
      return
    }
    if (!pixKey) return
    setQrError(false)

    const generateQR = async () => {
      try {
        const QRCode = (await import('qrcode')).default
        const payload = generatePixPayload(pixKey, pixName || 'Casal', 'Brasil', amount, giftName)
        if (canvasRef.current) {
          await QRCode.toCanvas(canvasRef.current, payload, {
            width: 300,
            margin: 2,
            color: { dark: '#2c2c2c', light: '#ffffff' },
          })
        }
      } catch {
        setQrError(true)
      }
    }

    generateQR()
  }, [isOpen, pixKey, pixName, amount, giftName])

  const handleCopy = () => {
    navigator.clipboard.writeText(pixKey)
    setCopied(true)
    setTimeout(() => setCopied(false), 2500)
  }

  const handleDownload = () => {
    if (!canvasRef.current) return
    const url = canvasRef.current.toDataURL('image/png')
    const a = document.createElement('a')
    a.download = 'qrcode-pix.png'
    a.href = url
    a.click()
  }

  const handleShare = async () => {
    if (!canvasRef.current || !navigator.share) return
    try {
      const blob = await new Promise<Blob>((resolve) =>
        canvasRef.current!.toBlob((b) => resolve(b!), 'image/png')
      )
      const file = new File([blob], 'qrcode-pix.png', { type: 'image/png' })
      await navigator.share({ title: 'PIX — Casamento', text: `Chave PIX: ${pixKey}`, files: [file] })
    } catch {
      // user cancelled
    }
  }

  const handleConfirmPayment = async () => {
    if (!guestName.trim()) return
    setSaving(true)
    await supabase.from('payment_confirmations').insert({
      guest_name: guestName.trim(),
      gift_id: giftId || null,
      gift_name: giftName || null,
      amount: amount || null,
      message: message.trim() || null,
    })
    setSaving(false)
    setStep('done')
  }

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/60 z-50"
            onClick={onClose}
          />
          <motion.div
            initial={{ scale: 0.85, opacity: 0, y: 20 }}
            animate={{ scale: 1, opacity: 1, y: 0 }}
            exit={{ scale: 0.85, opacity: 0, y: 20 }}
            transition={{ type: 'spring', damping: 22, stiffness: 300 }}
            className="fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 z-50 bg-white rounded-2xl shadow-2xl w-full max-w-sm text-center overflow-y-auto max-h-[92vh]"
          >
            <button
              onClick={onClose}
              className="absolute top-4 right-4 text-gray-400 hover:text-gray-600 text-xl w-8 h-8 flex items-center justify-center z-10"
              aria-label="Fechar"
            >
              ✕
            </button>

            <AnimatePresence mode="wait">
              {step === 'qr' && (
                <motion.div
                  key="qr"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  className="p-8"
                >
                  <p className="font-serif text-xl text-[#2c2c2c] mb-1">Presentear via PIX</p>
                  {giftName && <p className="text-sm text-[#c9a96e] mb-3">{giftName}</p>}
                  {amount && (
                    <p className="text-2xl font-light text-[#2c2c2c] mb-4">
                      R$ {amount.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
                    </p>
                  )}

                  {!pixKey ? (
                    <div className="py-8 text-[#4a4a4a] text-sm">Chave PIX não configurada ainda.</div>
                  ) : qrError ? (
                    <div className="py-4 text-red-500 text-sm">Erro ao gerar QR code. Copie a chave abaixo.</div>
                  ) : (
                    <canvas ref={canvasRef} className="mx-auto rounded-lg mb-3" />
                  )}

                  {pixKey && !qrError && (
                    <div className="flex justify-center gap-2 mb-4">
                      <button
                        onClick={handleDownload}
                        className="text-xs text-[#4a4a4a] border border-gray-200 px-3 py-1.5 rounded-full hover:bg-gray-50 transition-colors"
                      >
                        ⬇ Baixar QR
                      </button>
                      {canShare && (
                        <button
                          onClick={handleShare}
                          className="text-xs text-[#4a4a4a] border border-gray-200 px-3 py-1.5 rounded-full hover:bg-gray-50 transition-colors"
                        >
                          ↗ Compartilhar
                        </button>
                      )}
                    </div>
                  )}

                  {pixKey && (
                    <>
                      <div className="flex items-center gap-2 bg-gray-50 rounded-lg px-3 py-2 mb-4 border border-gray-100">
                        <span className="text-xs text-gray-600 flex-1 truncate font-mono">{pixKey}</span>
                        <button
                          onClick={handleCopy}
                          className={`text-xs font-medium transition-colors whitespace-nowrap ${copied ? 'text-green-500' : 'text-[#c9a96e] hover:text-[#a07840]'}`}
                        >
                          {copied ? '✓ Copiado!' : 'Copiar'}
                        </button>
                      </div>

                      <div className="bg-[#faf8f4] rounded-lg p-4 mb-5 text-left">
                        <p className="text-xs font-medium text-[#2c2c2c] mb-2 uppercase tracking-widest">Como pagar</p>
                        <ol className="space-y-1.5 text-xs text-[#4a4a4a]">
                          <li><span className="text-[#c9a96e] font-bold mr-1">1.</span>Abra o app do seu banco</li>
                          <li><span className="text-[#c9a96e] font-bold mr-1">2.</span>Acesse a área de PIX</li>
                          <li><span className="text-[#c9a96e] font-bold mr-1">3.</span>Escaneie o QR Code ou cole a chave acima</li>
                          <li><span className="text-[#c9a96e] font-bold mr-1">4.</span>Confirme o pagamento no app</li>
                        </ol>
                      </div>

                      <p className="text-xs text-gray-400 mb-5">
                        Para: <strong className="text-[#2c2c2c]">{pixName || 'Casal'}</strong>
                      </p>

                      <button
                        onClick={() => setStep('confirm')}
                        className="w-full py-3 bg-[#c9a96e] text-white text-sm uppercase tracking-widest hover:bg-[#a07840] transition-colors rounded-lg"
                      >
                        Já paguei ✓
                      </button>
                    </>
                  )}
                </motion.div>
              )}

              {step === 'confirm' && (
                <motion.div
                  key="confirm"
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: 20 }}
                  className="p-8"
                >
                  <div className="text-3xl mb-3">💝</div>
                  <p className="font-serif text-xl text-[#2c2c2c] mb-1">Que lindo!</p>
                  <p className="text-sm text-[#4a4a4a] mb-6">Deixe seu nome para avisarmos os noivos</p>
                  <div className="space-y-3 text-left mb-5">
                    <div>
                      <label className="block text-xs uppercase tracking-widest text-[#4a4a4a] mb-1">Seu nome *</label>
                      <input
                        type="text"
                        value={guestName}
                        onChange={(e) => setGuestName(e.target.value)}
                        placeholder="Como você quer ser chamado(a)"
                        className="w-full border border-gray-200 px-3 py-2 text-sm rounded focus:outline-none focus:border-[#c9a96e]"
                        autoFocus
                      />
                    </div>
                    <div>
                      <label className="block text-xs uppercase tracking-widest text-[#4a4a4a] mb-1">Mensagem (opcional)</label>
                      <textarea
                        rows={2}
                        value={message}
                        onChange={(e) => setMessage(e.target.value)}
                        placeholder="Uma frase especial para os noivos..."
                        className="w-full border border-gray-200 px-3 py-2 text-sm rounded focus:outline-none focus:border-[#c9a96e] resize-none"
                      />
                    </div>
                  </div>
                  <div className="flex gap-3">
                    <button
                      onClick={() => setStep('qr')}
                      className="flex-1 py-2.5 border border-gray-200 text-sm rounded hover:bg-gray-50 transition-colors"
                    >
                      Voltar
                    </button>
                    <button
                      onClick={handleConfirmPayment}
                      disabled={!guestName.trim() || saving}
                      className="flex-1 py-2.5 bg-[#c9a96e] text-white text-sm rounded hover:bg-[#a07840] transition-colors disabled:opacity-50"
                    >
                      {saving ? 'Enviando...' : 'Confirmar'}
                    </button>
                  </div>
                </motion.div>
              )}

              {step === 'done' && (
                <motion.div
                  key="done"
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  className="p-8"
                >
                  <motion.div
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    transition={{ type: 'spring', damping: 10, stiffness: 200, delay: 0.1 }}
                    className="text-5xl mb-4"
                  >
                    🥂
                  </motion.div>
                  <p className="font-serif text-2xl text-[#2c2c2c] mb-3">Obrigada!</p>
                  <p className="text-sm text-[#4a4a4a] mb-6">
                    Seu presente foi registrado. Os noivos vão adorar saber que foi você! 💛
                  </p>
                  <button
                    onClick={onClose}
                    className="w-full py-3 bg-[#c9a96e] text-white text-sm uppercase tracking-widest hover:bg-[#a07840] transition-colors rounded-lg"
                  >
                    Fechar
                  </button>
                </motion.div>
              )}
            </AnimatePresence>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  )
}
