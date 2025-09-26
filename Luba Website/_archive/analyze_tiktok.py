import pandas as pd
import sys
import os

# Пробуем найти файл
file_paths = [
    r'ФОП Лукащук ЛюбовCampaign Report20250909 to 20250916.xlsx',
    r'C:\Users\%USERNAME%\Downloads\ФОП Лукащук ЛюбовCampaign Report20250909 to 20250916.xlsx',
    r'Campaign Report.xlsx'
]

df = None
for path in file_paths:
    path = os.path.expandvars(path)
    if os.path.exists(path):
        print(f"Файл найден: {path}")
        df = pd.read_excel(path)
        break

if df is None:
    print("Excel файл не найден. Введите данные вручную:")
    print("\nПример данных для анализа:")
    data = {
        'Campaign': ['Кампания 1', 'Кампания 2', 'Кампания 3'],
        'Impressions': [10000, 15000, 8000],
        'Clicks': [150, 300, 120],
        'CTR': [1.5, 2.0, 1.5],
        'CPC': [0.50, 0.35, 0.60],
        'Spend': [75, 105, 72],
        'Conversions': [3, 7, 2]
    }
    df = pd.DataFrame(data)

print("\n📊 АНАЛИЗ TIKTOK ADS")
print("="*50)
print(f"Всего кампаний: {len(df)}")
print("\nОсновные метрики:")
print(df.describe())

# Расчет эффективности
if 'CTR' in df.columns and 'CPC' in df.columns:
    df['Efficiency_Score'] = (df['CTR'] / df['CPC'].replace(0, 1))
    
    print("\n🏆 ТОП-3 КАМПАНИИ:")
    top = df.nlargest(3, 'Efficiency_Score')[['Campaign', 'CTR', 'CPC', 'Efficiency_Score']]
    print(top.to_string(index=False))
    
    print("\n❌ ХУДШИЕ КАМПАНИИ:")
    bottom = df.nsmallest(2, 'Efficiency_Score')[['Campaign', 'CTR', 'CPC']]
    print(bottom.to_string(index=False))

print("\n💡 РЕКОМЕНДАЦИИ:")
print("1. Масштабировать кампании с CTR > 1.5% и CPC < $0.50")
print("2. Остановить кампании с CTR < 0.5%")
print("3. Оптимизировать креативы для кампаний с CPC > $1")
