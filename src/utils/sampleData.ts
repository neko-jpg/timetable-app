import { Timetable, Lecture, Assignment, AttendanceRecord, AppSettings } from '../types';

export const SAMPLE_TIMETABLE: Timetable = {
  id: 'timetable-2026-spring',
  name: '2026年度 前期',
  academicYear: '2026',
  semester: 'spring',
  days: ['mon', 'tue', 'wed', 'thu', 'fri'],
  periods: [
    { period: 1, startTime: '09:00', endTime: '10:30' },
    { period: 2, startTime: '10:45', endTime: '12:15' },
    { period: 3, startTime: '13:00', endTime: '14:30' },
    { period: 4, startTime: '14:45', endTime: '16:15' },
    { period: 5, startTime: '16:30', endTime: '18:00' },
  ],
  isDefault: true,
  createdAt: new Date().toISOString(),
  updatedAt: new Date().toISOString(),
};

export const SAMPLE_LECTURES: Lecture[] = [
  {
    id: 'lec-1',
    timetableId: 'timetable-2026-spring',
    dayOfWeek: 'mon',
    period: 1,
    name: '線形代数学I',
    room: '理系講義棟301',
    instructor: '田中 宏 教授',
    credits: 2,
    color: 'indigo',
    memo: '教科書:『線形代数入門』。毎回出席確認あり。中間試験あり。',
  },
  {
    id: 'lec-2',
    timetableId: 'timetable-2026-spring',
    dayOfWeek: 'mon',
    period: 3,
    name: 'プログラミング演習',
    room: '情報基盤センター 演習室A',
    instructor: '佐藤 健太 准教授',
    credits: 2,
    color: 'emerald',
    memo: 'GitHubを用いたチーム開発演習。毎週月曜23:59までにコード提出。',
  },
  {
    id: 'lec-3',
    timetableId: 'timetable-2026-spring',
    dayOfWeek: 'tue',
    period: 2,
    name: '英語コミュニケーションII',
    room: '言語文化棟204',
    instructor: 'Michael Smith 先生',
    credits: 1,
    color: 'sky',
    memo: 'グループディスカッション中心。欠席4回で不可。',
  },
  {
    id: 'lec-4',
    timetableId: 'timetable-2026-spring',
    dayOfWeek: 'wed',
    period: 2,
    name: 'データ構造とアルゴリズム',
    room: '大講義室1',
    instructor: '山本 修 教授',
    credits: 2,
    color: 'purple',
    memo: '木構造・グラフ探索・動的計画法。小テスト3回実施。',
  },
  {
    id: 'lec-5',
    timetableId: 'timetable-2026-spring',
    dayOfWeek: 'thu',
    period: 4,
    name: '統計学基礎',
    room: '2号館202教室',
    instructor: '鈴木 雅代 講師',
    credits: 2,
    color: 'amber',
    memo: '電卓持参必須。期末レポート重視。',
  },
  {
    id: 'lec-6',
    timetableId: 'timetable-2026-spring',
    dayOfWeek: 'fri',
    period: 3,
    name: 'Webシステムアーキテクチャ',
    room: '情報演習室B',
    instructor: '高橋 雄一 准教授',
    credits: 2,
    color: 'rose',
    memo: 'SPA + REST API + クラウドインフラ構築の演習。',
  },
];

// Helper to get dates relative to now for dynamic sample deadlines
const now = new Date();
const getFutureDate = (hoursFromNow: number) => {
  const d = new Date(now.getTime() + hoursFromNow * 60 * 60 * 1000);
  const y = d.getFullYear();
  const m = String(d.getMonth() + 1).padStart(2, '0');
  const day = String(d.getDate()).padStart(2, '0');
  const h = String(d.getHours()).padStart(2, '0');
  const min = '00';
  return `${y}-${m}-${day}T${h}:${min}`;
};

export const SAMPLE_ASSIGNMENTS: Assignment[] = [
  {
    id: 'assign-1',
    lectureId: 'lec-2', // プログラミング演習
    title: '第4回演習課題: Reactカスタムフックの実装とテスト',
    dueDate: getFutureDate(14), // 14時間後 -> 24時間以内（緊急ハイライト対象）
    type: 'homework',
    status: 'pending',
    memo: 'useAssignmentsとuseAttendanceの単体テストコードを添付すること。',
  },
  {
    id: 'assign-2',
    lectureId: 'lec-1', // 線形代数学I
    title: '固有値・固有ベクトルの幾何学的解釈に関するレポート',
    dueDate: getFutureDate(48), // 2日後
    type: 'report',
    status: 'pending',
    memo: 'A4用紙2枚程度。手書きスキャンまたはLaTeX提出。',
  },
  {
    id: 'assign-3',
    lectureId: 'lec-4', // データ構造とアルゴリズム
    title: '二分探索木と平衡木の計算量比較 小テスト',
    dueDate: getFutureDate(96), // 4日後
    type: 'quiz',
    status: 'pending',
    memo: 'オンライン受講システム上で実施（制限時間30分）。',
  },
  {
    id: 'assign-4',
    lectureId: 'lec-3', // 英語コミュニケーションII
    title: 'Final Presentation Slide & Script Draft',
    dueDate: getFutureDate(-20), // 20時間前 -> 期限切れ（Overdue）
    type: 'presentation',
    status: 'pending',
    memo: 'SDGsに関する5分間のスピーチ原稿を提出。',
  },
  {
    id: 'assign-5',
    lectureId: 'lec-5', // 統計学基礎
    title: '仮説検定の演習問題 (第3章)',
    dueDate: getFutureDate(140),
    type: 'homework',
    status: 'pending',
    memo: 'p値の算出と棄却域の図示を含める。',
  },
  {
    id: 'assign-6',
    lectureId: 'lec-6', // Webシステムアーキテクチャ
    title: '開発環境構築レポートおよび動作確認スクリーンショット',
    dueDate: getFutureDate(-72),
    type: 'report',
    status: 'completed',
    completedAt: getFutureDate(-80),
    memo: 'Docker環境およびViteの動作確認完了。',
  },
];

export const SAMPLE_ATTENDANCE: AttendanceRecord[] = [
  {
    lectureId: 'lec-1', // 線形代数学I
    present: 9,
    absent: 1,
    late: 0,
    cancelled: 1,
    makeup: 0,
    maxAllowedAbsent: 4,
    totalSessions: 15,
  },
  {
    lectureId: 'lec-2', // プログラミング演習
    present: 7,
    absent: 3, // 3回欠席 -> 注意警告（注意ライン）
    late: 1,
    cancelled: 0,
    makeup: 0,
    maxAllowedAbsent: 4,
    totalSessions: 15,
  },
  {
    lectureId: 'lec-3', // 英語コミュニケーションII
    present: 6,
    absent: 4, // 4回欠席 -> 危険警告（単位リスク！）
    late: 2,
    cancelled: 0,
    makeup: 0,
    maxAllowedAbsent: 4,
    totalSessions: 15,
  },
  {
    lectureId: 'lec-4', // データ構造とアルゴリズム
    present: 10,
    absent: 0,
    late: 0,
    cancelled: 1,
    makeup: 1,
    maxAllowedAbsent: 4,
    totalSessions: 15,
  },
  {
    lectureId: 'lec-5', // 統計学基礎
    present: 8,
    absent: 2,
    late: 1,
    cancelled: 0,
    makeup: 0,
    maxAllowedAbsent: 4,
    totalSessions: 15,
  },
  {
    lectureId: 'lec-6', // Webシステムアーキテクチャ
    present: 11,
    absent: 0,
    late: 0,
    cancelled: 0,
    makeup: 0,
    maxAllowedAbsent: 4,
    totalSessions: 15,
  },
];

export const SAMPLE_SETTINGS: AppSettings = {
  theme: 'light',
  showWeekends: false,
  maxPeriods: 5,
  defaultAlertThreshold: 3,
  activeTimetableId: 'timetable-2026-spring',
};
