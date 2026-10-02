<#
.SYNOPSIS
  Chạy Newsora (trang báo + trang quản trị /admin + API) bằng một lệnh.

.DESCRIPTION
  Backend (Payload CMS) và frontend nằm chung trong một app Next.js nên chỉ cần một tiến trình.
  Script tự động: kiểm tra Node.js, cài dependencies, tạo .env (kèm PAYLOAD_SECRET ngẫu nhiên),
  chuẩn bị database, (tuỳ chọn) tạo dữ liệu mẫu, rồi khởi động server.

.PARAMETER Mode
  dev  (mặc định) - chế độ phát triển, tự reload khi sửa code
  prod            - build bản production rồi chạy

.PARAMETER Seed
  Tạo dữ liệu mẫu (chuyên mục, bài viết). Chạy lại nhiều lần vẫn an toàn.

.PARAMETER Port
  Cổng chạy server, mặc định 3000.

.EXAMPLE
  powershell -ExecutionPolicy Bypass -File .\deploy\run.ps1
  powershell -ExecutionPolicy Bypass -File .\deploy\run.ps1 -Seed
  powershell -ExecutionPolicy Bypass -File .\deploy\run.ps1 -Mode prod -Port 8080
#>
param(
  [ValidateSet('dev', 'prod')]
  [string]$Mode = 'dev',
  [switch]$Seed,
  [int]$Port = 3000
)

$ErrorActionPreference = 'Stop'
[Console]::OutputEncoding = [System.Text.Encoding]::UTF8

$Root = Split-Path -Parent $PSScriptRoot
Set-Location $Root

function Write-Step([string]$Message) {
  Write-Host "==> $Message" -ForegroundColor Cyan
}

function Invoke-Npm([string[]]$NpmArgs) {
  & npm @NpmArgs
  if ($LASTEXITCODE -ne 0) {
    throw "Lệnh 'npm $($NpmArgs -join ' ')' thất bại (exit code $LASTEXITCODE)."
  }
}

function Get-EnvValue([string]$Path, [string]$Name) {
  $line = Get-Content $Path | Where-Object { $_ -match "^\s*$Name\s*=" } | Select-Object -First 1
  if ($line) { return ($line -split '=', 2)[1].Trim() }
  return $null
}

# 1. Node.js
Write-Step 'Kiểm tra Node.js'
if (-not (Get-Command node -ErrorAction SilentlyContinue)) {
  throw 'Chưa cài Node.js. Tải bản LTS tại https://nodejs.org rồi chạy lại script.'
}
$nodeVersion = [version](node -p 'process.versions.node')
if ($nodeVersion -lt [version]'20.9.0') {
  throw "Cần Node.js >= 20.9, máy đang có $nodeVersion."
}
Write-Host "    Node.js $nodeVersion"

# 2. Cổng
$busy = Get-NetTCPConnection -LocalPort $Port -State Listen -ErrorAction SilentlyContinue
if ($busy) {
  throw "Cổng $Port đang được dùng (PID $($busy[0].OwningProcess)). Tắt tiến trình đó hoặc chạy với -Port <cổng khác>."
}

# 3. File .env
$envFile = Join-Path $Root '.env'
if (-not (Test-Path $envFile)) {
  Write-Step 'Tạo file .env từ .env.example'
  $bytes = New-Object byte[] 24
  [System.Security.Cryptography.RandomNumberGenerator]::Create().GetBytes($bytes)
  $secret = -join ($bytes | ForEach-Object { $_.ToString('x2') })

  $content = (Get-Content (Join-Path $Root '.env.example') -Raw) `
    -replace 'PAYLOAD_SECRET=YOUR_SECRET_HERE', "PAYLOAD_SECRET=$secret" `
    -replace 'NEXT_PUBLIC_SERVER_URL=.*', "NEXT_PUBLIC_SERVER_URL=http://localhost:$Port"
  [System.IO.File]::WriteAllText($envFile, $content, (New-Object System.Text.UTF8Encoding $false))
}

# 4. Dependencies (cài khi chưa có hoặc package-lock.json mới hơn)
$installedMarker = Join-Path $Root 'node_modules\.package-lock.json'
$lockFile = Join-Path $Root 'package-lock.json'
if (-not (Test-Path $installedMarker) -or (Get-Item $lockFile).LastWriteTime -gt (Get-Item $installedMarker).LastWriteTime) {
  Write-Step 'Cài dependencies (npm install)'
  Invoke-Npm @('install')
}

# 5. Database
$databaseUrl = Get-EnvValue $envFile 'DATABASE_URL'
if (-not $databaseUrl) { $databaseUrl = 'file:./newsora.db' }
$isLocalDb = $databaseUrl.StartsWith('file:')

if ($Mode -eq 'prod') {
  if (-not $isLocalDb) {
    Write-Step 'Chạy migration database (cloud)'
    Invoke-Npm @('run', 'payload', '--', 'migrate')
  } elseif (-not (Test-Path (Join-Path $Root ($databaseUrl -replace '^file:', '')))) {
    Write-Step 'Tạo database SQLite mới từ migration'
    Invoke-Npm @('run', 'payload', '--', 'migrate')
  }
}
# Chế độ dev với SQLite local: Payload tự đồng bộ schema khi khởi động.

if ($Seed) {
  Write-Step 'Tạo dữ liệu mẫu'
  Invoke-Npm @('run', 'seed')
}

# 6. Khởi động
if ($Mode -eq 'prod') {
  Write-Step 'Build bản production'
  Invoke-Npm @('run', 'build')
}

Write-Host ''
Write-Host "  Trang báo :  http://localhost:$Port" -ForegroundColor Green
Write-Host "  Quản trị  :  http://localhost:$Port/admin" -ForegroundColor Green
Write-Host '  Nhấn Ctrl+C để dừng.' -ForegroundColor DarkGray
Write-Host ''

if ($Mode -eq 'dev') {
  Write-Step 'Khởi động chế độ dev'
  Invoke-Npm @('run', 'dev', '--', '--port', "$Port")
} else {
  Write-Step 'Khởi động server production'
  Invoke-Npm @('run', 'start', '--', '--port', "$Port")
}
