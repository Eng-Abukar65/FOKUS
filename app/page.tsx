'use client';

import React, { useState, useEffect } from 'react';
import { Navbar } from '@/components/Navbar';
import { BoardHeader } from '@/components/BoardHeader';
import { KanbanBoard } from '@/components/KanbanBoard';
import { CardModal } from '@/components/CardModal';
import { SettingsModal } from '@/components/SettingsModal';
import { ThemeModal } from '@/components/ThemeModal';
import { AnalyticsModal } from '@/components/AnalyticsModal';
import { AmbientBackground } from '@/components/AmbientBackground';
import { TaskCard } from '@/types/fokus';
import { useFokusStore } from '@/store/fokusStore';

export default function Home() {
  const [mounted, setMounted] = useState(false);
  const [isCardModalOpen, setIsCardModalOpen] = useState(false);
  const [selectedCardForEdit, setSelectedCardForEdit] = useState<TaskCard | null>(null);
  const [defaultColumnForNewCard, setDefaultColumnForNewCard] = useState<string | undefined>();
  
  const [isSettingsModalOpen, setIsSettingsModalOpen] = useState(false);
  const [isThemeModalOpen, setIsThemeModalOpen] = useState(false);
  const [isAnalyticsModalOpen, setIsAnalyticsModalOpen] = useState(false);

  const { isRunning, startTimer, pauseTimer, darkMode } = useFokusStore();

  useEffect(() => {
    setMounted(true);
    if (darkMode) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, [darkMode]);

  // Global keyboard shortcuts (Space to toggle timer, N to new card)
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      const activeTag = (document.activeElement?.tagName || '').toLowerCase();
      const isInput = activeTag === 'input' || activeTag === 'textarea' || activeTag === 'select';

      if (isInput) return;

      if (e.code === 'Space') {
        e.preventDefault();
        if (isRunning) {
          pauseTimer();
        } else {
          startTimer();
        }
      } else if (e.key === 'n' || e.key === 'N') {
        e.preventDefault();
        setSelectedCardForEdit(null);
        setDefaultColumnForNewCard(undefined);
        setIsCardModalOpen(true);
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isRunning, startTimer, pauseTimer]);

  const handleEditCard = (card: TaskCard) => {
    setSelectedCardForEdit(card);
    setIsCardModalOpen(true);
  };

  const handleQuickAddCard = (columnId: string) => {
    setSelectedCardForEdit(null);
    setDefaultColumnForNewCard(columnId);
    setIsCardModalOpen(true);
  };

  const handleOpenNewCardModal = () => {
    setSelectedCardForEdit(null);
    setDefaultColumnForNewCard(undefined);
    setIsCardModalOpen(true);
  };

  if (!mounted) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#fafaf9]">
        <div className="flex flex-col items-center gap-3">
          <div className="w-10 h-10 rounded-2xl bg-[#c2410c] text-white flex items-center justify-center font-bold text-xl shadow-lg shadow-[#c2410c]/30">
            F
          </div>
          <span className="text-xs font-semibold text-slate-500 tracking-wider uppercase">Loading Fokus...</span>
        </div>
      </div>
    );
  }

  return (
    <div className="relative min-h-screen flex flex-col justify-between selection:bg-accent/25 selection:text-accent overflow-x-hidden">
      {/* Dynamic Ambient Blur Glows */}
      <AmbientBackground />

      {/* Main Top Navigation with Integrated Pomodoro Widget */}
      <Navbar
        onOpenSettings={() => setIsSettingsModalOpen(true)}
        onOpenAnalytics={() => setIsAnalyticsModalOpen(true)}
        onOpenTheme={() => setIsThemeModalOpen(true)}
      />

      {/* Main Content Area */}
      <main className="flex-1 flex flex-col">
        {/* Dynamic Board Subheader ("MY BOARD ▾", [+ New Card], Stats) */}
        <BoardHeader
          onOpenNewCardModal={handleOpenNewCardModal}
          onOpenThemeModal={() => setIsThemeModalOpen(true)}
        />

        {/* Dynamic 3-Column Kanban Board Layout */}
        <KanbanBoard
          onEditCard={handleEditCard}
          onQuickAddCard={handleQuickAddCard}
        />
      </main>

      {/* Footer Info & Keyboard Hints */}
      <footer className="w-full max-w-7xl mx-auto px-4 sm:px-6 py-4 flex flex-col sm:flex-row items-center justify-between text-xs text-primary-400 dark:text-primary-500 border-t border-primary/5 dark:border-white/5 gap-2">
        <div className="flex items-center gap-2">
          <span className="font-semibold text-primary-600 dark:text-primary-300">Fokus</span>
          <span>— Aesthetic Kanban & Pomodoro Deep Work</span>
        </div>
        <div className="hidden md:flex items-center gap-4 text-[11px]">
          <span>
            <kbd className="px-1.5 py-0.5 rounded bg-white/70 dark:bg-primary-800 border border-primary/10 dark:border-white/10 font-mono text-[10px]">Space</kbd> Play / Pause
          </span>
          <span>
            <kbd className="px-1.5 py-0.5 rounded bg-white/70 dark:bg-primary-800 border border-primary/10 dark:border-white/10 font-mono text-[10px]">N</kbd> New Card
          </span>
        </div>
      </footer>

      {/* Interactive Modals */}
      <CardModal
        isOpen={isCardModalOpen}
        onClose={() => setIsCardModalOpen(false)}
        cardToEdit={selectedCardForEdit}
        defaultColumnId={defaultColumnForNewCard}
      />

      <SettingsModal
        isOpen={isSettingsModalOpen}
        onClose={() => setIsSettingsModalOpen(false)}
      />

      <ThemeModal
        isOpen={isThemeModalOpen}
        onClose={() => setIsThemeModalOpen(false)}
      />

      <AnalyticsModal
        isOpen={isAnalyticsModalOpen}
        onClose={() => setIsAnalyticsModalOpen(false)}
      />
    </div>
  );
}
