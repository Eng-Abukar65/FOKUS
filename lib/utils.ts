import { type ClassValue, clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';
import confetti from 'canvas-confetti';

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

/**
 * Formats seconds into MM:SS or HH:MM:SS
 */
export function formatTimerSeconds(seconds: number): string {
  const mins = Math.floor(seconds / 60);
  const secs = seconds % 60;
  return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
}

/**
 * Formats time spent into human readable string (e.g., "15:20" or "1h 25m" or "50m")
 */
export function formatTimeSpent(seconds: number): string {
  if (seconds <= 0) return '00:00';
  
  const hours = Math.floor(seconds / 3600);
  const minutes = Math.floor((seconds % 3600) / 60);
  const remainingSecs = seconds % 60;

  if (hours > 0) {
    return `${hours}h ${minutes}m`;
  }
  if (minutes >= 60) {
    return `${minutes}m`;
  }
  // If under an hour, display MM:SS for precision matching mockup "15:20", "50:00"
  return `${minutes.toString().padStart(2, '0')}:${remainingSecs.toString().padStart(2, '0')}`;
}

/**
 * Triggers a celebratory confetti burst when Pomodoro completes or task is finished
 */
export function triggerCelebration() {
  try {
    confetti({
      particleCount: 70,
      spread: 60,
      origin: { y: 0.7 },
      colors: ['#c2410c', '#f97316', '#fbbf24', '#0f172a', '#22c55e'],
    });
  } catch {
    // Canvas confetti fallback
  }
}

/**
 * Ambient background gradient map for the glassmorphism aesthetic
 */
export const AMBIENT_THEMES = {
  rust: {
    name: 'Rust Sunset',
    glowPrimary: 'rgba(194, 65, 12, 0.18)',
    glowSecondary: 'rgba(251, 146, 60, 0.12)',
    accentColor: '#c2410c',
    badge: 'from-orange-500 to-amber-600',
  },
  aurora: {
    name: 'Northern Aurora',
    glowPrimary: 'rgba(16, 185, 129, 0.18)',
    glowSecondary: 'rgba(6, 182, 212, 0.14)',
    accentColor: '#059669',
    badge: 'from-emerald-500 to-teal-500',
  },
  ocean: {
    name: 'Deep Ocean',
    glowPrimary: 'rgba(37, 99, 235, 0.18)',
    glowSecondary: 'rgba(56, 189, 248, 0.12)',
    accentColor: '#2563eb',
    badge: 'from-blue-600 to-sky-400',
  },
  lavender: {
    name: 'Lavender Mist',
    glowPrimary: 'rgba(147, 51, 234, 0.16)',
    glowSecondary: 'rgba(236, 72, 153, 0.12)',
    accentColor: '#9333ea',
    badge: 'from-purple-500 to-pink-500',
  },
  obsidian: {
    name: 'Dark Obsidian',
    glowPrimary: 'rgba(30, 41, 59, 0.35)',
    glowSecondary: 'rgba(15, 23, 42, 0.25)',
    accentColor: '#475569',
    badge: 'from-slate-700 to-slate-900',
  },
  minimal: {
    name: 'Pure Minimal',
    glowPrimary: 'rgba(203, 213, 225, 0.12)',
    glowSecondary: 'rgba(241, 245, 249, 0.08)',
    accentColor: '#64748b',
    badge: 'from-gray-400 to-gray-600',
  },
};
