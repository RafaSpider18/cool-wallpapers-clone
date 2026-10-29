<#
.SYNOPSIS
  Delegador de tareas del proyecto-1.
.EXAMPLES
  .\delegar.ps1 -NewWorkers
  .\delegar.ps1 -Status
  .\delegar.ps1 -TaskId T-005 -Session ses_abc123 -Auto
#>
[CmdletBinding()]
param(
  [string]$TaskId,
  [string]$Session,
  [string]$Agent = 'worker',
  [switch]$Auto,
  [switch]$NewWorkers,
  [switch]$Status
)

$ErrorActionPreference = 'Stop'
$root      = Split-Path -Parent $PSScriptRoot
$queuePath = Join-Path $root '.agents\tasks\queue.md'
Set-Location $root

function Get-Row([string]$id) {
  Get-Content $queuePath -Encoding UTF8 | Where-Object { $_ -match "^\|\s*$id\s*\|" } | Select-Object -First 1
}

function Invoke-Locked([scriptblock]$Action) {
  $lockPath = Join-Path $root '.agents\tasks\.queue.lock'
  for ($i = 0; $i -lt 60; $i++) {
    try {
      $fs = [IO.File]::Open($lockPath, 'OpenOrCreate', 'ReadWrite', 'None')
      try { & $Action } finally { $fs.Close(); $fs.Dispose() }
      return
    } catch [System.IO.IOException] { Start-Sleep -Milliseconds 200 }
  }
  throw 'No se pudo adquirir el lock de la cola'
}

function Set-Row([string]$id, [string]$state, [string]$owner) {
  Invoke-Locked {
    $lines = Get-Content $queuePath -Encoding UTF8
    $out = foreach ($l in $lines) {
      if ($l -match "^\|\s*$id\s*\|") {
        $f = $l -split '\|'
        if ($f.Count -ge 7) { $f[4] = " $state "; $f[5] = " $owner "; $l = ($f -join '|') }
      }
      $l
    }
    [IO.File]::WriteAllText($queuePath, ($out -join "`r`n") + "`r`n", (New-Object Text.UTF8Encoding($false)))
  }
}

function Get-State([string]$id) {
  $row = Get-Row $id
  if (-not $row) { return $null }
  return (($row -split '\|')[4]).Trim()
}

if ($Status) {
  Get-Content $queuePath -Encoding UTF8 | Where-Object { $_ -match '^\|\s*T-' } | ForEach-Object { $_ }
  return
}

if ($NewWorkers) {
  foreach ($n in 1..2) {
    $msg = "Lee .agents/roles/worker.md. Responde solo: listo. No modifiques archivos."
    $raw = & opencode run --agent $Agent --title "W$n" --auto --format json $msg 2>&1 | Out-String
    $m = [regex]::Match($raw, 'ses_[A-Za-z0-9]{10,}')
    if ($m.Success) { Write-Host "W$n = $($m.Value)" } else { Write-Host "W$n = (no se pudo leer el sessionID)" }
  }
  return
}

if (-not $TaskId) { throw 'Indica -TaskId, -NewWorkers o -Status.' }
$taskFile = Join-Path $root ".agents\tasks\$TaskId.md"
if (-not (Test-Path $taskFile)) { throw "No existe $taskFile" }

$state = Get-State $TaskId
if ($state -eq 'done') { Write-Host "$TaskId ya está done."; return }

# Dependencias
$row = Get-Row $TaskId
$deps = (($row -split '\|')[3]).Trim()
if ($deps -and $deps -ne '—') {
  foreach ($d in ($deps -split ',')) {
    $d = $d.Trim()
    if ($d -and (Get-State $d) -ne 'done') { throw "$TaskId bloqueada: $d no está done." }
  }
}

if (-not $Session) { throw 'Falta -Session ses_xxx (o usa -NewWorkers).' }

$owner = if ($Session -match '^ses_') { $Session.Substring(0, 10) } else { $Agent }
Set-Row $TaskId 'en curso' $owner
Write-Host "→ $TaskId despachada a $owner"

$prompt = "Ejecuta la tarea $TaskId. Sigue .agents/roles/worker.md al pie de la letra. Proyecto: $root"
$args = @('run', '-s', $Session, '--agent', $Agent, '--format', 'json')
if ($Auto) { $args += '--auto' }
$args += $prompt

& opencode @args
$code = $LASTEXITCODE

$now = Get-State $TaskId
if ($now -eq 'en curso') {
  $resultPath = Join-Path $root ".agents\tasks\$TaskId.result.md"
  $blocked = $false
  $saysDone = $false
  if (Test-Path $resultPath) {
    $txt = Get-Content $resultPath -Raw -Encoding UTF8
    if ($txt -match '(?im)^\s*blocked|blocked\s*$') { $blocked = $true }
    if ($txt -match "(?im)^\s*$TaskId\s+done")      { $saysDone = $true }
  }
  # Un exit 0 sin reporte no prueba nada: el worker pudo salir sin ejecutar la tarea.
  if ($blocked)                  { Set-Row $TaskId 'blocked' $owner; Write-Host "$TaskId blocked (ver .result.md)" }
  elseif ($code -eq 0 -and $saysDone) { Set-Row $TaskId 'done' $owner; Write-Host "$TaskId done (exit 0 + reporte)" }
  else {
    Set-Row $TaskId 'failed' $owner
    if (-not (Test-Path $resultPath)) { Write-Host "$TaskId failed (exit $code, sin .result.md)" }
    else                              { Write-Host "$TaskId failed (exit $code, reporte sin 'done')" }
  }
}
