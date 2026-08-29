import { CURRENT_STORAGE_VERSION, DEFAULT_PERIODS, STORAGE_KEY } from '../constants';
import { AppSettings, Assignment, AttendanceRecord, Lecture, Timetable, TimetableExportData } from '../types';

export function getInitialSampleData(): TimetableExportData {
  const timetableId = 'timetable-2026-spring';
  const now = new Date().toISOString();

  const defaultTimetable: Timetable = {
    id: timetableId,
    name: '2026年度 前期',
    academicYear: '2026',
    semester: 'spring',
    days: ['mon', 'tue', 'wed', 'thu', 'fri'],
    periods: DEFAULT_PERIODS.slice(0, 5),
    isDefault: true,
    createdAt: now,
    updatedAt: now,
  };

  const sampleLectures: Lecture[] = [
    {
      id: 'lec-1',
      timetableId,
      dayOfWeek: 'mon',
      period: 2,
      name: 'アルゴリズムとデータ構造',
      room: '情報科学棟 301講義室',
      instructor: '佐藤 健一 教授',
      credits: 2,
      color: 'indigo',
      memo: '隔週で小テストあり。指定教科書を持参すること。',
      syllabusUrl: 'https://example.edu/syllabus/cs201',
    },
    {
      id: 'lec-2',
      timetableId,
      dayOfWeek: 'tue',
      period: 1,
      name: '線形代数学 II',
      room: '1号館 105講義室',
      instructor: '鈴木 美穂 准教授',
      credits: 2,
      color: 'blue',
      memo: '第1回〜第7回は行列の対角化と固有値問題。',
    },
    {
      id: 'lec-3',
      timetableId,
      dayOfWeek: 'wed',
      period: 3,
      name: 'Webプログラミング演習',
      room: '情報実習室 A',
      instructor: '高橋 涼 講師',
      credits: 2,
      color: 'emerald',
      memo: 'React / TypeScript を用いた実践的なフロントエンド開発。',
      onlineUrl: 'https://zoom.us/j/example-web-lab',
    },
    {
      id: 'lec-4',
      timetableId,
      dayOfWeek: 'thu',
      period: 2,
      name: '英語コミュニケーション IV',
      room: '外国語棟 204教室',
      instructor: 'David Smith 講師',
      credits: 1,
      color: 'amber',
      memo: 'Presentation in week 10. Active participation required.',
    },
    {
      id: 'lec-5',
      timetableId,
      dayOfWeek: 'fri',
      period: 4,
      name: 'データベース工学',
      room: '2号館 402大講義室',
      instructor: '伊藤 直樹 教授',
      credits: 2,
      color: 'purple',
      memo: 'SQL実践と正規化理論、トランザクション分離レベル。',
    },
  ];

  const sampleAssignments: Assignment[] = [
    {
      id: 'asg-1',
      lectureId: 'lec-1',
      title: '二分探索木の平衡化アルゴリズムレポート',
      dueDate: new Date(Date.now() + 3 * 24 * 60 * 60 * 1000).toISOString().slice(0, 16),
      type: 'report',
      status: 'pending',
      memo: 'ソースコードと実行結果グラフを添付すること',
    },
    {
      id: 'asg-2',
      lectureId: 'lec-3',
      title: '第3回 SPAコンポーネント課題提出',
      dueDate: new Date(Date.now() + 6 * 24 * 60 * 60 * 1000).toISOString().slice(0, 16),
      type: 'homework',
      status: 'pending',
      memo: 'GitHubリポジトリのURLを提出',
    },
  ];

  const sampleAttendance: AttendanceRecord[] = [
    { lectureId: 'lec-1', present: 3, absent: 0, late: 0, cancelled: 0, makeup: 0, maxAllowedAbsent: 4, totalSessions: 15 },
    { lectureId: 'lec-2', present: 2, absent: 1, late: 0, cancelled: 0, makeup: 0, maxAllowedAbsent: 4, totalSessions: 15 },
    { lectureId: 'lec-3', present: 3, absent: 0, late: 0, cancelled: 0, makeup: 0, maxAllowedAbsent: 4, totalSessions: 15 },
    { lectureId: 'lec-4', present: 2, absent: 0, late: 1, cancelled: 0, makeup: 0, maxAllowedAbsent: 3, totalSessions: 15 },
    { lectureId: 'lec-5', present: 3, absent: 0, late: 0, cancelled: 0, makeup: 0, maxAllowedAbsent: 4, totalSessions: 15 },
  ];

  const defaultSettings: AppSettings = {
    theme: 'light',
    showWeekends: false,
    maxPeriods: 5,
    defaultAlertThreshold: 3,
    activeTimetableId: timetableId,
  };

  return {
    version: CURRENT_STORAGE_VERSION,
    exportedAt: now,
    timetables: [defaultTimetable],
    lectures: sampleLectures,
    assignments: sampleAssignments,
    attendanceRecords: sampleAttendance,
    settings: defaultSettings,
  };
}

export function loadTimetableData(): TimetableExportData {
  if (typeof window === 'undefined') {
    return getInitialSampleData();
  }

  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) {
      const initialData = getInitialSampleData();
      saveTimetableData(initialData);
      return initialData;
    }

    const parsed = JSON.parse(raw) as Partial<TimetableExportData>;

    // 整合性チェックとフォールバック
    if (!parsed.timetables || !Array.isArray(parsed.timetables) || parsed.timetables.length === 0) {
      const initialData = getInitialSampleData();
      saveTimetableData(initialData);
      return initialData;
    }

    const fallback = getInitialSampleData();

    return {
      version: parsed.version || CURRENT_STORAGE_VERSION,
      exportedAt: parsed.exportedAt || new Date().toISOString(),
      timetables: parsed.timetables,
      lectures: parsed.lectures || [],
      assignments: parsed.assignments || [],
      attendanceRecords: parsed.attendanceRecords || [],
      settings: {
        ...fallback.settings,
        ...(parsed.settings || {}),
        activeTimetableId: parsed.settings?.activeTimetableId || parsed.timetables[0].id,
      },
    };
  } catch (err) {
    console.error('Failed to load timetable data from localStorage:', err);
    const initialData = getInitialSampleData();
    saveTimetableData(initialData);
    return initialData;
  }
}

export function saveTimetableData(data: TimetableExportData): void {
  if (typeof window === 'undefined') return;
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
  } catch (err) {
    console.error('Failed to save timetable data to localStorage:', err);
  }
}

export function clearTimetableData(): void {
  if (typeof window === 'undefined') return;
  try {
    localStorage.removeItem(STORAGE_KEY);
  } catch (err) {
    console.error('Failed to clear timetable data from localStorage:', err);
  }
}
