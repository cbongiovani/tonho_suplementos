import { NextRequest, NextResponse } from 'next/server'
import { createServiceRoleClient } from '@/lib/supabase/server'
import { z } from 'zod'

const LeadSchema = z.object({
  name: z.string().optional(),
  email: z.string().email().optional().or(z.literal('')),
  whatsapp: z.string().min(8),
  instagram_username: z.string().optional(),
  source: z.string().default('landing'),
  consent: z.boolean(),
})

export async function POST(req: NextRequest) {
  try {
    const body = await req.json()
    const data = LeadSchema.parse(body)

    if (!data.consent) {
      return NextResponse.json({ error: 'Consentimento LGPD obrigatório' }, { status: 400 })
    }

    const supabase = createServiceRoleClient()

    // Check if lead already exists by whatsapp
    const { data: existing } = await supabase
      .from('leads')
      .select('id')
      .eq('whatsapp', data.whatsapp)
      .single()

    if (existing) {
      return NextResponse.json({ lead: existing, isNew: false })
    }

    const { data: lead, error } = await supabase
      .from('leads')
      .insert({
        name: data.name || null,
        email: data.email || null,
        whatsapp: data.whatsapp,
        instagram_username: data.instagram_username || null,
        source: data.source,
        consentimento_lgpd: true,
        consentimento_lgpd_at: new Date().toISOString(),
        tags: [],
      })
      .select()
      .single()

    if (error) throw error
    return NextResponse.json({ lead, isNew: true })
  } catch (err) {
    console.error(err)
    return NextResponse.json({ error: 'Erro interno' }, { status: 500 })
  }
}
