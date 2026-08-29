import React, { useState, useEffect } from 'react';
import { Assignment, AssignmentType, Lecture } from '../../types';
import { X, Calendar, BookOpen, Tag, FileText, CheckCircle } from 'lucide-react';
import { ASSIGNMENT_TYPE_LABELS } from './AssignmentBadge';

interface AssignmentModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (data: {
    lectureId: string;
    title: string;
    dueDate: string;
    type: AssignmentType;
    memo?: string;
  }) => void;
  initialData?: Assignment | null;
  lectures: Lecture[];
  defaultLectureId?: string;
}

export const AssignmentModal: React.FC<AssignmentModalProps> = ({
  isOpen,
  onClose,
  onSave,
  initialData,
  lectures,
  defaultLectureId,
}) => {
  const [title, setTitle] = useState('');
  const [lectureId, setLectureId] = useState('');
  const [dueDate, setDueDate] = useState('');
  const [type, setType] = useState<AssignmentType>('homework');
  const [memo, setMemo] = useState('');
  const [error, setError] = useState('');

  useEffect(() => {
    if (isOpen) {
      if (initialData) {
        setTitle(initialData.title);
        setLectureId(initialData.lectureId);
        setDueDate(initialData.dueDate);
        setType(initialData.type);
        setMemo(initialData.memo || '');
      } else {
        setTitle('');
        setLectureId(defaultLectureId || (lectures[0]?.id ?? ''));
        // Default due date to tomorrow 23:59
        const tomorrow = new Date();
        tomorrow.setDate(tomorrow.getDate() + 1);
        tomorrow.setHours(23, 59, 0, 0);
        const y = tomorrow.getFullYear();
        const m = String(tomorrow.getMonth() + 1).padStart(2, '0');
        const d = String(tomorrow.getDate()).padStart(2, '0');
        const h = String(tomorrow.getHours()).padStart(2, '0');
        const min = String(tomorrow.getMinutes()).padStart(2, '0');
        setDueDate(`${y}-${m}-${dayFormatted(d)}T${h}:${min}`);
        setType('homework');
        setMemo('');
      }
      setError('');
    }
  }, [isOpen, initialData, defaultLectureId, lectures]);

  function dayFormatted(d: string) {
    return d.padStart(2, '0');
  }

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim()) {
      setError('課題タイトルを入力してください');
      return;
    }
    if (!lectureId) {
      setError('講義を選択してください');
      return;
    }
    if (!dueDate) {
      setError('提出期日を設定してください');
      return;
    }

    onSave({
      lectureId,
      title: title.trim(),
      dueDate,
      type,
      memo: memo.trim() || undefined,
    });
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm animate-fadeIn">
      <div className="w-full max-w-lg bg-white dark:bg-slate-900 rounded-2xl shadow-2xl border border-slate-200 dark:border-slate-800 overflow-hidden">
        {/* Modal Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-slate-200 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-800/40">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-indigo-500/10 text-indigo-600 dark:text-indigo-400 flex items-center justify-center font-bold">
              <CheckCircle className="w-5 h-5" />
            </div>
            <h3 className="text-base font-bold text-slate-900 dark:text-slate-100">
              {initialData ? '課題を編集' : '新規課題を登録'}
            </h3>
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

          {/* Title */}
          <div>
            <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1.5 flex items-center gap-1.5">
              <FileText className="w-4 h-4 text-indigo-500" />
              課題タイトル <span className="text-rose-500">*</span>
            </label>
            <input
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="例: 第3回演習課題レポート"
              className="w-full px-3.5 py-2 text-sm rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-950 text-slate-900 dark:text-slate-100 focus:outline-none focus:ring-2 focus:ring-indigo-500"
              autoFocus
            />
          </div>

          {/* Lecture & Type Row */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {/* Lecture */}
            <div>
              <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1.5 flex items-center gap-1.5">
                <BookOpen className="w-4 h-4 text-indigo-500" />
                関連する講義 <span className="text-rose-500">*</span>
              </label>
              <select
                value={lectureId}
                onChange={(e) => setLectureId(e.target.value)}
                className="w-full px-3.5 py-2 text-sm rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-950 text-slate-900 dark:text-slate-100 focus:outline-none focus:ring-2 focus:ring-indigo-500"
              >
                {lectures.length === 0 && <option value="">講義が登録されていません</option>}
                {lectures.map((lec) => (
                  <option key={lec.id} value={lec.id}>
                    {lec.name}
                  </option>
                ))}
              </select>
            </div>

            {/* Type */}
            <div>
              <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1.5 flex items-center gap-1.5">
                <Tag className="w-4 h-4 text-indigo-500" />
                種別
              </label>
              <select
                value={type}
                onChange={(e) => setType(e.target.value as AssignmentType)}
                className="w-full px-3.5 py-2 text-sm rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-950 text-slate-900 dark:text-slate-100 focus:outline-none focus:ring-2 focus:ring-indigo-500"
              >
                {(Object.keys(ASSIGNMENT_TYPE_LABELS) as AssignmentType[]).map((t) => (
                  <option key={t} value={t}>
                    {ASSIGNMENT_TYPE_LABELS[t].label}
                  </option>
                ))}
              </select>
            </div>
          </div>

          {/* Due Date */}
          <div>
            <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1.5 flex items-center gap-1.5">
              <Calendar className="w-4 h-4 text-indigo-500" />
              提出期限日時 <span className="text-rose-500">*</span>
            </label>
            <input
              type="datetime-local"
              value={dueDate}
              onChange={(e) => setDueDate(e.target.value)}
              className="w-full px-3.5 py-2 text-sm rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-950 text-slate-900 dark:text-slate-100 focus:outline-none focus:ring-2 focus:ring-indigo-500"
            />
          </div>

          {/* Memo */}
          <div>
            <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1.5 flex items-center gap-1.5">
              <FileText className="w-4 h-4 text-slate-400" />
              詳細メモ (任意)
            </label>
            <textarea
              value={memo}
              onChange={(e) => setMemo(e.target.value)}
              placeholder="提出形式や注意点、参照URLなど"
              rows={3}
              className="w-full px-3.5 py-2 text-sm rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-950 text-slate-900 dark:text-slate-100 focus:outline-none focus:ring-2 focus:ring-indigo-500 resize-none"
            />
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
              {initialData ? '保存する' : '登録する'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
