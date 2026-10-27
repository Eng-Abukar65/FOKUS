'use client';

import React from 'react';
import { useFokusStore } from '@/store/fokusStore';
import { AMBIENT_THEMES } from '@/lib/utils';

export const AmbientBackground: React.FC = () => {
  const { boards, activeBoardId } = useFokusStore();
  const activeBoard = boards.find((b) => b.id === activeBoardId) || boards[0];
  const theme = activeBoard ? (AMBIENT_THEMES[activeBoard.ambientTheme] || AMBIENT_THEMES.rust) : AMBIENT_THEMES.rust;

  return (
    <div className="fixed inset-0 pointer-events-none overflow-hidden -z-10">
      {/* Primary ambient glow sphere */}
      <div
        className="absolute -top-[20%] -left-[10%] w-[55vw] h-[55vw] rounded-full blur-[110px] transition-all duration-1000 opacity-60 animate-pulse-subtle"
        style={{
          background: `radial-gradient(circle, ${theme.glowPrimary} 0%, rgba(255,255,255,0) 70%)`,
        }}
      />

      {/* Secondary accent glow sphere */}
      <div
        className="absolute top-[40%] -right-[15%] w-[50vw] h-[50vw] rounded-full blur-[120px] transition-all duration-1000 opacity-50"
        style={{
          background: `radial-gradient(circle, ${theme.glowSecondary} 0%, rgba(255,255,255,0) 70%)`,
        }}
      />

      {/* Subtle bottom center ambient anchor */}
      <div
        className="absolute -bottom-[20%] left-[25%] w-[60vw] h-[40vw] rounded-full blur-[130px] transition-all duration-1000 opacity-40"
        style={{
          background: `radial-gradient(circle, ${theme.glowPrimary} 0%, rgba(255,255,255,0) 70%)`,
        }}
      />

      {/* Very subtle grain overlay for realistic glass texture */}
      <div 
        className="absolute inset-0 opacity-[0.015] dark:opacity-[0.03] mix-blend-overlay"
        style={{
          backgroundImage: `radial-gradient(#000 1px, transparent 1px)`,
          backgroundSize: '24px 24px',
        }}
      />
    </div>
  );
};
