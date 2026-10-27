'use client';

import React, { useState } from 'react';
import { useFokusStore } from '@/store/fokusStore';
import { soundFX } from '@/lib/audio';
import { 
  X, 
  Clock, 
  Volume2, 
  VolumeX, 
  RotateCcw, 
  Sparkles,
  Check,
  Play
} from 'lucide-react';

interface SettingsModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const SettingsModal: React.FC<SettingsModalProps> = ({ isOpen, onClose }) => {
  const {
    pomodoroSettings,
    updateSettings,
    resetToSampleData,
  } = useFokusStore();

  const [workDuration, setWorkDuration] = useState(pomodoroSettings.workDuration);
  const [shortBreakDuration, setShortBreakDuration] = useState(pomodoroSettings.shortBreakDuration);
  const [longBreakDuration, setLongBreakDuration] = useState(pomodoroSettings.longBreakDuration);
  const [longBreakInterval, setLongBreakInterval] = useState(pomodoroSettings.longBreakInterval);
  const [soundEnabled, setSoundEnabled] = useState(pomodoroSettings.soundEnabled);
  const [soundVolume, setSoundVolume] = useState(pomodoroSettings.soundVolume);
  const [autoStartBreaks, setAutoStartBreaks] = useState(pomodoroSettings.autoStartBreaks);
  const [autoStartWork, setAutoStartWork] = useState(pomodoroSettings.autoStartWork);

  if (!isOpen) return null;

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    updateSettings({
      workDuration: Math.max(1, Number(workDuration)),
      shortBreakDuration: Math.max(1, Number(shortBreakDuration)),
      longBreakDuration: Math.max(1, Number(longBreakDuration)),
      longBreakInterval: Math.max(1, Number(longBreakInterval)),
      soundEnabled,
      soundVolume,
      autoStartBreaks,
      autoStartWork,
    });
    onClose();
  };

  const handleTestSound = () => {
    soundFX.playComplete(soundVolume);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-primary-950/60 backdrop-blur-sm animate-in fade-in duration-200">
      <div 
        className="w-full max-w-md glass-panel rounded-3xl p-6 shadow-2xl border border-primary/10 dark:border-white/10 max-h-[90vh] overflow-y-auto"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-center justify-between pb-3 border-b border-primary/10 dark:border-white/10">
          <div className="flex items-center gap-2">
            <Clock className="w-5 h-5 text-accent" />
            <h2 className="text-lg font-bold text-primary dark:text-white">
              Timer & Sound Settings
            </h2>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-xl text-primary-400 hover:text-primary-700 dark:hover:text-white hover:bg-primary-100 dark:hover:bg-primary-800 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <form onSubmit={handleSave} className="space-y-5 pt-4">
          {/* Time Durations */}
          <div className="space-y-3">
            <h3 className="text-xs font-bold uppercase tracking-wider text-primary-400">
              Session Intervals (Minutes)
            </h3>

            <div className="grid grid-cols-3 gap-3">
              <div>
                <label className="block text-[11px] font-semibold text-primary-600 dark:text-primary-300 mb-1">
                  Focus Work
                </label>
                <input
                  type="number"
                  min="1"
                  max="120"
                  value={workDuration}
                  onChange={(e) => setWorkDuration(Number(e.target.value))}
                  className="w-full text-center font-bold px-2 py-2 rounded-xl bg-white/80 dark:bg-primary-900/80 border border-primary/15 dark:border-white/15 text-primary dark:text-white outline-none focus:border-accent text-sm"
                />
              </div>

              <div>
                <label className="block text-[11px] font-semibold text-primary-600 dark:text-primary-300 mb-1">
                  Short Break
                </label>
                <input
                  type="number"
                  min="1"
                  max="60"
                  value={shortBreakDuration}
                  onChange={(e) => setShortBreakDuration(Number(e.target.value))}
                  className="w-full text-center font-bold px-2 py-2 rounded-xl bg-white/80 dark:bg-primary-900/80 border border-primary/15 dark:border-white/15 text-primary dark:text-white outline-none focus:border-accent text-sm"
                />
              </div>

              <div>
                <label className="block text-[11px] font-semibold text-primary-600 dark:text-primary-300 mb-1">
                  Long Break
                </label>
                <input
                  type="number"
                  min="1"
                  max="120"
                  value={longBreakDuration}
                  onChange={(e) => setLongBreakDuration(Number(e.target.value))}
                  className="w-full text-center font-bold px-2 py-2 rounded-xl bg-white/80 dark:bg-primary-900/80 border border-primary/15 dark:border-white/15 text-primary dark:text-white outline-none focus:border-accent text-sm"
                />
              </div>
            </div>

            <div>
              <label className="block text-[11px] font-semibold text-primary-600 dark:text-primary-300 mb-1">
                Long Break Interval (Every N Pomodoros)
              </label>
              <input
                type="number"
                min="1"
                max="12"
                value={longBreakInterval}
                onChange={(e) => setLongBreakInterval(Number(e.target.value))}
                className="w-24 text-center font-bold px-2 py-2 rounded-xl bg-white/80 dark:bg-primary-900/80 border border-primary/15 dark:border-white/15 text-primary dark:text-white outline-none focus:border-accent text-sm"
              />
            </div>
          </div>

          {/* Sound Settings */}
          <div className="pt-3 border-t border-primary/10 dark:border-white/10 space-y-3">
            <h3 className="text-xs font-bold uppercase tracking-wider text-primary-400">
              Audio & Alerts
            </h3>

            <div className="flex items-center justify-between">
              <span className="text-xs font-semibold text-primary-700 dark:text-primary-300">
                Play Web Audio Chime on Session Completion
              </span>
              <button
                type="button"
                onClick={() => setSoundEnabled(!soundEnabled)}
                className={`w-11 h-6 rounded-full transition-colors relative ${
                  soundEnabled ? 'bg-accent' : 'bg-primary-200 dark:bg-primary-700'
                }`}
              >
                <span
                  className={`block w-4 h-4 rounded-full bg-white shadow-sm transform transition-transform ${
                    soundEnabled ? 'translate-x-6' : 'translate-x-1'
                  }`}
                />
              </button>
            </div>

            {soundEnabled && (
              <div className="flex items-center gap-3 pt-1">
                <input
                  type="range"
                  min="0.1"
                  max="1.0"
                  step="0.05"
                  value={soundVolume}
                  onChange={(e) => setSoundVolume(parseFloat(e.target.value))}
                  className="flex-1 accent-accent cursor-pointer"
                />
                <button
                  type="button"
                  onClick={handleTestSound}
                  className="flex items-center gap-1 px-2.5 py-1 rounded-lg bg-primary-100 dark:bg-primary-800 text-[11px] font-semibold text-primary-700 dark:text-primary-300 hover:bg-primary-200"
                >
                  <Play className="w-3 h-3" />
                  <span>Test Chime</span>
                </button>
              </div>
            )}
          </div>

          {/* Automation toggles */}
          <div className="pt-3 border-t border-primary/10 dark:border-white/10 space-y-3">
            <h3 className="text-xs font-bold uppercase tracking-wider text-primary-400">
              Workflow Automation
            </h3>

            <div className="flex items-center justify-between">
              <span className="text-xs font-semibold text-primary-700 dark:text-primary-300">
                Auto-start Breaks
              </span>
              <button
                type="button"
                onClick={() => setAutoStartBreaks(!autoStartBreaks)}
                className={`w-11 h-6 rounded-full transition-colors relative ${
                  autoStartBreaks ? 'bg-accent' : 'bg-primary-200 dark:bg-primary-700'
                }`}
              >
                <span
                  className={`block w-4 h-4 rounded-full bg-white shadow-sm transform transition-transform ${
                    autoStartBreaks ? 'translate-x-6' : 'translate-x-1'
                  }`}
                />
              </button>
            </div>

            <div className="flex items-center justify-between">
              <span className="text-xs font-semibold text-primary-700 dark:text-primary-300">
                Auto-start Focus Work after Break
              </span>
              <button
                type="button"
                onClick={() => setAutoStartWork(!autoStartWork)}
                className={`w-11 h-6 rounded-full transition-colors relative ${
                  autoStartWork ? 'bg-accent' : 'bg-primary-200 dark:bg-primary-700'
                }`}
              >
                <span
                  className={`block w-4 h-4 rounded-full bg-white shadow-sm transform transition-transform ${
                    autoStartWork ? 'translate-x-6' : 'translate-x-1'
                  }`}
                />
              </button>
            </div>
          </div>

          {/* Reset To Sample Data */}
          <div className="pt-3 border-t border-primary/10 dark:border-white/10 flex items-center justify-between">
            <button
              type="button"
              onClick={() => {
                if (confirm('Reset board and cards to initial specification sample?')) {
                  resetToSampleData();
                  onClose();
                }
              }}
              className="flex items-center gap-1.5 text-xs text-primary-500 hover:text-rose-600 transition-colors"
            >
              <RotateCcw className="w-3.5 h-3.5" />
              <span>Reset to Sample Data</span>
            </button>
          </div>

          {/* Save Footer */}
          <div className="pt-4 border-t border-primary/10 dark:border-white/10 flex items-center justify-end gap-2">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 rounded-xl text-xs font-medium text-primary-600 dark:text-primary-400 hover:bg-primary-100 dark:hover:bg-primary-800 transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="flex items-center gap-1.5 px-5 py-2 rounded-xl bg-accent text-white text-xs font-bold hover:bg-accent-600 shadow-md shadow-accent/25 transition-all"
            >
              <Check className="w-4 h-4" />
              <span>Save Settings</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
