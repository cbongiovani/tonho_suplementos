export type Json = string | number | boolean | null | { [key: string]: Json | undefined } | Json[]

export interface Database {
  public: {
    Tables: {
      leads: {
        Row: {
          id: string
          auth_user_id: string | null
          name: string | null
          email: string | null
          whatsapp: string
          instagram_username: string | null
          instagram_id: string | null
          tags: string[]
          source: string
          consentimento_lgpd: boolean
          consentimento_lgpd_at: string | null
          created_at: string
          last_access_at: string | null
        }
        Insert: Omit<Database['public']['Tables']['leads']['Row'], 'id' | 'created_at'>
        Update: Partial<Database['public']['Tables']['leads']['Insert']>
      }
      products: {
        Row: {
          id: string
          name: string
          description: string | null
          category: 'whey' | 'creatina' | 'pre-treino' | 'termogenico' | 'vitaminas'
          goals: string[]
          price: number
          image_url: string | null
          highlight: 'mais_vendido' | 'promocao' | 'novo' | 'nenhum'
          is_active: boolean
          created_at: string
        }
        Insert: Omit<Database['public']['Tables']['products']['Row'], 'id' | 'created_at'>
        Update: Partial<Database['public']['Tables']['products']['Insert']>
      }
      campaigns: {
        Row: {
          id: string
          title: string
          message: string
          segment: Json
          channel: 'whatsapp' | 'email' | 'instagram_dm_text'
          status: 'rascunho' | 'enviada'
          created_at: string
        }
        Insert: Omit<Database['public']['Tables']['campaigns']['Row'], 'id' | 'created_at'>
        Update: Partial<Database['public']['Tables']['campaigns']['Insert']>
      }
      campaign_logs: {
        Row: {
          id: string
          campaign_id: string
          lead_id: string
          status: 'gerado' | 'enviado' | 'erro'
          detail: string | null
          created_at: string
        }
        Insert: Omit<Database['public']['Tables']['campaign_logs']['Row'], 'id' | 'created_at'>
        Update: Partial<Database['public']['Tables']['campaign_logs']['Insert']>
      }
      site_config: {
        Row: {
          id: number
          logo_url: string | null
          instagram_url: string
          whatsapp_url: string | null
          updated_at: string
        }
        Insert: Partial<Database['public']['Tables']['site_config']['Row']>
        Update: Partial<Database['public']['Tables']['site_config']['Row']>
      }
      admin_users: {
        Row: { id: string; email: string; created_at: string }
        Insert: { email: string }
        Update: Partial<{ email: string }>
      }
    }
  }
}
