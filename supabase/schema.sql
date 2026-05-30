-- =====================================================================
-- PSICOLOGIA_BOT_MVP — Esquema para Supabase
-- Copia y pega TODO este archivo en el SQL Editor de Supabase y ejecútalo.
-- =====================================================================

-- 1. Tabla de perfiles (extiende auth.users)
create table if not exists public.profiles (
  id uuid primary key references auth.users(id) on delete cascade,
  full_name text,
  created_at timestamptz not null default now()
);

-- 1.b Suscripciones (plan free / pro vía Stripe)
-- Si la tabla profiles ya existía, estas columnas se agregan de forma segura.
alter table public.profiles
  add column if not exists plan text not null default 'free'
    check (plan in ('free', 'pro'));
alter table public.profiles
  add column if not exists subscription_status text;          -- active | trialing | past_due | canceled | ...
alter table public.profiles
  add column if not exists stripe_customer_id text;
alter table public.profiles
  add column if not exists stripe_subscription_id text;
alter table public.profiles
  add column if not exists current_period_end timestamptz;

create index if not exists profiles_stripe_customer_idx
  on public.profiles (stripe_customer_id);

-- 2. Tabla de mensajes de chat
create table if not exists public.messages (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  role text not null check (role in ('user', 'assistant')),
  content text not null,
  created_at timestamptz not null default now()
);

create index if not exists messages_user_id_created_at_idx
  on public.messages (user_id, created_at);

-- 3. Row Level Security
alter table public.profiles enable row level security;
alter table public.messages enable row level security;

-- Políticas: profiles
drop policy if exists "profiles self select" on public.profiles;
create policy "profiles self select" on public.profiles
  for select using (auth.uid() = id);

drop policy if exists "profiles self insert" on public.profiles;
create policy "profiles self insert" on public.profiles
  for insert with check (auth.uid() = id);

drop policy if exists "profiles self update" on public.profiles;
create policy "profiles self update" on public.profiles
  for update using (auth.uid() = id);

-- Políticas: messages (cada usuario solo ve/crea los suyos)
drop policy if exists "messages self select" on public.messages;
create policy "messages self select" on public.messages
  for select using (auth.uid() = user_id);

drop policy if exists "messages self insert" on public.messages;
create policy "messages self insert" on public.messages
  for insert with check (auth.uid() = user_id);

drop policy if exists "messages self delete" on public.messages;
create policy "messages self delete" on public.messages
  for delete using (auth.uid() = user_id);

-- 4. Trigger: crear perfil automáticamente al registrarse un usuario
create or replace function public.handle_new_user()
returns trigger
language plpgsql
security definer set search_path = public
as $$
begin
  insert into public.profiles (id, full_name)
  values (new.id, coalesce(new.raw_user_meta_data->>'full_name', ''));
  return new;
end;
$$;

drop trigger if exists on_auth_user_created on auth.users;
create trigger on_auth_user_created
  after insert on auth.users
  for each row execute function public.handle_new_user();
