import { useState } from 'react';
import { Calendar, BookOpen, Moon, Sun, Plus } from 'lucide-react';

export default function App() {
  const [darkMode, setDarkMode] = useState(false);

  return (
    <div className={`min-h-screen ${darkMode ? 'dark bg-slate-950 text-slate-100' : 'bg-slate-50 text-slate-900'}`}>
      {/* Header */}
      <header className="border-b border-slate-200 dark:border-slate-800 bg-white/80 dark:bg-slate-900/80 backdrop-blur sticky top-0 z-30">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-indigo-500 to-indigo-700 flex items-center justify-center text-white shadow-md shadow-indigo-500/20">
              <Calendar className="w-5 h-5" />
            </div>
            <div>
              <h1 className="text-lg font-bold tracking-tight">時間割アプリ</h1>
              <p className="text-xs text-slate-500 dark:text-slate-400">Timetable & Schedule Manager</p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={() => setDarkMode(!darkMode)}
              className="p-2 rounded-lg text-slate-500 hover:text-slate-700 dark:text-slate-400 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
              aria-label="Toggle theme"
            >
              {darkMode ? <Sun className="w-5 h-5" /> : <Moon className="w-5 h-5" />}
            </button>
            <button className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-indigo-600 hover:bg-indigo-700 text-white text-sm font-medium transition-colors shadow-sm shadow-indigo-600/20">
              <Plus className="w-4 h-4" />
              <span>講義を追加</span>
            </button>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="p-6 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm">
          <h2 className="text-base font-semibold mb-2 flex items-center gap-2 text-indigo-600 dark:text-indigo-400">
            <BookOpen className="w-5 h-5" />
            プロジェクト基盤構築完了
          </h2>
          <p className="text-sm text-slate-600 dark:text-slate-300">
            Vite + React + TypeScript + Tailwind CSS および UIアイコン (Lucide React) が正常に初期化されました。
          </p>
        </div>
      </main>
    </div>
  );
}
