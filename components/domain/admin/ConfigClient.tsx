'use client'
import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/primitives'
import type { Database } from '@/lib/supabase/types'
import { Upload, Loader2, CheckCircle, Image as ImageIcon } from 'lucide-react'

type SiteConfig = Database['public']['Tables']['site_config']['Row']

export function ConfigClient({ initialConfig }: { initialConfig: SiteConfig }) {
  const [config, setConfig] = useState(initialConfig)
  const [uploading, setUploading] = useState(false)
  const [saving, setSaving] = useState(false)
  const [saved, setSaved] = useState(false)

  async function handleLogoUpload(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0]; if (!file) return
    setUploading(true)
    const fd = new FormData(); fd.append('file', file); fd.append('folder', 'logos')
    const res = await fetch('/api/admin/upload', { method: 'POST', body: fd })
    const { url } = await res.json()
    if (url) setConfig(c => ({ ...c, logo_url: url }))
    setUploading(false)
  }

  async function handleSave() {
    setSaving(true)
    await fetch('/api/admin/config', {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ logo_url: config.logo_url, instagram_url: config.instagram_url, whatsapp_url: config.whatsapp_url }),
    })
    setSaved(true); setSaving(false)
    setTimeout(() => setSaved(false), 3000)
  }

  return (
    <div className="max-w-2xl space-y-8">
      {/* Logo */}
      <div className="bg-[#0a0a0a] border border-white/10 p-6 space-y-4">
        <h2 className="font-bold text-white">Logo do Site</h2>
        <div className="flex items-center gap-4">
          <div className="w-32 h-16 bg-[#1a1a1a] border border-white/10 flex items-center justify-center flex-shrink-0">
            {config.logo_url ? (
              <img src={config.logo_url} alt="Logo" className="h-12 w-auto object-contain" />
            ) : (
              <ImageIcon size={24} className="text-white/20" />
            )}
          </div>
          <div className="space-y-2">
            <label className="cursor-pointer flex items-center gap-2 bg-[#FF6A00] text-black px-4 py-2 text-sm font-bold uppercase tracking-widest hover:bg-orange-400 transition-colors">
              {uploading ? <Loader2 size={14} className="animate-spin" /> : <Upload size={14} />}
              {uploading ? 'Enviando...' : 'Upload Logo'}
              <input type="file" accept="image/*" className="hidden" onChange={handleLogoUpload} />
            </label>
            <p className="text-xs text-white/30">PNG ou SVG. Recomendado: 300x80px</p>
          </div>
        </div>
        {config.logo_url && (
          <div>
            <Label>URL da Logo</Label>
            <Input className="mt-1 text-xs" value={config.logo_url} onChange={e => setConfig(c => ({ ...c, logo_url: e.target.value }))} />
          </div>
        )}
      </div>

      {/* Links */}
      <div className="bg-[#0a0a0a] border border-white/10 p-6 space-y-4">
        <h2 className="font-bold text-white">Links e Contato</h2>
        <div>
          <Label>URL do Instagram</Label>
          <Input className="mt-1" value={config.instagram_url} onChange={e => setConfig(c => ({ ...c, instagram_url: e.target.value }))} placeholder="https://www.instagram.com/..." />
        </div>
        <div>
          <Label>URL do WhatsApp</Label>
          <Input className="mt-1" value={config.whatsapp_url ?? ''} onChange={e => setConfig(c => ({ ...c, whatsapp_url: e.target.value }))} placeholder="https://wa.me/55..." />
        </div>
      </div>

      <Button onClick={handleSave} disabled={saving} size="lg">
        {saving ? <Loader2 className="animate-spin" size={16} /> : saved ? <><CheckCircle size={16} /> Salvo!</> : 'Salvar Configurações'}
      </Button>
    </div>
  )
}
