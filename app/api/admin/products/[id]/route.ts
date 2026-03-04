import { NextResponse } from "next/server"
import { createServiceRoleClient } from "@/lib/supabase/server"
import type { TablesUpdate } from "@/lib/supabase/types"

export async function PATCH(
  req: Request,
  { params }: { params: { id: string } }
) {
  try {
    const supabase = createServiceRoleClient()

    // ✅ tipa o body como update da tabela products
    const body = (await req.json()) as TablesUpdate<"products">

    // (opcional, mas recomendado) remove campos que não deveriam ser atualizados
    // @ts-expect-error - só pra garantir
    delete (body as any).id
    // @ts-expect-error - só pra garantir
    delete (body as any).created_at

    const { data: product, error } = await supabase
      .from("products")
      .update(body)
      .eq("id", params.id)
      .select("*")
      .single()

    if (error) throw error

    return NextResponse.json({ product })
  } catch (err: any) {
    return NextResponse.json(
      { error: err?.message ?? "Erro ao atualizar produto" },
      { status: 400 }
    )
  }
}
