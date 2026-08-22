-- DropForeignKey
ALTER TABLE "Recipe" DROP CONSTRAINT "Recipe_userId_fkey";

-- DropIndex
DROP INDEX "Recipe_userId_idx";

-- AlterTable
ALTER TABLE "Recipe" DROP COLUMN "userId";
