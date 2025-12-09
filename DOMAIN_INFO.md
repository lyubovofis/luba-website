# ДОМЕН И DNS НАСТРОЙКИ

## 🌐 Основной домен
**lyubovpsy.com**

---

## 📋 Netlify DNS настройки

### A-записи (для корневого домена):
```
Type: A
Name: @
Value: 75.2.60.5
TTL: 3600
```

### CNAME-записи (для www):
```
Type: CNAME
Name: www
Value: denezhnyivodopad.netlify.app
TTL: 3600
```

### Дополнительные записи (опционально):
```
Type: CNAME
Name: quiz
Value: denezhnyivodopad.netlify.app
TTL: 3600

Type: CNAME
Name: crm
Value: denezhnyivodopad.netlify.app
TTL: 3600
```

---

## 🔧 Netlify Settings

### Custom Domain Settings:
1. Зайти в Netlify Dashboard
2. Выбрать сайт "denezhnyivodopad"
3. Domain settings → Add custom domain
4. Ввести: `lyubovpsy.com`
5. Добавить также: `www.lyubovpsy.com`

### SSL Certificate:
- Netlify автоматически выдаст Let's Encrypt SSL сертификат
- HTTPS будет работать через ~30 минут после добавления домена

### Redirects (_redirects файл):
```
# Redirect www to non-www
https://www.lyubovpsy.com/* https://lyubovpsy.com/:splat 301!

# Redirect old domain (if needed)
https://denezhnyivodopad.netlify.app/* https://lyubovpsy.com/:splat 301!

# Quiz routes
/quiz /quiz-test/ 200
/test /quiz-test/ 200

# CRM with auth
/crm/* /crm/:splat 200
```

---

## 📧 Email DNS Records (если нужна почта на домене)

### Google Workspace / Gmail:
```
Type: MX
Priority: 1
Value: aspmx.l.google.com

Priority: 5
Value: alt1.aspmx.l.google.com

Priority: 5  
Value: alt2.aspmx.l.google.com

Priority: 10
Value: alt3.aspmx.l.google.com

Priority: 10
Value: alt4.aspmx.l.google.com
```

### SPF Record:
```
Type: TXT
Name: @
Value: v=spf1 include:_spf.google.com ~all
```

---

## 🔗 URLs после настройки домена

### Главная страница:
- https://lyubovpsy.com

### Квиз:
- https://lyubovpsy.com/quiz-test/
- https://lyubovpsy.com/quiz/ (redirect)
- https://lyubovpsy.com/test/ (redirect)

### CRM:
- https://lyubovpsy.com/crm/
- https://lyubovpsy.com/crm/login.html

### Политики:
- https://lyubovpsy.com/privacy.html
- https://lyubovpsy.com/terms.html
- https://lyubovpsy.com/disclaimer.html

---

## ✅ Checklist после подключения домена

- [ ] DNS записи добавлены у регистратора
- [ ] Домен добавлен в Netlify
- [ ] SSL сертификат активен
- [ ] www редирект работает
- [ ] Все страницы открываются
- [ ] Квиз работает и сохраняет лиды
- [ ] CRM доступна
- [ ] WhatsApp ссылки работают
- [ ] Пиксели трекают (FB, TikTok, GA4)
- [ ] Обновить мета-теги с новым доменом

---

## 🔄 Обновить после подключения домена

### В HTML файлах (найти и заменить):
```
Старые URL:
https://denezhnyivodopad.netlify.app

Новые URL:
https://lyubovpsy.com
```

### Meta tags (в head секции):
```html
<!-- Open Graph -->
<meta property="og:url" content="https://lyubovpsy.com">
<meta property="og:image" content="https://lyubovpsy.com/images/og-image.jpg">

<!-- Twitter -->
<meta property="twitter:url" content="https://lyubovpsy.com">
<meta property="twitter:image" content="https://lyubovpsy.com/images/og-image.jpg">

<!-- Canonical -->
<link rel="canonical" href="https://lyubovpsy.com">
```

---

## 📞 Контакты

**Email:** care@lyubovpsy.com  
**WhatsApp:** +34654420334  
**Telegram:** @LyubovUA  
**Website:** https://lyubovpsy.com

---

## 📝 Проверка DNS (команды)

```bash
# Проверить A-запись
nslookup lyubovpsy.com

# Проверить CNAME
nslookup www.lyubovpsy.com

# Проверить MX записи
nslookup -type=mx lyubovpsy.com

# Проверить все записи
dig lyubovpsy.com ANY
```

---

## 🌍 Проверка распространения DNS

После добавления DNS записей используйте:
- https://www.whatsmydns.net
- Введите: lyubovpsy.com
- Проверьте типы: A, CNAME, MX

DNS может распространяться до 48 часов, но обычно 1-4 часа.

---

**Последнее обновление:** 2025-01-17
