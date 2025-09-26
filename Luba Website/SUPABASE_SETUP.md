# Supabase Setup Guide - Правильная настройка

## 1. Ключи API

```javascript
// PUBLIC - для форм на сайте
const SUPABASE_ANON_KEY = 'eyJhbGc...' 

// ADMIN - только для серверных операций (НЕ в браузере!)
const SUPABASE_SERVICE_KEY = 'eyJhbGc...'
```

## 2. Отключение RLS (для простых проектов)

```sql
-- Отключить RLS полностью
ALTER TABLE quiz_leads DISABLE ROW LEVEL SECURITY;

-- Дать полные права
GRANT ALL ON quiz_leads TO anon;
GRANT ALL ON quiz_leads TO authenticated;
```

## 3. Простые политики RLS (если нужна безопасность)

```sql
-- Включить RLS
ALTER TABLE quiz_leads ENABLE ROW LEVEL SECURITY;

-- Разрешить чтение всем
CREATE POLICY "Public read" ON quiz_leads
FOR SELECT USING (true);

-- Разрешить вставку всем
CREATE POLICY "Public insert" ON quiz_leads
FOR INSERT WITH CHECK (true);

-- Обновление/удаление только для админов
CREATE POLICY "Admin only update" ON quiz_leads
FOR UPDATE USING (auth.jwt() ->> 'email' = 'admin@site.com');
```

## 4. Обработка ошибок

```javascript
async function loadData() {
    try {
        const { data, error } = await supabase
            .from('quiz_leads')
            .select('*')
            .order('created_at', { ascending: false });
        
        if (error) {
            console.error('Supabase error:', error);
            return []; // Fallback
        }
        
        return data || [];
    } catch (error) {
        console.error('Connection error:', error);
        return [];
    }
}
```

## 5. Правильная инициализация

```javascript
// Проверка что Supabase загружен
if (typeof window.supabase !== 'undefined') {
    const { createClient } = window.supabase;
    const supabase = createClient(SUPABASE_URL, SUPABASE_KEY);
} else {
    console.error('Supabase not loaded');
    // Fallback на localStorage или mock data
}
```

## 6. Структура таблиц

```sql
CREATE TABLE quiz_leads (
    id BIGSERIAL PRIMARY KEY,
    name VARCHAR(255),
    phone VARCHAR(50),
    email VARCHAR(255),
    main_block TEXT,
    stage VARCHAR(50) DEFAULT 'quiz_new',
    quiz_answers JSONB,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Индексы для быстрого поиска
CREATE INDEX idx_quiz_leads_created ON quiz_leads(created_at DESC);
CREATE INDEX idx_quiz_leads_stage ON quiz_leads(stage);
```

## Текущий статус нашего проекта

✅ **Настроено правильно:**
- RLS отключен для quiz_leads
- Используется правильная таблица
- Есть обработка ошибок
- Права доступа настроены

⚠️ **Можно улучшить:**
- Добавить service_role ключ для CRM
- Настроить политики для защиты данных
- Добавить резервное сохранение в localStorage
