# ─────────────────────────────────────────────────────────────────────────
# start-dev.ps1 — Inicia todos los servicios de Shopping en desarrollo
# Uso: Click derecho → "Ejecutar con PowerShell"  (o: .\start-dev.ps1)
# ─────────────────────────────────────────────────────────────────────────

Write-Host ""
Write-Host "  🛍️  Shopping — Iniciando servidores de desarrollo" -ForegroundColor Cyan
Write-Host "  ─────────────────────────────────────────────────" -ForegroundColor DarkGray

# Verificar que pm2 está instalado
$pm2 = Get-Command pm2 -ErrorAction SilentlyContinue
if (-not $pm2) {
    Write-Host ""
    Write-Host "  ⚠️  PM2 no está instalado. Instalando..." -ForegroundColor Yellow
    npm install -g pm2
    Write-Host "  ✓  PM2 instalado." -ForegroundColor Green
}

# Ir al directorio del proyecto
Set-Location $PSScriptRoot

# Detener procesos anteriores si existen
pm2 delete shopping-api     2>$null
pm2 delete shopping-web     2>$null
pm2 delete shopping-provider 2>$null
pm2 delete shopping-admin   2>$null

# Iniciar todos los servicios
pm2 start ecosystem.config.js

# Mostrar estado
pm2 list

Write-Host ""
Write-Host "  ✅  Todos los servicios iniciados:" -ForegroundColor Green
Write-Host ""
Write-Host "     🔌  API          →  http://localhost:4000" -ForegroundColor White
Write-Host "     🌐  Tienda Web   →  http://localhost:3000/p/gran-reserva" -ForegroundColor White
Write-Host "     📦  Provider     →  http://localhost:3001" -ForegroundColor White
Write-Host "     🛡️   Admin        →  http://localhost:3002" -ForegroundColor White
Write-Host ""
Write-Host "     Logs: pm2 logs" -ForegroundColor DarkGray
Write-Host "     Stop: pm2 stop all" -ForegroundColor DarkGray
Write-Host ""
