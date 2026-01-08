/*
  Warnings:

  - You are about to drop the column `score` on the `Comment` table. All the data in the column will be lost.

*/
-- DropIndex
DROP INDEX "Comment_topicId_score_idx";

-- AlterTable
ALTER TABLE "Comment" DROP COLUMN "score";
