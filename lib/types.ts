export interface SiteConfig {
  couple_name: string
  wedding_date: string
  ceremony_address: string
  ceremony_time: string
  reception_address: string
  reception_time: string
  pix_key: string
  pix_name: string
  our_story_text: string
  hero_subtitle: string
  hero_image_url: string
  story_image_url: string
  rsvp_deadline: string
  dress_code: string
  wedding_tips: string
  couple_email: string
}

export interface Gift {
  id: string
  name: string
  description: string | null
  price: number | null
  store_link: string | null
  image_url: string | null
  available: boolean
  position: number
  created_at: string
}

export interface RsvpResponse {
  id: string
  guest_name: string
  email: string | null
  phone: string | null
  attending: boolean
  guests_count: number
  companion_names: string | null
  dietary_restrictions: string | null
  message: string | null
  created_at: string
}

export interface GalleryPhoto {
  id: string
  url: string
  caption: string | null
  position: number
  created_at: string
}

export interface TimelineEvent {
  id: string
  year: string
  title: string
  description: string | null
  position: number
  created_at: string
}

export interface PaymentConfirmation {
  id: string
  guest_name: string
  gift_id: string | null
  gift_name: string | null
  amount: number | null
  message: string | null
  created_at: string
}
