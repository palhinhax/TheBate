-- CreateEnum for comment side
CREATE TYPE "CommentSide" AS ENUM ('AFAVOR', 'CONTRA');

-- CreateEnum for theme vote
CREATE TYPE "ThemeVote" AS ENUM ('SIM', 'NAO', 'DEPENDE');

-- Add side column to Comment (nullable for existing comments and replies)
ALTER TABLE "Comment" ADD COLUMN "side" "CommentSide";

-- Add index for comment side filtering
CREATE INDEX "Comment_topicId_side_idx" ON "Comment"("topicId", "side");

-- Update TopicVote table structure
-- First, add the new vote column (nullable initially)
ALTER TABLE "TopicVote" ADD COLUMN "vote" "ThemeVote";

-- Add updatedAt column to TopicVote
ALTER TABLE "TopicVote" ADD COLUMN "updatedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP;

-- Drop the old value column (safe since TopicVote wasn't actively used)
ALTER TABLE "TopicVote" DROP COLUMN IF EXISTS "value";

-- Make vote column NOT NULL
ALTER TABLE "TopicVote" ALTER COLUMN "vote" SET NOT NULL;
