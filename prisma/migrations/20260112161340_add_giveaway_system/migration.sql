-- CreateEnum
CREATE TYPE "GiveawayStatus" AS ENUM ('DRAFT', 'ACTIVE', 'ENDED', 'WINNER_SELECTED');

-- CreateTable
CREATE TABLE "Giveaway" (
    "id" TEXT NOT NULL,
    "title" JSONB NOT NULL,
    "description" JSONB NOT NULL,
    "prize" TEXT NOT NULL,
    "status" "GiveawayStatus" NOT NULL DEFAULT 'DRAFT',
    "startDate" TIMESTAMP(3) NOT NULL,
    "endDate" TIMESTAMP(3) NOT NULL,
    "winnerId" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Giveaway_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "GiveawayEntry" (
    "id" TEXT NOT NULL,
    "giveawayId" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "hasVoted" BOOLEAN NOT NULL DEFAULT false,
    "hasCommented" BOOLEAN NOT NULL DEFAULT false,
    "enteredAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "GiveawayEntry_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "Giveaway_status_idx" ON "Giveaway"("status");

-- CreateIndex
CREATE INDEX "Giveaway_winnerId_idx" ON "Giveaway"("winnerId");

-- CreateIndex
CREATE INDEX "GiveawayEntry_giveawayId_idx" ON "GiveawayEntry"("giveawayId");

-- CreateIndex
CREATE INDEX "GiveawayEntry_userId_idx" ON "GiveawayEntry"("userId");

-- CreateIndex
CREATE INDEX "GiveawayEntry_hasVoted_idx" ON "GiveawayEntry"("hasVoted");

-- CreateIndex
CREATE UNIQUE INDEX "GiveawayEntry_giveawayId_userId_key" ON "GiveawayEntry"("giveawayId", "userId");

-- AddForeignKey
ALTER TABLE "Giveaway" ADD CONSTRAINT "Giveaway_winnerId_fkey" FOREIGN KEY ("winnerId") REFERENCES "User"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "GiveawayEntry" ADD CONSTRAINT "GiveawayEntry_giveawayId_fkey" FOREIGN KEY ("giveawayId") REFERENCES "Giveaway"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "GiveawayEntry" ADD CONSTRAINT "GiveawayEntry_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;
