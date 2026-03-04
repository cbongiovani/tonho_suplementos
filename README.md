# 🏋️ Tonho Suplementos

Sistema web completo para captação de leads e gestão de clientes via funil Instagram → Landing → Lead → CRM → Campanhas.

---

## Stack

- **Next.js 14** (App Router + Server Actions)
- **TypeScript**
- **TailwindCSS**
- **Supabase** (Postgres + Auth + Storage)
- **Zod** (validação)
- **lucide-react** (ícones)

---

## Início Rápido

### 1. Clone e instale dependências

```bash
git clone <repo>
cd tonho-suplementos
npm install
```

### 2. Configure variáveis de ambiente

```bash
cp .env.example .env.local
```

Preencha os valores no `.env.local`:
- `NEXT_PUBLIC_SUPABASE_URL` — URL do projeto Supabase
- `NEXT_PUBLIC_SUPABASE_ANON_KEY` — Anon key pública
- `SUPABASE_SERVICE_ROLE_KEY` — Service role key (admin)
- `ADMIN_EMAILS` — E-mails admin separados por vírgula
- `NEXT_PUBLIC_SITE_URL` — URL do site (ex: http://localhost:3000)

### 3. Configure o Supabase

#### 3.1 Crie um projeto em [supabase.com](https://supabase.com)

#### 3.2 Execute as migrations

No painel Supabase → SQL Editor, execute em ordem:

```sql
-- Copie e cole o conteúdo de:
supabase/migrations/001_initial.sql
supabase/migrations/002_seed.sql
```

#### 3.3 Configure o Storage

No painel Supabase → Storage:
1. Crie um bucket chamado `assets`
2. Marque como **Public**
3. Em Policies, adicione:
   - **SELECT (read):** `true` (público)
   - **INSERT (upload):** verificar se `is_admin()` retorna true

#### 3.4 Configure o Auth

No painel Supabase → Authentication → URL Configuration:
- Site URL: `http://localhost:3000`
- Redirect URLs: `http://localhost:3000/api/auth/callback`

Para produção, substitua pela URL real do site.

#### 3.5 Adicione um admin

Execute no SQL Editor:
```sql
INSERT INTO public.admin_users (email) VALUES ('seu@email.com');
```

Ou adicione o e-mail em `ADMIN_EMAILS` no `.env.local`.

### 4. Rode localmente

```bash
npm run dev
```

Acesse: http://localhost:3000

---

## Páginas e Rotas

| Rota | Descrição | Acesso |
|------|-----------|--------|
| `/` | Landing page + captura de leads | Público |
| `/catalogo` | Catálogo de produtos com filtros | Público |
| `/ofertas` | Ofertas exclusivas para cadastrados | Autenticado |
| `/cupons` | Cupons de desconto | Autenticado |
| `/admin/dashboard` | Painel com métricas | Admin |
| `/admin/leads` | CRM de leads | Admin |
| `/admin/campanhas` | Gestão de campanhas | Admin |
| `/admin/produtos` | CRUD de produtos | Admin |
| `/admin/config` | Configurações do site + logo | Admin |
| `/admin/login` | Login do admin | Público |

---

## Funcionalidades

### 🎯 Captura de Leads

- Formulário com: Nome, E-mail, WhatsApp + consentimento LGPD
- Detecção de usuário já cadastrado (sessão ativa)
- Magic Link por e-mail como login alternativo
- Auto-reconhecimento: se lead existe, não pede dados novamente

### 🛍️ Catálogo

- Grid de produtos vindos do Supabase
- Filtros por objetivo e categoria
- Modal com opções de compra via Instagram

### 👨‍💼 Admin CRM

- Tabela de leads com busca e filtros
- Exportar CSV
- Copiar mensagem WhatsApp personalizada
- Copiar mensagem DM do Instagram

### 📣 Campanhas

- Criar campanha com: título, mensagem, canal, segmento
- Personalização: `{{nome}}` e `{{instagram}}` na mensagem
- Gerar lista de links WhatsApp (wa.me) por segmento
- Canais: WhatsApp, Instagram DM (texto), E-mail (stub)

### ⚙️ Admin Config

- Upload de logo (substitui no header em tempo real)
- Editar URLs Instagram e WhatsApp
- Storage Supabase para imagens de produtos e logos

---

## Ativar Instagram OAuth (Futuro)

Por padrão, o botão "Entrar com Instagram" redireciona para o perfil @tonhosuplementos (stub).

Para ativar OAuth real:

1. Acesse [developers.facebook.com](https://developers.facebook.com)
2. Crie um App → adicione **Instagram Basic Display**
3. Configure o Redirect URI: `https://seusite.com/api/auth/instagram/callback`
4. Adicione ao `.env.local`:
   ```
   INSTAGRAM_CLIENT_ID=seu-client-id
   INSTAGRAM_CLIENT_SECRET=seu-client-secret
   ```
5. Implemente o callback em `/app/api/auth/instagram/callback/route.ts`:
   - Troque o code por access token
   - Busque perfil do usuário via Graph API
   - Crie sessão Supabase + lead com `instagram_id`

O arquivo `/app/api/auth/instagram/route.ts` já tem a URL OAuth montada quando `INSTAGRAM_CLIENT_ID` está presente.

---

## Estrutura do Projeto

```
/app
  /                     ← Landing page
  /catalogo             ← Catálogo público
  /ofertas              ← Ofertas (autenticado)
  /cupons               ← Cupons (autenticado)
  /admin
    /login              ← Login admin
    /dashboard          ← Métricas
    /leads              ← CRM
    /campanhas          ← Campanhas
    /produtos           ← CRUD produtos
    /config             ← Configurações
  /api
    /auth/...           ← Auth endpoints
    /leads              ← Captura de leads
    /admin/...          ← APIs admin

/components
  /ui                   ← Primitivos (Button, Input, etc.)
  /domain               ← Componentes de negócio
    /admin              ← Componentes do admin

/lib
  /supabase             ← Clients (browser/server) + types
  /auth.ts              ← Helpers de autenticação
  /utils.ts             ← Funções utilitárias

/supabase
  /migrations           ← SQL migrations + seed
```

---

## Deploy (Vercel)

```bash
npm run build
```

1. Conecte o repositório na Vercel
2. Adicione todas as variáveis de ambiente
3. Deploy automático no push

---

## LGPD

- Checkbox de consentimento obrigatório no cadastro
- Campos `consentimento_lgpd` e `consentimento_lgpd_at` na tabela `leads`
- Usuário pode solicitar remoção dos dados (implementar endpoint `/api/leads/delete`)

---

## Notas de Desenvolvimento

### Stubs marcados no código:
- `STUB: Instagram OAuth` — `/app/api/auth/instagram/route.ts`
- Envio real de e-mail — nas Campanhas, canal email é apenas geração de lista
- Envio automático WhatsApp — gera links wa.me, sem envio automático

### Sessão persistida:
- Supabase auth gerencia sessão com refresh automático (padrão 60 dias com `autoRefreshToken: true`)
