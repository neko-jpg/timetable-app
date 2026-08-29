import React from 'react';
import { MapPin, User, Video, BookOpen } from 'lucide-react';
import { LECTURE_COLORS } from '../../constants';
import { Lecture } from '../../types';

interface LectureCardProps {
  lecture: Lecture;
  onClick: (lecture: Lecture) => void;
  compact?: boolean;
}

export const LectureCard: React.FC<LectureCardProps> = ({ lecture, onClick, compact = false }) => {
  const colorScheme = LECTURE_COLORS[lecture.color] || LECTURE_COLORS.indigo;

  return (
    <div
      onClick={() => onClick(lecture)}
      className={`group relative h-full w-full rounded-xl border p-2.5 sm:p-3 text-left transition-all duration-200 cursor-pointer shadow-sm hover:shadow-md ${colorScheme.bg} ${colorScheme.border} ${colorScheme.text} ${colorScheme.hover} flex flex-col justify-between overflow-hidden`}
    >
      {/* カラーアクセントバー */}
      <div className={`absolute top-0 left-0 bottom-0 w-1 ${colorScheme.accent}`} />

      {/* 上部ヘッダー（講義名、単位数バッジ） */}
      <div>
        <div className="flex items-start justify-between gap-1 mb-1.5">
          <h3 className="font-semibold text-xs sm:text-sm tracking-tight line-clamp-2 leading-snug">
            {lecture.name}
          </h3>
          {lecture.credits !== undefined && (
            <span
              className={`shrink-0 text-[10px] sm:text-xs font-medium px-1.5 py-0.5 rounded-md ${colorScheme.badge} ${colorScheme.badgeText}`}
            >
              {lecture.credits}単位
            </span>
          )}
        </div>

        {/* 教室・教員情報 */}
        <div className="space-y-1 text-[11px] sm:text-xs opacity-90">
          {lecture.room && (
            <div className="flex items-center gap-1 truncate" title={lecture.room}>
              <MapPin className="w-3 h-3 shrink-0 opacity-70" />
              <span className="truncate">{lecture.room}</span>
            </div>
          )}
          {!compact && lecture.instructor && (
            <div className="flex items-center gap-1 truncate" title={lecture.instructor}>
              <User className="w-3 h-3 shrink-0 opacity-70" />
              <span className="truncate">{lecture.instructor}</span>
            </div>
          )}
        </div>
      </div>

      {/* 下部アイコン（オンライン・シラバス・メモ等） */}
      {!compact && (
        <div className="flex items-center gap-1.5 mt-2 pt-1.5 border-t border-current/10 text-[10px] opacity-75">
          {lecture.onlineUrl && (
            <span className="flex items-center gap-0.5" title="オンライン講義リンクあり">
              <Video className="w-3 h-3" />
              <span>Online</span>
            </span>
          )}
          {lecture.syllabusUrl && (
            <span className="flex items-center gap-0.5" title="シラバスリンクあり">
              <BookOpen className="w-3 h-3" />
            </span>
          )}
        </div>
      )}
    </div>
  );
};
