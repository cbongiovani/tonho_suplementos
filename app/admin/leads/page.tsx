import { createServiceRoleClient } from '@/lib/supabase/server'
import { LeadsClient } from '@/components/domain/admin/LeadsClient'

export default async function AdminLeadsPage({
  searchParams,
}: {
  searchParams: { q?: string; tag?: string; source?: string; page?: string }
}) {
  const supabase = createServiceRoleClient()

  let query = supabase.from('leads').select('*').order('created_at', { ascending: false })

  if (searchParams.q) {
    query = query.or(`name.ilike.%${searchParams.q}%,email.ilike.%${searchParams.q}%,instagram_username.ilike.%${searchParams.q}%,whatsapp.ilike.%${searchParams.q}%`)
  }
  if (searchParams.tag) {
    query = query.contains('tags', [searchParams.tag])
  }
  if (searchParams.source) {
    query = query.eq('source', searchParams.source)
  }

  const { data: leads } = await query.limit(100)

  return (
    <div className="p-8">
      <div className="mb-8">
        <h1 className="font-display text-4xl text-white">LEADS (CRM)</h1>
        <p className="text-white/40 text-sm mt-1">{leads?.length ?? 0} leads encontrados</p>
      </div>
      <LeadsClient leads={leads ?? []} />
    </div>
  )
}
