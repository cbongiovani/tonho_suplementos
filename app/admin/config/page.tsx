import { createServiceRoleClient } from '@/lib/supabase/server'
import { ConfigClient } from '@/components/domain/admin/ConfigClient'

export default async function AdminConfigPage() {
  const supabase = createServiceRoleClient()
  const { data: config } = await supabase.from('site_config').select('*').eq('id', 1).single()

  return (
    <div className="p-8">
      <div className="mb-8">
        <h1 className="font-display text-4xl text-white">CONFIGURAÇÕES</h1>
        <p className="text-white/40 text-sm mt-1">Personalize o site e links</p>
      </div>
      <ConfigClient initialConfig={config ?? { id: 1, logo_url: null, instagram_url: 'https://www.instagram.com/tonhosuplementos', whatsapp_url: null, updated_at: '' }} />
    </div>
  )
}
