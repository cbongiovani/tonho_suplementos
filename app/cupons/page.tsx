import { Header } from '@/components/domain/Header'
import { createServerSupabaseClient } from '@/lib/supabase/server'
import { redirect } from 'next/navigation'
import { Button } from '@/components/ui/button'
import { INSTAGRAM_URL } from '@/lib/utils'
import { Tag, Copy, Instagram } from 'lucide-react'

const MOCK_CUPONS = [
  { code: 'BOAS-VINDAS10', desc: '10% de desconto no primeiro pedido', expires: '31/12/2024', used: false },
  { code: 'FIEL15', desc: '15% de desconto para clientes recorrentes', expires: '31/01/2025', used: false },
  { code: 'INSTA20', desc: '20% OFF exclusivo via Instagram', expires: '31/12/2024', used: true },
]

export default async function CuponsPage() {
  const supabase = createServerSupabaseClient()
  const { data: { session } } = await supabase.auth.getSession()
  if (!session) redirect('/?login=required')

  return (
    <div className="min-h-screen bg-black text-white">
      <Header />
      <div className="pt-16">
        <div className="bg-[#0a0a0a] border-b border-white/10 py-12">
          <div className="max-w-7xl mx-auto px-4">
            <p className="text-xs uppercase tracking-widest text-[#FF6A00] mb-2">Área VIP</p>
            <h1 className="font-display text-5xl text-white">MEUS CUPONS</h1>
          </div>
        </div>
        <div className="max-w-2xl mx-auto px-4 py-12 space-y-4">
          {MOCK_CUPONS.map(c => (
            <div key={c.code} className={`border p-5 ${c.used ? 'border-white/10 opacity-50' : 'border-[#FF6A00]/30 bg-[#FF6A00]/5'}`}>
              <div className="flex items-start justify-between gap-4">
                <div className="flex items-center gap-3">
                  <Tag className={c.used ? 'text-white/30' : 'text-[#FF6A00]'} size={20} />
                  <div>
                    <p className="font-display text-xl tracking-widest text-white">{c.code}</p>
                    <p className="text-sm text-white/50">{c.desc}</p>
                    <p className="text-xs text-white/30 mt-1">Válido até: {c.expires}</p>
                  </div>
                </div>
                {!c.used && (
                  <button
                    onClick={() => navigator.clipboard.writeText(c.code)}
                    className="text-white/50 hover:text-[#FF6A00] transition-colors flex-shrink-0"
                    title="Copiar cupom"
                  >
                    <Copy size={16} />
                  </button>
                )}
                {c.used && <span className="text-xs text-white/30 uppercase tracking-wider">Utilizado</span>}
              </div>
            </div>
          ))}
          <div className="pt-4">
            <Button asChild className="w-full">
              <a href={INSTAGRAM_URL} target="_blank" rel="noopener noreferrer">
                <Instagram size={16} />
                Usar Cupom no Instagram
              </a>
            </Button>
          </div>
        </div>
      </div>
    </div>
  )
}
