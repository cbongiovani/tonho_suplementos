import { Header } from '@/components/domain/Header'
import { CatalogClient } from '@/components/domain/CatalogClient'
import { createServerSupabaseClient } from '@/lib/supabase/server'

export const revalidate = 60

export default async function CatalogPage() {
  const supabase = createServerSupabaseClient()
  const { data: products } = await supabase
    .from('products')
    .select('*')
    .eq('is_active', true)
    .order('created_at', { ascending: false })

  return (
    <div className="min-h-screen bg-black text-white">
      <Header />
      <div className="pt-16">
        <div className="bg-[#0a0a0a] border-b border-white/10 py-12">
          <div className="max-w-7xl mx-auto px-4">
            <p className="text-xs uppercase tracking-widest text-[#FF6A00] mb-2">Catálogo Completo</p>
            <h1 className="font-display text-5xl text-white">PRODUTOS</h1>
          </div>
        </div>
        <CatalogClient products={products ?? []} />
      </div>
    </div>
  )
}
