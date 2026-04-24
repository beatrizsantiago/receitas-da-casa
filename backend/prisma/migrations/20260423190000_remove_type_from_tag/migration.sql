-- Drop the erroneous 'type' column that was added to Tag but doesn't exist in the Prisma schema
ALTER TABLE "Tag" DROP COLUMN IF EXISTS "type";

-- Ensure the unique constraint on name exists (Prisma schema defines it as @unique)
DO $$
BEGIN
    IF NOT EXISTS (
        SELECT 1 FROM pg_indexes
        WHERE tablename = 'Tag' AND indexdef LIKE '%"name"%'
    ) THEN
        CREATE UNIQUE INDEX "Tag_name_key" ON "Tag"("name");
    END IF;
END $$;
