# 📚 АРХИВ ТЕХНИЧЕСКОЙ ДОКУМЕНТАЦИИ
*Объединенная документация всех технических отчетов и настроек*

---

## 📊 ОТЧЕТЫ ПО ОПТИМИЗАЦИИ

### Из OPTIMIZATION_REPORT.md:
- Оптимизированы изображения (WebP формат)
- Включено gzip сжатие
- Настроен lazy loading
- Минифицированы CSS/JS файлы
- Оптимизированы шрифты
- PageSpeed Insights: 85/100

### Из CRM_AUDIT_REPORT.md:
- CRM интегрирована с Supabase
- Автоматический сбор лидов
- Синхронизация с WhatsApp
- Резервное копирование в localStorage
- Экспорт в CSV

---

## 🎯 ПИКСЕЛИ И ТРЕКИНГ

### Из PIXELS_FULL_AUDIT.md и PIXEL_AUDIT.md:
**Установленные пиксели:**
- Google Analytics: G-ZWF15D45V8
- Facebook Pixel: 2067039850492790
- TikTok Pixel: D3460MRC77U1O98E3OGG
- Hotjar: 6520317

**События отслеживания:**
- PageView
- QuizStart
- QuizComplete
- Lead
- WhatsAppClick
- Conversion

### Из TIKTOK_PIXEL_FIX_PLAN.md и TIKTOK_UPDATE_REPORT.md:
- Пиксель корректно отправляет content_id
- Добавлены value параметры
- Настроен Enhanced Mode
- Файл фикса: /js/tiktok-pixel-fix.js

---

## 💾 БАЗА ДАННЫХ SUPABASE

### Из SUPABASE_NO_POLICIES_SETUP.md и SUPABASE_INTEGRATION_DOCS.md:
**Конфигурация:**
```
URL: https://rntranckosfsnaakjrqh.supabase.co
Anon Key: eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
```

**Таблицы:**
- quiz_leads - лиды из квизов
- crm_leads - основная CRM
- consultations - консультации
- packages - пакеты услуг
- sales - продажи
- landing_analytics - аналитика

**Безопасность:**
- RLS включен на всех таблицах
- Публичный доступ только для записи
- Чтение требует авторизации

---

## 📱 ИНТЕГРАЦИИ

### Из META_WHATSAPP_SETUP.md:
- WhatsApp номер: +34654420334
- Автоматическое перенаправление после квиза
- Кнопки WhatsApp на всех страницах
- UTM метки сохраняются

### Из GOOGLE_SHEETS_CRM_SETUP.md:
- Альтернативный вариант CRM (не используется)
- Основная CRM на Supabase

### Из SIMPLE_DATABASE_ALTERNATIVES.md:
- localStorage как fallback
- EmailJS для отправки уведомлений
- Webhook интеграции

---

## 🚀 ДЕПЛОЙ И ХОСТИНГ

### Настройки Netlify:
- Автодеплой из GitHub
- HTTPS включен
- Домен: lyubovpsy.com
- Файл конфигурации: netlify.toml

### Настройки Vercel:
- Альтернативный хостинг
- Файл конфигурации: vercel.json

---

## 📝 ИНСТРУКЦИИ

### Из HOW_TO_SHARE.md:
**Способы поделиться сайтом:**
1. Прямая ссылка: https://lyubovpsy.com
2. QR-код для офлайн
3. Социальные сети с UTM метками
4. Email рассылка

### Тестирование:
- Страница тестов: /test-supabase.html
- Проверка пикселей: консоль браузера
- CRM вход: /crm/login.html

---

## 🔧 СКРИПТЫ И УТИЛИТЫ

### Python скрипты (архив):
- analyze_tiktok.py - анализ TikTok данных
- tiktok_analysis.py - расширенный анализ
- tiktok_results.py - обработка результатов
- tiktok_simple.py - простая версия

### Конфигурационные файлы:
- .htaccess - настройки Apache
- netlify.toml - конфигурация Netlify
- vercel.json - конфигурация Vercel
- package.json - зависимости проекта

---

*Этот файл содержит всю техническую документацию проекта. Оригинальные файлы можно удалить.*