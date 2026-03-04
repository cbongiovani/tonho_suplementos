import { createServiceRoleClient } from "@/lib/supabase/server"
import { ConfigClient } from "@/components/domain/admin/ConfigClient"

type ConfigRow = {
  id: number
  logo_url: string | null
  instagram_url: string
  whatsapp_url: string | null
  updated_at: string
}

const defaultConfig: ConfigRow = {
  id: 1,
  logo_url: null,
  instagram_url: "https://www.instagram.com/tonhosuplementos",
  whatsapp_url: null,
  updated_at: "",
}

export default async function ConfigPage() {
  const supabase = createServiceRoleClient()

  // ⚠️ Se sua tabela tiver outro nome, troque "config" aqui:
  const { data, error } = await supabase
    .from("config")
    .select("*")
    .eq("id", 1)
    .maybeSingle()

  if (error) {
    console.error("Erro ao buscar config:", error.message)
  }

  const config: ConfigRow = (data ?? defaultConfig) as ConfigRow

  return (
    <div className="min-h-screen bg-black text-white p-6">
      <div className="max-w-5xl mx-auto">
        <h1 className="text-2xl font-bold uppercase tracking-widest">Config</h1>
        <p className="text-white/40 text-sm mt-1">Personalize o site e links</p>
      </div>

      <div className="max-w-5xl mx-auto mt-6">
        <ConfigClient initialConfig={config} />
      </div>
    </div>
  )
}
