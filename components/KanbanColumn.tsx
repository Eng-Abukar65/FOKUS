'use client';

import React, { useState } from 'react';
import { BoardColumn, TaskCard as TaskCardType } from '@/types/fokus';
import { TaskCard } from './TaskCard';
import { useFokusStore } from '@/store/fokusStore';
import { Droppable, Draggable } from '@hello-pangea/dnd';
import { 
  Plus, 
  MoreHorizontal, 
  Edit3, 
  Check, 
  X, 
  Sparkles,
  Inbox
} from 'lucide-react';

interface KanbanColumnProps {
  column: BoardColumn;
  cards: TaskCardType[];
  onEditCard: (card: TaskCardType) => void;
  onQuickAddCard: (columnId: string) => void;
}

export const KanbanColumn: React.FC<KanbanColumnProps> = ({
  column,
  cards,
  onEditCard,
  onQuickAddCard,
}) => {
  const { renameColumn, activeBoardId } = useFokusStore();
  const [isEditingTitle, setIsEditingTitle] = useState(false);
  const [titleInput, setTitleInput] = useState(column.title);

  const isDone = column.title.toUpperCase().includes('DONE');
  const isDoing = column.title.toUpperCase().includes('DOING');

  const handleSaveTitle = () => {
    if (titleInput.trim()) {
      renameColumn(activeBoardId, column.id, titleInput.trim());
    }
    setIsEditingTitle(false);
  };

  return (
    <div className="flex flex-col flex-1 min-w-[300px] max-w-md w-full glass-panel rounded-3xl p-4 transition-all duration-300 shadow-sm border border-primary/10 dark:border-white/10">
      
      {/* Column Header */}
      <div className="flex items-center justify-between pb-3.5 mb-3 border-b border-primary/10 dark:border-white/10">
        <div className="flex items-center gap-2 flex-1 mr-2">
          {/* Status Indicator Pip */}
          <span
            className={`w-2.5 h-2.5 rounded-full ${
              isDone
                ? 'bg-emerald-500 shadow-sm shadow-emerald-500/40'
                : isDoing
                ? 'bg-accent shadow-sm shadow-accent/40'
                : 'bg-primary-400'
            }`}
          />

          {isEditingTitle ? (
            <div className="flex items-center gap-1.5 flex-1">
              <input
                type="text"
                value={titleInput}
                onChange={(e) => setTitleInput(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === 'Enter') handleSaveTitle();
                  if (e.key === 'Escape') setIsEditingTitle(false);
                }}
                autoFocus
                className="w-full text-xs sm:text-sm font-bold uppercase tracking-wider px-2 py-1 rounded-lg bg-white/90 dark:bg-primary-800/90 border border-accent/40 outline-none text-primary dark:text-white"
              />
              <button
                onClick={handleSaveTitle}
                className="p-1 rounded-md text-emerald-600 hover:bg-emerald-50 dark:hover:bg-emerald-950/40"
              >
                <Check className="w-3.5 h-3.5" />
              </button>
              <button
                onClick={() => setIsEditingTitle(false)}
                className="p-1 rounded-md text-primary-400 hover:bg-primary-100"
              >
                <X className="w-3.5 h-3.5" />
              </button>
            </div>
          ) : (
            <div 
              onDoubleClick={() => setIsEditingTitle(true)}
              className="flex items-center gap-2 group cursor-pointer"
              title="Double click or click edit icon to rename column"
            >
              <h2 className="text-xs sm:text-sm font-extrabold uppercase tracking-wider text-primary dark:text-white">
                {column.title}
              </h2>
              {/* Card count indicator: [ TO DO (3) ] */}
              <span className="text-xs font-semibold px-2 py-0.5 rounded-full bg-primary-100/80 dark:bg-primary-800/80 text-primary-600 dark:text-primary-300 border border-primary/5 dark:border-white/5">
                {cards.length}
              </span>
              <button
                onClick={() => setIsEditingTitle(true)}
                className="opacity-0 group-hover:opacity-100 p-1 rounded text-primary-400 hover:text-primary-700 dark:hover:text-white transition-opacity"
              >
                <Edit3 className="w-3 h-3" />
              </button>
            </div>
          )}
        </div>

        {/* Quick Add Button */}
        <button
          onClick={() => onQuickAddCard(column.id)}
          className="p-1.5 rounded-xl text-primary-500 hover:text-primary-900 dark:text-primary-400 dark:hover:text-white hover:bg-white/60 dark:hover:bg-primary-800/60 transition-colors"
          title={`Add card to ${column.title}`}
        >
          <Plus className="w-4 h-4" />
        </button>
      </div>

      {/* Droppable Card Container */}
      <Droppable droppableId={column.id}>
        {(provided, snapshot) => (
          <div
            ref={provided.innerRef}
            {...provided.droppableProps}
            className={`flex-1 flex flex-col gap-3 min-h-[350px] p-1 rounded-2xl transition-colors ${
              snapshot.isDraggingOver
                ? 'bg-accent/5 ring-2 ring-accent/30 ring-dashed'
                : ''
            }`}
          >
            {cards.map((card, index) => (
              <Draggable key={card.id} draggableId={card.id} index={index}>
                {(dragProvided, dragSnapshot) => (
                  <div
                    ref={dragProvided.innerRef}
                    {...dragProvided.draggableProps}
                    {...dragProvided.dragHandleProps}
                  >
                    <TaskCard
                      card={card}
                      isDragging={dragSnapshot.isDragging}
                      onEdit={onEditCard}
                      isDoneColumn={isDone}
                    />
                  </div>
                )}
              </Draggable>
            ))}

            {provided.placeholder}

            {/* Empty state placeholder */}
            {cards.length === 0 && !snapshot.isDraggingOver && (
              <div 
                onClick={() => onQuickAddCard(column.id)}
                className="flex-1 flex flex-col items-center justify-center p-6 border-2 border-dashed border-primary/10 dark:border-white/10 rounded-2xl text-center group cursor-pointer hover:border-accent/40 transition-colors my-2"
              >
                <div className="w-10 h-10 rounded-2xl bg-primary-100/60 dark:bg-primary-800/40 flex items-center justify-center text-primary-400 group-hover:text-accent transition-colors mb-2">
                  <Plus className="w-5 h-5" />
                </div>
                <p className="text-xs font-medium text-primary-500 dark:text-primary-400 group-hover:text-accent transition-colors">
                  No cards in this column
                </p>
                <span className="text-[10px] text-primary-400 dark:text-primary-500 mt-0.5">
                  Click to add a task
                </span>
              </div>
            )}
          </div>
        )}
      </Droppable>

      {/* Column Footer: Quick add shortcut */}
      <button
        onClick={() => onQuickAddCard(column.id)}
        className="mt-3 w-full py-2 px-3 rounded-xl border border-dashed border-primary/15 dark:border-white/15 text-xs font-semibold text-primary-500 dark:text-primary-400 hover:text-accent hover:border-accent/40 hover:bg-accent/5 transition-all flex items-center justify-center gap-1.5"
      >
        <Plus className="w-3.5 h-3.5" />
        <span>Add Card</span>
      </button>
    </div>
  );
};
