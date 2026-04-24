-- AlterTable
ALTER TABLE "Ingredient" ALTER COLUMN "order" DROP DEFAULT;

-- AlterTable
ALTER TABLE "RecipePhoto" ADD COLUMN     "positionY" INTEGER NOT NULL DEFAULT 50;

-- DropEnum
DROP TYPE "TagType";
