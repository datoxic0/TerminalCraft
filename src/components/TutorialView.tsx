import { useState } from 'react';
import ReactMarkdown from 'react-markdown';
import { ChevronRight, ChevronLeft, Bookmark, CheckCircle2, Terminal, Shield, Zap, Info, HardDrive, Play, Cpu } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { ScriptLanguage } from '../types';

const TUTORIAL_MODULES = [
  {
    id: 'batch-basics',
    title: 'Batch Scripting: The Foundation',
    icon: Terminal,
    content: `
# Batch Scripting Fundamentals

Windows Batch (.bat or .cmd) is the classic scripting language for DOS and Windows systems. It executes commands line-by-line just as if you were typing them into the Command Prompt.

### Key Concepts
- **@echo off**: Prevents commands from being displayed in the console, showing only the output.
- **Variables**: Defined using \`set var=value\` and accessed via \` %var% \`.
- **Arguments**: Accessed via \` %1, %2 \`, etc.
- **Comments**: Start with \`rem\` or \`::\`.

### Example Script
\`\`\`batch
@echo off
set /p name=What is your name?
echo Hello, %name%! Welcome to WinScript Master.
pause
\`\`\`

---

### Professional Tip: The CHOICE Command
Instead of using \`set /p\` for menus, use \`choice\` to limit input to specific keys. It's more secure and professional.
    `
  },
  {
    id: 'ps-basics',
    title: 'PowerShell: Modern Automation',
    icon: Zap,
    content: `
# PowerShell Core Essentials

PowerShell is an object-oriented shell and scripting language built on the .NET framework. Unlike Batch, which processes strings, PowerShell processes objects.

### The Verb-Noun System
PowerShell commands (Cmdlets) follow a clear pattern:
- \`Get-Process\` (Verb-Noun)
- \`Stop-Service -Name "Spooler"\`
- \`Write-Host "Output text"\`

### The Pipeline (|)
This is PowerShell's superpower. You can pass objects from one command to another.
\`\`\`powershell
Get-Service | Where-Object {$_.Status -eq "Running"} | Select-Object Name
\`\`\`

### Variables
Defined with a \`$\` prefix:
\`\`\`powershell
$path = "C:\\Logs"
$files = Get-ChildItem -Path $path
\`\`\`
    `
  },
  {
    id: 'automation-security',
    title: 'Security & Best Practices',
    icon: Shield,
    content: `
# Hardening Your Scripts

Scripting can be dangerous if not handled with care. Follow these professional standards to write robust automation.

### 1. Execution Policy (PowerShell)
By default, Windows blocks script execution. Use \`Set-ExecutionPolicy RemoteSigned\` to allow local scripts.

### 2. Error Handling
Always assume things will fail.
- **Batch**: Check \` %errorlevel% \` after commands.
- **PowerShell**: Use \`try { ... } catch { ... }\` blocks.

### 3. Input Validation
NEVER trust user input. In Batch, wrap variables in quotes to prevent syntax injection: \`if "%var%"=="value"\`.

### 4. Verbose Logging
Always log your script actions to a file for auditing:
\`\`\`batch
echo %date% %time% - Action performed >> script_log.txt
\`\`\`
    `
  },
  {
    id: 'advanced-hybrid',
    title: 'Advanced: Hybrid Scripting',
    icon: HardDrive,
    content: `
# Hybrid Scripting Mastery

Sometimes one language isn't enough. Professional automation often combines the legacy reliability of Batch with the modern object manipulation of PowerShell.

### Running PowerShell from Batch
You can execute complex PowerShell commands directly from a \`.bat\` file:
\`\`\`batch
@echo off
echo Fetching public IP...
powershell -Command "(Invoke-WebRequest -Uri 'https://api.ipify.org').Content"
pause
\`\`\`

### Error Handling Framework
Create a robust logging system that works across both:
\`\`\`powershell
# Log a timestamped message
function Write-Log {
    param([string]$Message)
    $Timestamp = Get-Date -Format "yyyy-MM-dd HH:mm:ss"
    "[$Timestamp] $Message" | Out-File -FilePath "automation.log" -Append
}

try {
    # Risky operation
    Get-Service "NonExistentService" -ErrorAction Stop
} catch {
    Write-Log "ERROR: $($_.Exception.Message)"
}
\`\`\`

### Environment Variables
Shared variables between shells:
- **Batch**: \`set MY_VAR=Hello\`
- **PowerShell**: \`$env:MY_VAR = "Hello"\`
    `
  },
  {
    id: 'ps-wmi-cim',
    title: 'WMI & CIM: Hardware Intel',
    icon: Cpu,
    content: `
# Mastering WMI and CIM
Windows Management Instrumentation (WMI) and Common Information Model (CIM) are the bedrock of Windows system administration. They allow you to query almost any hardware or software property.

### Querying Hardware
Use \`Get-CimInstance\` (the modern replacement for \`Get-WmiObject\`) to fetch system details:
\`\`\`powershell
# Get BIOS Information
Get-CimInstance -ClassName Win32_BIOS | Select-Object Manufacturer, Version, SerialNumber

# Get Disk Health
Get-CimInstance -ClassName Win32_DiskDrive | Select-Object Model, Status, Size
\`\`\`

### Remote Management
The real power of CIM is remote execution:
\`\`\`powershell
# Query another computer on the network
Get-CimInstance -ComputerName "REMOTEPCHOST" -ClassName Win32_OperatingSystem
\`\`\`

### Best Practices
- Prefer \`Get-CimInstance\` over \`Get-WmiObject\` as it uses WS-Man (WinRM) and is faster/more secure.
- Always filter with \`-Filter\` instead of pipe to \`Where-Object\` for better performance (Filter at source).
    `
  }
];

interface TutorialViewProps {
  onTryCode?: (code: string, language: ScriptLanguage) => void;
}

export default function TutorialView({ onTryCode }: TutorialViewProps) {
  const [activeModule, setActiveModule] = useState(0);

  const nextModule = () => setActiveModule((prev) => Math.min(prev + 1, TUTORIAL_MODULES.length - 1));
  const prevModule = () => setActiveModule((prev) => Math.max(prev - 1, 0));

  const current = TUTORIAL_MODULES[activeModule];

  return (
    <div className="h-full flex flex-col bg-[#050505]">
      {/* Tutorial Header */}
      <div className="h-12 border-b border-white/5 flex items-center justify-between px-6 bg-[#0E0E10]">
        <div className="flex items-center gap-3">
          <current.icon className="w-4 h-4 text-blue-500" />
          <h2 className="text-xs font-bold tracking-tight text-white uppercase">{current.title}</h2>
        </div>
        <div className="flex items-center gap-4">
          <span className="text-[9px] font-bold text-slate-500 uppercase tracking-[0.2em]">Module {activeModule + 1} / {TUTORIAL_MODULES.length}</span>
          <div className="w-24 h-1 bg-white/5 rounded-full overflow-hidden border border-white/5">
            <motion.div 
              className="h-full bg-blue-600 shadow-[0_0_8px_rgba(37,99,235,0.5)]" 
              initial={{ width: 0 }}
              animate={{ width: `${((activeModule + 1) / TUTORIAL_MODULES.length) * 100}%` }}
            />
          </div>
        </div>
      </div>

      {/* Tutorial Content */}
      <div className="flex-1 overflow-auto p-10 win-scroll">
        <div className="max-w-3xl mx-auto">
          <AnimatePresence mode="wait">
            <motion.div
              key={current.id}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.2 }}
              className="prose prose-invert prose-slate max-w-none 
                prose-headings:font-bold prose-headings:tracking-tight prose-headings:text-white
                prose-code:bg-white/5 prose-code:text-blue-400 prose-code:px-1.5 prose-code:py-0.5 prose-code:rounded prose-code:before:content-none prose-code:after:content-none
                prose-pre:p-0 prose-pre:bg-transparent prose-pre:border-none
                prose-p:text-slate-400 prose-p:leading-relaxed text-sm"
            >
              <ReactMarkdown
                components={{
                  code({ node, inline, className, children, ...props }: any) {
                    const match = /language-(\w+)/.exec(className || '');
                    const code = String(children).replace(/\n$/, '');
                    
                    if (!inline && match) {
                      return (
                        <div className="group relative my-6 rounded-xl overflow-hidden bg-black/40 border border-white/5">
                          <div className="flex items-center justify-between px-4 py-2 border-b border-white/5 bg-white/5">
                            <span className="text-[9px] font-bold text-slate-500 uppercase tracking-widest">{match[1]} Snippet</span>
                            {onTryCode && (
                              <button
                                onClick={() => onTryCode(code, match[1] === 'powershell' ? 'powershell' : 'batch')}
                                className="flex items-center gap-1.5 text-[9px] font-bold text-blue-500 hover:text-blue-400 transition-colors uppercase tracking-widest"
                              >
                                <Play className="w-2.5 h-2.5" />
                                Try in Editor
                              </button>
                            )}
                          </div>
                          <pre className="p-4 !my-0 overflow-auto scrollbar-thin scrollbar-thumb-white/10 scrollbar-track-transparent">
                            <code {...props} className={className}>
                              {children}
                            </code>
                          </pre>
                        </div>
                      );
                    }
                    return <code {...props} className={className}>{children}</code>;
                  }
                }}
              >
                {current.content}
              </ReactMarkdown>
            </motion.div>
          </AnimatePresence>

          {/* Footer Navigation */}
          <div className="mt-16 pt-8 border-t border-white/5 flex items-center justify-between whitespace-nowrap">
            <button
              onClick={prevModule}
              disabled={activeModule === 0}
              className="flex items-center gap-2 text-[10px] uppercase tracking-widest font-bold text-slate-500 hover:text-white disabled:opacity-20 disabled:cursor-not-allowed transition-colors"
            >
              <ChevronLeft className="w-3.5 h-3.5" />
              Previous Lesson
            </button>
            
            <div className="flex gap-2">
              {TUTORIAL_MODULES.map((_, idx) => (
                <div 
                  key={idx}
                  className={`w-1.5 h-1.5 rounded-full transition-all ${idx === activeModule ? 'bg-blue-500 scale-125' : 'bg-white/10'}`}
                />
              ))}
            </div>

            <button
              onClick={nextModule}
              disabled={activeModule === TUTORIAL_MODULES.length - 1}
              className="flex items-center gap-2 text-[10px] uppercase tracking-widest font-bold text-blue-500 hover:text-blue-400 disabled:opacity-20 disabled:cursor-not-allowed transition-colors"
            >
              Next Lesson
              <ChevronRight className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
