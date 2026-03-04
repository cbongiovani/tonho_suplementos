import { NextRequest, NextResponse } from 'next/server'
import { createServiceRoleClient } from '@/lib/supabase/server'
import { z } from 'zod'

const ProductSchema = z.object({
  name: z.string().min(1),
  description: z.string().optional(),
  category: z.enum(['whey', 'creatina', 'pre-treino', 'termogenico', 'vitaminas']),
  goals: z.array(z.string()).default([]),
  price: z.number().positive(),
  image_url: z.string().optional().nullable(),
  highlight: z.enum(['mais_vendido', 'promocao', 'novo', 'nenhum']).default('nenhum'),
  is_active: z.boolean().default(true),
})

export async function POST(req: NextRequest) {
  try {
    const body = await req.json()
    const data = ProductSchema.parse(body)

const insertData = {
  ...data,
  description: data.description ?? null,
  image_url: data.image_url ?? null,
}

const supabase = createServiceRoleClient()
const { data: product, error } = await supabase
  .from("products")
  .insert(insertData)
  .select("*")
  .single()
    if (error) throw error
    return NextResponse.json({ product })
  } catch (err) {
    return NextResponse.json({ error: String(err) }, { status: 500 })
  }
}
