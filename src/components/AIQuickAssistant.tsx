import { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { MessageSquare, Send, X, Cpu, Loader2, User, Bot } from 'lucide-react';
import { GoogleGenAI } from "@google/genai";

const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY || "" });

export default function AIQuickAssistant() {
  const [isOpen, setIsOpen] = useState(false);
  const [message, setMessage] = useState("");
  const [chat, setChat] = useState<{ role: 'user' | 'bot', text: string }[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  const handleSend = async () => {
    if (!message.trim()) return;
    
    const userMsg = message;
    setChat(prev => [...prev, { role: 'user', text: userMsg }]);
    setMessage("");
    setIsLoading(true);

    try {
      const response = await ai.models.generateContent({
        model: "gemini-3-flash-preview",
        contents: userMsg,
        config: {
          systemInstruction: "You are the WinScript AI Assistant. Help users with quick Windows scripting questions (Batch/PowerShell). Keep answers concise and technical."
        }
      });
      
      setChat(prev => [...prev, { role: 'bot', text: response.text?.trim() || "I couldn't process that." }]);
    } catch (err) {
      setChat(prev => [...prev, { role: 'bot', text: "Connection error. Please try again." }]);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <>
      <button
        onClick={() => setIsOpen(true)}
        className="fixed bottom-12 right-6 w-12 h-12 bg-blue-600 text-white rounded-2xl shadow-xl shadow-blue-900/40 flex items-center justify-center hover:bg-blue-500 transition-all z-40 group"
      >
        <MessageSquare className="w-5 h-5 group-hover:scale-110 transition-transform" />
        <div className="absolute -top-1 -right-1 w-3 h-3 bg-green-500 border-2 border-black rounded-full" />
      </button>

      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 20 }}
            className="fixed bottom-12 right-6 w-80 h-[450px] bg-[#121214] border border-white/10 rounded-2xl shadow-2xl flex flex-col z-50 overflow-hidden"
          >
            <div className="p-4 border-b border-white/5 flex items-center justify-between bg-blue-600/5">
              <div className="flex items-center gap-2">
                <Cpu className="w-4 h-4 text-blue-400" />
                <span className="text-xs font-bold text-white uppercase tracking-widest">Script Assistant</span>
              </div>
              <button 
                onClick={() => setIsOpen(false)}
                className="text-slate-500 hover:text-white transition-colors"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="flex-1 overflow-auto p-4 space-y-4 win-scroll">
              {chat.length === 0 && (
                <div className="h-full flex flex-col items-center justify-center text-center p-4">
                  <Bot className="w-8 h-8 text-slate-700 mb-2" />
                  <p className="text-[10px] text-slate-500 uppercase font-bold tracking-widest">Awaiting Command...</p>
                  <p className="text-[10px] text-slate-600 mt-1">Ask me about syntax, command flags, or best practices.</p>
                  <div className="grid grid-cols-1 gap-2 mt-4 w-full">
                    {[
                      "How do I loop in Batch?",
                      "PowerShell registry access",
                      "Best way to log errors",
                      "Batch vs PowerShell"
                    ].map(s => (
                      <button 
                        key={s}
                        onClick={() => { setMessage(s); }}
                        className="text-[9px] text-left p-2 rounded-lg bg-white/5 border border-white/5 text-slate-400 hover:bg-blue-600/10 hover:text-blue-400 transition-all uppercase font-bold tracking-wider"
                      >
                        {s}
                      </button>
                    ))}
                  </div>
                </div>
              )}
              {chat.map((m, i) => (
                <div key={i} className={`flex ${m.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                  <div className={`max-w-[85%] p-3 rounded-2xl text-[11px] leading-relaxed shadow-sm ${
                    m.role === 'user' 
                    ? 'bg-blue-600 text-white rounded-tr-none' 
                    : 'bg-white/5 text-slate-300 rounded-tl-none border border-white/5'
                  }`}>
                    {m.text}
                  </div>
                </div>
              ))}
              {isLoading && (
                <div className="flex justify-start">
                  <div className="bg-white/5 p-3 rounded-2xl rounded-tl-none border border-white/5">
                    <Loader2 className="w-3 h-3 text-blue-400 animate-spin" />
                  </div>
                </div>
              )}
            </div>

            <div className="p-4 border-t border-white/5 bg-black/20">
              <div className="relative">
                <input
                  type="text"
                  placeholder="Ask Assistant..."
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  onKeyDown={(e) => e.key === 'Enter' && handleSend()}
                  className="w-full bg-white/5 border border-white/5 rounded-xl pl-4 pr-10 py-2.5 text-xs text-slate-300 placeholder:text-slate-600 focus:outline-none focus:border-blue-500/50 transition-all"
                />
                <button
                  onClick={handleSend}
                  disabled={isLoading || !message.trim()}
                  className="absolute right-2 top-1/2 -translate-y-1/2 p-1.5 text-blue-400 hover:text-blue-300 disabled:opacity-30"
                >
                  <Send className="w-4 h-4" />
                </button>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
