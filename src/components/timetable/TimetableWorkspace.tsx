import { useState } from 'react';
import { Header, ActiveView } from '../layout/Header';
import { DayView } from './DayView';
import { LectureModal } from './LectureModal';
import { NewTimetableModal } from './NewTimetableModal';
import { TimetableGrid } from './TimetableGrid';
import { TodayLecturesView } from './TodayLecturesView';
import { TimetableProvider, useTimetable } from '../../context/TimetableContext';
import { DayOfWeek, Lecture } from '../../types';

function TimetableWorkspaceApp() {
  const {
    activeTimetable,
    activeLectures,
    settings,
    addLecture,
    updateLecture,
    deleteLecture,
    addTimetable,
  } = useTimetable();

  const [activeView, setActiveView] = useState<ActiveView>('grid');

  // モーダル管理ステート
  const [isLectureModalOpen, setIsLectureModalOpen] = useState(false);
  const [editingLecture, setEditingLecture] = useState<Lecture | null>(null);
  const [initialSlot, setInitialSlot] = useState<{ day: DayOfWeek; period: number }>({
    day: 'mon',
    period: 1,
  });

  const [isNewTimetableModalOpen, setIsNewTimetableModalOpen] = useState(false);

  // 講義カードクリック（編集モーダルを開く）
  const handleLectureClick = (lecture: Lecture) => {
    setEditingLecture(lecture);
    setIsLectureModalOpen(true);
  };

  // 空きコマクリック（指定コマで新規作成モーダルを開く）
  const handleEmptyCellClick = (day: DayOfWeek, period: number) => {
    setEditingLecture(null);
    setInitialSlot({ day, period });
    setIsLectureModalOpen(true);
  };

  // ヘッダー等のグローバル追加ボタン
  const handleOpenAddLectureModal = () => {
    setEditingLecture(null);
    setInitialSlot({ day: 'mon', period: 1 });
    setIsLectureModalOpen(true);
  };

  // 講義の保存（追加 or 更新）
  const handleSaveLecture = (lectureData: Omit<Lecture, 'id' | 'timetableId'> & { id?: string }) => {
    if (lectureData.id) {
      const { id, ...updates } = lectureData;
      updateLecture(id, updates);
    } else {
      addLecture(lectureData);
    }
  };

  return (
    <div className="min-h-screen bg-slate-100/70 dark:bg-slate-950 text-slate-900 dark:text-slate-100 flex flex-col transition-colors">
      {/* ヘッダー */}
      <Header
        activeView={activeView}
        onViewChange={setActiveView}
        onOpenAddLectureModal={handleOpenAddLectureModal}
        onOpenNewTimetableModal={() => setIsNewTimetableModalOpen(true)}
      />

      {/* メインコンテンツエリア */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-3 sm:px-6 lg:px-8 py-4 sm:py-6">
        {/* サブヘッダー情報（時間割名と単位数集計） */}
        <div className="mb-4 flex flex-wrap items-center justify-between gap-2 px-1">
          <div>
            <h2 className="text-base sm:text-lg font-bold text-slate-800 dark:text-slate-100 flex items-center gap-2">
              <span>{activeTimetable?.name}</span>
              {activeTimetable?.semester && (
                <span className="text-xs font-semibold px-2 py-0.5 rounded-full bg-indigo-100 dark:bg-indigo-950/60 text-indigo-700 dark:text-indigo-300">
                  {activeTimetable.semester === 'spring'
                    ? '前期'
                    : activeTimetable.semester === 'fall'
                    ? '後期'
                    : '通年'}
                </span>
              )}
            </h2>
          </div>

          <div className="flex items-center gap-3 text-xs text-slate-500 dark:text-slate-400">
            <span>
              講義数: <strong className="text-slate-800 dark:text-slate-200">{activeLectures.length}コマ</strong>
            </span>
            <span>•</span>
            <span>
              総単位数:{' '}
              <strong className="text-indigo-600 dark:text-indigo-400">
                {activeLectures.reduce((acc, curr) => acc + (curr.credits || 0), 0)}単位
              </strong>
            </span>
          </div>
        </div>

        {/* 選択ビューの表示 */}
        {activeView === 'grid' && (
          <TimetableGrid
            lectures={activeLectures}
            maxPeriods={settings.maxPeriods}
            showWeekends={settings.showWeekends}
            onLectureClick={handleLectureClick}
            onEmptyCellClick={handleEmptyCellClick}
          />
        )}

        {activeView === 'today' && (
          <TodayLecturesView
            lectures={activeLectures}
            maxPeriods={settings.maxPeriods}
            onLectureClick={handleLectureClick}
            onAddLectureClick={handleEmptyCellClick}
          />
        )}

        {activeView === 'day' && (
          <DayView
            lectures={activeLectures}
            maxPeriods={settings.maxPeriods}
            showWeekends={settings.showWeekends}
            onLectureClick={handleLectureClick}
            onAddLectureClick={handleEmptyCellClick}
          />
        )}
      </main>

      {/* 講義追加・編集・削除モーダル */}
      <LectureModal
        isOpen={isLectureModalOpen}
        onClose={() => setIsLectureModalOpen(false)}
        onSave={handleSaveLecture}
        onDelete={deleteLecture}
        lecture={editingLecture}
        initialDay={initialSlot.day}
        initialPeriod={initialSlot.period}
        maxPeriods={settings.maxPeriods}
        showWeekends={settings.showWeekends}
      />

      {/* 新規時間割作成モーダル */}
      <NewTimetableModal
        isOpen={isNewTimetableModalOpen}
        onClose={() => setIsNewTimetableModalOpen(false)}
        onAdd={addTimetable}
      />
    </div>
  );
}

export function TimetableWorkspace() {
  return (
    <TimetableProvider>
      <TimetableWorkspaceApp />
    </TimetableProvider>
  );
}
