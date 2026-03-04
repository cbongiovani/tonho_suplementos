import Link from 'next/link'
import { LayoutDashboard, Users, Megaphone, Package, Settings, LogOut, Dumbbell } from 'lucide-react'
import { createServerSupabaseClient } from '@/lib/supabase/server'

const NAV = [
  { href: '/admin/dashboard', label: 'Dashboard', icon: LayoutDashboard },
  { href: '/admin/leads', label: 'Leads (CRM)', icon: Users },
  { href: '/admin/campanhas', label: 'Campanhas', icon: Megaphone },
  { href: '/admin/produtos', label: 'Produtos', icon: Package },
  { href: '/admin/config', label: 'Configurações', icon: Settings },
]

export default async function AdminLayout({ children }: { children: React.ReactNode }) {
  const supabase = createServerSupabaseClient()
  const { data: { session } } = await supabase.auth.getSession()

  return (
    <div className="min-h-screen bg-black flex">
      {/* Sidebar */}
      <aside className="w-64 bg-[#0a0a0a] border-r border-white/10 flex flex-col fixed h-full z-40">
        {/* Logo */}
        <div className="p-6 border-b border-white/10">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 bg-[#FF6A00] flex items-center justify-center">
              <Dumbbell size={16} className="text-black" />
            </div>
            <div>
              <p className="font-bold text-white text-sm">TONHO</p>
              <p className="text-xs text-white/40 uppercase tracking-widest">Admin Panel</p>
            </div>
          </div>
        </div>

        {/* Nav */}
        <nav className="flex-1 p-4 space-y-1">
          {NAV.map(({ href, label, icon: Icon }) => (
            <Link
              key={href}
              href={href}
              className="flex items-center gap-3 px-3 py-2.5 text-sm text-white/60 hover:text-white hover:bg-white/5 transition-colors group rounded-none border border-transparent hover:border-white/10"
            >
              <Icon size={16} className="group-hover:text-[#FF6A00] transition-colors" />
              {label}
            </Link>
          ))}
        </nav>

        {/* User */}
        <div className="p-4 border-t border-white/10">
          <p className="text-xs text-white/40 truncate mb-2">{session?.user?.email}</p>
          <form action="/api/auth/logout" method="POST">
            <button type="submit" className="flex items-center gap-2 text-sm text-white/50 hover:text-white transition-colors">
              <LogOut size={14} />
              Sair
            </button>
          </form>
        </div>
      </aside>

      {/* Content */}
      <main className="ml-64 flex-1 min-h-screen">
        {children}
      </main>
    </div>
  )
}
