import { Header } from '@/components/domain/Header'
import { createServerSupabaseClient } from '@/lib/supabase/server'
import { getOrCreateLead } from '@/lib/auth'
import { redirect } from 'next/navigation'
import { Button } from '@/components/ui/button'
import { INSTAGRAM_URL } from '@/lib/utils'
import { Instagram, Tag, Zap } from 'lucide-react'
import Link from 'next/link'

const MOCK_OFFERS = [
  { id: 1, title: 'Kit Hipertrofia Completo', desc: 'Whey + Creatina + Pré-treino com 20% de desconto', badge: '20% OFF', expires: '31/12/2024' },
  { id: 2, title: 'Termogênico em Dobro', desc: 'Compre 1 termogênico e leve 2. Oferta limitada!', badge: 'LEVE 2 POR 1', expires: '15/12/2024' },
  { id: 3, title: 'Whey Isolado Premium', desc: 'Preço especial para clientes VIP: R$ 159,90', badge: 'VIP', expires: '31/01/2025' },
]

export default async function OfertasPage() {
  const supabase = createServerSupabaseClient()
  const { data: { session } } = await supabase.auth.getSession()

  if (!session) redirect('/?login=required')

  const { lead } = await getOrCreateLead(session.user.id)

  return (
    <div className="min-h-screen bg-black text-white">
      <Header />
      <div className="pt-16">
        <div className="bg-[#0a0a0a] border-b border-white/10 py-12">
          <div className="max-w-7xl mx-auto px-4">
            <p className="text-xs uppercase tracking-widest text-[#FF6A00] mb-2">Área VIP</p>
            <h1 className="font-display text-5xl text-white">OFERTAS EXCLUSIVAS</h1>
            {lead && <p className="text-white/50 mt-2">Olá, {lead.name ?? lead.instagram_username ?? 'Cliente'}! Essas ofertas são só para você.</p>}
          </div>
        </div>

        <div className="max-w-7xl mx-auto px-4 py-12">
          <div className="grid md:grid-cols-3 gap-6 mb-12">
            {MOCK_OFFERS.map(offer => (
              <div key={offer.id} className="border border-white/10 bg-[#0a0a0a] p-6 hover:border-[#FF6A00]/50 transition-colors group">
                <div className="flex items-start justify-between mb-4">
                  <Zap className="text-[#FF6A00]" size={24} />
                  <span className="bg-[#FF6A00] text-black text-xs font-bold px-2 py-1 uppercase tracking-wider">{offer.badge}</span>
                </div>
                <h3 className="font-bold text-white text-lg mb-2">{offer.title}</h3>
                <p className="text-white/50 text-sm mb-4">{offer.desc}</p>
                <p className="text-xs text-white/30 mb-4">Válido até: {offer.expires}</p>
                <Button
                  size="sm"
                  className="w-full"
                  onClick={() => {}}
                  asChild
                >
                  <a href={INSTAGRAM_URL} target="_blank" rel="noopener noreferrer">
                    <Instagram size={14} />
                    Fechar Pedido no Instagram
                  </a>
                </Button>
              </div>
            ))}
          </div>

          <div className="flex gap-4 justify-center">
            <Button asChild variant="outline">
              <Link href="/cupons">
                <Tag size={16} />
                Ver Meus Cupons
              </Link>
            </Button>
            <Button asChild>
              <Link href="/catalogo">Ver Catálogo Completo</Link>
            </Button>
          </div>
        </div>
      </div>
    </div>
  )
}
