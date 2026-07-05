'use client'

import Link from 'next/link'
import { usePathname, useRouter } from 'next/navigation'

const links = [
  { href: '/admin', label: 'Dashboard', icon: '📊' },
  { href: '/admin/rsvp', label: 'Confirmações', icon: '✅' },
  { href: '/admin/nossa-historia', label: 'Nossa História', icon: '📖' },
  { href: '/admin/presentes', label: 'Presentes', icon: '🎁' },
  { href: '/admin/galeria', label: 'Galeria', icon: '🖼️' },
]

export default function AdminNav() {
  const pathname = usePathname()
  const router = useRouter()

  const handleLogout = async () => {
    await fetch('/api/admin/logout', { method: 'POST' })
    router.push('/admin/login')
    router.refresh()
  }

  return (
    <aside className="w-64 bg-[#2c2c2c] min-h-screen flex flex-col">
      <div className="p-6 border-b border-white/10">
        <p className="font-serif text-white text-lg">Admin</p>
        <p className="text-white/40 text-xs mt-1">Painel do casamento</p>
      </div>
      <nav className="flex-1 p-4 space-y-1">
        {links.map((link) => (
          <Link
            key={link.href}
            href={link.href}
            className={`flex items-center gap-3 px-4 py-3 rounded text-sm transition-colors ${
              pathname === link.href
                ? 'bg-[#c9a96e] text-white'
                : 'text-white/60 hover:text-white hover:bg-white/5'
            }`}
          >
            <span>{link.icon}</span>
            {link.label}
          </Link>
        ))}
      </nav>
      <div className="p-4 border-t border-white/10">
        <Link href="/" target="_blank" className="flex items-center gap-3 px-4 py-3 text-sm text-white/40 hover:text-white transition-colors mb-1">
          <span>🌐</span> Ver site
        </Link>
        <button
          onClick={handleLogout}
          className="w-full flex items-center gap-3 px-4 py-3 text-sm text-white/40 hover:text-red-400 transition-colors"
        >
          <span>🚪</span> Sair
        </button>
      </div>
    </aside>
  )
}
