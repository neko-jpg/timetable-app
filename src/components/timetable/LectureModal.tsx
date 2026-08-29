import React, { useEffect, useState } from 'react';
import {
  X,
  Trash2,
  MapPin,
  User,
  Award,
  Video,
  BookOpen,
  FileText,
  Clock,
  Calendar,
  AlertTriangle,
} from 'lucide-react';
import { COLOR_OPTIONS, DAYS_CONFIG, DEFAULT_PERIODS, LECTURE_COLORS } from '../../constants';
import { DayOfWeek, Lecture, LectureColor } from '../../types';

interface LectureModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (lectureData: Omit<Lecture, 'id' | 'timetableId'> & { id?: string }) => void;
  onDelete?: (id: string) => void;
  lecture?: Lecture | null;
  initialDay?: DayOfWeek;
  initialPeriod?: number;
  maxPeriods?: number;
  showWeekends?: boolean;
}

export const LectureModal: React.FC<LectureModalProps> = ({
  isOpen,
  onClose,
  onSave,
  onDelete,
  lecture,
  initialDay = 'mon',
  initialPeriod = 1,
  maxPeriods = 5,
  showWeekends = false,
}) => {
  const isEditing = !!lecture;

  const [name, setName] = useState('');
  const [dayOfWeek, setDayOfWeek] = useState<DayOfWeek>('mon');
  const [period, setPeriod] = useState<number>(1);
  const [room, setRoom] = useState('');
  const [instructor, setInstructor] = useState('');
  const [credits, setCredits] = useState<number | ''>(2);
  const [color, setColor] = useState<LectureColor>('indigo');
  const [memo, setMemo] = useState('');
  const [onlineUrl, setOnlineUrl] = useState('');
  const [syllabusUrl, setSyllabusUrl] = useState('');

  const [error, setError] = useState<string | null>(null);
  const [isConfirmingDelete, setIsConfirmingDelete] = useState(false);

  // 初期値のセット
  useEffect(() => {
    if (lecture) {
      setName(lecture.name);
      setDayOfWeek(lecture.dayOfWeek);
      setPeriod(lecture.period);
      setRoom(lecture.room || '');
      setInstructor(lecture.instructor || '');
      setCredits(lecture.credits !== undefined ? lecture.credits : '');
      setColor(lecture.color || 'indigo');
      setMemo(lecture.memo || '');
      setOnlineUrl(lecture.onlineUrl || '');
      setSyllabusUrl(lecture.syllabusUrl || '');
    } else {
      setName('');
      setDayOfWeek(initialDay);
      setPeriod(initialPeriod);
      setRoom('');
      setInstructor('');
      setCredits(2);
      setColor('indigo');
      setMemo('');
      setOnlineUrl('');
      setSyllabusUrl('');
    }
    setError(null);
    setIsConfirmingDelete(false);
  }, [lecture, initialDay, initialPeriod, isOpen]);

  // ESCキーで閉じる
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && isOpen) {
        onClose();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) {
      setError('講義名を入力してください。');
      return;
    }

    onSave({
      ...(lecture ? { id: lecture.id } : {}),
      name: name.trim(),
      dayOfWeek,
      period,
      room: room.trim() || undefined,
      instructor: instructor.trim() || undefined,
      credits: credits === '' ? undefined : Number(credits),
      color,
      memo: memo.trim() || undefined,
      onlineUrl: onlineUrl.trim() || undefined,
      syllabusUrl: syllabusUrl.trim() || undefined,
    });

    onClose();
  };

  const handleDelete = () => {
    if (lecture && onDelete) {
      onDelete(lecture.id);
      onClose();
    }
  };

  const visibleDays = DAYS_CONFIG.filter((d) => showWeekends || !d.isWeekend);
  const periodsList = DEFAULT_PERIODS.slice(0, maxPeriods);
  const currentColorConfig = LECTURE_COLORS[color] || LECTURE_COLORS.indigo;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm animate-in fade-in duration-200">
      <div
        className="relative w-full max-w-lg max-h-[90vh] flex flex-col bg-white dark:bg-slate-900 rounded-2xl shadow-2xl border border-slate-200 dark:border-slate-800 overflow-hidden"
        onClick={(e) => e.stopPropagation()}
      >
        {/* モーダルヘッダー */}
        <div className="px-6 py-4 border-b border-slate-100 dark:border-slate-800 flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className={`w-3.5 h-3.5 rounded-full ${currentColorConfig.accent}`} />
            <h2 className="text-lg font-bold tracking-tight text-slate-900 dark:text-slate-100">
              {isEditing ? '講義情報の編集' : '新しい講義の追加'}
            </h2>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* フォームボディ */}
        <form onSubmit={handleSubmit} className="flex-1 overflow-y-auto p-6 space-y-4">
          {error && (
            <div className="p-3 rounded-lg bg-rose-50 dark:bg-rose-950/50 border border-rose-200 dark:border-rose-800 text-rose-700 dark:text-rose-300 text-sm flex items-center gap-2">
              <AlertTriangle className="w-4 h-4 shrink-0" />
              <span>{error}</span>
            </div>
          )}

          {/* 講義名 */}
          <div>
            <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1.5">
              講義名 <span className="text-rose-500">*</span>
            </label>
            <input
              type="text"
              required
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="例: アルゴリズムとデータ構造"
              className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-slate-100 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-indigo-500 text-sm transition-all"
            />
          </div>

          {/* 曜日 & 時限 */}
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1.5 flex items-center gap-1">
                <Calendar className="w-3.5 h-3.5 text-slate-400" />
                曜日
              </label>
              <select
                value={dayOfWeek}
                onChange={(e) => setDayOfWeek(e.target.value as DayOfWeek)}
                className="w-full px-3 py-2 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-slate-100 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
              >
                {visibleDays.map((d) => (
                  <option key={d.key} value={d.key}>
                    {d.fullLabel}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1.5 flex items-center gap-1">
                <Clock className="w-3.5 h-3.5 text-slate-400" />
                時限
              </label>
              <select
                value={period}
                onChange={(e) => setPeriod(Number(e.target.value))}
                className="w-full px-3 py-2 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-slate-100 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
              >
                {periodsList.map((p) => (
                  <option key={p.period} value={p.period}>
                    {p.period}限 ({p.startTime} - {p.endTime})
                  </option>
                ))}
              </select>
            </div>
          </div>

          {/* 教室 & 担当教員 */}
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1.5 flex items-center gap-1">
                <MapPin className="w-3.5 h-3.5 text-slate-400" />
                教室 / 場所
              </label>
              <input
                type="text"
                value={room}
                onChange={(e) => setRoom(e.target.value)}
                placeholder="例: 301講義室"
                className="w-full px-3 py-2 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-slate-100 placeholder-slate-400 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1.5 flex items-center gap-1">
                <User className="w-3.5 h-3.5 text-slate-400" />
                担当教員
              </label>
              <input
                type="text"
                value={instructor}
                onChange={(e) => setInstructor(e.target.value)}
                placeholder="例: 佐藤 教授"
                className="w-full px-3 py-2 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-slate-100 placeholder-slate-400 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
              />
            </div>
          </div>

          {/* 単位数 & カラーテーマ */}
          <div className="space-y-3">
            <div>
              <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1.5 flex items-center gap-1">
                <Award className="w-3.5 h-3.5 text-slate-400" />
                単位数
              </label>
              <input
                type="number"
                min="0"
                max="20"
                step="1"
                value={credits}
                onChange={(e) => setCredits(e.target.value === '' ? '' : Number(e.target.value))}
                placeholder="例: 2"
                className="w-24 px-3 py-2 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-slate-100 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
              />
            </div>

            {/* カラー選択パレット */}
            <div>
              <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-2">
                テーマカラー
              </label>
              <div className="flex flex-wrap gap-2">
                {COLOR_OPTIONS.map((c) => {
                  const isSelected = color === c.id;
                  return (
                    <button
                      key={c.id}
                      type="button"
                      onClick={() => setColor(c.id)}
                      className={`w-7 h-7 rounded-lg ${c.colorClass} transition-transform flex items-center justify-center ${
                        isSelected ? 'ring-2 ring-offset-2 ring-indigo-500 scale-110' : 'hover:scale-105 opacity-80 hover:opacity-100'
                      }`}
                      title={c.label}
                    />
                  );
                })}
              </div>
            </div>
          </div>

          {/* オンラインURL & シラバスURL */}
          <div className="space-y-2 pt-2 border-t border-slate-100 dark:border-slate-800">
            <div>
              <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1 flex items-center gap-1">
                <Video className="w-3.5 h-3.5 text-slate-400" />
                オンライン講義URL
              </label>
              <input
                type="url"
                value={onlineUrl}
                onChange={(e) => setOnlineUrl(e.target.value)}
                placeholder="https://zoom.us/..."
                className="w-full px-3 py-2 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-slate-100 placeholder-slate-400 text-xs focus:outline-none focus:ring-2 focus:ring-indigo-500"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1 flex items-center gap-1">
                <BookOpen className="w-3.5 h-3.5 text-slate-400" />
                シラバスURL
              </label>
              <input
                type="url"
                value={syllabusUrl}
                onChange={(e) => setSyllabusUrl(e.target.value)}
                placeholder="https://univ.example.jp/syllabus/..."
                className="w-full px-3 py-2 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-slate-100 placeholder-slate-400 text-xs focus:outline-none focus:ring-2 focus:ring-indigo-500"
              />
            </div>
          </div>

          {/* メモ */}
          <div>
            <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1.5 flex items-center gap-1">
              <FileText className="w-3.5 h-3.5 text-slate-400" />
              メモ・備考
            </label>
            <textarea
              rows={2}
              value={memo}
              onChange={(e) => setMemo(e.target.value)}
              placeholder="評価基準、教科書、オフィスアワーなど"
              className="w-full px-3 py-2 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-slate-100 placeholder-slate-400 text-xs focus:outline-none focus:ring-2 focus:ring-indigo-500"
            />
          </div>

          {/* モーダルフッター */}
          <div className="pt-4 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between gap-3">
            {isEditing && onDelete ? (
              isConfirmingDelete ? (
                <div className="flex items-center gap-2">
                  <button
                    type="button"
                    onClick={handleDelete}
                    className="px-3 py-2 rounded-xl bg-rose-600 hover:bg-rose-700 text-white text-xs font-semibold transition-colors"
                  >
                    本当に削除
                  </button>
                  <button
                    type="button"
                    onClick={() => setIsConfirmingDelete(false)}
                    className="px-3 py-2 rounded-xl text-xs text-slate-500 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
                  >
                    取消
                  </button>
                </div>
              ) : (
                <button
                  type="button"
                  onClick={() => setIsConfirmingDelete(true)}
                  className="flex items-center gap-1 px-3 py-2 rounded-xl text-rose-600 hover:bg-rose-50 dark:hover:bg-rose-950/50 text-xs font-medium transition-colors"
                >
                  <Trash2 className="w-4 h-4" />
                  <span>削除</span>
                </button>
              )
            ) : (
              <div />
            )}

            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={onClose}
                className="px-4 py-2 rounded-xl border border-slate-300 dark:border-slate-700 text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 text-xs font-medium transition-colors"
              >
                キャンセル
              </button>
              <button
                type="submit"
                className="px-5 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-semibold shadow-md shadow-indigo-600/20 transition-all hover:shadow-indigo-600/30"
              >
                {isEditing ? '更新する' : '登録する'}
              </button>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
};
