# attt

## Palette

https://mycolor.space/?hex=#2E3255&sub=1#001731&sub=1

## Commands

### Setup

```sh
cp .sample.env .env
pnpm i
pnpm prisma migrate dev
pnpm prisma generate
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
