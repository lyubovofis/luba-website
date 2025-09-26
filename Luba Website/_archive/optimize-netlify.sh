# Оптимизация для Netlify - сохранить место

# 1. Сжать изображения (уменьшит размер на 70%)
# Используйте https://tinypng.com для всех изображений в /images

# 2. Удалить неиспользуемые файлы
rm analyze_tiktok.py
rm tiktok_*.py
rm fix-pixel.html
rm pixel-fix-instruction.html
rm HOW_TO_SHARE.md
rm META_WHATSAPP_SETUP.md
rm OPTIMIZATION_REPORT.md

# 3. Минификация CSS/JS
# Используйте https://www.minifier.org/

# 4. Создать .gitignore для исключения лишнего
echo "*.log
*.tmp
.DS_Store
node_modules/
*.py
*.md
.vscode/
test/
docs/" > .gitignore

# 5. Очистить Git историю (освободит место)
git rm -r --cached .
git add .
git commit -m "Clean repo"
git push --force origin main