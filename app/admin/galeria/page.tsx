'use client'

import { useState, useEffect, useRef } from 'react'
import Image from 'next/image'
import { supabase } from '@/lib/supabase'
import { GalleryPhoto } from '@/lib/types'

export default function AdminGaleriaPage() {
  const [photos, setPhotos] = useState<GalleryPhoto[]>([])
  const [uploading, setUploading] = useState(false)
  const fileRef = useRef<HTMLInputElement>(null)

  const load = async () => {
    const { data } = await supabase.from('gallery_photos').select('*').order('position')
    setPhotos(data || [])
  }

  useEffect(() => { load() }, [])

  const handleUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || [])
    if (!files.length) return
    setUploading(true)
    for (const file of files) {
      const ext = file.name.split('.').pop()
      const path = `gallery/${Date.now()}-${Math.random().toString(36).slice(2)}.${ext}`
      const { data, error } = await supabase.storage.from('photos').upload(path, file)
      if (!error && data) {
        const { data: urlData } = supabase.storage.from('photos').getPublicUrl(path)
        await supabase.from('gallery_photos').insert({
          url: urlData.publicUrl,
          position: photos.length,
        })
      }
    }
    setUploading(false)
    load()
    if (fileRef.current) fileRef.current.value = ''
  }

  const handleDelete = async (photo: GalleryPhoto) => {
    if (!confirm('Remover esta foto?')) return
    const path = photo.url.split('/photos/')[1]
    await Promise.all([
      supabase.storage.from('photos').remove([path]),
      supabase.from('gallery_photos').delete().eq('id', photo.id),
    ])
    load()
  }

  const updateCaption = async (id: string, caption: string) => {
    await supabase.from('gallery_photos').update({ caption }).eq('id', id)
  }

  return (
    <div>
      <div className="flex items-center justify-between mb-8">
        <h1 className="text-2xl font-serif text-[#2c2c2c]">Galeria de Fotos</h1>
        <div>
          <input ref={fileRef} type="file" multiple accept="image/*" className="hidden" onChange={handleUpload} />
          <button
            onClick={() => fileRef.current?.click()}
            disabled={uploading}
            className="px-4 py-2 bg-[#c9a96e] text-white text-sm rounded hover:bg-[#a07840] disabled:opacity-50 transition-colors"
          >
            {uploading ? 'Enviando...' : '+ Adicionar fotos'}
          </button>
        </div>
      </div>

      {photos.length === 0 ? (
        <div
          onClick={() => fileRef.current?.click()}
          className="border-2 border-dashed border-[#e8d5b0] rounded-lg p-16 text-center cursor-pointer hover:border-[#c9a96e] transition-colors"
        >
          <p className="text-4xl mb-4">🖼️</p>
          <p className="text-[#4a4a4a]">Clique para adicionar fotos</p>
          <p className="text-sm text-gray-400 mt-1">PNG, JPG, WEBP até 10MB cada</p>
        </div>
      ) : (
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
          {photos.map((photo) => (
            <div key={photo.id} className="group relative bg-white border border-gray-200 rounded-lg overflow-hidden">
              <div className="aspect-square relative">
                <Image src={photo.url} alt={photo.caption || ''} fill className="object-cover" />
                <button
                  onClick={() => handleDelete(photo)}
                  className="absolute top-2 right-2 w-6 h-6 bg-red-500 text-white rounded-full text-xs opacity-0 group-hover:opacity-100 transition-opacity"
                >
                  ✕
                </button>
              </div>
              <input
                type="text"
                placeholder="Legenda (opcional)"
                defaultValue={photo.caption || ''}
                onBlur={(e) => updateCaption(photo.id, e.target.value)}
                className="w-full px-2 py-1 text-xs border-t border-gray-100 focus:outline-none focus:bg-amber-50"
              />
            </div>
          ))}
          <div
            onClick={() => fileRef.current?.click()}
            className="aspect-square border-2 border-dashed border-[#e8d5b0] rounded-lg flex items-center justify-center cursor-pointer hover:border-[#c9a96e] transition-colors"
          >
            <span className="text-[#c9a96e] text-3xl">+</span>
          </div>
        </div>
      )}
    </div>
  )
}
