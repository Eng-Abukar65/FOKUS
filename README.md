# FOKUS — Aesthetic Kanban & Integrated Pomodoro Focus Tracking

Fokus is an intuitive, aesthetic-first productivity web application that seamlessly merges Kanban project management with integrated focus tracking (Pomodoro technique). Designed for professionals, creators, and students who want a clutter-free environment, Fokus applies Glassmorphism design principles—semi-transparent panels, ambient backdrop blurs, soft glows, and minimalist controls.

---

## ✨ Features

- **Integrated Pomodoro Timer**: Top-bar timer (`25:00`) with mode switching (*Focus*, *Short Break*, *Long Break*), play/pause/reset controls.
- **Per-Card Time Tracking**: One-click "Track" button on any card links active Pomodoro sessions to accumulate focus time directly on that card.
- **Dynamic 3-Column Kanban Board**: `TO DO`, `DOING`, and `DONE` workflow columns with in-line renaming and live card counts.
- **Fluid Drag-and-Drop**: Built with `@hello-pangea/dnd` for smooth, touch-friendly card movement across columns and reordering.
- **Visual Card States**:
  - 🔴 **Active Focus Card**: Pulsing indicator with glowing rust border.
  - 🟢 **Completed Card**: Soft emerald tint with completion checkmark.
- **Glassmorphism & Ambient Themes**: 6 customizable ambient backdrop glow themes (*Rust Sunset, Northern Aurora, Deep Ocean, Lavender Mist, Dark Obsidian, Pure Minimal*).
- **Web Audio API Sound Engine**: Crystal chime alerts on session start, pause, and completion without external sound files.
- **Deep Work Analytics**: Total focus hours, column time distribution, top focused tasks ranking, and session logs.
- **Data Persistence & Export**: Automatic local storage persistence with JSON export / backup support.
- **Dark & Light Mode**: Seamless glassmorphism styling across both light and dark modes.

---

## 🛠️ Tech Stack

- **Framework**: [Next.js](https://nextjs.org/) (App Router)
- **Styling**: [Tailwind CSS](https://tailwindcss.com/)
- **Drag & Drop**: [@hello-pangea/dnd](https://github.com/hello-pangea/dnd)
- **State Management**: [Zustand](https://github.com/pmndrs/zustand)
- **Icons**: [Lucide React](https://lucide.dev/)
- **Celebration Effects**: Canvas Confetti
- **Audio**: Native Web Audio API

---

## 🚀 Getting Started

### 1. Clone the repository
```bash
git clone https://github.com/Eng-Abukar65/FOKUS.git
cd FOKUS
```

### 2. Install dependencies
```bash
npm install
```

### 3. Run the development server
```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

---

## ⌨️ Keyboard Shortcuts

- <kbd>Space</kbd>: Start / Pause active Pomodoro timer
- <kbd>N</kbd>: Create a new task card
- <kbd>Esc</kbd>: Close open modals
