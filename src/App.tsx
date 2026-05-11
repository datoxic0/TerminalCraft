import { useState } from 'react';
import Sidebar from './components/Sidebar';
import EditorView from './components/EditorView';
import TutorialView from './components/TutorialView';
import LibraryView from './components/LibraryView';
import ReferenceView from './components/ReferenceView';
import ChallengesView from './components/ChallengesView';
import AIQuickAssistant from './components/AIQuickAssistant';
import { ViewState, ScriptLanguage } from './types';
import { motion, AnimatePresence } from 'motion/react';

export default function App() {
  const [view, setView] = useState<ViewState>('tutorial');
  const [editorInitialCode, setEditorInitialCode] = useState<string | undefined>();
  const [editorInitialLanguage, setEditorInitialLanguage] = useState<ScriptLanguage | undefined>();

  const handleLibrarySelect = (code: string, language: ScriptLanguage) => {
    setEditorInitialCode(code);
    setEditorInitialLanguage(language);
    setView('editor');
  };

  const renderView = () => {
    switch (view) {
      case 'tutorial':
        return <TutorialView onTryCode={handleLibrarySelect} />;
      case 'editor':
        return <EditorView initialCode={editorInitialCode} initialLanguage={editorInitialLanguage} />;
      case 'library':
        return <LibraryView onSelect={handleLibrarySelect} />;
      case 'challenges':
        return <ChallengesView onStart={handleLibrarySelect} />;
      case 'about':
        return <ReferenceView />;
      default:
        return <TutorialView />;
    }
  };

  return (
    <div className="flex h-screen w-full bg-[var(--color-win-bg)] overflow-hidden flex-col">
      <div className="flex flex-1 overflow-hidden relative">
        <Sidebar activeView={view} onViewChange={setView} />
        
        <main className="flex-1 relative overflow-hidden">
          <AnimatePresence mode="wait">
            <motion.div
              key={view}
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              transition={{ duration: 0.2 }}
              className="w-full h-full"
            >
              {renderView()}
            </motion.div>
          </AnimatePresence>
        </main>

        <AIQuickAssistant />
      </div>

      <footer className="h-7 bg-blue-600 flex items-center justify-between px-4 text-[9px] text-white font-bold tracking-wider z-20">
        <div className="flex gap-6 uppercase">
          <span>Simulation Engine: v2.4.0 (AI-Augmented)</span>
          <span>Environment: Windows_NT 10.0 (Virtual)</span>
        </div>
        <div className="flex gap-6 uppercase">
          <span>Session Ready</span>
          <span className="flex items-center gap-1">
            <div className="w-1.5 h-1.5 bg-white rounded-full animate-pulse" />
            Live_Output
          </span>
        </div>
      </footer>
    </div>
  );
}
