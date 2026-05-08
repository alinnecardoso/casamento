'use client'

import { useState, useRef } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import toast from 'react-hot-toast'

interface ExistingRsvp {
  attending: boolean
  guest_name: string
  created_at: string
}

export default function RSVPForm() {
  const [attending, setAttending] = useState<boolean | null>(null)
  const [submitted, setSubmitted] = useState(false)
  const [updated, setUpdated] = useState(false)
  const [loading, setLoading] = useState(false)
  const [existingRsvp, setExistingRsvp] = useState<ExistingRsvp | null>(null)
  const [form, setForm] = useState({
    guest_name: '', email: '', phone: '',
    companion_names: [] as string[],
    message: '',
  })
  const checkTimeout = useRef<ReturnType<typeof setTimeout> | null>(null)

  const checkExisting = (name: string) => {
    if (checkTimeout.current) clearTimeout(checkTimeout.current)
    setExistingRsvp(null)
    if (name.trim().length < 3) return
    checkTimeout.current = setTimeout(async () => {
      const res = await fetch(`/api/rsvp/check?name=${encodeURIComponent(name.trim())}`)
      const data = await res.json()
      if (data.found) setExistingRsvp(data)
    }, 600)
  }

  const addCompanion = () => {
    if (form.companion_names.length < 9) {
      setForm({ ...form, companion_names: [...form.companion_names, ''] })
    }
  }

  const removeCompanion = (idx: number) => {
    setForm({ ...form, companion_names: form.companion_names.filter((_, i) => i !== idx) })
  }

  const updateCompanion = (idx: number, value: string) => {
    const names = [...form.companion_names]
    names[idx] = value
    setForm({ ...form, companion_names: names })
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (attending === null) return
    if (!form.guest_name.trim()) {
      toast.error('Por favor, informe seu nome.')
      return
    }
    setLoading(true)
    try {
      const res = await fetch('/api/rsvp', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ...form, attending }),
      })
      if (!res.ok) {
        const data = await res.json()
        throw new Error(data.error || 'Erro ao enviar')
      }
      const data = await res.json()
      setUpdated(!!data.updated)
      setSubmitted(true)
    } catch (err) {
      toast.error(err instanceof Error ? err.message : 'Não foi possível enviar. Tente novamente.')
    } finally {
      setLoading(false)
    }
  }

  if (submitted) {
    return (
      <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} className="text-center py-16">
        <div className="text-5xl mb-6">{attending ? '🥂' : '💌'}</div>
        <h2 className="font-serif text-2xl text-[#2c2c2c] mb-4">
          {updated
            ? 'Confirmação atualizada!'
            : attending ? 'Uau, mal podemos esperar!' : 'Obrigados por nos avisar!'}
        </h2>
        <p className="text-[#4a4a4a]">
          {updated && attending && 'Sua presença está confirmada. Qualquer novidade, é só preencher novamente.'}
          {updated && !attending && 'Entendemos! Sentiremos sua falta. Obrigados por nos avisar a tempo.'}
          {!updated && attending && 'Sua presença vai tornar nosso dia ainda mais especial. Até lá!'}
          {!updated && !attending && 'Sentiremos sua falta. Mas ficamos felizes que você nos avisou.'}
        </p>
      </motion.div>
    )
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div>
        <p className="text-sm uppercase tracking-widest text-[#4a4a4a] mb-3">Você vai comparecer?</p>
        <div className="grid grid-cols-2 gap-3">
          {[{ val: true, label: 'Sim, estarei lá! 🎉' }, { val: false, label: 'Não poderei ir 😢' }].map((opt) => (
            <button
              key={String(opt.val)} type="button"
              onClick={() => setAttending(opt.val)}
              className={`py-4 text-sm border-2 transition-all duration-300 ${
                attending === opt.val ? 'border-[#c9a96e] bg-[#c9a96e] text-white' : 'border-[#e8d5b0] text-[#4a4a4a] hover:border-[#c9a96e]'
              }`}
            >
              {opt.label}
            </button>
          ))}
        </div>
      </div>

      <AnimatePresence>
        {attending !== null && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="space-y-4 overflow-hidden"
          >
            <div>
              <label className="block text-xs uppercase tracking-widest text-[#4a4a4a] mb-1">Seu nome completo *</label>
              <input
                type="text" required
                value={form.guest_name}
                onChange={(e) => {
                  setForm({ ...form, guest_name: e.target.value })
                  checkExisting(e.target.value)
                }}
                className="w-full border border-[#e8d5b0] bg-white px-4 py-3 text-sm text-[#2c2c2c] focus:outline-none focus:border-[#c9a96e] transition-colors"
              />
            </div>

            <AnimatePresence>
              {existingRsvp && (
                <motion.div
                  initial={{ opacity: 0, y: -8 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -8 }}
                  className="flex items-start gap-3 bg-amber-50 border border-amber-200 rounded-lg px-4 py-3 text-sm text-amber-800"
                >
                  <span className="text-lg leading-none mt-0.5">ℹ️</span>
                  <p>
                    Encontramos uma confirmação com esse nome de{' '}
                    <strong>{new Date(existingRsvp.created_at).toLocaleDateString('pt-BR')}</strong>{' '}
                    — você havia confirmado que{' '}
                    <strong>{existingRsvp.attending ? 'iria comparecer' : 'não poderia comparecer'}</strong>.
                    Ao enviar, sua resposta será atualizada.
                  </p>
                </motion.div>
              )}
            </AnimatePresence>

            {[
              { name: 'email', label: 'E-mail (opcional)', type: 'email' },
              { name: 'phone', label: 'WhatsApp (opcional)', type: 'tel' },
            ].map((f) => (
              <div key={f.name}>
                <label className="block text-xs uppercase tracking-widest text-[#4a4a4a] mb-1">{f.label}</label>
                <input
                  type={f.type}
                  value={form[f.name as keyof typeof form] as string}
                  onChange={(e) => setForm({ ...form, [f.name]: e.target.value })}
                  className="w-full border border-[#e8d5b0] bg-white px-4 py-3 text-sm text-[#2c2c2c] focus:outline-none focus:border-[#c9a96e] transition-colors"
                />
              </div>
            ))}

            {attending && (
              <div>
                <label className="block text-xs uppercase tracking-widest text-[#4a4a4a] mb-2">
                  Acompanhantes da família
                </label>
                {form.companion_names.length === 0 && (
                  <p className="text-xs text-[#4a4a4a] mb-3">
                    Se você virá com familiares, adicione o nome de cada um abaixo.
                  </p>
                )}
                <div className="space-y-2">
                  {form.companion_names.map((name, idx) => (
                    <div key={idx} className="flex gap-2">
                      <input
                        type="text"
                        placeholder={`Nome do acompanhante ${idx + 1}`}
                        value={name}
                        onChange={(e) => updateCompanion(idx, e.target.value)}
                        className="flex-1 border border-[#e8d5b0] bg-white px-4 py-3 text-sm text-[#2c2c2c] focus:outline-none focus:border-[#c9a96e] transition-colors"
                      />
                      <button
                        type="button"
                        onClick={() => removeCompanion(idx)}
                        className="px-4 border border-[#e8d5b0] text-[#4a4a4a] hover:border-red-300 hover:text-red-500 transition-colors text-lg leading-none"
                      >
                        ×
                      </button>
                    </div>
                  ))}
                </div>
                {form.companion_names.length < 9 && (
                  <button
                    type="button"
                    onClick={addCompanion}
                    className="mt-3 text-sm text-[#c9a96e] hover:text-[#a07840] transition-colors flex items-center gap-1 cursor-pointer"
                  >
                    + Adicionar acompanhante
                  </button>
                )}
              </div>
            )}

            <div>
              <label className="block text-xs uppercase tracking-widest text-[#4a4a4a] mb-1">Mensagem para os noivos</label>
              <textarea
                rows={3} value={form.message}
                onChange={(e) => setForm({ ...form, message: e.target.value })}
                className="w-full border border-[#e8d5b0] bg-white px-4 py-3 text-sm text-[#2c2c2c] focus:outline-none focus:border-[#c9a96e] transition-colors resize-none"
              />
            </div>

            <button
              type="submit" disabled={loading}
              className="w-full py-4 bg-[#c9a96e] text-white text-sm uppercase tracking-widest hover:bg-[#a07840] transition-colors disabled:opacity-50"
            >
              {loading ? 'Enviando...' : existingRsvp ? 'Atualizar confirmação' : 'Confirmar'}
            </button>
          </motion.div>
        )}
      </AnimatePresence>
    </form>
  )
}
