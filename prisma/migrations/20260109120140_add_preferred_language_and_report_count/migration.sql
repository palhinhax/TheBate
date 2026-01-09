-- AlterTable
ALTER TABLE "Topic" ADD COLUMN     "reportCount" INTEGER NOT NULL DEFAULT 0;

-- AlterTable
ALTER TABLE "User" ADD COLUMN     "preferredLanguage" TEXT NOT NULL DEFAULT 'pt';

-- CreateIndex
CREATE INDEX "Topic_reportCount_idx" ON "Topic"("reportCount" DESC);
