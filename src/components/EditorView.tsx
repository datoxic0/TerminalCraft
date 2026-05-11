import { useState, useRef } from 'react';
import Editor from '@monaco-editor/react';
import { Play, RotateCcw, Share2, HelpCircle, Terminal as TerminalIcon, Sparkles, Loader2, Wand2, X, Check, FileDown, BookOpen, ShieldAlert, Cpu } from 'lucide-react';
import { ScriptLanguage } from '../types';
import { simulateScript, generateScript, explainCode, auditScript } from '../services/geminiService';
import { motion, AnimatePresence } from 'motion/react';

interface EditorViewProps {
  initialCode?: string;
  initialLanguage?: ScriptLanguage;
}

export default function EditorView({ initialCode = '@echo off\necho Hello, Windows World!\npause', initialLanguage = 'batch' }: EditorViewProps) {
  const [code, setCode] = useState(initialCode);
  const [language, setLanguage] = useState<ScriptLanguage>(initialLanguage);
  const [output, setOutput] = useState<string | null>(null);
  const [insight, setInsight] = useState<string | null>(null);
  const [explanation, setExplanation] = useState<string | null>(null);
  const [audit, setAudit] = useState<string | null>(null);
  const [detectedVars, setDetectedVars] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [isExplaining, setIsExplaining] = useState(false);
  const [isAuditing, setIsAuditing] = useState(false);
  const [isGenerating, setIsGenerating] = useState(false);
  const [isGeneratorOpen, setIsGeneratorOpen] = useState(false);
  const [prompt, setPrompt] = useState("");
  const [cursorPos, setCursorPos] = useState({ ln: 1, col: 1 });
  const editorRef = useRef<any>(null);

  const handleRun = async () => {
    setIsLoading(true);
    setOutput(null);
    setInsight(null);
    setDetectedVars(null);
    
    try {
      const result = await simulateScript(code, language);
      
      // Parse the response
      const terminalStart = result.indexOf('[TERMINAL_START]') + '[TERMINAL_START]'.length;
      const terminalEnd = result.indexOf('[TERMINAL_END]');
      const insightStart = result.indexOf('[INSIGHT_START]') + '[INSIGHT_START]'.length;
      const insightEnd = result.indexOf('[INSIGHT_END]');
      const variablesStart = result.indexOf('[VARIABLES_START]') + '[VARIABLES_START]'.length;
      const variablesEnd = result.indexOf('[VARIABLES_END]');
      
      if (terminalStart !== -1 && terminalEnd !== -1) {
        setOutput(result.substring(terminalStart, terminalEnd).trim());
      } else {
        setOutput(result); // Fallback
      }
      
      if (insightStart !== -1 && insightEnd !== -1) {
        setInsight(result.substring(insightStart, insightEnd).trim());
      }

      if (variablesStart !== -1 && variablesEnd !== -1) {
        setDetectedVars(result.substring(variablesStart, variablesEnd).trim());
      }
    } catch (err) {
      setOutput("Error: Failed to connect to simulation engine.");
    } finally {
      setIsLoading(false);
    }
  };

  const VariableInspector = () => {
    if (!detectedVars) return null;
    return (
      <div className="mt-4 pt-4 border-t border-white/5">
        <div className="flex items-center gap-2 mb-2">
          <Cpu className="w-3 h-3 text-green-400" />
          <span className="text-[9px] font-bold text-green-400 uppercase tracking-widest">Environment Variables</span>
        </div>
        <div className="bg-black/40 rounded-lg p-3 font-mono text-[10px] text-slate-400">
          <pre className="whitespace-pre-wrap">{detectedVars}</pre>
        </div>
      </div>
    );
  };

  const handleGenerate = async () => {
    if (!prompt.trim()) return;
    setIsGenerating(true);
    try {
      const generatedCode = await generateScript(prompt, language);
      if (generatedCode) {
        setCode(generatedCode);
        setIsGeneratorOpen(false);
        setPrompt("");
      }
    } catch (err) {
      console.error(err);
    } finally {
      setIsGenerating(false);
    }
  };

  const handleExplain = async () => {
    setIsExplaining(true);
    setExplanation(null);
    try {
      const result = await explainCode(code, language);
      setExplanation(result);
    } catch (err) {
      console.error(err);
    } finally {
      setIsExplaining(false);
    }
  };

  const handleAudit = async () => {
    setIsAuditing(true);
    setAudit(null);
    try {
      const result = await auditScript(code, language);
      setAudit(result);
    } catch (err) {
      console.error(err);
    } finally {
      setIsAuditing(false);
    }
  };

  const handleDownload = () => {
    const element = document.createElement("a");
    const file = new Blob([code], { type: 'text/plain' });
    element.href = URL.createObjectURL(file);
    element.download = language === 'batch' ? "script.bat" : "script.ps1";
    document.body.appendChild(element);
    element.click();
    document.body.removeChild(element);
  };

  const handleReset = () => {
    setCode(language === 'batch' ? '@echo off\necho Hello, Windows World!\npause' : 'Write-Host "Hello, PowerShell!"');
    setOutput(null);
    setInsight(null);
  };

  return (
    <div className="flex flex-col h-full overflow-hidden bg-[#050505] relative">
      {/* AI Generator Overlay */}
      <AnimatePresence>
        {isGeneratorOpen && (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="absolute inset-0 z-50 flex items-center justify-center p-6 bg-black/80 backdrop-blur-sm"
          >
            <motion.div 
              initial={{ scale: 0.9, y: 20 }}
              animate={{ scale: 1, y: 0 }}
              exit={{ scale: 0.9, y: 20 }}
              className="w-full max-w-xl bg-[#121214] border border-white/10 rounded-2xl shadow-2xl p-6"
            >
              <div className="flex items-center justify-between mb-6">
                <div className="flex items-center gap-3">
                  <div className="p-2 bg-blue-600/20 text-blue-400 rounded-lg">
                    <Sparkles className="w-5 h-5" />
                  </div>
                  <div>
                    <h3 className="text-lg font-bold text-white tracking-tight">AI Script Generator</h3>
                    <p className="text-xs text-slate-500">Describe what you want the script to do.</p>
                  </div>
                </div>
                <button 
                  onClick={() => setIsGeneratorOpen(false)}
                  className="p-2 text-slate-500 hover:text-white transition-colors"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              <div className="space-y-4">
                <textarea
                  autoFocus
                  placeholder={language === 'batch' ? "e.g., Create a batch script that backups My Documents to D:\\Backup and logs the time." : "e.g., A PowerShell script that lists all processes using more than 500MB of RAM."}
                  value={prompt}
                  onChange={(e) => setPrompt(e.target.value)}
                  className="w-full h-32 bg-black/40 border border-white/5 rounded-xl p-4 text-sm focus:outline-none focus:border-blue-500/50 transition-all text-slate-300 resize-none placeholder:text-slate-700"
                />

                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <span className="text-[10px] font-bold text-slate-600 uppercase tracking-widest">Generating for:</span>
                    <span className="text-[10px] font-bold text-blue-500 uppercase tracking-widest">{language === 'batch' ? 'Batch' : 'PowerShell'}</span>
                  </div>
                  <button
                    onClick={handleGenerate}
                    disabled={isGenerating || !prompt.trim()}
                    className="flex items-center gap-2 bg-blue-600 hover:bg-blue-500 disabled:opacity-50 text-white text-xs font-bold px-6 py-2.5 rounded-xl shadow-lg shadow-blue-900/20 transition-all"
                  >
                    {isGenerating ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : <Wand2 className="w-3.5 h-3.5" />}
                    Generate Code
                  </button>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Editor Header / Toolbar */}
      <div className="h-12 border-b border-white/5 flex items-center justify-between px-4 bg-[#121214]">
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-2">
            <span className="text-[10px] font-mono text-slate-500 tracking-tighter italic uppercase">
              {language === 'batch' ? 'automation_v1.bat' : 'production_v1.ps1'}
            </span>
            <div className={`w-1.5 h-1.5 rounded-full ${isLoading ? 'bg-blue-500 animate-pulse' : 'bg-orange-500'}`}></div>
          </div>
          
          <div className="flex bg-black/40 p-1 rounded-lg border border-white/5 ml-4">
            <button
              onClick={() => setLanguage('batch')}
              className={`px-4 py-1.5 rounded-md text-[10px] font-bold uppercase transition-all ${language === 'batch' ? 'bg-blue-600/20 text-blue-400 border border-blue-500/30' : 'text-slate-500 hover:bg-white/5'}`}
            >
              Win Batch
            </button>
            <button
              onClick={() => setLanguage('powershell')}
              className={`px-4 py-1.5 rounded-md text-[10px] font-bold uppercase transition-all ${language === 'powershell' ? 'bg-blue-600/20 text-blue-400 border border-blue-500/30' : 'text-slate-500 hover:bg-white/5'}`}
            >
              PowerShell
            </button>
          </div>
        </div>
        
        <div className="flex items-center gap-2">
          <button 
            onClick={handleExplain}
            disabled={isExplaining || !code.trim()}
            className="flex items-center gap-2 bg-white/5 hover:bg-white/10 text-white text-[10px] font-bold px-4 py-1.5 rounded border border-white/5 uppercase transition-colors"
          >
            {isExplaining ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : <BookOpen className="w-3.5 h-3.5 text-blue-400" />}
            Explain
          </button>
          <button 
            onClick={handleAudit}
            disabled={isAuditing || !code.trim()}
            className="flex items-center gap-2 bg-white/5 hover:bg-white/10 text-white text-[10px] font-bold px-4 py-1.5 rounded border border-white/5 uppercase transition-colors"
          >
            {isAuditing ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : <ShieldAlert className="w-3.5 h-3.5 text-orange-400" />}
            Audit
          </button>
          <button 
            onClick={handleDownload}
            className="p-1.5 text-slate-500 hover:text-white transition-colors" 
            title="Download Script"
          >
            <FileDown className="w-4 h-4" />
          </button>
          <div className="w-[1px] h-4 bg-white/10 mx-1" />
          <button 
            onClick={() => setIsGeneratorOpen(true)}
            className="flex items-center gap-2 bg-white/5 hover:bg-white/10 text-white text-[10px] font-bold px-4 py-1.5 rounded border border-white/5 uppercase transition-colors"
          >
            <Sparkles className="w-3.5 h-3.5 text-blue-400" />
            AI Generator
          </button>
          <div className="w-[1px] h-4 bg-white/10 mx-1" />
          <button 
            onClick={handleRun}
            disabled={isLoading}
            className="bg-blue-600 hover:bg-blue-500 disabled:opacity-50 text-white text-[10px] font-bold px-4 py-1.5 rounded shadow-lg shadow-blue-900/20 uppercase transition-colors flex items-center gap-2"
          >
            {isLoading ? <Loader2 className="w-3 h-3 animate-spin" /> : <Play className="w-3 h-3" />}
            Execute Script
          </button>
          <div className="w-[1px] h-4 bg-white/10 mx-1" />
          <button onClick={handleReset} className="p-1.5 text-slate-500 hover:text-white transition-colors" title="Reset">
            <RotateCcw className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Editor & Output Panes */}
      <div className="flex-1 flex overflow-hidden">
        <div className="flex-1 min-w-0 border-r border-white/5">
          <Editor
            height="100%"
            language={language === 'batch' ? 'bat' : 'powershell'}
            theme="vs-dark"
            value={code}
            onChange={(val) => setCode(val || '')}
            onMount={(editor) => { 
                editorRef.current = editor;
                editor.onDidChangeCursorPosition((e: any) => {
                    setCursorPos({ ln: e.position.lineNumber, col: e.position.column });
                });
            }}
            options={{
              fontSize: 13,
              fontFamily: "'JetBrains Mono', monospace",
              minimap: { enabled: false },
              scrollBeyondLastLine: false,
              automaticLayout: true,
              padding: { top: 20 },
              lineNumbers: 'on',
              renderLineHighlight: 'all',
              scrollbar: {
                vertical: 'visible',
                horizontal: 'visible',
                useShadows: false,
                verticalScrollbarSize: 8,
              }
            }}
          />
          <div className="absolute bottom-4 left-4 bg-black/60 backdrop-blur-md px-3 py-1 rounded-full border border-white/5 text-[9px] font-bold text-slate-500 uppercase tracking-widest flex gap-4 pointer-events-none">
             <span>Ln {cursorPos.ln}, Col {cursorPos.col}</span>
             <span>UTF-8</span>
             <span>{language.toUpperCase()}</span>
          </div>
        </div>

        {/* Simulator Output */}
        <div className="w-[480px] flex flex-col bg-[#0E0E10] border-l border-white/5">
          <div className="h-8 border-b border-white/5 flex items-center px-4 justify-between bg-black/20">
            <div className="flex items-center gap-2">
              <span className="text-[9px] font-bold uppercase tracking-[0.2em] text-slate-500">Virtual Sandbox Console</span>
            </div>
            <div className="flex gap-4">
              <span className="text-[9px] text-green-500 font-mono">LOCAL_HOST: ACTIVE</span>
              <span className="text-[9px] text-blue-500 font-mono">STRICT_MODE: ON</span>
            </div>
          </div>
          
          <div className="flex-1 p-5 font-mono text-xs overflow-auto win-scroll leading-snug relative group">
            <div className="absolute inset-x-0 top-0 h-full pointer-events-none bg-[linear-gradient(rgba(18,16,16,0)_50%,rgba(0,0,0,0.1)_50%),linear-gradient(90deg,rgba(255,0,0,0.03),rgba(0,255,0,0.01),rgba(0,0,255,0.03))] bg-[length:100%_3px,3px_100%] opacity-20 z-20" />
            
            <div className="text-slate-600 mb-1 relative z-10">Microsoft Windows Script Sandbox [Version 1.2.0]</div>
            <div className="text-slate-600 italic mb-4 relative z-10">(c) 2026 WinScript Master. Testing isolated. No disk impact.</div>
            
            <AnimatePresence mode="wait">
              {output ? (
                <motion.div
                  key="output"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className="whitespace-pre-wrap text-slate-300 relative z-10"
                >
                  <div className="flex items-start gap-2 mb-2">
                    <span className="text-white shrink-0">C:\Lab&gt;</span>
                    <span className="text-white">{language === 'batch' ? 'automation_v1.bat' : '.\production_v1.ps1'}</span>
                  </div>
                  <div className="text-blue-100/90 drop-shadow-[0_0_8px_rgba(59,130,246,0.3)]">
                    {output}
                  </div>
                  <div className="mt-2 flex items-center gap-1">
                    <span className="text-white">C:\Lab&gt;</span>
                    <span className="w-1.5 h-3.5 bg-blue-500 animate-pulse"></span>
                  </div>
                </motion.div>
              ) : !isLoading ? (
                <div className="h-full flex flex-col items-center justify-center text-slate-700 text-center space-y-4 px-8 opacity-40">
                  <TerminalIcon className="w-10 h-10" />
                  <p className="text-[10px] uppercase tracking-widest">Awaiting execution...</p>
                </div>
              ) : (
                <div className="flex items-center gap-3 text-blue-400">
                   <Loader2 className="w-3 h-3 animate-spin" />
                   <span className="text-[10px] uppercase tracking-widest font-bold">Simulator running routine...</span>
                </div>
              )}
            </AnimatePresence>
          </div>

          {/* AI Insight Section */}
          <AnimatePresence>
            {insight && (
              <motion.div
                initial={{ y: 20, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                className="m-4 p-4 bg-blue-600/5 border border-blue-500/10 rounded-xl"
              >
                <div className="flex items-center justify-between mb-3">
                  <div className="text-[9px] font-bold text-blue-400 uppercase tracking-widest">Runtime Inspector</div>
                  <div className="text-green-400 text-[9px] font-bold tracking-tighter">98% OPTIMIZED</div>
                </div>
                <div className="max-h-[300px] overflow-auto win-scroll pr-2">
                  <p className="text-[10px] text-slate-500 leading-relaxed italic mb-4">
                    {insight}
                  </p>
                  <VariableInspector />
                  {explanation && (
                    <div className="mt-4 pt-4 border-t border-white/5 prose prose-invert prose-p:text-[10px] prose-p:leading-tight prose-slate text-[10px]">
                      <div className="text-[9px] font-bold text-blue-400 uppercase tracking-[0.2em] mb-2">Deep Explanation</div>
                      <div className="text-slate-400 whitespace-pre-wrap">
                        {explanation}
                      </div>
                    </div>
                  )}
                  {audit && (
                    <div className="mt-4 pt-4 border-t border-white/5 prose prose-invert prose-p:text-[10px] prose-p:leading-tight prose-slate text-[10px]">
                      <div className="text-[9px] font-bold text-orange-400 uppercase tracking-[0.2em] mb-2">Security Audit Profile</div>
                      <div className="text-orange-200/70 whitespace-pre-wrap italic">
                        {audit}
                      </div>
                    </div>
                  )}
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>
    </div>
  );
}
