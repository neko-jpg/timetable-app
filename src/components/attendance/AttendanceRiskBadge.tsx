import React from 'react';
import { RiskLevel } from '../../hooks/useAttendance';
import { ShieldAlert, AlertTriangle, ShieldCheck } from 'lucide-react';

interface AttendanceRiskBadgeProps {
  status: RiskLevel;
  absent: number;
  maxAllowed: number;
  remaining: number;
  className?: string;
}

export const AttendanceRiskBadge: React.FC<AttendanceRiskBadgeProps> = ({
  status,
  absent,
  maxAllowed,
  remaining,
  className = '',
}) => {
  switch (status) {
    case 'danger':
      return (
        <span
          className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-black bg-rose-100 text-rose-800 border border-rose-300 dark:bg-rose-950/80 dark:text-rose-200 dark:border-rose-800 shadow-sm animate-pulse ${className}`}
        >
          <ShieldAlert className="w-4 h-4 text-rose-600 dark:text-rose-400" />
          <span>単位危険 (欠席 {absent}/{maxAllowed}回)</span>
        </span>
      );
    case 'warning':
      return (
        <span
          className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-amber-100 text-amber-900 border border-amber-300 dark:bg-amber-950/80 dark:text-amber-200 dark:border-amber-800 ${className}`}
        >
          <AlertTriangle className="w-4 h-4 text-amber-600 dark:text-amber-400" />
          <span>欠席注意 (残り{remaining}回)</span>
        </span>
      );
    case 'safe':
    default:
      return (
        <span
          className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-medium bg-emerald-50 text-emerald-800 border border-emerald-200 dark:bg-emerald-950/60 dark:text-emerald-300 dark:border-emerald-800 ${className}`}
        >
          <ShieldCheck className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />
          <span>出席良好 (欠席 {absent}回)</span>
        </span>
      );
  }
};
