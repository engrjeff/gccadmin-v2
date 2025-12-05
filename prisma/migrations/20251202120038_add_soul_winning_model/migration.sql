/*
  Warnings:

  - You are about to drop the column `discipleId` on the `NewComer` table. All the data in the column will be lost.

*/
-- DropForeignKey
ALTER TABLE "public"."NewComer" DROP CONSTRAINT "NewComer_discipleId_fkey";

-- AlterTable
ALTER TABLE "public"."NewComer" DROP COLUMN "discipleId";

-- CreateTable
CREATE TABLE "public"."NewBeliever" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "gender" "public"."Gender" NOT NULL,
    "memberType" "public"."MemberType" NOT NULL DEFAULT 'UNCATEGORIZED',
    "networkLeaderId" TEXT NOT NULL,
    "handledById" TEXT,
    "contactNo" TEXT,
    "email" TEXT,
    "address" TEXT,
    "discipleProfileId" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "NewBeliever_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."SoulWinningReport" (
    "id" TEXT NOT NULL,
    "venue" TEXT NOT NULL,
    "date" TIMESTAMP(3) NOT NULL,
    "lessonId" TEXT NOT NULL,
    "networkLeaderId" TEXT NOT NULL,
    "assistantLeaderId" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "SoulWinningReport_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."_NewBelieverToSoulWinningReport" (
    "A" TEXT NOT NULL,
    "B" TEXT NOT NULL,

    CONSTRAINT "_NewBelieverToSoulWinningReport_AB_pkey" PRIMARY KEY ("A","B")
);

-- CreateIndex
CREATE UNIQUE INDEX "NewBeliever_discipleProfileId_key" ON "public"."NewBeliever"("discipleProfileId");

-- CreateIndex
CREATE INDEX "SoulWinningReport_lessonId_idx" ON "public"."SoulWinningReport"("lessonId");

-- CreateIndex
CREATE INDEX "SoulWinningReport_networkLeaderId_idx" ON "public"."SoulWinningReport"("networkLeaderId");

-- CreateIndex
CREATE INDEX "SoulWinningReport_assistantLeaderId_idx" ON "public"."SoulWinningReport"("assistantLeaderId");

-- CreateIndex
CREATE INDEX "_NewBelieverToSoulWinningReport_B_index" ON "public"."_NewBelieverToSoulWinningReport"("B");

-- AddForeignKey
ALTER TABLE "public"."NewBeliever" ADD CONSTRAINT "NewBeliever_networkLeaderId_fkey" FOREIGN KEY ("networkLeaderId") REFERENCES "public"."Disciple"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."NewBeliever" ADD CONSTRAINT "NewBeliever_handledById_fkey" FOREIGN KEY ("handledById") REFERENCES "public"."Disciple"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."NewBeliever" ADD CONSTRAINT "NewBeliever_discipleProfileId_fkey" FOREIGN KEY ("discipleProfileId") REFERENCES "public"."Disciple"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."SoulWinningReport" ADD CONSTRAINT "SoulWinningReport_lessonId_fkey" FOREIGN KEY ("lessonId") REFERENCES "public"."Lesson"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."SoulWinningReport" ADD CONSTRAINT "SoulWinningReport_networkLeaderId_fkey" FOREIGN KEY ("networkLeaderId") REFERENCES "public"."Disciple"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."SoulWinningReport" ADD CONSTRAINT "SoulWinningReport_assistantLeaderId_fkey" FOREIGN KEY ("assistantLeaderId") REFERENCES "public"."Disciple"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."_NewBelieverToSoulWinningReport" ADD CONSTRAINT "_NewBelieverToSoulWinningReport_A_fkey" FOREIGN KEY ("A") REFERENCES "public"."NewBeliever"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."_NewBelieverToSoulWinningReport" ADD CONSTRAINT "_NewBelieverToSoulWinningReport_B_fkey" FOREIGN KEY ("B") REFERENCES "public"."SoulWinningReport"("id") ON DELETE CASCADE ON UPDATE CASCADE;
