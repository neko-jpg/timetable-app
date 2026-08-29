import { DayInfo, LectureColor, PeriodConfig } from '../types';

export const DAYS_CONFIG: DayInfo[] = [
  { key: 'mon', label: '月', fullLabel: '月曜日', isWeekend: false },
  { key: 'tue', label: '火', fullLabel: '火曜日', isWeekend: false },
  { key: 'wed', label: '水', fullLabel: '水曜日', isWeekend: false },
  { key: 'thu', label: '木', fullLabel: '木曜日', isWeekend: false },
  { key: 'fri', label: '金', fullLabel: '金曜日', isWeekend: false },
  { key: 'sat', label: '土', fullLabel: '土曜日', isWeekend: true },
  { key: 'sun', label: '日', fullLabel: '日曜日', isWeekend: true },
];

export const DEFAULT_PERIODS: PeriodConfig[] = [
  { period: 1, startTime: '09:00', endTime: '10:30' },
  { period: 2, startTime: '10:45', endTime: '12:15' },
  { period: 3, startTime: '13:00', endTime: '14:30' },
  { period: 4, startTime: '14:45', endTime: '16:15' },
  { period: 5, startTime: '16:30', endTime: '18:00' },
  { period: 6, startTime: '18:15', endTime: '19:45' },
  { period: 7, startTime: '20:00', endTime: '21:30' },
];

export interface ColorScheme {
  id: LectureColor;
  label: string;
  bg: string;
  border: string;
  text: string;
  badge: string;
  badgeText: string;
  accent: string;
  hover: string;
}

export const LECTURE_COLORS: Record<LectureColor, ColorScheme> = {
  indigo: {
    id: 'indigo',
    label: 'インディゴ',
    bg: 'bg-indigo-50 dark:bg-indigo-950/40',
    border: 'border-indigo-200 dark:border-indigo-800/60',
    text: 'text-indigo-900 dark:text-indigo-100',
    badge: 'bg-indigo-100 dark:bg-indigo-900/60',
    badgeText: 'text-indigo-700 dark:text-indigo-300',
    accent: 'bg-indigo-500',
    hover: 'hover:border-indigo-300 dark:hover:border-indigo-700',
  },
  blue: {
    id: 'blue',
    label: 'ブルー',
    bg: 'bg-blue-50 dark:bg-blue-950/40',
    border: 'border-blue-200 dark:border-blue-800/60',
    text: 'text-blue-900 dark:text-blue-100',
    badge: 'bg-blue-100 dark:bg-blue-900/60',
    badgeText: 'text-blue-700 dark:text-blue-300',
    accent: 'bg-blue-500',
    hover: 'hover:border-blue-300 dark:hover:border-blue-700',
  },
  sky: {
    id: 'sky',
    label: 'スカイ',
    bg: 'bg-sky-50 dark:bg-sky-950/40',
    border: 'border-sky-200 dark:border-sky-800/60',
    text: 'text-sky-900 dark:text-sky-100',
    badge: 'bg-sky-100 dark:bg-sky-900/60',
    badgeText: 'text-sky-700 dark:text-sky-300',
    accent: 'bg-sky-500',
    hover: 'hover:border-sky-300 dark:hover:border-sky-700',
  },
  emerald: {
    id: 'emerald',
    label: 'エメラルド',
    bg: 'bg-emerald-50 dark:bg-emerald-950/40',
    border: 'border-emerald-200 dark:border-emerald-800/60',
    text: 'text-emerald-900 dark:text-emerald-100',
    badge: 'bg-emerald-100 dark:bg-emerald-900/60',
    badgeText: 'text-emerald-700 dark:text-emerald-300',
    accent: 'bg-emerald-500',
    hover: 'hover:border-emerald-300 dark:hover:border-emerald-700',
  },
  amber: {
    id: 'amber',
    label: 'アンバー',
    bg: 'bg-amber-50 dark:bg-amber-950/40',
    border: 'border-amber-200 dark:border-amber-800/60',
    text: 'text-amber-900 dark:text-amber-100',
    badge: 'bg-amber-100 dark:bg-amber-900/60',
    badgeText: 'text-amber-700 dark:text-amber-300',
    accent: 'bg-amber-500',
    hover: 'hover:border-amber-300 dark:hover:border-amber-700',
  },
  orange: {
    id: 'orange',
    label: 'オレンジ',
    bg: 'bg-orange-50 dark:bg-orange-950/40',
    border: 'border-orange-200 dark:border-orange-800/60',
    text: 'text-orange-900 dark:text-orange-100',
    badge: 'bg-orange-100 dark:bg-orange-900/60',
    badgeText: 'text-orange-700 dark:text-orange-300',
    accent: 'bg-orange-500',
    hover: 'hover:border-orange-300 dark:hover:border-orange-700',
  },
  rose: {
    id: 'rose',
    label: 'ローズ',
    bg: 'bg-rose-50 dark:bg-rose-950/40',
    border: 'border-rose-200 dark:border-rose-800/60',
    text: 'text-rose-900 dark:text-rose-100',
    badge: 'bg-rose-100 dark:bg-rose-900/60',
    badgeText: 'text-rose-700 dark:text-rose-300',
    accent: 'bg-rose-500',
    hover: 'hover:border-rose-300 dark:hover:border-rose-700',
  },
  purple: {
    id: 'purple',
    label: 'パープル',
    bg: 'bg-purple-50 dark:bg-purple-950/40',
    border: 'border-purple-200 dark:border-purple-800/60',
    text: 'text-purple-900 dark:text-purple-100',
    badge: 'bg-purple-100 dark:bg-purple-900/60',
    badgeText: 'text-purple-700 dark:text-purple-300',
    accent: 'bg-purple-500',
    hover: 'hover:border-purple-300 dark:hover:border-purple-700',
  },
  violet: {
    id: 'violet',
    label: 'バイオレット',
    bg: 'bg-violet-50 dark:bg-violet-950/40',
    border: 'border-violet-200 dark:border-violet-800/60',
    text: 'text-violet-900 dark:text-violet-100',
    badge: 'bg-violet-100 dark:bg-violet-900/60',
    badgeText: 'text-violet-700 dark:text-violet-300',
    accent: 'bg-violet-500',
    hover: 'hover:border-violet-300 dark:hover:border-violet-700',
  },
  slate: {
    id: 'slate',
    label: 'スレート',
    bg: 'bg-slate-100 dark:bg-slate-800/60',
    border: 'border-slate-300 dark:border-slate-700',
    text: 'text-slate-900 dark:text-slate-100',
    badge: 'bg-slate-200 dark:bg-slate-700',
    badgeText: 'text-slate-700 dark:text-slate-300',
    accent: 'bg-slate-500',
    hover: 'hover:border-slate-400 dark:hover:border-slate-600',
  },
};

export const COLOR_OPTIONS: { id: LectureColor; label: string; colorClass: string }[] = [
  { id: 'indigo', label: 'インディゴ', colorClass: 'bg-indigo-500' },
  { id: 'blue', label: 'ブルー', colorClass: 'bg-blue-500' },
  { id: 'sky', label: 'スカイ', colorClass: 'bg-sky-500' },
  { id: 'emerald', label: 'エメラルド', colorClass: 'bg-emerald-500' },
  { id: 'amber', label: 'アンバー', colorClass: 'bg-amber-500' },
  { id: 'orange', label: 'オレンジ', colorClass: 'bg-orange-500' },
  { id: 'rose', label: 'ローズ', colorClass: 'bg-rose-500' },
  { id: 'purple', label: 'パープル', colorClass: 'bg-purple-500' },
  { id: 'violet', label: 'バイオレット', colorClass: 'bg-violet-500' },
  { id: 'slate', label: 'スレート', colorClass: 'bg-slate-500' },
];

export const CURRENT_STORAGE_VERSION = '1.0.0';
export const STORAGE_KEY = 'timetable_app_data_v1';
