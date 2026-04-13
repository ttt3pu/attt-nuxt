import path from 'node:path'
import { defineConfig } from 'prisma/config'

export default defineConfig({
  schema: path.join('packages', 'prisma', 'schema.prisma'),
  seed: 'tsx packages/prisma/seed.ts',
})
