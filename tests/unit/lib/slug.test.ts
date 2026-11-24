import { describe, expect, it } from "vitest";
import { slugify } from "../../../src/lib/slug.js";

describe("slugify", () => {
  it.each([
    ["Blue Hoodie", "blue-hoodie"],
    ["Men's Running Shoes", "mens-running-shoes"],
    ["T-Shirts & Tops", "t-shirts-tops"],
    ["Café Crème", "cafe-creme"],
    ["  --Spaced   Out--  ", "spaced-out"],
    ["Product 2.0 (Pro)", "product-2-0-pro"],
    ["already-a-slug", "already-a-slug"],
  ])("turns %j into %j", (input, expected) => {
    expect(slugify(input)).toBe(expected);
  });

  it("returns an empty string when nothing URL-safe is left", () => {
    expect(slugify("!!! ???")).toBe("");
  });
});
