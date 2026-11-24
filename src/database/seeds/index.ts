import { env } from "../../config/env.js";
import { prisma } from "../../lib/prisma.js";
import { seedUsers } from "./users.seed.js";

async function seedDatabase() {
  await seedUsers();
}

if (env.NODE_ENV === "production") {
  console.error("Refusing to seed a production database");
  process.exit(1);
}

try {
  await seedDatabase();
  console.log("Database seeded");
} catch (error) {
  console.error("Seeding failed:", error);
  process.exitCode = 1;
} finally {
  await prisma.$disconnect();
}
