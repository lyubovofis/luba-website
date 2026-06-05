<#
  Smoke test - lyubovpsy.com leads pipeline
  -----------------------------------------
  Verifies that a quiz lead is actually saved to Supabase and is readable
  only by the admin. Keys are loaded from ../.env.local (never committed).

  Run:  powershell -ExecutionPolicy Bypass -File tests/smoke-test-leads.ps1
  All green [PASS] = pipeline works.

  NOTE: kept ASCII-only so Windows PowerShell 5.1 runs it regardless of file
  encoding (5.1 reads .ps1 as ANSI and would corrupt Cyrillic literals).
#>

$ErrorActionPreference = "Stop"
$pass = 0; $fail = 0
function Check($name, $cond) {
    if ($cond) { Write-Host "[PASS] $name" -ForegroundColor Green; $script:pass++ }
    else       { Write-Host "[FAIL] $name" -ForegroundColor Red;   $script:fail++ }
}

# --- 1. Load keys from .env.local ---
$envPath = Join-Path $PSScriptRoot "..\.env.local"
if (-not (Test-Path $envPath)) { throw ".env.local not found: $envPath" }
$cfg = @{}
foreach ($line in Get-Content $envPath) {
    if ($line -match '^\s*([A-Z_]+)\s*=\s*(.+)$') { $cfg[$matches[1]] = $matches[2].Trim() }
}
$URL  = $cfg['SUPABASE_URL']
$ANON = $cfg['SUPABASE_ANON_KEY']
$SVC  = $cfg['SUPABASE_SERVICE_ROLE_KEY']
if (-not $URL -or -not $ANON -or -not $SVC) { throw "Missing SUPABASE_URL / ANON / SERVICE_ROLE_KEY in .env.local" }
Write-Host "Project: $URL`n" -ForegroundColor Cyan

$marker = "smoke-$([guid]::NewGuid().ToString('N').Substring(0,8))"
$phone  = "+34000" + (Get-Random -Minimum 100000 -Maximum 999999)

# --- 2. Submit a lead exactly like the quiz does (anon -> RPC submit_quiz_lead) ---
$payload = @{
    name="SMOKE Test"; phone=$phone; email="$marker@test.local"
    quiz_type="money_code_v2"; quiz_answers=@{q1="fear"}; main_block="Smoke"
    utm_source=$marker
} | ConvertTo-Json -Compress
$bytes = [System.Text.Encoding]::UTF8.GetBytes($payload)
try {
    $r = Invoke-WebRequest -Uri "$URL/rest/v1/rpc/submit_quiz_lead" -Method Post `
         -Headers @{apikey=$ANON; Authorization="Bearer $ANON"} -Body $bytes `
         -ContentType "application/json" -UseBasicParsing
    Check "Lead submit (anon RPC) -> 200" ($r.StatusCode -eq 200)
} catch { Check "Lead submit (anon RPC) -> 200" $false }

# --- 3. Lead present in quiz_leads with stage='quiz_new' (read via service_role) ---
$ql = (Invoke-WebRequest -Uri "$URL/rest/v1/quiz_leads?select=stage&utm_source=eq.$marker" `
        -Headers @{apikey=$SVC; Authorization="Bearer $SVC"} -UseBasicParsing).Content | ConvertFrom-Json
Check "Lead in quiz_leads" ($ql.Count -ge 1)
Check "stage = 'quiz_new'" ($ql[0].stage -eq 'quiz_new')

# --- 4. Lead mirrored to crm_leads ---
$cl = (Invoke-WebRequest -Uri "$URL/rest/v1/crm_leads?select=id&utm_source=eq.$marker" `
        -Headers @{apikey=$SVC; Authorization="Bearer $SVC"} -UseBasicParsing).Content | ConvertFrom-Json
Check "Lead in crm_leads" ($cl.Count -ge 1)

# --- 5. SECURITY: anon must NOT be able to read leads (RLS locked) ---
$leak = (Invoke-WebRequest -Uri "$URL/rest/v1/quiz_leads?select=name&utm_source=eq.$marker" `
        -Headers @{apikey=$ANON; Authorization="Bearer $ANON"} -UseBasicParsing).Content | ConvertFrom-Json
Check "RLS: anon canNOT read leads (no leak)" ($leak.Count -eq 0)

# --- 6. Cleanup test data (service_role) ---
foreach ($t in @("quiz_leads","crm_leads")) {
    Invoke-WebRequest -Uri "$URL/rest/v1/$t`?utm_source=eq.$marker" -Method Delete `
        -Headers @{apikey=$SVC; Authorization="Bearer $SVC"} -UseBasicParsing | Out-Null
}
$rest = (Invoke-WebRequest -Uri "$URL/rest/v1/quiz_leads?select=id&utm_source=eq.$marker" `
        -Headers @{apikey=$SVC; Authorization="Bearer $SVC"} -UseBasicParsing).Content | ConvertFrom-Json
Check "Cleanup test data" ($rest.Count -eq 0)

# --- Summary ---
Write-Host "`n========================================" -ForegroundColor Cyan
if ($fail -eq 0) { Write-Host "ALL TESTS PASSED: $pass/$($pass+$fail)" -ForegroundColor Green }
else             { Write-Host "FAILURES: $pass passed, $fail failed" -ForegroundColor Red }
Write-Host "========================================" -ForegroundColor Cyan
exit $fail
