/*
  Warnings:

  - A unique constraint covering the columns `[discipleProfileId]` on the table `NewComer` will be added. If there are existing duplicate values, this will fail.

*/
-- AlterTable
ALTER TABLE "public"."NewComer" ADD COLUMN     "discipleId" TEXT,
ADD COLUMN     "discipleProfileId" TEXT;

-- CreateIndex
CREATE UNIQUE INDEX "NewComer_discipleProfileId_key" ON "public"."NewComer"("discipleProfileId");

-- AddForeignKey
ALTER TABLE "public"."NewComer" ADD CONSTRAINT "NewComer_discipleProfileId_fkey" FOREIGN KEY ("discipleProfileId") REFERENCES "public"."Disciple"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."NewComer" ADD CONSTRAINT "NewComer_discipleId_fkey" FOREIGN KEY ("discipleId") REFERENCES "public"."Disciple"("id") ON DELETE SET NULL ON UPDATE CASCADE;
