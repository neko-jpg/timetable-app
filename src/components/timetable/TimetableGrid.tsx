import React from 'react';
import { Plus } from 'lucide-react';
import { DAYS_CONFIG, DEFAULT_PERIODS } from '../../constants';
import { DayOfWeek, Lecture } from '../../types';
import { LectureCard } from './LectureCard';

interface TimetableGridProps {
  lectures: Lecture[];
  maxPeriods: number;
  showWeekends: boolean;
  onLectureClick: (lecture: Lecture) => void;
  onEmptyCellClick: (day: DayOfWeek, period: number) => void;
}

export const TimetableGrid: React.FC<TimetableGridProps> = ({
  lectures,
  maxPeriods,
  showWeekends,
  onLectureClick,
  onEmptyCellClick,
}) => {
  const visibleDays = DAYS_CONFIG.filter((d) => showWeekends || !d.isWeekend);
  const periods = DEFAULT_PERIODS.slice(0, maxPeriods);

  // 曜日×時限のマップ作成（O(1)アクセス）
  const lectureMap = React.useMemo(() => {
    const map = new Map<string, Lecture>();
    for (const lec of lectures) {
      map.set(`${lec.dayOfWeek}-${lec.period}`, lec);
    }
    return map;
  }, [lectures]);

  return (
    <div className="w-full bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm overflow-hidden flex flex-col">
      {/* 水平スクロール可能なラッパー */}
      <div className="w-full overflow-x-auto">
        <div className="min-w-[640px] md:min-w-full">
          {/* グリッドヘッダー (曜日行) */}
          <div
            className="grid border-b border-slate-200 dark:border-slate-800 bg-slate-50/80 dark:bg-slate-900/80 sticky top-0 z-10"
            style={{
              gridTemplateColumns: `70px repeat(${visibleDays.length}, minmax(0, 1fr))`,
            }}
          >
            {/* 時限列ヘッダー */}
            <div className="p-3 text-center text-xs font-semibold text-slate-400 dark:text-slate-500 border-r border-slate-200 dark:border-slate-800 flex items-center justify-center">
              時限
            </div>

            {/* 各曜日 */}
            {visibleDays.map((day) => (
              <div
                key={day.key}
                className={`py-3 px-2 text-center border-r border-slate-200 dark:border-slate-800 last:border-r-0 ${
                  day.isWeekend
                    ? day.key === 'sun'
                      ? 'text-rose-500 bg-rose-50/30 dark:bg-rose-950/20'
                      : 'text-sky-500 bg-sky-50/30 dark:bg-sky-950/20'
                    : 'text-slate-700 dark:text-slate-200'
                }`}
              >
                <div className="font-bold text-sm">{day.label}</div>
                <div className="text-[10px] text-slate-400 dark:text-slate-500 hidden sm:block">
                  {day.fullLabel}
                </div>
              </div>
            ))}
          </div>

          {/* グリッドボディ (各時限行) */}
          <div className="divide-y divide-slate-200 dark:divide-slate-800">
            {periods.map((periodConfig) => (
              <div
                key={periodConfig.period}
                className="grid"
                style={{
                  gridTemplateColumns: `70px repeat(${visibleDays.length}, minmax(0, 1fr))`,
                  minHeight: '108px',
                }}
              >
                {/* 時限情報セル */}
                <div className="p-2.5 bg-slate-50/50 dark:bg-slate-900/50 border-r border-slate-200 dark:border-slate-800 flex flex-col items-center justify-center text-center select-none">
                  <span className="w-6 h-6 rounded-full bg-slate-200 dark:bg-slate-800 text-slate-700 dark:text-slate-300 font-bold text-xs flex items-center justify-center mb-1">
                    {periodConfig.period}
                  </span>
                  <span className="text-[10px] font-medium text-slate-500 dark:text-slate-400 leading-tight">
                    {periodConfig.startTime}
                  </span>
                  <span className="text-[9px] text-slate-400 dark:text-slate-600 leading-tight">
                    |
                  </span>
                  <span className="text-[10px] font-medium text-slate-500 dark:text-slate-400 leading-tight">
                    {periodConfig.endTime}
                  </span>
                </div>

                {/* 曜日ごとのセル */}
                {visibleDays.map((day) => {
                  const key = `${day.key}-${periodConfig.period}`;
                  const lecture = lectureMap.get(key);

                  return (
                    <div
                      key={key}
                      className="p-1.5 border-r border-slate-200 dark:border-slate-800 last:border-r-0 relative group flex items-stretch"
                    >
                      {lecture ? (
                        <LectureCard
                          lecture={lecture}
                          onClick={onLectureClick}
                        />
                      ) : (
                        <button
                          type="button"
                          onClick={() => onEmptyCellClick(day.key, periodConfig.period)}
                          className="w-full h-full min-h-[96px] rounded-xl border border-dashed border-slate-200 dark:border-slate-800 hover:border-indigo-300 dark:hover:border-indigo-700/60 hover:bg-indigo-50/30 dark:hover:bg-indigo-950/20 transition-all flex flex-col items-center justify-center text-slate-300 dark:text-slate-600 hover:text-indigo-600 dark:hover:text-indigo-400 group/cell"
                        >
                          <Plus className="w-5 h-5 opacity-40 group-hover/cell:opacity-100 group-hover/cell:scale-110 transition-all" />
                          <span className="text-[10px] mt-1 font-medium opacity-0 group-hover/cell:opacity-100 transition-opacity hidden sm:inline">
                            追加
                          </span>
                        </button>
                      )}
                    </div>
                  );
                })}
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};
