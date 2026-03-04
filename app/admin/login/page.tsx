'use client'
import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/primitives'
import { createClient } from '@/lib/supabase/client'
import { Loader2, Dumbbell, Mail } from 'lucide-react'
import { useRouter } from 'next/navigation'

export default function AdminLogin({ searchParams }: { searchParams: { error?: string } }) {
  const [email, setEmail] = useState('')
  const [loading, setLoading] = useState(false)
  const [sent, setSent] = useState(false)
  const [error, setError] = useState(searchParams.error === 'unauthorized' ? 'Acesso não autorizado.' : '')
  const router = useRouter()

  async function handleLogin(e: React.FormEvent) {
    e.preventDefault()
    setLoading(true); setError('')
    const supabase = createClient()
    const { error: err } = await supabase.auth.signInWithOtp({
      email,
      options: { emailRedirectTo: `${window.location.origin}/api/auth/callback?next=/admin/dashboard` }
    })
    if (err) { setError('Erro ao enviar link. Verifique o e-mail.'); setLoading(false); return }
    setSent(true); setLoading(false)
  }

  if (sent) {
    return (
      <div className="min-h-screen bg-black flex items-center justify-center p-4">
        <div className="bg-[#0a0a0a] border border-white/10 p-8 max-w-sm w-full text-center">
          <Mail className="mx-auto mb-4 text-[#FF6A00]" size={32} />
          <p className="text-xl font-bold text-white mb-2">Verifique seu e-mail</p>
          <p className="text-white/50 text-sm">Enviamos um link de acesso admin para <strong className="text-white">{email}</strong></p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-black flex items-center justify-center p-4">
      <div className="bg-[#0a0a0a] border border-white/10 p-8 max-w-sm w-full">
        <div className="flex items-center gap-3 mb-8">
          <div className="w-10 h-10 bg-[#FF6A00] flex items-center justify-center">
            <Dumbbell size={20} className="text-black" />
          </div>
          <div>
            <p className="font-bold text-white">TONHO SUPLEMENTOS</p>
            <p className="text-xs text-white/40 uppercase tracking-widest">Painel Admin</p>
          </div>
        </div>

        <form onSubmit={handleLogin} className="space-y-4">
          <div>
            <Label>E-mail do Admin</Label>
            <Input className="mt-1" type="email" required value={email} onChange={e => setEmail(e.target.value)} placeholder="admin@exemplo.com" />
          </div>
          {error && <p className="text-red-400 text-sm">{error}</p>}
          <Button type="submit" className="w-full" disabled={loading}>
            {loading ? <Loader2 className="animate-spin" size={16} /> : 'Entrar com Magic Link'}
          </Button>
        </form>
        <p className="text-xs text-white/30 mt-4 text-center">Acesso restrito a administradores.</p>
      </div>
    </div>
  )
}
