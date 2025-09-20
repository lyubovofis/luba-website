# Анализ TikTok Ads - Денежный Водопад
# Введите данные ваших кампаний ниже

campaigns = [
    # Пример формата (замените на ваши данные):
    # {'name': 'Название', 'ctr': 1.5, 'cpc': 0.50, 'spend': 100, 'conversions': 5},
]

print("📊 АНАЛИЗ ЭФФЕКТИВНОСТИ TIKTOK ADS")
print("="*50)

if not campaigns:
    print("\n⚠️ ВСТАВЬТЕ ДАННЫЕ КАМПАНИЙ В ФАЙЛ!")
    print("\nПример формата:")
    print("{'name': 'Боли аудитории', 'ctr': 1.8, 'cpc': 0.45, 'spend': 150, 'conversions': 7}")
    print("\nОсновные метрики для анализа:")
    print("- CTR > 1.5% = хорошо")
    print("- CPC < €0.50 = отлично") 
    print("- Конверсии > 0 = есть результат")
else:
    # Анализ
    total_spend = sum(c['spend'] for c in campaigns)
    total_conversions = sum(c['conversions'] for c in campaigns)
    
    print(f"\nВсего кампаний: {len(campaigns)}")
    print(f"Общий расход: €{total_spend}")
    print(f"Всего конверсий: {total_conversions}")
    
    # Сортировка по эффективности
    for c in campaigns:
        c['score'] = (c['ctr'] * c['conversions']) / (c['cpc'] * 10)
    
    campaigns.sort(key=lambda x: x['score'], reverse=True)
    
    print("\n🏆 РЕЙТИНГ КАМПАНИЙ:")
    for i, c in enumerate(campaigns, 1):
        status = "✅" if c['ctr'] > 1.5 and c['cpc'] < 0.5 else "⚠️"
        print(f"{i}. {status} {c['name']}")
        print(f"   CTR: {c['ctr']}% | CPC: €{c['cpc']} | Конверсии: {c['conversions']}")

print("\n💡 КРИТЕРИИ ПОБЕДИТЕЛЕЙ:")
print("✅ Масштабировать: CTR > 1.5%, CPC < €0.50")
print("⚠️ Оптимизировать: CTR 0.8-1.5%, CPC €0.50-1.00")
print("❌ Остановить: CTR < 0.8% или CPC > €1.00")
