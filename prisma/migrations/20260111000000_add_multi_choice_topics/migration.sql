-- Migration: Add Multi-Choice Topics Support
-- Description: Adds support for multi-choice voting topics with options

-- 1. Add TopicType enum
CREATE TYPE "TopicType" AS ENUM ('YES_NO', 'MULTI_CHOICE');

-- 2. Add new fields to Topic table
ALTER TABLE "Topic" ADD COLUMN "type" "TopicType" NOT NULL DEFAULT 'YES_NO';
ALTER TABLE "Topic" ADD COLUMN "allowMultipleVotes" BOOLEAN NOT NULL DEFAULT false;
ALTER TABLE "Topic" ADD COLUMN "maxChoices" INTEGER NOT NULL DEFAULT 1;

-- 3. Create TopicOption table
CREATE TABLE "TopicOption" (
    "id" TEXT NOT NULL,
    "label" TEXT NOT NULL,
    "description" TEXT,
    "order" INTEGER NOT NULL DEFAULT 0,
    "topicId" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "TopicOption_pkey" PRIMARY KEY ("id")
);

-- 4. Update TopicVote table to support options
ALTER TABLE "TopicVote" ALTER COLUMN "vote" DROP NOT NULL;
ALTER TABLE "TopicVote" ADD COLUMN "optionId" TEXT;
ALTER TABLE "TopicVote" ADD CONSTRAINT "TopicVote_optionId_fkey" FOREIGN KEY ("optionId") REFERENCES "TopicOption"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- 5. Update Comment table to support option association
ALTER TABLE "Comment" ADD COLUMN "optionId" TEXT;
ALTER TABLE "Comment" ADD CONSTRAINT "Comment_optionId_fkey" FOREIGN KEY ("optionId") REFERENCES "TopicOption"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- 6. Drop old unique constraint and add new one
ALTER TABLE "TopicVote" DROP CONSTRAINT "TopicVote_userId_topicId_key";
ALTER TABLE "TopicVote" ADD CONSTRAINT "TopicVote_userId_topicId_optionId_key" UNIQUE("userId", "topicId", "optionId");

-- 7. Create indexes
CREATE INDEX "Topic_type_idx" ON "Topic"("type");
CREATE INDEX "TopicOption_topicId_order_idx" ON "TopicOption"("topicId", "order");
CREATE INDEX "TopicOption_topicId_idx" ON "TopicOption"("topicId");
CREATE INDEX "TopicVote_optionId_idx" ON "TopicVote"("optionId");
CREATE INDEX "Comment_topicId_optionId_idx" ON "Comment"("topicId", "optionId");

-- 8. Add foreign key constraint for TopicOption
ALTER TABLE "TopicOption" ADD CONSTRAINT "TopicOption_topicId_fkey" FOREIGN KEY ("topicId") REFERENCES "Topic"("id") ON DELETE CASCADE ON UPDATE CASCADE;
