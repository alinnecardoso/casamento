'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { motion, AnimatePresence } from 'framer-motion'

const links = [
  { href: '/nossa-historia', label: 'Nossa História' },
  { href: '/galeria', label: 'Galeria' },
  { href: '/local', label: 'Local' },
  { href: '/confirmar-presenca', label: 'Confirmar Presença' },
  { href: '/presentes', label: 'Presentes' },
]

export default function Navbar({ coupleName }: { coupleName?: string }) {
  const [scrolled, setScrolled] = useState(false)
  const [menuOpen, setMenuOpen] = useState(false)
  const pathname = usePathname()
  const isHome = pathname === '/'

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 60)
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  useEffect(() => {
    setMenuOpen(false)
  }, [pathname])

  const navBg = isHome && !scrolled
    ? 'bg-transparent'
    : 'bg-white/90 backdrop-blur-md shadow-sm'

  return (
    <>
      <motion.nav
        initial={{ y: -80 }}
        animate={{ y: 0 }}
        transition={{ duration: 0.6, ease: 'easeOut' }}
        className={`fixed top-0 left-0 right-0 z-50 transition-all duration-500 ${navBg}`}
      >
        <div className="max-w-6xl mx-auto px-6 h-16 flex items-center justify-between">
          <Link href="/" className={`font-serif text-xl font-medium transition-colors ${isHome && !scrolled ? 'text-white' : 'text-[#2c2c2c]'}`}>
            {coupleName || 'Noiva & Noivo'}
          </Link>

          {/* Desktop menu */}
          <div className="hidden md:flex items-center gap-8">
            {links.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className={`text-sm tracking-wide transition-colors relative group ${
                  isHome && !scrolled ? 'text-white/90 hover:text-white' : 'text-[#4a4a4a] hover:text-[#c9a96e]'
                } ${pathname === link.href ? 'text-[#c9a96e]!' : ''}`}
              >
                {link.label}
                <span className={`absolute -bottom-1 left-0 h-px bg-[#c9a96e] transition-all duration-300 ${pathname === link.href ? 'w-full' : 'w-0 group-hover:w-full'}`} />
              </Link>
            ))}
          </div>

          {/* Mobile hamburger */}
          <button
            onClick={() => setMenuOpen(!menuOpen)}
            className={`md:hidden flex flex-col gap-1.5 p-2 ${isHome && !scrolled ? 'text-white' : 'text-[#2c2c2c]'}`}
            aria-label="Menu"
          >
            <motion.span animate={{ rotate: menuOpen ? 45 : 0, y: menuOpen ? 8 : 0 }} className="block w-6 h-px bg-current origin-center" />
            <motion.span animate={{ opacity: menuOpen ? 0 : 1 }} className="block w-6 h-px bg-current" />
            <motion.span animate={{ rotate: menuOpen ? -45 : 0, y: menuOpen ? -8 : 0 }} className="block w-6 h-px bg-current origin-center" />
          </button>
        </div>
      </motion.nav>

      {/* Mobile drawer */}
      <AnimatePresence>
        {menuOpen && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 bg-black/40 z-40 md:hidden"
              onClick={() => setMenuOpen(false)}
            />
            <motion.div
              initial={{ x: '100%' }}
              animate={{ x: 0 }}
              exit={{ x: '100%' }}
              transition={{ type: 'spring', damping: 28, stiffness: 260 }}
              className="fixed top-0 right-0 h-full w-72 bg-white z-50 md:hidden flex flex-col pt-20 px-8 gap-6 shadow-2xl"
            >
              <p className="font-serif text-2xl text-[#c9a96e] mb-4">Menu</p>
              {links.map((link) => (
                <Link
                  key={link.href}
                  href={link.href}
                  className={`text-base tracking-wide transition-colors pb-3 border-b border-[#e8d5b0] ${pathname === link.href ? 'text-[#c9a96e]' : 'text-[#2c2c2c] hover:text-[#c9a96e]'}`}
                >
                  {link.label}
                </Link>
              ))}
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </>
  )
}
