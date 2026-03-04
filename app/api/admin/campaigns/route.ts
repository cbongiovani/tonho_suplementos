import { NextRequest, NextResponse } from 'next/server'
import { createServiceRoleClient } from '@/lib/supabase/server'

export async function POST(req: NextRequest) {
  try {
    const body = await req.json()
    const supabase = createServiceRoleClient()
    const { data: campaign, error } = await supabase.from('campaigns').insert(body).select().single()
    if (error) throw error
    return NextResponse.json({ campaign })
  } catch (err) {
    return NextResponse.json({ error: String(err) }, { status: 500 })
  }
}
