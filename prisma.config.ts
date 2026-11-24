import { defineConfig, env } from "prisma/config";

process.loadEnvFile();

export default defineConfig({
  schema: "prisma/schema",
  migrations: {
    path: "prisma/migrations",
    seed: "tsx --env-file=.env src/database/seeds/index.ts",
  },
  datasource: {
    url: env("DATABASE_URL"),
  },
});
