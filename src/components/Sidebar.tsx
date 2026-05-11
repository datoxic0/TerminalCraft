import { Terminal, BookOpen, Code2, Library, Info, Settings, Target } from 'lucide-react';
import { ViewState } from '../types';
import { motion } from 'motion/react';
import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';

function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

interface SidebarProps {
  activeView: ViewState;
  onViewChange: (view: ViewState) => void;
}

export default function Sidebar({ activeView, onViewChange }: SidebarProps) {
  const items = [
    { id: 'tutorial', label: 'Training Modules', icon: BookOpen, core: 'CORE 01' },
    { id: 'editor', label: 'Script Editor', icon: Code2, core: 'CORE 02' },
    { id: 'library', label: 'Script Library', icon: Library, core: 'CORE 03' },
    { id: 'challenges', label: 'Skill Challenges', icon: Target, core: 'CORE 04' },
    { id: 'about', label: 'System Reference', icon: Info, core: 'CORE 05' },
  ];

  return (
    <div className="w-72 bg-[var(--color-win-sidebar)] border-r border-[var(--color-win-border)] flex flex-col h-full">
      <div className="p-6 border-b border-[var(--color-win-border)]">
        <div className="flex items-center gap-4">
          <div className="w-8 h-8 bg-[var(--color-win-blue)] rounded flex items-center justify-center font-bold text-white text-lg shadow-lg">
            Σ
          </div>
          <div>
            <h1 className="text-sm font-bold tracking-tight text-white uppercase">Terminal<span className="text-blue-500 italic">Craft</span></h1>
            <p className="text-[9px] text-slate-500 uppercase tracking-[0.2em] font-bold">Automation Shell</p>
          </div>
        </div>
      </div>
      
      <nav className="flex-1 p-4 space-y-1">
        <h2 className="text-[10px] font-bold text-slate-500 uppercase tracking-widest mb-4 px-3">Primary Node</h2>
        {items.map((item) => {
          const Icon = item.icon;
          const isActive = activeView === item.id;
          
          return (
            <button
              key={item.id}
              onClick={() => onViewChange(item.id as ViewState)}
              className={cn(
                "w-full flex items-center gap-3 px-4 py-3 rounded-md text-sm transition-all relative group text-left",
                isActive 
                  ? "bg-white/5 border-l-2 border-blue-500 text-white" 
                  : "text-slate-500 hover:text-slate-300 hover:bg-white/5"
              )}
            >
              <div className="flex-1">
                <div className={cn("text-[9px] mb-1 font-bold tracking-tighter", isActive ? "text-blue-400" : "text-slate-600")}>
                  {item.core}
                </div>
                <div className="flex items-center gap-2">
                  <Icon className={cn("w-3.5 h-3.5", isActive ? "text-blue-400" : "text-slate-500 group-hover:text-slate-300")} />
                  <span className={cn("font-medium", isActive ? "text-white" : "")}>{item.label}</span>
                </div>
              </div>
            </button>
          );
        })}
      </nav>

      <div className="p-5 border-t border-[var(--color-win-border)]">
        <div className="p-4 bg-blue-600/5 rounded-xl border border-blue-500/10 mb-4">
          <div className="text-[10px] font-bold text-blue-400 mb-1">PRO TIP</div>
          <p className="text-[10px] text-slate-500 leading-tight italic">
            Use 'Shift' key for parameter manipulation in batch.
          </p>
        </div>
        <div className="flex items-center justify-between text-[9px] font-mono">
          <div className="flex items-center gap-2 text-slate-500">
            <div className="w-2 h-2 bg-green-500 rounded-full shadow-[0_0_8px_#22c55e]" />
            <span className="uppercase tracking-widest">Sys_Status: OK</span>
          </div>
          <span className="text-slate-600">v1.2.0</span>
        </div>
      </div>
    </div>
  );
}
