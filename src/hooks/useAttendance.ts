import { useState, useEffect, useCallback, useMemo } from 'react';
import { AttendanceRecord } from '../types';
import { loadAttendance, saveAttendance } from '../utils/storage';

export type AttendanceField = 'present' | 'absent' | 'late' | 'cancelled' | 'makeup';

export type RiskLevel = 'safe' | 'warning' | 'danger';

export interface AttendanceRiskInfo {
  status: RiskLevel;
  absent: number;
  maxAllowed: number;
  remaining: number;
  totalSessions: number;
  attendedSessions: number;
  attendanceRate: number;
  isAtRisk: boolean;
  message: string;
}

export interface UseAttendanceReturn {
  records: Record<string, AttendanceRecord>;
  getAttendance: (lectureId: string) => AttendanceRecord;
  incrementCount: (lectureId: string, field: AttendanceField) => void;
  decrementCount: (lectureId: string, field: AttendanceField) => void;
  updateAttendance: (lectureId: string, updates: Partial<AttendanceRecord>) => void;
  resetAttendance: (lectureId: string) => void;
  getAttendanceRisk: (lectureId: string, customThreshold?: number) => AttendanceRiskInfo;
  stats: {
    totalLectures: number;
    dangerCount: number;
    warningCount: number;
    safeCount: number;
    averageAttendanceRate: number;
  };
  refreshAttendance: () => void;
}

const DEFAULT_RECORD: Omit<AttendanceRecord, 'lectureId'> = {
  present: 0,
  absent: 0,
  late: 0,
  cancelled: 0,
  makeup: 0,
  maxAllowedAbsent: 4,
  totalSessions: 15,
};

export function useAttendance(): UseAttendanceReturn {
  const [records, setRecords] = useState<Record<string, AttendanceRecord>>(() => loadAttendance());

  const setAndSaveRecords = useCallback(
    (newRecordsOrUpdater: Record<string, AttendanceRecord> | ((prev: Record<string, AttendanceRecord>) => Record<string, AttendanceRecord>)) => {
      setRecords((prev) => {
        const next = typeof newRecordsOrUpdater === 'function' ? newRecordsOrUpdater(prev) : newRecordsOrUpdater;
        saveAttendance(next);
        return next;
      });
    },
    []
  );

  const refreshAttendance = useCallback(() => {
    setRecords(loadAttendance());
  }, []);

  useEffect(() => {
    const handleStorage = (e: StorageEvent) => {
      if (e.key === 'timetable_data_attendance_v1') {
        refreshAttendance();
      }
    };
    window.addEventListener('storage', handleStorage);
    return () => window.removeEventListener('storage', handleStorage);
  }, [refreshAttendance]);

  const getAttendance = useCallback(
    (lectureId: string): AttendanceRecord => {
      return (
        records[lectureId] || {
          lectureId,
          ...DEFAULT_RECORD,
        }
      );
    },
    [records]
  );

  const updateAttendance = useCallback(
    (lectureId: string, updates: Partial<AttendanceRecord>) => {
      setAndSaveRecords((prev) => {
        const current = prev[lectureId] || {
          lectureId,
          ...DEFAULT_RECORD,
        };
        return {
          ...prev,
          [lectureId]: {
            ...current,
            ...updates,
          },
        };
      });
    },
    [setAndSaveRecords]
  );

  const incrementCount = useCallback(
    (lectureId: string, field: AttendanceField) => {
      setAndSaveRecords((prev) => {
        const current = prev[lectureId] || {
          lectureId,
          ...DEFAULT_RECORD,
        };
        return {
          ...prev,
          [lectureId]: {
            ...current,
            [field]: (current[field] || 0) + 1,
          },
        };
      });
    },
    [setAndSaveRecords]
  );

  const decrementCount = useCallback(
    (lectureId: string, field: AttendanceField) => {
      setAndSaveRecords((prev) => {
        const current = prev[lectureId] || {
          lectureId,
          ...DEFAULT_RECORD,
        };
        const currentValue = current[field] || 0;
        if (currentValue <= 0) return prev; // Cannot be negative

        return {
          ...prev,
          [lectureId]: {
            ...current,
            [field]: currentValue - 1,
          },
        };
      });
    },
    [setAndSaveRecords]
  );

  const resetAttendance = useCallback(
    (lectureId: string) => {
      setAndSaveRecords((prev) => {
        const current = prev[lectureId] || {
          lectureId,
          ...DEFAULT_RECORD,
        };
        return {
          ...prev,
          [lectureId]: {
            ...current,
            present: 0,
            absent: 0,
            late: 0,
            cancelled: 0,
            makeup: 0,
          },
        };
      });
    },
    [setAndSaveRecords]
  );

  const getAttendanceRisk = useCallback(
    (lectureId: string, customThreshold?: number): AttendanceRiskInfo => {
      const record = getAttendance(lectureId);
      const absent = record.absent || 0;
      const maxAllowed = record.maxAllowedAbsent ?? 4;
      const warningThreshold = customThreshold ?? Math.max(1, maxAllowed - 1);
      const remaining = Math.max(0, maxAllowed - absent);
      const totalSessions = record.totalSessions ?? 15;
      const attendedSessions = (record.present || 0) + (record.makeup || 0);

      // Attendance rate calculation (percentage of attended over total held sessions or total expected sessions)
      const recordedSessions = (record.present || 0) + absent + (record.late || 0) + (record.makeup || 0);
      const attendanceRate = recordedSessions > 0
        ? Math.round(((record.present + (record.late * 0.5) + (record.makeup || 0)) / recordedSessions) * 100)
        : 100;

      let status: RiskLevel = 'safe';
      let message = `出席良好 (欠席${absent}回 / 上限${maxAllowed}回)`;

      if (absent >= maxAllowed) {
        status = 'danger';
        message = `単位危険！ 欠席${absent}回 (上限${maxAllowed}回に達しました)`;
      } else if (absent >= warningThreshold) {
        status = 'warning';
        message = `欠席注意！ 欠席${absent}回 (残りあと${remaining}回で上限)`;
      }

      return {
        status,
        absent,
        maxAllowed,
        remaining,
        totalSessions,
        attendedSessions,
        attendanceRate: Math.min(100, Math.max(0, attendanceRate)),
        isAtRisk: status === 'danger' || status === 'warning',
        message,
      };
    },
    [getAttendance]
  );

  const stats = useMemo(() => {
    const lectureIds = Object.keys(records);
    let dangerCount = 0;
    let warningCount = 0;
    let safeCount = 0;
    let totalRate = 0;

    for (const id of lectureIds) {
      const risk = getAttendanceRisk(id);
      if (risk.status === 'danger') dangerCount++;
      else if (risk.status === 'warning') warningCount++;
      else safeCount++;
      totalRate += risk.attendanceRate;
    }

    const totalLectures = lectureIds.length;
    const averageAttendanceRate = totalLectures > 0 ? Math.round(totalRate / totalLectures) : 100;

    return {
      totalLectures,
      dangerCount,
      warningCount,
      safeCount,
      averageAttendanceRate,
    };
  }, [records, getAttendanceRisk]);

  return {
    records,
    getAttendance,
    incrementCount,
    decrementCount,
    updateAttendance,
    resetAttendance,
    getAttendanceRisk,
    stats,
    refreshAttendance,
  };
}
