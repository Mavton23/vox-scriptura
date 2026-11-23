import type { MetadataRoute } from 'next'

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: 'Vox Scriptura — Voz da Escritura',
    short_name: 'Vox Scriptura',
    description: 'Perguntas e respostas, doutrinas e uma frase bíblica para cada dia.',
    start_url: '/',
    display: 'standalone',
    background_color: '#F8F8F6',
    theme_color: '#21357A',
    lang: 'pt-BR',
    icons: [
      { src: '/brand/icon-192.png', sizes: '192x192', type: 'image/png' },
      { src: '/brand/icon-512.png', sizes: '512x512', type: 'image/png' },
      { src: '/brand/icon-maskable-512.png', sizes: '512x512', type: 'image/png', purpose: 'maskable' },
    ],
  }
}
