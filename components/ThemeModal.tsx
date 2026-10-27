'use client';

import React from 'react';
import { useFokusStore } from '@/store/fokusStore';
import { AMBIENT_THEMES } from '@/lib/utils';
import { AmbientTheme } from '@/types/fokus';
import { X, Sparkles, Check } from 'lucide-react';

interface ThemeModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const ThemeModal: React.FC<ThemeModalProps> = ({ isOpen, onClose }) => {
  const { activeBoardId, boards, setAmbientTheme } = useFokusStore();
  const activeBoard = boards.find((b) => b.id === activeBoardId);

  if (!isOpen || !activeBoard) return null;

  const currentTheme = activeBoard.ambientTheme;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-primary-950/60 backdrop-blur-sm animate-in fade-in duration-200">
      <div 
        className="w-full max-w-md glass-panel rounded-3xl p-6 shadow-2xl border border-primary/10 dark:border-white/10"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-center justify-between pb-3 border-b border-primary/10 dark:border-white/10">
          <div className="flex items-center gap-2">
            <Sparkles className="w-5 h-5 text-accent" />
            <h2 className="text-lg font-bold text-primary dark:text-white">
              Ambient Glass Themes
            </h2>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-xl text-primary-400 hover:text-primary-700 dark:hover:text-white hover:bg-primary-100 dark:hover:bg-primary-800 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <p className="text-xs text-primary-600 dark:text-primary-300 my-3 leading-relaxed">
          Select an ambient backdrop lighting theme for &ldquo;<span className="font-semibold text-primary dark:text-white">{activeBoard.title}</span>&rdquo;. These soft light glows reflect through all glassmorphic panels.
        </p>

        <div className="grid grid-cols-2 gap-3 my-4">
          {(Object.entries(AMBIENT_THEMES) as [AmbientTheme, typeof AMBIENT_THEMES['rust']][]).map(
            ([themeKey, themeData]) => {
              const isSelected = currentTheme === themeKey;
              return (
                <button
                  key={themeKey}
                  type="button"
                  onClick={() => setAmbientTheme(activeBoard.id, themeKey)}
                  className={`relative flex flex-col items-start p-3.5 rounded-2xl border transition-all text-left ${
                    isSelected
                      ? 'border-accent ring-2 ring-accent/30 bg-white/90 dark:bg-primary-800/90 shadow-md'
                      : 'border-primary/10 dark:border-white/10 hover:border-primary/30 bg-white/50 dark:bg-primary-900/50 hover:bg-white/70'
                  }`}
                >
                  <div className="flex items-center justify-between w-full mb-2">
                    <div 
                      className="w-5 h-5 rounded-full shadow-sm"
                      style={{ backgroundColor: themeData.accentColor }}
                    />
                    {isSelected && (
                      <div className="w-5 h-5 rounded-full bg-accent text-white flex items-center justify-center">
                        <Check className="w-3 h-3" />
                      </div>
                    )}
                  </div>

                  <span className="text-xs font-bold text-primary dark:text-white">
                    {themeData.name}
                  </span>
                  <span className="text-[10px] text-primary-500 capitalize mt-0.5">
                    {themeKey} glow
                  </span>
                </button>
              );
            }
          )}
        </div>

        <div className="pt-3 border-t border-primary/10 dark:border-white/10 flex justify-end">
          <button
            onClick={onClose}
            className="px-5 py-2 rounded-xl bg-accent text-white text-xs font-bold hover:bg-accent-600 shadow-sm"
          >
            Done
          </button>
        </div>
      </div>
    </div>
  );
};
