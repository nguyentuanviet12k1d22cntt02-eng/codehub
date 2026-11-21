<#
.SYNOPSIS
  Chay AI service (FastAPI) tren may local.

.DESCRIPTION
  Tu chon Python co du thu vien (uvicorn, fastapi, torch), kiem tra cong,
  roi khoi dong uvicorn voi --reload: sua file goc trong ai-service la
  server tu nap lai, khong can chay lai script.

.EXAMPLE
  .\run_local.ps1                 # chay server o cong 8000
  .\run_local.ps1 -Check          # chi kiem tra moi truong, khong chay
  .\run_local.ps1 -Test           # chay test sinh bai tap roi moi khoi dong
  .\run_local.ps1 -Smoke          # kiem tra checkpoint PAL-Net roi moi khoi dong
  .\run_local.ps1 -Port 8001 -NoReload

  Neu PowerShell chan script:
  powershell -ExecutionPolicy Bypass -File .\run_local.ps1
#>
param(
    [int]$Port = 8000,
    [switch]$NoReload,
    [switch]$Check,
    [switch]$Test,
    [switch]$Smoke
)

$ErrorActionPreference = "Stop"
$ServiceDir = $PSScriptRoot
$RepoRoot = Split-Path $ServiceDir -Parent
$env:PYTHONIOENCODING = "utf-8"
$env:PYTHONUTF8 = "1"

function Write-Step([string]$Text) { Write-Host "==> $Text" -ForegroundColor Cyan }
function Write-Ok([string]$Text) { Write-Host "    OK  $Text" -ForegroundColor Green }
function Write-Bad([string]$Text) { Write-Host "    LOI $Text" -ForegroundColor Red }

# 1. Chon Python: uu tien $env:AI_PYTHON, roi Python 3.14 he thong, roi .venv.
Write-Step "Tim Python co du thu vien"
$candidates = @()
if ($env:AI_PYTHON) { $candidates += ,@($env:AI_PYTHON) }
if (Get-Command py -ErrorAction SilentlyContinue) { $candidates += ,@("py", "-3.14") }
$venvPython = Join-Path $RepoRoot ".venv\Scripts\python.exe"
if (Test-Path $venvPython) { $candidates += ,@($venvPython) }
if (Get-Command python -ErrorAction SilentlyContinue) { $candidates += ,@("python") }

$Python = $null
foreach ($candidate in $candidates) {
    $exe = $candidate[0]
    $prefix = @($candidate | Select-Object -Skip 1)
    try {
        & $exe @prefix -c "import uvicorn, fastapi, torch" 2>$null | Out-Null
        if ($LASTEXITCODE -eq 0) { $Python = $candidate; break }
    } catch {}
}
if (-not $Python) {
    Write-Bad "Khong Python nao co du uvicorn + fastapi + torch."
    Write-Host "    Cai thu vien:  py -3.14 -m pip install -r `"$ServiceDir\requirements.txt`""
    exit 1
}
$PyExe = $Python[0]
$PyArgs = @($Python | Select-Object -Skip 1)
$version = & $PyExe @PyArgs -c "import sys, uvicorn; print(sys.version.split()[0], '| uvicorn', uvicorn.__version__, '|', sys.executable)"
Write-Ok "Python $version"

# 2. Kiem tra cau hinh lien quan.
Write-Step "Kiem tra cau hinh"
$backendEnv = Join-Path $RepoRoot "backend\.env"
if (Test-Path $backendEnv) {
    $line = Select-String -Path $backendEnv -Pattern '^\s*AI_SERVICE_URL\s*=' | Select-Object -First 1
    if ($line -and $line.Line -match "(127\.0\.0\.1|localhost):$Port") {
        Write-Ok "backend/.env tro AI_SERVICE_URL ve may local cong $Port"
    } elseif ($line) {
        Write-Host "    CHU Y backend/.env: AI_SERVICE_URL khong tro ve 127.0.0.1:$Port; backend se khong goi server nay." -ForegroundColor Yellow
    } else {
        Write-Host "    CHU Y backend/.env chua co AI_SERVICE_URL." -ForegroundColor Yellow
    }
} else {
    Write-Host "    CHU Y khong thay backend/.env." -ForegroundColor Yellow
}

$busy = $null
try { $busy = Get-NetTCPConnection -LocalPort $Port -State Listen -ErrorAction Stop | Select-Object -First 1 } catch {}
if ($busy) {
    $owner = (Get-Process -Id $busy.OwningProcess -ErrorAction SilentlyContinue).ProcessName
    Write-Bad "Cong $Port dang bi chiem boi '$owner' (PID $($busy.OwningProcess))."
    Write-Host "    Dung no:  Stop-Process -Id $($busy.OwningProcess)   hoac chay voi -Port 8001"
    if (-not $Check) { exit 1 }
} else {
    Write-Ok "Cong $Port con trong"
}

if ($Check) { Write-Step "Chi kiem tra (-Check): xong."; exit 0 }

Push-Location $ServiceDir
try {
    # 3. Tuy chon: test nhanh luong sinh bai tap (khong goi LLM, khong ghi DB).
    if ($Test) {
        Write-Step "Chay test luong sinh bai tap"
        & $PyExe @PyArgs -m pytest -q -p no:cacheprovider `
            tests/test_list_generation_regression.py `
            tests/test_set_generation_regression.py `
            tests/test_constrained_exercise_repair.py `
            tests/test_batch_failure_regression.py
        if ($LASTEXITCODE -ne 0) { Write-Bad "Test that bai; khong khoi dong server."; exit 1 }
        Write-Ok "Test qua"
    }

    # 4. Tuy chon: kiem tra checkpoint PAL-Net that (khong ghi DB, khong goi LLM).
    if ($Smoke) {
        Write-Step "Kiem tra checkpoint PAL-Net"
        & $PyExe @PyArgs (Join-Path $ServiceDir "scripts\smoke_palnet_local.py")
        if ($LASTEXITCODE -ne 0) { Write-Bad "Smoke test that bai; khong khoi dong server."; exit 1 }
        Write-Ok "Checkpoint san sang"
    }

    # 5. Khoi dong server.
    $uvicornArgs = @("-m", "uvicorn", "main:app", "--host", "127.0.0.1", "--port", "$Port")
    if (-not $NoReload) { $uvicornArgs += @("--reload") }
    Write-Step "Khoi dong AI service tai http://127.0.0.1:$Port  (Ctrl+C de dung)"
    Write-Host "    Dong 'PAL-Net not ready: NO_SERVING_CHECKPOINT' la binh thuong (loader cu)." -ForegroundColor DarkGray
    & $PyExe @PyArgs @uvicornArgs
} finally {
    Pop-Location
}
