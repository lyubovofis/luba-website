# 🚀 КАК ЗАПУСТИТЬ И ПОДЕЛИТЬСЯ САЙТОМ

## СПОСОБ 1: ЛОКАЛЬНЫЙ СЕРВЕР + NGROK (Рекомендуется)

### Шаг 1: Запустите локальный сервер
1. Дважды кликните на файл `start_server.bat`
2. Откроется окно командной строки
3. Сайт будет доступен по адресу: http://localhost:8000/landing-detailed.html

### Шаг 2: Сделайте сайт доступным из интернета через ngrok
1. Скачайте ngrok: https://ngrok.com/download
2. Распакуйте в папку C:\Luba Website
3. Откройте новую командную строку
4. Выполните команду: `ngrok http 8000`
5. Получите публичный URL вида: https://xxxxx.ngrok.io
6. Отправьте другу ссылку: https://xxxxx.ngrok.io/landing-detailed.html

---

## СПОСОБ 2: GITHUB PAGES (Бесплатный хостинг)

### Шаг 1: Создайте репозиторий на GitHub
1. Зарегистрируйтесь на https://github.com
2. Создайте новый репозиторий (например, luba-website)
3. Загрузите все файлы из папки C:\Luba Website

### Шаг 2: Включите GitHub Pages
1. Зайдите в Settings репозитория
2. Найдите раздел "Pages"
3. Source: Deploy from a branch
4. Branch: main, folder: / (root)
5. Save

### Шаг 3: Получите ссылку
Через 2-3 минуты сайт будет доступен по адресу:
https://ваш-username.github.io/luba-website/landing-detailed.html

---

## СПОСОБ 3: NETLIFY DROP (Самый быстрый)

1. Откройте https://app.netlify.com/drop
2. Перетащите папку C:\Luba Website на страницу
3. Подождите загрузку
4. Получите мгновенную ссылку вида: https://amazing-site-123.netlify.app
5. Добавьте /landing-detailed.html к ссылке

---

## СПОСОБ 4: SURGE.SH (Через командную строку)

1. Установите Node.js с https://nodejs.org
2. Откройте командную строку
3. Выполните: `npm install -g surge`
4. Перейдите в папку: `cd "C:\Luba Website"`
5. Запустите: `surge`
6. Выберите домен или используйте предложенный
7. Получите ссылку: https://ваш-домен.surge.sh/landing-detailed.html

---

## СПОСОБ 5: ИСПОЛЬЗОВАНИЕ PYTHON ANYWHERE

1. Зарегистрируйтесь на https://www.pythonanywhere.com (бесплатно)
2. Загрузите файлы через Files
3. Настройте Web app
4. Получите ссылку: https://ваш-username.pythonanywhere.com

---

## 📱 ДЛЯ БЫСТРОГО ТЕСТА НА ТЕЛЕФОНЕ

Если компьютер и телефон в одной WiFi сети:
1. Запустите start_server.bat
2. Узнайте IP вашего компьютера (команда `ipconfig` в cmd)
3. На телефоне откройте: http://ВАШ-IP:8000/landing-detailed.html
   Например: http://192.168.1.100:8000/landing-detailed.html

---

## ⚡ САМЫЙ БЫСТРЫЙ СПОСОБ

**Netlify Drop** - просто перетащите папку и получите ссылку за 30 секунд!

---

## 📌 ПРИМЕЧАНИЯ

- Все способы бесплатные
- Netlify и Surge дают случайные поддомены бесплатно
- GitHub Pages требует аккаунт
- ngrok работает 8 часов для бесплатного аккаунта
- После тестирования можно купить домен и хостинг для постоянного размещения

---

## 🆘 ЕСЛИ НУЖНА ПОМОЩЬ

Самый простой вариант - Netlify Drop:
1. Откройте https://app.netlify.com/drop
2. Перетащите папку C:\Luba Website
3. Готово! Отправьте ссылку другу