import { useState, useEffect } from 'react';
import { SCRIPT_CHALLENGES } from '../constants';
import { Challenge, ScriptLanguage } from '../types';
import { Target, Lightbulb, Trophy, ArrowRight, Star, CheckCircle } from 'lucide-react';
import { motion } from 'motion/react';

interface ChallengesViewProps {
  onStart: (code: string, language: ScriptLanguage) => void;
}

export default function ChallengesView({ onStart }: ChallengesViewProps) {
  const [completed, setCompleted] = useState<string[]>([]);

  useEffect(() => {
    const saved = localStorage.getItem('winscript_challenges');
    if (saved) setCompleted(JSON.parse(saved));
  }, []);

  const progress = (completed.length / SCRIPT_CHALLENGES.length) * 100;
  const rank = progress === 100 ? 'System Administrator' : progress > 60 ? 'Senior Engineer' : progress > 30 ? 'Technician' : 'Novice Technician';

  return (
    <div className="h-full flex flex-col bg-[#050505]">
      <div className="p-10 pb-6">
        <h1 className="text-2xl font-bold mb-2 text-white tracking-tight">Scripting Challenges</h1>
        <p className="text-slate-500 text-sm">Put your skills to the test with real-world scripting scenarios.</p>
      </div>

      <div className="flex-1 overflow-auto px-10 pb-10 win-scroll">
        <div className="grid grid-cols-1 xl:grid-cols-2 gap-6">
          {SCRIPT_CHALLENGES.map((challenge, idx) => {
            const isDone = completed.includes(challenge.id);
            return (
              <motion.div
                layout
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: idx * 0.05 }}
                key={challenge.id}
                className={`bg-[#0E0E10] border ${isDone ? 'border-green-500/30' : 'border-white/5'} rounded-2xl p-6 hover:border-blue-500/30 transition-all group flex flex-col relative overflow-hidden`}
              >
                {isDone && (
                  <div className="absolute top-0 right-0 p-4">
                    <CheckCircle className="w-5 h-5 text-green-500" />
                  </div>
                )}
                
                <div className="flex items-start justify-between mb-4">
                  <div className="flex items-center gap-2">
                    <div className={`p-2 rounded-lg ${isDone ? 'bg-green-500/10 text-green-400' : 'bg-blue-600/10 text-blue-400'}`}>
                      <Target className="w-5 h-5" />
                    </div>
                    <div className="flex items-center gap-1 ml-2">
                      {[...Array(3)].map((_, i) => (
                        <Star 
                          key={i} 
                          className={`w-3 h-3 ${i < (challenge.difficulty === 'Easy' ? 1 : challenge.difficulty === 'Medium' ? 2 : 3) ? 'text-yellow-500 fill-current' : 'text-slate-800'}`} 
                        />
                      ))}
                    </div>
                  </div>
                  <div className="text-[9px] font-bold uppercase tracking-widest text-slate-500 bg-white/5 px-2.5 py-1 rounded-full border border-white/5">
                    {challenge.language}
                  </div>
                </div>

                <h3 className="font-bold text-lg mb-2 text-white group-hover:text-blue-400 transition-colors">{challenge.title}</h3>
                <p className="text-slate-500 text-sm mb-6 leading-relaxed">{challenge.description}</p>

                <div className="mt-auto space-y-4">
                  <div className="bg-black/20 rounded-xl p-4 border border-white/5">
                    <div className="flex items-center gap-2 mb-2 text-[10px] font-bold text-slate-400 uppercase tracking-widest">
                      <Target className="w-3 h-3" />
                      Target Outcome
                    </div>
                    <p className="text-[11px] font-mono text-slate-500 italic">{challenge.targetOutput}</p>
                  </div>

                  <div className="flex items-center gap-3">
                    <button
                      onClick={() => onStart(challenge.language === 'batch' ? ':: Write your solution here' : '# Write your solution here', challenge.language)}
                      className={`flex-1 flex items-center justify-center gap-2 ${isDone ? 'bg-white/5 text-slate-400' : 'bg-blue-600 text-white'} hover:bg-blue-500 py-3 px-5 rounded-xl text-xs font-bold uppercase tracking-widest transition-all border border-white/5`}
                    >
                      {isDone ? 'Review Solution' : 'Accept Challenge'}
                      <ArrowRight className="w-4 h-4" />
                    </button>
                    <button 
                      title={challenge.hint}
                      className="p-3 bg-white/5 hover:bg-white/10 text-slate-400 rounded-xl border border-white/5 transition-all"
                    >
                      <Lightbulb className="w-5 h-5" />
                    </button>
                  </div>
                </div>
              </motion.div>
            );
          })}
        </div>

        <div className="mt-12 p-8 bg-blue-600/5 border border-blue-500/10 rounded-2xl flex items-center gap-6">
          <div className="w-16 h-16 bg-blue-600/20 rounded-2xl flex items-center justify-center">
            <Trophy className="w-8 h-8 text-blue-400" />
          </div>
          <div>
            <h4 className="text-white font-bold mb-1 uppercase tracking-tight">System Ranking: {rank}</h4>
            <div className="w-64 h-1 bg-white/5 rounded-full mt-2 overflow-hidden">
              <motion.div 
                initial={{ width: 0 }}
                animate={{ width: `${progress}%` }}
                className="h-full bg-blue-500"
              />
            </div>
            <p className="text-[10px] text-slate-500 mt-2 uppercase tracking-widest">{completed.length} / {SCRIPT_CHALLENGES.length} MODULES MASTERED</p>
          </div>
        </div>
      </div>
    </div>
  );
}
