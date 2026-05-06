import { supabase, getSiteConfig, defaultConfig } from '@/lib/supabase'
import GalleryClient from './GalleryClient'

export const revalidate = 60

const placeholders = Array.from({ length: 12 }, (_, i) => ({
  id: String(i),
  url: `https://images.unsplash.com/photo-${['1519741497674-611481863552', '1511285560929-80b456fea0bc', '1519225421980-715cb0215aed', '1465495976277-4387d4b0b4c6', '1583939003579-730e3918a45a', '1606216794074-735e91aa2c92', '1511285560929-80b456fea0bc', '1541604193435-22b4de847e7d', '1522673607200-470f93655db0', '1537633552985-df8429e8048b', '1469371983316-edb2fc3706b4', '1537633552985-df8429e8048b'][i]}?w=600&q=80`,
  caption: null,
  position: i,
  created_at: '',
}))

export default async function GaleriaPage() {
  const [{ data: photos }, config] = await Promise.all([
    supabase.from('gallery_photos').select('*').order('position'),
    getSiteConfig().catch(() => defaultConfig),
  ])
  const displayPhotos = (photos && photos.length > 0) ? photos : placeholders

  return <GalleryClient photos={displayPhotos} heroImageUrl={config.hero_image_url} />
}
