'use client'

import Image from 'next/image'

const localPhotos = Array.from({ length: 11 }, (_, i) => ({
  id: String(i + 1),
  url: `/fotos/foto-${String(i + 1).padStart(2, '0')}.jpg`,
  label: `foto-${String(i + 1).padStart(2, '0')}.jpg`,
}))

export default function AdminGaleriaPage() {
  return (
    <div>
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-2xl font-serif text-[#2c2c2c]">Galeria de Fotos</h1>
          <p className="text-sm text-[#4a4a4a] mt-1">
            Fotos servidas de <code className="bg-gray-100 px-1 rounded">public/fotos/</code>. Para alterar, substitua os arquivos na pasta.
          </p>
        </div>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
        {localPhotos.map((photo) => (
          <div key={photo.id} className="bg-white border border-gray-200 rounded-lg overflow-hidden">
            <div className="aspect-square relative">
              <Image src={photo.url} alt={photo.label} fill className="object-cover" />
            </div>
            <p className="px-2 py-1 text-xs text-gray-400 text-center">{photo.label}</p>
          </div>
        ))}
      </div>
    </div>
  )
}
