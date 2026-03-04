'use client'
import { useState, useMemo } from 'react'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/primitives'
import { formatCurrency, INSTAGRAM_URL } from '@/lib/utils'
import type { Database } from '@/lib/supabase/types'
import { ShoppingCart, Instagram, Copy, X, Check, SlidersHorizontal } from 'lucide-react'
import Image from 'next/image'

type Product = Database['public']['Tables']['products']['Row']

const GOALS = ['hipertrofia', 'emagrecimento', 'energia', 'saúde']
const CATEGORIES = ['whey', 'creatina', 'pre-treino', 'termogenico', 'vitaminas']

const HIGHLIGHT_COLORS: Record<string, string> = {
  mais_vendido: 'bg-[#FF6A00] text-black',
  promocao: 'bg-green-500 text-black',
  novo: 'bg-blue-500 text-white',
  nenhum: '',
}

const HIGHLIGHT_LABELS: Record<string, string> = {
  mais_vendido: 'Mais Vendido',
  promocao: 'Promoção',
  novo: 'Novo',
  nenhum: '',
}

export function CatalogClient({ products }: { products: Product[] }) {
  const [goalFilter, setGoalFilter] = useState<string | null>(null)
  const [catFilter, setCatFilter] = useState<string | null>(null)
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null)
  const [copied, setCopied] = useState(false)
  const [showFilters, setShowFilters] = useState(false)

  const filtered = useMemo(() => products.filter(p => {
    if (goalFilter && !p.goals.includes(goalFilter)) return false
    if (catFilter && p.category !== catFilter) return false
    return true
  }), [products, goalFilter, catFilter])

  function copyMessage(product: Product) {
    const msg = `Olá Tonho! Tenho interesse no produto: *${product.name}* (R$ ${product.price.toFixed(2).replace('.', ',')}). Pode me passar mais informações e disponibilidade?`
    navigator.clipboard.writeText(msg)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  function instagramMessage(product: Product) {
    const msg = encodeURIComponent(`Oi! Tenho interesse no ${product.name}. Pode me ajudar?`)
    window.open(`${INSTAGRAM_URL}?igsh=message=${msg}`, '_blank')
  }

  return (
    <div className="max-w-7xl mx-auto px-4 py-10">
      {/* Filters */}
      <div className="mb-8">
        <button
          className="md:hidden flex items-center gap-2 text-sm text-white/60 mb-4 border border-white/10 px-3 py-2"
          onClick={() => setShowFilters(!showFilters)}
        >
          <SlidersHorizontal size={14} /> Filtros
        </button>

        <div className={`${showFilters ? 'block' : 'hidden'} md:block space-y-4`}>
          <div>
            <p className="text-xs uppercase tracking-widest text-white/40 mb-2">Objetivo</p>
            <div className="flex flex-wrap gap-2">
              <button onClick={() => setGoalFilter(null)} className={`px-3 py-1.5 text-xs uppercase tracking-wider border transition-colors ${!goalFilter ? 'bg-[#FF6A00] border-[#FF6A00] text-black font-bold' : 'border-white/20 text-white/60 hover:border-white/40'}`}>Todos</button>
              {GOALS.map(g => (
                <button key={g} onClick={() => setGoalFilter(g === goalFilter ? null : g)} className={`px-3 py-1.5 text-xs uppercase tracking-wider border transition-colors ${goalFilter === g ? 'bg-[#FF6A00] border-[#FF6A00] text-black font-bold' : 'border-white/20 text-white/60 hover:border-white/40'}`}>{g}</button>
              ))}
            </div>
          </div>
          <div>
            <p className="text-xs uppercase tracking-widest text-white/40 mb-2">Categoria</p>
            <div className="flex flex-wrap gap-2">
              <button onClick={() => setCatFilter(null)} className={`px-3 py-1.5 text-xs uppercase tracking-wider border transition-colors ${!catFilter ? 'bg-white/10 border-white/30 text-white font-bold' : 'border-white/20 text-white/60 hover:border-white/40'}`}>Todas</button>
              {CATEGORIES.map(c => (
                <button key={c} onClick={() => setCatFilter(c === catFilter ? null : c)} className={`px-3 py-1.5 text-xs uppercase tracking-wider border transition-colors ${catFilter === c ? 'bg-white/10 border-white/30 text-white font-bold' : 'border-white/20 text-white/60 hover:border-white/40'}`}>{c}</button>
              ))}
            </div>
          </div>
        </div>
        <p className="text-xs text-white/30 mt-4">{filtered.length} produto(s) encontrado(s)</p>
      </div>

      {/* Grid */}
      {filtered.length === 0 ? (
        <div className="text-center py-20 text-white/30">
          <p className="text-lg">Nenhum produto encontrado com esses filtros.</p>
        </div>
      ) : (
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
          {filtered.map(product => (
            <div key={product.id} className="bg-[#0a0a0a] border border-white/10 hover:border-[#FF6A00]/50 transition-all duration-200 group cursor-pointer flex flex-col" onClick={() => setSelectedProduct(product)}>
              {/* Image */}
              <div className="relative aspect-square bg-[#1a1a1a] overflow-hidden">
                {product.image_url ? (
                  <Image src={product.image_url} alt={product.name} fill className="object-cover group-hover:scale-105 transition-transform duration-300" />
                ) : (
                  <div className="w-full h-full flex items-center justify-center text-white/10 font-display text-4xl">
                    {product.name.charAt(0)}
                  </div>
                )}
                {product.highlight !== 'nenhum' && (
                  <Badge className={`absolute top-2 left-2 ${HIGHLIGHT_COLORS[product.highlight]}`}>
                    {HIGHLIGHT_LABELS[product.highlight]}
                  </Badge>
                )}
              </div>
              {/* Info */}
              <div className="p-4 flex flex-col flex-1">
                <p className="text-xs text-white/40 uppercase tracking-wider mb-1">{product.category}</p>
                <h3 className="text-sm font-bold text-white mb-1 line-clamp-2 flex-1">{product.name}</h3>
                <p className="text-xs text-white/50 mb-3 line-clamp-2">{product.description}</p>
                <div className="flex items-center justify-between mt-auto">
                  <span className="text-lg font-bold text-[#FF6A00]">{formatCurrency(product.price)}</span>
                  <button className="bg-[#FF6A00] text-black px-3 py-1.5 text-xs font-bold uppercase tracking-wider hover:bg-orange-400 transition-colors flex items-center gap-1">
                    <ShoppingCart size={12} /> Comprar
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Product Modal */}
      {selectedProduct && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm p-4" onClick={() => setSelectedProduct(null)}>
          <div className="bg-[#0a0a0a] border border-white/20 max-w-lg w-full max-h-[90vh] overflow-y-auto" onClick={e => e.stopPropagation()}>
            {/* Modal Header */}
            <div className="flex items-center justify-between p-4 border-b border-white/10">
              <p className="text-xs uppercase tracking-widest text-[#FF6A00]">Produto</p>
              <button onClick={() => setSelectedProduct(null)} className="text-white/50 hover:text-white">
                <X size={20} />
              </button>
            </div>

            {/* Content */}
            <div className="p-6 space-y-4">
              {selectedProduct.image_url && (
                <div className="relative aspect-video bg-[#1a1a1a]">
                  <Image src={selectedProduct.image_url} alt={selectedProduct.name} fill className="object-contain" />
                </div>
              )}
              <div>
                <Badge className="bg-[#FF6A00]/20 text-[#FF6A00] mb-2">{selectedProduct.category}</Badge>
                <h2 className="text-xl font-bold text-white">{selectedProduct.name}</h2>
                <p className="text-white/50 text-sm mt-2">{selectedProduct.description}</p>
              </div>

              {selectedProduct.goals.length > 0 && (
                <div className="flex flex-wrap gap-1">
                  {selectedProduct.goals.map(g => (
                    <span key={g} className="px-2 py-1 text-xs border border-white/20 text-white/50 uppercase tracking-wider">{g}</span>
                  ))}
                </div>
              )}

              <div className="text-3xl font-bold text-[#FF6A00]">
                {formatCurrency(selectedProduct.price)}
              </div>

              {/* CTAs */}
              <div className="space-y-3 pt-2">
                <Button
                  className="w-full"
                  onClick={() => {
                    const msg = encodeURIComponent(`Olá! Quero comprar: *${selectedProduct.name}* - ${formatCurrency(selectedProduct.price)}`)
                    window.open(`${INSTAGRAM_URL}?text=${msg}`, '_blank')
                  }}
                >
                  <Instagram size={16} />
                  Chamar no Instagram
                </Button>
                <Button
                  variant="outline"
                  className="w-full"
                  onClick={() => copyMessage(selectedProduct)}
                >
                  {copied ? <><Check size={16} /> Copiado!</> : <><Copy size={16} /> Copiar Mensagem</>}
                </Button>
              </div>

              <p className="text-xs text-white/30 text-center">
                Entre em contato via Instagram para finalizar o pedido.
              </p>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
