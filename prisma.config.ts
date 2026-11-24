import { existsSync } from "node:fs";
import { defineConfig } from "prisma/config";

if (existsSync(".env")) {
  process.loadEnvFile();
}

export default defineConfig({
  schema: "prisma/schema",
  migrations: {
    path: "prisma/migrations",
    seed: "tsx --env-file=.env src/database/seeds/index.ts",
  },
  datasource: {
    url: process.env.DATABASE_URL ?? "",
  },
});
