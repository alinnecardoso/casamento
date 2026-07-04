import { getSiteConfig, defaultConfig } from '@/lib/supabase'
import GalleryClient from './GalleryClient'

export const revalidate = 60

const localPhotos = Array.from({ length: 11 }, (_, i) => ({
  id: String(i),
  url: `/fotos/foto-${String(i + 1).padStart(2, '0')}.jpg`,
  caption: null,
  position: i,
  created_at: '',
}))

export default async function GaleriaPage() {
  const config = await getSiteConfig().catch(() => defaultConfig)
  return <GalleryClient photos={localPhotos} heroImageUrl={config.hero_image_url} />
}
