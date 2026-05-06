-- Execute este script no Supabase Dashboard → SQL Editor
-- Cria as tabelas necessárias para o sistema de pagamentos e nossa história

-- 1. Timeline de momentos (Nossa História)
create table if not exists timeline_events (
  id          uuid default gen_random_uuid() primary key,
  year        text not null,
  title       text not null,
  description text,
  position    integer default 0,
  created_at  timestamptz default now()
);

alter table timeline_events enable row level security;

create policy "timeline_read" on timeline_events
  for select using (true);

create policy "timeline_write" on timeline_events
  for all using (auth.role() = 'authenticated');

-- 2. Confirmações de pagamento PIX
create table if not exists payment_confirmations (
  id          uuid default gen_random_uuid() primary key,
  guest_name  text not null,
  gift_id     uuid references gifts(id) on delete set null,
  gift_name   text,
  amount      decimal(10,2),
  message     text,
  created_at  timestamptz default now()
);

alter table payment_confirmations enable row level security;

create policy "confirmations_insert" on payment_confirmations
  for insert with check (true);

create policy "confirmations_read" on payment_confirmations
  for select using (auth.role() = 'authenticated');
