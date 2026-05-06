'use client'

import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import toast from 'react-hot-toast'

export default function RSVPForm() {
  const [attending, setAttending] = useState<boolean | null>(null)
  const [submitted, setSubmitted] = useState(false)
  const [loading, setLoading] = useState(false)
  const [form, setForm] = useState({
    guest_name: '', email: '', phone: '',
    guests_count: 1, dietary_restrictions: '', message: '',
  })

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
          {attending ? 'Uau, mal podemos esperar!' : 'Obrigados por nos avisar!'}
        </h2>
        <p className="text-[#4a4a4a]">
          {attending
            ? 'Sua presença vai tornar nosso dia ainda mais especial. Até lá!'
            : 'Sentiremos sua falta. Mas ficamos felizes que você nos avisou.'}
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
            {[
              { name: 'guest_name', label: 'Seu nome completo *', type: 'text', required: true },
              { name: 'email', label: 'E-mail (para receber confirmação)', type: 'email', required: false },
              { name: 'phone', label: 'WhatsApp', type: 'tel', required: false },
            ].map((f) => (
              <div key={f.name}>
                <label className="block text-xs uppercase tracking-widest text-[#4a4a4a] mb-1">{f.label}</label>
                <input
                  type={f.type} required={f.required}
                  value={form[f.name as keyof typeof form] as string}
                  onChange={(e) => setForm({ ...form, [f.name]: e.target.value })}
                  className="w-full border border-[#e8d5b0] bg-white px-4 py-3 text-sm text-[#2c2c2c] focus:outline-none focus:border-[#c9a96e] transition-colors"
                />
              </div>
            ))}

            {attending && (
              <>
                <div>
                  <label className="block text-xs uppercase tracking-widest text-[#4a4a4a] mb-1">Número de pessoas (incluindo você)</label>
                  <input
                    type="number" min={1} max={10}
                    value={form.guests_count}
                    onChange={(e) => setForm({ ...form, guests_count: Number(e.target.value) })}
                    className="w-full border border-[#e8d5b0] bg-white px-4 py-3 text-sm text-[#2c2c2c] focus:outline-none focus:border-[#c9a96e] transition-colors"
                  />
                </div>
                <div>
                  <label className="block text-xs uppercase tracking-widest text-[#4a4a4a] mb-1">Restrições alimentares</label>
                  <input
                    type="text" placeholder="Vegetariano, alergia a amendoim, etc."
                    value={form.dietary_restrictions}
                    onChange={(e) => setForm({ ...form, dietary_restrictions: e.target.value })}
                    className="w-full border border-[#e8d5b0] bg-white px-4 py-3 text-sm text-[#2c2c2c] focus:outline-none focus:border-[#c9a96e] transition-colors"
                  />
                </div>
              </>
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
              {loading ? 'Enviando...' : 'Confirmar'}
            </button>
          </motion.div>
        )}
      </AnimatePresence>
    </form>
  )
}
