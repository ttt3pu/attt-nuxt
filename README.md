# attt

AI エージェント向けの指示は [AGENTS.md](AGENTS.md)。

## Requirements

### Runtime Environment

This project requires the following runtime environment:

- **Node.js**: 22.12.0 (specified in .tool-versions)
- **Package Manager**: pnpm 12.2.1 (specified in package.json)
- **Docker**: Required for database services (used in setup process)
- **direnv**: Optional but recommended for environment variable management

### Installation

1. Install Node.js 22.12.0 (recommend using a version manager like nvm, nodenv, or asdf)
2. Install pnpm: `npm install -g pnpm@12.2.1`
3. Install Docker for database services
4. (Optional) Install direnv for environment management

## Palette

https://mycolor.space/?hex=#2E3255&sub=1#001731&sub=1

## Commands

### Setup

```sh
cp .sample.envrc .envrc
direnv allow
make setup
```

### Start dev mode

```sh
make dev
```

### Seed

```sh
pnpm prisma db seed
```

### Test

Prisma 経路のテストは実 DB を通す。テーブルを空にしてからフィクスチャを流すので、
開発用とは別の `TEST_DATABASE_URL`（末尾が `_test` のデータベース）を使う。
`make setup` に含まれているが、単体で用意し直すこともできる。

```sh
make test-db
pnpm test
pnpm test:nuxt
```

`test:nuxt` は既存の DB テストの後に単独で実行する。テスト用 DB に記事を追加し、
実アプリの Nuxt 開発サーバーを一時起動して API・SSR・管理画面の配信を検証する。
終了時に追加記事とサーバーを片付ける。
