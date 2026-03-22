# Build desktop installer only. Run start.ps1 first for npm install + prisma generate, then stop dev server.
$ErrorActionPreference = "Stop"
$Root = Split-Path -Parent $PSScriptRoot
$Webapp = Join-Path $Root "webapp"

if (-not (Test-Path -LiteralPath $Webapp)) {
    Write-Error "webapp directory not found: $Webapp"
}

Set-Location -LiteralPath $Webapp
Write-Host "==> electron:build (from $Webapp)"
npm run electron:build

Write-Host ""
Write-Host "Done. Output: webapp\release\"
