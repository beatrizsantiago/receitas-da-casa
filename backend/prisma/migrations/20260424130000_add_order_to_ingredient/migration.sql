BEGIN;

-- AlterTable Ingredient
ALTER TABLE "Ingredient" ADD COLUMN "order" INTEGER NOT NULL DEFAULT 1;

COMMIT;
