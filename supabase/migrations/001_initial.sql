-- ============================================================
-- TONHO SUPLEMENTOS — Migration 001
-- ============================================================

-- LEADS
CREATE TABLE IF NOT EXISTS public.leads (
  id                    uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  auth_user_id          uuid UNIQUE,
  name                  text,
  email                 text,
  whatsapp              text NOT NULL,
  instagram_username    text,
  instagram_id          text UNIQUE,
  tags                  text[] DEFAULT '{}',
  source                text DEFAULT 'landing',
  consentimento_lgpd    boolean DEFAULT false,
  consentimento_lgpd_at timestamptz,
  created_at            timestamptz DEFAULT now(),
  last_access_at        timestamptz
);

-- PRODUCTS
CREATE TABLE IF NOT EXISTS public.products (
  id          uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name        text NOT NULL,
  description text,
  category    text CHECK (category IN ('whey','creatina','pre-treino','termogenico','vitaminas')) NOT NULL,
  goals       text[] DEFAULT '{}',
  price       numeric(10,2) NOT NULL,
  image_url   text,
  highlight   text CHECK (highlight IN ('mais_vendido','promocao','novo','nenhum')) DEFAULT 'nenhum',
  is_active   boolean DEFAULT true,
  created_at  timestamptz DEFAULT now()
);

-- CAMPAIGNS
CREATE TABLE IF NOT EXISTS public.campaigns (
  id         uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  title      text NOT NULL,
  message    text NOT NULL,
  segment    jsonb DEFAULT '{}',
  channel    text CHECK (channel IN ('whatsapp','email','instagram_dm_text')) NOT NULL,
  status     text CHECK (status IN ('rascunho','enviada')) DEFAULT 'rascunho',
  created_at timestamptz DEFAULT now()
);

-- CAMPAIGN LOGS
CREATE TABLE IF NOT EXISTS public.campaign_logs (
  id          uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  campaign_id uuid REFERENCES public.campaigns(id) ON DELETE CASCADE,
  lead_id     uuid REFERENCES public.leads(id) ON DELETE CASCADE,
  status      text CHECK (status IN ('gerado','enviado','erro')) DEFAULT 'gerado',
  detail      text,
  created_at  timestamptz DEFAULT now()
);

-- SITE CONFIG (single row)
CREATE TABLE IF NOT EXISTS public.site_config (
  id            int PRIMARY KEY DEFAULT 1,
  logo_url      text,
  instagram_url text DEFAULT 'https://www.instagram.com/tonhosuplementos',
  whatsapp_url  text,
  updated_at    timestamptz DEFAULT now()
);

-- Admin users allowlist
CREATE TABLE IF NOT EXISTS public.admin_users (
  id         uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  email      text UNIQUE NOT NULL,
  created_at timestamptz DEFAULT now()
);

-- ============================================================
-- ROW LEVEL SECURITY
-- ============================================================
ALTER TABLE public.leads ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.products ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.campaigns ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.campaign_logs ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.site_config ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.admin_users ENABLE ROW LEVEL SECURITY;

-- Helper: check if current user is admin
CREATE OR REPLACE FUNCTION public.is_admin()
RETURNS boolean LANGUAGE sql SECURITY DEFINER AS $$
  SELECT EXISTS (
    SELECT 1 FROM public.admin_users
    WHERE email = auth.email()
  );
$$;

-- LEADS policies
CREATE POLICY "leads_own_read" ON public.leads
  FOR SELECT USING (auth.uid() = auth_user_id OR public.is_admin());

CREATE POLICY "leads_own_update" ON public.leads
  FOR UPDATE USING (auth.uid() = auth_user_id OR public.is_admin());

CREATE POLICY "leads_insert" ON public.leads
  FOR INSERT WITH CHECK (auth.uid() = auth_user_id OR public.is_admin());

CREATE POLICY "leads_admin_all" ON public.leads
  FOR ALL USING (public.is_admin());

-- PRODUCTS policies
CREATE POLICY "products_public_read" ON public.products
  FOR SELECT USING (is_active = true OR public.is_admin());

CREATE POLICY "products_admin_write" ON public.products
  FOR ALL USING (public.is_admin());

-- CAMPAIGNS policies
CREATE POLICY "campaigns_admin_all" ON public.campaigns
  FOR ALL USING (public.is_admin());

-- CAMPAIGN LOGS policies
CREATE POLICY "campaign_logs_admin_all" ON public.campaign_logs
  FOR ALL USING (public.is_admin());

-- SITE CONFIG policies
CREATE POLICY "site_config_public_read" ON public.site_config
  FOR SELECT USING (true);

CREATE POLICY "site_config_admin_write" ON public.site_config
  FOR ALL USING (public.is_admin());

-- ADMIN USERS policies
CREATE POLICY "admin_users_admin_all" ON public.admin_users
  FOR ALL USING (public.is_admin());
