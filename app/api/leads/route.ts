import { NextResponse } from "next/server"
import { z } from "zod"
import { createServiceRoleClient } from "@/lib/supabase/server"
import type { Database } from "@/lib/supabase/types"

type LeadInsert = Database["public"]["Tables"]["leads"]["Insert"]

const LeadSchema = z.object({
  name: z.string().min(1).optional().or(z.literal("")),
  email: z.string().email().optional().or(z.literal("")),
  whatsapp: z.string().min(8),
  instagram_username: z.string().optional().or(z.literal("")),
  source: z.string().min(1).default("instagram"),
  tags: z.array(z.string()).optional().default([]),
  consentimento_lgpd: z.boolean().default(true),
})

export async function POST(req: Request) {
  try {
    const body = await req.json()
    const data = LeadSchema.parse(body)

    const supabase = createServiceRoleClient()

    const nowIso = new Date().toISOString()

    // ✅ payload 100% alinhado com o type Insert do Supabase
    const payload: LeadInsert = {
      auth_user_id: null,
      name: data.name ? data.name : null,
      email: data.email ? data.email : null,
      whatsapp: data.whatsapp,
      instagram_username: data.instagram_username ? data.instagram_username : null,
      instagram_id: null,
      tags: (data.tags ?? []) as string[],
      source: data.source,
      consentimento_lgpd: data.consentimento_lgpd ?? true,
      consentimento_lgpd_at: (data.consentimento_lgpd ?? true) ? nowIso : null,
      last_access_at: null,
    }

    const { data: lead, error } = await supabase
      .from("leads")
      .insert(payload)
      .select("*")
      .single()

    if (error) throw error

    return NextResponse.json({ lead })
  } catch (err: any) {
    if (err?.name === "ZodError") {
      return NextResponse.json(
        { error: "Dados inválidos", details: err.errors },
        { status: 400 }
      )
    }

    return NextResponse.json(
      { error: err?.message ?? "Erro ao criar lead" },
      { status: 500 }
    )
  }
}
