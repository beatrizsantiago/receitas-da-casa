-- AlterTable
-- Existing recipes stay public (matches current behavior); new recipes default to private.
ALTER TABLE "Recipe" ADD COLUMN "isPublic" BOOLEAN NOT NULL DEFAULT true;
ALTER TABLE "Recipe" ALTER COLUMN "isPublic" SET DEFAULT false;
