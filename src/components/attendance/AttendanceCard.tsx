import React from 'react';
import { Lecture, AttendanceRecord } from '../../types';
import { AttendanceRiskInfo, AttendanceField } from '../../hooks/useAttendance';
import { getLectureColor } from '../../utils/lectureColors';
import { AttendanceRiskBadge } from './AttendanceRiskBadge';
import { Plus, Minus, RotateCcw, Settings, MapPin, User } from 'lucide-react';

interface AttendanceCardProps {
  lecture: Lecture;
  record: AttendanceRecord;
  riskInfo: AttendanceRiskInfo;
  onIncrement: (lectureId: string, field: AttendanceField) => void;
  onDecrement: (lectureId: string, field: AttendanceField) => void;
  onReset: (lectureId: string) => void;
  onOpenConfig: (lecture: Lecture) => void;
}

const DAY_LABELS: Record<string, string> = {
  mon: '月曜',
  tue: '火曜',
  wed: '水曜',
  thu: '木曜',
  fri: '金曜',
  sat: '土曜',
  sun: '日曜',
};

export const AttendanceCard: React.FC<AttendanceCardProps> = ({
  lecture,
  record,
  riskInfo,
  onIncrement,
  onDecrement,
  onReset,
  onOpenConfig,
}) => {
  const colorScheme = getLectureColor(lecture.color);

  // Counter item helper
  const renderCounter = (
    field: AttendanceField,
    label: string,
    value: number,
    colorClasses: {
      bg: string;
      text: string;
      btnBg: string;
      btnHover: string;
    }
  ) => {
    return (
      <div
        className={`flex flex-col items-center justify-between p-2.5 rounded-xl border ${colorClasses.bg} transition-colors`}
      >
        <span className={`text-[11px] font-bold ${colorClasses.text}`}>{label}</span>
        <span className="text-lg font-black text-slate-900 dark:text-slate-100 my-1">
          {value}
        </span>
        <div className="flex items-center gap-1.5 w-full justify-center">
          <button
            onClick={() => onDecrement(lecture.id, field)}
            disabled={value <= 0}
            className={`w-6 h-6 rounded-lg flex items-center justify-center text-xs font-bold transition-colors ${
              value <= 0
                ? 'opacity-30 cursor-not-allowed bg-slate-200 dark:bg-slate-700 text-slate-400'
                : `${colorClasses.btnBg} ${colorClasses.btnHover} text-slate-700 dark:text-slate-200`
            }`}
            title={`${label}を1減らす`}
          >
            <Minus className="w-3 h-3 stroke-[3]" />
          </button>
          <button
            onClick={() => onIncrement(lecture.id, field)}
            className={`w-6 h-6 rounded-lg flex items-center justify-center text-xs font-bold transition-colors ${colorClasses.btnBg} ${colorClasses.btnHover} text-slate-700 dark:text-slate-200`}
            title={`${label}を1増やす`}
          >
            <Plus className="w-3 h-3 stroke-[3]" />
          </button>
        </div>
      </div>
    );
  };

  // Progress Bar color depending on attendance rate / risk
  const getProgressColor = () => {
    if (riskInfo.status === 'danger') return 'bg-rose-500';
    if (riskInfo.status === 'warning') return 'bg-amber-500';
    return 'bg-emerald-500';
  };

  return (
    <div
      className={`rounded-2xl border transition-all duration-200 overflow-hidden ${
        riskInfo.status === 'danger'
          ? 'bg-rose-50/20 dark:bg-rose-950/15 border-rose-300 dark:border-rose-900/60 shadow-md shadow-rose-500/5 ring-1 ring-rose-500/20'
          : riskInfo.status === 'warning'
          ? 'bg-amber-50/20 dark:bg-amber-950/15 border-amber-300 dark:border-amber-900/60 shadow-sm shadow-amber-500/5'
          : 'bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-800 shadow-sm hover:border-slate-300 dark:hover:border-slate-700'
      }`}
    >
      {/* Header with color accent & title */}
      <div className="p-4 sm:p-5 border-b border-slate-100 dark:border-slate-800/80">
        <div className="flex items-start justify-between gap-3">
          <div>
            <div className="flex flex-wrap items-center gap-2 mb-1">
              <span
                className={`inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-semibold ${colorScheme.badge} ${colorScheme.badgeText}`}
              >
                <span className={`w-2 h-2 rounded-full ${colorScheme.dot}`} />
                {DAY_LABELS[lecture.dayOfWeek] || lecture.dayOfWeek} {lecture.period}限
              </span>
              {lecture.credits && (
                <span className="px-2 py-0.5 rounded-md text-[11px] font-medium bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400">
                  {lecture.credits}単位
                </span>
              )}
            </div>

            <h3 className="text-base font-bold text-slate-900 dark:text-slate-100">
              {lecture.name}
            </h3>

            <div className="flex flex-wrap items-center gap-x-3 gap-y-1 mt-1 text-xs text-slate-500 dark:text-slate-400">
              {lecture.instructor && (
                <span className="flex items-center gap-1">
                  <User className="w-3.5 h-3.5" />
                  {lecture.instructor}
                </span>
              )}
              {lecture.room && (
                <span className="flex items-center gap-1">
                  <MapPin className="w-3.5 h-3.5" />
                  {lecture.room}
                </span>
              )}
            </div>
          </div>

          {/* Risk Badge on top-right */}
          <div className="flex flex-col items-end gap-1.5 flex-shrink-0">
            <AttendanceRiskBadge
              status={riskInfo.status}
              absent={riskInfo.absent}
              maxAllowed={riskInfo.maxAllowed}
              remaining={riskInfo.remaining}
            />
            <div className="flex items-center gap-1">
              <button
                onClick={() => onOpenConfig(lecture)}
                className="p-1.5 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-lg transition-colors"
                title="欠席上限や総回数を設定"
              >
                <Settings className="w-4 h-4" />
              </button>
              <button
                onClick={() => {
                  if (
                    window.confirm(
                      `「${lecture.name}」の出欠カウントをすべて0にリセットしますか？`
                    )
                  ) {
                    onReset(lecture.id);
                  }
                }}
                className="p-1.5 text-slate-400 hover:text-rose-600 dark:hover:text-rose-400 hover:bg-rose-50 dark:hover:bg-rose-950/40 rounded-lg transition-colors"
                title="出欠カウントをリセット"
              >
                <RotateCcw className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>

        {/* Attendance Rate Meter */}
        <div className="mt-4">
          <div className="flex items-center justify-between text-xs font-semibold mb-1">
            <span className="text-slate-600 dark:text-slate-400">
              出席率: <strong className="text-slate-900 dark:text-slate-100">{riskInfo.attendanceRate}%</strong>
            </span>
            <span className="text-slate-500 text-[11px]">
              総回数 {riskInfo.totalSessions}回中 欠席上限 {riskInfo.maxAllowed}回
            </span>
          </div>
          <div className="w-full h-2 rounded-full bg-slate-100 dark:bg-slate-800 overflow-hidden">
            <div
              className={`h-full rounded-full transition-all duration-500 ${getProgressColor()}`}
              style={{ width: `${Math.max(4, riskInfo.attendanceRate)}%` }}
            />
          </div>
          <p
            className={`mt-1.5 text-xs font-medium ${
              riskInfo.status === 'danger'
                ? 'text-rose-600 dark:text-rose-400 font-bold'
                : riskInfo.status === 'warning'
                ? 'text-amber-600 dark:text-amber-400 font-semibold'
                : 'text-slate-500 dark:text-slate-400'
            }`}
          >
            {riskInfo.message}
          </p>
        </div>
      </div>

      {/* Counters Grid (出席 / 欠席 / 遅刻 / 休講 / 補講) */}
      <div className="p-4 sm:p-5 bg-slate-50/40 dark:bg-slate-900/30">
        <div className="grid grid-cols-5 gap-2">
          {/* Present */}
          {renderCounter('present', '出席', record.present, {
            bg: 'bg-emerald-50/80 dark:bg-emerald-950/30 border-emerald-200 dark:border-emerald-900/60',
            text: 'text-emerald-800 dark:text-emerald-300',
            btnBg: 'bg-emerald-200/70 dark:bg-emerald-900/60',
            btnHover: 'hover:bg-emerald-300 dark:hover:bg-emerald-800',
          })}

          {/* Absent */}
          {renderCounter('absent', '欠席', record.absent, {
            bg:
              record.absent >= (record.maxAllowedAbsent ?? 4)
                ? 'bg-rose-100/90 dark:bg-rose-950/70 border-rose-300 dark:border-rose-800'
                : record.absent >= Math.max(1, (record.maxAllowedAbsent ?? 4) - 1)
                ? 'bg-amber-100/80 dark:bg-amber-950/60 border-amber-300 dark:border-amber-800'
                : 'bg-rose-50/80 dark:bg-rose-950/30 border-rose-200 dark:border-rose-900/60',
            text: 'text-rose-800 dark:text-rose-300',
            btnBg: 'bg-rose-200/70 dark:bg-rose-900/60',
            btnHover: 'hover:bg-rose-300 dark:hover:bg-rose-800',
          })}

          {/* Late */}
          {renderCounter('late', '遅刻', record.late, {
            bg: 'bg-amber-50/80 dark:bg-amber-950/30 border-amber-200 dark:border-amber-900/60',
            text: 'text-amber-800 dark:text-amber-300',
            btnBg: 'bg-amber-200/70 dark:bg-amber-900/60',
            btnHover: 'hover:bg-amber-300 dark:hover:bg-amber-800',
          })}

          {/* Cancelled */}
          {renderCounter('cancelled', '休講', record.cancelled, {
            bg: 'bg-slate-100/80 dark:bg-slate-800/40 border-slate-200 dark:border-slate-700/60',
            text: 'text-slate-700 dark:text-slate-300',
            btnBg: 'bg-slate-200 dark:bg-slate-700',
            btnHover: 'hover:bg-slate-300 dark:hover:bg-slate-600',
          })}

          {/* Makeup */}
          {renderCounter('makeup', '補講', record.makeup, {
            bg: 'bg-indigo-50/80 dark:bg-indigo-950/30 border-indigo-200 dark:border-indigo-900/60',
            text: 'text-indigo-800 dark:text-indigo-300',
            btnBg: 'bg-indigo-200/70 dark:bg-indigo-900/60',
            btnHover: 'hover:bg-indigo-300 dark:hover:bg-indigo-800',
          })}
        </div>
      </div>
    </div>
  );
};
