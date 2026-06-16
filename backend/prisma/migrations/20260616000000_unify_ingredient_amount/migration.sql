-- Add amount as nullable first
ALTER TABLE "Ingredient" ADD COLUMN "amount" TEXT;

-- Backfill from existing quantity + unit
UPDATE "Ingredient" SET "amount" = TRIM("quantity" || ' ' || "unit");

-- Make NOT NULL
ALTER TABLE "Ingredient" ALTER COLUMN "amount" SET NOT NULL;

-- Drop old columns
ALTER TABLE "Ingredient" DROP COLUMN "quantity";
ALTER TABLE "Ingredient" DROP COLUMN "unit";
