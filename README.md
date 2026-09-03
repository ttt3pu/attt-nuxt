# attt

AI エージェント向けの指示は [AGENTS.md](AGENTS.md)。

## Requirements

### Runtime Environment

This project requires the following runtime environment:

- **Node.js**: 22.12.0 (specified in .tool-versions)
- **Package Manager**: pnpm 10.15.0 (specified in package.json)
- **Docker**: Required for database services (used in setup process)
- **direnv**: Optional but recommended for environment variable management

### Installation

1. Install Node.js 22.12.0 (recommend using a version manager like nvm, nodenv, or asdf)
2. Install pnpm: `npm install -g pnpm@10.15.0`
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
