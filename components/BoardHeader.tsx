'use client';

import React, { useState, useRef, useEffect } from 'react';
import { useFokusStore } from '@/store/fokusStore';
import { 
  ChevronDown, 
  Plus, 
  Sparkles, 
  Edit2, 
  Trash2, 
  Check, 
  X,
  Layers,
  FolderPlus
} from 'lucide-react';
import { AMBIENT_THEMES } from '@/lib/utils';

interface BoardHeaderProps {
  onOpenNewCardModal: () => void;
  onOpenThemeModal: () => void;
}

export const BoardHeader: React.FC<BoardHeaderProps> = ({
  onOpenNewCardModal,
  onOpenThemeModal,
}) => {
  const {
    boards,
    activeBoardId,
    setActiveBoard,
    createBoard,
    renameBoard,
    deleteBoard,
  } = useFokusStore();

  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [isRenaming, setIsRenaming] = useState(false);
  const [boardTitleInput, setBoardTitleInput] = useState('');
  const [isCreatingBoard, setIsCreatingBoard] = useState(false);
  const [newBoardName, setNewBoardName] = useState('');
  const dropdownRef = useRef<HTMLDivElement>(null);

  const activeBoard = boards.find((b) => b.id === activeBoardId) || boards[0];

  useEffect(() => {
    if (activeBoard) {
      setBoardTitleInput(activeBoard.title);
    }
  }, [activeBoard]);

  // Click outside listener for dropdown
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target as Node)) {
        setDropdownOpen(false);
        setIsCreatingBoard(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleSaveRename = () => {
    if (activeBoard && boardTitleInput.trim()) {
      renameBoard(activeBoard.id, boardTitleInput.trim());
    }
    setIsRenaming(false);
  };

  const handleCreateBoard = () => {
    if (newBoardName.trim()) {
      const newId = createBoard(newBoardName.trim());
      setActiveBoard(newId);
      setNewBoardName('');
      setIsCreatingBoard(false);
      setDropdownOpen(false);
    }
  };

  if (!activeBoard) return null;

  const currentTheme = AMBIENT_THEMES[activeBoard.ambientTheme] || AMBIENT_THEMES.rust;

  // Board metrics
  const totalCards = activeBoard.cards.length;
  const doneCards = activeBoard.cards.filter((c) => c.columnId.toLowerCase().includes('col-3') || c.columnId.toLowerCase().includes('done')).length;

  return (
    <div className="w-full max-w-7xl mx-auto px-4 sm:px-6 pt-5 pb-3">
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 pb-2 border-b border-primary-900/10 dark:border-white/10">
        
        {/* Left: Dynamic Board Selector ("MY BOARD ▾") */}
        <div className="relative" ref={dropdownRef}>
          {isRenaming ? (
            <div className="flex items-center gap-2">
              <input
                type="text"
                value={boardTitleInput}
                onChange={(e) => setBoardTitleInput(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === 'Enter') handleSaveRename();
                  if (e.key === 'Escape') setIsRenaming(false);
                }}
                autoFocus
                className="text-xl sm:text-2xl font-bold bg-white/80 dark:bg-primary-800/80 border border-accent/40 rounded-xl px-3 py-1 text-primary dark:text-white outline-none ring-2 ring-accent/30 shadow-sm"
              />
              <button
                onClick={handleSaveRename}
                className="p-2 rounded-xl bg-accent text-white hover:bg-accent-600 transition-colors"
                title="Save"
              >
                <Check className="w-4 h-4" />
              </button>
              <button
                onClick={() => setIsRenaming(false)}
                className="p-2 rounded-xl bg-primary-100 dark:bg-primary-800 text-primary-600 dark:text-primary-300 hover:bg-primary-200 transition-colors"
                title="Cancel"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
          ) : (
            <div className="flex items-center gap-2">
              <button
                onClick={() => setDropdownOpen(!dropdownOpen)}
                className="group flex items-center gap-2 px-3 py-1.5 -ml-3 rounded-2xl hover:bg-white/60 dark:hover:bg-primary-800/50 transition-all cursor-pointer"
                title="Switch Board"
              >
                <div className="flex items-center gap-2">
                  <span className="text-xl sm:text-2xl font-extrabold tracking-tight text-primary dark:text-white uppercase">
                    {activeBoard.title}
                  </span>
                  <ChevronDown className="w-5 h-5 text-primary-400 group-hover:text-primary-700 dark:group-hover:text-white transition-transform duration-200" />
                </div>
              </button>

              <button
                onClick={() => setIsRenaming(true)}
                className="p-1.5 rounded-xl text-primary-400 hover:text-primary-800 dark:text-primary-500 dark:hover:text-white hover:bg-white/60 dark:hover:bg-primary-800/50 transition-colors"
                title="Rename this board"
              >
                <Edit2 className="w-3.5 h-3.5" />
              </button>
            </div>
          )}

          {/* Board Dropdown Menu */}
          {dropdownOpen && (
            <div className="absolute top-full left-0 mt-2 w-72 glass-panel rounded-2xl shadow-xl p-2 z-40 animate-in fade-in slide-in-from-top-2 duration-150 border border-primary/10 dark:border-white/10">
              <div className="px-3 py-2 text-xs font-semibold text-primary-400 dark:text-primary-400 uppercase tracking-wider flex items-center justify-between">
                <span>Select Board</span>
                <span className="text-[10px] font-normal">{boards.length} available</span>
              </div>

              <div className="max-h-60 overflow-y-auto space-y-1 my-1">
                {boards.map((b) => (
                  <div
                    key={b.id}
                    className={`flex items-center justify-between px-3 py-2 rounded-xl text-sm transition-all ${
                      b.id === activeBoardId
                        ? 'bg-accent/15 text-accent font-semibold'
                        : 'text-primary-700 dark:text-primary-200 hover:bg-white/60 dark:hover:bg-primary-800/60'
                    }`}
                  >
                    <button
                      onClick={() => {
                        setActiveBoard(b.id);
                        setDropdownOpen(false);
                      }}
                      className="flex-1 text-left truncate flex items-center gap-2"
                    >
                      <Layers className="w-4 h-4 text-primary-400" />
                      <span className="truncate">{b.title}</span>
                    </button>

                    {boards.length > 1 && (
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          if (confirm(`Delete board "${b.title}"?`)) {
                            deleteBoard(b.id);
                          }
                        }}
                        className="p-1 rounded-lg text-primary-400 hover:text-rose-500 hover:bg-rose-50 dark:hover:bg-rose-950/40 transition-colors"
                        title="Delete Board"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    )}
                  </div>
                ))}
              </div>

              {/* Create New Board Option */}
              <div className="pt-2 border-t border-primary/10 dark:border-white/10 mt-1">
                {isCreatingBoard ? (
                  <div className="p-1 space-y-2">
                    <input
                      type="text"
                      placeholder="Board name..."
                      value={newBoardName}
                      onChange={(e) => setNewBoardName(e.target.value)}
                      onKeyDown={(e) => e.key === 'Enter' && handleCreateBoard()}
                      autoFocus
                      className="w-full text-xs px-2.5 py-1.5 rounded-lg bg-white/80 dark:bg-primary-800/80 border border-primary/20 dark:border-white/20 text-primary dark:text-white outline-none focus:border-accent"
                    />
                    <div className="flex items-center justify-end gap-1.5">
                      <button
                        onClick={() => setIsCreatingBoard(false)}
                        className="px-2 py-1 text-xs text-primary-500 hover:text-primary-800 dark:text-primary-400"
                      >
                        Cancel
                      </button>
                      <button
                        onClick={handleCreateBoard}
                        className="px-2.5 py-1 text-xs rounded-lg bg-accent text-white font-medium hover:bg-accent-600 shadow-sm"
                      >
                        Create
                      </button>
                    </div>
                  </div>
                ) : (
                  <button
                    onClick={() => setIsCreatingBoard(true)}
                    className="w-full flex items-center gap-2 px-3 py-2 rounded-xl text-xs font-semibold text-accent hover:bg-accent/10 transition-colors"
                  >
                    <FolderPlus className="w-4 h-4" />
                    <span>Create New Board</span>
                  </button>
                )}
              </div>
            </div>
          )}
        </div>

        {/* Right Controls: New Card, Theme Indicator, Stats */}
        <div className="flex items-center flex-wrap gap-2.5 w-full sm:w-auto justify-between sm:justify-end">
          {/* Quick Metrics */}
          <div className="hidden md:flex items-center gap-3 text-xs text-primary-500 dark:text-primary-400 px-3 py-1.5 rounded-xl bg-white/40 dark:bg-primary-800/30 border border-primary/5 dark:border-white/5">
            <span>{totalCards} Total Cards</span>
            <span className="w-1 h-1 rounded-full bg-primary-300 dark:bg-primary-600" />
            <span className="text-emerald-600 dark:text-emerald-400 font-medium">{doneCards} Completed</span>
          </div>

          {/* Theme Pill */}
          <button
            onClick={onOpenThemeModal}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-medium glass-panel-subtle hover:bg-white/80 dark:hover:bg-primary-800/80 transition-all text-primary-700 dark:text-primary-300"
            title="Current Ambient Glow Theme"
          >
            <span 
              className="w-2.5 h-2.5 rounded-full shadow-sm"
              style={{ backgroundColor: currentTheme.accentColor }}
            />
            <span className="hidden sm:inline">{currentTheme.name}</span>
            <Sparkles className="w-3 h-3 text-primary-400" />
          </button>

          {/* "+ New Card" Primary CTA Button */}
          <button
            onClick={onOpenNewCardModal}
            className="flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-semibold bg-accent text-white hover:bg-accent-600 shadow-md shadow-accent/25 active:scale-95 transition-all"
          >
            <Plus className="w-4 h-4" />
            <span>New Card</span>
          </button>
        </div>
      </div>
    </div>
  );
};
