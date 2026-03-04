'use client'
import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label, Badge } from '@/components/ui/primitives'
import { formatCurrency } from '@/lib/utils'
import type { Database } from '@/lib/supabase/types'
import { Plus, Edit, Trash2, X, Loader2, Upload, Image as ImageIcon } from 'lucide-react'

type Product = Database['public']['Tables']['products']['Row']

const CATEGORIES = ['whey', 'creatina', 'pre-treino', 'termogenico', 'vitaminas'] as const
const GOALS = ['hipertrofia', 'emagrecimento', 'energia', 'saude']
const HIGHLIGHTS = ['nenhum', 'mais_vendido', 'promocao', 'novo'] as const

const emptyForm = {
  name: '', description: '', category: 'whey' as const, price: '',
  goals: [] as string[], highlight: 'nenhum' as const, is_active: true, image_url: ''
}

export function ProductsClient({ initialProducts }: { initialProducts: Product[] }) {
  const [products, setProducts] = useState(initialProducts)
  const [editing, setEditing] = useState<Product | null>(null)
  const [creating, setCreating] = useState(false)
  const [form, setForm] = useState({ ...emptyForm })
  const [loading, setLoading] = useState(false)
  const [uploading, setUploading] = useState(false)

  function openCreate() { setForm({ ...emptyForm }); setCreating(true); setEditing(null) }
  function openEdit(p: Product) {
    setForm({ name: p.name, description: p.description ?? '', category: p.category, price: String(p.price), goals: p.goals, highlight: p.highlight, is_active: p.is_active, image_url: p.image_url ?? '' })
    setEditing(p); setCreating(false)
  }
  function closeForm() { setCreating(false); setEditing(null) }

  async function handleImageUpload(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0]; if (!file) return
    setUploading(true)
    const fd = new FormData(); fd.append('file', file); fd.append('folder', 'products')
    const res = await fetch('/api/admin/upload', { method: 'POST', body: fd })
    const { url } = await res.json()
    if (url) setForm(f => ({ ...f, image_url: url }))
    setUploading(false)
  }

  async function handleSave() {
    setLoading(true)
    const body = { ...form, price: parseFloat(form.price) }
    const method = editing ? 'PUT' : 'POST'
    const url = editing ? `/api/admin/products/${editing.id}` : '/api/admin/products'
    const res = await fetch(url, { method, headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(body) })
    const { product } = await res.json()
    if (product) {
      if (editing) setProducts(p => p.map(x => x.id === product.id ? product : x))
      else setProducts(p => [product, ...p])
    }
    setLoading(false); closeForm()
  }

  async function handleDelete(id: string) {
    if (!confirm('Excluir produto?')) return
    await fetch(`/api/admin/products/${id}`, { method: 'DELETE' })
    setProducts(p => p.filter(x => x.id !== id))
  }

  const showForm = creating || !!editing

  return (
    <div className="space-y-6">
      <Button onClick={openCreate}><Plus size={16} /> Novo Produto</Button>

      {/* Form */}
      {showForm && (
        <div className="bg-[#0a0a0a] border border-white/10 p-6 space-y-4">
          <div className="flex justify-between items-center">
            <h2 className="font-bold text-white">{editing ? 'Editar Produto' : 'Novo Produto'}</h2>
            <button onClick={closeForm} className="text-white/40 hover:text-white"><X size={16} /></button>
          </div>

          <div className="grid md:grid-cols-2 gap-4">
            <div>
              <Label>Nome *</Label>
              <Input className="mt-1" value={form.name} onChange={e => setForm(f => ({ ...f, name: e.target.value }))} placeholder="Nome do produto" />
            </div>
            <div>
              <Label>Preço (R$) *</Label>
              <Input className="mt-1" type="number" step="0.01" value={form.price} onChange={e => setForm(f => ({ ...f, price: e.target.value }))} placeholder="99.90" />
            </div>
          </div>

          <div>
            <Label>Descrição</Label>
            <textarea className="mt-1 w-full bg-[#111] border border-white/20 text-white text-sm px-3 py-2 focus:border-[#FF6A00] focus:outline-none resize-none h-20" value={form.description} onChange={e => setForm(f => ({ ...f, description: e.target.value }))} />
          </div>

          <div className="grid md:grid-cols-3 gap-4">
            <div>
              <Label>Categoria</Label>
              <select value={form.category} onChange={e => setForm(f => ({ ...f, category: e.target.value as typeof form.category }))} className="mt-1 w-full bg-[#111] border border-white/20 text-white text-sm px-3 h-11 focus:border-[#FF6A00] focus:outline-none">
                {CATEGORIES.map(c => <option key={c} value={c}>{c}</option>)}
              </select>
            </div>
            <div>
              <Label>Destaque</Label>
              <select value={form.highlight} onChange={e => setForm(f => ({ ...f, highlight: e.target.value as typeof form.highlight }))} className="mt-1 w-full bg-[#111] border border-white/20 text-white text-sm px-3 h-11 focus:border-[#FF6A00] focus:outline-none">
                {HIGHLIGHTS.map(h => <option key={h} value={h}>{h}</option>)}
              </select>
            </div>
            <div className="flex items-end pb-1">
              <label className="flex items-center gap-2 cursor-pointer">
                <input type="checkbox" checked={form.is_active} onChange={e => setForm(f => ({ ...f, is_active: e.target.checked }))} className="accent-[#FF6A00]" />
                <span className="text-sm text-white/70">Produto Ativo</span>
              </label>
            </div>
          </div>

          <div>
            <Label>Objetivos</Label>
            <div className="flex flex-wrap gap-2 mt-1">
              {GOALS.map(g => (
                <button key={g} type="button" onClick={() => setForm(f => ({ ...f, goals: f.goals.includes(g) ? f.goals.filter(x => x !== g) : [...f.goals, g] }))}
                  className={`px-3 py-1.5 text-xs uppercase tracking-wider border transition-colors ${form.goals.includes(g) ? 'bg-[#FF6A00] border-[#FF6A00] text-black font-bold' : 'border-white/20 text-white/60'}`}
                >{g}</button>
              ))}
            </div>
          </div>

          {/* Image upload */}
          <div>
            <Label>Imagem do Produto</Label>
            <div className="mt-1 flex items-center gap-3">
              <label className="cursor-pointer flex items-center gap-2 border border-white/20 px-3 py-2 text-sm text-white/60 hover:border-[#FF6A00] hover:text-white transition-colors">
                {uploading ? <Loader2 size={14} className="animate-spin" /> : <Upload size={14} />}
                {uploading ? 'Enviando...' : 'Upload Imagem'}
                <input type="file" accept="image/*" className="hidden" onChange={handleImageUpload} />
              </label>
              {form.image_url && <span className="text-xs text-green-400">✓ Imagem carregada</span>}
            </div>
            {form.image_url && (
              <Input className="mt-2 text-xs" value={form.image_url} onChange={e => setForm(f => ({ ...f, image_url: e.target.value }))} placeholder="URL da imagem" />
            )}
          </div>

          <Button onClick={handleSave} disabled={loading || !form.name || !form.price}>
            {loading ? <Loader2 className="animate-spin" size={16} /> : 'Salvar Produto'}
          </Button>
        </div>
      )}

      {/* Products table */}
      <div className="overflow-x-auto border border-white/10">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-white/10 bg-[#0a0a0a]">
              {['Produto', 'Categoria', 'Preço', 'Destaque', 'Status', 'Ações'].map(h => (
                <th key={h} className="px-4 py-3 text-left text-xs uppercase tracking-wider text-white/40">{h}</th>
              ))}
            </tr>
          </thead>
          <tbody className="divide-y divide-white/5">
            {products.map(p => (
              <tr key={p.id} className="hover:bg-white/5 transition-colors">
                <td className="px-4 py-3">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-[#1a1a1a] flex-shrink-0 flex items-center justify-center">
                      {p.image_url ? <img src={p.image_url} alt="" className="w-10 h-10 object-cover" /> : <ImageIcon size={16} className="text-white/20" />}
                    </div>
                    <span className="font-medium text-white line-clamp-1">{p.name}</span>
                  </div>
                </td>
                <td className="px-4 py-3"><span className="text-xs bg-white/10 text-white/60 px-2 py-0.5 uppercase">{p.category}</span></td>
                <td className="px-4 py-3 text-[#FF6A00] font-bold">{formatCurrency(p.price)}</td>
                <td className="px-4 py-3">{p.highlight !== 'nenhum' && <Badge className="bg-[#FF6A00]/20 text-[#FF6A00]">{p.highlight}</Badge>}</td>
                <td className="px-4 py-3"><span className={`text-xs px-2 py-0.5 uppercase tracking-wider ${p.is_active ? 'bg-green-500/20 text-green-400' : 'bg-red-500/20 text-red-400'}`}>{p.is_active ? 'Ativo' : 'Inativo'}</span></td>
                <td className="px-4 py-3">
                  <div className="flex gap-2">
                    <button onClick={() => openEdit(p)} className="text-white/40 hover:text-[#FF6A00] transition-colors"><Edit size={14} /></button>
                    <button onClick={() => handleDelete(p.id)} className="text-white/40 hover:text-red-400 transition-colors"><Trash2 size={14} /></button>
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
