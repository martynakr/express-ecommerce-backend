import { faker } from "@faker-js/faker";
import { env } from "../../config/env.js";
import { prisma } from "../../lib/prisma.js";
import { seedCategories } from "./categories.seed.js";
import { seedProducts } from "./products.seed.js";
import { seedUsers } from "./users.seed.js";

const FAKER_SEED = 2026;

async function seedDatabase() {
  faker.seed(FAKER_SEED);

  await seedUsers();
  await seedCategories();
  await seedProducts();
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
