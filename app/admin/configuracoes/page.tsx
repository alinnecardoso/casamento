'use client'

import { defaultConfig } from '@/lib/supabase'

export default function ConfiguracoesPage() {
  const config = defaultConfig

  const sections = [
    {
      title: 'Geral',
      fields: [
        { label: 'Nome dos noivos', value: config.couple_name },
        { label: 'Data do casamento', value: config.wedding_date },
        { label: 'Subtítulo do hero', value: config.hero_subtitle },
      ],
    },
    {
      title: 'Local & Horários',
      fields: [
        { label: 'Endereço da cerimônia', value: config.ceremony_address },
        { label: 'Horário da cerimônia', value: config.ceremony_time },
        { label: 'Endereço da recepção', value: config.reception_address },
        { label: 'Horário da recepção', value: config.reception_time },
        { label: 'Código de vestimenta', value: config.dress_code },
      ],
    },
    {
      title: 'RSVP',
      fields: [
        { label: 'Prazo para confirmar', value: config.rsvp_deadline },
      ],
    },
    {
      title: 'Imagens',
      fields: [
        { label: 'Hero', value: config.hero_image_url },
        { label: 'Nossa História', value: config.story_image_url },
      ],
    },
  ]

  return (
    <div className="max-w-2xl space-y-8">
      <div>
        <h1 className="text-2xl font-serif text-[#2c2c2c] mb-1">Configurações do Site</h1>
        <p className="text-sm text-[#4a4a4a]">
          Valores definidos em <code className="bg-gray-100 px-1 rounded">lib/supabase.ts</code> no <code className="bg-gray-100 px-1 rounded">defaultConfig</code>.
        </p>
      </div>

      {sections.map((section) => (
        <div key={section.title} className="bg-white border border-gray-200 rounded-lg p-6">
          <h2 className="font-medium text-[#2c2c2c] mb-4">{section.title}</h2>
          <div className="space-y-3">
            {section.fields.map((field) => (
              <div key={field.label}>
                <p className="text-xs uppercase tracking-widest text-[#4a4a4a] mb-0.5">{field.label}</p>
                <p className="text-sm text-[#2c2c2c] break-all">{field.value || <span className="text-gray-400 italic">não definido</span>}</p>
              </div>
            ))}
          </div>
        </div>
      ))}
    </div>
  )
}
