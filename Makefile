setup:
	pnpm install --ignore-scripts
	docker compose -f server/prisma/docker-compose.yml up -d --wait
	pnpm prisma migrate dev
	pnpm prisma generate
	pnpm prisma db seed
	pnpm prepare
dev:
	docker compose -f server/prisma/docker-compose.yml up -d --wait
	pnpm dev
dev-mock:
	pnpm dev:mock
