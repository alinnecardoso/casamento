import { getSiteConfig, supabase } from '@/lib/supabase'
import PresentsClient from './PresentsClient'
import { Gift } from '@/lib/types'

export const revalidate = 60

const defaultGifts: Gift[] = [
  { id: '1', name: 'Jogo de Panelas', description: 'Para nossa nova cozinha', price: 350, store_link: null, image_url: null, available: true, position: 0, created_at: '' },
  { id: '2', name: 'Jogo de Cama', description: 'Queen size, 300 fios', price: 280, store_link: null, image_url: null, available: true, position: 1, created_at: '' },
  { id: '3', name: 'Lua de Mel', description: 'Contribua para nossa viagem dos sonhos', price: null, store_link: null, image_url: null, available: true, position: 2, created_at: '' },
  { id: '4', name: 'Liquidificador', description: '', price: 180, store_link: null, image_url: null, available: true, position: 3, created_at: '' },
]

export default async function PresentesPage() {
  const [config, { data: gifts }] = await Promise.all([
    getSiteConfig(),
    supabase.from('gifts').select('*').eq('available', true).order('position'),
  ])

  return (
    <PresentsClient
      gifts={(gifts as Gift[]) || defaultGifts}
      pixKey={config.pix_key}
      pixName={config.pix_name}
      heroImageUrl={config.hero_image_url}
    />
  )
}
