import request from "supertest";
import { afterAll, beforeEach, describe, expect, it } from "vitest";
import { createApp } from "../../src/app.js";
import { disconnectDatabase, resetDatabase } from "../helpers/database.js";
import { createCategory, createProduct } from "../helpers/factories.js";

const app = createApp();

function minutesAgo(minutes: number) {
  return new Date(Date.now() - minutes * 60_000);
}

describe("GET /products", () => {
  beforeEach(async () => {
    await resetDatabase();
  });

  afterAll(async () => {
    await disconnectDatabase();
  });

  it("returns an empty page when there are no products", async () => {
    const res = await request(app).get("/products");

    expect(res.status).toBe(200);
    expect(res.body).toEqual({
      data: [],
      meta: { page: 1, limit: 20, total: 0, totalPages: 0 },
    });
  });

  it("returns products with their category and public fields only", async () => {
    const category = await createCategory({ name: "Toys", slug: "toys" });
    await createProduct(category.id, {
      name: "Wooden Train",
      slug: "wooden-train",
      priceCents: 2499,
      stockQuantity: 3,
    });

    const res = await request(app).get("/products");

    expect(res.status).toBe(200);
    expect(res.body.data).toHaveLength(1);
    expect(res.body.data[0]).toEqual({
      id: expect.any(Number),
      name: "Wooden Train",
      slug: "wooden-train",
      description: "A test product",
      priceCents: 2499,
      stockQuantity: 3,
      inStock: true,
      imageUrl: null,
      category: { id: category.id, name: "Toys", slug: "toys" },
      gender: "UNISEX",
    });
    expect(res.body.data[0]).not.toHaveProperty("isActive");
    expect(res.body.data[0]).not.toHaveProperty("categoryId");
  });

  it("excludes inactive products from the results and the total", async () => {
    const category = await createCategory();
    await createProduct(category.id, { slug: "visible" });
    await createProduct(category.id, { slug: "hidden", isActive: false });

    const res = await request(app).get("/products");

    expect(res.body.data.map((p: { slug: string }) => p.slug)).toEqual(["visible"]);
    expect(res.body.meta.total).toBe(1);
  });

  it("marks products with no stock as not in stock", async () => {
    const category = await createCategory();
    await createProduct(category.id, { slug: "sold-out", stockQuantity: 0 });

    const res = await request(app).get("/products");

    expect(res.body.data[0]).toMatchObject({ slug: "sold-out", stockQuantity: 0, inStock: false });
  });

  it("orders products newest first", async () => {
    const category = await createCategory();
    await createProduct(category.id, { slug: "oldest", createdAt: minutesAgo(30) });
    await createProduct(category.id, { slug: "newest", createdAt: minutesAgo(1) });
    await createProduct(category.id, { slug: "middle", createdAt: minutesAgo(10) });

    const res = await request(app).get("/products");

    expect(res.body.data.map((p: { slug: string }) => p.slug)).toEqual([
      "newest",
      "middle",
      "oldest",
    ]);
  });

  it("paginates with page and limit without overlapping pages", async () => {
    const category = await createCategory();
    for (let i = 0; i < 5; i += 1) {
      await createProduct(category.id, { slug: `item-${i}`, createdAt: minutesAgo(i) });
    }

    const page1 = await request(app).get("/products?page=1&limit=2");
    const page2 = await request(app).get("/products?page=2&limit=2");
    const page3 = await request(app).get("/products?page=3&limit=2");

    const slugs = (res: request.Response) => res.body.data.map((p: { slug: string }) => p.slug);

    expect(slugs(page1)).toEqual(["item-0", "item-1"]);
    expect(slugs(page2)).toEqual(["item-2", "item-3"]);
    expect(slugs(page3)).toEqual(["item-4"]);
    expect(page1.body.meta).toEqual({ page: 1, limit: 2, total: 5, totalPages: 3 });
  });

  it("returns an empty page when the page is past the end", async () => {
    const category = await createCategory();
    await createProduct(category.id);

    const res = await request(app).get("/products?page=5");

    expect(res.status).toBe(200);
    expect(res.body.data).toEqual([]);
    expect(res.body.meta).toMatchObject({ page: 5, total: 1, totalPages: 1 });
  });

  describe("filters", () => {
    const slugs = (res: request.Response) =>
      res.body.data.map((p: { slug: string }) => p.slug).sort();

    beforeEach(async () => {
      const shoes = await createCategory({ name: "Shoes", slug: "shoes" });
      const dresses = await createCategory({ name: "Dresses", slug: "dresses" });

      await createProduct(shoes.id, { slug: "mens-sneakers", gender: "MEN" });
      await createProduct(shoes.id, { slug: "womens-heels", gender: "WOMEN" });
      await createProduct(shoes.id, { slug: "unisex-slides", gender: "UNISEX" });
      await createProduct(shoes.id, { slug: "hidden-boots", gender: "WOMEN", isActive: false });
      await createProduct(dresses.id, { slug: "summer-dress", gender: "WOMEN" });
    });

    it("filters by gender and counts only matching products in the total", async () => {
      const res = await request(app).get("/products?gender=women");

      expect(res.status).toBe(200);
      expect(slugs(res)).toEqual(["summer-dress", "womens-heels"]);
      expect(res.body.meta).toMatchObject({ total: 2, totalPages: 1 });
    });

    it.each(["MEN", "Men", "men"])("accepts gender in any case (%s)", async (gender) => {
      const res = await request(app).get(`/products?gender=${gender}`);

      expect(res.status).toBe(200);
      expect(slugs(res)).toEqual(["mens-sneakers"]);
    });

    it("filters by category slug", async () => {
      const res = await request(app).get("/products?category=shoes");

      expect(slugs(res)).toEqual(["mens-sneakers", "unisex-slides", "womens-heels"]);
      expect(res.body.meta.total).toBe(3);
    });

    it("combines category and gender filters", async () => {
      const res = await request(app).get("/products?category=shoes&gender=women");

      expect(slugs(res)).toEqual(["womens-heels"]);
      expect(res.body.meta.total).toBe(1);
    });

    it("returns an empty page for an unknown category", async () => {
      const res = await request(app).get("/products?category=hats");

      expect(res.status).toBe(200);
      expect(res.body).toEqual({
        data: [],
        meta: { page: 1, limit: 20, total: 0, totalPages: 0 },
      });
    });
  });

  it.each([
    ["page=0", "page"],
    ["page=-1", "page"],
    ["page=abc", "page"],
    ["page=1.5", "page"],
    ["limit=0", "limit"],
    ["limit=101", "limit"],
    ["gender=kids", "gender"],
    ["category=", "category"],
  ])("rejects invalid query %s with 400", async (query, field) => {
    const res = await request(app).get(`/products?${query}`);

    expect(res.status).toBe(400);
    expect(res.body.error.code).toBe("VALIDATION_ERROR");
    expect(res.body.error.details.query).toHaveProperty(field);
  });

  it("does not require authentication", async () => {
    const res = await request(app).get("/products");

    expect(res.status).toBe(200);
  });
});
