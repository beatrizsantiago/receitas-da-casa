BEGIN;

-- AlterTable CookHistory
ALTER TABLE "CookHistory" DROP COLUMN "rating";

-- AlterTable RecipeNote
ALTER TABLE "RecipeNote" DROP COLUMN "description",
DROP COLUMN "priority",
ADD COLUMN "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP;

COMMIT;
