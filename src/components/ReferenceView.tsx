import { Info, HelpCircle, HardDrive, Cpu, Network, ShieldCheck, Terminal, Heart } from 'lucide-react';

export default function ReferenceView() {
  const sections = [
    {
      title: "Common CMD Commands",
      icon: Terminal,
      items: [
        { cmd: "DIR", desc: "List files in a directory" },
        { cmd: "CD", desc: "Change current directory" },
        { cmd: "COPY / MOVE", desc: "Copy or move files" },
        { cmd: "DEL", desc: "Delete files" },
        { cmd: "TASKLIST", desc: "Show running processes" }
      ]
    },
    {
      title: "Common PS Commands",
      icon: Cpu,
      items: [
        { cmd: "Get-Help", desc: "Get information about cmdlets" },
        { cmd: "Get-Service", desc: "List system services" },
        { cmd: "Set-ExecutionPolicy", desc: "Manage script script execution" },
        { cmd: "Invoke-WebRequest", desc: "Download web content" },
        { cmd: "Export-Csv", desc: "Save data to spreadsheet" }
      ]
    }
  ];

  return (
    <div className="h-full overflow-auto win-scroll p-8 bg-[#1a1a1a]">
      <div className="max-w-4xl mx-auto">
        <div className="flex items-center gap-4 mb-8">
          <div className="p-3 bg-blue-500/20 text-blue-500 rounded-2xl">
            <Info className="w-8 h-8" />
          </div>
          <div>
            <h1 className="text-3xl font-bold tracking-tight">Scripting Reference</h1>
            <p className="text-gray-400">Quick-lookup guide for commands and syntax.</p>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-12">
          {sections.map(section => (
            <div key={section.title} className="bg-[#252526] border border-gray-800 rounded-2xl overflow-hidden">
              <div className="px-6 py-4 border-b border-gray-800 bg-gray-800/50 flex items-center gap-3">
                <section.icon className="w-5 h-5 text-gray-400" />
                <h2 className="font-bold">{section.title}</h2>
              </div>
              <div className="p-4">
                {section.items.map(item => (
                  <div key={item.cmd} className="flex items-center justify-between py-2 border-b border-gray-800 last:border-0 group">
                    <code className="text-blue-400 font-mono text-sm group-hover:text-blue-300 transition-colors">{item.cmd}</code>
                    <span className="text-xs text-gray-500">{item.desc}</span>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>

        <div className="bg-gradient-to-br from-[#252526] to-[#1e1e1e] border border-gray-800 rounded-3xl p-8 mb-12 relative overflow-hidden">
          <div className="relative z-10">
            <h2 className="text-xl font-bold mb-4 flex items-center gap-2">
              <ShieldCheck className="w-6 h-6 text-green-500" />
              Safety Note
            </h2>
            <p className="text-gray-400 leading-relaxed mb-6">
              WinScript Master uses advanced AI simulation to provide a safe "sandbox" for testing your code. While our simulator is highly accurate, always remember that real-world environments may behave differently due to permissions, hardware variations, or system versions.
            </p>
            <div className="flex gap-4">
              <div className="flex items-center gap-2 bg-gray-900/50 px-3 py-1.5 rounded-full border border-gray-800">
                <div className="w-2 h-2 bg-green-500 rounded-full" />
                <span className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">Simulator Secure</span>
              </div>
              <div className="flex items-center gap-2 bg-gray-900/50 px-3 py-1.5 rounded-full border border-gray-800">
                <div className="w-2 h-2 bg-[var(--color-win-blue)] rounded-full animate-pulse" />
                <span className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">AI Engine: Connected</span>
              </div>
            </div>
          </div>
          <HelpCircle className="absolute -bottom-8 -right-8 w-48 h-48 text-gray-800 opacity-20 pointer-events-none" />
        </div>

        <footer className="text-center py-8">
            <p className="text-gray-600 text-sm flex items-center justify-center gap-2">
                Built for power users with <Heart className="w-4 h-4 text-red-500 fill-current" /> by WinScript Team
            </p>
        </footer>
      </div>
    </div>
  );
}
