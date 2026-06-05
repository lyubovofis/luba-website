# Tests — lyubovpsy.com

## smoke-test-leads.ps1

End-to-end проверка пайплайна лидов без ручного прохождения квиза.

```powershell
powershell -ExecutionPolicy Bypass -File tests/smoke-test-leads.ps1
```

Что проверяет:
1. Заявка отправляется тем же путём, что и квиз (`anon` → RPC `submit_quiz_lead`)
2. Лид попал в `quiz_leads` со `stage='quiz_new'`
3. Лид продублирован в `crm_leads`
4. **Безопасность:** публичный `anon`-ключ НЕ может прочитать чужие лиды (RLS закрыт)
5. Тест-данные автоматически удаляются

`ALL TESTS PASSED: 6/6` = всё работает. Скрипт не хранит секретов — берёт ключи из `../.env.local`.

## Когда запускать
- После любого изменения в `js/supabase-integration.js`, `supabase-schema.sql` или RLS-политиках
- Если кажется, что заявки перестали приходить
- Раз в неделю как health-check (free-проект Supabase засыпает после ~7 дней простоя)

## Ручной E2E через UI
Реальный квиз: https://lyubovpsy.com/quiz — пройти 9 шагов, отправить, проверить
лида в CRM (https://lyubovpsy.com/crm → вкладка «Квиз»).
