import React from 'react';
import { AssignmentType } from '../../types';
import { DueUrgency } from '../../utils/date';
import { AlertCircle, Clock, CheckCircle2, AlertTriangle } from 'lucide-react';

interface TypeBadgeProps {
  type: AssignmentType;
}

export const ASSIGNMENT_TYPE_LABELS: Record<AssignmentType, { label: string; bg: string; text: string; border: string }> = {
  report: {
    label: 'レポート',
    bg: 'bg-blue-100 dark:bg-blue-950/60',
    text: 'text-blue-700 dark:text-blue-300',
    border: 'border-blue-200 dark:border-blue-800',
  },
  quiz: {
    label: '小テスト',
    bg: 'bg-purple-100 dark:bg-purple-950/60',
    text: 'text-purple-700 dark:text-purple-300',
    border: 'border-purple-200 dark:border-purple-800',
  },
  exam: {
    label: '試験',
    bg: 'bg-rose-100 dark:bg-rose-950/60',
    text: 'text-rose-700 dark:text-rose-300',
    border: 'border-rose-200 dark:border-rose-800',
  },
  presentation: {
    label: '発表/プレゼン',
    bg: 'bg-amber-100 dark:bg-amber-950/60',
    text: 'text-amber-700 dark:text-amber-300',
    border: 'border-amber-200 dark:border-amber-800',
  },
  homework: {
    label: '宿題・演習',
    bg: 'bg-emerald-100 dark:bg-emerald-950/60',
    text: 'text-emerald-700 dark:text-emerald-300',
    border: 'border-emerald-200 dark:border-emerald-800',
  },
  other: {
    label: 'その他',
    bg: 'bg-slate-100 dark:bg-slate-800',
    text: 'text-slate-700 dark:text-slate-300',
    border: 'border-slate-200 dark:border-slate-700',
  },
};

export const AssignmentTypeBadge: React.FC<TypeBadgeProps> = ({ type }) => {
  const config = ASSIGNMENT_TYPE_LABELS[type] || ASSIGNMENT_TYPE_LABELS.other;
  return (
    <span
      className={`inline-flex items-center px-2 py-0.5 rounded-md text-xs font-medium border ${config.bg} ${config.text} ${config.border}`}
    >
      {config.label}
    </span>
  );
};

interface DueBadgeProps {
  urgency: DueUrgency;
  text: string;
  className?: string;
}

export const AssignmentDueBadge: React.FC<DueBadgeProps> = ({ urgency, text, className = '' }) => {
  switch (urgency) {
    case 'overdue':
      return (
        <span
          className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-semibold bg-rose-100 text-rose-800 border border-rose-300 dark:bg-rose-950/70 dark:text-rose-300 dark:border-rose-800 animate-pulse ${className}`}
        >
          <AlertCircle className="w-3.5 h-3.5 text-rose-600 dark:text-rose-400" />
          <span>{text}</span>
        </span>
      );
    case 'urgent':
      return (
        <span
          className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-semibold bg-amber-100 text-amber-900 border border-amber-300 dark:bg-amber-950/70 dark:text-amber-300 dark:border-amber-800 ${className}`}
        >
          <Clock className="w-3.5 h-3.5 text-amber-600 dark:text-amber-400 animate-bounce" />
          <span>{text}</span>
        </span>
      );
    case 'warning':
      return (
        <span
          className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-medium bg-yellow-50 text-yellow-800 border border-yellow-200 dark:bg-yellow-950/50 dark:text-yellow-300 dark:border-yellow-800 ${className}`}
        >
          <AlertTriangle className="w-3.5 h-3.5 text-yellow-600 dark:text-yellow-400" />
          <span>{text}</span>
        </span>
      );
    case 'completed':
      return (
        <span
          className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-medium bg-emerald-50 text-emerald-800 border border-emerald-200 dark:bg-emerald-950/50 dark:text-emerald-300 dark:border-emerald-800 ${className}`}
        >
          <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 dark:text-emerald-400" />
          <span>{text}</span>
        </span>
      );
    default:
      return (
        <span
          className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-medium bg-slate-100 text-slate-700 border border-slate-200 dark:bg-slate-800 dark:text-slate-300 dark:border-slate-700 ${className}`}
        >
          <Clock className="w-3.5 h-3.5 text-slate-500 dark:text-slate-400" />
          <span>{text}</span>
        </span>
      );
  }
};
