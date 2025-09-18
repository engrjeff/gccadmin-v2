/*
  Warnings:

  - Added the required column `churchStatus` to the `CellReportAttendeeSnapshot` table without a default value. This is not possible if the table is not empty.
  - Added the required column `discipleId` to the `CellReportAttendeeSnapshot` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "public"."CellReportAttendeeSnapshot" ADD COLUMN     "churchStatus" "public"."ChurchStatus" NOT NULL,
ADD COLUMN     "discipleId" TEXT NOT NULL;

-- CreateIndex
CREATE INDEX "CellReportAttendeeSnapshot_discipleId_idx" ON "public"."CellReportAttendeeSnapshot"("discipleId");
