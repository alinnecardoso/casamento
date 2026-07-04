import { createClient } from '@supabase/supabase-js'
import { SiteConfig, TimelineEvent, PaymentConfirmation } from './types'

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY!

export const supabase = createClient(supabaseUrl, supabaseKey)

export const supabaseAdmin = createClient(
  supabaseUrl,
  process.env.SUPABASE_SERVICE_KEY ?? supabaseKey
)

export const defaultConfig: SiteConfig = {
  couple_name: 'Alinne & Gabriel',
  wedding_date: '2026-11-22',
  ceremony_address: 'Império Eventos — Votorantim, SP',
  ceremony_time: '17h00',
  reception_address: 'Império Eventos — Votorantim, SP',
  reception_time: '19h00',
  pix_key: '',
  pix_name: 'Alinne & Gabriel',
  our_story_text: 'Em 2019, Alinne foi convidada para um teatro de Páscoa na igreja. Ela foi, teve uma experiência com Deus naquele dia — e nunca mais parou de ir. Gabriel estava no palco. Ela o notou, mas não deu muita bola — afinal, não ia vê-lo de novo.\n\nAí em junho, numa reunião de adolescentes, os dois se encontraram de verdade — dessa vez ele percebeu.\n\nA amizade foi crescendo aos poucos, sem pressa. Em 2022, quando Alinne completou 18 anos, Gabriel pediu em namoro. Em 2025, ele a chamou pra um voo de balão em Boituva — "só um passeio". Alinne já desconfiava de alguma coisa. Quando o balão pousou, ele ajoelhou. Ela disse sim, como se não estivesse esperando.\n\nNos vemos dia 22 de novembro de 2026!',
  hero_subtitle: 'Estamos nos casando!',
  hero_image_url: 'https://images.unsplash.com/photo-1519741497674-611481863552?w=1920&q=80',
  story_image_url: 'https://images.unsplash.com/photo-1606216794074-735e91aa2c92?w=800&q=80',
  rsvp_deadline: '31 de outubro de 2026',
  dress_code: 'Traje passeio fino',
  wedding_tips: '',
  couple_email: '',
}

export async function getSiteConfig(): Promise<SiteConfig> {
  const { data } = await supabase.from('site_config').select('key, value')
  if (!data) return defaultConfig
  const config = { ...defaultConfig }
  for (const row of data) {
    if (row.key in config) {
      (config as Record<string, string>)[row.key] = row.value
    }
  }
  return config
}

export async function updateSiteConfig(key: string, value: string) {
  return supabase
    .from('site_config')
    .upsert({ key, value, updated_at: new Date().toISOString() })
}

export async function getTimelineEvents(): Promise<TimelineEvent[]> {
  const { data } = await supabase
    .from('timeline_events')
    .select('*')
    .order('position')
  return (data as TimelineEvent[]) || []
}

export async function getPaymentConfirmations(): Promise<PaymentConfirmation[]> {
  const { data } = await supabaseAdmin
    .from('payment_confirmations')
    .select('*')
    .order('created_at', { ascending: false })
  return (data as PaymentConfirmation[]) || []
}
