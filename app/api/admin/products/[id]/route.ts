import { NextResponse } from 'next/server'
import { createServiceRoleClient } from '@/lib/supabase/server'

type Params = { id: string }

export async function PATCH(req: Request, { params }: { params: Params }) {
  try {
    const body = (await req.json()) as Record<string, unknown>
    const supabase = createServiceRoleClient()

    const { data: product, error } = await supabase
      .from('products')
      // ✅ cast para não virar "never" quando types não conhecem a tabela
      .update(body as any)
      .eq('id', params.id as any)
      .select('*')
      .single()

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 400 })
    }

    return NextResponse.json({ product })
  } catch (err: any) {
    return NextResponse.json(
      { error: err?.message ?? 'Unexpected error' },
      { status: 500 }
    )
  }
}
