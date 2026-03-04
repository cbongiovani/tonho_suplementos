'use client'
import { useState, useMemo } from 'react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { formatDate, buildWhatsAppLink, INSTAGRAM_URL } from '@/lib/utils'
import type { Database } from '@/lib/supabase/types'
import { Download, Search, Copy, Instagram, Phone, Filter } from 'lucide-react'

type Lead = Database['public']['Tables']['leads']['Row']

export function LeadsClient({ leads }: { leads: Lead[] }) {
  const [search, setSearch] = useState('')
  const [sourceFilter, setSourceFilter] = useState('')
  const [copied, setCopied] = useState<string | null>(null)

  const filtered = useMemo(() => leads.filter(l => {
    const q = search.toLowerCase()
    const matchSearch = !q || [l.name, l.email, l.instagram_username, l.whatsapp].some(v => v?.toLowerCase().includes(q))
    const matchSource = !sourceFilter || l.source === sourceFilter
    return matchSearch && matchSource
  }), [leads, search, sourceFilter])

  function exportCSV() {
    const headers = ['Nome', 'Instagram', 'WhatsApp', 'Email', 'Origem', 'Tags', 'LGPD', 'Data']
    const rows = filtered.map(l => [
      l.name ?? '',
      l.instagram_username ?? '',
      l.whatsapp,
      l.email ?? '',
      l.source,
      l.tags.join(';'),
      l.consentimento_lgpd ? 'Sim' : 'Não',
      formatDate(l.created_at),
    ])
    const csv = [headers, ...rows].map(r => r.map(c => `"${c}"`).join(',')).join('\n')
    const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a'); a.href = url; a.download = 'leads.csv'; a.click()
    URL.revokeObjectURL(url)
  }

  function copyWA(lead: Lead) {
    const msg = `Olá ${lead.name ?? ''}! Aqui é o Tonho Suplementos. Temos ofertas especiais pra você! 💪`
    navigator.clipboard.writeText(msg)
    setCopied(lead.id + '-wa')
    setTimeout(() => setCopied(null), 2000)
  }

  function copyDM(lead: Lead) {
    const msg = `Oi @${lead.instagram_username ?? 'você'}! Sou o Tonho Suplementos. Vi que você se cadastrou e quero te enviar uma oferta exclusiva! 💪`
    navigator.clipboard.writeText(msg)
    setCopied(lead.id + '-dm')
    setTimeout(() => setCopied(null), 2000)
  }

  return (
    <div className="space-y-4">
      {/* Toolbar */}
      <div className="flex flex-wrap gap-3 items-center">
        <div className="relative flex-1 min-w-48">
          <Search size={14} className="absolute left-3 top-3.5 text-white/40" />
          <Input placeholder="Buscar nome, email, WhatsApp..." value={search} onChange={e => setSearch(e.target.value)} className="pl-9" />
        </div>
        <div className="flex items-center gap-2">
          <Filter size={14} className="text-white/40" />
          <select
            value={sourceFilter}
            onChange={e => setSourceFilter(e.target.value)}
            className="bg-[#111] border border-white/20 text-white text-sm px-3 py-2 focus:border-[#FF6A00] focus:outline-none"
          >
            <option value="">Todas origens</option>
            <option value="landing">Landing</option>
            <option value="instagram">Instagram</option>
            <option value="campaign">Campanha</option>
          </select>
        </div>
        <Button variant="outline" size="sm" onClick={exportCSV}>
          <Download size={14} /> Exportar CSV ({filtered.length})
        </Button>
      </div>

      {/* Table */}
      <div className="overflow-x-auto border border-white/10">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-white/10 bg-[#0a0a0a]">
              {['Nome', '@Instagram', 'WhatsApp', 'Origem', 'Tags', 'LGPD', 'Data', 'Ações'].map(h => (
                <th key={h} className="px-4 py-3 text-left text-xs uppercase tracking-wider text-white/40 font-medium">{h}</th>
              ))}
            </tr>
          </thead>
          <tbody className="divide-y divide-white/5">
            {filtered.length === 0 ? (
              <tr><td colSpan={8} className="px-4 py-8 text-center text-white/30">Nenhum lead encontrado.</td></tr>
            ) : filtered.map(lead => (
              <tr key={lead.id} className="hover:bg-white/5 transition-colors">
                <td className="px-4 py-3 text-white font-medium">{lead.name ?? '—'}</td>
                <td className="px-4 py-3 text-white/60">
                  {lead.instagram_username ? (
                    <a href={`${INSTAGRAM_URL.replace('tonhosuplementos', lead.instagram_username)}`} target="_blank" className="hover:text-[#FF6A00] transition-colors">@{lead.instagram_username}</a>
                  ) : '—'}
                </td>
                <td className="px-4 py-3 text-white/60">{lead.whatsapp}</td>
                <td className="px-4 py-3">
                  <span className="text-xs bg-white/10 text-white/60 px-2 py-0.5 uppercase tracking-wider">{lead.source}</span>
                </td>
                <td className="px-4 py-3">
                  <div className="flex flex-wrap gap-1">
                    {lead.tags.map(t => (
                      <span key={t} className="text-xs bg-[#FF6A00]/20 text-[#FF6A00] px-1.5 py-0.5 uppercase tracking-wider">{t}</span>
                    ))}
                  </div>
                </td>
                <td className="px-4 py-3 text-center">
                  {lead.consentimento_lgpd ? (
                    <span className="text-green-400 text-xs">✓ Sim</span>
                  ) : (
                    <span className="text-white/30 text-xs">—</span>
                  )}
                </td>
                <td className="px-4 py-3 text-white/40 text-xs whitespace-nowrap">{formatDate(lead.created_at)}</td>
                <td className="px-4 py-3">
                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => copyWA(lead)}
                      title="Copiar mensagem WhatsApp"
                      className="text-white/40 hover:text-green-400 transition-colors"
                    >
                      {copied === lead.id + '-wa' ? '✓' : <Phone size={14} />}
                    </button>
                    <button
                      onClick={() => copyDM(lead)}
                      title="Copiar mensagem DM"
                      className="text-white/40 hover:text-[#FF6A00] transition-colors"
                    >
                      {copied === lead.id + '-dm' ? '✓' : <Instagram size={14} />}
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )
}
