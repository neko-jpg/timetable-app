import React, { useState, useMemo } from 'react';
import { Assignment, AssignmentType, AssignmentStatus, Lecture } from '../../types';
import { UseAssignmentsReturn } from '../../hooks/useAssignments';
import { AssignmentCard } from './AssignmentCard';
import { AssignmentModal } from './AssignmentModal';
import { ASSIGNMENT_TYPE_LABELS } from './AssignmentBadge';
import {
  Plus,
  Filter,
  CheckCircle2,
  Clock,
  AlertCircle,
  ListTodo,
  BookOpen,
  ArrowUpDown,
  Search,
  AlertTriangle,
  Inbox,
} from 'lucide-react';

interface AssignmentDashboardProps {
  assignmentsManager: UseAssignmentsReturn;
  lectures: Lecture[];
}

type StatusFilter = 'all' | AssignmentStatus;
type SortOption = 'due_asc' | 'due_desc' | 'title_asc' | 'type';

export const AssignmentDashboard: React.FC<AssignmentDashboardProps> = ({
  assignmentsManager,
  lectures,
}) => {
  const {
    assignments,
    urgentAssignments,
    overdueAssignments,
    stats,
    addAssignment,
    updateAssignment,
    deleteAssignment,
    toggleAssignmentStatus,
  } = assignmentsManager;

  // Filters & Search State
  const [statusFilter, setStatusFilter] = useState<StatusFilter>('pending');
  const [typeFilter, setTypeFilter] = useState<string>('all');
  const [lectureFilter, setLectureFilter] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [sortBy, setSortBy] = useState<SortOption>('due_asc');
  const [onlyUrgent, setOnlyUrgent] = useState<boolean>(false);

  // Modal State
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingAssignment, setEditingAssignment] = useState<Assignment | null>(null);
  const [selectedLectureForNew, setSelectedLectureForNew] = useState<string | undefined>(undefined);

  // Lecture Map
  const lectureMap = useMemo(() => {
    const map = new Map<string, Lecture>();
    for (const lec of lectures) {
      map.set(lec.id, lec);
    }
    return map;
  }, [lectures]);

  // Filtered & Sorted Assignments
  const filteredAssignments = useMemo(() => {
    return assignments
      .filter((item) => {
        // Status filter
        if (statusFilter !== 'all' && item.status !== statusFilter) return false;

        // Urgent Only toggle
        if (onlyUrgent) {
          const isUrgent = urgentAssignments.some((u) => u.id === item.id);
          const isOverdue = overdueAssignments.some((o) => o.id === item.id);
          if (!isUrgent && !isOverdue) return false;
        }

        // Type filter
        if (typeFilter !== 'all' && item.type !== typeFilter) return false;

        // Lecture filter
        if (lectureFilter !== 'all' && item.lectureId !== lectureFilter) return false;

        // Search query
        if (searchQuery.trim()) {
          const q = searchQuery.toLowerCase();
          const titleMatch = item.title.toLowerCase().includes(q);
          const memoMatch = item.memo?.toLowerCase().includes(q) ?? false;
          const lectureName = lectureMap.get(item.lectureId)?.name.toLowerCase() ?? '';
          const lectureMatch = lectureName.includes(q);
          if (!titleMatch && !memoMatch && !lectureMatch) return false;
        }

        return true;
      })
      .sort((a, b) => {
        if (sortBy === 'due_asc') {
          return new Date(a.dueDate).getTime() - new Date(b.dueDate).getTime();
        }
        if (sortBy === 'due_desc') {
          return new Date(b.dueDate).getTime() - new Date(a.dueDate).getTime();
        }
        if (sortBy === 'title_asc') {
          return a.title.localeCompare(b.title, 'ja');
        }
        if (sortBy === 'type') {
          return a.type.localeCompare(b.type);
        }
        return 0;
      });
  }, [
    assignments,
    statusFilter,
    onlyUrgent,
    urgentAssignments,
    overdueAssignments,
    typeFilter,
    lectureFilter,
    searchQuery,
    lectureMap,
    sortBy,
  ]);

  const handleOpenAddModal = (lecId?: string) => {
    setEditingAssignment(null);
    setSelectedLectureForNew(lecId || (lectures[0]?.id ?? ''));
    setIsModalOpen(true);
  };

  const handleEdit = (assignment: Assignment) => {
    setEditingAssignment(assignment);
    setIsModalOpen(true);
  };

  const handleSaveModal = (data: {
    lectureId: string;
    title: string;
    dueDate: string;
    type: AssignmentType;
    memo?: string;
  }) => {
    if (editingAssignment) {
      updateAssignment(editingAssignment.id, data);
    } else {
      addAssignment(data);
    }
  };

  return (
    <div className="space-y-6">
      {/* Top Header & Add Button */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h2 className="text-xl font-bold text-slate-900 dark:text-slate-100 flex items-center gap-2.5">
            <ListTodo className="w-6 h-6 text-indigo-600 dark:text-indigo-400" />
            <span>課題・ToDo管理ダッシュボード</span>
          </h2>
          <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 mt-1">
            受講科目のレポート・小テスト・宿題の期日進捗を一括管理
          </p>
        </div>

        <button
          onClick={() => handleOpenAddModal()}
          className="inline-flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white text-sm font-semibold shadow-md shadow-indigo-600/25 transition-colors flex-shrink-0"
        >
          <Plus className="w-4 h-4" />
          <span>新しい課題を追加</span>
        </button>
      </div>

      {/* Summary Stat Cards */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3.5">
        {/* Urgent & Overdue Card */}
        <div
          onClick={() => {
            setOnlyUrgent(true);
            setStatusFilter('pending');
          }}
          className={`p-4 rounded-2xl border cursor-pointer transition-all ${
            stats.urgent > 0 || stats.overdue > 0
              ? 'bg-amber-500/10 border-amber-300 dark:border-amber-900/60 hover:bg-amber-500/15'
              : 'bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-800'
          }`}
        >
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-amber-800 dark:text-amber-300">
              期日直前・要対応
            </span>
            <AlertTriangle className="w-4 h-4 text-amber-600 dark:text-amber-400" />
          </div>
          <div className="mt-2 flex items-baseline gap-2">
            <span className="text-2xl font-black text-amber-900 dark:text-amber-200">
              {stats.urgent + stats.overdue}
            </span>
            <span className="text-xs text-amber-700 dark:text-amber-400">
              (直前: {stats.urgent} / 期限切: {stats.overdue})
            </span>
          </div>
        </div>

        {/* Pending Card */}
        <div
          onClick={() => {
            setOnlyUrgent(false);
            setStatusFilter('pending');
          }}
          className={`p-4 rounded-2xl border cursor-pointer transition-all ${
            statusFilter === 'pending' && !onlyUrgent
              ? 'bg-indigo-500/10 border-indigo-300 dark:border-indigo-800'
              : 'bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-800 hover:border-slate-300'
          }`}
        >
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-indigo-700 dark:text-indigo-300">
              未完了の課題
            </span>
            <Clock className="w-4 h-4 text-indigo-600 dark:text-indigo-400" />
          </div>
          <div className="mt-2 flex items-baseline gap-2">
            <span className="text-2xl font-black text-indigo-900 dark:text-indigo-100">
              {stats.pending}
            </span>
            <span className="text-xs text-slate-500">件</span>
          </div>
        </div>

        {/* Completed Card */}
        <div
          onClick={() => {
            setOnlyUrgent(false);
            setStatusFilter('completed');
          }}
          className={`p-4 rounded-2xl border cursor-pointer transition-all ${
            statusFilter === 'completed'
              ? 'bg-emerald-500/10 border-emerald-300 dark:border-emerald-800'
              : 'bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-800 hover:border-slate-300'
          }`}
        >
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-emerald-700 dark:text-emerald-300">
              完了済み
            </span>
            <CheckCircle2 className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />
          </div>
          <div className="mt-2 flex items-baseline gap-2">
            <span className="text-2xl font-black text-emerald-900 dark:text-emerald-100">
              {stats.completed}
            </span>
            <span className="text-xs text-slate-500">件</span>
          </div>
        </div>

        {/* Total Card */}
        <div
          onClick={() => {
            setOnlyUrgent(false);
            setStatusFilter('all');
          }}
          className={`p-4 rounded-2xl border cursor-pointer transition-all ${
            statusFilter === 'all' && !onlyUrgent
              ? 'bg-slate-100 dark:bg-slate-800 border-slate-300 dark:border-slate-700'
              : 'bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-800 hover:border-slate-300'
          }`}
        >
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-slate-700 dark:text-slate-300">
              全登録課題
            </span>
            <BookOpen className="w-4 h-4 text-slate-500" />
          </div>
          <div className="mt-2 flex items-baseline gap-2">
            <span className="text-2xl font-black text-slate-900 dark:text-slate-100">
              {stats.total}
            </span>
            <span className="text-xs text-slate-500">件</span>
          </div>
        </div>
      </div>

      {/* Urgent Alert Banner if urgent / overdue tasks exist */}
      {(urgentAssignments.length > 0 || overdueAssignments.length > 0) && (
        <div className="p-4 rounded-2xl bg-amber-500/10 border border-amber-300 dark:border-amber-900/80 flex items-start gap-3">
          <AlertCircle className="w-5 h-5 text-amber-600 dark:text-amber-400 mt-0.5 flex-shrink-0 animate-pulse" />
          <div className="flex-1 text-xs sm:text-sm">
            <h4 className="font-bold text-amber-900 dark:text-amber-200">
              締め切りが迫っている課題があります！
            </h4>
            <p className="text-amber-800 dark:text-amber-300 mt-0.5">
              {urgentAssignments.length > 0 && (
                <span className="font-semibold">
                  24時間以内の締切: {urgentAssignments.length}件
                </span>
              )}
              {urgentAssignments.length > 0 && overdueAssignments.length > 0 && ' / '}
              {overdueAssignments.length > 0 && (
                <span className="font-semibold text-rose-700 dark:text-rose-400">
                  期限切れ: {overdueAssignments.length}件
                </span>
              )}
            </p>
          </div>
          <button
            onClick={() => {
              setOnlyUrgent(true);
              setStatusFilter('pending');
            }}
            className="px-3 py-1 text-xs font-semibold text-amber-900 dark:text-amber-100 bg-amber-200/80 dark:bg-amber-900/60 rounded-lg hover:bg-amber-300 transition-colors flex-shrink-0"
          >
            直前課題のみ表示
          </button>
        </div>
      )}

      {/* Filters, Search & Sort Toolbar */}
      <div className="p-4 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 space-y-3 shadow-sm">
        {/* First line: Status tabs & Search */}
        <div className="flex flex-col md:flex-row gap-3 items-stretch md:items-center justify-between">
          {/* Status Tabs */}
          <div className="flex items-center gap-1.5 p-1 rounded-xl bg-slate-100 dark:bg-slate-800/80 flex-wrap">
            <button
              onClick={() => {
                setStatusFilter('all');
                setOnlyUrgent(false);
              }}
              className={`px-3 py-1.5 text-xs font-semibold rounded-lg transition-all ${
                statusFilter === 'all' && !onlyUrgent
                  ? 'bg-white dark:bg-slate-900 text-slate-900 dark:text-slate-100 shadow-sm'
                  : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-100'
              }`}
            >
              すべて ({stats.total})
            </button>
            <button
              onClick={() => {
                setStatusFilter('pending');
                setOnlyUrgent(false);
              }}
              className={`px-3 py-1.5 text-xs font-semibold rounded-lg transition-all ${
                statusFilter === 'pending' && !onlyUrgent
                  ? 'bg-white dark:bg-slate-900 text-indigo-600 dark:text-indigo-400 shadow-sm'
                  : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-100'
              }`}
            >
              未完了 ({stats.pending})
            </button>
            <button
              onClick={() => {
                setStatusFilter('completed');
                setOnlyUrgent(false);
              }}
              className={`px-3 py-1.5 text-xs font-semibold rounded-lg transition-all ${
                statusFilter === 'completed'
                  ? 'bg-white dark:bg-slate-900 text-emerald-600 dark:text-emerald-400 shadow-sm'
                  : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-100'
              }`}
            >
              完了済み ({stats.completed})
            </button>
            <button
              onClick={() => {
                setOnlyUrgent(!onlyUrgent);
                if (!onlyUrgent) setStatusFilter('pending');
              }}
              className={`px-3 py-1.5 text-xs font-semibold rounded-lg transition-all ${
                onlyUrgent
                  ? 'bg-amber-500 text-white shadow-sm shadow-amber-500/25'
                  : 'text-amber-700 dark:text-amber-400 hover:bg-amber-100 dark:hover:bg-amber-950/40'
              }`}
            >
              ⚠️ 24h以内・要対応のみ
            </button>
          </div>

          {/* Search Bar */}
          <div className="relative flex-1 max-w-md">
            <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="課題名、講義名、メモで検索..."
              className="w-full pl-9 pr-4 py-1.5 text-xs sm:text-sm rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-slate-100 focus:outline-none focus:ring-2 focus:ring-indigo-500"
            />
          </div>
        </div>

        {/* Second line: Filter dropdowns & Sort */}
        <div className="flex flex-wrap items-center gap-2.5 pt-2 border-t border-slate-100 dark:border-slate-800 text-xs">
          <div className="flex items-center gap-1 text-slate-500">
            <Filter className="w-3.5 h-3.5" />
            <span>絞り込み:</span>
          </div>

          {/* Lecture Filter */}
          <select
            value={lectureFilter}
            onChange={(e) => setLectureFilter(e.target.value)}
            className="px-2.5 py-1.5 rounded-lg border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-950 text-slate-800 dark:text-slate-200 focus:outline-none focus:ring-1 focus:ring-indigo-500"
          >
            <option value="all">すべての講義</option>
            {lectures.map((l) => (
              <option key={l.id} value={l.id}>
                {l.name}
              </option>
            ))}
          </select>

          {/* Type Filter */}
          <select
            value={typeFilter}
            onChange={(e) => setTypeFilter(e.target.value)}
            className="px-2.5 py-1.5 rounded-lg border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-950 text-slate-800 dark:text-slate-200 focus:outline-none focus:ring-1 focus:ring-indigo-500"
          >
            <option value="all">すべての種別</option>
            {(Object.keys(ASSIGNMENT_TYPE_LABELS) as AssignmentType[]).map((t) => (
              <option key={t} value={t}>
                {ASSIGNMENT_TYPE_LABELS[t].label}
              </option>
            ))}
          </select>

          {/* Sort Selector */}
          <div className="ml-auto flex items-center gap-1.5">
            <ArrowUpDown className="w-3.5 h-3.5 text-slate-400" />
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value as SortOption)}
              className="px-2.5 py-1.5 rounded-lg border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-950 text-slate-800 dark:text-slate-200 focus:outline-none focus:ring-1 focus:ring-indigo-500 font-medium"
            >
              <option value="due_asc">期日順 (早い順)</option>
              <option value="due_desc">期日順 (遅い順)</option>
              <option value="title_asc">タイトル順</option>
              <option value="type">種別順</option>
            </select>
          </div>
        </div>
      </div>

      {/* Assignment Cards List */}
      <div className="space-y-3">
        {filteredAssignments.length === 0 ? (
          <div className="p-12 text-center rounded-2xl bg-white dark:bg-slate-900 border border-dashed border-slate-300 dark:border-slate-800">
            <div className="w-12 h-12 rounded-2xl bg-slate-100 dark:bg-slate-800 text-slate-400 mx-auto flex items-center justify-center mb-3">
              <Inbox className="w-6 h-6" />
            </div>
            <h4 className="text-sm font-bold text-slate-700 dark:text-slate-300">
              該当する課題はありません
            </h4>
            <p className="text-xs text-slate-400 mt-1 max-w-sm mx-auto">
              フィルタ条件を変更するか、右上の「新しい課題を追加」ボタンから課題を登録してください。
            </p>
            <button
              onClick={() => handleOpenAddModal()}
              className="mt-4 px-4 py-2 text-xs font-semibold rounded-xl bg-indigo-50 text-indigo-600 dark:bg-indigo-950/50 dark:text-indigo-400 hover:bg-indigo-100 transition-colors"
            >
              課題を登録する
            </button>
          </div>
        ) : (
          filteredAssignments.map((item) => (
            <AssignmentCard
              key={item.id}
              assignment={item}
              lecture={lectureMap.get(item.lectureId)}
              onToggleStatus={toggleAssignmentStatus}
              onEdit={handleEdit}
              onDelete={deleteAssignment}
            />
          ))
        )}
      </div>

      {/* Assignment Modal for Create / Edit */}
      <AssignmentModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onSave={handleSaveModal}
        initialData={editingAssignment}
        lectures={lectures}
        defaultLectureId={selectedLectureForNew}
      />
    </div>
  );
};
