import { SiteConfig, TimelineEvent } from './types'

export const defaultConfig: SiteConfig = {
  couple_name: 'Alinne & Gabriel',
  wedding_date: '2026-11-22',
  ceremony_address: 'Império Eventos — Votorantim, SP',
  ceremony_time: '17h00',
  reception_address: 'Império Eventos — Votorantim, SP',
  reception_time: '19h00',
  pix_key: '',
  pix_name: 'Alinne & Gabriel',
  our_story_text: '',
  hero_subtitle: 'Estamos nos casando!',
  hero_image_url: '/fotos/foto-04.jpg',
  story_image_url: '/fotos/foto-08.jpg',
  rsvp_deadline: '31 de outubro de 2026',
  dress_code: 'Traje passeio fino',
  wedding_tips: '',
  couple_email: '',
}

export const defaultTimeline: TimelineEvent[] = [
  { id: '1', year: '2019', title: 'Nosso primeiro encontro', description: 'No teatro de Páscoa da igreja, onde o destino resolveu nos colocar no mesmo lugar.', position: 0, created_at: '' },
  { id: '2', year: '2022', title: 'O pedido de namoro', description: 'Gabriel reuniu coragem e fez o pedido oficial — e Alinne disse sim!', position: 1, created_at: '' },
  { id: '3', year: '2025', title: 'O pedido de casamento', description: 'Logo após descerem do balão em Boituva, Gabriel se ajoelhou e perguntou: "Quer se casar comigo?"', position: 2, created_at: '' },
  { id: '4', year: '2026', title: 'O grande dia', description: 'Nossa história continua...', position: 3, created_at: '' },
]
