import { createServerSupabaseClient, createServiceRoleClient } from './supabase/server'

export async function getSession() {
  const supabase = createServerSupabaseClient()
  const { data: { session } } = await supabase.auth.getSession()
  return session
}

export async function isAdmin(userId?: string): Promise<boolean> {
  if (!userId) return false

  // Option 1: Check ADMIN_EMAILS env var
  const adminEmails = process.env.ADMIN_EMAILS?.split(',').map(e => e.trim()) ?? []

  const supabase = createServerSupabaseClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return false

  if (adminEmails.includes(user.email ?? '')) return true

  // Option 2: Check admin_users table
  const service = createServiceRoleClient()
  const { data } = await service
    .from('admin_users')
    .select('id')
    .eq('email', user.email ?? '')
    .single()

  return !!data
}

export async function getOrCreateLead(userId: string, data?: {
  name?: string
  email?: string
  whatsapp?: string
  instagram_username?: string
  source?: string
  consentimento_lgpd?: boolean
}) {
  const supabase = createServiceRoleClient()

  // Check if lead exists
  const { data: existing } = await supabase
    .from('leads')
    .select('*')
    .eq('auth_user_id', userId)
    .single()

  if (existing) {
    // Update last access
    await supabase
      .from('leads')
      .update({ last_access_at: new Date().toISOString() })
      .eq('id', existing.id)
    return { lead: existing, isNew: false }
  }

  // Create new lead
  if (!data?.whatsapp) return { lead: null, isNew: true, needsWhatsApp: true }

  const { data: newLead, error } = await supabase
    .from('leads')
    .insert({
      auth_user_id: userId,
      name: data.name ?? null,
      email: data.email ?? null,
      whatsapp: data.whatsapp,
      instagram_username: data.instagram_username ?? null,
      source: data.source ?? 'landing',
      consentimento_lgpd: data.consentimento_lgpd ?? false,
      consentimento_lgpd_at: data.consentimento_lgpd ? new Date().toISOString() : null,
      tags: [],
    })
    .select()
    .single()

  if (error) throw error
  return { lead: newLead, isNew: true }
}
