import React, { useState, useRef, useEffect } from 'react';
import {
  Calendar,
  ChevronDown,
  Plus,
  Moon,
  Sun,
  LayoutGrid,
  CalendarDays,
  ListOrdered,
  PlusCircle,
  Trash2,
} from 'lucide-react';
import { useTimetable } from '../../context/TimetableContext';

export type ActiveView = 'grid' | 'today' | 'day';

interface HeaderProps {
  activeView: ActiveView;
  onViewChange: (view: ActiveView) => void;
  onOpenAddLectureModal: () => void;
  onOpenNewTimetableModal: () => void;
}

export const Header: React.FC<HeaderProps> = ({
  activeView,
  onViewChange,
  onOpenAddLectureModal,
  onOpenNewTimetableModal,
}) => {
  const {
    timetables,
    activeTimetableId,
    activeTimetable,
    setActiveTimetableId,
    deleteTimetable,
    settings,
    toggleTheme,
    setShowWeekends,
    setMaxPeriods,
  } = useTimetable();

  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  // 外側クリックでドロップダウンを閉じる
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsDropdownOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const isDark = settings.theme === 'dark';

  return (
    <header className="border-b border-slate-200 dark:border-slate-800 bg-white/90 dark:bg-slate-900/90 backdrop-blur sticky top-0 z-30 transition-colors">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="h-16 flex items-center justify-between gap-2 sm:gap-4">
          {/* 左側: ロゴ ＆ 学期選択ドロップダウン */}
          <div className="flex items-center gap-3 sm:gap-6 min-w-0">
            <div className="flex items-center gap-2.5 shrink-0">
              <div className="w-9 h-9 sm:w-10 sm:h-10 rounded-xl bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center text-white shadow-md shadow-indigo-500/20">
                <Calendar className="w-5 h-5" />
              </div>
              <div className="hidden md:block">
                <h1 className="text-base font-bold tracking-tight text-slate-900 dark:text-slate-100">
                  時間割アプリ
                </h1>
                <p className="text-[10px] text-slate-500 dark:text-slate-400 font-medium">
                  Timetable & Schedule
                </p>
              </div>
            </div>

            {/* 学期セレクター */}
            <div className="relative" ref={dropdownRef}>
              <button
                type="button"
                onClick={() => setIsDropdownOpen(!isDropdownOpen)}
                className="flex items-center gap-2 px-3 py-1.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 hover:bg-slate-100 dark:hover:bg-slate-700/60 text-slate-800 dark:text-slate-200 text-xs sm:text-sm font-semibold transition-all shadow-sm max-w-[180px] sm:max-w-[220px]"
              >
                <span className="truncate">{activeTimetable?.name || '時間割を選択'}</span>
                <ChevronDown className="w-4 h-4 text-slate-400 shrink-0" />
              </button>

              {/* ドロップダウンメニュー */}
              {isDropdownOpen && (
                <div className="absolute left-0 mt-2 w-64 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-xl py-1 z-50 animate-in fade-in slide-in-from-top-2 duration-150">
                  <div className="px-3 py-2 text-[11px] font-semibold text-slate-400 dark:text-slate-500 uppercase tracking-wider">
                    時間割リスト
                  </div>
                  <div className="max-h-60 overflow-y-auto divide-y divide-slate-100 dark:divide-slate-800">
                    {timetables.map((t) => (
                      <div
                        key={t.id}
                        className={`flex items-center justify-between px-3 py-2 text-xs transition-colors ${
                          t.id === activeTimetableId
                            ? 'bg-indigo-50/80 dark:bg-indigo-950/40 text-indigo-600 dark:text-indigo-400 font-bold'
                            : 'text-slate-700 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-800'
                        }`}
                      >
                        <button
                          type="button"
                          onClick={() => {
                            setActiveTimetableId(t.id);
                            setIsDropdownOpen(false);
                          }}
                          className="flex-1 text-left truncate mr-2"
                        >
                          {t.name}
                        </button>
                        {timetables.length > 1 && (
                          <button
                            type="button"
                            onClick={(e) => {
                              e.stopPropagation();
                              if (confirm(`時間割「${t.name}」を削除しますか？`)) {
                                deleteTimetable(t.id);
                              }
                            }}
                            className="p-1 rounded text-slate-400 hover:text-rose-500 hover:bg-rose-50 dark:hover:bg-rose-950/40 transition-colors"
                            title="時間割を削除"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        )}
                      </div>
                    ))}
                  </div>

                  <div className="p-2 border-t border-slate-100 dark:border-slate-800">
                    <button
                      type="button"
                      onClick={() => {
                        setIsDropdownOpen(false);
                        onOpenNewTimetableModal();
                      }}
                      className="w-full flex items-center justify-center gap-1.5 px-3 py-2 rounded-xl bg-slate-100 dark:bg-slate-800 hover:bg-indigo-50 dark:hover:bg-indigo-950/50 text-slate-700 dark:text-slate-300 hover:text-indigo-600 dark:hover:text-indigo-400 text-xs font-semibold transition-all"
                    >
                      <PlusCircle className="w-4 h-4" />
                      <span>新しい時間割を追加</span>
                    </button>
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* 中央: ビュー切り替えタブ */}
          <div className="flex p-1 rounded-xl bg-slate-100 dark:bg-slate-800 text-xs font-medium">
            <button
              type="button"
              onClick={() => onViewChange('grid')}
              className={`flex items-center gap-1.5 px-2.5 sm:px-3 py-1.5 rounded-lg transition-all ${
                activeView === 'grid'
                  ? 'bg-white dark:bg-slate-900 text-indigo-600 dark:text-indigo-400 shadow-sm font-semibold'
                  : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-200'
              }`}
            >
              <LayoutGrid className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">週間グリッド</span>
              <span className="sm:hidden">グリッド</span>
            </button>
            <button
              type="button"
              onClick={() => onViewChange('today')}
              className={`flex items-center gap-1.5 px-2.5 sm:px-3 py-1.5 rounded-lg transition-all ${
                activeView === 'today'
                  ? 'bg-white dark:bg-slate-900 text-indigo-600 dark:text-indigo-400 shadow-sm font-semibold'
                  : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-200'
              }`}
            >
              <CalendarDays className="w-3.5 h-3.5" />
              <span>今日</span>
            </button>
            <button
              type="button"
              onClick={() => onViewChange('day')}
              className={`flex items-center gap-1.5 px-2.5 sm:px-3 py-1.5 rounded-lg transition-all ${
                activeView === 'day'
                  ? 'bg-white dark:bg-slate-900 text-indigo-600 dark:text-indigo-400 shadow-sm font-semibold'
                  : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-200'
              }`}
            >
              <ListOrdered className="w-3.5 h-3.5" />
              <span>曜日別</span>
            </button>
          </div>

          {/* 右側: 土日表示切り替え、テーマ切り替え、講義追加ボタン */}
          <div className="flex items-center gap-1.5 sm:gap-2">
            {/* 土日表示トグル (PC用) */}
            <button
              type="button"
              onClick={() => setShowWeekends(!settings.showWeekends)}
              className={`hidden lg:flex items-center px-2.5 py-1.5 rounded-lg text-xs font-medium border transition-colors ${
                settings.showWeekends
                  ? 'bg-indigo-50 dark:bg-indigo-950/50 border-indigo-200 dark:border-indigo-800 text-indigo-600 dark:text-indigo-400'
                  : 'border-slate-200 dark:border-slate-800 text-slate-500 hover:bg-slate-100 dark:hover:bg-slate-800'
              }`}
            >
              土日{settings.showWeekends ? 'ON' : 'OFF'}
            </button>

            {/* 時限数切り替え (PC用) */}
            <select
              value={settings.maxPeriods}
              onChange={(e) => setMaxPeriods(Number(e.target.value))}
              className="hidden lg:block px-2 py-1.5 rounded-lg text-xs font-medium border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-300 focus:outline-none"
              title="最大時限数の変更"
            >
              <option value={5}>5限まで</option>
              <option value={6}>6限まで</option>
              <option value={7}>7限まで</option>
            </select>

            {/* テーマ切り替えボタン */}
            <button
              type="button"
              onClick={toggleTheme}
              className="p-2 rounded-xl text-slate-500 hover:text-slate-700 dark:text-slate-400 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
              aria-label="テーマ切り替え"
              title={isDark ? 'ライトモードに切り替え' : 'ダークモードに切り替え'}
            >
              {isDark ? <Sun className="w-4 h-4 sm:w-5 sm:h-5 text-amber-400" /> : <Moon className="w-4 h-4 sm:w-5 sm:h-5" />}
            </button>

            {/* 講義を追加ボタン */}
            <button
              type="button"
              onClick={onOpenAddLectureModal}
              className="flex items-center gap-1.5 px-3 sm:px-3.5 py-1.5 sm:py-2 rounded-xl bg-indigo-600 hover:bg-indigo-700 active:scale-95 text-white text-xs sm:text-sm font-semibold transition-all shadow-md shadow-indigo-600/20"
            >
              <Plus className="w-4 h-4" />
              <span className="hidden sm:inline">講義を追加</span>
              <span className="sm:hidden">追加</span>
            </button>
          </div>
        </div>
      </div>
    </header>
  );
};
