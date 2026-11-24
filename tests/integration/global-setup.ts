import { execSync } from "node:child_process";

export function setup() {
  const databaseUrl = new URL(process.env.DATABASE_URL ?? "");
  const databaseName = databaseUrl.pathname.slice(1);

  if (!databaseName.endsWith("_test")) {
    throw new Error(
      `Refusing to run integration tests against "${databaseName}". The database name must end with "_test".`,
    );
  }

  try {
    execSync("npx prisma migrate deploy", { stdio: "pipe", env: process.env });
  } catch (error) {
    const output = error instanceof Error && "stderr" in error ? String(error.stderr) : "";
    throw new Error(
      `Could not migrate the test database at ${databaseUrl.host}. Is it running? Start it with "docker compose up -d db-test".\n${output}`,
    );
  }
}
