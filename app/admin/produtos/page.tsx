import { createServiceRoleClient } from "@/lib/supabase/server"
import type { Database } from "@/lib/supabase/types"
import { ProductsClient } from "@/components/domain/admin/ProductsClient" // se for export nomeado
// se for default, use: import ProductsClient from "@/components/domain/admin/ProductsClient"

type ProductRow = Database["public"]["Tables"]["products"]["Row"]

export default async function ProdutosPage() {
  const supabase = createServiceRoleClient()

  const { data, error } = await supabase
    .from("products")
    .select("*")
    .order("created_at", { ascending: false })

  if (error) {
    console.error("Erro ao buscar products:", error.message)
  }

  const products: ProductRow[] = (data ?? []) as ProductRow[]

  return (
    <div className="min-h-screen bg-black text-white p-6">
      <div className="max-w-5xl mx-auto">
        <h1 className="text-2xl font-bold uppercase tracking-widest">Produtos</h1>
        <p className="text-white/40 text-sm mt-1">Gerencie o catálogo de produtos</p>
      </div>

      <div className="max-w-5xl mx-auto mt-6">
        <ProductsClient initialProducts={products} />
      </div>
    </div>
  )
}
