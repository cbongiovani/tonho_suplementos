import CampaignsClient from "@/components/domain/admin/CampaignsClient"
import { createServiceRoleClient } from "@/lib/supabase/server"
import type { Database, Json } from "@/lib/supabase/types"

type Campaign = Database["public"]["Tables"]["campaigns"]["Row"]
type Lead = Database["public"]["Tables"]["leads"]["Row"]

export default async function CampanhasPage() {
  const supabase = createServiceRoleClient()

  const { data: campaignsData, error: campaignsError } = await supabase
    .from("campaigns")
    .select("*")
    .order("created_at", { ascending: false })

  if (campaignsError) {
    // Em produção você pode renderizar um estado de erro
    console.error("Erro ao buscar campanhas:", campaignsError.message)
  }

  const { data: leadsData, error: leadsError } = await supabase
    .from("leads")
    .select("*")
    .order("created_at", { ascending: false })

  if (leadsError) {
    console.error("Erro ao buscar leads:", leadsError.message)
  }

  // ✅ garante tipo correto mesmo quando vier null
  const campaigns: Campaign[] = (campaignsData ?? []) as Campaign[]
  const leads: Lead[] = (leadsData ?? []) as Lead[]

  return (
    <div className="min-h-screen bg-black text-white p-6">
      <div className="max-w-5xl mx-auto">
        <h1 className="text-2xl font-bold uppercase tracking-widest">Campanhas</h1>
        <p className="text-white/40 text-sm mt-1">
          Crie e gerencie campanhas de comunicação
        </p>
      </div>

      <div className="max-w-5xl mx-auto mt-6">
        <CampaignsClient campaigns={campaigns} leads={leads} />
      </div>
    </div>
  )
}
