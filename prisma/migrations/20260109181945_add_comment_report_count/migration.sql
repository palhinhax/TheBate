-- AlterTable
ALTER TABLE "Comment" ADD COLUMN     "reportCount" INTEGER NOT NULL DEFAULT 0;

-- CreateIndex
CREATE INDEX "Comment_reportCount_idx" ON "Comment"("reportCount" DESC);
