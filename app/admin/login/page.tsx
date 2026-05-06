'use client'

import { useState } from 'react'
import { supabase } from '@/lib/supabase'
import { useRouter } from 'next/navigation'
import { motion } from 'framer-motion'

export default function AdminLoginPage() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)
  const router = useRouter()

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError('')
    const { error } = await supabase.auth.signInWithPassword({ email, password })
    if (error) {
      setError('Email ou senha incorretos')
      setLoading(false)
    } else {
      router.push('/admin')
      router.refresh()
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-[#faf8f4] px-4">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="w-full max-w-sm bg-white border border-[#e8d5b0] rounded-sm p-10"
      >
        <div className="text-center mb-8">
          <h1 className="font-serif text-2xl text-[#2c2c2c]">Área Admin</h1>
          <p className="text-sm text-[#4a4a4a] mt-1">Gerencie o site do casamento</p>
        </div>

        <form onSubmit={handleLogin} className="space-y-4">
          <div>
            <label className="block text-xs uppercase tracking-widest text-[#4a4a4a] mb-1">E-mail</label>
            <input
              type="email" required value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full border border-[#e8d5b0] px-4 py-3 text-sm focus:outline-none focus:border-[#c9a96e] transition-colors"
            />
          </div>
          <div>
            <label className="block text-xs uppercase tracking-widest text-[#4a4a4a] mb-1">Senha</label>
            <input
              type="password" required value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full border border-[#e8d5b0] px-4 py-3 text-sm focus:outline-none focus:border-[#c9a96e] transition-colors"
            />
          </div>
          {error && <p className="text-red-500 text-xs">{error}</p>}
          <button
            type="submit" disabled={loading}
            className="w-full py-3 bg-[#c9a96e] text-white text-sm uppercase tracking-widest hover:bg-[#a07840] transition-colors disabled:opacity-50"
          >
            {loading ? 'Entrando...' : 'Entrar'}
          </button>
        </form>
      </motion.div>
    </div>
  )
}
