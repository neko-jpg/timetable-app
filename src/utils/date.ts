import { AssignmentStatus } from '../types';

export type DueUrgency = 'overdue' | 'urgent' | 'warning' | 'normal' | 'completed';

export function formatDateTime(isoString: string): string {
  if (!isoString) return '';
  const date = new Date(isoString);
  if (isNaN(date.getTime())) return isoString;

  const y = date.getFullYear();
  const m = String(date.getMonth() + 1).padStart(2, '0');
  const d = String(date.getDate()).padStart(2, '0');
  const h = String(date.getHours()).padStart(2, '0');
  const min = String(date.getMinutes()).padStart(2, '0');

  return `${y}/${m}/${d} ${h}:${min}`;
}

export function formatDateOnly(isoString: string): string {
  if (!isoString) return '';
  const date = new Date(isoString);
  if (isNaN(date.getTime())) return isoString;

  const m = date.getMonth() + 1;
  const d = date.getDate();
  const dayNames = ['日', '月', '火', '水', '木', '金', '土'];
  const dayName = dayNames[date.getDay()];

  return `${m}月${d}日(${dayName})`;
}

export function getDueUrgency(dueDate: string, status: AssignmentStatus): DueUrgency {
  if (status === 'completed') return 'completed';
  if (!dueDate) return 'normal';

  const due = new Date(dueDate).getTime();
  if (isNaN(due)) return 'normal';

  const now = Date.now();
  const diffMs = due - now;

  if (diffMs < 0) {
    return 'overdue'; // 期限切れ
  }
  if (diffMs <= 24 * 60 * 60 * 1000) {
    return 'urgent'; // 24時間以内
  }
  if (diffMs <= 3 * 24 * 60 * 60 * 1000) {
    return 'warning'; // 3日以内
  }
  return 'normal';
}

export function formatRelativeDue(dueDate: string, status: AssignmentStatus): {
  text: string;
  urgency: DueUrgency;
} {
  const urgency = getDueUrgency(dueDate, status);
  if (urgency === 'completed') {
    return { text: '完了済み', urgency: 'completed' };
  }

  const due = new Date(dueDate).getTime();
  if (isNaN(due)) {
    return { text: '期日未定', urgency: 'normal' };
  }

  const now = Date.now();
  const diffMs = due - now;
  const absDiff = Math.abs(diffMs);

  const hours = Math.floor(absDiff / (1000 * 60 * 60));
  const days = Math.floor(absDiff / (1000 * 60 * 60 * 24));

  if (diffMs < 0) {
    if (days > 0) {
      return { text: `期限切れ (${days}日前)`, urgency: 'overdue' };
    }
    return { text: `期限切れ (${hours}時間前)`, urgency: 'overdue' };
  }

  if (hours < 1) {
    const mins = Math.max(1, Math.floor(diffMs / (1000 * 60)));
    return { text: `あと${mins}分！`, urgency: 'urgent' };
  }

  if (hours < 24) {
    return { text: `あと${hours}時間`, urgency: 'urgent' };
  }

  if (days === 1) {
    return { text: `明日 ${formatTimeOnly(dueDate)}`, urgency: 'urgent' };
  }

  if (days <= 3) {
    return { text: `あと${days}日 (${formatDateOnly(dueDate)})`, urgency: 'warning' };
  }

  return { text: formatDateOnly(dueDate), urgency: 'normal' };
}

export function formatTimeOnly(isoString: string): string {
  if (!isoString) return '';
  const date = new Date(isoString);
  if (isNaN(date.getTime())) return '';
  const h = String(date.getHours()).padStart(2, '0');
  const min = String(date.getMinutes()).padStart(2, '0');
  return `${h}:${min}`;
}
