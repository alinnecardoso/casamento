import { getSiteConfig, supabase, defaultConfig } from '@/lib/supabase'
import Hero from '@/components/sections/Hero'
import Countdown from '@/components/sections/Countdown'
import HomeStoryTeaser from '@/components/sections/HomeStoryTeaser'
import HomeEventInfo from '@/components/sections/HomeEventInfo'
import HomeGalleryPreview from '@/components/sections/HomeGalleryPreview'
import HomeCTA from '@/components/sections/HomeCTA'
import { GalleryPhoto } from '@/lib/types'

export const revalidate = 60

export default async function HomePage() {
  const [config, photosResult] = await Promise.all([
    getSiteConfig().catch(() => defaultConfig),
    supabase.from('gallery_photos').select('*').order('position').limit(4),
  ])
  const photos = (photosResult.data as GalleryPhoto[] | null)

  return (
    <>
      <Hero
        coupleName={config.couple_name}
        weddingDate={config.wedding_date}
        subtitle={config.hero_subtitle}
        heroImageUrl={config.hero_image_url}
      />
      <Countdown weddingDate={config.wedding_date} />
      <HomeStoryTeaser
        text={config.our_story_text}
        coupleName={config.couple_name}
        storyImageUrl={config.story_image_url}
      />
      <HomeEventInfo
        weddingDate={config.wedding_date}
        ceremonyAddress={config.ceremony_address}
        ceremonyTime={config.ceremony_time}
        receptionAddress={config.reception_address}
        receptionTime={config.reception_time}
      />
      <HomeGalleryPreview photos={photos || []} />
      <HomeCTA />
    </>
  )
}
