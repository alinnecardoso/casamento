import { defaultConfig } from '@/lib/supabase'
import GalleryClient from './GalleryClient'

const localPhotos = Array.from({ length: 11 }, (_, i) => ({
  id: String(i),
  url: `/fotos/foto-${String(i + 1).padStart(2, '0')}.jpg`,
  caption: null,
  position: i,
  created_at: '',
}))

export default function GaleriaPage() {
  return <GalleryClient photos={localPhotos} heroImageUrl={defaultConfig.hero_image_url} />
}
