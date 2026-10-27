import type { Metadata } from 'next';
import './globals.css';

export const metadata: Metadata = {
  title: 'Fokus — Aesthetic Kanban & Integrated Focus Tracking',
  description: 'An intuitive, aesthetic-first productivity web app merging Kanban project management with integrated Pomodoro focus tracking and glassmorphism styling.',
  icons: {
    icon: '/favicon.ico',
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className="antialiased min-h-screen flex flex-col font-sans transition-colors selection:bg-accent/20 selection:text-accent">
        {children}
      </body>
    </html>
  );
}
