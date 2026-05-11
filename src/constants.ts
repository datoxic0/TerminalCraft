import { ScriptTemplate, Challenge } from './types';

export const SCRIPT_CHALLENGES: Challenge[] = [
  {
    id: 'ch-1',
    title: 'Silent Greeter',
    description: 'Write a Batch script that asks for a user\'s favorite color and then says "I love [color] too!" but ensures no commands are leaked in the terminal output.',
    targetOutput: 'What is your favorite color? Blue\nI love Blue too!',
    hint: 'Use @echo off and set /p',
    language: 'batch',
    difficulty: 'Easy'
  },
  {
    id: 'ch-2',
    title: 'Process Hunter',
    description: 'Create a PowerShell script that finds all processes named "svchost" and selects only their Id and CPU usage.',
    targetOutput: 'A table with Id and CPU columns for svchost processes.',
    hint: 'Use Get-Process and Where-Object',
    language: 'powershell',
    difficulty: 'Medium'
  },
  {
    id: 'ch-3',
    title: 'Safety First',
    description: 'Write a Batch script that checks if a folder named "Logs" exists. If it doesn\'t, create it. If it does, echo "Logs found".',
    targetOutput: 'Logs found (or directory creation message)',
    hint: 'Use if exist and mkdir',
    language: 'batch',
    difficulty: 'Medium'
  },
  {
    id: 'ch-4',
    title: 'DNS Resolver',
    description: 'Write a PowerShell script that takes a domain name from a variable and outputs its IP addresses using Resolv-DnsName.',
    targetOutput: 'IP Address list for the domain.',
    hint: 'Use Resolve-DnsName -Name $domain',
    language: 'powershell',
    difficulty: 'Medium'
  },
  {
    id: 'ch-5',
    title: 'The Infinite Loop',
    description: 'Create a Batch script that uses GOTO to create a loop that echoes "Scanning..." and waits 2 seconds between each echo.',
    targetOutput: 'Repeated "Scanning..." messages with delay.',
    hint: 'Use :label, goto, and timeout /t 2',
    language: 'batch',
    difficulty: 'Hard'
  }
];

export const SCRIPT_TEMPLATES: ScriptTemplate[] = [
  {
    id: 'batch-cleanup',
    title: 'Temp File Cleanup',
    description: 'Deletes temporary files to free up disk space.',
    language: 'batch',
    category: 'System',
    code: `@echo off
echo Cleaning up temporary files...
del /s /f /q %temp%\\*.*
rd /s /q %temp%
md %temp%
echo Cleanup complete!
pause`
  },
  {
    id: 'ps-process-monitor',
    title: 'Process Monitor',
    description: 'Lists top memory-consuming processes.',
    language: 'powershell',
    category: 'System',
    code: `Get-Process | Sort-Object WorkingSet64 -Descending | Select-Object -First 10 | Format-Table Name, @{Name="Memory(MB)";Expression={[math]::Round($_.WorkingSet64 / 1MB, 2)}}`
  },
  {
    id: 'batch-backup',
    title: 'Directory Backup',
    description: 'Backs up a source folder to a destination with timestamp.',
    language: 'batch',
    category: 'Files',
    code: `@echo off
set source=C:\\MyData
set destination=D:\\Backups
set timestamp=%date:~10,4%%date:~4,2%%date:~7,2%_%time:~0,2%%time:~3,2%
echo Backing up %source% to %destination%\\Backup_%timestamp%
xcopy "%source%" "%destination%\\Backup_%timestamp%" /E /I /H /C
echo Backup finished.
pause`
  },
  {
    id: 'ps-ad-check',
    title: 'Check AD Connection',
    description: 'Verifies active directory connectivity (Conceptual).',
    language: 'powershell',
    category: 'Network',
    code: `try {
    [void][System.DirectoryServices.ActiveDirectory.Domain]::GetCurrentDomain()
    Write-Host "Connected to Domain" -ForegroundColor Green
} catch {
    Write-Warning "Not connected to a domain."
}`
  },
    {
    id: 'batch-menu',
    title: 'Interactive Menu',
    description: 'A professional choice-based interactive menu.',
    language: 'batch',
    category: 'Dev',
    code: `@echo off
:menu
cls
echo ================================
echo    SYSTEM TOOLS UTILITY
echo ================================
echo 1. Check IP Configuration
echo 2. List Running Tasks
echo 3. Exit
echo ================================
set /p choice=Select an option (1-3): 

if %choice%==1 goto ipconfig
if %choice%==2 goto tasklist
if %choice%==3 exit

:ipconfig
ipconfig /all
pause
goto menu

:tasklist
tasklist
pause
goto menu`
  },
  {
    id: 'ps-sysreport',
    title: 'Health Report',
    description: 'Generates a basic HTML health report for the system.',
    language: 'powershell',
    category: 'System',
    code: `$report = Get-ComputerInfo | Select-Object WindowsProductName, OsVersion, OsArchitecture, CsName, CsModel
$report | ConvertTo-Html -Title "System Health Report" -Head "<h1>System Health Report</h1>" | Out-File "$env:TEMP\\HealthReport.html"
Write-Host "Report generated at $env:TEMP\\HealthReport.html" -ForegroundColor Cyan`
  },
  {
    id: 'batch-network',
    title: 'Network Diagnostics',
    description: 'Runs a suite of connectivity tests (Ping, Tracert, DNS).',
    language: 'batch',
    category: 'Network',
    code: `@echo off
echo Testing connectivity to Google DNS...
ping 8.8.8.8 -n 4
echo.
echo DNS Verification (google.com)...
nslookup google.com
echo.
echo Current Network Configuration...
ipconfig /all
pause`
  },
  {
    id: 'ps-user-info',
    title: 'User Context Info',
    description: 'Displays detailed information about the current user session.',
    language: 'powershell',
    category: 'Security',
    code: `$currentGroup = [Security.Principal.WindowsIdentity]::GetCurrent().Groups
Write-Host "User: $env:USERNAME" -ForegroundColor Cyan
Write-Host "Domain: $env:USERDOMAIN"
Write-Host "Is Admin: $([Security.Principal.WindowsPrincipal][Security.Principal.WindowsIdentity]::GetCurrent().IsInRole([Security.Principal.WindowsBuiltInRole]::Administrator))"
Write-Host "Session Start: $((Get-Process -Id $PID).StartTime)"`
  },
  {
    id: 'ps-registry-clean',
    title: 'Registry Key Auditor',
    description: 'Scans for specific registry keys often used by startup items.',
    language: 'powershell',
    category: 'Security',
    code: `$startupPaths = @("HKLM:\\SOFTWARE\\Microsoft\\Windows\\CurrentVersion\\Run", "HKCU:\\Software\\Microsoft\\Windows\\CurrentVersion\\Run")
foreach ($path in $startupPaths) {
    if (Test-Path $path) {
        Write-Host "--- Scanning: $path ---" -ForegroundColor Cyan
        Get-ItemProperty $path | Select-Object * -ExcludeProperty PSPath,PSParentPath,PSChildName,PSDrive,PSProvider
    }
}`
  },
  {
    id: 'batch-log-rotate',
    title: 'Log Rotator',
    description: 'Archivies logs older than 7 days and deletes archives older than 30 days.',
    language: 'batch',
    category: 'Files',
    code: `@echo off
set logDir=C:\\Logs
set archiveDir=C:\\Logs\\Archive
if not exist %archiveDir% mkdir %archiveDir%

echo Archiving logs...
forfiles /P %logDir% /M *.log /D -7 /C "cmd /c move @path %archiveDir%"

echo Deleting old archives...
forfiles /P %archiveDir% /M *.log /D -30 /C "cmd /c del @path"
echo Log rotation complete.
pause`
  },
  {
    id: 'ps-performance-graph',
    title: 'CPU Usage Snapshot',
    description: 'Captures a CPU usage snapshot and outputs a visual-ish text graph.',
    language: 'powershell',
    category: 'System',
    code: `$cpu = Get-Counter "\\Processor(_Total)\\% Processor Time" -SampleInterval 1 -MaxSamples 5
foreach ($sample in $cpu.CounterSamples) {
    $val = [math]::Round($sample.CookedValue)
    $bar = "|" * ($val / 2)
    Write-Host ("{0:00}% {1}" -f $val, $bar) -ForegroundColor Green
}`
  }
];
