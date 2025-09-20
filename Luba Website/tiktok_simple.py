# -*- coding: utf-8 -*-
import json

# Пример данных TikTok кампаний
campaigns = [
    {"name": "Боли_аудитории_v1", "impressions": 15234, "clicks": 187, "ctr": 1.23, "cpc": 0.42, "spend": 78.54, "conversions": 3},
    {"name": "Зависть_подругам", "impressions": 22156, "clicks": 412, "ctr": 1.86, "cpc": 0.35, "spend": 144.20, "conversions": 7},
    {"name": "От_1500_до_6000", "impressions": 18734, "clicks": 156, "ctr": 0.83, "cpc": 0.68, "spend": 106.08, "conversions": 2},
    {"name": "Поток_изобилия", "impressions": 25432, "clicks": 523, "ctr": 2.06, "cpc": 0.31, "spend": 162.13, "conversions": 9},
    {"name": "Токсичные_установки", "impressions": 12567, "clicks": 87, "ctr": 0.69, "cpc": 0.92, "spend": 80.04, "conversions": 1},
    {"name": "Денежный_водопад", "impressions": 31245, "clicks": 687, "ctr": 2.20, "cpc": 0.28, "spend": 192.36, "conversions": 12},
    {"name": "Кайф_от_работы", "impressions": 19876, "clicks": 298, "ctr": 1.50, "cpc": 0.45, "spend": 134.10, "conversions": 5},
    {"name": "История_Марины", "impressions": 16543, "clicks": 412, "ctr": 2.49, "cpc": 0.33, "spend": 135.96, "conversions": 8}
]

print("="*60)
print("ANALIZ TIKTOK ADS - PROEKT 'DENEZHNYJ VODOPAD'")
print("="*60)

# Общие метрики
total_spend = sum(c['spend'] for c in campaigns)
total_clicks = sum(c['clicks'] for c in campaigns)
total_conversions = sum(c['conversions'] for c in campaigns)
total_impressions = sum(c['impressions'] for c in campaigns)

print(f"\nOBSHAYA STATISTIKA (09-16.09.2025):")
print(f"Kampanij: {len(campaigns)}")
print(f"Rashod: EUR {total_spend:.2f}")
print(f"Pokazy: {total_impressions:,}")
print(f"Kliki: {total_clicks}")
print(f"Konversii: {total_conversions}")
print(f"Srednij CTR: {(total_clicks/total_impressions*100):.2f}%")
print(f"Srednij CPC: EUR {(total_spend/total_clicks):.2f}")
print(f"CPA: EUR {(total_spend/total_conversions):.2f}")

# Анализ эффективности
for c in campaigns:
    c['score'] = (c['ctr'] * c['conversions']) / (c['cpc'] * 10)

campaigns.sort(key=lambda x: x['score'], reverse=True)

print("\nREJTING KAMPANIJ:")
for i, c in enumerate(campaigns[:5], 1):
    status = "[OK]" if c['ctr'] > 1.5 and c['cpc'] < 0.5 else "[!]"
    print(f"\n{i}. {status} {c['name']}")
    print(f"   CTR: {c['ctr']:.2f}% | CPC: EUR {c['cpc']:.2f} | Konversii: {c['conversions']}")
    print(f"   ROI: {'VYSOKIJ' if c['score'] > 1 else 'SREDNIJ'}")

# Победители и проигравшие
winners = [c for c in campaigns if c['ctr'] > 1.5 and c['cpc'] < 0.5]
losers = [c for c in campaigns if c['ctr'] < 1.0 or c['cpc'] > 0.7]

print("\n[+] MASSHTABIROVAT' ({} kampanij):".format(len(winners)))
for c in winners[:3]:
    print(f"   - {c['name']} -> uvelichit' byudzhet x2-3")

print("\n[-] OSTANOVIT' ({} kampanij):".format(len(losers)))
for c in losers[:3]:
    print(f"   - {c['name']} -> CTR {c['ctr']:.2f}%, CPC EUR {c['cpc']:.2f}")

print("\nREKOMENDACII:")
print("1. Lidery: 'Denezhnyj_vodopad' i 'Istoriya_Mariny' - masshtabirovat'")
print("2. Sozdat' bol'she video s istoriyami klientok (vysokij CTR)")
print("3. Tema 'Potok_izobiliya' rezoniruet - razvivat'")
print("4. Optimal'nyj CPC dlya nishi: EUR 0.30-0.40")

print("\nSLEDUYUSHIE SHAGI:")
print("- Pereraspredelit' EUR 200+ s neeffektivnyh na top-3")
print("- A/B test novyh hukov v pervye 3 sekundy")
print("- Dobavit' retargeting na prosmotrevshih 75% video")