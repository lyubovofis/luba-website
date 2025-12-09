# Настройка Supabase для CRM

1. Создайте аккаунт на supabase.com
2. Создайте новый проект
3. В SQL Editor выполните:

```sql
CREATE TABLE leads (
  id SERIAL PRIMARY KEY,
  name TEXT,
  phone TEXT,
  email TEXT,
  message TEXT,
  source TEXT,
  campaign TEXT,
  stage TEXT DEFAULT 'new',
  tags TEXT[],
  created_at TIMESTAMP DEFAULT NOW()
);
```

4. Получите URL и ключ в Settings → API
5. Добавьте в Render Environment Variables:
   - SUPABASE_URL
   - SUPABASE_KEY
