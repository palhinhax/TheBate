/*
  Warnings:

  - Changed the type of `name` on the `Achievement` table. No cast exists, the column would be dropped and recreated, which cannot be done if there is data, since the column is required.
  - Changed the type of `description` on the `Achievement` table. No cast exists, the column would be dropped and recreated, which cannot be done if there is data, since the column is required.

*/
-- AlterTable
ALTER TABLE "Achievement" DROP COLUMN "name",
ADD COLUMN     "name" JSONB NOT NULL,
DROP COLUMN "description",
ADD COLUMN     "description" JSONB NOT NULL;
