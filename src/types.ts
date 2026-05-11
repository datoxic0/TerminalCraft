export type ScriptLanguage = 'batch' | 'powershell';

export interface ScriptTemplate {
  id: string;
  title: string;
  description: string;
  code: string;
  language: ScriptLanguage;
  category: 'System' | 'Files' | 'Network' | 'Security' | 'Dev';
}

export interface NavItem {
  id: string;
  label: string;
  icon: string;
}

export type ViewState = 'tutorial' | 'editor' | 'library' | 'challenges' | 'about';

export interface Challenge {
  id: string;
  title: string;
  description: string;
  targetOutput: string;
  hint: string;
  language: ScriptLanguage;
  difficulty: 'Easy' | 'Medium' | 'Hard';
}

export interface UserProgress {
  completedChallenges: string[];
  completedModules: string[];
}
