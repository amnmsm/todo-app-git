# Todo App

React + TypeScript で作られた、シンプルなToDo管理アプリです。バックエンドはなく、データはブラウザの localStorage に保存されます。UIは日本語です。

## 主な機能

- タスクの追加・完了切り替え・削除・テキスト編集
- 期限日の設定（期限切れのタスクは強調表示）
- タスクごとのメモ
- フィルタ（すべて / 未完了 / 完了）と残り件数の表示
- 完了済みタスクの一括削除
- ドラッグ&ドロップによる並べ替え（フィルタが「すべて」のときのみ）
- ダークモード切り替え（設定は保存されます）

## 技術スタック

- [React 19](https://react.dev/) + TypeScript
- [Vite](https://vite.dev/)
- [Tailwind CSS v4](https://tailwindcss.com/)
- [@dnd-kit](https://dndkit.com/)（ドラッグ&ドロップ）
- [Vitest](https://vitest.dev/) + Testing Library（テスト）

## セットアップ

```bash
npm install
npm run dev
```

開発サーバーが起動します（`--host` 付きのため、ネットワーク内の他の端末からもアクセスできます）。

## スクリプト

| コマンド | 内容 |
| --- | --- |
| `npm run dev` | 開発サーバーを起動 |
| `npm run build` | 型チェック（`tsc -b`）後に本番ビルド |
| `npm run preview` | ビルド結果をプレビュー |
| `npm test` | テストを1回実行 |
| `npm run test:watch` | テストをウォッチモードで実行 |
| `npm run coverage` | カバレッジを計測（text + html） |

特定のテストだけ実行する場合:

```bash
npx vitest run src/hooks/useTodos.test.ts
npx vitest run src/hooks/useTodos.test.ts -t "adds todos"
```

## ディレクトリ構成

```
src/
├── App.tsx          # 状態の結線（フィルタ、表示リスト、残り件数）
├── components/      # 表示用コンポーネント（TodoForm, TodoList, TodoItem, FilterBar, ThemeToggle）
├── hooks/           # useTodos（状態と永続化）, useToday, useDarkMode
├── lib/             # storage.ts（localStorageの読み書き・検証）, date.ts（日付ヘルパー）
├── test/            # テストのセットアップ
└── types.ts
```

テストは各ファイルと同じ場所に `*.test.ts(x)` として配置しています。

## CI

プルリクエストでGitHub Actionsが実行され、ビルド（型チェック込み）とテストを行います。ドキュメント等のみの変更では実行されません。
