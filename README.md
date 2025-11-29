# attt

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

## AI Guidelines

This project follows standard conventions for AI assistants like GitHub Copilot:

- **Framework**: Nuxt 3 with TypeScript
- **Styling**: Tailwind CSS + SCSS
- **Database**: Prisma ORM with PostgreSQL
- **State Management**: Pinia
- **Code Quality**: ESLint + Prettier + Stylelint
- **Package Structure**: Monorepo with pnpm workspaces

Key directories:

- `/components/` - Vue components
- `/pages/` - Nuxt pages (file-based routing)
- `/packages/prisma/` - Database schema and configuration
- `/packages/resume/` - Resume-related content
- `/packages/mock/` - Mock data for development without submodules
- `/assets/` - Static assets and SCSS files
- `/types/` - TypeScript type definitions

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

### Start dev mode without submodules (Mock Mode)

If you don't have the `packages/prisma` and `packages/resume` submodules cloned, you can use mock mode:

```sh
pnpm install --ignore-scripts
pnpm dev:mock
```

Or using Makefile:

```sh
make dev-mock
```

This mode uses mock data instead of the actual database and resume content, allowing development without setting up the full environment.

### Seed

```sh
pnpm prisma db seed
```
