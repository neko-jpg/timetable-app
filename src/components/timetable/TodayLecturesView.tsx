import React from 'react';
import { Calendar, Clock, MapPin, User, Video, Plus, CheckCircle2, ArrowRight } from 'lucide-react';
import { DAYS_CONFIG, DEFAULT_PERIODS, LECTURE_COLORS } from '../../constants';
import { DayOfWeek, Lecture } from '../../types';

interface TodayLecturesViewProps {
  lectures: Lecture[];
  maxPeriods: number;
  onLectureClick: (lecture: Lecture) => void;
  onAddLectureClick: (day: DayOfWeek, period: number) => void;
}

export const TodayLecturesView: React.FC<TodayLecturesViewProps> = ({
  lectures,
  maxPeriods,
  onLectureClick,
  onAddLectureClick,
}) => {
  // 今日の曜日を取得
  const today = new Date();
  const dayIndex = today.getDay(); // 0 = Sun, 1 = Mon, ...
  const dayKeys: DayOfWeek[] = ['sun', 'mon', 'tue', 'wed', 'thu', 'fri', 'sat'];
  const todayKey: DayOfWeek = dayKeys[dayIndex];

  const todayConfig = DAYS_CONFIG.find((d) => d.key === todayKey) || DAYS_CONFIG[0];
  const periods = DEFAULT_PERIODS.slice(0, maxPeriods);

  // 今日の講義一覧（時限昇順）
  const todayLectures = lectures
    .filter((l) => l.dayOfWeek === todayKey && l.period <= maxPeriods)
    .sort((a, b) => a.period - b.period);

  const formattedDate = `${today.getFullYear()}年${today.getMonth() + 1}月${today.getDate()}日 (${todayConfig.label})`;

  return (
    <div className="space-y-4 max-w-2xl mx-auto">
      {/* 日付ヘッダーバナー */}
      <div className="p-4 rounded-2xl bg-gradient-to-r from-indigo-500 to-purple-600 text-white shadow-md flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 rounded-xl bg-white/20 backdrop-blur flex items-center justify-center">
            <Calendar className="w-6 h-6 text-white" />
          </div>
          <div>
            <div className="text-xs font-medium text-indigo-100 uppercase tracking-wider">Today's Schedule</div>
            <h2 className="text-lg font-bold">{formattedDate}</h2>
          </div>
        </div>
        <div className="text-right">
          <span className="inline-block px-3 py-1 rounded-full bg-white/20 text-xs font-semibold backdrop-blur">
            {todayLectures.length} コマの講義
          </span>
        </div>
      </div>

      {/* 今日の講義一覧 */}
      {todayLectures.length > 0 ? (
        <div className="space-y-3">
          {todayLectures.map((lec) => {
            const periodConfig = periods.find((p) => p.period === lec.period);
            const colorScheme = LECTURE_COLORS[lec.color] || LECTURE_COLORS.indigo;

            return (
              <div
                key={lec.id}
                onClick={() => onLectureClick(lec)}
                className={`group relative p-4 rounded-2xl border transition-all duration-200 cursor-pointer shadow-sm hover:shadow-md ${colorScheme.bg} ${colorScheme.border} ${colorScheme.hover} flex flex-col sm:flex-row sm:items-center justify-between gap-4`}
              >
                <div className={`absolute top-0 left-0 bottom-0 w-1.5 rounded-l-2xl ${colorScheme.accent}`} />

                <div className="space-y-1.5 pl-2 flex-1">
                  <div className="flex items-center gap-2">
                    <span className="px-2 py-0.5 rounded-md bg-slate-900/10 dark:bg-white/10 text-xs font-bold">
                      {lec.period}限
                    </span>
                    {periodConfig && (
                      <span className="text-xs font-medium text-slate-500 dark:text-slate-400 flex items-center gap-1">
                        <Clock className="w-3.5 h-3.5" />
                        {periodConfig.startTime} - {periodConfig.endTime}
                      </span>
                    )}
                    {lec.credits !== undefined && (
                      <span className={`text-[11px] font-semibold px-2 py-0.5 rounded-md ${colorScheme.badge} ${colorScheme.badgeText}`}>
                        {lec.credits}単位
                      </span>
                    )}
                  </div>

                  <h3 className={`text-base font-bold tracking-tight ${colorScheme.text}`}>
                    {lec.name}
                  </h3>

                  <div className="flex flex-wrap items-center gap-x-4 gap-y-1 text-xs text-slate-600 dark:text-slate-300 pt-0.5">
                    {lec.room && (
                      <div className="flex items-center gap-1">
                        <MapPin className="w-3.5 h-3.5 text-slate-400" />
                        <span>{lec.room}</span>
                      </div>
                    )}
                    {lec.instructor && (
                      <div className="flex items-center gap-1">
                        <User className="w-3.5 h-3.5 text-slate-400" />
                        <span>{lec.instructor}</span>
                      </div>
                    )}
                  </div>

                  {lec.memo && (
                    <p className="text-xs text-slate-500 dark:text-slate-400 line-clamp-1 pt-1 italic">
                      "{lec.memo}"
                    </p>
                  )}
                </div>

                <div className="flex items-center gap-2 self-end sm:self-center pl-2">
                  {lec.onlineUrl && (
                    <a
                      href={lec.onlineUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      onClick={(e) => e.stopPropagation()}
                      className="px-3 py-1.5 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-medium flex items-center gap-1 shadow-sm transition-colors"
                    >
                      <Video className="w-3.5 h-3.5" />
                      <span>受講</span>
                    </a>
                  )}
                  <div className="w-8 h-8 rounded-full bg-slate-100 dark:bg-slate-800 flex items-center justify-center text-slate-400 group-hover:text-indigo-600 dark:group-hover:text-indigo-400 transition-colors">
                    <ArrowRight className="w-4 h-4" />
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      ) : (
        <div className="p-8 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-center space-y-3">
          <div className="w-12 h-12 rounded-full bg-emerald-50 dark:bg-emerald-950/50 text-emerald-600 dark:text-emerald-400 mx-auto flex items-center justify-center">
            <CheckCircle2 className="w-6 h-6" />
          </div>
          <h3 className="text-base font-semibold text-slate-800 dark:text-slate-200">
            今日の講義はありません
          </h3>
          <p className="text-xs text-slate-500 dark:text-slate-400 max-w-sm mx-auto">
            本日は登録された授業がありません。課題の確認や自主学習の時間として活用しましょう。
          </p>
        </div>
      )}

      {/* 今日の空きコマへの追加リンク */}
      <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-900/60 border border-slate-200 dark:border-slate-800">
        <h4 className="text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider mb-2">
          今日の空きコマ
        </h4>
        <div className="flex flex-wrap gap-2">
          {periods.map((p) => {
            const hasLecture = todayLectures.some((l) => l.period === p.period);
            if (hasLecture) return null;

            return (
              <button
                key={p.period}
                type="button"
                onClick={() => onAddLectureClick(todayKey, p.period)}
                className="px-3 py-1.5 rounded-xl border border-dashed border-slate-300 dark:border-slate-700 hover:border-indigo-400 hover:bg-white dark:hover:bg-slate-800 text-xs text-slate-600 dark:text-slate-400 hover:text-indigo-600 dark:hover:text-indigo-400 flex items-center gap-1.5 transition-all"
              >
                <Plus className="w-3.5 h-3.5" />
                <span>{p.period}限 ({p.startTime}) を追加</span>
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
};
