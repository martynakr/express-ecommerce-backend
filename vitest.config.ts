import { readFileSync } from "node:fs";
import { parseEnv } from "node:util";
import { defineConfig } from "vitest/config";

Object.assign(process.env, parseEnv(readFileSync(".env.test", "utf8")));

export default defineConfig({
  test: {
    environment: "node",
    projects: [
      {
        extends: true,
        test: {
          name: "unit",
          include: ["tests/unit/**/*.test.ts"],
        },
      },
      {
        extends: true,
        test: {
          name: "integration",
          include: ["tests/integration/**/*.test.ts"],
          globalSetup: ["tests/integration/global-setup.ts"],
          fileParallelism: false,
        },
      },
    ],
  },
});
