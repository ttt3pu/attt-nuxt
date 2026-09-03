# 指示

セットアップ・起動・テスト実行のコマンドは [README.md](README.md) を参照。

## 指示とスキルの置き場所

**複数リポジトリで共通の skill は共有プラグインに置き、このリポジトリの指示は `AGENTS.md`（このファイル）に集約する。**

| パス                                | 役割                                                                      |
| ----------------------------------- | ------------------------------------------------------------------------- |
| `AGENTS.md`（このファイル）         | このリポジトリの指示。長くなった節だけ `docs/` へ切り出してここからリンク |
| 共有プラグイン `ttt3pu/ai-settings` | 複数リポジトリで共通の skill。原本は向こうにあり、こちらには複製しない    |
| `.agents/skills/<name>/SKILL.md`    | このリポジトリ固有かつ特定作業時のみ適用する skill（必要な場合のみ作成）  |
| `.github/copilot-instructions.md`   | github.com の Copilot Chat が `AGENTS.md` を読まないための固定ポインタ    |

常時適用の指示やリポジトリの基本方針を skill ではなく `AGENTS.md` に集約する理由は、ツールごとに skill の探索パスが異なり（Claude Code のプロジェクト skill は `.claude/skills/` のみで `.agents/skills/` を読まない等）、置いても届かないツールがあるため。加えて `AGENTS.md` は Cursor・Claude Code・Codex・Copilot（cloud agent / CLI / VS Code）がいずれも読むため、リポジトリの基本指示はここに集約するのが最も確実。

### 共有 skill

[ttt3pu/ai-settings](https://github.com/ttt3pu/ai-settings) から marketplace 経由で配信している。インストール手順および最新の収録 skill 一覧は同リポジトリの README を参照。

主な収録 skill:

- `enable-library-automerge` — Renovate の minor/patch 自動マージを、プロダクト経路の回帰テストと CI 通過を条件に有効化する
- `shared-testing-conventions` — テストの命名規則、テスト対象の選び方、配置とスナップショットの扱い

守ること。

- 共有 skill の内容をこのリポジトリのファイルに複製しない。参照するだけにする
- 「適用先の構成に従う」としている箇所の答えは `AGENTS.md` に書く。同じ話題の skill をこのリポジトリに作って分割しない
- 共有 skill を直したいときは `ttt3pu/ai-settings` 側を直す。こちらで上書きしたり、ローカル版を作って分岐させたりしない
- プラグインが入っていない環境で作業する場合は、`ttt3pu/ai-settings` の該当 `SKILL.md` を直接読んでから進める

### ルールを追加するとき

1. このリポジトリ固有の全体ルールなら `AGENTS.md` に節を足す。分量が増えたら `docs/` に切り出して `AGENTS.md` からリンクする
2. このリポジトリ固有かつ特定作業でのみ読み込ませたい詳細ガイドなら、リポジトリ内 skill（`.agents/skills/<name>/SKILL.md`）として追加する
3. 他のリポジトリでも汎用的に使える内容なら `ttt3pu/ai-settings` に skill として追加する
4. ツール固有のファイルは作らない。`.cursor/rules/*.mdc` や `.github/instructions/*.instructions.md` に内容を複製しない

### 新しいエージェントを追加するとき

`AGENTS.md` を読めるツールなら設定は不要。読めない場合だけ、そのツールが見る場所に**ポインタ 1 枚**を置く。指示の本文を複製したり、ルールごとにアダプタを作ったりしない。

## 言語

**人間へのやりとり・PR タイトル・PR 概要・コメントへの返信はすべて日本語。**

- コミットメッセージは英語で記述する（既存の慣例に従う）
- コード内のコメントは日本語または英語のどちらでもよい

## パッケージマネージャー

**npm ではなく、必ず pnpm を使用する。**

- このプロジェクトでは pnpm workspaces を使用したモノレポ構成を採用している
- パッケージのインストールは `pnpm install` を使用する
- スクリプトの実行は `pnpm <script>` を使用する

### Corepack に関する注意事項

GitHub Actions（Copilot エージェント環境など）では `ENABLE_EXPERIMENTAL_COREPACK=1` が有効になっており、Corepack が `package.json` の `packageManager` フィールドを読み取って `pnpm-lock.yaml` にバイナリ依存（`@pnpm/exe`、`@pnpm/linux-*` 等）を書き込む場合がある。

これを防ぐため、`pnpm install` を実行する GitHub Actions のステップには必ず以下の環境変数を設定する。

```yaml
env:
  COREPACK_ENABLE_AUTO_PIN: '0'
```

参照: `.github/actions/setup-project/action.yml`

## コーディング指針

- 最小限の変更で問題を解決する。既存の動作を壊さない
- Nuxt 3 のファイルベースルーティングおよびモノレポ構造（pnpm workspaces）を考慮する
- TypeScript の型安全性を維持する
- Vue 3 では Composition API および `<script setup lang="ts">` を使用する
- スタイリングは Tailwind CSS のユーティリティクラスを優先し、カスタムスタイルが必要な場合は SCSS を使用する
- Prisma スキーマ変更時はマイグレーションを作成し、生成された Prisma Client の型を使用する
- 変更後は `pnpm lint` および `pnpm typeCheck` を通す。整形は `pnpm prettier:fix`

## テスト

テストを書く・直すときは共有 skill `shared-testing-conventions` に従う。

- 既存のテストを壊さない
- 新機能や重要な変更にはテストの追加を検討する

## PR 作成時の必須手順

1. `pnpm lint:js`、`pnpm lint:style`、`pnpm typeCheck` が通ることを確認する
2. PR タイトル・概要は日本語で記述し、変更内容を明確に説明する
