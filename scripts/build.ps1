<#
.SYNOPSIS
  Ejecuta `npm run build` con lock, para que dos workers no compilen a la vez.
#>
[CmdletBinding()]
param([string]$Root)

$ErrorActionPreference = 'Stop'
$root = if ($Root) { $Root } else { Split-Path -Parent $PSScriptRoot }
$lock = Join-Path $root '.build.lock'
$fs = $null

for ($i = 0; $i -lt 600; $i++) {
  try { $fs = [IO.File]::Open($lock, 'OpenOrCreate', 'ReadWrite', 'None'); break }
  catch [System.IO.IOException] { Start-Sleep -Milliseconds 500 }
}
if (-not $fs) { throw 'No se pudo adquirir el lock de build (timeout 5 min)' }

$code = 1
try {
  Push-Location $root
  & npm run build
  $code = $LASTEXITCODE
} finally {
  Pop-Location
  $fs.Close(); $fs.Dispose()
  Remove-Item $lock -ErrorAction SilentlyContinue
}
exit $code
