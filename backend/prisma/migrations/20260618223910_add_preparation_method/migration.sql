-- DropForeignKey
ALTER TABLE "Step" DROP CONSTRAINT "Step_recipeId_fkey";

-- DropIndex
DROP INDEX "Step_recipeId_idx";

-- DropIndex
DROP INDEX "Step_recipeId_order_key";

-- CreateTable
CREATE TABLE "PreparationMethod" (
    "id" SERIAL NOT NULL,
    "title" TEXT,
    "order" INTEGER NOT NULL,
    "recipeId" INTEGER NOT NULL,

    CONSTRAINT "PreparationMethod_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "PreparationMethod_recipeId_idx" ON "PreparationMethod"("recipeId");

-- CreateIndex
CREATE UNIQUE INDEX "PreparationMethod_recipeId_order_key" ON "PreparationMethod"("recipeId", "order");

-- AddForeignKey
ALTER TABLE "PreparationMethod" ADD CONSTRAINT "PreparationMethod_recipeId_fkey" FOREIGN KEY ("recipeId") REFERENCES "Recipe"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- Adiciona como nullable para permitir a migração dos dados existentes
ALTER TABLE "Step" ADD COLUMN "preparationMethodId" INTEGER;

-- Cria um PreparationMethod padrão para cada receita que já tem steps
INSERT INTO "PreparationMethod" ("title", "order", "recipeId")
SELECT DISTINCT NULL, 1, "recipeId" FROM "Step";

-- Aponta os steps existentes para o PreparationMethod recém-criado
UPDATE "Step" s
SET "preparationMethodId" = pm."id"
FROM "PreparationMethod" pm
WHERE pm."recipeId" = s."recipeId";

-- Agora que todos os registros têm valor, torna NOT NULL
ALTER TABLE "Step" ALTER COLUMN "preparationMethodId" SET NOT NULL;

-- Remove a coluna antiga
ALTER TABLE "Step" DROP COLUMN "recipeId";

-- CreateIndex
CREATE INDEX "Step_preparationMethodId_idx" ON "Step"("preparationMethodId");

-- CreateIndex
CREATE UNIQUE INDEX "Step_preparationMethodId_order_key" ON "Step"("preparationMethodId", "order");

-- AddForeignKey
ALTER TABLE "Step" ADD CONSTRAINT "Step_preparationMethodId_fkey" FOREIGN KEY ("preparationMethodId") REFERENCES "PreparationMethod"("id") ON DELETE CASCADE ON UPDATE CASCADE;
