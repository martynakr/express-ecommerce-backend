import type { Gender } from "../../generated/prisma/enums.js";
import { prisma } from "../../lib/prisma.js";
import { slugify } from "../../lib/slug.js";
import catalog from "./data/catalog.json" with { type: "json" };

export async function seedProducts() {
  let count = 0;

  for (const category of catalog.categories) {
    const { id: categoryId } = await prisma.category.findUniqueOrThrow({
      where: { slug: slugify(category.name) },
      select: { id: true },
    });

    for (const product of category.products) {
      const slug = slugify(product.name);
      const data = { ...product, gender: product.gender as Gender, categoryId };

      await prisma.product.upsert({
        where: { slug },
        update: data,
        create: { ...data, slug },
      });

      count += 1;
    }
  }

  console.log(`Seeded ${count} products`);
}
