import React from 'react';
import { Assignment, Lecture } from '../../types';
import { formatRelativeDue, formatDateTime } from '../../utils/date';
import { getLectureColor } from '../../utils/lectureColors';
import { AssignmentTypeBadge, AssignmentDueBadge } from './AssignmentBadge';
import { Check, Edit2, Trash2, Calendar, FileText } from 'lucide-react';

interface AssignmentCardProps {
  assignment: Assignment;
  lecture?: Lecture;
  onToggleStatus: (id: string) => void;
  onEdit: (assignment: Assignment) => void;
  onDelete: (id: string) => void;
}

export const AssignmentCard: React.FC<AssignmentCardProps> = ({
  assignment,
  lecture,
  onToggleStatus,
  onEdit,
  onDelete,
}) => {
  const isCompleted = assignment.status === 'completed';
  const relative = formatRelativeDue(assignment.dueDate, assignment.status);
  const colorScheme = getLectureColor(lecture?.color);

  const isUrgent = relative.urgency === 'urgent';
  const isOverdue = relative.urgency === 'overdue';

  return (
    <div
      className={`group relative p-4 rounded-2xl border transition-all duration-200 ${
        isCompleted
          ? 'bg-slate-50/70 dark:bg-slate-900/40 border-slate-200 dark:border-slate-800 opacity-75'
          : isOverdue
          ? 'bg-rose-50/40 dark:bg-rose-950/20 border-rose-200 dark:border-rose-900/50 shadow-sm shadow-rose-500/5 hover:border-rose-300'
          : isUrgent
          ? 'bg-amber-50/40 dark:bg-amber-950/20 border-amber-300 dark:border-amber-900/60 shadow-sm shadow-amber-500/10 hover:border-amber-400 ring-1 ring-amber-400/30'
          : 'bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-800 shadow-sm hover:border-slate-300 dark:hover:border-slate-700 hover:shadow-md'
      }`}
    >
      <div className="flex items-start gap-3">
        {/* Toggle Checkbox Button */}
        <button
          onClick={() => onToggleStatus(assignment.id)}
          className={`mt-0.5 w-6 h-6 rounded-lg flex items-center justify-center transition-all flex-shrink-0 ${
            isCompleted
              ? 'bg-emerald-600 text-white shadow-sm shadow-emerald-600/30'
              : 'border-2 border-slate-300 dark:border-slate-600 hover:border-indigo-600 dark:hover:border-indigo-400 bg-white dark:bg-slate-950'
          }`}
          aria-label={isCompleted ? 'Mark as incomplete' : 'Mark as completed'}
        >
          {isCompleted && <Check className="w-4 h-4 stroke-[3]" />}
        </button>

        {/* Card Content */}
        <div className="flex-1 min-w-0">
          {/* Lecture Name & Badges */}
          <div className="flex flex-wrap items-center gap-2 mb-1.5">
            {lecture && (
              <span
                className={`inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-semibold ${colorScheme.badge} ${colorScheme.badgeText}`}
              >
                <span className={`w-2 h-2 rounded-full ${colorScheme.dot}`} />
                {lecture.name}
              </span>
            )}
            <AssignmentTypeBadge type={assignment.type} />
            <AssignmentDueBadge urgency={relative.urgency} text={relative.text} />
          </div>

          {/* Title */}
          <h4
            className={`text-sm font-bold text-slate-900 dark:text-slate-100 break-words ${
              isCompleted ? 'line-through text-slate-400 dark:text-slate-500' : ''
            }`}
          >
            {assignment.title}
          </h4>

          {/* Memo if any */}
          {assignment.memo && (
            <p className="mt-1.5 text-xs text-slate-600 dark:text-slate-400 flex items-start gap-1.5 bg-slate-50 dark:bg-slate-950/50 p-2 rounded-lg border border-slate-100 dark:border-slate-800/80">
              <FileText className="w-3.5 h-3.5 text-slate-400 mt-0.5 flex-shrink-0" />
              <span className="whitespace-pre-wrap">{assignment.memo}</span>
            </p>
          )}

          {/* Footer Metadata */}
          <div className="mt-3 flex items-center justify-between text-xs text-slate-400 dark:text-slate-500">
            <div className="flex items-center gap-1.5">
              <Calendar className="w-3.5 h-3.5" />
              <span>期日: {formatDateTime(assignment.dueDate)}</span>
            </div>

            {/* Actions */}
            <div className="flex items-center gap-1 opacity-90 sm:opacity-0 group-hover:opacity-100 transition-opacity">
              <button
                onClick={() => onEdit(assignment)}
                className="p-1.5 text-slate-400 hover:text-indigo-600 dark:hover:text-indigo-400 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-lg transition-colors"
                title="編集"
              >
                <Edit2 className="w-3.5 h-3.5" />
              </button>
              <button
                onClick={() => {
                  if (window.confirm(`課題「${assignment.title}」を削除しますか？`)) {
                    onDelete(assignment.id);
                  }
                }}
                className="p-1.5 text-slate-400 hover:text-rose-600 dark:hover:text-rose-400 hover:bg-rose-50 dark:hover:bg-rose-950/50 rounded-lg transition-colors"
                title="削除"
              >
                <Trash2 className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
