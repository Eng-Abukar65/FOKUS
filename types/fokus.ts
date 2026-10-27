export type PriorityLevel = 'low' | 'medium' | 'high' | 'urgent';

export interface TaskCard {
  id: string;
  columnId: string;
  title: string;
  description: string;
  timeSpentSeconds: number;
  createdAt: string;
  updatedAt?: string;
  tags?: string[];
  priority?: PriorityLevel;
  estimatedPomodoros?: number;
  completedPomodoros?: number;
}

export interface BoardColumn {
  id: string;
  title: string;
}

export type AmbientTheme = 
  | 'rust' 
  | 'aurora' 
  | 'ocean' 
  | 'lavender' 
  | 'obsidian' 
  | 'minimal';

export interface Board {
  id: string;
  title: string;
  description?: string;
  ambientTheme: AmbientTheme;
  columns: BoardColumn[];
  cards: TaskCard[];
  createdAt: string;
}

export interface PomodoroSettings {
  workDuration: number;        // in minutes (default 25)
  shortBreakDuration: number;  // in minutes (default 5)
  longBreakDuration: number;   // in minutes (default 15)
  longBreakInterval: number;   // every N pomodoros (default 4)
  soundEnabled: boolean;
  soundVolume: number;         // 0.0 to 1.0
  autoStartBreaks: boolean;
  autoStartWork: boolean;
}

export type TimerMode = 'work' | 'shortBreak' | 'longBreak';

export interface FocusSessionLog {
  id: string;
  cardId?: string;
  cardTitle?: string;
  boardId: string;
  timestamp: string;
  durationSeconds: number;
  type: TimerMode;
  completed: boolean;
}

export interface FokusState {
  boards: Board[];
  activeBoardId: string;
  pomodoroSettings: PomodoroSettings;
  sessionLogs: FocusSessionLog[];
  activeCardId: string | null;
  darkMode: boolean;
}
