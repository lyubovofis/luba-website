-- Создание таблицы crm_leads
CREATE TABLE IF NOT EXISTS public.crm_leads (
    id SERIAL PRIMARY KEY,
    name VARCHAR(255),
    phone VARCHAR(50),
    email VARCHAR(255),
    stage VARCHAR(50) DEFAULT 'new',
    source VARCHAR(100),
    note TEXT,
    amount DECIMAL(10,2) DEFAULT 0,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Отключить RLS для таблицы
ALTER TABLE public.crm_leads DISABLE ROW LEVEL SECURITY;