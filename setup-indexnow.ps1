# Полная автоматизация IndexNow
Write-Host "IndexNow Setup - Avtomaticheskaya setup" -ForegroundColor Green
Write-Host ""
Write-Host "Shag 1: Otkroj https://www.indexnow.org/" -ForegroundColor Yellow
Write-Host "Shag 2: Vstavj https://lyubovpsy.com" 
Write-Host "Shag 3: Nажmi 'Generate'"
Write-Host "Shag 4: Kopiraj poluchennyi API KEY"
Write-Host ""
$apiKey = Read-Host "Vstavj API KEY sdes"

if ($apiKey.Length -lt 20) {
    Write-Host "[-] API Key slisshkom korotkij!" -ForegroundColor Red
    exit
}

# Sokhrani API key v fail
$apiKey | Out-File -FilePath "indexnow-api-key.txt" -Encoding UTF8
Write-Host "[+] API Key sohranjen v indexnow-api-key.txt" -ForegroundColor Green

# Obnovim Python skript s API key
$pythonFile = Get-Content "indexnow-submit.py" -Raw
$pythonFile = $pythonFile -replace 'API_KEY = "TVOJ_API_KEY_ZDES"', "API_KEY = `"$apiKey`""
$pythonFile | Set-Content "indexnow-submit.py"

Write-Host "[+] Python skript updated" -ForegroundColor Green
Write-Host ""
Write-Host "Seichas zapuskayu submit..." -ForegroundColor Yellow
python indexnow-submit.py

