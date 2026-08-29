import { useState, useEffect, useCallback, useMemo } from 'react';
import { Assignment, AssignmentStatus } from '../types';
import { loadAssignments, saveAssignments } from '../utils/storage';
import { getDueUrgency } from '../utils/date';

export interface CreateAssignmentInput {
  lectureId: string;
  title: string;
  dueDate: string;
  type: Assignment['type'];
  status?: AssignmentStatus;
  memo?: string;
}

export interface UseAssignmentsReturn {
  assignments: Assignment[];
  urgentAssignments: Assignment[];
  overdueAssignments: Assignment[];
  pendingAssignments: Assignment[];
  completedAssignments: Assignment[];
  stats: {
    total: number;
    pending: number;
    completed: number;
    urgent: number;
    overdue: number;
  };
  addAssignment: (input: CreateAssignmentInput) => Assignment;
  updateAssignment: (id: string, updates: Partial<Assignment>) => void;
  deleteAssignment: (id: string) => void;
  toggleAssignmentStatus: (id: string) => void;
  getAssignmentsByLecture: (lectureId: string) => Assignment[];
  refreshAssignments: () => void;
}

export function useAssignments(): UseAssignmentsReturn {
  const [assignments, setAssignments] = useState<Assignment[]>(() => loadAssignments());

  // Save to LocalStorage whenever assignments change
  const setAndSaveAssignments = useCallback((newAssignmentsOrUpdater: Assignment[] | ((prev: Assignment[]) => Assignment[])) => {
    setAssignments((prev) => {
      const next = typeof newAssignmentsOrUpdater === 'function' ? newAssignmentsOrUpdater(prev) : newAssignmentsOrUpdater;
      saveAssignments(next);
      return next;
    });
  }, []);

  const refreshAssignments = useCallback(() => {
    setAssignments(loadAssignments());
  }, []);

  // Listen to window storage events or custom updates across components
  useEffect(() => {
    const handleStorage = (e: StorageEvent) => {
      if (e.key === 'timetable_data_assignments_v1') {
        refreshAssignments();
      }
    };
    window.addEventListener('storage', handleStorage);
    return () => window.removeEventListener('storage', handleStorage);
  }, [refreshAssignments]);

  const addAssignment = useCallback((input: CreateAssignmentInput): Assignment => {
    const newAssignment: Assignment = {
      id: `assign-${Date.now()}-${Math.random().toString(36).substring(2, 7)}`,
      lectureId: input.lectureId,
      title: input.title.trim(),
      dueDate: input.dueDate,
      type: input.type || 'homework',
      status: input.status || 'pending',
      memo: input.memo?.trim() || undefined,
      completedAt: input.status === 'completed' ? new Date().toISOString() : undefined,
    };

    setAndSaveAssignments((prev) => [newAssignment, ...prev]);
    return newAssignment;
  }, [setAndSaveAssignments]);

  const updateAssignment = useCallback((id: string, updates: Partial<Assignment>) => {
    setAndSaveAssignments((prev) =>
      prev.map((item) => {
        if (item.id !== id) return item;

        const updated = { ...item, ...updates };
        if (updates.status === 'completed' && !updated.completedAt) {
          updated.completedAt = new Date().toISOString();
        } else if (updates.status === 'pending') {
          updated.completedAt = undefined;
        }
        return updated;
      })
    );
  }, [setAndSaveAssignments]);

  const deleteAssignment = useCallback((id: string) => {
    setAndSaveAssignments((prev) => prev.filter((item) => item.id !== id));
  }, [setAndSaveAssignments]);

  const toggleAssignmentStatus = useCallback((id: string) => {
    setAndSaveAssignments((prev) =>
      prev.map((item) => {
        if (item.id !== id) return item;
        const nextStatus: AssignmentStatus = item.status === 'completed' ? 'pending' : 'completed';
        return {
          ...item,
          status: nextStatus,
          completedAt: nextStatus === 'completed' ? new Date().toISOString() : undefined,
        };
      })
    );
  }, [setAndSaveAssignments]);

  const getAssignmentsByLecture = useCallback(
    (lectureId: string) => assignments.filter((item) => item.lectureId === lectureId),
    [assignments]
  );

  const pendingAssignments = useMemo(
    () => assignments.filter((item) => item.status === 'pending'),
    [assignments]
  );

  const completedAssignments = useMemo(
    () => assignments.filter((item) => item.status === 'completed'),
    [assignments]
  );

  const urgentAssignments = useMemo(
    () => assignments.filter((item) => item.status === 'pending' && getDueUrgency(item.dueDate, item.status) === 'urgent'),
    [assignments]
  );

  const overdueAssignments = useMemo(
    () => assignments.filter((item) => item.status === 'pending' && getDueUrgency(item.dueDate, item.status) === 'overdue'),
    [assignments]
  );

  const stats = useMemo(() => {
    return {
      total: assignments.length,
      pending: pendingAssignments.length,
      completed: completedAssignments.length,
      urgent: urgentAssignments.length,
      overdue: overdueAssignments.length,
    };
  }, [assignments.length, pendingAssignments.length, completedAssignments.length, urgentAssignments.length, overdueAssignments.length]);

  return {
    assignments,
    urgentAssignments,
    overdueAssignments,
    pendingAssignments,
    completedAssignments,
    stats,
    addAssignment,
    updateAssignment,
    deleteAssignment,
    toggleAssignmentStatus,
    getAssignmentsByLecture,
    refreshAssignments,
  };
}
