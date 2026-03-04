import { Header } from '@/components/domain/Header'
import { LeadForm } from '@/components/domain/LeadForm'
import { Button } from '@/components/ui/button'
import { createServerSupabaseClient } from '@/lib/supabase/server'
import { getOrCreateLead } from '@/lib/auth'
import { INSTAGRAM_URL } from '@/lib/utils'
import Link from 'next/link'
import { Instagram, Star, Zap, Shield, TrendingUp, ArrowRight } from 'lucide-react'

export default async function LandingPage() {
  const supabase = createServerSupabaseClient()
  const { data: { session } } = await supabase.auth.getSession()

  let existingLead = null
  if (session?.user?.id) {
    const { lead } = await getOrCreateLead(session.user.id)
    existingLead = lead
  }

  return (
    <div className="min-h-screen bg-black text-white">
      <Header />

      {/* HERO */}
      <section className="relative min-h-screen flex items-center overflow-hidden pt-16">
        {/* Background */}
        <div className="absolute inset-0 bg-gradient-to-br from-black via-[#0a0a0a] to-black" />
        <div className="absolute inset-0 opacity-5" style={{
          backgroundImage: 'repeating-linear-gradient(0deg, transparent, transparent 49px, #FF6A00 50px), repeating-linear-gradient(90deg, transparent, transparent 49px, #FF6A00 50px)',
          backgroundSize: '50px 50px'
        }} />
        {/* Orange glow */}
        <div className="absolute top-1/2 right-1/3 w-96 h-96 bg-[#FF6A00] rounded-full opacity-5 blur-3xl -translate-y-1/2" />

        <div className="relative max-w-7xl mx-auto px-4 py-20 grid lg:grid-cols-2 gap-12 items-center">
          {/* Left */}
          <div className="space-y-8">
            <div className="inline-flex items-center gap-2 border border-[#FF6A00]/30 bg-[#FF6A00]/10 px-4 py-2">
              <Zap size={14} className="text-[#FF6A00]" />
              <span className="text-xs uppercase tracking-widest text-[#FF6A00] font-bold">Suplementos originais</span>
            </div>

            <h1 className="font-display text-6xl md:text-8xl text-white leading-none">
              SEU<br />
              <span className="text-[#FF6A00]">RESULTADO</span><br />
              COMEÇA<br />
              AGORA.
            </h1>

            <p className="text-lg text-white/60 max-w-md leading-relaxed">
              Suplementos originais para quem leva treino a sério. Qualidade garantida, entrega rápida, preço justo.
            </p>

            <div className="flex flex-wrap gap-4">
              <Button asChild size="lg">
                <Link href="/catalogo">
                  Ver Produtos <ArrowRight size={18} />
                </Link>
              </Button>
              <Button variant="outline" size="lg" asChild>
                <Link href="#cadastro">Ganhar Cupom</Link>
              </Button>
              <Button variant="ghost" size="lg" asChild>
                <a href={INSTAGRAM_URL} target="_blank" rel="noopener noreferrer" className="flex items-center gap-2">
                  <Instagram size={18} />
                  Instagram
                </a>
              </Button>
            </div>

            {/* Social proof */}
            <div className="flex items-center gap-6 pt-4 border-t border-white/10">
              <div>
                <p className="text-2xl font-bold text-[#FF6A00]">5k+</p>
                <p className="text-xs text-white/40 uppercase tracking-wider">Clientes</p>
              </div>
              <div className="w-px h-10 bg-white/10" />
              <div>
                <p className="text-2xl font-bold text-[#FF6A00]">4.9★</p>
                <p className="text-xs text-white/40 uppercase tracking-wider">Avaliação</p>
              </div>
              <div className="w-px h-10 bg-white/10" />
              <div>
                <p className="text-2xl font-bold text-[#FF6A00]">100%</p>
                <p className="text-xs text-white/40 uppercase tracking-wider">Original</p>
              </div>
            </div>
          </div>

          {/* Right — Lead Form */}
          <div id="cadastro" className="w-full max-w-md mx-auto lg:mx-0">
            <LeadForm existingLead={existingLead} userId={session?.user?.id} />
          </div>
        </div>
      </section>

      {/* FEATURES */}
      <section className="py-20 border-t border-white/10">
        <div className="max-w-7xl mx-auto px-4">
          <div className="grid md:grid-cols-3 gap-8">
            {[
              { icon: Shield, title: 'Garantia de Originalidade', desc: 'Todos produtos com nota fiscal e certificado de autenticidade.' },
              { icon: Zap, title: 'Entrega Rápida', desc: 'Despacho em até 24h. Rastreamento em tempo real.' },
              { icon: TrendingUp, title: 'Resultados Comprovados', desc: 'Mais de 5.000 clientes transformados. Você é o próximo.' },
            ].map(({ icon: Icon, title, desc }) => (
              <div key={title} className="border border-white/10 p-6 hover:border-[#FF6A00]/50 transition-colors group">
                <Icon className="mb-4 text-[#FF6A00]" size={28} />
                <h3 className="font-bold text-white mb-2">{title}</h3>
                <p className="text-sm text-white/50">{desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* INSTAGRAM SECTION */}
      <section className="py-20 bg-[#0a0a0a] border-t border-white/10">
        <div className="max-w-7xl mx-auto px-4 text-center">
          <p className="text-xs uppercase tracking-widest text-[#FF6A00] mb-4">No Instagram</p>
          <h2 className="font-display text-4xl md:text-5xl text-white mb-4">
            @TONHOSUPLEMENTOS
          </h2>
          <p className="text-white/50 mb-10 max-w-md mx-auto">Acompanhe dicas de treino, nutrição e ofertas exclusivas direto no Instagram.</p>

          {/* Instagram grid placeholder */}
          <div className="grid grid-cols-3 md:grid-cols-6 gap-2 mb-8 max-w-2xl mx-auto">
            {Array.from({ length: 6 }).map((_, i) => (
              <div key={i} className="aspect-square bg-[#1a1a1a] border border-white/10 hover:border-[#FF6A00] transition-colors cursor-pointer" />
            ))}
          </div>

          <Button asChild size="lg">
            <a href={INSTAGRAM_URL} target="_blank" rel="noopener noreferrer">
              <Instagram size={18} />
              Seguir @tonhosuplementos
            </a>
          </Button>
        </div>
      </section>

      {/* SOCIAL PROOF */}
      <section className="py-20 border-t border-white/10">
        <div className="max-w-7xl mx-auto px-4">
          <div className="text-center mb-12">
            <p className="text-xs uppercase tracking-widest text-[#FF6A00] mb-2">Depoimentos</p>
            <h2 className="font-display text-4xl text-white">QUEM JÁ TRANSFORMOU</h2>
          </div>
          <div className="grid md:grid-cols-3 gap-6">
            {[
              { name: 'João S.', text: 'Ganhei 8kg de massa em 3 meses usando os produtos do Tonho. Qualidade demais!', stars: 5 },
              { name: 'Ana P.', text: 'Perdi 12kg com o termogênico e a dieta. Produto original, resultado real.', stars: 5 },
              { name: 'Carlos M.', text: 'Atendimento no Instagram é top. Respondeu rápido e o produto chegou em 2 dias.', stars: 5 },
            ].map(({ name, text, stars }) => (
              <div key={name} className="border border-white/10 p-6 bg-[#0a0a0a]">
                <div className="flex mb-3">
                  {Array.from({ length: stars }).map((_, i) => (
                    <Star key={i} size={14} className="text-[#FF6A00] fill-[#FF6A00]" />
                  ))}
                </div>
                <p className="text-white/70 text-sm mb-4 italic">&ldquo;{text}&rdquo;</p>
                <p className="text-white font-bold text-sm">{name}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA FINAL */}
      <section className="py-20 bg-[#FF6A00]">
        <div className="max-w-3xl mx-auto px-4 text-center">
          <h2 className="font-display text-5xl md:text-6xl text-black mb-4">
            PRONTO PARA TRANSFORMAR?
          </h2>
          <p className="text-black/70 text-lg mb-8">
            Cadastre-se agora e ganhe um cupom de desconto exclusivo no seu primeiro pedido.
          </p>
          <div className="flex flex-wrap gap-4 justify-center">
            <Button variant="secondary" size="lg" asChild>
              <Link href="/catalogo">Ver Produtos</Link>
            </Button>
            <Button size="lg" className="bg-black text-white hover:bg-gray-900" asChild>
              <a href={INSTAGRAM_URL} target="_blank" rel="noopener noreferrer">
                <Instagram size={18} />
                Falar no Instagram
              </a>
            </Button>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-white/10 py-8 text-center text-white/30 text-sm">
        <p>© 2024 Tonho Suplementos. Todos os direitos reservados.</p>
        <p className="mt-1">
          <a href={INSTAGRAM_URL} target="_blank" rel="noopener noreferrer" className="hover:text-[#FF6A00] transition-colors">
            @tonhosuplementos
          </a>
        </p>
      </footer>
    </div>
  )
}
