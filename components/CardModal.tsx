'use client';

import React, { useState, useEffect } from 'react';
import { TaskCard, PriorityLevel } from '@/types/fokus';
import { useFokusStore } from '@/store/fokusStore';
import { formatTimeSpent } from '@/lib/utils';
import { 
  X, 
  Trash2, 
  Play, 
  Pause, 
  Clock, 
  Flame, 
  Tag, 
  AlertCircle,
  Check
} from 'lucide-react';

interface CardModalProps {
  isOpen: boolean;
  onClose: () => void;
  cardToEdit?: TaskCard | null;
  defaultColumnId?: string;
}

export const CardModal: React.FC<CardModalProps> = ({
  isOpen,
  onClose,
  cardToEdit,
  defaultColumnId,
}) => {
  const {
    activeBoardId,
    boards,
    createCard,
    updateCard,
    deleteCard,
    activeCardId,
    isRunning,
    toggleCardTimer,
  } = useFokusStore();

  const activeBoard = boards.find((b) => b.id === activeBoardId);

  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [columnId, setColumnId] = useState('');
  const [priority, setPriority] = useState<PriorityLevel>('medium');
  const [estimatedPomodoros, setEstimatedPomodoros] = useState(2);
  const [tagInput, setTagInput] = useState('');
  const [tags, setTags] = useState<string[]>([]);

  useEffect(() => {
    if (cardToEdit) {
      setTitle(cardToEdit.title);
      setDescription(cardToEdit.description || '');
      setColumnId(cardToEdit.columnId);
      setPriority(cardToEdit.priority || 'medium');
      setEstimatedPomodoros(cardToEdit.estimatedPomodoros || 2);
      setTags(cardToEdit.tags || []);
    } else {
      setTitle('');
      setDescription('');
      setColumnId(defaultColumnId || activeBoard?.columns[0]?.id || 'col-1');
      setPriority('medium');
      setEstimatedPomodoros(2);
      setTags([]);
    }
  }, [cardToEdit, defaultColumnId, activeBoard, isOpen]);

  if (!isOpen || !activeBoard) return null;

  const isEditing = !!cardToEdit;
  const isCardActive = cardToEdit && activeCardId === cardToEdit.id;
  const isTimerRunning = isCardActive && isRunning;

  const handleAddTag = () => {
    const trimmed = tagInput.trim().replace(/^#/, '');
    if (trimmed && !tags.includes(trimmed)) {
      setTags([...tags, trimmed]);
      setTagInput('');
    }
  };

  const handleRemoveTag = (tagToRemove: string) => {
    setTags(tags.filter((t) => t !== tagToRemove));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim()) return;

    if (isEditing && cardToEdit) {
      updateCard(activeBoard.id, cardToEdit.id, {
        title: title.trim(),
        description: description.trim(),
        columnId,
        priority,
        estimatedPomodoros,
        tags,
      });
    } else {
      createCard(activeBoard.id, columnId, {
        title: title.trim(),
        description: description.trim(),
        priority,
        estimatedPomodoros,
        tags,
      });
    }
    onClose();
  };

  const handleDelete = () => {
    if (cardToEdit && confirm(`Are you sure you want to delete "${cardToEdit.title}"?`)) {
      deleteCard(activeBoard.id, cardToEdit.id);
      onClose();
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-primary-950/60 backdrop-blur-sm animate-in fade-in duration-200">
      <div 
        className="w-full max-w-lg glass-panel rounded-3xl p-6 shadow-2xl border border-primary/10 dark:border-white/10 max-h-[90vh] overflow-y-auto"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-center justify-between pb-3 border-b border-primary/10 dark:border-white/10">
          <div className="flex items-center gap-2">
            <span className="w-2.5 h-2.5 rounded-full bg-accent" />
            <h2 className="text-lg font-bold text-primary dark:text-white">
              {isEditing ? 'Edit Task Card' : 'Create New Task Card'}
            </h2>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-xl text-primary-400 hover:text-primary-700 dark:hover:text-white hover:bg-primary-100 dark:hover:bg-primary-800 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Form Body */}
        <form onSubmit={handleSubmit} className="space-y-4 pt-4">
          {/* Title */}
          <div>
            <label className="block text-xs font-semibold uppercase tracking-wider text-primary-600 dark:text-primary-300 mb-1.5">
              Task Title *
            </label>
            <input
              type="text"
              required
              placeholder="e.g. Implement Pomodoro Core"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="w-full px-3.5 py-2.5 rounded-xl bg-white/80 dark:bg-primary-900/80 border border-primary/15 dark:border-white/15 text-primary dark:text-white text-sm outline-none focus:border-accent focus:ring-2 focus:ring-accent/20 transition-all font-medium"
            />
          </div>

          {/* Description */}
          <div>
            <label className="block text-xs font-semibold uppercase tracking-wider text-primary-600 dark:text-primary-300 mb-1.5">
              Description
            </label>
            <textarea
              rows={3}
              placeholder="Add key objectives, links, or notes..."
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              className="w-full px-3.5 py-2.5 rounded-xl bg-white/80 dark:bg-primary-900/80 border border-primary/15 dark:border-white/15 text-primary dark:text-white text-sm outline-none focus:border-accent focus:ring-2 focus:ring-accent/20 transition-all resize-none leading-relaxed"
            />
          </div>

          {/* Column & Priority Row */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {/* Column select */}
            <div>
              <label className="block text-xs font-semibold uppercase tracking-wider text-primary-600 dark:text-primary-300 mb-1.5">
                Column
              </label>
              <select
                value={columnId}
                onChange={(e) => setColumnId(e.target.value)}
                className="w-full px-3.5 py-2 rounded-xl bg-white/80 dark:bg-primary-900/80 border border-primary/15 dark:border-white/15 text-primary dark:text-white text-sm outline-none focus:border-accent"
              >
                {activeBoard.columns.map((c) => (
                  <option key={c.id} value={c.id}>
                    {c.title}
                  </option>
                ))}
              </select>
            </div>

            {/* Priority */}
            <div>
              <label className="block text-xs font-semibold uppercase tracking-wider text-primary-600 dark:text-primary-300 mb-1.5">
                Priority
              </label>
              <select
                value={priority}
                onChange={(e) => setPriority(e.target.value as PriorityLevel)}
                className="w-full px-3.5 py-2 rounded-xl bg-white/80 dark:bg-primary-900/80 border border-primary/15 dark:border-white/15 text-primary dark:text-white text-sm outline-none focus:border-accent"
              >
                <option value="low">Low Priority</option>
                <option value="medium">Medium Priority</option>
                <option value="high">High Priority</option>
                <option value="urgent">Urgent</option>
              </select>
            </div>
          </div>

          {/* Estimated Pomodoros */}
          <div>
            <label className="block text-xs font-semibold uppercase tracking-wider text-primary-600 dark:text-primary-300 mb-1.5">
              Estimated Pomodoros (25m sessions)
            </label>
            <div className="flex items-center gap-3">
              <input
                type="number"
                min="1"
                max="20"
                value={estimatedPomodoros}
                onChange={(e) => setEstimatedPomodoros(Math.max(1, parseInt(e.target.value) || 1))}
                className="w-24 px-3.5 py-2 rounded-xl bg-white/80 dark:bg-primary-900/80 border border-primary/15 dark:border-white/15 text-primary dark:text-white text-sm outline-none focus:border-accent text-center font-bold"
              />
              <span className="text-xs text-primary-500">
                ≈ {estimatedPomodoros * 25} minutes of focused work
              </span>
            </div>
          </div>

          {/* Tags */}
          <div>
            <label className="block text-xs font-semibold uppercase tracking-wider text-primary-600 dark:text-primary-300 mb-1.5">
              Tags / Labels
            </label>
            <div className="flex items-center gap-2 mb-2">
              <input
                type="text"
                placeholder="Add tag (e.g. Design, Frontend)..."
                value={tagInput}
                onChange={(e) => setTagInput(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === 'Enter') {
                    e.preventDefault();
                    handleAddTag();
                  }
                }}
                className="flex-1 px-3 py-1.5 rounded-xl bg-white/80 dark:bg-primary-900/80 border border-primary/15 dark:border-white/15 text-primary dark:text-white text-xs outline-none focus:border-accent"
              />
              <button
                type="button"
                onClick={handleAddTag}
                className="px-3 py-1.5 rounded-xl bg-primary-100 dark:bg-primary-800 text-primary-700 dark:text-primary-200 text-xs font-medium hover:bg-primary-200"
              >
                Add
              </button>
            </div>

            {tags.length > 0 && (
              <div className="flex flex-wrap gap-1.5">
                {tags.map((tag) => (
                  <span
                    key={tag}
                    className="inline-flex items-center gap-1 text-xs px-2.5 py-1 rounded-lg bg-accent/10 text-accent border border-accent/20"
                  >
                    #{tag}
                    <button
                      type="button"
                      onClick={() => handleRemoveTag(tag)}
                      className="hover:text-accent-800"
                    >
                      <X className="w-3 h-3" />
                    </button>
                  </span>
                ))}
              </div>
            )}
          </div>

          {/* Time Tracking Section if editing existing card */}
          {isEditing && cardToEdit && (
            <div className="pt-3 pb-1 border-t border-primary/10 dark:border-white/10 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 bg-primary-50/50 dark:bg-primary-800/20 p-3 rounded-2xl">
              <div className="flex items-center gap-2">
                <Clock className="w-4 h-4 text-accent" />
                <div>
                  <span className="text-xs font-bold text-primary dark:text-white">
                    {formatTimeSpent(cardToEdit.timeSpentSeconds)}
                  </span>
                  <span className="text-[11px] text-primary-500 ml-1.5">
                    ({cardToEdit.completedPomodoros || 0}/{cardToEdit.estimatedPomodoros || 1} Pomodoros)
                  </span>
                </div>
              </div>

              <button
                type="button"
                onClick={() => toggleCardTimer(cardToEdit.id)}
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-semibold shadow-sm transition-all ${
                  isTimerRunning
                    ? 'bg-accent text-white shadow-accent/25 hover:bg-accent-600'
                    : 'bg-accent/15 text-accent border border-accent/30 hover:bg-accent hover:text-white'
                }`}
              >
                {isTimerRunning ? <Pause className="w-3.5 h-3.5" /> : <Play className="w-3.5 h-3.5" />}
                <span>{isTimerRunning ? 'Pause Focus' : 'Track This Card'}</span>
              </button>
            </div>
          )}

          {/* Actions Footer */}
          <div className="pt-4 border-t border-primary/10 dark:border-white/10 flex items-center justify-between gap-3">
            {isEditing ? (
              <button
                type="button"
                onClick={handleDelete}
                className="flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs font-semibold text-rose-600 hover:bg-rose-50 dark:hover:bg-rose-950/40 transition-colors"
              >
                <Trash2 className="w-4 h-4" />
                <span>Delete</span>
              </button>
            ) : <div />}

            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={onClose}
                className="px-4 py-2 rounded-xl text-xs font-medium text-primary-600 dark:text-primary-400 hover:bg-primary-100 dark:hover:bg-primary-800 transition-colors"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="flex items-center gap-1.5 px-5 py-2 rounded-xl bg-accent text-white text-xs font-bold hover:bg-accent-600 shadow-md shadow-accent/25 transition-transform active:scale-95"
              >
                <Check className="w-4 h-4" />
                <span>{isEditing ? 'Save Changes' : 'Create Card'}</span>
              </button>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
};
