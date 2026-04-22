-- Fix RecipeCategory enum values to match Prisma schema

-- Create new enum with correct values
CREATE TYPE "RecipeCategory_new" AS ENUM ('SWEET', 'SAVORY');

-- Alter table column to use new enum
ALTER TABLE "Recipe" ALTER COLUMN "category" TYPE "RecipeCategory_new" USING ("category"::text::"RecipeCategory_new");

-- Drop old enum
DROP TYPE "RecipeCategory";

-- Rename new enum to original name
ALTER TYPE "RecipeCategory_new" RENAME TO "RecipeCategory";
