'use client'
import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/primitives'
import { buildWhatsAppLink, formatDate } from '@/lib/utils'
import type { Database } from '@/lib/supabase/types'
import { Plus, Send, Copy, X, Loader2 } from 'lucide-react'

type Campaign = Database['public']['Tables']['campaigns']['Row']
type Lead = { id: string; name: string | null; whatsapp: string; instagram_username: string | null; tags: string[]; source: string }

export function CampaignsClient({ campaigns, leads }: { campaigns: Campaign[]; leads: Lead[] }) {
  const [list, setList] = useState(campaigns)
  const [creating, setCreating] = useState(false)
  const [loading, setLoading] = useState(false)
  const [generatedLinks, setGeneratedLinks] = useState<{ lead: Lead; link: string; text: string }[] | null>(null)
  const [form, setForm] = useState({
    title: '', message: '', channel: 'whatsapp' as const, segmentTag: '', segmentSource: '',
  })

  async function createCampaign() {
    setLoading(true)
    const segment = {
      tags: form.segmentTag ? [form.segmentTag] : [],
      source: form.segmentSource || null,
    }
    const res = await fetch('/api/admin/campaigns', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ title: form.title, message: form.message, channel: form.channel, segment }),
    })
    const { campaign } = await res.json()
    if (campaign) setList(prev => [campaign, ...prev])
    setCreating(false)
    setLoading(false)
  }

  function generateLinks(campaign: Campaign) {
    const segment = campaign.segment as { tags?: string[]; source?: string }
    const segmented = leads.filter(l => {
      if (segment.tags?.length && !segment.tags.some(t => l.tags.includes(t))) return false
      if (segment.source && l.source !== segment.source) return false
      return true
    })

    const links = segmented.map(lead => {
      const text = campaign.message.replace('{{nome}}', lead.name ?? 'amigo').replace('{{instagram}}', `@${lead.instagram_username ?? ''}`)
      const link = buildWhatsAppLink(lead.whatsapp, text)
      return { lead, link, text }
    })
    setGeneratedLinks(links)
  }

  return (
    <div className="space-y-6">
      <Button onClick={() => setCreating(true)}>
        <Plus size={16} /> Nova Campanha
      </Button>

      {/* Create Form */}
      {creating && (
        <div className="bg-[#0a0a0a] border border-white/10 p-6 space-y-4">
          <div className="flex justify-between items-center">
            <h2 className="font-bold text-white">Nova Campanha</h2>
            <button onClick={() => setCreating(false)} className="text-white/40 hover:text-white"><X size={16} /></button>
          </div>
          <div className="grid md:grid-cols-2 gap-4">
            <div>
              <Label>Título</Label>
              <Input className="mt-1" placeholder="Ex: Promoção Fim de Mês" value={form.title} onChange={e => setForm(f => ({ ...f, title: e.target.value }))} />
            </div>
            <div>
              <Label>Canal</Label>
              <select
                value={form.channel}
                onChange={e => setForm(f => ({ ...f, channel: e.target.value as typeof form.channel }))}
                className="mt-1 w-full bg-[#111] border border-white/20 text-white text-sm px-3 py-2.5 focus:border-[#FF6A00] focus:outline-none h-11"
              >
                <option value="whatsapp">WhatsApp</option>
                <option value="email">E-mail (stub)</option>
                <option value="instagram_dm_text">Instagram DM</option>
              </select>
            </div>
          </div>
          <div>
            <Label>Mensagem (use {'{{nome}}'} e {'{{instagram}}'})</Label>
            <textarea
              className="mt-1 w-full bg-[#111] border border-white/20 text-white text-sm px-3 py-2 focus:border-[#FF6A00] focus:outline-none resize-none h-24"
              placeholder="Oi {{nome}}! Temos uma oferta especial pra você..."
              value={form.message}
              onChange={e => setForm(f => ({ ...f, message: e.target.value }))}
            />
          </div>
          <div className="grid md:grid-cols-2 gap-4">
            <div>
              <Label>Filtrar por Tag (opcional)</Label>
              <Input className="mt-1" placeholder="ex: hipertrofia" value={form.segmentTag} onChange={e => setForm(f => ({ ...f, segmentTag: e.target.value }))} />
            </div>
            <div>
              <Label>Filtrar por Origem (opcional)</Label>
              <Input className="mt-1" placeholder="ex: instagram" value={form.segmentSource} onChange={e => setForm(f => ({ ...f, segmentSource: e.target.value }))} />
            </div>
          </div>
          <Button onClick={createCampaign} disabled={loading || !form.title || !form.message}>
            {loading ? <Loader2 className="animate-spin" size={16} /> : <><Send size={16} /> Criar Campanha</>}
          </Button>
        </div>
      )}

      {/* Campaigns list */}
      <div className="space-y-3">
        {list.length === 0 && <p className="text-white/30 text-sm">Nenhuma campanha criada ainda.</p>}
        {list.map(c => (
          <div key={c.id} className="bg-[#0a0a0a] border border-white/10 p-5">
            <div className="flex items-start justify-between gap-4">
              <div className="flex-1">
                <div className="flex items-center gap-2 mb-1">
                  <h3 className="font-bold text-white">{c.title}</h3>
                  <span className={`text-xs px-2 py-0.5 uppercase tracking-wider ${c.status === 'enviada' ? 'bg-green-500/20 text-green-400' : 'bg-yellow-500/20 text-yellow-400'}`}>
                    {c.status}
                  </span>
                  <span className="text-xs bg-white/10 text-white/50 px-2 py-0.5 uppercase tracking-wider">{c.channel}</span>
                </div>
                <p className="text-sm text-white/50 line-clamp-2">{c.message}</p>
                <p className="text-xs text-white/30 mt-1">{formatDate(c.created_at)}</p>
              </div>
              <Button variant="outline" size="sm" onClick={() => generateLinks(c)}>
                <Copy size={14} /> Gerar Lista
              </Button>
            </div>
          </div>
        ))}
      </div>

      {/* Generated Links Modal */}
      {generatedLinks && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 p-4" onClick={() => setGeneratedLinks(null)}>
          <div className="bg-[#0a0a0a] border border-white/20 max-w-2xl w-full max-h-[80vh] overflow-y-auto" onClick={e => e.stopPropagation()}>
            <div className="flex items-center justify-between p-4 border-b border-white/10">
              <p className="font-bold text-white">Lista de Envios ({generatedLinks.length})</p>
              <button onClick={() => setGeneratedLinks(null)} className="text-white/40 hover:text-white"><X size={16} /></button>
            </div>
            <div className="p-4 space-y-3">
              {generatedLinks.length === 0 ? (
                <p className="text-white/30 text-sm text-center py-4">Nenhum lead nesse segmento.</p>
              ) : generatedLinks.map(({ lead, link, text }) => (
                <div key={lead.id} className="border border-white/10 p-3">
                  <p className="text-sm font-medium text-white">{lead.name ?? 'Sem nome'} — {lead.whatsapp}</p>
                  <p className="text-xs text-white/40 mt-1 line-clamp-2">{text}</p>
                  <a href={link} target="_blank" rel="noopener noreferrer" className="text-xs text-[#FF6A00] hover:underline mt-1 inline-block">
                    Abrir no WhatsApp →
                  </a>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
