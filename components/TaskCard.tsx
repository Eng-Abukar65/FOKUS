'use client';

import React from 'react';
import { TaskCard as TaskCardType } from '@/types/fokus';
import { useFokusStore } from '@/store/fokusStore';
import { formatTimeSpent } from '@/lib/utils';
import { 
  Play, 
  Pause, 
  Clock, 
  CheckCircle2, 
  MoreVertical, 
  Flame, 
  GripVertical,
  Calendar
} from 'lucide-react';

interface TaskCardProps {
  card: TaskCardType;
  isDragging?: boolean;
  onEdit: (card: TaskCardType) => void;
  isDoneColumn?: boolean;
}

export const TaskCard: React.FC<TaskCardProps> = ({
  card,
  isDragging = false,
  onEdit,
  isDoneColumn = false,
}) => {
  const {
    activeCardId,
    isRunning,
    timerMode,
    toggleCardTimer,
    deleteCard,
    activeBoardId,
  } = useFokusStore();

  const isCurrentActive = activeCardId === card.id;
  const isTimerRunningOnThisCard = isCurrentActive && isRunning && timerMode === 'work';

  // Priority color badges
  const priorityStyles = {
    urgent: 'bg-rose-500/10 text-rose-600 dark:text-rose-400 border-rose-500/20',
    high: 'bg-orange-500/10 text-orange-600 dark:text-orange-400 border-orange-500/20',
    medium: 'bg-amber-500/10 text-amber-600 dark:text-amber-400 border-amber-500/20',
    low: 'bg-slate-500/10 text-slate-600 dark:text-slate-400 border-slate-500/20',
  };

  const currentPriority = card.priority || 'medium';

  return (
    <div
      onClick={() => onEdit(card)}
      className={`group relative rounded-2xl p-4 transition-all duration-200 cursor-pointer select-none ${
        isDragging
          ? 'scale-105 shadow-2xl ring-2 ring-accent rotate-1 z-50 bg-white/95 dark:bg-primary-900/95'
          : isDoneColumn
          ? 'glass-card-done border border-emerald-500/30'
          : isCurrentActive
          ? 'glass-card-active border-2 border-accent'
          : 'glass-card'
      }`}
    >
      {/* Top Header Row of Card */}
      <div className="flex items-center justify-between gap-2 mb-2">
        {/* Left: Active / Done / Priority indicators */}
        <div className="flex items-center gap-1.5 flex-wrap">
          {isDoneColumn ? (
            <span className="flex items-center gap-1 text-[11px] font-semibold text-emerald-700 dark:text-emerald-400 bg-emerald-500/15 border border-emerald-500/25 px-2 py-0.5 rounded-full">
              <CheckCircle2 className="w-3.5 h-3.5" />
              <span>Done</span>
            </span>
          ) : isCurrentActive ? (
            <span className="flex items-center gap-1.5 text-[11px] font-bold text-accent bg-accent/15 border border-accent/30 px-2 py-0.5 rounded-full shadow-sm">
              <span className="relative flex h-2 w-2">
                <span className={`absolute inline-flex h-full w-full rounded-full bg-accent ${isTimerRunningOnThisCard ? 'animate-ping' : ''} opacity-75`} />
                <span className="relative inline-flex rounded-full h-2 w-2 bg-accent" />
              </span>
              <span>Active</span>
            </span>
          ) : null}

          {/* Priority Badge */}
          {card.priority && (
            <span
              className={`text-[10px] font-semibold uppercase tracking-wider px-2 py-0.5 rounded-md border ${
                priorityStyles[currentPriority]
              }`}
            >
              {card.priority}
            </span>
          )}
        </div>

        {/* Right: Drag Handle & Quick Menu */}
        <div className="flex items-center text-primary-300 dark:text-primary-600 group-hover:text-primary-500 transition-colors">
          <GripVertical className="w-4 h-4 cursor-grab" />
        </div>
      </div>

      {/* Card Title */}
      <h3
        className={`text-sm sm:text-base font-bold tracking-tight mb-1 transition-colors ${
          isDoneColumn
            ? 'line-through text-primary-600 dark:text-primary-400'
            : 'text-primary dark:text-white'
        }`}
      >
        {card.title}
      </h3>

      {/* Card Description (if present) */}
      {card.description && (
        <p className="text-xs text-primary-600 dark:text-primary-300/80 line-clamp-2 mb-3 font-normal leading-relaxed">
          {card.description}
        </p>
      )}

      {/* Tags List */}
      {card.tags && card.tags.length > 0 && (
        <div className="flex items-center flex-wrap gap-1.5 mb-3">
          {card.tags.map((tag, idx) => (
            <span
              key={idx}
              className="text-[10px] font-medium px-2 py-0.5 rounded-lg bg-primary-100/70 dark:bg-primary-800/70 text-primary-700 dark:text-primary-300 border border-primary/5 dark:border-white/5"
            >
              #{tag}
            </span>
          ))}
        </div>
      )}

      {/* Card Bottom Meta & Focus Controls */}
      <div className="pt-2.5 mt-1 border-t border-primary/10 dark:border-white/10 flex items-center justify-between gap-2">
        {/* Accumulated Time Spent */}
        <div 
          className={`flex items-center gap-1.5 text-xs font-mono font-semibold transition-colors ${
            isCurrentActive
              ? 'text-accent dark:text-accent-400 font-bold'
              : 'text-primary-600 dark:text-primary-400'
          }`}
          title="Total focus time spent on this card"
        >
          <Clock className={`w-3.5 h-3.5 ${isTimerRunningOnThisCard ? 'animate-spin' : ''}`} />
          <span>{formatTimeSpent(card.timeSpentSeconds)}</span>
        </div>

        {/* Pomodoro count indicator */}
        {(card.estimatedPomodoros !== undefined || card.completedPomodoros !== undefined) && (
          <div 
            className="flex items-center gap-1 text-[11px] font-medium text-primary-500 dark:text-primary-400"
            title={`${card.completedPomodoros || 0} of ${card.estimatedPomodoros || 1} Pomodoros completed`}
          >
            <Flame className="w-3 h-3 text-accent" />
            <span>{card.completedPomodoros || 0}/{card.estimatedPomodoros || 1}</span>
          </div>
        )}

        {/* Per-Card Focus Play / Pause Toggle Button */}
        <button
          onClick={(e) => {
            e.stopPropagation();
            toggleCardTimer(card.id);
          }}
          className={`flex items-center gap-1 px-2.5 py-1 rounded-xl text-xs font-semibold transition-all shadow-sm active:scale-95 ${
            isTimerRunningOnThisCard
              ? 'bg-accent text-white shadow-accent/25 hover:bg-accent-600'
              : isCurrentActive
              ? 'bg-accent/20 text-accent border border-accent/40 hover:bg-accent hover:text-white'
              : 'bg-primary-100/80 dark:bg-primary-800/80 text-primary-700 dark:text-primary-200 hover:bg-accent hover:text-white dark:hover:bg-accent'
          }`}
          title={
            isTimerRunningOnThisCard
              ? 'Pause focus on this task'
              : 'Start Pomodoro tracking for this task'
          }
        >
          {isTimerRunningOnThisCard ? (
            <>
              <Pause className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">Pause</span>
            </>
          ) : (
            <>
              <Play className="w-3.5 h-3.5" />
              <span>Track</span>
            </>
          )}
        </button>
      </div>
    </div>
  );
};
