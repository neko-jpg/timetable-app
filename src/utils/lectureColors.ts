import { LectureColor } from '../types';

export interface ColorScheme {
  bg: string;
  text: string;
  border: string;
  badge: string;
  badgeText: string;
  dot: string;
  accent: string;
}

export const LECTURE_COLORS: Record<LectureColor, ColorScheme> = {
  indigo: {
    bg: 'bg-indigo-50 dark:bg-indigo-950/40',
    text: 'text-indigo-900 dark:text-indigo-200',
    border: 'border-indigo-200 dark:border-indigo-800/60',
    badge: 'bg-indigo-100 dark:bg-indigo-900/60',
    badgeText: 'text-indigo-700 dark:text-indigo-300',
    dot: 'bg-indigo-500',
    accent: 'border-l-indigo-500',
  },
  blue: {
    bg: 'bg-blue-50 dark:bg-blue-950/40',
    text: 'text-blue-900 dark:text-blue-200',
    border: 'border-blue-200 dark:border-blue-800/60',
    badge: 'bg-blue-100 dark:bg-blue-900/60',
    badgeText: 'text-blue-700 dark:text-blue-300',
    dot: 'bg-blue-500',
    accent: 'border-l-blue-500',
  },
  sky: {
    bg: 'bg-sky-50 dark:bg-sky-950/40',
    text: 'text-sky-900 dark:text-sky-200',
    border: 'border-sky-200 dark:border-sky-800/60',
    badge: 'bg-sky-100 dark:bg-sky-900/60',
    badgeText: 'text-sky-700 dark:text-sky-300',
    dot: 'bg-sky-500',
    accent: 'border-l-sky-500',
  },
  emerald: {
    bg: 'bg-emerald-50 dark:bg-emerald-950/40',
    text: 'text-emerald-900 dark:text-emerald-200',
    border: 'border-emerald-200 dark:border-emerald-800/60',
    badge: 'bg-emerald-100 dark:bg-emerald-900/60',
    badgeText: 'text-emerald-700 dark:text-emerald-300',
    dot: 'bg-emerald-500',
    accent: 'border-l-emerald-500',
  },
  amber: {
    bg: 'bg-amber-50 dark:bg-amber-950/40',
    text: 'text-amber-900 dark:text-amber-200',
    border: 'border-amber-200 dark:border-amber-800/60',
    badge: 'bg-amber-100 dark:bg-amber-900/60',
    badgeText: 'text-amber-700 dark:text-amber-300',
    dot: 'bg-amber-500',
    accent: 'border-l-amber-500',
  },
  orange: {
    bg: 'bg-orange-50 dark:bg-orange-950/40',
    text: 'text-orange-900 dark:text-orange-200',
    border: 'border-orange-200 dark:border-orange-800/60',
    badge: 'bg-orange-100 dark:bg-orange-900/60',
    badgeText: 'text-orange-700 dark:text-orange-300',
    dot: 'bg-orange-500',
    accent: 'border-l-orange-500',
  },
  rose: {
    bg: 'bg-rose-50 dark:bg-rose-950/40',
    text: 'text-rose-900 dark:text-rose-200',
    border: 'border-rose-200 dark:border-rose-800/60',
    badge: 'bg-rose-100 dark:bg-rose-900/60',
    badgeText: 'text-rose-700 dark:text-rose-300',
    dot: 'bg-rose-500',
    accent: 'border-l-rose-500',
  },
  purple: {
    bg: 'bg-purple-50 dark:bg-purple-950/40',
    text: 'text-purple-900 dark:text-purple-200',
    border: 'border-purple-200 dark:border-purple-800/60',
    badge: 'bg-purple-100 dark:bg-purple-900/60',
    badgeText: 'text-purple-700 dark:text-purple-300',
    dot: 'bg-purple-500',
    accent: 'border-l-purple-500',
  },
  violet: {
    bg: 'bg-violet-50 dark:bg-violet-950/40',
    text: 'text-violet-900 dark:text-violet-200',
    border: 'border-violet-200 dark:border-violet-800/60',
    badge: 'bg-violet-100 dark:bg-violet-900/60',
    badgeText: 'text-violet-700 dark:text-violet-300',
    dot: 'bg-violet-500',
    accent: 'border-l-violet-500',
  },
  slate: {
    bg: 'bg-slate-100 dark:bg-slate-800/60',
    text: 'text-slate-900 dark:text-slate-200',
    border: 'border-slate-300 dark:border-slate-700',
    badge: 'bg-slate-200 dark:bg-slate-700',
    badgeText: 'text-slate-700 dark:text-slate-300',
    dot: 'bg-slate-500',
    accent: 'border-l-slate-500',
  },
};

export const COLOR_OPTIONS: { key: LectureColor; label: string }[] = [
  { key: 'indigo', label: 'インディゴ' },
  { key: 'blue', label: 'ブルー' },
  { key: 'sky', label: 'スカイ' },
  { key: 'emerald', label: 'エメラルド' },
  { key: 'amber', label: 'アンバー' },
  { key: 'orange', label: 'オレンジ' },
  { key: 'rose', label: 'ローズ' },
  { key: 'purple', label: 'パープル' },
  { key: 'violet', label: 'バイオレット' },
  { key: 'slate', label: 'スレート' },
];

export function getLectureColor(color?: LectureColor): ColorScheme {
  return LECTURE_COLORS[color || 'indigo'] || LECTURE_COLORS.indigo;
}
