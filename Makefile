setup:
	pnpm install --ignore-scripts
	cd packages/prisma; docker compose up -d --wait
	pnpm prisma migrate dev
	pnpm prisma generate
	pnpm prisma db seed
	pnpm prepare
	$(MAKE) test-db
dev:
	cd packages/prisma; docker compose up -d --wait
	pnpm dev
test-db:
	cd packages/prisma; docker compose up -d --wait
	cd packages/prisma; docker compose exec -T db psql -U root -d postgres -c 'CREATE DATABASE attt_test' || true
	DATABASE_URL=$${TEST_DATABASE_URL:?.envrc に TEST_DATABASE_URL を設定してください} pnpm prisma migrate deploy
