/*
  Warnings:

  - Changed the type of `body` on the `Poem` table. No cast exists, the column would be dropped and recreated, which cannot be done if there is data, since the column is required.

*/
-- AlterTable
ALTER TABLE "Poem" DROP COLUMN "body",
ADD COLUMN     "body" JSONB NOT NULL;
