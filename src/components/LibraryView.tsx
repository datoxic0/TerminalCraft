import { SCRIPT_TEMPLATES } from '../constants';
import { ScriptLanguage } from '../types';
import { Search, Tag, ArrowRight, Terminal, Zap, FileCode } from 'lucide-react';
import { useState } from 'react';
import { motion } from 'motion/react';

interface LibraryViewProps {
  onSelect: (code: string, language: ScriptLanguage) => void;
}

export default function LibraryView({ onSelect }: LibraryViewProps) {
  const [search, setSearch] = useState('');
  const [category, setCategory] = useState<string | null>(null);

  const categories = Array.from(new Set(SCRIPT_TEMPLATES.map(s => s.category)));

  const filtered = SCRIPT_TEMPLATES.filter(s => {
    const matchesSearch = s.title.toLowerCase().includes(search.toLowerCase()) || 
                         s.description.toLowerCase().includes(search.toLowerCase());
    const matchesCategory = !category || s.category === category;
    return matchesSearch && matchesCategory;
  });

  return (
    <div className="h-full flex flex-col bg-[#050505]">
      {/* Header */}
      <div className="p-10 pb-6">
        <h1 className="text-2xl font-bold mb-2 text-white tracking-tight">Script Library</h1>
        <p className="text-slate-500 text-sm">Professional-grade automation templates for Batch and PowerShell.</p>
      </div>

      {/* Filters */}
      <div className="px-10 mb-8 flex flex-col sm:flex-row gap-6 items-start sm:items-center">
        <div className="relative w-full max-w-sm">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-slate-500" />
          <input
            type="text"
            placeholder="Search templates..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full bg-[#0E0E10] border border-white/5 rounded-xl pl-10 pr-4 py-2.5 text-sm focus:outline-none focus:border-blue-500/50 transition-all text-slate-300 placeholder:text-slate-600"
          />
        </div>
        
        <div className="flex flex-wrap gap-2">
          <button
            onClick={() => setCategory(null)}
            className={`px-4 py-1.5 rounded-full text-[10px] font-bold uppercase tracking-widest transition-all ${!category ? 'bg-blue-600 text-white shadow-lg shadow-blue-900/20' : 'bg-white/5 text-slate-500 hover:text-slate-300 border border-white/5'}`}
          >
            All Nodes
          </button>
          {categories.map(cat => (
            <button
              key={cat}
              onClick={() => setCategory(cat)}
              className={`px-4 py-1.5 rounded-full text-[10px] font-bold uppercase tracking-widest transition-all ${category === cat ? 'bg-blue-600 text-white shadow-lg shadow-blue-900/20' : 'bg-white/5 text-slate-500 hover:text-slate-300 border border-white/5'}`}
            >
              {cat}
            </button>
          ))}
        </div>
      </div>

      {/* Grid */}
      <div className="flex-1 overflow-auto px-10 pb-10 win-scroll">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filtered.map((script, idx) => (
            <motion.div
              layout
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: idx * 0.04 }}
              key={script.id}
              className="bg-[#0E0E10] border border-white/5 rounded-2xl p-6 hover:border-blue-500/30 transition-all group flex flex-col relative overflow-hidden"
            >
              <div className="flex items-start justify-between mb-6">
                <div className={`p-2.5 rounded-xl ${script.language === 'batch' ? 'bg-orange-500/10 text-orange-400' : 'bg-blue-500/10 text-blue-400'}`}>
                  {script.language === 'batch' ? <Terminal className="w-5 h-5" /> : <Zap className="w-5 h-5" />}
                </div>
                <div className="text-[9px] font-bold uppercase tracking-widest text-slate-500 bg-white/5 px-2.5 py-1 rounded-full border border-white/5">
                  {script.category}
                </div>
              </div>
              
              <h3 className="font-bold text-lg mb-2 text-white group-hover:text-blue-400 transition-colors tracking-tight">{script.title}</h3>
              <p className="text-slate-500 text-sm mb-8 flex-1 leading-relaxed">{script.description}</p>
              
              <button
                onClick={() => onSelect(script.code, script.language)}
                className="w-full flex items-center justify-between bg-white/5 hover:bg-blue-600 text-white py-3 px-5 rounded-xl text-xs font-bold uppercase tracking-widest transition-all border border-white/5 group/btn"
              >
                <span>Initialize Template</span>
                <ArrowRight className="w-4 h-4 transition-transform group-hover/btn:translate-x-1" />
              </button>
              
              {/* Decorative background element */}
              <div className="absolute -bottom-12 -right-12 w-24 h-24 bg-blue-600/5 blur-3xl group-hover:bg-blue-600/10 transition-colors" />
            </motion.div>
          ))}
        </div>
      </div>
    </div>
  );
}
