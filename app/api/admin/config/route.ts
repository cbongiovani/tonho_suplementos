import { NextRequest, NextResponse } from 'next/server'
import { createServiceRoleClient } from '@/lib/supabase/server'

export async function PUT(req: NextRequest) {
  try {
    const body = await req.json()
    const supabase = createServiceRoleClient()
    const { data, error } = await supabase
      .from('site_config')
      .upsert({ id: 1, ...body, updated_at: new Date().toISOString() })
      .select()
      .single()
    if (error) throw error
    return NextResponse.json({ config: data })
  } catch (err) {
    return NextResponse.json({ error: String(err) }, { status: 500 })
  }
}
