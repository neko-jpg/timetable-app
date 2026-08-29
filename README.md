# 📅 時間割アプリ (Timetable App)

学生・受講生向けのモダンで直感的な時間割・スケジュール・課題管理 Web アプリケーションです。

---

## ✨ 主な機能

- **📅 週間時間割グリッド**
  - 曜日（月〜金、土日切り替え）× 時限（1〜7限）のグリッド表示
  - 講義の登録・編集・削除（講義名、教室、担当教員、単位数、テーマカラー、メモ、URL等）
  - 前期・後期・通年などの複数時間割切り替え
- **📝 課題・ToDo管理**
  - 講義ごとの課題管理（提出期限、課題種別、ステータス）
  - 直近の締切アラート・ダッシュボード
- **📊 出欠カウント & 単位アラート**
  - 出席・欠席・遅刻・休講・補講のワンタップカウント
  - 規定欠席数接近時の警告バッジ表示
- **💾 データ管理・エクスポート**
  - LocalStorage による完全ローカル自動保存（サーバー不要・プライバシー保護）
  - JSON 形式でのバックアップおよびインポート復元
  - カレンダー連携（.ics / iCalendar エクスポート）
  - 時間割画像の保存（PNG）および印刷レイアウト対応
- **🌓 レスポンシブ & ダークモード**
  - スマートフォン・タブレット・PC に最適化された UI
  - ライトモード / ダークモード対応

---

## 🛠 技術スタック

- **Frontend Framework**: [React 18](https://react.dev/) + [TypeScript](https://www.typescriptlang.org/)
- **Build Tool**: [Vite](https://vite.dev/)
- **Styling**: [Tailwind CSS](https://tailwindcss.com/)
- **Icons**: [Lucide React](https://lucide.dev/)
- **Utilities**: `clsx`, `tailwind-merge`, `html-to-image`

---

## 🚀 はじめ方（開発手順）

### 必要環境

- [Node.js](https://nodejs.org/) (v18 以上推奨)
- npm / yarn / pnpm

### セットアップ & 起動

```bash
# 依存関係のインストール
npm install

# 開発用ローカルサーバー起動
npm run dev
```

起動後、ブラウザで `http://localhost:5173` を開いてください。

### プロダクションビルド

```bash
# 型チェック & ビルド
npm run build

# ビルド結果のプレビュー
npm run preview
```

---

## 📁 ディレクトリ構成

```text
├── openspec/            # OpenSpec 設計仕様・変更管理
├── src/
│   ├── types/           # TypeScript 型定義 (Timetable, Lecture, Assignment, etc.)
│   ├── App.tsx          # メインコンポーネント
│   ├── main.tsx         # エントリーポイント
│   └── index.css        # Tailwind CSS スタイル定義
├── index.html           # HTML テンプレート
├── tailwind.config.js   # Tailwind 設定
├── tsconfig.json        # TypeScript 設定
├── vite.config.ts       # Vite 設定
└── README.md            # 本ドキュメント
```

---

## 📄 ライセンス

MIT License
