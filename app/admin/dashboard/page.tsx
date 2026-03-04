import { createServiceRoleClient } from '@/lib/supabase/server'
import { Users, TrendingUp, Calendar, Tag } from 'lucide-react'

async function getStats() {
  const supabase = createServiceRoleClient()
  const now = new Date()
  const todayStart = new Date(now.getFullYear(), now.getMonth(), now.getDate()).toISOString()
  const weekStart = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000).toISOString()
  const monthStart = new Date(now.getFullYear(), now.getMonth(), 1).toISOString()

  const [total, today, week, month, tags] = await Promise.all([
    supabase.from('leads').select('id', { count: 'exact', head: true }),
    supabase.from('leads').select('id', { count: 'exact', head: true }).gte('created_at', todayStart),
    supabase.from('leads').select('id', { count: 'exact', head: true }).gte('created_at', weekStart),
    supabase.from('leads').select('id', { count: 'exact', head: true }).gte('created_at', monthStart),
    supabase.from('leads').select('tags'),
  ])

  const tagCounts: Record<string, number> = {}
  tags.data?.forEach(l => l.tags?.forEach((t: string) => { tagCounts[t] = (tagCounts[t] ?? 0) + 1 }))
  const topTags = Object.entries(tagCounts).sort((a, b) => b[1] - a[1]).slice(0, 5)

  return {
    total: total.count ?? 0,
    today: today.count ?? 0,
    week: week.count ?? 0,
    month: month.count ?? 0,
    topTags,
  }
}

export default async function AdminDashboard() {
  const stats = await getStats()

  const cards = [
    { label: 'Leads Hoje', value: stats.today, icon: Calendar, color: 'text-green-400' },
    { label: 'Leads esta Semana', value: stats.week, icon: TrendingUp, color: 'text-blue-400' },
    { label: 'Leads este Mês', value: stats.month, icon: Calendar, color: 'text-purple-400' },
    { label: 'Total de Leads', value: stats.total, icon: Users, color: 'text-[#FF6A00]' },
  ]

  return (
    <div className="p-8">
      <div className="mb-8">
        <h1 className="font-display text-4xl text-white">DASHBOARD</h1>
        <p className="text-white/40 text-sm mt-1">Visão geral do negócio</p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        {cards.map(({ label, value, icon: Icon, color }) => (
          <div key={label} className="bg-[#0a0a0a] border border-white/10 p-6">
            <div className="flex items-start justify-between mb-4">
              <Icon size={20} className={color} />
            </div>
            <p className={`text-3xl font-bold ${color}`}>{value}</p>
            <p className="text-xs text-white/40 uppercase tracking-wider mt-1">{label}</p>
          </div>
        ))}
      </div>

      {/* Top Tags */}
      <div className="bg-[#0a0a0a] border border-white/10 p-6">
        <div className="flex items-center gap-2 mb-4">
          <Tag size={16} className="text-[#FF6A00]" />
          <h2 className="font-bold text-white">Top Tags / Interesses</h2>
        </div>
        {stats.topTags.length === 0 ? (
          <p className="text-white/30 text-sm">Nenhuma tag registrada ainda.</p>
        ) : (
          <div className="space-y-2">
            {stats.topTags.map(([tag, count]) => (
              <div key={tag} className="flex items-center justify-between">
                <span className="text-sm text-white/70 uppercase tracking-wider">{tag}</span>
                <div className="flex items-center gap-2">
                  <div className="h-1.5 bg-[#FF6A00] rounded-full" style={{ width: `${Math.max(20, (count / stats.total) * 200)}px` }} />
                  <span className="text-xs text-white/40 w-6 text-right">{count}</span>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}
