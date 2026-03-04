import Link from 'next/link'
import Image from 'next/image'
import { createServerSupabaseClient } from '@/lib/supabase/server'
import { INSTAGRAM_URL } from '@/lib/utils'
import { ShoppingBag, Instagram, Menu } from 'lucide-react'

export async function Header() {
  const supabase = createServerSupabaseClient()

  // Fetch site config for logo
  const { data: config } = await supabase.from('site_config').select('logo_url').eq('id', 1).single()
  const { data: { session } } = await supabase.auth.getSession()

  return (
    <header className="fixed top-0 left-0 right-0 z-50 bg-black/95 backdrop-blur border-b border-white/10">
      <div className="max-w-7xl mx-auto px-4 h-16 flex items-center justify-between">
        {/* Logo */}
        <Link href="/" className="flex items-center gap-3 group">
          {config?.logo_url ? (
            <Image src={config.logo_url} alt="Tonho Suplementos" width={120} height={40} className="h-10 w-auto" />
          ) : (
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 bg-[#FF6A00] flex items-center justify-center">
                <span className="font-display text-black text-lg font-bold">T</span>
              </div>
              <span className="font-display text-white text-xl tracking-wider group-hover:text-[#FF6A00] transition-colors">
                TONHO SUPLEMENTOS
              </span>
            </div>
          )}
        </Link>

        {/* Nav */}
        <nav className="hidden md:flex items-center gap-6">
          <Link href="/catalogo" className="text-sm font-medium text-white/70 hover:text-white transition-colors uppercase tracking-wider">
            Produtos
          </Link>
          <Link href="/ofertas" className="text-sm font-medium text-white/70 hover:text-white transition-colors uppercase tracking-wider">
            Ofertas
          </Link>
          <Link href="/cupons" className="text-sm font-medium text-white/70 hover:text-white transition-colors uppercase tracking-wider">
            Cupons
          </Link>
          <a
            href={INSTAGRAM_URL}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-1.5 text-sm font-medium text-[#FF6A00] hover:text-orange-400 transition-colors uppercase tracking-wider"
          >
            <Instagram size={16} />
            @tonhosuplementos
          </a>
        </nav>

        {/* Right */}
        <div className="flex items-center gap-3">
          {session ? (
            <Link href="/ofertas" className="text-sm text-white/70 hover:text-white transition-colors">
              Minha conta
            </Link>
          ) : (
            <Link href="/?login=1" className="text-sm text-white/70 hover:text-white transition-colors">
              Entrar
            </Link>
          )}
          <Link href="/catalogo" className="bg-[#FF6A00] text-black px-4 py-2 text-sm font-bold uppercase tracking-widest hover:bg-orange-400 transition-colors flex items-center gap-1.5">
            <ShoppingBag size={16} />
            Ver Produtos
          </Link>
        </div>
      </div>
    </header>
  )
}
