@echo off
chcp 65001 > nul
title Test CRM - Local Server

echo ========================================
echo   ЗАПУСК ЛОКАЛЬНОГО СЕРВЕРА
echo ========================================
echo.

cd /d "C:\Luba Website"

echo Текущая директория:
cd
echo.

echo Проверка файлов:
if exist "test-crm-connection.html" (
    echo ✓ test-crm-connection.html найден
) else (
    echo ✗ test-crm-connection.html НЕ найден
)

if exist "crm\index.html" (
    echo ✓ crm\index.html найден
) else (
    echo ✗ crm\index.html НЕ найден
)

echo.
echo Запуск Python HTTP Server на порту 8000...
echo Откройте браузер: http://localhost:8000
echo.
echo Для остановки нажмите Ctrl+C
echo.

python -m http.server 8000
