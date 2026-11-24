import { prisma } from "../../lib/prisma.js";
import { slugify } from "../../lib/slug.js";
import catalog from "./data/catalog.json" with { type: "json" };

export async function seedCategories() {
  for (const { name } of catalog.categories) {
    const slug = slugify(name);

    await prisma.category.upsert({
      where: { slug },
      update: { name },
      create: { name, slug },
    });
  }

  console.log(`Seeded ${catalog.categories.length} categories`);
}
