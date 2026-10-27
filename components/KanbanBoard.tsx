'use client';

import React, { useState, useEffect } from 'react';
import { DragDropContext, DropResult } from '@hello-pangea/dnd';
import { useFokusStore } from '@/store/fokusStore';
import { KanbanColumn } from './KanbanColumn';
import { TaskCard } from '@/types/fokus';
import { soundFX } from '@/lib/audio';
import { triggerCelebration } from '@/lib/utils';
import { Plus, LayoutGrid } from 'lucide-react';

interface KanbanBoardProps {
  onEditCard: (card: TaskCard) => void;
  onQuickAddCard: (columnId: string) => void;
  onOpenAddColumnModal?: () => void;
}

export const KanbanBoard: React.FC<KanbanBoardProps> = ({
  onEditCard,
  onQuickAddCard,
  onOpenAddColumnModal,
}) => {
  const {
    boards,
    activeBoardId,
    moveCard,
    reorderCardInColumn,
    pomodoroSettings,
    addColumn,
  } = useFokusStore();

  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  const activeBoard = boards.find((b) => b.id === activeBoardId) || boards[0];

  if (!mounted || !activeBoard) {
    return (
      <div className="w-full max-w-7xl mx-auto px-4 sm:px-6 py-12 flex justify-center items-center">
        <div className="w-8 h-8 border-4 border-accent border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  const handleDragEnd = (result: DropResult) => {
    const { destination, source, draggableId } = result;

    if (!destination) return;

    if (
      destination.droppableId === source.droppableId &&
      destination.index === source.index
    ) {
      return;
    }

    // Play subtle drag drop click
    if (pomodoroSettings.soundEnabled) {
      soundFX.playClick(pomodoroSettings.soundVolume);
    }

    // Check if moving to "DONE" column
    const destColumn = activeBoard.columns.find((c) => c.id === destination.droppableId);
    if (destColumn && destColumn.title.toUpperCase().includes('DONE')) {
      triggerCelebration();
    }

    if (destination.droppableId === source.droppableId) {
      // Reordering within the same column
      reorderCardInColumn(
        activeBoard.id,
        source.droppableId,
        source.index,
        destination.index
      );
    } else {
      // Moving across columns
      moveCard(
        activeBoard.id,
        draggableId,
        destination.droppableId,
        destination.index
      );
    }
  };

  return (
    <div className="w-full max-w-7xl mx-auto px-4 sm:px-6 py-4 flex-1">
      <DragDropContext onDragEnd={handleDragEnd}>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 items-start">
          {activeBoard.columns.map((column) => {
            const columnCards = activeBoard.cards.filter(
              (c) => c.columnId === column.id
            );

            return (
              <KanbanColumn
                key={column.id}
                column={column}
                cards={columnCards}
                onEditCard={onEditCard}
                onQuickAddCard={onQuickAddCard}
              />
            );
          })}
        </div>
      </DragDropContext>
    </div>
  );
};
