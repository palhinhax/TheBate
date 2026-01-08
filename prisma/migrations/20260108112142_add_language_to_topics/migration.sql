-- AlterTable
ALTER TABLE "Topic" ADD COLUMN     "language" TEXT NOT NULL DEFAULT 'pt';

-- CreateIndex
CREATE INDEX "Topic_language_idx" ON "Topic"("language");
