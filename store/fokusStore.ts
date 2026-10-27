import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import { 
  Board, 
  TaskCard, 
  PomodoroSettings, 
  TimerMode, 
  FocusSessionLog, 
  AmbientTheme,
  PriorityLevel
} from '@/types/fokus';
import { INITIAL_STATE } from '@/lib/initialData';
import { soundFX } from '@/lib/audio';

interface FokusStoreState {
  boards: Board[];
  activeBoardId: string;
  activeCardId: string | null;
  darkMode: boolean;
  pomodoroSettings: PomodoroSettings;
  sessionLogs: FocusSessionLog[];

  // Timer dynamic state (live session)
  timerMode: TimerMode;
  timeRemaining: number; // in seconds
  isRunning: boolean;
  pomodoroCycleCount: number;

  // Board actions
  setActiveBoard: (boardId: string) => void;
  createBoard: (title: string, theme?: AmbientTheme) => string;
  renameBoard: (boardId: string, title: string) => void;
  deleteBoard: (boardId: string) => void;
  setAmbientTheme: (boardId: string, theme: AmbientTheme) => void;

  // Column actions
  renameColumn: (boardId: string, columnId: string, title: string) => void;
  addColumn: (boardId: string, title: string) => void;
  deleteColumn: (boardId: string, columnId: string) => void;

  // Card actions
  setActiveCard: (cardId: string | null) => void;
  createCard: (
    boardId: string, 
    columnId: string, 
    card: {
      title: string;
      description?: string;
      priority?: PriorityLevel;
      tags?: string[];
      estimatedPomodoros?: number;
    }
  ) => string;
  updateCard: (boardId: string, cardId: string, updates: Partial<TaskCard>) => void;
  deleteCard: (boardId: string, cardId: string) => void;
  moveCard: (boardId: string, cardId: string, targetColumnId: string, newIndex: number) => void;
  reorderCardInColumn: (boardId: string, columnId: string, startIndex: number, endIndex: number) => void;
  toggleCardTimer: (cardId: string) => void;

  // Pomodoro Actions
  startTimer: () => void;
  pauseTimer: () => void;
  resetTimer: () => void;
  setTimerMode: (mode: TimerMode) => void;
  tickTimer: () => void;
  completeTimerSession: () => void;
  updateSettings: (newSettings: Partial<PomodoroSettings>) => void;
  toggleDarkMode: () => void;
  resetToSampleData: () => void;
}

export const useFokusStore = create<FokusStoreState>()(
  persist(
    (set, get) => ({
      boards: INITIAL_STATE.boards,
      activeBoardId: INITIAL_STATE.activeBoardId,
      activeCardId: INITIAL_STATE.activeCardId,
      darkMode: INITIAL_STATE.darkMode,
      pomodoroSettings: INITIAL_STATE.pomodoroSettings,
      sessionLogs: INITIAL_STATE.sessionLogs,

      // Initial timer state (25 minutes)
      timerMode: 'work',
      timeRemaining: 25 * 60,
      isRunning: false,
      pomodoroCycleCount: 0,

      setActiveBoard: (boardId) => set({ activeBoardId: boardId }),

      createBoard: (title, theme = 'rust') => {
        const id = `board-${Date.now()}`;
        const newBoard: Board = {
          id,
          title: title.trim() || 'Untitled Board',
          ambientTheme: theme,
          createdAt: new Date().toISOString(),
          columns: [
            { id: `col-1-${Date.now()}`, title: 'TO DO' },
            { id: `col-2-${Date.now()}`, title: 'DOING' },
            { id: `col-3-${Date.now()}`, title: 'DONE' },
          ],
          cards: [],
        };

        set((state) => ({
          boards: [...state.boards, newBoard],
          activeBoardId: id,
        }));
        return id;
      },

      renameBoard: (boardId, title) => {
        set((state) => ({
          boards: state.boards.map((b) =>
            b.id === boardId ? { ...b, title: title.trim() || b.title } : b
          ),
        }));
      },

      deleteBoard: (boardId) => {
        set((state) => {
          if (state.boards.length <= 1) return state; // Keep at least one board
          const newBoards = state.boards.filter((b) => b.id !== boardId);
          return {
            boards: newBoards,
            activeBoardId: state.activeBoardId === boardId ? newBoards[0].id : state.activeBoardId,
          };
        });
      },

      setAmbientTheme: (boardId, theme) => {
        set((state) => ({
          boards: state.boards.map((b) =>
            b.id === boardId ? { ...b, ambientTheme: theme } : b
          ),
        }));
      },

      renameColumn: (boardId, columnId, title) => {
        set((state) => ({
          boards: state.boards.map((b) => {
            if (b.id !== boardId) return b;
            return {
              ...b,
              columns: b.columns.map((c) =>
                c.id === columnId ? { ...c, title: title.trim() || c.title } : c
              ),
            };
          }),
        }));
      },

      addColumn: (boardId, title) => {
        const newColId = `col-${Date.now()}`;
        set((state) => ({
          boards: state.boards.map((b) => {
            if (b.id !== boardId) return b;
            return {
              ...b,
              columns: [...b.columns, { id: newColId, title: title.trim() || 'NEW COLUMN' }],
            };
          }),
        }));
      },

      deleteColumn: (boardId, columnId) => {
        set((state) => ({
          boards: state.boards.map((b) => {
            if (b.id !== boardId) return b;
            return {
              ...b,
              columns: b.columns.filter((c) => c.id !== columnId),
              cards: b.cards.filter((card) => card.columnId !== columnId),
            };
          }),
        }));
      },

      setActiveCard: (cardId) => {
        set({ activeCardId: cardId });
      },

      createCard: (boardId, columnId, cardData) => {
        const newCardId = `card-${Date.now()}`;
        const newCard: TaskCard = {
          id: newCardId,
          columnId,
          title: cardData.title.trim() || 'Untitled Task',
          description: cardData.description || '',
          timeSpentSeconds: 0,
          createdAt: new Date().toISOString(),
          tags: cardData.tags || [],
          priority: cardData.priority || 'medium',
          estimatedPomodoros: cardData.estimatedPomodoros || 1,
          completedPomodoros: 0,
        };

        set((state) => ({
          boards: state.boards.map((b) => {
            if (b.id !== boardId) return b;
            return { ...b, cards: [newCard, ...b.cards] };
          }),
        }));

        return newCardId;
      },

      updateCard: (boardId, cardId, updates) => {
        set((state) => ({
          boards: state.boards.map((b) => {
            if (b.id !== boardId) return b;
            return {
              ...b,
              cards: b.cards.map((c) =>
                c.id === cardId ? { ...c, ...updates, updatedAt: new Date().toISOString() } : c
              ),
            };
          }),
        }));
      },

      deleteCard: (boardId, cardId) => {
        set((state) => ({
          activeCardId: state.activeCardId === cardId ? null : state.activeCardId,
          boards: state.boards.map((b) => {
            if (b.id !== boardId) return b;
            return {
              ...b,
              cards: b.cards.filter((c) => c.id !== cardId),
            };
          }),
        }));
      },

      moveCard: (boardId, cardId, targetColumnId, newIndex) => {
        set((state) => {
          return {
            boards: state.boards.map((b) => {
              if (b.id !== boardId) return b;
              const card = b.cards.find((c) => c.id === cardId);
              if (!card) return b;

              // Remove card
              const otherCards = b.cards.filter((c) => c.id !== cardId);
              const updatedCard = { ...card, columnId: targetColumnId };

              // Filter cards in the target column
              const targetColCards = otherCards.filter((c) => c.columnId === targetColumnId);
              const remainingCards = otherCards.filter((c) => c.columnId !== targetColumnId);

              // Insert at index
              targetColCards.splice(newIndex, 0, updatedCard);

              return {
                ...b,
                cards: [...remainingCards, ...targetColCards],
              };
            }),
          };
        });
      },

      reorderCardInColumn: (boardId, columnId, startIndex, endIndex) => {
        set((state) => {
          return {
            boards: state.boards.map((b) => {
              if (b.id !== boardId) return b;
              const colCards = b.cards.filter((c) => c.columnId === columnId);
              const nonColCards = b.cards.filter((c) => c.columnId !== columnId);

              const [movedCard] = colCards.splice(startIndex, 1);
              if (!movedCard) return b;
              colCards.splice(endIndex, 0, movedCard);

              return {
                ...b,
                cards: [...nonColCards, ...colCards],
              };
            }),
          };
        });
      },

      toggleCardTimer: (cardId) => {
        const { activeCardId, isRunning, pomodoroSettings } = get();
        if (activeCardId === cardId && isRunning) {
          // Pause
          set({ isRunning: false });
          if (pomodoroSettings.soundEnabled) {
            soundFX.playPause(pomodoroSettings.soundVolume);
          }
        } else {
          // Select and start
          set({
            activeCardId: cardId,
            timerMode: 'work',
            isRunning: true,
          });
          if (pomodoroSettings.soundEnabled) {
            soundFX.playStart(pomodoroSettings.soundVolume);
          }
        }
      },

      startTimer: () => {
        const { pomodoroSettings } = get();
        set({ isRunning: true });
        if (pomodoroSettings.soundEnabled) {
          soundFX.playStart(pomodoroSettings.soundVolume);
        }
      },

      pauseTimer: () => {
        const { pomodoroSettings } = get();
        set({ isRunning: false });
        if (pomodoroSettings.soundEnabled) {
          soundFX.playPause(pomodoroSettings.soundVolume);
        }
      },

      resetTimer: () => {
        const { timerMode, pomodoroSettings } = get();
        const durationMin = 
          timerMode === 'work'
            ? pomodoroSettings.workDuration
            : timerMode === 'shortBreak'
            ? pomodoroSettings.shortBreakDuration
            : pomodoroSettings.longBreakDuration;

        set({
          isRunning: false,
          timeRemaining: durationMin * 60,
        });
      },

      setTimerMode: (mode) => {
        const { pomodoroSettings } = get();
        const durationMin = 
          mode === 'work'
            ? pomodoroSettings.workDuration
            : mode === 'shortBreak'
            ? pomodoroSettings.shortBreakDuration
            : pomodoroSettings.longBreakDuration;

        set({
          timerMode: mode,
          timeRemaining: durationMin * 60,
          isRunning: false,
        });
      },

      tickTimer: () => {
        const { 
          isRunning, 
          timeRemaining, 
          timerMode, 
          activeCardId, 
          activeBoardId, 
          completeTimerSession 
        } = get();

        if (!isRunning) return;

        if (timeRemaining <= 1) {
          completeTimerSession();
          return;
        }

        // Decrement timer
        set({ timeRemaining: timeRemaining - 1 });

        // If in 'work' mode and an active card is selected, increment its time spent
        if (timerMode === 'work' && activeCardId) {
          set((state) => ({
            boards: state.boards.map((b) => {
              if (b.id !== activeBoardId) return b;
              return {
                ...b,
                cards: b.cards.map((c) =>
                  c.id === activeCardId
                    ? { ...c, timeSpentSeconds: c.timeSpentSeconds + 1 }
                    : c
                ),
              };
            }),
          }));
        }
      },

      completeTimerSession: () => {
        const { 
          timerMode, 
          pomodoroSettings, 
          activeCardId, 
          activeBoardId, 
          boards, 
          pomodoroCycleCount 
        } = get();

        // Sound alert
        if (pomodoroSettings.soundEnabled) {
          soundFX.playComplete(pomodoroSettings.soundVolume);
        }

        // Active card lookup
        const activeBoard = boards.find((b) => b.id === activeBoardId);
        const activeCard = activeBoard?.cards.find((c) => c.id === activeCardId);

        // Calculate session duration in seconds
        const sessionDuration = 
          (timerMode === 'work'
            ? pomodoroSettings.workDuration
            : timerMode === 'shortBreak'
            ? pomodoroSettings.shortBreakDuration
            : pomodoroSettings.longBreakDuration) * 60;

        // Create log entry
        const logEntry: FocusSessionLog = {
          id: `log-${Date.now()}`,
          cardId: activeCardId || undefined,
          cardTitle: activeCard?.title || (timerMode === 'work' ? 'Quick Focus Session' : 'Break Time'),
          boardId: activeBoardId,
          timestamp: new Date().toISOString(),
          durationSeconds: sessionDuration,
          type: timerMode,
          completed: true,
        };

        // If work session, increment card completed pomodoros
        let nextCycle = pomodoroCycleCount;
        let nextMode: TimerMode = 'shortBreak';

        if (timerMode === 'work') {
          nextCycle += 1;
          if (activeCardId) {
            set((state) => ({
              boards: state.boards.map((b) => {
                if (b.id !== activeBoardId) return b;
                return {
                  ...b,
                  cards: b.cards.map((c) =>
                    c.id === activeCardId
                      ? { ...c, completedPomodoros: (c.completedPomodoros || 0) + 1 }
                      : c
                  ),
                };
              }),
            }));
          }

          if (nextCycle % pomodoroSettings.longBreakInterval === 0) {
            nextMode = 'longBreak';
          } else {
            nextMode = 'shortBreak';
          }
        } else {
          nextMode = 'work';
        }

        const nextDurationMin = 
          nextMode === 'work'
            ? pomodoroSettings.workDuration
            : nextMode === 'shortBreak'
            ? pomodoroSettings.shortBreakDuration
            : pomodoroSettings.longBreakDuration;

        const shouldAutoStart = 
          nextMode === 'work' 
            ? pomodoroSettings.autoStartWork 
            : pomodoroSettings.autoStartBreaks;

        set((state) => ({
          sessionLogs: [logEntry, ...state.sessionLogs],
          pomodoroCycleCount: nextCycle,
          timerMode: nextMode,
          timeRemaining: nextDurationMin * 60,
          isRunning: shouldAutoStart,
        }));
      },

      updateSettings: (newSettings) => {
        set((state) => {
          const updated = { ...state.pomodoroSettings, ...newSettings };
          // If timer is not running, adjust timeRemaining to current mode's duration
          let newTime = state.timeRemaining;
          if (!state.isRunning) {
            const currentDur = 
              state.timerMode === 'work' 
                ? updated.workDuration 
                : state.timerMode === 'shortBreak' 
                ? updated.shortBreakDuration 
                : updated.longBreakDuration;
            newTime = currentDur * 60;
          }
          return {
            pomodoroSettings: updated,
            timeRemaining: newTime,
          };
        });
      },

      toggleDarkMode: () => {
        set((state) => {
          const newDark = !state.darkMode;
          if (typeof document !== 'undefined') {
            if (newDark) {
              document.documentElement.classList.add('dark');
            } else {
              document.documentElement.classList.remove('dark');
            }
          }
          return { darkMode: newDark };
        });
      },

      resetToSampleData: () => {
        set({
          boards: INITIAL_STATE.boards,
          activeBoardId: INITIAL_STATE.activeBoardId,
          activeCardId: INITIAL_STATE.activeCardId,
          sessionLogs: INITIAL_STATE.sessionLogs,
          pomodoroSettings: INITIAL_STATE.pomodoroSettings,
          timerMode: 'work',
          timeRemaining: 25 * 60,
          isRunning: false,
        });
      },
    }),
    {
      name: 'fokus_app_state_v1',
      storage: createJSONStorage(() => localStorage),
      partialize: (state) => ({
        boards: state.boards,
        activeBoardId: state.activeBoardId,
        activeCardId: state.activeCardId,
        darkMode: state.darkMode,
        pomodoroSettings: state.pomodoroSettings,
        sessionLogs: state.sessionLogs,
        pomodoroCycleCount: state.pomodoroCycleCount,
      }),
    }
  )
);
