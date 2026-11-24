import { faker } from "@faker-js/faker";
import { prisma } from "../../lib/prisma.js";
import { slugify } from "../../lib/slug.js";

const CATEGORY_COUNT = 6;

export async function seedCategories() {
  const names = faker.helpers.uniqueArray(faker.commerce.department, CATEGORY_COUNT);

  for (const name of names) {
    const slug = slugify(name);

    await prisma.category.upsert({
      where: { slug },
      update: { name },
      create: { name, slug },
    });
  }

  console.log(`Seeded ${names.length} categories`);
}
