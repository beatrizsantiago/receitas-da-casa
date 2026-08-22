-- CreateTable
CREATE TABLE IF NOT EXISTS "IngredientGroup" (
    "id" SERIAL NOT NULL,
    "title" TEXT,
    "order" INTEGER NOT NULL,
    "recipeId" INTEGER NOT NULL,

    CONSTRAINT "IngredientGroup_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "IngredientGroup" DROP CONSTRAINT IF EXISTS "IngredientGroup_recipeId_fkey";
ALTER TABLE "IngredientGroup" ADD CONSTRAINT "IngredientGroup_recipeId_fkey" FOREIGN KEY ("recipeId") REFERENCES "Recipe"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- CreateIndex
DROP INDEX IF EXISTS "IngredientGroup_recipeId_idx";
CREATE INDEX "IngredientGroup_recipeId_idx" ON "IngredientGroup"("recipeId");

-- CreateIndex
DROP INDEX IF EXISTS "IngredientGroup_recipeId_order_key";
CREATE UNIQUE INDEX "IngredientGroup_recipeId_order_key" ON "IngredientGroup"("recipeId", "order");

-- AlterTable: add the new column nullable first so existing rows can be backfilled
ALTER TABLE "Ingredient" ADD COLUMN IF NOT EXISTS "ingredientGroupId" INTEGER;

-- Backfill: recipes that already had ingredients get one untitled group
-- holding everything they had, so no existing data is lost.
INSERT INTO "IngredientGroup" ("title", "order", "recipeId")
SELECT NULL, 1, existing."recipeId"
FROM (SELECT DISTINCT "recipeId" FROM "Ingredient" WHERE "ingredientGroupId" IS NULL) AS existing
WHERE NOT EXISTS (
  SELECT 1 FROM "IngredientGroup" ig WHERE ig."recipeId" = existing."recipeId"
);

UPDATE "Ingredient" i
SET "ingredientGroupId" = ig."id"
FROM "IngredientGroup" ig
WHERE ig."recipeId" = i."recipeId" AND i."ingredientGroupId" IS NULL;

-- DropForeignKey
ALTER TABLE "Ingredient" DROP CONSTRAINT IF EXISTS "Ingredient_recipeId_fkey";

-- DropIndex
DROP INDEX IF EXISTS "Ingredient_recipeId_idx";

-- AlterTable: drop the old column and enforce the new one now that it's backfilled
ALTER TABLE "Ingredient" DROP COLUMN IF EXISTS "recipeId";
ALTER TABLE "Ingredient" ALTER COLUMN "ingredientGroupId" SET NOT NULL;

-- CreateIndex
DROP INDEX IF EXISTS "Ingredient_ingredientGroupId_idx";
CREATE INDEX "Ingredient_ingredientGroupId_idx" ON "Ingredient"("ingredientGroupId");

-- AddForeignKey
ALTER TABLE "Ingredient" DROP CONSTRAINT IF EXISTS "Ingredient_ingredientGroupId_fkey";
ALTER TABLE "Ingredient" ADD CONSTRAINT "Ingredient_ingredientGroupId_fkey" FOREIGN KEY ("ingredientGroupId") REFERENCES "IngredientGroup"("id") ON DELETE CASCADE ON UPDATE CASCADE;
