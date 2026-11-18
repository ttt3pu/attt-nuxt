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

認証には `nuxt-auth-utils` を使用する。`.sample.envrc` を参考に、ローカル・本番それぞれで次の環境変数を設定する。

- `NUXT_OAUTH_GOOGLE_CLIENT_ID`：Google OAuth クライアント ID
- `NUXT_OAUTH_GOOGLE_CLIENT_SECRET`：Google OAuth クライアントシークレット
- `NUXT_OAUTH_GOOGLE_REDIRECT_URL`：公開オリジンに `/auth/google` を付けた URL
- `NUXT_APP_SECRET`：32 文字以上のランダム値（`openssl rand -base64 32` などで生成）。本番では必須で、同一環境の全インスタンスで共通にする

Google Cloud Console の「承認済みのリダイレクト URI」にも同じ URL を登録する。
ローカルでは `http://localhost:3000/auth/google`、本番では `https://<公開ホスト>/auth/google` を使う。

旧 `AUTH_CLIENT_ID_GOOGLE`、`AUTH_CLIENT_SECRET_GOOGLE`、`AUTH_SECRET`、`AUTH_ORIGIN`、`NEXTAUTH_URL`、`NUXT_AUTH_BASE_URL` は不要。
NextAuth からセッションは引き継がれないため、切り替え後は再ログインする。
Google が確認済みのメールアドレスでログインし、既存の管理者メール判定で管理画面と更新 API を保護する。
