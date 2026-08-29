import React, { createContext, useContext, useEffect, useMemo, useState } from 'react';
import { DEFAULT_PERIODS } from '../constants';
import {
  AppSettings,
  Assignment,
  AttendanceRecord,
  DayOfWeek,
  Lecture,
  Timetable,
  TimetableExportData,
} from '../types';
import { loadTimetableData, saveTimetableData } from '../utils/storage';

interface TimetableContextType {
  // 状態
  timetables: Timetable[];
  activeTimetableId: string;
  activeTimetable: Timetable | undefined;
  lectures: Lecture[];
  activeLectures: Lecture[];
  assignments: Assignment[];
  attendanceRecords: AttendanceRecord[];
  settings: AppSettings;

  // 時間割操作
  setActiveTimetableId: (id: string) => void;
  addTimetable: (name: string, academicYear?: string, semester?: Timetable['semester']) => string;
  updateTimetable: (id: string, updates: Partial<Timetable>) => void;
  deleteTimetable: (id: string) => void;

  // 講義操作
  addLecture: (lecture: Omit<Lecture, 'id' | 'timetableId'> & { timetableId?: string }) => string;
  updateLecture: (id: string, updates: Partial<Omit<Lecture, 'id'>>) => void;
  deleteLecture: (id: string) => void;
  getLecture: (day: DayOfWeek, period: number) => Lecture | undefined;
  getLecturesByDay: (day: DayOfWeek) => Lecture[];

  // 設定操作
  updateSettings: (updates: Partial<AppSettings>) => void;
  toggleTheme: () => void;
  setShowWeekends: (show: boolean) => void;
  setMaxPeriods: (max: number) => void;

  // 課題・出欠操作（補助）
  getAttendanceRecord: (lectureId: string) => AttendanceRecord | undefined;
  updateAttendance: (lectureId: string, updates: Partial<AttendanceRecord>) => void;
  getAssignments: (lectureId?: string) => Assignment[];
  addAssignment: (assignment: Omit<Assignment, 'id'>) => string;
  updateAssignment: (id: string, updates: Partial<Assignment>) => void;
  deleteAssignment: (id: string) => void;

  // 全体データ置換（インポート用等）
  importAllData: (data: TimetableExportData) => void;
  getExportData: () => TimetableExportData;
}

const TimetableContext = createContext<TimetableContextType | undefined>(undefined);

export const TimetableProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  // 初期データのロード
  const [data, setData] = useState<TimetableExportData>(() => loadTimetableData());

  const { timetables, lectures, assignments, attendanceRecords, settings } = data;
  const activeTimetableId = settings.activeTimetableId || (timetables[0]?.id ?? '');

  // 変更時にLocalStorageに自動保存
  useEffect(() => {
    saveTimetableData(data);
  }, [data]);

  // テーマ適用 (HTML要素のdarkクラス切り替え)
  useEffect(() => {
    const root = document.documentElement;
    const isDark =
      settings.theme === 'dark' ||
      (settings.theme === 'system' && window.matchMedia('(prefers-color-scheme: dark)').matches);

    if (isDark) {
      root.classList.add('dark');
    } else {
      root.classList.remove('dark');
    }
  }, [settings.theme]);

  // アクティブな時間割
  const activeTimetable = useMemo(() => {
    return timetables.find((t) => t.id === activeTimetableId) || timetables[0];
  }, [timetables, activeTimetableId]);

  // アクティブな時間割に属する講義
  const activeLectures = useMemo(() => {
    if (!activeTimetable) return [];
    return lectures.filter((l) => l.timetableId === activeTimetable.id);
  }, [lectures, activeTimetable]);

  // ==========================
  // 時間割操作
  // ==========================
  const setActiveTimetableId = (id: string) => {
    setData((prev) => ({
      ...prev,
      settings: {
        ...prev.settings,
        activeTimetableId: id,
      },
    }));
  };

  const addTimetable = (
    name: string,
    academicYear: string = '2026',
    semester: Timetable['semester'] = 'spring'
  ): string => {
    const newId = `timetable-${Date.now()}`;
    const now = new Date().toISOString();

    const newTimetable: Timetable = {
      id: newId,
      name,
      academicYear,
      semester,
      days: settings.showWeekends
        ? ['mon', 'tue', 'wed', 'thu', 'fri', 'sat', 'sun']
        : ['mon', 'tue', 'wed', 'thu', 'fri'],
      periods: DEFAULT_PERIODS.slice(0, settings.maxPeriods),
      isDefault: false,
      createdAt: now,
      updatedAt: now,
    };

    setData((prev) => ({
      ...prev,
      timetables: [...prev.timetables, newTimetable],
      settings: {
        ...prev.settings,
        activeTimetableId: newId,
      },
    }));

    return newId;
  };

  const updateTimetable = (id: string, updates: Partial<Timetable>) => {
    const now = new Date().toISOString();
    setData((prev) => ({
      ...prev,
      timetables: prev.timetables.map((t) => (t.id === id ? { ...t, ...updates, updatedAt: now } : t)),
    }));
  };

  const deleteTimetable = (id: string) => {
    setData((prev) => {
      if (prev.timetables.length <= 1) {
        alert('最後の時間割は削除できません。');
        return prev;
      }
      const newTimetables = prev.timetables.filter((t) => t.id !== id);
      const newActiveId = prev.settings.activeTimetableId === id ? newTimetables[0].id : prev.settings.activeTimetableId;
      // 紐づく講義・課題・出欠も削除
      const targetLectureIds = new Set(prev.lectures.filter((l) => l.timetableId === id).map((l) => l.id));

      return {
        ...prev,
        timetables: newTimetables,
        lectures: prev.lectures.filter((l) => l.timetableId !== id),
        assignments: prev.assignments.filter((a) => !targetLectureIds.has(a.lectureId)),
        attendanceRecords: prev.attendanceRecords.filter((att) => !targetLectureIds.has(att.lectureId)),
        settings: {
          ...prev.settings,
          activeTimetableId: newActiveId,
        },
      };
    });
  };

  // ==========================
  // 講義操作
  // ==========================
  const addLecture = (lectureData: Omit<Lecture, 'id' | 'timetableId'> & { timetableId?: string }): string => {
    const lectureId = `lec-${Date.now()}-${Math.random().toString(36).slice(2, 7)}`;
    const targetTimetableId = lectureData.timetableId || activeTimetableId;

    const newLecture: Lecture = {
      ...lectureData,
      id: lectureId,
      timetableId: targetTimetableId,
    };

    // 初期出欠レコードも作成
    const initialAttendance: AttendanceRecord = {
      lectureId,
      present: 0,
      absent: 0,
      late: 0,
      cancelled: 0,
      makeup: 0,
      maxAllowedAbsent: 4,
      totalSessions: 15,
    };

    setData((prev) => ({
      ...prev,
      lectures: [...prev.lectures, newLecture],
      attendanceRecords: [...prev.attendanceRecords, initialAttendance],
    }));

    return lectureId;
  };

  const updateLecture = (id: string, updates: Partial<Omit<Lecture, 'id'>>) => {
    setData((prev) => ({
      ...prev,
      lectures: prev.lectures.map((l) => (l.id === id ? { ...l, ...updates } : l)),
    }));
  };

  const deleteLecture = (id: string) => {
    setData((prev) => ({
      ...prev,
      lectures: prev.lectures.filter((l) => l.id !== id),
      assignments: prev.assignments.filter((a) => a.lectureId !== id),
      attendanceRecords: prev.attendanceRecords.filter((att) => att.lectureId !== id),
    }));
  };

  const getLecture = (day: DayOfWeek, period: number): Lecture | undefined => {
    return activeLectures.find((l) => l.dayOfWeek === day && l.period === period);
  };

  const getLecturesByDay = (day: DayOfWeek): Lecture[] => {
    return activeLectures
      .filter((l) => l.dayOfWeek === day)
      .sort((a, b) => a.period - b.period);
  };

  // ==========================
  // 設定操作
  // ==========================
  const updateSettings = (updates: Partial<AppSettings>) => {
    setData((prev) => ({
      ...prev,
      settings: {
        ...prev.settings,
        ...updates,
      },
    }));
  };

  const toggleTheme = () => {
    const currentTheme = settings.theme;
    let nextTheme: AppSettings['theme'] = 'dark';
    if (currentTheme === 'dark') {
      nextTheme = 'light';
    } else {
      nextTheme = 'dark';
    }
    updateSettings({ theme: nextTheme });
  };

  const setShowWeekends = (show: boolean) => {
    updateSettings({ showWeekends: show });
  };

  const setMaxPeriods = (max: number) => {
    updateSettings({ maxPeriods: max });
  };

  // ==========================
  // 出欠・課題操作
  // ==========================
  const getAttendanceRecord = (lectureId: string): AttendanceRecord | undefined => {
    return attendanceRecords.find((a) => a.lectureId === lectureId);
  };

  const updateAttendance = (lectureId: string, updates: Partial<AttendanceRecord>) => {
    setData((prev) => {
      const exists = prev.attendanceRecords.some((a) => a.lectureId === lectureId);
      if (exists) {
        return {
          ...prev,
          attendanceRecords: prev.attendanceRecords.map((a) =>
            a.lectureId === lectureId ? { ...a, ...updates } : a
          ),
        };
      } else {
        const newRecord: AttendanceRecord = {
          lectureId,
          present: 0,
          absent: 0,
          late: 0,
          cancelled: 0,
          makeup: 0,
          maxAllowedAbsent: 4,
          totalSessions: 15,
          ...updates,
        };
        return {
          ...prev,
          attendanceRecords: [...prev.attendanceRecords, newRecord],
        };
      }
    });
  };

  const getAssignments = (lectureId?: string): Assignment[] => {
    if (!lectureId) return assignments;
    return assignments.filter((a) => a.lectureId === lectureId);
  };

  const addAssignment = (assignmentData: Omit<Assignment, 'id'>): string => {
    const newId = `asg-${Date.now()}-${Math.random().toString(36).slice(2, 7)}`;
    const newAssignment: Assignment = {
      ...assignmentData,
      id: newId,
    };
    setData((prev) => ({
      ...prev,
      assignments: [...prev.assignments, newAssignment],
    }));
    return newId;
  };

  const updateAssignment = (id: string, updates: Partial<Assignment>) => {
    setData((prev) => ({
      ...prev,
      assignments: prev.assignments.map((a) => (a.id === id ? { ...a, ...updates } : a)),
    }));
  };

  const deleteAssignment = (id: string) => {
    setData((prev) => ({
      ...prev,
      assignments: prev.assignments.filter((a) => a.id !== id),
    }));
  };

  const importAllData = (newData: TimetableExportData) => {
    setData(newData);
  };

  const getExportData = (): TimetableExportData => {
    return {
      ...data,
      exportedAt: new Date().toISOString(),
    };
  };

  return (
    <TimetableContext.Provider
      value={{
        timetables,
        activeTimetableId,
        activeTimetable,
        lectures,
        activeLectures,
        assignments,
        attendanceRecords,
        settings,
        setActiveTimetableId,
        addTimetable,
        updateTimetable,
        deleteTimetable,
        addLecture,
        updateLecture,
        deleteLecture,
        getLecture,
        getLecturesByDay,
        updateSettings,
        toggleTheme,
        setShowWeekends,
        setMaxPeriods,
        getAttendanceRecord,
        updateAttendance,
        getAssignments,
        addAssignment,
        updateAssignment,
        deleteAssignment,
        importAllData,
        getExportData,
      }}
    >
      {children}
    </TimetableContext.Provider>
  );
};

export const useTimetable = (): TimetableContextType => {
  const context = useContext(TimetableContext);
  if (!context) {
    throw new Error('useTimetable must be used within a TimetableProvider');
  }
  return context;
};
