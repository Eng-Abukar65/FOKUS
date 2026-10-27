'use client';

import React, { useState } from 'react';
import { useFokusStore } from '@/store/fokusStore';
import { formatTimeSpent } from '@/lib/utils';
import { 
  X, 
  BarChart3, 
  Clock, 
  Flame, 
  CheckCircle2, 
  Download, 
  Layers,
  Calendar
} from 'lucide-react';

interface AnalyticsModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const AnalyticsModal: React.FC<AnalyticsModalProps> = ({ isOpen, onClose }) => {
  const {
    boards,
    activeBoardId,
    sessionLogs,
    pomodoroCycleCount,
  } = useFokusStore();

  const [activeTab, setActiveTab] = useState<'overview' | 'sessions'>('overview');

  if (!isOpen) return null;

  const activeBoard = boards.find((b) => b.id === activeBoardId) || boards[0];

  // Calculate overall metrics
  const totalSecondsAllCards = activeBoard
    ? activeBoard.cards.reduce((acc, c) => acc + c.timeSpentSeconds, 0)
    : 0;

  const totalPomodorosCompleted = activeBoard
    ? activeBoard.cards.reduce((acc, c) => acc + (c.completedPomodoros || 0), 0)
    : 0;

  // Breakdown by Column
  const columnBreakdown = activeBoard
    ? activeBoard.columns.map((col) => {
        const colCards = activeBoard.cards.filter((c) => c.columnId === col.id);
        const colSeconds = colCards.reduce((acc, c) => acc + c.timeSpentSeconds, 0);
        return {
          columnTitle: col.title,
          cardCount: colCards.length,
          seconds: colSeconds,
        };
      })
    : [];

  // Top tasks by focus time
  const topCards = activeBoard
    ? [...activeBoard.cards]
        .sort((a, b) => b.timeSpentSeconds - a.timeSpentSeconds)
        .slice(0, 5)
    : [];

  const handleExportJSON = () => {
    const dataStr = 'data:text/json;charset=utf-8,' + encodeURIComponent(
      JSON.stringify({ boards, sessionLogs }, null, 2)
    );
    const downloadAnchor = document.createElement('a');
    downloadAnchor.setAttribute('href', dataStr);
    downloadAnchor.setAttribute('download', `fokus-backup-${new Date().toISOString().slice(0, 10)}.json`);
    document.body.appendChild(downloadAnchor);
    downloadAnchor.click();
    downloadAnchor.remove();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-primary-950/60 backdrop-blur-sm animate-in fade-in duration-200">
      <div 
        className="w-full max-w-2xl glass-panel rounded-3xl p-6 shadow-2xl border border-primary/10 dark:border-white/10 max-h-[90vh] overflow-y-auto"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-center justify-between pb-3 border-b border-primary/10 dark:border-white/10">
          <div className="flex items-center gap-2">
            <BarChart3 className="w-5 h-5 text-accent" />
            <h2 className="text-lg font-bold text-primary dark:text-white">
              Focus Analytics & Session Logs
            </h2>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-xl text-primary-400 hover:text-primary-700 dark:hover:text-white hover:bg-primary-100 dark:hover:bg-primary-800 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Tab Switcher */}
        <div className="flex items-center gap-2 my-4 p-1 bg-primary-100/70 dark:bg-primary-800/60 rounded-xl text-xs font-semibold w-fit">
          <button
            onClick={() => setActiveTab('overview')}
            className={`px-3 py-1.5 rounded-lg transition-all ${
              activeTab === 'overview'
                ? 'bg-white dark:bg-primary-700 text-primary dark:text-white shadow-sm'
                : 'text-primary-600 dark:text-primary-400 hover:text-primary'
            }`}
          >
            Board Overview
          </button>
          <button
            onClick={() => setActiveTab('sessions')}
            className={`px-3 py-1.5 rounded-lg transition-all ${
              activeTab === 'sessions'
                ? 'bg-white dark:bg-primary-700 text-primary dark:text-white shadow-sm'
                : 'text-primary-600 dark:text-primary-400 hover:text-primary'
            }`}
          >
            Focus Session History ({sessionLogs.length})
          </button>
        </div>

        {activeTab === 'overview' ? (
          <div className="space-y-5">
            {/* KPI Cards */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              <div className="p-4 rounded-2xl bg-white/60 dark:bg-primary-800/40 border border-primary/10 dark:border-white/10">
                <div className="flex items-center gap-2 text-primary-500 mb-1">
                  <Clock className="w-4 h-4 text-accent" />
                  <span className="text-[11px] font-semibold uppercase tracking-wider">
                    Total Focus Time
                  </span>
                </div>
                <div className="text-2xl font-mono font-bold text-primary dark:text-white">
                  {formatTimeSpent(totalSecondsAllCards)}
                </div>
                <span className="text-[10px] text-primary-400">across all board tasks</span>
              </div>

              <div className="p-4 rounded-2xl bg-white/60 dark:bg-primary-800/40 border border-primary/10 dark:border-white/10">
                <div className="flex items-center gap-2 text-primary-500 mb-1">
                  <Flame className="w-4 h-4 text-accent" />
                  <span className="text-[11px] font-semibold uppercase tracking-wider">
                    Pomodoros Logged
                  </span>
                </div>
                <div className="text-2xl font-mono font-bold text-accent">
                  {totalPomodorosCompleted}
                </div>
                <span className="text-[10px] text-primary-400">deep work blocks</span>
              </div>

              <div className="p-4 rounded-2xl bg-white/60 dark:bg-primary-800/40 border border-primary/10 dark:border-white/10">
                <div className="flex items-center gap-2 text-primary-500 mb-1">
                  <CheckCircle2 className="w-4 h-4 text-emerald-500" />
                  <span className="text-[11px] font-semibold uppercase tracking-wider">
                    Tasks Total
                  </span>
                </div>
                <div className="text-2xl font-mono font-bold text-primary dark:text-white">
                  {activeBoard.cards.length}
                </div>
                <span className="text-[10px] text-primary-400">in &ldquo;{activeBoard.title}&rdquo;</span>
              </div>
            </div>

            {/* Column Time Breakdown */}
            <div>
              <h3 className="text-xs font-bold uppercase tracking-wider text-primary-400 mb-2">
                Time Distribution by Column
              </h3>
              <div className="space-y-2">
                {columnBreakdown.map((col, idx) => {
                  const percentage = totalSecondsAllCards > 0
                    ? Math.round((col.seconds / totalSecondsAllCards) * 100)
                    : 0;

                  return (
                    <div 
                      key={idx}
                      className="p-3 rounded-2xl bg-white/50 dark:bg-primary-900/50 border border-primary/10 dark:border-white/10"
                    >
                      <div className="flex items-center justify-between text-xs font-semibold mb-1.5">
                        <span className="text-primary dark:text-white">{col.columnTitle}</span>
                        <span className="font-mono text-primary-600 dark:text-primary-300">
                          {formatTimeSpent(col.seconds)} ({percentage}%)
                        </span>
                      </div>
                      <div className="w-full bg-primary-100 dark:bg-primary-800 h-2 rounded-full overflow-hidden">
                        <div 
                          className="bg-accent h-full rounded-full transition-all duration-500"
                          style={{ width: `${percentage}%` }}
                        />
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Top Cards Ranking */}
            <div>
              <h3 className="text-xs font-bold uppercase tracking-wider text-primary-400 mb-2">
                Most Focused Tasks
              </h3>
              <div className="space-y-1.5">
                {topCards.map((card, idx) => (
                  <div
                    key={card.id}
                    className="flex items-center justify-between px-3 py-2 rounded-xl bg-white/40 dark:bg-primary-800/30 text-xs"
                  >
                    <div className="flex items-center gap-2 truncate mr-2">
                      <span className="font-mono text-primary-400 text-[11px]">#{idx + 1}</span>
                      <span className="font-semibold text-primary dark:text-white truncate">
                        {card.title}
                      </span>
                    </div>
                    <span className="font-mono font-bold text-accent shrink-0">
                      {formatTimeSpent(card.timeSpentSeconds)}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        ) : (
          /* Session Log History */
          <div className="space-y-3">
            <div className="max-h-80 overflow-y-auto space-y-2 pr-1">
              {sessionLogs.length === 0 ? (
                <div className="text-center py-8 text-xs text-primary-400">
                  No focus sessions logged yet. Start the Pomodoro timer to log focus blocks!
                </div>
              ) : (
                sessionLogs.map((log) => (
                  <div
                    key={log.id}
                    className="flex items-center justify-between p-3 rounded-2xl bg-white/60 dark:bg-primary-800/40 border border-primary/5 dark:border-white/5 text-xs"
                  >
                    <div className="flex items-center gap-2.5">
                      <span
                        className={`w-2 h-2 rounded-full ${
                          log.type === 'work' ? 'bg-accent' : 'bg-emerald-500'
                        }`}
                      />
                      <div>
                        <div className="font-semibold text-primary dark:text-white">
                          {log.cardTitle || (log.type === 'work' ? 'Focus Session' : 'Break Time')}
                        </div>
                        <div className="text-[10px] text-primary-400">
                          {new Date(log.timestamp).toLocaleString()}
                        </div>
                      </div>
                    </div>

                    <div className="text-right">
                      <span className="font-mono font-bold text-primary dark:text-white">
                        {formatTimeSpent(log.durationSeconds)}
                      </span>
                      <div className="text-[10px] text-emerald-600 dark:text-emerald-400 font-medium">
                        Completed
                      </div>
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>
        )}

        {/* Footer with JSON Export */}
        <div className="pt-4 border-t border-primary/10 dark:border-white/10 flex items-center justify-between mt-4">
          <button
            onClick={handleExportJSON}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-primary-100 dark:bg-primary-800 text-xs font-semibold text-primary-700 dark:text-primary-200 hover:bg-primary-200 transition-colors"
          >
            <Download className="w-3.5 h-3.5" />
            <span>Export Data (JSON)</span>
          </button>

          <button
            onClick={onClose}
            className="px-5 py-2 rounded-xl bg-accent text-white text-xs font-bold hover:bg-accent-600 shadow-sm"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
};
