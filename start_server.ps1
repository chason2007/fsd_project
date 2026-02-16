# PowerShell script to start the frontend server
$scriptPath = $PSScriptRoot
if (-not $scriptPath) {
    # Fallback to current location if running interactively/selection
    $scriptPath = (Get-Location).Path
}

Set-Location "$scriptPath/frontend"
npm run dev
