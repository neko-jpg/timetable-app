import { useState } from 'react';
import { useAssignments } from './hooks/useAssignments';
import { useAttendance } from './hooks/useAttendance';
import { loadLectures } from './utils/storage';
import { AssignmentDashboard } from './components/assignment/AssignmentDashboard';
import { AttendanceDashboard } from './components/attendance/AttendanceDashboard';
import {
  Calendar,
  ListTodo,
  GraduationCap,
  Moon,
  Sun,
  AlertTriangle,
  Clock,
  Sparkles,
  RotateCcw,
} from 'lucide-react';
import { resetAllStorage } from './utils/storage';

type ActiveTab = 'timetable' | 'assignments' | 'attendance';

export default function App() {
  const [darkMode, setDarkMode] = useState(false);
  const [activeTab, setActiveTab] = useState<ActiveTab>('assignments');
  const [lectures] = useState(() => loadLectures());

  // State Management Hooks
  const assignmentsManager = useAssignments();
  const attendanceManager = useAttendance();

  const { stats: assignStats, urgentAssignments } = assignmentsManager;
  const { stats: attendStats } = attendanceManager;

  const handleResetDemoData = () => {
    if (window.confirm('すべてのデータを初期デモデータにリセットしますか？')) {
      resetAllStorage();
      window.location.reload();
    }
  };

  return (
    <div
      className={`min-h-screen transition-colors duration-200 ${
        darkMode ? 'dark bg-slate-950 text-slate-100' : 'bg-slate-50 text-slate-900'
      }`}
    >
      {/* Top App Header */}
      <header className="border-b border-slate-200 dark:border-slate-800 bg-white/80 dark:bg-slate-900/80 backdrop-blur sticky top-0 z-30 shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between gap-4">
          {/* Logo & Subtitle */}
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-indigo-500 to-indigo-700 flex items-center justify-center text-white shadow-md shadow-indigo-500/20">
              <Calendar className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h1 className="text-base sm:text-lg font-black tracking-tight text-slate-900 dark:text-slate-100">
                  CampusManager
                </h1>
                <span className="hidden sm:inline-block px-2 py-0.5 rounded-full text-[10px] font-bold bg-indigo-100 text-indigo-700 dark:bg-indigo-950/80 dark:text-indigo-300">
                  2026前期
                </span>
              </div>
              <p className="text-[11px] text-slate-500 dark:text-slate-400">
                時間割・課題・出欠・単位リスク統合管理
              </p>
            </div>
          </div>

          {/* Navigation Tabs (Header) */}
          <nav className="hidden md:flex items-center gap-1.5 p-1 rounded-xl bg-slate-100 dark:bg-slate-800/80 text-xs font-semibold">
            <button
              onClick={() => setActiveTab('timetable')}
              className={`flex items-center gap-2 px-3.5 py-1.5 rounded-lg transition-all ${
                activeTab === 'timetable'
                  ? 'bg-white dark:bg-slate-900 text-indigo-600 dark:text-indigo-400 shadow-sm'
                  : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-100'
              }`}
            >
              <Calendar className="w-4 h-4" />
              <span>時間割</span>
            </button>

            <button
              onClick={() => setActiveTab('assignments')}
              className={`flex items-center gap-2 px-3.5 py-1.5 rounded-lg transition-all relative ${
                activeTab === 'assignments'
                  ? 'bg-white dark:bg-slate-900 text-indigo-600 dark:text-indigo-400 shadow-sm'
                  : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-100'
              }`}
            >
              <ListTodo className="w-4 h-4" />
              <span>課題管理</span>
              {assignStats.pending > 0 && (
                <span
                  className={`px-1.5 py-0.2 rounded-full text-[10px] font-bold ${
                    urgentAssignments.length > 0
                      ? 'bg-rose-500 text-white animate-pulse'
                      : 'bg-indigo-100 text-indigo-700 dark:bg-indigo-900/60 dark:text-indigo-300'
                  }`}
                >
                  {assignStats.pending}
                </span>
              )}
            </button>

            <button
              onClick={() => setActiveTab('attendance')}
              className={`flex items-center gap-2 px-3.5 py-1.5 rounded-lg transition-all relative ${
                activeTab === 'attendance'
                  ? 'bg-white dark:bg-slate-900 text-indigo-600 dark:text-indigo-400 shadow-sm'
                  : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-100'
              }`}
            >
              <GraduationCap className="w-4 h-4" />
              <span>出欠・単位管理</span>
              {attendStats.dangerCount > 0 && (
                <span className="px-1.5 py-0.2 rounded-full text-[10px] font-bold bg-rose-500 text-white animate-pulse">
                  {attendStats.dangerCount}
                </span>
              )}
            </button>
          </nav>

          {/* Quick Actions (Theme & Reset) */}
          <div className="flex items-center gap-2">
            <button
              onClick={handleResetDemoData}
              className="hidden sm:flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg text-xs text-slate-500 hover:text-slate-700 dark:text-slate-400 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
              title="初期デモデータに戻す"
            >
              <RotateCcw className="w-3.5 h-3.5" />
              <span>データ初期化</span>
            </button>

            <button
              onClick={() => setDarkMode(!darkMode)}
              className="p-2 rounded-lg text-slate-500 hover:text-slate-700 dark:text-slate-400 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
              aria-label="Toggle theme"
            >
              {darkMode ? <Sun className="w-5 h-5" /> : <Moon className="w-5 h-5" />}
            </button>
          </div>
        </div>

        {/* Mobile Navigation Tabs */}
        <div className="md:hidden flex border-t border-slate-200 dark:border-slate-800 px-2 py-1 bg-slate-50 dark:bg-slate-900/50">
          <button
            onClick={() => setActiveTab('timetable')}
            className={`flex-1 py-2 text-xs font-semibold rounded-lg flex items-center justify-center gap-1.5 ${
              activeTab === 'timetable'
                ? 'bg-white dark:bg-slate-800 text-indigo-600 dark:text-indigo-400 shadow-sm'
                : 'text-slate-500'
            }`}
          >
            <Calendar className="w-3.5 h-3.5" />
            <span>時間割</span>
          </button>
          <button
            onClick={() => setActiveTab('assignments')}
            className={`flex-1 py-2 text-xs font-semibold rounded-lg flex items-center justify-center gap-1.5 ${
              activeTab === 'assignments'
                ? 'bg-white dark:bg-slate-800 text-indigo-600 dark:text-indigo-400 shadow-sm'
                : 'text-slate-500'
            }`}
          >
            <ListTodo className="w-3.5 h-3.5" />
            <span>課題 ({assignStats.pending})</span>
          </button>
          <button
            onClick={() => setActiveTab('attendance')}
            className={`flex-1 py-2 text-xs font-semibold rounded-lg flex items-center justify-center gap-1.5 ${
              activeTab === 'attendance'
                ? 'bg-white dark:bg-slate-800 text-indigo-600 dark:text-indigo-400 shadow-sm'
                : 'text-slate-500'
            }`}
          >
            <GraduationCap className="w-3.5 h-3.5" />
            <span>出欠 ({attendStats.dangerCount > 0 ? `⚠️${attendStats.dangerCount}` : 'OK'})</span>
          </button>
        </div>
      </header>

      {/* Main Content Area */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8">
        {/* Assignment Dashboard Tab */}
        {activeTab === 'assignments' && (
          <AssignmentDashboard
            assignmentsManager={assignmentsManager}
            lectures={lectures}
          />
        )}

        {/* Attendance Dashboard Tab */}
        {activeTab === 'attendance' && (
          <AttendanceDashboard
            attendanceManager={attendanceManager}
            lectures={lectures}
          />
        )}

        {/* Timetable Overview Tab */}
        {activeTab === 'timetable' && (
          <div className="space-y-6">
            <div className="p-6 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm">
              <div className="flex items-center justify-between mb-4">
                <div>
                  <h3 className="text-lg font-bold text-slate-900 dark:text-slate-100 flex items-center gap-2">
                    <Sparkles className="w-5 h-5 text-indigo-500" />
                    2026年度 前期 受講科目サマリー
                  </h3>
                  <p className="text-xs text-slate-500 mt-1">
                    登録講義数: {lectures.length}科目 / 総取得可能単位: {lectures.reduce((acc, l) => acc + (l.credits || 0), 0)}単位
                  </p>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
                {lectures.map((lec) => {
                  const lecAssignments = assignmentsManager.getAssignmentsByLecture(lec.id);
                  const pendingCount = lecAssignments.filter((a) => a.status === 'pending').length;
                  const risk = attendanceManager.getAttendanceRisk(lec.id);

                  return (
                    <div
                      key={lec.id}
                      className="p-4 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-950/50 hover:border-indigo-300 transition-colors"
                    >
                      <div className="flex items-center justify-between mb-2">
                        <span className="text-xs font-bold text-indigo-600 dark:text-indigo-400">
                          {lec.dayOfWeek.toUpperCase()} {lec.period}限
                        </span>
                        {risk.status === 'danger' ? (
                          <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-rose-100 text-rose-800 dark:bg-rose-950 dark:text-rose-300">
                            単位危険
                          </span>
                        ) : risk.status === 'warning' ? (
                          <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-amber-100 text-amber-800 dark:bg-amber-950 dark:text-amber-300">
                            欠席注意
                          </span>
                        ) : (
                          <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300">
                            順調
                          </span>
                        )}
                      </div>

                      <h4 className="text-sm font-bold text-slate-900 dark:text-slate-100 line-clamp-1">
                        {lec.name}
                      </h4>
                      <p className="text-xs text-slate-500 mt-0.5">{lec.instructor} / {lec.room}</p>

                      <div className="mt-3 pt-2.5 border-t border-slate-200/80 dark:border-slate-800 flex items-center justify-between text-xs">
                        <span className="text-slate-600 dark:text-slate-400 flex items-center gap-1">
                          <Clock className="w-3 h-3 text-slate-400" />
                          未完了課題: <strong className="text-slate-900 dark:text-slate-100">{pendingCount}件</strong>
                        </span>
                        <span className="text-slate-600 dark:text-slate-400 flex items-center gap-1">
                          <AlertTriangle className="w-3 h-3 text-slate-400" />
                          欠席: <strong className="text-slate-900 dark:text-slate-100">{risk.absent}/{risk.maxAllowed}回</strong>
                        </span>
                      </div>
                    </div>
                  );
                })}
              </div>

              <div className="mt-6 flex flex-wrap gap-3">
                <button
                  onClick={() => setActiveTab('assignments')}
                  className="px-4 py-2 text-xs font-semibold rounded-xl bg-indigo-600 text-white hover:bg-indigo-700 transition-colors shadow-sm"
                >
                  課題ダッシュボードを開く →
                </button>
                <button
                  onClick={() => setActiveTab('attendance')}
                  className="px-4 py-2 text-xs font-semibold rounded-xl bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-200 hover:bg-slate-200 transition-colors"
                >
                  出欠・単位リスク管理を開く →
                </button>
              </div>
            </div>
          </div>
        )}
      </main>
    </div>
  );
}
