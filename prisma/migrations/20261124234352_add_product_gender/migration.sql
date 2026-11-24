-- CreateEnum
CREATE TYPE "gender" AS ENUM ('MEN', 'WOMEN', 'UNISEX');

-- AlterTable
ALTER TABLE "products" ADD COLUMN     "gender" "gender" NOT NULL DEFAULT 'UNISEX';

-- CreateIndex
CREATE INDEX "products_gender_idx" ON "products"("gender");
