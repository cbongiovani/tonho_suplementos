import { NextResponse } from "next/server"
import { z } from "zod"
import { createServiceRoleClient } from "@/lib/supabase/server"
import type { Database } from "@/lib/supabase/types"

type ProductInsert = Database["public"]["Tables"]["products"]["Insert"]
type ProductUpdate = Database["public"]["Tables"]["products"]["Update"]

const ProductSchema = z.object({
  name: z.string().min(1),
  description: z.string().optional(),
  category: z.enum(["whey", "creatina", "pre-treino", "termogenico", "vitaminas"]),
  goals: z.array(z.string()).default([]),
  price: z.number().nonnegative(),
  image_url: z.string().url().optional(),
  highlight: z.enum(["mais_vendido", "promocao", "novo", "nenhum"]).default("nenhum"),
  is_active: z.boolean().default(true),
})

const ProductUpdateSchema = ProductSchema.partial()

function toInsertPayload(input: z.infer<typeof ProductSchema>): ProductInsert {
  return {
    name: input.name,
    category: input.category,
    goals: input.goals ?? [],
    price: input.price,
    highlight: input.highlight ?? "nenhum",
    is_active: input.is_active ?? true,
    // ✅ Supabase espera null, não undefined
    description: input.description ?? null,
    image_url: input.image_url ?? null,
  }
}

function toUpdatePayload(input: z.infer<typeof ProductUpdateSchema>): ProductUpdate {
  // Só inclui campos que vieram, e normaliza undefined->null onde precisa
  const out: ProductUpdate = {}

  if (input.name !== undefined) out.name = input.name
  if (input.category !== undefined) out.category = input.category
  if (input.goals !== undefined) out.goals = input.goals
  if (input.price !== undefined) out.price = input.price
  if (input.highlight !== undefined) out.highlight = input.highlight
  if (input.is_active !== undefined) out.is_active = input.is_active

  if (input.description !== undefined) out.description = input.description ?? null
  if (input.image_url !== undefined) out.image_url = input.image_url ?? null

  return out
}

export async function GET() {
  try {
    const supabase = createServiceRoleClient()

    const { data, error } = await supabase
      .from("products")
      .select("*")
      .order("created_at", { ascending: false })

    if (error) throw error
    return NextResponse.json({ products: data ?? [] })
  } catch (err: any) {
    return NextResponse.json(
      { error: err?.message ?? "Erro ao listar produtos" },
      { status: 500 }
    )
  }
}

export async function POST(req: Request) {
  try {
    const body = await req.json()
    const parsed = ProductSchema.parse(body)

    const supabase = createServiceRoleClient()
    const insertData = toInsertPayload(parsed)

    const { data: product, error } = await supabase
      .from("products")
      .insert(insertData)
      .select("*")
      .single()

    if (error) throw error
    return NextResponse.json({ product })
  } catch (err: any) {
    // Zod => 400
    if (err?.name === "ZodError") {
      return NextResponse.json({ error: "Dados inválidos", details: err.errors }, { status: 400 })
    }
    return NextResponse.json(
      { error: err?.message ?? "Erro ao criar produto" },
      { status: 500 }
    )
  }
}

export async function PATCH(req: Request) {
  try {
    const body = await req.json()

    // Espera { id, ...campos }
    const IdSchema = z.object({ id: z.string().min(1) })
    const { id } = IdSchema.parse(body)

    const parsed = ProductUpdateSchema.parse(body)
    const updateData = toUpdatePayload(parsed)

    // Não permitir update vazio
    if (Object.keys(updateData).length === 0) {
      return NextResponse.json({ error: "Nenhum campo para atualizar" }, { status: 400 })
    }

    const supabase = createServiceRoleClient()

    const { data: product, error } = await supabase
      .from("products")
      .update(updateData)
      .eq("id", id)
      .select("*")
      .single()

    if (error) throw error
    return NextResponse.json({ product })
  } catch (err: any) {
    if (err?.name === "ZodError") {
      return NextResponse.json({ error: "Dados inválidos", details: err.errors }, { status: 400 })
    }
    return NextResponse.json(
      { error: err?.message ?? "Erro ao atualizar produto" },
      { status: 500 }
    )
  }
}

export async function DELETE(req: Request) {
  try {
    const body = await req.json()
    const { id } = z.object({ id: z.string().min(1) }).parse(body)

    const supabase = createServiceRoleClient()

    const { error } = await supabase.from("products").delete().eq("id", id)
    if (error) throw error

    return NextResponse.json({ ok: true })
  } catch (err: any) {
    if (err?.name === "ZodError") {
      return NextResponse.json({ error: "Dados inválidos", details: err.errors }, { status: 400 })
    }
    return NextResponse.json(
      { error: err?.message ?? "Erro ao remover produto" },
      { status: 500 }
    )
  }
}
