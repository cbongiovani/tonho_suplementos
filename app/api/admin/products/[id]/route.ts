import { NextRequest, NextResponse } from 'next/server'
import { createServiceRoleClient } from '@/lib/supabase/server'
import type { Database } from '@/lib/supabase/types'

type ProductUpdate = Database['public']['Tables']['products']['Update']
type ProductRow = Database['public']['Tables']['products']['Row']

export async function PATCH(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const supabase = createServiceRoleClient()
    const body = (await req.json()) as ProductUpdate

    // opcional: se quiser evitar update vazio
    if (!body || Object.keys(body).length === 0) {
      return NextResponse.json({ error: 'Body vazio' }, { status: 400 })
    }

    const { data: product, error } = await supabase
      .from('products')
      .update(body)
      .eq('id', params.id)
      .select('*')
      .single()

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 400 })
    }

    return NextResponse.json({ product: product as ProductRow })
  } catch (err: any) {
    return NextResponse.json(
      { error: err?.message ?? 'Erro inesperado' },
      { status: 500 }
    )
  }
}
