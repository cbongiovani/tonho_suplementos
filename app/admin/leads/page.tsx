import { createServiceRoleClient } from "@/lib/supabase/server"
import type { Database } from "@/lib/supabase/types"
import { LeadsClient } from "@/components/domain/admin/LeadsClient" // se for export nomeado
// se for default, use: import LeadsClient from "@/components/domain/admin/LeadsClient"

type LeadRow = Database["public"]["Tables"]["leads"]["Row"]

export default async function LeadsPage() {
  const supabase = createServiceRoleClient()

  const { data, error } = await supabase
    .from("leads")
    .select("*")
    .order("created_at", { ascending: false })

  if (error) {
    console.error("Erro ao buscar leads:", error.message)
  }

  const leads: LeadRow[] = (data ?? []) as LeadRow[]

  return (
    <div className="min-h-screen bg-black text-white p-6">
      <div className="max-w-5xl mx-auto">
        <h1 className="text-2xl font-bold uppercase tracking-widest">Leads</h1>
        <p className="text-white/40 text-sm mt-1">{leads.length} leads encontrados</p>
      </div>

      <div className="max-w-5xl mx-auto mt-6">
        <LeadsClient leads={leads} />
      </div>
    </div>
  )
}
