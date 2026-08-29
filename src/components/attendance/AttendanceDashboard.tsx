import React, { useState, useMemo } from 'react';
import { Lecture } from '../../types';
import { UseAttendanceReturn } from '../../hooks/useAttendance';
import { AttendanceCard } from './AttendanceCard';
import { AttendanceConfigModal } from './AttendanceConfigModal';
import {
  GraduationCap,
  ShieldAlert,
  AlertTriangle,
  ShieldCheck,
  Search,
  Percent,
  BookOpen,
} from 'lucide-react';

interface AttendanceDashboardProps {
  attendanceManager: UseAttendanceReturn;
  lectures: Lecture[];
}

type AttendanceFilter = 'all' | 'at_risk' | 'safe';

export const AttendanceDashboard: React.FC<AttendanceDashboardProps> = ({
  attendanceManager,
  lectures,
}) => {
  const {
    getAttendance,
    incrementCount,
    decrementCount,
    resetAttendance,
    updateAttendance,
    getAttendanceRisk,
    stats,
  } = attendanceManager;

  const [filter, setFilter] = useState<AttendanceFilter>('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [configLecture, setConfigLecture] = useState<Lecture | null>(null);

  // Group or filter lectures
  const filteredLectures = useMemo(() => {
    return lectures.filter((lec) => {
      const risk = getAttendanceRisk(lec.id);

      if (filter === 'at_risk' && !risk.isAtRisk) return false;
      if (filter === 'safe' && risk.isAtRisk) return false;

      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase();
        const nameMatch = lec.name.toLowerCase().includes(q);
        const instructorMatch = lec.instructor?.toLowerCase().includes(q) ?? false;
        const roomMatch = lec.room?.toLowerCase().includes(q) ?? false;
        if (!nameMatch && !instructorMatch && !roomMatch) return false;
      }

      return true;
    });
  }, [lectures, filter, searchQuery, getAttendanceRisk]);

  // At-risk lectures list
  const atRiskLectures = useMemo(() => {
    return lectures
      .map((lec) => ({
        lecture: lec,
        risk: getAttendanceRisk(lec.id),
      }))
      .filter((item) => item.risk.isAtRisk);
  }, [lectures, getAttendanceRisk]);

  return (
    <div className="space-y-6">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h2 className="text-xl font-bold text-slate-900 dark:text-slate-100 flex items-center gap-2.5">
            <GraduationCap className="w-6 h-6 text-indigo-600 dark:text-indigo-400" />
            <span>講義別 出欠管理＆単位リスク警告</span>
          </h2>
          <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 mt-1">
            出席・欠席・遅刻・休講・補講の回数カウントと規定欠席上限アラート
          </p>
        </div>
      </div>

      {/* Summary Stat Cards */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3.5">
        {/* Danger Lectures */}
        <div
          onClick={() => setFilter(filter === 'at_risk' ? 'all' : 'at_risk')}
          className={`p-4 rounded-2xl border cursor-pointer transition-all ${
            stats.dangerCount > 0
              ? 'bg-rose-500/10 border-rose-300 dark:border-rose-900/60 hover:bg-rose-500/15'
              : 'bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-800'
          }`}
        >
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-rose-800 dark:text-rose-300">
              単位危険 (上限到達)
            </span>
            <ShieldAlert className="w-4 h-4 text-rose-600 dark:text-rose-400" />
          </div>
          <div className="mt-2 flex items-baseline gap-2">
            <span className="text-2xl font-black text-rose-900 dark:text-rose-200">
              {stats.dangerCount}
            </span>
            <span className="text-xs text-rose-700 dark:text-rose-400">科目</span>
          </div>
        </div>

        {/* Warning Lectures */}
        <div
          onClick={() => setFilter(filter === 'at_risk' ? 'all' : 'at_risk')}
          className={`p-4 rounded-2xl border cursor-pointer transition-all ${
            stats.warningCount > 0
              ? 'bg-amber-500/10 border-amber-300 dark:border-amber-900/60 hover:bg-amber-500/15'
              : 'bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-800'
          }`}
        >
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-amber-800 dark:text-amber-300">
              欠席注意 (残り1回)
            </span>
            <AlertTriangle className="w-4 h-4 text-amber-600 dark:text-amber-400" />
          </div>
          <div className="mt-2 flex items-baseline gap-2">
            <span className="text-2xl font-black text-amber-900 dark:text-amber-200">
              {stats.warningCount}
            </span>
            <span className="text-xs text-amber-700 dark:text-amber-400">科目</span>
          </div>
        </div>

        {/* Safe Lectures */}
        <div
          onClick={() => setFilter(filter === 'safe' ? 'all' : 'safe')}
          className={`p-4 rounded-2xl border cursor-pointer transition-all ${
            filter === 'safe'
              ? 'bg-emerald-500/10 border-emerald-300 dark:border-emerald-800'
              : 'bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-800 hover:border-slate-300'
          }`}
        >
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-emerald-800 dark:text-emerald-300">
              順調・安全
            </span>
            <ShieldCheck className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />
          </div>
          <div className="mt-2 flex items-baseline gap-2">
            <span className="text-2xl font-black text-emerald-900 dark:text-emerald-200">
              {stats.safeCount}
            </span>
            <span className="text-xs text-slate-500">科目</span>
          </div>
        </div>

        {/* Average Attendance Rate */}
        <div className="p-4 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-slate-700 dark:text-slate-300">
              平均出席率
            </span>
            <Percent className="w-4 h-4 text-indigo-500" />
          </div>
          <div className="mt-2 flex items-baseline gap-2">
            <span className="text-2xl font-black text-slate-900 dark:text-slate-100">
              {stats.averageAttendanceRate}%
            </span>
            <span className="text-xs text-slate-500">（全{lectures.length}科目）</span>
          </div>
        </div>
      </div>

      {/* Critical Unit Risk Alert Callout */}
      {atRiskLectures.length > 0 && (
        <div className="p-4 rounded-2xl bg-rose-500/10 border border-rose-300 dark:border-rose-900/80 space-y-2">
          <div className="flex items-center gap-2 text-rose-900 dark:text-rose-200 font-bold text-sm">
            <ShieldAlert className="w-5 h-5 text-rose-600 dark:text-rose-400 animate-pulse flex-shrink-0" />
            <span>単位取得リスクのアラートが発生しています！</span>
          </div>
          <div className="space-y-1.5 pl-7">
            {atRiskLectures.map(({ lecture, risk }) => (
              <div
                key={lecture.id}
                className="flex flex-wrap items-center justify-between text-xs gap-2 py-1 border-b border-rose-200/60 dark:border-rose-900/40 last:border-0"
              >
                <span className="font-semibold text-slate-900 dark:text-slate-100">
                  {lecture.name}
                </span>
                <span
                  className={`font-bold px-2 py-0.5 rounded-full ${
                    risk.status === 'danger'
                      ? 'bg-rose-200 text-rose-900 dark:bg-rose-900/80 dark:text-rose-200'
                      : 'bg-amber-200 text-amber-900 dark:bg-amber-900/80 dark:text-amber-200'
                  }`}
                >
                  {risk.message}
                </span>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Filters & Search Toolbar */}
      <div className="p-4 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 flex flex-col sm:flex-row gap-3 items-stretch sm:items-center justify-between shadow-sm">
        {/* Filter Buttons */}
        <div className="flex items-center gap-1.5 p-1 rounded-xl bg-slate-100 dark:bg-slate-800/80 flex-wrap">
          <button
            onClick={() => setFilter('all')}
            className={`px-3 py-1.5 text-xs font-semibold rounded-lg transition-all ${
              filter === 'all'
                ? 'bg-white dark:bg-slate-900 text-slate-900 dark:text-slate-100 shadow-sm'
                : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-100'
            }`}
          >
            すべての講義 ({lectures.length})
          </button>
          <button
            onClick={() => setFilter('at_risk')}
            className={`px-3 py-1.5 text-xs font-semibold rounded-lg transition-all ${
              filter === 'at_risk'
                ? 'bg-rose-500 text-white shadow-sm shadow-rose-500/25'
                : 'text-rose-700 dark:text-rose-400 hover:bg-rose-100 dark:hover:bg-rose-950/40'
            }`}
          >
            ⚠️ 要注意・危険のみ ({stats.dangerCount + stats.warningCount})
          </button>
          <button
            onClick={() => setFilter('safe')}
            className={`px-3 py-1.5 text-xs font-semibold rounded-lg transition-all ${
              filter === 'safe'
                ? 'bg-white dark:bg-slate-900 text-emerald-600 dark:text-emerald-400 shadow-sm'
                : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-100'
            }`}
          >
            良好 ({stats.safeCount})
          </button>
        </div>

        {/* Search */}
        <div className="relative flex-1 max-w-sm">
          <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="講義名、教員名、教室で検索..."
            className="w-full pl-9 pr-4 py-1.5 text-xs sm:text-sm rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-slate-100 focus:outline-none focus:ring-2 focus:ring-indigo-500"
          />
        </div>
      </div>

      {/* Lectures Attendance Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {filteredLectures.length === 0 ? (
          <div className="col-span-full p-12 text-center rounded-2xl bg-white dark:bg-slate-900 border border-dashed border-slate-300 dark:border-slate-800">
            <BookOpen className="w-10 h-10 text-slate-400 mx-auto mb-2" />
            <h4 className="text-sm font-bold text-slate-700 dark:text-slate-300">
              該当する講義がありません
            </h4>
            <p className="text-xs text-slate-400 mt-1">
              検索条件または絞り込みフィルタを変更してください。
            </p>
          </div>
        ) : (
          filteredLectures.map((lec) => (
            <AttendanceCard
              key={lec.id}
              lecture={lec}
              record={getAttendance(lec.id)}
              riskInfo={getAttendanceRisk(lec.id)}
              onIncrement={incrementCount}
              onDecrement={decrementCount}
              onReset={resetAttendance}
              onOpenConfig={(l) => setConfigLecture(l)}
            />
          ))
        )}
      </div>

      {/* Attendance Config Modal */}
      <AttendanceConfigModal
        isOpen={!!configLecture}
        onClose={() => setConfigLecture(null)}
        lecture={configLecture}
        attendanceRecord={configLecture ? getAttendance(configLecture.id) : null}
        onSave={(updates) => {
          if (configLecture) {
            updateAttendance(configLecture.id, updates);
          }
        }}
      />
    </div>
  );
};
