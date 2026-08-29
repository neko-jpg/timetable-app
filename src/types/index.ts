export type DayOfWeek = 'mon' | 'tue' | 'wed' | 'thu' | 'fri' | 'sat' | 'sun';

export interface DayInfo {
  key: DayOfWeek;
  label: string;      // "月", "火", "水", etc.
  fullLabel: string;  // "月曜日", "火曜日", etc.
  isWeekend: boolean;
}

export interface PeriodConfig {
  period: number;      // 1, 2, 3, 4, 5, 6, 7
  startTime: string;   // "09:00"
  endTime: string;     // "10:30"
}

export interface Timetable {
  id: string;
  name: string;        // 例: "2026年度 前期"
  academicYear?: string;
  semester?: 'spring' | 'fall' | 'full' | 'other';
  days: DayOfWeek[];   // ['mon', 'tue', 'wed', 'thu', 'fri'] (土日含む構成も可)
  periods: PeriodConfig[];
  isDefault: boolean;
  createdAt: string;
  updatedAt: string;
}

export type LectureColor = 
  | 'indigo'
  | 'blue'
  | 'sky'
  | 'emerald'
  | 'amber'
  | 'orange'
  | 'rose'
  | 'purple'
  | 'violet'
  | 'slate';

export interface Lecture {
  id: string;
  timetableId: string;
  dayOfWeek: DayOfWeek;
  period: number;       // 1〜7
  name: string;
  room?: string;
  instructor?: string;
  credits?: number;
  color: LectureColor;
  memo?: string;
  onlineUrl?: string;
  syllabusUrl?: string;
}

export type AssignmentType = 'report' | 'quiz' | 'exam' | 'presentation' | 'homework' | 'other';
export type AssignmentStatus = 'pending' | 'completed';

export interface Assignment {
  id: string;
  lectureId: string;
  title: string;
  dueDate: string;      // YYYY-MM-DDTHH:mm
  type: AssignmentType;
  status: AssignmentStatus;
  completedAt?: string;
  memo?: string;
}

export interface AttendanceRecord {
  lectureId: string;
  present: number;        // 出席回数
  absent: number;         // 欠席回数
  late: number;           // 遅刻回数
  cancelled: number;      // 休講回数
  makeup: number;         // 補講回数
  maxAllowedAbsent?: number; // 欠席上限（デフォルト例: 4回）
  totalSessions?: number;    // 全授業回数（デフォルト例: 15回）
}

export type ThemeMode = 'light' | 'dark' | 'system';

export interface AppSettings {
  theme: ThemeMode;
  showWeekends: boolean;
  maxPeriods: number;
  defaultAlertThreshold: number; // 欠席何回で警告を出すか（例: 3）
  activeTimetableId: string;
}

export interface TimetableExportData {
  version: string;
  exportedAt: string;
  timetables: Timetable[];
  lectures: Lecture[];
  assignments: Assignment[];
  attendanceRecords: AttendanceRecord[];
  settings: AppSettings;
}
