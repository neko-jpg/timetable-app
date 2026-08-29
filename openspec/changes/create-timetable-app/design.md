## Context

時間割アプリは、学生・受講生が自身の受講スケジュール、課題、出欠を一元管理できるSPA（Single Page Application）として新規構築します。
サーバーレス・オフラインファースト構成とし、ブラウザ内ストレージ（LocalStorage）を活用して高速かつ安全に動作させます。

## Goals / Non-Goals

**Goals:**
- 直感的でレスポンシブな時間割グリッドUIの提供（PC・タブレット・モバイル対応）。
- 講義情報（講義名、教室、教員、単位数、カラー、メモ等）の柔軟な登録・編集・管理。
- 講義に紐づく課題管理（期日、ステータス、ダッシュボードアラート）。
- 出欠カウンター（出席・欠席・遅刻・休講）と単位リスクアラート。
- データのLocalStorage永続化、JSONバックアップ/復元、ICS（カレンダー）/画像（PNG）/印刷エクスポート。
- ライトモード/ダークモードのシームレスな切り替え。

**Non-Goals:**
- クラウドバックエンド/ユーザー認証基盤（初期フェーズではローカル完結とし、外部サーバー依存を排除）。
- 大学シラバスシステムとの自動スクレイピング連携（手動登録およびJSON連携を基本とする）。

## Decisions

### 1. フロントエンド技術スタック: React + TypeScript + Vite + Tailwind CSS
- **決定**: React (with TypeScript), Vite, Tailwind CSS を採用する。
- **理由**:
  - 高速な開発体験とビルドパフォーマンス（Vite）。
  - 型安全性による堅牢なデータモデル管理（TypeScript）。
  - 柔軟で洗練されたモダンUIデザインの迅速な実装（Tailwind CSS）。
  - アイコンには `lucide-react` を採用し、直感的なビジュアルを提供。
- **代替案**:
  - Next.js: SSR/SSGは不要であり、SPA・ローカル完結型アプリとしてはViteがより軽量で配布しやすい。
  - Vue/Svelte: Reactのエコシステムとコンポーネント資産の充実度を考慮してReactを採用。

### 2. 状態管理とデータ永続化設計
- **決定**: React Context / カスタムフック（または軽量な Zustand）+ LocalStorage同期機構。
- **設計**:
  - `useTimetable`: 時間割メタデータ、講義データ、時限設定のCRUD操作。
  - `useAssignments`: 課題の追加・更新・完了トグル・フィルタリング。
  - `useAttendance`: 出欠カウント（出席/欠席/遅刻）の増減とアラート計算。
  - `useSettings`: テーマ（Dark/Light）、グリッド表示設定（土日表示/非表示、時限数）の管理。
- **スキーマバージョニング**: LocalStorage保存データに `version` を含め、将来のスキーマ変更時のマイグレーションに対応。

### 3. データモデル構造
```typescript
export type DayOfWeek = 'mon' | 'tue' | 'wed' | 'thu' | 'fri' | 'sat' | 'sun';

export interface PeriodConfig {
  period: number;      // 1, 2, 3...
  startTime: string;   // "09:00"
  endTime: string;     // "10:30"
}

export interface Timetable {
  id: string;
  name: string;        // "2026年度 前期"
  days: DayOfWeek[];   // ['mon', 'tue', 'wed', 'thu', 'fri'] (or with sat, sun)
  periods: PeriodConfig[];
  isDefault: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface Lecture {
  id: string;
  timetableId: string;
  dayOfWeek: DayOfWeek;
  period: number;      // 何限目か
  name: string;
  room?: string;
  instructor?: string;
  credits?: number;
  color: string;       // カラーテーマ (hex or preset)
  memo?: string;
  onlineUrl?: string;  // オンライン講義URL等
}

export interface Assignment {
  id: string;
  lectureId: string;
  title: string;
  dueDate: string;     // ISO String (YYYY-MM-DDTHH:mm)
  type: 'report' | 'quiz' | 'exam' | 'presentation' | 'homework' | 'other';
  status: 'pending' | 'completed';
  completedAt?: string;
  memo?: string;
}

export interface AttendanceRecord {
  lectureId: string;
  present: number;
  absent: number;
  late: number;
  cancelled: number;
  makeup: number;
  maxAllowedAbsent?: number; // 例: 4回
}
```

### 4. カレンダー連携 (ICS) & 画像エクスポート
- **決定**:
  - ICSエクスポート: RFC 5545準拠の標準的なiCalendar文字列を生成する軽量ユーティリティを自作。学期の開始日〜終了日を指定して毎週の繰り返しイベント（`RRULE:FREQ=WEEKLY`）を生成。
  - 画像エクスポート: `html-to-image` または Canvas API を利用し、時間割グリッドを高品質PNGとしてダウンロード可能にする。
  - 印刷スタイル: `@media print` CSSを適用し、用紙に収まるきれいな印刷レイアウトを提供。

## Risks / Trade-offs

- **[Risk] ブラウザストレージの容量制限・誤消去**
  → **Mitigation**: データサイズは数MB以下と軽量であるため容量問題は起きにくい。誤消去対策として、ワンクリックで全データをダウンロードできる「JSONエクスポート」機能と、定期的なバックアップ推奨バナーを用意する。
- **[Risk] モバイル画面でのグリッド表示の視認性**
  → **Mitigation**: モバイル端末では横スクロール可能なグリッド表示に加え、「今日の時間割」「曜日切り替えタブ表示」のビューを用意し、片手でも快適に閲覧・操作できるようにする。
- **[Risk] 複雑な時間割パターン（隔週講義、複数時限連続講義など）**
  → **Mitigation**: コマ単位での登録を基本としつつ、同一講義を複数コマに簡単に複製・配置できるUIを提供する。

## Migration Plan

新規開発のため、既存システムからのデータ移行は不要。初期起動時にはデモ用のサンプル時間割（「サンプル: 2026年度 前期」）を初期データとして用意し、ユーザーがすぐに機能を試せるようにする。
