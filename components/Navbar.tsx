'use client';

import React, { useEffect, useState } from 'react';
import { useFokusStore } from '@/store/fokusStore';
import { formatTimerSeconds } from '@/lib/utils';
import { 
  Play, 
  Pause, 
  RotateCcw, 
  Coffee, 
  Flame, 
  Volume2, 
  VolumeX, 
  Sun, 
  Moon, 
  Settings, 
  BarChart3, 
  Palette,
  Sparkles
} from 'lucide-react';

interface NavbarProps {
  onOpenSettings: () => void;
  onOpenAnalytics: () => void;
  onOpenTheme: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({
  onOpenSettings,
  onOpenAnalytics,
  onOpenTheme,
}) => {
  const {
    timerMode,
    timeRemaining,
    isRunning,
    startTimer,
    pauseTimer,
    resetTimer,
    setTimerMode,
    tickTimer,
    pomodoroSettings,
    updateSettings,
    darkMode,
    toggleDarkMode,
    activeCardId,
    activeBoardId,
    boards,
  } = useFokusStore();

  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  // Timer interval hook
  useEffect(() => {
    let interval: NodeJS.Timeout | null = null;
    if (isRunning) {
      interval = setInterval(() => {
        tickTimer();
      }, 1000);
    }
    return () => {
      if (interval) clearInterval(interval);
    };
  }, [isRunning, tickTimer]);

  // Find active card title for focus badge
  const activeBoard = boards.find((b) => b.id === activeBoardId);
  const activeCard = activeBoard?.cards.find((c) => c.id === activeCardId);

  // Synchronize document title with timer
  useEffect(() => {
    if (!mounted) return;
    const timeStr = formatTimerSeconds(timeRemaining);
    const modeLabel = timerMode === 'work' ? 'Focus' : 'Break';
    document.title = `${timeStr} - ${modeLabel} | FOKUS`;
  }, [timeRemaining, timerMode, mounted]);

  if (!mounted) return null;

  return (
    <header className="sticky top-0 z-30 w-full glass-panel border-b border-primary-900/10 dark:border-white/10 px-4 sm:px-6 py-2.5 transition-colors">
      <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-3 md:gap-4">
        
        {/* Logo and Active Task indicator */}
        <div className="flex items-center justify-between w-full md:w-auto gap-4">
          <div className="flex items-center gap-2.5">
            <div className="relative flex items-center justify-center w-8 h-8 rounded-xl bg-accent text-white shadow-md shadow-accent/30 font-black text-lg tracking-tighter">
              <span className="translate-y-[-1px]">F</span>
              <span className="absolute -top-0.5 -right-0.5 w-2 h-2 rounded-full bg-orange-300 animate-ping" />
            </div>
            <div>
              <span className="text-xl font-bold tracking-tight text-primary dark:text-white">
                FOKUS
              </span>
              <span className="hidden sm:inline-block ml-2 text-[10px] uppercase tracking-wider font-semibold px-2 py-0.5 rounded-full bg-accent/10 text-accent dark:bg-accent/20">
                Deep Work
              </span>
            </div>
          </div>

          {/* Active Card Pill on Mobile */}
          {activeCard && (
            <div className="md:hidden flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium bg-accent/10 text-accent border border-accent/20 truncate max-w-[160px]">
              <span className="w-2 h-2 rounded-full bg-accent animate-pulse" />
              <span className="truncate">{activeCard.title}</span>
            </div>
          )}
        </div>

        {/* Center: Integrated Pomodoro Floating Widget */}
        <div className="flex items-center gap-2 sm:gap-4 bg-white/70 dark:bg-primary-900/70 border border-primary/10 dark:border-white/10 px-3.5 py-1.5 rounded-2xl shadow-sm backdrop-blur-md">
          {/* Mode Switcher */}
          <div className="flex items-center p-0.5 bg-primary-100/70 dark:bg-primary-800/60 rounded-xl text-xs font-medium">
            <button
              onClick={() => setTimerMode('work')}
              className={`flex items-center gap-1.5 px-3 py-1 rounded-lg transition-all ${
                timerMode === 'work'
                  ? 'bg-accent text-white shadow-sm font-semibold'
                  : 'text-primary-600 dark:text-primary-300 hover:text-primary dark:hover:text-white'
              }`}
              title="Focus Session (25 min)"
            >
              <Flame className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">Focus</span>
            </button>

            <button
              onClick={() => setTimerMode('shortBreak')}
              className={`flex items-center gap-1.5 px-2.5 py-1 rounded-lg transition-all ${
                timerMode === 'shortBreak'
                  ? 'bg-emerald-600 text-white shadow-sm font-semibold'
                  : 'text-primary-600 dark:text-primary-300 hover:text-primary dark:hover:text-white'
              }`}
              title="Short Break (5 min)"
            >
              <Coffee className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">Short</span>
            </button>

            <button
              onClick={() => setTimerMode('longBreak')}
              className={`flex items-center gap-1.5 px-2.5 py-1 rounded-lg transition-all ${
                timerMode === 'longBreak'
                  ? 'bg-blue-600 text-white shadow-sm font-semibold'
                  : 'text-primary-600 dark:text-primary-300 hover:text-primary dark:hover:text-white'
              }`}
              title="Long Break (15 min)"
            >
              <Sparkles className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">Long</span>
            </button>
          </div>

          {/* Timer Display */}
          <div className="flex items-baseline gap-1 font-mono tracking-tight text-xl sm:text-2xl font-bold text-primary dark:text-white min-w-[70px] sm:min-w-[80px] text-center">
            {formatTimerSeconds(timeRemaining)}
          </div>

          {/* Timer Controls: Play / Pause / Reset */}
          <div className="flex items-center gap-1">
            {isRunning ? (
              <button
                onClick={pauseTimer}
                className="p-1.5 sm:p-2 rounded-xl bg-accent text-white hover:bg-accent-600 transition-transform active:scale-95 shadow-sm"
                title="Pause Focus Session"
              >
                <Pause className="w-4 h-4" />
              </button>
            ) : (
              <button
                onClick={startTimer}
                className="p-1.5 sm:p-2 rounded-xl bg-accent text-white hover:bg-accent-600 transition-transform active:scale-95 shadow-sm shadow-accent/25"
                title="Start Focus Session"
              >
                <Play className="w-4 h-4 ml-0.5" />
              </button>
            )}

            <button
              onClick={resetTimer}
              className="p-1.5 sm:p-2 rounded-xl text-primary-500 hover:text-primary-900 dark:text-primary-400 dark:hover:text-white hover:bg-primary-100/60 dark:hover:bg-primary-800/50 transition-colors"
              title="Reset Timer"
            >
              <RotateCcw className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Right side: Active Task preview & utility controls */}
        <div className="flex items-center gap-2">
          {/* Active Card Pill on Desktop */}
          {activeCard && (
            <div className="hidden lg:flex items-center gap-2 px-3 py-1.5 rounded-full text-xs font-medium bg-accent/10 text-accent border border-accent/25 shadow-sm max-w-[210px] animate-pulse-subtle">
              <span className="w-2 h-2 rounded-full bg-accent animate-ping" />
              <span className="truncate" title={activeCard.title}>
                Focus: {activeCard.title}
              </span>
            </div>
          )}

          {/* Sound Alert Toggle */}
          <button
            onClick={() => updateSettings({ soundEnabled: !pomodoroSettings.soundEnabled })}
            className={`p-2 rounded-xl transition-all ${
              pomodoroSettings.soundEnabled
                ? 'text-primary-700 dark:text-primary-200 hover:bg-primary-100/60 dark:hover:bg-primary-800/50'
                : 'text-primary-400 dark:text-primary-500 hover:bg-primary-100/40 dark:hover:bg-primary-800/30'
            }`}
            title={pomodoroSettings.soundEnabled ? 'Sound Alerts On' : 'Sound Alerts Muted'}
          >
            {pomodoroSettings.soundEnabled ? (
              <Volume2 className="w-4 h-4" />
            ) : (
              <VolumeX className="w-4 h-4" />
            )}
          </button>

          {/* Theme / Ambient Glow Selector */}
          <button
            onClick={onOpenTheme}
            className="p-2 rounded-xl text-primary-700 dark:text-primary-200 hover:bg-primary-100/60 dark:hover:bg-primary-800/50 transition-colors"
            title="Customize Ambient Theme"
          >
            <Palette className="w-4 h-4" />
          </button>

          {/* Analytics / Stats */}
          <button
            onClick={onOpenAnalytics}
            className="p-2 rounded-xl text-primary-700 dark:text-primary-200 hover:bg-primary-100/60 dark:hover:bg-primary-800/50 transition-colors"
            title="Focus Analytics & Time Logs"
          >
            <BarChart3 className="w-4 h-4" />
          </button>

          {/* Settings */}
          <button
            onClick={onOpenSettings}
            className="p-2 rounded-xl text-primary-700 dark:text-primary-200 hover:bg-primary-100/60 dark:hover:bg-primary-800/50 transition-colors"
            title="Pomodoro Settings"
          >
            <Settings className="w-4 h-4" />
          </button>

          {/* Dark / Light Mode Toggle */}
          <button
            onClick={toggleDarkMode}
            className="p-2 rounded-xl text-primary-700 dark:text-primary-200 hover:bg-primary-100/60 dark:hover:bg-primary-800/50 transition-colors"
            title={darkMode ? 'Switch to Light Mode' : 'Switch to Dark Mode'}
          >
            {darkMode ? <Sun className="w-4 h-4" /> : <Moon className="w-4 h-4" />}
          </button>
        </div>
      </div>
    </header>
  );
};
