-- ============================================================================
-- SUPABASE SCHEMA — Cronograma Mestrado S. cumini
-- ============================================================================
-- Cole TODO este script no SQL Editor do seu projeto Supabase e clique em RUN
-- (Dashboard → SQL Editor → New query → cole → RUN)
-- ============================================================================

-- 1) TABELA DE PROGRESSO DE TAREFAS
-- ----------------------------------------------------------------------------
create table if not exists public.task_progress (
  task_id        text primary key,
  done           boolean not null default false,
  completed_at   timestamptz,
  note           text,
  updated_at     timestamptz not null default now()
);

comment on table public.task_progress is
  'Progresso de cada tarefa do cronograma de mestrado (S. cumini)';

-- 2) TABELA DE STATUS DE PARCERIAS
-- ----------------------------------------------------------------------------
create table if not exists public.partner_status (
  partner_id     text primary key,
  status         text not null default 'pending'
                   check (status in ('pending', 'negotiating', 'confirmed')),
  contact_date   date,
  last_contact   date,
  notes          text,
  updated_at     timestamptz not null default now()
);

comment on table public.partner_status is
  'Status de negociação com laboratórios parceiros (UFPB, LIMAV, IFPI, UFPI, UECE)';

-- 3) TRIGGER PARA ATUALIZAR updated_at AUTOMATICAMENTE
-- ----------------------------------------------------------------------------
create or replace function public.touch_updated_at()
returns trigger
language plpgsql
as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

drop trigger if exists trg_task_progress_updated on public.task_progress;
create trigger trg_task_progress_updated
  before update on public.task_progress
  for each row execute function public.touch_updated_at();

drop trigger if exists trg_partner_status_updated on public.partner_status;
create trigger trg_partner_status_updated
  before update on public.partner_status
  for each row execute function public.touch_updated_at();

-- 4) ROW-LEVEL SECURITY (RLS)
-- ----------------------------------------------------------------------------
-- Como é um app pessoal/single-user usando apenas a anon key,
-- liberamos leitura e escrita públicas. Para multi-usuário troque
-- por políticas baseadas em auth.uid().
-- ----------------------------------------------------------------------------
alter table public.task_progress  enable row level security;
alter table public.partner_status enable row level security;

drop policy if exists "anon read task_progress"   on public.task_progress;
drop policy if exists "anon write task_progress"  on public.task_progress;
drop policy if exists "anon read partner_status"  on public.partner_status;
drop policy if exists "anon write partner_status" on public.partner_status;

create policy "anon read task_progress"
  on public.task_progress for select
  using (true);

create policy "anon write task_progress"
  on public.task_progress for all
  using (true) with check (true);

create policy "anon read partner_status"
  on public.partner_status for select
  using (true);

create policy "anon write partner_status"
  on public.partner_status for all
  using (true) with check (true);

-- 5) HABILITAR REALTIME (opcional — sincroniza entre dispositivos em tempo real)
-- ----------------------------------------------------------------------------
alter publication supabase_realtime add table public.task_progress;
alter publication supabase_realtime add table public.partner_status;

-- ============================================================================
-- PRONTO! Agora copie do Dashboard:
--   • Project URL  (Settings → API → Project URL)
--   • anon public key  (Settings → API → Project API keys → anon public)
-- e cole no app no botão "☁ Configurar Supabase".
-- ============================================================================
