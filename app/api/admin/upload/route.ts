import { NextRequest, NextResponse } from 'next/server'
import { createServiceRoleClient } from '@/lib/supabase/server'

export async function POST(req: NextRequest) {
  try {
    const formData = await req.formData()
    const file = formData.get('file') as File
    const folder = (formData.get('folder') as string) || 'assets'

    if (!file) return NextResponse.json({ error: 'Nenhum arquivo' }, { status: 400 })

    const supabase = createServiceRoleClient()
    const ext = file.name.split('.').pop()
    const filename = `${folder}/${Date.now()}-${Math.random().toString(36).slice(2)}.${ext}`
    const buffer = await file.arrayBuffer()

    const { data, error } = await supabase.storage
      .from('assets')
      .upload(filename, buffer, {
        contentType: file.type,
        upsert: false,
      })

    if (error) throw error

    const { data: { publicUrl } } = supabase.storage.from('assets').getPublicUrl(data.path)
    return NextResponse.json({ url: publicUrl })
  } catch (err) {
    console.error(err)
    return NextResponse.json({ error: 'Erro no upload' }, { status: 500 })
  }
}
