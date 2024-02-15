# attt

## Palette

https://mycolor.space/?hex=#2E3255&sub=1#001731&sub=1

## Commands

### Setup

```sh
cp .sample.env .env
make setup
```

### Start dev mode

```sh
pnpm dev
cd ./prisma
docker compose up -d
```

### Seed

```sh
pnpm prisma db seed
```
