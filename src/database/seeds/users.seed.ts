import { Role } from "../../generated/prisma/enums.js";
import { prisma } from "../../lib/prisma.js";
import { hashPassword } from "../../lib/password.js";

const SEED_PASSWORD = "Password123!";

const users = [
  { email: "admin@example.com", name: "Admin User", role: Role.ADMIN },
  { email: "customer@example.com", name: "Customer User", role: Role.CUSTOMER },
];

export async function seedUsers() {
  const passwordHash = await hashPassword(SEED_PASSWORD);

  for (const user of users) {
    await prisma.user.upsert({
      where: { email: user.email },
      update: { name: user.name, role: user.role },
      create: { ...user, passwordHash },
    });
  }

  console.log(`Seeded ${users.length} users`);
}
