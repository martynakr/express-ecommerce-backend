import { faker } from "@faker-js/faker";
import { prisma } from "../../lib/prisma.js";
import { slugify } from "../../lib/slug.js";

const PRODUCT_COUNT = 50;

export async function seedProducts() {
  const categories = await prisma.category.findMany({ select: { id: true } });

  if (categories.length === 0) {
    throw new Error("No categories found. Run seedCategories() before seedProducts()");
  }

  const names = faker.helpers.uniqueArray(faker.commerce.productName, PRODUCT_COUNT);

  for (const name of names) {
    const slug = slugify(name);
    const data = {
      name,
      categoryId: faker.helpers.arrayElement(categories).id,
      description: faker.commerce.productDescription(),
      priceCents: faker.number.int({ min: 499, max: 49999 }),
      stockQuantity: faker.helpers.weightedArrayElement([
        { weight: 1, value: 0 },
        { weight: 2, value: faker.number.int({ min: 1, max: 5 }) },
        { weight: 7, value: faker.number.int({ min: 6, max: 100 }) },
      ]),
      imageUrl: faker.image.urlPicsumPhotos({ width: 640, height: 480 }),
      isActive: faker.datatype.boolean({ probability: 0.9 }),
    };

    await prisma.product.upsert({
      where: { slug },
      update: data,
      create: { ...data, slug },
    });
  }

  console.log(`Seeded ${names.length} products`);
}
