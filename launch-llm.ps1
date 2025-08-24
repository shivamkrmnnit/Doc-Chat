<# ------------ CONFIG ------------------------------------------------ #>
$backendDir  = "backend"
$backendCmd  = "npm run dev"

$frontendDir = "frontend"
$frontendCmd = "npm run dev"
$frontendURL = "http://localhost:5173"

$llmDir = "llm"
$llmCmd = "uvicorn app.main:app --reload"

# Browser exe: chrome.exe or msedge.exe
$browserExe = "chrome.exe"
<# ------------------------------------------------------------------- #>

function Start-App ($workDir, $command) {
    Push-Location $workDir
    # Use Start-Process with cmd.exe but run hidden in background
    $p = Start-Process "cmd.exe" -ArgumentList "/c $command" -WindowStyle Hidden -PassThru
    Pop-Location
    return $p
}

# Function to kill process tree
function Stop-ProcessTree($ProcessId) {
    try {
        # Kill all child processes first
        Get-CimInstance Win32_Process | Where-Object { $_.ParentProcessId -eq $ProcessId } | ForEach-Object {
            Stop-ProcessTree $_.ProcessId
        }
        # Then kill the main process
        Stop-Process -Id $ProcessId -Force -ErrorAction SilentlyContinue
    }
    catch {
        Write-Host "Warning: Could not stop process $ProcessId"
    }
}

Write-Host "🚀  Starting backend..."
$backend = Start-App $backendDir $backendCmd

Write-Host "🚀  Starting frontend..."
$frontend = Start-App $frontendDir $frontendCmd

Write-Host "🚀  Starting LLM server..."
$llm = Start-App $llmDir $llmCmd

Start-Sleep -Seconds 6   # give servers time

Write-Host "🌐  Launching isolated browser window..."

# Create isolated profile directory
$tempProfile = "$env:TEMP\llmBrowserProfile_$([guid]::NewGuid().Guid)"
$newArgs = @(
    "--user-data-dir=`"$tempProfile`"",
    "--new-window",
    "--app=$frontendURL"
)
Start-Process $browserExe -ArgumentList $newArgs

Write-Host "`n🕒  Waiting until ALL browser processes using that profile exit ..."
while ($true) {
    $alive = Get-CimInstance Win32_Process -Filter "Name='chrome.exe'" |
             Where-Object { $_.CommandLine -like "*$tempProfile*" }
    if ($alive.Count -eq 0) { break }
    
    Write-Host ("  ↪ still running: {0} chrome PIDs" -f $alive.Count)
    Start-Sleep -Seconds 2
}

Write-Host "`n⛔  Browser closed — shutting everything down ..."

# Stop process trees instead of just the main processes
Write-Host "Stopping backend..."
Stop-ProcessTree $backend.Id

Write-Host "Stopping frontend..."
Stop-ProcessTree $frontend.Id

Write-Host "Stopping LLM server..."
Stop-ProcessTree $llm.Id

# Additional cleanup: Kill any remaining npm/node processes that might be lingering
Write-Host "Cleaning up any remaining npm/node processes..."
Get-Process -Name "node" -ErrorAction SilentlyContinue | Stop-Process -Force -ErrorAction SilentlyContinue
Get-Process -Name "npm" -ErrorAction SilentlyContinue | Stop-Process -Force -ErrorAction SilentlyContinue

Remove-Item -Recurse -Force $tempProfile -ErrorAction SilentlyContinue
Write-Host "✅  All services stopped. Goodbye!"