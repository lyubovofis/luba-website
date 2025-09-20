# Luba Website - Денежный Водопад

Сайт для психологической трансформации денежных блоков.

## Технологии
- HTML/CSS/JavaScript
- Supabase для CRM
- Vercel для хостинга
- GitHub для контроля версий

## Деплой

### Деплой через Vercel CLI (основной метод)
GitHub отключен. Используем только локальный деплой.

```bash
cd "C:\Luba Website"
vercel --prod
```

При вопросах выбирайте:
- Link to existing project? **Y**
- Project name: **luba-website**

### Первая настройка Vercel CLI
```bash
npm install -g vercel
vercel login
vercel
# Выберите: Link to existing project -> luba-website
```

## Структура проекта
- `/crm` - CRM система
- `/quiz` - Квиз для сбора лидов  
- `/images` - Изображения
- `/js` - JavaScript файлы
- `/css` - Стили

## Домен
lyubovpsy.com - DNS настроен через Netlify, хостинг на Vercel

## База данных
Supabase - таблицы `crm_leads` и `quiz_leads`