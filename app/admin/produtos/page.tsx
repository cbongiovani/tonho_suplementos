import { createServiceRoleClient } from '@/lib/supabase/server'
import { ProductsClient } from '@/components/domain/admin/ProductsClient'

export default async function AdminProductsPage() {
  const supabase = createServiceRoleClient()
  const { data: products } = await supabase.from('products').select('*').order('created_at', { ascending: false })

  return (
    <div className="p-8">
      <div className="mb-8">
        <h1 className="font-display text-4xl text-white">PRODUTOS</h1>
        <p className="text-white/40 text-sm mt-1">Gerencie o catálogo de produtos</p>
      </div>
      <ProductsClient initialProducts={products ?? []} />
    </div>
  )
}
