import React, { useState } from 'react';
import { Plus, MapPin, User, Video, BookOpen } from 'lucide-react';
import { DAYS_CONFIG, DEFAULT_PERIODS, LECTURE_COLORS } from '../../constants';
import { DayOfWeek, Lecture } from '../../types';

interface DayViewProps {
  lectures: Lecture[];
  maxPeriods: number;
  showWeekends: boolean;
  onLectureClick: (lecture: Lecture) => void;
  onAddLectureClick: (day: DayOfWeek, period: number) => void;
}

export const DayView: React.FC<DayViewProps> = ({
  lectures,
  maxPeriods,
  showWeekends,
  onLectureClick,
  onAddLectureClick,
}) => {
  const visibleDays = DAYS_CONFIG.filter((d) => showWeekends || !d.isWeekend);

  // 初期選択曜日：今日が含まれていれば今日、なければ最初の曜日
  const today = new Date();
  const dayKeys: DayOfWeek[] = ['sun', 'mon', 'tue', 'wed', 'thu', 'fri', 'sat'];
  const todayKey: DayOfWeek = dayKeys[today.getDay()];
  const initialDay = visibleDays.some((d) => d.key === todayKey) ? todayKey : visibleDays[0].key;

  const [selectedDay, setSelectedDay] = useState<DayOfWeek>(initialDay);

  const periods = DEFAULT_PERIODS.slice(0, maxPeriods);
  const dayLectures = lectures.filter((l) => l.dayOfWeek === selectedDay);

  return (
    <div className="space-y-4 max-w-2xl mx-auto">
      {/* 曜日セレクタータブ */}
      <div className="flex p-1 rounded-2xl bg-slate-200/80 dark:bg-slate-800/80 backdrop-blur overflow-x-auto gap-1">
        {visibleDays.map((day) => {
          const isSelected = selectedDay === day.key;
          const count = lectures.filter((l) => l.dayOfWeek === day.key && l.period <= maxPeriods).length;

          return (
            <button
              key={day.key}
              type="button"
              onClick={() => setSelectedDay(day.key)}
              className={`flex-1 min-w-[50px] py-2 px-1.5 rounded-xl text-center font-medium transition-all ${
                isSelected
                  ? 'bg-white dark:bg-slate-900 text-indigo-600 dark:text-indigo-400 shadow-sm'
                  : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-200'
              }`}
            >
              <div className="text-sm font-bold">{day.label}</div>
              <div className="text-[10px] opacity-75">{count}コマ</div>
            </button>
          );
        })}
      </div>

      {/* 選択曜日の全時限タイムラインリスト */}
      <div className="space-y-3">
        {periods.map((periodConfig) => {
          const lecture = dayLectures.find((l) => l.period === periodConfig.period);
          const colorScheme = lecture ? LECTURE_COLORS[lecture.color] || LECTURE_COLORS.indigo : null;

          return (
            <div key={periodConfig.period} className="flex gap-3 items-stretch">
              {/* 時限サイドバッジ */}
              <div className="w-14 shrink-0 flex flex-col items-center justify-center p-2 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-center shadow-sm">
                <span className="text-sm font-bold text-slate-800 dark:text-slate-200">
                  {periodConfig.period}限
                </span>
                <span className="text-[10px] text-slate-400 mt-0.5">
                  {periodConfig.startTime}
                </span>
              </div>

              {/* 講義カードまたは空きコマ */}
              <div className="flex-1">
                {lecture && colorScheme ? (
                  <div
                    onClick={() => onLectureClick(lecture)}
                    className={`h-full relative p-4 rounded-2xl border transition-all duration-200 cursor-pointer shadow-sm hover:shadow-md ${colorScheme.bg} ${colorScheme.border} ${colorScheme.hover} flex flex-col justify-between`}
                  >
                    <div className={`absolute top-0 left-0 bottom-0 w-1.5 rounded-l-2xl ${colorScheme.accent}`} />

                    <div className="pl-1 space-y-1.5">
                      <div className="flex items-start justify-between gap-2">
                        <h4 className={`text-base font-bold tracking-tight ${colorScheme.text}`}>
                          {lecture.name}
                        </h4>
                        {lecture.credits !== undefined && (
                          <span
                            className={`shrink-0 text-xs font-semibold px-2 py-0.5 rounded-md ${colorScheme.badge} ${colorScheme.badgeText}`}
                          >
                            {lecture.credits}単位
                          </span>
                        )}
                      </div>

                      <div className="flex flex-wrap items-center gap-x-4 gap-y-1 text-xs text-slate-600 dark:text-slate-300">
                        {lecture.room && (
                          <div className="flex items-center gap-1">
                            <MapPin className="w-3.5 h-3.5 text-slate-400" />
                            <span>{lecture.room}</span>
                          </div>
                        )}
                        {lecture.instructor && (
                          <div className="flex items-center gap-1">
                            <User className="w-3.5 h-3.5 text-slate-400" />
                            <span>{lecture.instructor}</span>
                          </div>
                        )}
                      </div>

                      {lecture.memo && (
                        <p className="text-xs text-slate-500 dark:text-slate-400 pt-1 italic line-clamp-1">
                          "{lecture.memo}"
                        </p>
                      )}
                    </div>

                    {(lecture.onlineUrl || lecture.syllabusUrl) && (
                      <div className="pl-1 pt-2 mt-2 border-t border-current/10 flex items-center gap-2 text-xs">
                        {lecture.onlineUrl && (
                          <span className="flex items-center gap-1 text-indigo-600 dark:text-indigo-400 font-medium">
                            <Video className="w-3.5 h-3.5" />
                            <span>オンライン</span>
                          </span>
                        )}
                        {lecture.syllabusUrl && (
                          <span className="flex items-center gap-1 text-slate-500">
                            <BookOpen className="w-3.5 h-3.5" />
                            <span>シラバス</span>
                          </span>
                        )}
                      </div>
                    )}
                  </div>
                ) : (
                  <button
                    type="button"
                    onClick={() => onAddLectureClick(selectedDay, periodConfig.period)}
                    className="w-full h-full min-h-[72px] p-3 rounded-2xl border border-dashed border-slate-200 dark:border-slate-800 hover:border-indigo-400 dark:hover:border-indigo-700/60 hover:bg-indigo-50/20 dark:hover:bg-indigo-950/20 flex items-center justify-center gap-2 text-slate-400 hover:text-indigo-600 dark:hover:text-indigo-400 transition-all text-xs font-medium"
                  >
                    <Plus className="w-4 h-4" />
                    <span>空きコマ（タップして講義を登録）</span>
                  </button>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
