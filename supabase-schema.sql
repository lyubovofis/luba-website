-- ============================================================
--  lyubovpsy.com — Supabase schema (lead capture + analytics)
--  Проект: rtlbzfvvmrwqwhsgybrp
--  Безопасная модель: таблицы закрыты RLS, публичный сайт пишет
--  лиды ТОЛЬКО через SECURITY DEFINER функцию submit_quiz_lead().
--  Публичный anon-ключ НЕ может читать/изменять лиды напрямую.
-- ============================================================

-- ---------- Таблицы ----------
create table if not exists public.quiz_leads (
  id           uuid primary key default gen_random_uuid(),
  created_at   timestamptz not null default now(),
  name         text,
  email        text,
  phone        text,
  age          text,
  quiz_type    text,
  quiz_answers jsonb default '{}'::jsonb,
  main_block   text,
  utm_source   text,
  utm_medium   text,
  utm_campaign text
);

create table if not exists public.crm_leads (
  id           uuid primary key default gen_random_uuid(),
  created_at   timestamptz not null default now(),
  name         text,
  email        text,
  phone        text,
  age          text,
  quiz_type    text,
  quiz_answers jsonb default '{}'::jsonb,
  main_block   text,
  utm_source   text,
  utm_medium   text,
  utm_campaign text,
  source       text default 'quiz',
  stage        text default 'new',
  status       text default 'active'
);

create table if not exists public.landing_analytics (
  id            uuid primary key default gen_random_uuid(),
  created_at    timestamptz not null default now(),
  page_url      text,
  visitor_id    text,
  ip_address    text,
  user_agent    text,
  referrer      text,
  utm_source    text,
  utm_medium    text,
  utm_campaign  text,
  utm_term      text,
  utm_content   text,
  quiz_started  boolean default false,
  quiz_completed boolean default false,
  conversion    boolean default false,
  time_on_page  integer
);

-- ---------- RLS: всё закрыто по умолчанию ----------
alter table public.quiz_leads        enable row level security;
alter table public.crm_leads         enable row level security;
alter table public.landing_analytics enable row level security;

-- Аналитика визитов — некритичные данные, разрешаем anon писать/обновлять
create policy "anon insert analytics" on public.landing_analytics
  for insert to anon with check (true);
create policy "anon update analytics" on public.landing_analytics
  for update to anon using (true) with check (true);

-- Супер-админ CRM (вошедший через Supabase Auth) — полный доступ к лидам.
-- Публичный anon-ключ сюда НЕ попадает: читать заявки может только залогиненный админ.
create policy "auth full quiz_leads" on public.quiz_leads
  for all to authenticated using (true) with check (true);
create policy "auth full crm_leads" on public.crm_leads
  for all to authenticated using (true) with check (true);
create policy "auth read analytics" on public.landing_analytics
  for select to authenticated using (true);

-- ---------- Функция приёма лида (вызывается публичным сайтом) ----------
-- SECURITY DEFINER → вставляет в обе таблицы в обход RLS,
-- при этом anon-ключ НЕ получает прямого доступа к таблицам лидов.
create or replace function public.submit_quiz_lead(
  name         text default null,
  email        text default null,
  phone        text default null,
  age          text default null,
  quiz_type    text default 'main',
  quiz_answers jsonb default '{}'::jsonb,
  main_block   text default null,
  utm_source   text default null,
  utm_medium   text default null,
  utm_campaign text default null
)
returns json
language plpgsql
security definer
set search_path = public
as $$
declare
  new_id uuid;
begin
  insert into public.quiz_leads
    (name, email, phone, age, quiz_type, quiz_answers, main_block,
     utm_source, utm_medium, utm_campaign)
  values
    (name, email, phone, age, quiz_type, coalesce(quiz_answers,'{}'::jsonb), main_block,
     utm_source, utm_medium, utm_campaign)
  returning id into new_id;

  insert into public.crm_leads
    (name, email, phone, age, quiz_type, quiz_answers, main_block,
     utm_source, utm_medium, utm_campaign, source, stage, status)
  values
    (name, email, phone, age, quiz_type, coalesce(quiz_answers,'{}'::jsonb), main_block,
     utm_source, utm_medium, utm_campaign, coalesce(utm_source,'quiz'), 'new', 'active');

  return json_build_object(
    'success', true,
    'id', new_id,
    'message', 'Спасибо! Мы свяжемся с вами в ближайшее время.'
  );
end;
$$;

-- ---------- Функция трекинга визита ----------
create or replace function public.track_landing_visit(
  page_url     text default null,
  visitor_id   text default null,
  ip_address   text default null,
  user_agent   text default null,
  referrer     text default null,
  utm_source   text default null,
  utm_medium   text default null,
  utm_campaign text default null,
  utm_term     text default null,
  utm_content  text default null
)
returns json
language plpgsql
security definer
set search_path = public
as $$
declare
  new_id uuid;
begin
  insert into public.landing_analytics
    (page_url, visitor_id, ip_address, user_agent, referrer,
     utm_source, utm_medium, utm_campaign, utm_term, utm_content)
  values
    (page_url, visitor_id, ip_address, user_agent, referrer,
     utm_source, utm_medium, utm_campaign, utm_term, utm_content)
  returning id into new_id;

  return json_build_object('success', true, 'id', new_id);
end;
$$;

-- ---------- Права на вызов функций для публичного сайта ----------
grant execute on function public.submit_quiz_lead(
  text, text, text, text, text, jsonb, text, text, text, text) to anon;
grant execute on function public.track_landing_visit(
  text, text, text, text, text, text, text, text, text, text) to anon;
