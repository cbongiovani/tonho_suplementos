import { createServiceRoleClient } from '@/lib/supabase/server'
import { CampaignsClient } from '@/components/domain/admin/CampaignsClient'

export default async function CampaignsPage() {
  const supabase = createServiceRoleClient()
  const { data: campaigns } = await supabase
    .from('campaigns')
    .select('*')
    .order('created_at', { ascending: false })

  const { data: leads } = await supabase.from('leads').select('id,name,whatsapp,instagram_username,tags,source')

  return (
    <div className="p-8">
      <div className="mb-8">
        <h1 className="font-display text-4xl text-white">CAMPANHAS</h1>
        <p className="text-white/40 text-sm mt-1">Crie e gerencie campanhas de comunicação</p>
      </div>
      <CampaignsClient campaigns={campaigns ?? []} leads={leads ?? []} />
    </div>
  )
}
