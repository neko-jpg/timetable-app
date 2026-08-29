import { Lecture, Assignment, AttendanceRecord, Timetable, AppSettings } from '../types';
import { SAMPLE_TIMETABLE, SAMPLE_LECTURES, SAMPLE_ASSIGNMENTS, SAMPLE_ATTENDANCE, SAMPLE_SETTINGS } from './sampleData';

const KEYS = {
  TIMETABLES: 'timetable_data_timetables_v1',
  LECTURES: 'timetable_data_lectures_v1',
  ASSIGNMENTS: 'timetable_data_assignments_v1',
  ATTENDANCE: 'timetable_data_attendance_v1',
  SETTINGS: 'timetable_data_settings_v1',
};

function safeGetItem<T>(key: string, defaultValue: T): T {
  if (typeof window === 'undefined') return defaultValue;
  try {
    const raw = localStorage.getItem(key);
    if (!raw) return defaultValue;
    return JSON.parse(raw) as T;
  } catch (err) {
    console.error(`Error loading ${key} from localStorage:`, err);
    return defaultValue;
  }
}

function safeSetItem<T>(key: string, value: T): void {
  if (typeof window === 'undefined') return;
  try {
    localStorage.setItem(key, JSON.stringify(value));
  } catch (err) {
    console.error(`Error saving ${key} to localStorage:`, err);
  }
}

// Assignments Storage
export function loadAssignments(): Assignment[] {
  const existing = safeGetItem<Assignment[] | null>(KEYS.ASSIGNMENTS, null);
  if (!existing || existing.length === 0) {
    saveAssignments(SAMPLE_ASSIGNMENTS);
    return SAMPLE_ASSIGNMENTS;
  }
  return existing;
}

export function saveAssignments(assignments: Assignment[]): void {
  safeSetItem(KEYS.ASSIGNMENTS, assignments);
}

// Attendance Storage
export function loadAttendance(): Record<string, AttendanceRecord> {
  const existing = safeGetItem<Record<string, AttendanceRecord> | null>(KEYS.ATTENDANCE, null);
  if (!existing || Object.keys(existing).length === 0) {
    const initialMap: Record<string, AttendanceRecord> = {};
    for (const record of SAMPLE_ATTENDANCE) {
      initialMap[record.lectureId] = record;
    }
    saveAttendance(initialMap);
    return initialMap;
  }
  return existing;
}

export function saveAttendance(records: Record<string, AttendanceRecord>): void {
  safeSetItem(KEYS.ATTENDANCE, records);
}

// Lectures Storage
export function loadLectures(): Lecture[] {
  const existing = safeGetItem<Lecture[] | null>(KEYS.LECTURES, null);
  if (!existing || existing.length === 0) {
    saveLectures(SAMPLE_LECTURES);
    return SAMPLE_LECTURES;
  }
  return existing;
}

export function saveLectures(lectures: Lecture[]): void {
  safeSetItem(KEYS.LECTURES, lectures);
}

// Timetables Storage
export function loadTimetables(): Timetable[] {
  const existing = safeGetItem<Timetable[] | null>(KEYS.TIMETABLES, null);
  if (!existing || existing.length === 0) {
    saveTimetables([SAMPLE_TIMETABLE]);
    return [SAMPLE_TIMETABLE];
  }
  return existing;
}

export function saveTimetables(timetables: Timetable[]): void {
  safeSetItem(KEYS.TIMETABLES, timetables);
}

// Settings Storage
export function loadSettings(): AppSettings {
  return safeGetItem<AppSettings>(KEYS.SETTINGS, SAMPLE_SETTINGS);
}

export function saveSettings(settings: AppSettings): void {
  safeSetItem(KEYS.SETTINGS, settings);
}

// Reset all storage to sample data
export function resetAllStorage(): void {
  saveTimetables([SAMPLE_TIMETABLE]);
  saveLectures(SAMPLE_LECTURES);
  saveAssignments(SAMPLE_ASSIGNMENTS);
  const initialMap: Record<string, AttendanceRecord> = {};
  for (const record of SAMPLE_ATTENDANCE) {
    initialMap[record.lectureId] = record;
  }
  saveAttendance(initialMap);
  saveSettings(SAMPLE_SETTINGS);
}
