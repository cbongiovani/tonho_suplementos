'use client'
import { Instagram } from 'lucide-react'
import { INSTAGRAM_URL } from '@/lib/utils'

export function FloatingInstagram() {
  return (
    <a
      href={INSTAGRAM_URL}
      target="_blank"
      rel="noopener noreferrer"
      className="fixed bottom-6 right-6 z-50 flex items-center gap-2 bg-[#FF6A00] text-black px-4 py-3 font-bold text-sm uppercase tracking-widest shadow-lg hover:bg-orange-400 transition-all duration-200 hover:scale-105 animate-pulse-orange"
      aria-label="Falar no Instagram"
    >
      <Instagram size={18} />
      <span className="hidden sm:inline">Falar no Instagram</span>
    </a>
  )
}
