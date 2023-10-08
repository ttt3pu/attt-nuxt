# attt

## Palette

https://mycolor.space/?hex=#2E3255&sub=1#001731&sub=1

## Commands

### Setup

```sh
cp .sample.env .env
pnpm install --ignore-scripts
pnpm prisma migrate dev
pnpm prisma generate
pnpm prepare
docker compose up -d
```

### Start dev mode

```sh
docker compose up -d
pnpm dev
```

### Generate types and etc (Execute after changing models)

```sh
npx prisma generate
```

### Seed

```sh
npx prisma db seed
```

### Reset Data

```sh
pnpm prisma migrate reset
```

### View DB data in browser

```sh
pnpm prisma studio
```

## DATABASE_URL

To prevent SSL/TTS errors, `sslaccept` option must be added.

```sh
DATABASE_URL='mysql://id:pass@aws.connect.psdb.cloud/attt?sslaccept=strict'
```
