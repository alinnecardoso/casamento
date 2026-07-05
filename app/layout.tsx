import type { Metadata } from 'next'
import { Playfair_Display, Lato } from 'next/font/google'
import { Toaster } from 'react-hot-toast'
import './globals.css'
import Navbar from '@/components/layout/Navbar'
import { defaultConfig } from '@/lib/supabase'

const playfair = Playfair_Display({
  subsets: ['latin'],
  variable: '--font-playfair',
  display: 'swap',
  weight: ['400', '500', '600', '700'],
  style: ['normal', 'italic'],
})

const lato = Lato({
  subsets: ['latin'],
  variable: '--font-lato',
  display: 'swap',
  weight: ['300', '400', '700'],
})

export const metadata: Metadata = {
  title: 'Nosso Casamento',
  description: 'Site oficial do nosso casamento',
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  const config = defaultConfig

  return (
    <html lang="pt-BR" className={`${playfair.variable} ${lato.variable} h-full antialiased`}>
      <body className="min-h-full flex flex-col bg-[#faf8f4]">
        <Navbar coupleName={config.couple_name} />
        <main className="flex-1">{children}</main>
        <footer className="bg-[#2c2c2c] text-white/60 text-center py-8 text-xs tracking-widest">
          <p className="font-serif text-white/80 mb-1">{config.couple_name}</p>
          <p className="uppercase">
            {new Date(config.wedding_date + 'T12:00:00').toLocaleDateString('pt-BR', {
              day: 'numeric', month: 'long', year: 'numeric',
            })}
          </p>
        </footer>
        <Toaster
          position="bottom-center"
          toastOptions={{
            style: { fontFamily: 'var(--font-lato)', fontSize: '14px' },
            success: { iconTheme: { primary: '#c9a96e', secondary: '#fff' } },
          }}
        />
      </body>
    </html>
  )
}
