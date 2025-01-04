setup:
	pnpm install --ignore-scripts
	cd packages/prisma; docker compose up -d --wait
	pnpm prisma migrate dev
	pnpm prisma generate
	pnpm prepare
dev:
	cd packages/prisma; docker compose up -d --wait
	pnpm dev
