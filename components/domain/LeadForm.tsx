'use client'
import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/primitives'
import { Instagram, Mail, Phone, User, CheckCircle, Loader2 } from 'lucide-react'
import { INSTAGRAM_URL } from '@/lib/utils'

interface LeadFormProps {
  userId?: string
  existingLead?: { name: string; instagram_username?: string | null } | null
}

export function LeadForm({ userId, existingLead }: LeadFormProps) {
  const [step, setStep] = useState<'form' | 'magic-link' | 'success'>('form')
  const [loading, setLoading] = useState(false)
  const [email, setEmail] = useState('')
  const [name, setName] = useState('')
  const [whatsapp, setWhatsapp] = useState('')
  const [consent, setConsent] = useState(false)
  const [error, setError] = useState('')
  const [authMode, setAuthMode] = useState<'lead-only' | 'magic-link'>('lead-only')

  if (existingLead) {
    return (
      <div className="bg-[#111] border border-[#FF6A00]/40 p-6 text-center">
        <CheckCircle className="mx-auto mb-3 text-[#FF6A00]" size={32} />
        <p className="text-lg font-bold text-white">
          Bem-vindo de volta{existingLead.instagram_username ? `, @${existingLead.instagram_username}` : existingLead.name ? `, ${existingLead.name}` : ''}!
        </p>
        <p className="text-white/60 text-sm mt-1">Você já está cadastrado. Aproveite suas ofertas exclusivas.</p>
        <div className="flex gap-3 mt-4 justify-center">
          <Button asChild size="sm"><a href="/ofertas">Ver Ofertas</a></Button>
          <Button asChild variant="outline" size="sm"><a href="/cupons">Meus Cupons</a></Button>
        </div>
      </div>
    )
  }

  async function handleLeadSubmit(e: React.FormEvent) {
    e.preventDefault()
    if (!consent) { setError('Aceite os termos para continuar.'); return }
    setLoading(true); setError('')
    try {
      const res = await fetch('/api/leads', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name, email, whatsapp, consent, source: 'landing' }),
      })
      if (!res.ok) throw new Error('Erro ao salvar lead')
      setStep('success')
    } catch (err) {
      setError('Erro ao salvar. Tente novamente.')
    } finally {
      setLoading(false)
    }
  }

  async function handleMagicLink(e: React.FormEvent) {
    e.preventDefault()
    setLoading(true); setError('')
    try {
      const res = await fetch('/api/auth/magic-link', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email }),
      })
      if (!res.ok) throw new Error()
      setStep('magic-link')
    } catch {
      setError('Erro ao enviar link. Verifique o e-mail.')
    } finally {
      setLoading(false)
    }
  }

  if (step === 'success') {
    return (
      <div className="bg-[#111] border border-[#FF6A00]/40 p-6 text-center animate-fade-up">
        <CheckCircle className="mx-auto mb-3 text-[#FF6A00]" size={32} />
        <p className="text-xl font-bold text-white">Cadastro realizado! 🎉</p>
        <p className="text-white/60 text-sm mt-1">Em breve você receberá ofertas exclusivas via WhatsApp.</p>
        <Button asChild className="mt-4"><a href="/catalogo">Ver Produtos Agora</a></Button>
      </div>
    )
  }

  if (step === 'magic-link') {
    return (
      <div className="bg-[#111] border border-[#FF6A00]/40 p-6 text-center">
        <Mail className="mx-auto mb-3 text-[#FF6A00]" size={32} />
        <p className="text-xl font-bold text-white">Verifique seu e-mail</p>
        <p className="text-white/60 text-sm mt-1">Enviamos um link de acesso para <strong className="text-white">{email}</strong></p>
      </div>
    )
  }

  return (
    <div className="bg-[#0a0a0a] border border-white/10 p-6 space-y-5">
      <div className="text-center">
        <p className="text-xs text-white/40 uppercase tracking-widest mb-1">Cadastro rápido</p>
        <p className="text-sm text-white/60">Se você já é cadastrado, não precisa preencher nada.</p>
      </div>

      {/* Instagram OAuth (stub) */}
      <a
        href={INSTAGRAM_URL}
        target="_blank"
        rel="noopener noreferrer"
        className="flex items-center justify-center gap-2 w-full bg-gradient-to-r from-purple-600 via-pink-600 to-orange-500 text-white font-bold py-3 text-sm uppercase tracking-widest hover:opacity-90 transition-opacity"
      >
        <Instagram size={18} />
        Entrar com Instagram
        <span className="text-xs font-normal opacity-70">(em breve)</span>
      </a>

      <div className="flex items-center gap-3">
        <div className="flex-1 h-px bg-white/10" />
        <span className="text-xs text-white/30 uppercase tracking-widest">ou</span>
        <div className="flex-1 h-px bg-white/10" />
      </div>

      {/* Toggle */}
      <div className="flex border border-white/10">
        <button
          onClick={() => setAuthMode('lead-only')}
          className={`flex-1 py-2 text-xs uppercase tracking-wider transition-colors ${authMode === 'lead-only' ? 'bg-[#FF6A00] text-black font-bold' : 'text-white/50 hover:text-white'}`}
        >
          Deixar Contato
        </button>
        <button
          onClick={() => setAuthMode('magic-link')}
          className={`flex-1 py-2 text-xs uppercase tracking-wider transition-colors ${authMode === 'magic-link' ? 'bg-[#FF6A00] text-black font-bold' : 'text-white/50 hover:text-white'}`}
        >
          Login por E-mail
        </button>
      </div>

      {authMode === 'lead-only' ? (
        <form onSubmit={handleLeadSubmit} className="space-y-3">
          <div>
            <Label htmlFor="name">Nome</Label>
            <div className="relative mt-1">
              <User size={14} className="absolute left-3 top-3.5 text-white/40" />
              <Input id="name" placeholder="Seu nome" value={name} onChange={e => setName(e.target.value)} className="pl-9" />
            </div>
          </div>
          <div>
            <Label htmlFor="email">E-mail</Label>
            <div className="relative mt-1">
              <Mail size={14} className="absolute left-3 top-3.5 text-white/40" />
              <Input id="email" type="email" placeholder="seu@email.com" value={email} onChange={e => setEmail(e.target.value)} className="pl-9" />
            </div>
          </div>
          <div>
            <Label htmlFor="whatsapp">WhatsApp *</Label>
            <div className="relative mt-1">
              <Phone size={14} className="absolute left-3 top-3.5 text-white/40" />
              <Input id="whatsapp" required placeholder="(11) 99999-9999" value={whatsapp} onChange={e => setWhatsapp(e.target.value)} className="pl-9" />
            </div>
          </div>
          <label className="flex items-start gap-2 cursor-pointer">
            <input type="checkbox" checked={consent} onChange={e => setConsent(e.target.checked)} className="mt-1 accent-[#FF6A00]" />
            <span className="text-xs text-white/50">Aceito receber comunicações de marketing da Tonho Suplementos via WhatsApp e e-mail, conforme a LGPD.</span>
          </label>
          {error && <p className="text-red-400 text-xs">{error}</p>}
          <Button type="submit" className="w-full" disabled={loading}>
            {loading ? <Loader2 className="animate-spin" size={16} /> : 'Ganhar Cupom de Boas-Vindas'}
          </Button>
        </form>
      ) : (
        <form onSubmit={handleMagicLink} className="space-y-3">
          <div>
            <Label htmlFor="ml-email">E-mail</Label>
            <div className="relative mt-1">
              <Mail size={14} className="absolute left-3 top-3.5 text-white/40" />
              <Input id="ml-email" type="email" required placeholder="seu@email.com" value={email} onChange={e => setEmail(e.target.value)} className="pl-9" />
            </div>
          </div>
          {error && <p className="text-red-400 text-xs">{error}</p>}
          <Button type="submit" variant="outline" className="w-full" disabled={loading}>
            {loading ? <Loader2 className="animate-spin" size={16} /> : 'Enviar Link de Acesso'}
          </Button>
          <p className="text-xs text-white/30 text-center">Você receberá um link mágico no e-mail para acessar ofertas exclusivas.</p>
        </form>
      )}
    </div>
  )
}
