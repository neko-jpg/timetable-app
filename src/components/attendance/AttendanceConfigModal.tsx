import React, { useState, useEffect } from 'react';
import { Lecture, AttendanceRecord } from '../../types';
import { X, Settings2, AlertCircle } from 'lucide-react';

interface AttendanceConfigModalProps {
  isOpen: boolean;
  onClose: () => void;
  lecture: Lecture | null;
  attendanceRecord: AttendanceRecord | null;
  onSave: (updates: { maxAllowedAbsent: number; totalSessions: number }) => void;
}

export const AttendanceConfigModal: React.FC<AttendanceConfigModalProps> = ({
  isOpen,
  onClose,
  lecture,
  attendanceRecord,
  onSave,
}) => {
  const [maxAllowed, setMaxAllowed] = useState(4);
  const [totalSessions, setTotalSessions] = useState(15);
  const [error, setError] = useState('');

  useEffect(() => {
    if (isOpen && attendanceRecord) {
      setMaxAllowed(attendanceRecord.maxAllowedAbsent ?? 4);
      setTotalSessions(attendanceRecord.totalSessions ?? 15);
      setError('');
    }
  }, [isOpen, attendanceRecord]);

  if (!isOpen || !lecture) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (maxAllowed < 1) {
      setError('欠席許容上限は1以上を設定してください');
      return;
    }
    if (totalSessions < 1) {
      setError('総授業回数は1以上を設定してください');
      return;
    }

    onSave({
      maxAllowedAbsent: Number(maxAllowed),
      totalSessions: Number(totalSessions),
    });
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm animate-fadeIn">
      <div className="w-full max-w-md bg-white dark:bg-slate-900 rounded-2xl shadow-2xl border border-slate-200 dark:border-slate-800 overflow-hidden">
        {/* Modal Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-slate-200 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-800/40">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-indigo-500/10 text-indigo-600 dark:text-indigo-400 flex items-center justify-center">
              <Settings2 className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-base font-bold text-slate-900 dark:text-slate-100">
                出欠・単位リスク設定
              </h3>
              <p className="text-xs text-slate-500">{lecture.name}</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Modal Form */}
        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          {error && (
            <div className="p-3 text-xs rounded-lg bg-rose-50 text-rose-700 dark:bg-rose-950/50 dark:text-rose-300 border border-rose-200 dark:border-rose-800">
              {error}
            </div>
          )}

          <div>
            <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1.5">
              欠席許容上限回数 (規定欠席数)
            </label>
            <div className="flex items-center gap-2">
              <input
                type="number"
                min={1}
                max={30}
                value={maxAllowed}
                onChange={(e) => setMaxAllowed(Number(e.target.value))}
                className="w-full px-3.5 py-2 text-sm rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-950 text-slate-900 dark:text-slate-100 focus:outline-none focus:ring-2 focus:ring-indigo-500"
              />
              <span className="text-xs text-slate-500 flex-shrink-0">回まで</span>
            </div>
            <p className="mt-1 text-xs text-slate-500">
              この回数以上欠席すると「単位危険」のアラートが表示されます（例: 4回）。
            </p>
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1.5">
              学期の総授業回数
            </label>
            <div className="flex items-center gap-2">
              <input
                type="number"
                min={1}
                max={50}
                value={totalSessions}
                onChange={(e) => setTotalSessions(Number(e.target.value))}
                className="w-full px-3.5 py-2 text-sm rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-950 text-slate-900 dark:text-slate-100 focus:outline-none focus:ring-2 focus:ring-indigo-500"
              />
              <span className="text-xs text-slate-500 flex-shrink-0">回</span>
            </div>
            <p className="mt-1 text-xs text-slate-500">
              通常は1学期あたり15回（または14回）です。
            </p>
          </div>

          <div className="p-3 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700/60 flex items-start gap-2 text-xs text-slate-600 dark:text-slate-300">
            <AlertCircle className="w-4 h-4 text-indigo-500 flex-shrink-0 mt-0.5" />
            <span>
              注意ラインは欠席上限の1回前（{Math.max(1, maxAllowed - 1)}回）に達した時点で「欠席注意」として通知されます。
            </span>
          </div>

          {/* Buttons */}
          <div className="flex items-center justify-end gap-2.5 pt-3 border-t border-slate-200 dark:border-slate-800">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-sm font-medium text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-xl transition-colors"
            >
              キャンセル
            </button>
            <button
              type="submit"
              className="px-5 py-2 text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 rounded-xl shadow-sm shadow-indigo-500/25 transition-colors"
            >
              設定を保存
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
