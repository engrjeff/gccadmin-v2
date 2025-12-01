/*
  Warnings:

  - You are about to drop the column `attendanceId` on the `NewComer` table. All the data in the column will be lost.

*/
-- DropForeignKey
ALTER TABLE "public"."NewComer" DROP CONSTRAINT "NewComer_attendanceId_fkey";

-- DropIndex
DROP INDEX "public"."NewComer_attendanceId_idx";

-- AlterTable
ALTER TABLE "public"."NewComer" DROP COLUMN "attendanceId";

-- CreateTable
CREATE TABLE "public"."_AttendanceToNewComer" (
    "A" TEXT NOT NULL,
    "B" TEXT NOT NULL,

    CONSTRAINT "_AttendanceToNewComer_AB_pkey" PRIMARY KEY ("A","B")
);

-- CreateIndex
CREATE INDEX "_AttendanceToNewComer_B_index" ON "public"."_AttendanceToNewComer"("B");

-- AddForeignKey
ALTER TABLE "public"."_AttendanceToNewComer" ADD CONSTRAINT "_AttendanceToNewComer_A_fkey" FOREIGN KEY ("A") REFERENCES "public"."Attendance"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."_AttendanceToNewComer" ADD CONSTRAINT "_AttendanceToNewComer_B_fkey" FOREIGN KEY ("B") REFERENCES "public"."NewComer"("id") ON DELETE CASCADE ON UPDATE CASCADE;
