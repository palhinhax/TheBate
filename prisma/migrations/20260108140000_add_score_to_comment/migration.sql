-- AlterTable
-- Add score column to Comment table if it doesn't exist
-- This handles cases where the database was created before the score column was added
DO $$ 
BEGIN
    IF NOT EXISTS (
        SELECT 1 
        FROM information_schema.columns 
        WHERE table_schema = 'public'
        AND table_name = 'Comment' 
        AND column_name = 'score'
    ) THEN
        ALTER TABLE "Comment" ADD COLUMN "score" INTEGER NOT NULL DEFAULT 0;
    END IF;
END $$;

-- Create index on (topicId, score) if it doesn't exist
-- This handles cases where the column exists but the index doesn't
CREATE INDEX IF NOT EXISTS "Comment_topicId_score_idx" ON "Comment"("topicId", "score" DESC);
