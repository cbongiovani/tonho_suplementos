import { cookies } from "next/headers"
import { createServerClient } from "@supabase/ssr"
import { createClient } from "@supabase/supabase-js"
import type { Database } from "./types"

/**
 * Client com sessão (cookies). Use em Server Components (layout/page)
 * quando precisar do usuário logado (auth).
 */
export function createServerSupabaseClient() {
  const cookieStore = cookies()

  const url = process.env.NEXT_PUBLIC_SUPABASE_URL
  const anon = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY

  if (!url) throw new Error("Missing NEXT_PUBLIC_SUPABASE_URL")
  if (!anon) throw new Error("Missing NEXT_PUBLIC_SUPABASE_ANON_KEY")

  return createServerClient<Database>(url, anon, {
    cookies: {
      get(name: string) {
        return cookieStore.get(name)?.value
      },
      set(name: string, value: string, options: any) {
        cookieStore.set({ name, value, ...options })
      },
      remove(name: string, options: any) {
        cookieStore.set({ name, value: "", ...options })
      },
    },
  })
}

/**
 * Client privilegiado (service role). Use SOMENTE no server
 * (API routes / server actions) para operações administrativas.
 *
 * ✅ Não usa cookies/sessão
 * ✅ Tipagem correta do Database (evita .update() virar never)
 */
export function createServiceRoleClient() {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL
  const serviceKey = process.env.SUPABASE_SERVICE_ROLE_KEY

  if (!url) throw new Error("Missing NEXT_PUBLIC_SUPABASE_URL")
  if (!serviceKey) throw new Error("Missing SUPABASE_SERVICE_ROLE_KEY")

  return createClient<Database>(url, serviceKey, {
    auth: {
      persistSession: false,
      autoRefreshToken: false,
      detectSessionInUrl: false,
    },
  })
}
