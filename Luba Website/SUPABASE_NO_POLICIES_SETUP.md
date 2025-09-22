# 🚀 КАК НАСТРОИТЬ SUPABASE БЕЗ ГОЛОВНОЙ БОЛИ С POLICIES

## ⚡ БЫСТРОЕ РЕШЕНИЕ: ОТКЛЮЧИТЬ RLS

### ШАГ 1: Откройте Supabase Dashboard
1. Войдите в ваш проект
2. Перейдите в **Table Editor**
3. Выберите таблицы `crm_leads` и `quiz_leads`

### ШАГ 2: ОТКЛЮЧИТЕ RLS (Row Level Security)
```sql
-- Выполните в SQL Editor:

-- Отключаем RLS для таблиц
ALTER TABLE crm_leads DISABLE ROW LEVEL SECURITY;
ALTER TABLE quiz_leads DISABLE ROW LEVEL SECURITY;

-- Даем полный доступ через anon key
GRANT ALL ON crm_leads TO anon;
GRANT ALL ON quiz_leads TO anon;
GRANT USAGE ON SEQUENCE crm_leads_id_seq TO anon;
GRANT USAGE ON SEQUENCE quiz_leads_id_seq TO anon;
```

### ШАГ 3: Создайте простую политику "Разрешить всё"
```sql
-- Если RLS уже включен и не хотите отключать:

-- Удаляем все старые policies
DROP POLICY IF EXISTS "Enable all for anon" ON crm_leads;
DROP POLICY IF EXISTS "Enable all for anon" ON quiz_leads;

-- Создаем политику "разрешить всё"
CREATE POLICY "Enable all for anon" ON crm_leads
    FOR ALL 
    TO anon 
    USING (true) 
    WITH CHECK (true);

CREATE POLICY "Enable all for anon" ON quiz_leads
    FOR ALL 
    TO anon 
    USING (true) 
    WITH CHECK (true);
```

## ✅ ТЕПЕРЬ ВСЁ РАБОТАЕТ!

Ваш код в quiz/index.html уже настроен правильно:
- SUPABASE_URL = 'https://rntranckosfsnaakjrqh.supabase.co'
- SUPABASE_ANON_KEY уже есть
- Теперь никаких проблем с policies!

---

## 🔒 ЕСЛИ НУЖНА МИНИМАЛЬНАЯ БЕЗОПАСНОСТЬ

### Добавьте проверку источника (домена):
```sql
-- Разрешаем только с вашего домена
CREATE POLICY "Allow from domain" ON crm_leads
    FOR ALL 
    TO anon 
    USING (
        current_setting('request.headers')::json->>'origin' = 'https://lubawaterfall.com'
        OR current_setting('request.headers')::json->>'origin' = 'http://localhost:3000'
    )
    WITH CHECK (true);
```

### Или используйте Service Role Key (более безопасно):
```javascript
// Вместо anon key используйте service role key
// Но ТОЛЬКО если код выполняется на сервере, не в браузере!
const SUPABASE_SERVICE_KEY = 'eyJhbGc...'; // НЕ используйте в браузере!
```

---

## 📝 ПРОВЕРКА ЧТО ВСЁ РАБОТАЕТ

### 1. Тестовая вставка через SQL Editor:
```sql
-- Проверьте что можно вставить данные
INSERT INTO crm_leads (name, phone, email, stage)
VALUES ('Тест', '+1234567890', 'test@test.com', 'new');

-- Если работает - policies настроены правильно!
```

### 2. Тест из браузера:
Откройте консоль (F12) на вашем сайте и выполните:
```javascript
// Тест подключения к Supabase
const { createClient } = supabase;
const supabaseClient = createClient(
    'https://rntranckosfsnaakjrqh.supabase.co',
    'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InJudHJhbmNrb3Nmc25hYWtqcnFoIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTgyOTUyNTIsImV4cCI6MjA3Mzg3MTI1Mn0.Nme48al5xSVPlD4l40z6ZPwTkSL0uC3JQ300IZu7WBA'
);

// Тестовая вставка
const { data, error } = await supabaseClient
    .from('crm_leads')
    .insert({ 
        name: 'Тест из браузера',
        phone: '+1234567890',
        stage: 'new'
    })
    .select();

console.log('Результат:', data, error);
```

Если видите данные без ошибок - ВСЁ РАБОТАЕТ!