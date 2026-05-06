'use client'

import { useState, useEffect, useRef } from 'react'
import { getSiteConfig, updateSiteConfig } from '@/lib/supabase'
import { supabase } from '@/lib/supabase'
import { SiteConfig } from '@/lib/types'
import toast from 'react-hot-toast'
import Image from 'next/image'
import PixModal from '@/components/ui/PixModal'

const sections: { title: string; fields: { key: keyof SiteConfig; label: string; type?: string; multiline?: boolean }[] }[] = [
  {
    title: 'Informações gerais',
    fields: [
      { key: 'couple_name', label: 'Nome dos noivos (ex: Alinne & Lucas)' },
      { key: 'wedding_date', label: 'Data do casamento', type: 'date' },
      { key: 'hero_subtitle', label: 'Subtítulo do hero (ex: Estamos nos casando!)' },
      { key: 'couple_email', label: 'E-mail do casal (recebe notificações de RSVP)', type: 'email' },
    ],
  },
  {
    title: 'Local & horários',
    fields: [
      { key: 'ceremony_address', label: 'Endereço da cerimônia', multiline: true },
      { key: 'ceremony_time', label: 'Horário da cerimônia (ex: 16h00)' },
      { key: 'reception_address', label: 'Endereço da recepção', multiline: true },
      { key: 'reception_time', label: 'Horário da recepção (ex: 19h00)' },
      { key: 'dress_code', label: 'Código de vestimenta' },
      { key: 'wedding_tips', label: 'Dicas para os convidados', multiline: true },
    ],
  },
  {
    title: 'RSVP',
    fields: [
      { key: 'rsvp_deadline', label: 'Prazo para confirmar presença (ex: 31 de outubro de 2026)' },
    ],
  },
  {
    title: 'Nossa história',
    fields: [
      { key: 'our_story_text', label: 'Texto da história (use Enter para parágrafos)', multiline: true },
    ],
  },
]

export default function ConfiguracoesPage() {
  const [config, setConfig] = useState<SiteConfig | null>(null)
  const [saving, setSaving] = useState(false)
  const [pixPreview, setPixPreview] = useState(false)
  const [uploadingHero, setUploadingHero] = useState(false)
  const [uploadingStory, setUploadingStory] = useState(false)
  const heroFileRef = useRef<HTMLInputElement>(null)
  const storyFileRef = useRef<HTMLInputElement>(null)

  useEffect(() => { getSiteConfig().then(setConfig) }, [])

  const handleSave = async () => {
    if (!config) return
    setSaving(true)
    await Promise.all(Object.entries(config).map(([key, value]) => updateSiteConfig(key, value)))
    setSaving(false)
    toast.success('Configurações salvas!')
  }

  const handleImageUpload = async (file: File, configKey: 'hero_image_url' | 'story_image_url', setUploading: (v: boolean) => void) => {
    setUploading(true)
    const ext = file.name.split('.').pop()
    const path = `site/${configKey}-${Date.now()}.${ext}`
    const { data, error } = await supabase.storage.from('photos').upload(path, file, { upsert: true })
    if (!error && data) {
      const { data: urlData } = supabase.storage.from('photos').getPublicUrl(path)
      setConfig((c) => c ? { ...c, [configKey]: urlData.publicUrl } : c)
      toast.success('Imagem enviada!')
    } else {
      toast.error('Erro ao enviar imagem')
    }
    setUploading(false)
  }

  if (!config) return <div className="text-[#4a4a4a] py-8">Carregando...</div>

  return (
    <div className="max-w-2xl space-y-10">
      <div>
        <h1 className="text-2xl font-serif text-[#2c2c2c] mb-1">Configurações do Site</h1>
        <p className="text-sm text-[#4a4a4a]">As alterações ficam visíveis no site após salvar.</p>
      </div>

      {/* PIX */}
      <div className="bg-white border border-gray-200 rounded-lg p-6">
        <h2 className="font-medium text-[#2c2c2c] mb-4">💳 Pagamento via PIX</h2>
        <div className="space-y-4">
          <div>
            <label className="block text-xs uppercase tracking-widest text-[#4a4a4a] mb-1">Chave PIX</label>
            <input
              type="text" value={config.pix_key}
              onChange={(e) => setConfig({ ...config, pix_key: e.target.value })}
              placeholder="CPF, e-mail, celular ou chave aleatória"
              className="w-full border border-gray-200 px-4 py-3 text-sm rounded focus:outline-none focus:border-[#c9a96e]"
            />
          </div>
          <div>
            <label className="block text-xs uppercase tracking-widest text-[#4a4a4a] mb-1">Nome do recebedor</label>
            <input
              type="text" value={config.pix_name}
              onChange={(e) => setConfig({ ...config, pix_name: e.target.value })}
              placeholder="Como aparece no app do banco"
              className="w-full border border-gray-200 px-4 py-3 text-sm rounded focus:outline-none focus:border-[#c9a96e]"
            />
          </div>
          {config.pix_key && (
            <button onClick={() => setPixPreview(true)} className="text-sm text-[#c9a96e] underline">
              Testar QR code PIX →
            </button>
          )}
        </div>
      </div>

      {/* Imagens */}
      <div className="bg-white border border-gray-200 rounded-lg p-6">
        <h2 className="font-medium text-[#2c2c2c] mb-4">🖼️ Imagens</h2>
        <div className="space-y-6">
          {([
            { key: 'hero_image_url' as const, label: 'Foto de fundo do hero (página inicial)', fileRef: heroFileRef, uploading: uploadingHero, setUploading: setUploadingHero },
            { key: 'story_image_url' as const, label: 'Foto do casal (Nossa História)', fileRef: storyFileRef, uploading: uploadingStory, setUploading: setUploadingStory },
          ]).map((img) => (
            <div key={img.key}>
              <label className="block text-xs uppercase tracking-widest text-[#4a4a4a] mb-2">{img.label}</label>
              <div className="flex items-start gap-4">
                {config[img.key] && (
                  <div className="w-20 h-20 rounded overflow-hidden flex-shrink-0 border border-gray-100">
                    <Image src={config[img.key]} alt="" width={80} height={80} className="w-full h-full object-cover" />
                  </div>
                )}
                <div className="flex-1 space-y-2">
                  <input
                    type="text" value={config[img.key]}
                    onChange={(e) => setConfig({ ...config, [img.key]: e.target.value })}
                    placeholder="Cole uma URL ou faça upload"
                    className="w-full border border-gray-200 px-3 py-2 text-sm rounded focus:outline-none focus:border-[#c9a96e]"
                  />
                  <input ref={img.fileRef} type="file" accept="image/*" className="hidden"
                    onChange={(e) => {
                      const file = e.target.files?.[0]
                      if (file) handleImageUpload(file, img.key, img.setUploading)
                    }}
                  />
                  <button type="button" onClick={() => img.fileRef.current?.click()} disabled={img.uploading}
                    className="text-xs text-[#c9a96e] border border-[#c9a96e] px-3 py-1 rounded hover:bg-[#c9a96e] hover:text-white transition-colors disabled:opacity-50">
                    {img.uploading ? 'Enviando...' : 'Upload'}
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Other sections */}
      {sections.map((section) => (
        <div key={section.title} className="bg-white border border-gray-200 rounded-lg p-6">
          <h2 className="font-medium text-[#2c2c2c] mb-4">{section.title}</h2>
          <div className="space-y-4">
            {section.fields.map((field) => (
              <div key={field.key}>
                <label className="block text-xs uppercase tracking-widest text-[#4a4a4a] mb-1">{field.label}</label>
                {field.multiline ? (
                  <textarea rows={3} value={config[field.key]}
                    onChange={(e) => setConfig({ ...config, [field.key]: e.target.value })}
                    className="w-full border border-gray-200 px-4 py-3 text-sm rounded focus:outline-none focus:border-[#c9a96e] resize-none"
                  />
                ) : (
                  <input type={field.type || 'text'} value={config[field.key]}
                    onChange={(e) => setConfig({ ...config, [field.key]: e.target.value })}
                    className="w-full border border-gray-200 px-4 py-3 text-sm rounded focus:outline-none focus:border-[#c9a96e]"
                  />
                )}
              </div>
            ))}
          </div>
        </div>
      ))}

      <button onClick={handleSave} disabled={saving}
        className="w-full py-4 bg-[#c9a96e] text-white text-sm uppercase tracking-widest hover:bg-[#a07840] transition-colors disabled:opacity-50 rounded">
        {saving ? 'Salvando...' : 'Salvar todas as alterações'}
      </button>

      <PixModal
        isOpen={pixPreview}
        onClose={() => setPixPreview(false)}
        pixKey={config.pix_key}
        pixName={config.pix_name}
      />
    </div>
  )
}
