setup:
	pnpm install --ignore-scripts
	cd prisma; docker compose up -d --wait
	pnpm prisma migrate dev
	pnpm prisma generate
	pnpm prepare
