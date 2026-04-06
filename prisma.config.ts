import { defineConfig } from "@prisma/config"

export default defineConfig({
  schema: "prisma/schema.prisma",
  seed: {
    command: "ts-node --compiler-options '{\"module\":\"CommonJS\"}' prisma/seed.ts",
  },
})
