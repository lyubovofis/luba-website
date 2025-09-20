-- Добавление колонки age в таблицу crm_leads
ALTER TABLE public.crm_leads 
ADD COLUMN IF NOT EXISTS age INTEGER;