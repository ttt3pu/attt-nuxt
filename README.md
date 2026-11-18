# attt

AI エージェント向けの指示は [AGENTS.md](AGENTS.md)。

## Requirements

### Runtime Environment

This project requires the following runtime environment:

- **Node.js**: 26.13.0 (specified in .tool-versions)
- **Package Manager**: pnpm 12.18.0 (specified in package.json)
- **Docker**: Required for database services (used in setup process)
- **direnv**: Optional but recommended for environment variable management

### Installation

1. Install Node.js 26.13.0 (recommend using a version manager like nvm, nodenv, or asdf)
2. Install pnpm: `npm install -g pnpm@12.18.0`
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
pnpm test:nuxt:build
```

`test:nuxt` は既存の DB テストの後に単独で実行する。テスト用 DB に記事を追加し、
実アプリの Nuxt 開発サーバーを一時起動して API・SSR・管理画面の配信を検証する。
終了時に追加記事とサーバーを片付ける。

`test:nuxt:build` は同じ検証を本番ビルドしたサーバーでも実行する。
テスト用 DB の記事を事前生成し、生成された HTML が配信されることも確認する。
トップページの外部フィード取得は対象に含めない。各コマンドは順番に実行する。

## Google ログインの設定

認証には `nuxt-auth-utils` を使用する。既存の環境変数と Google Cloud の登録済みリダイレクト URI はそのまま利用できる。

- `AUTH_CLIENT_ID_GOOGLE`：既存の Google OAuth クライアント ID
- `AUTH_CLIENT_SECRET_GOOGLE`：既存の Google OAuth クライアントシークレット
- `AUTH_SECRET`：既存のセッション用シークレット
- `NUXT_AUTH_BASE_URL`：既存の認証ベース URL（例：`http://localhost:3000/api/auth`）

コールバックは従来と同じ `/api/auth/callback/google`。
固定 URL は `NUXT_AUTH_BASE_URL`、`NEXTAUTH_URL`、`AUTH_ORIGIN` の順で参照し、すべて未設定なら現在のリクエスト URL を使う。
新しい `NUXT_OAUTH_*` や `NUXT_APP_SECRET` の追加は不要。
旧 secret はサーバー起動時に展開し、固定の用途識別用接頭辞を付けて Nuxt のセッション鍵導出に渡す。接頭辞は secret 自体の強度を増やすものではない。
NextAuth のセッションは引き継がれないため、切り替え後は再ログインする。
