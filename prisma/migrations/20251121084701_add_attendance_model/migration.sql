-- CreateEnum
CREATE TYPE "public"."AttendanceType" AS ENUM ('SUNDAY_SERVICE', 'EVENT');

-- CreateTable
CREATE TABLE "public"."Attendance" (
    "id" TEXT NOT NULL,
    "date" TIMESTAMP(3) NOT NULL,
    "type" "public"."AttendanceType" NOT NULL DEFAULT 'SUNDAY_SERVICE',
    "tags" TEXT[],
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Attendance_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."_AttendanceToDisciple" (
    "A" TEXT NOT NULL,
    "B" TEXT NOT NULL,

    CONSTRAINT "_AttendanceToDisciple_AB_pkey" PRIMARY KEY ("A","B")
);

-- CreateIndex
CREATE INDEX "_AttendanceToDisciple_B_index" ON "public"."_AttendanceToDisciple"("B");

-- AddForeignKey
ALTER TABLE "public"."_AttendanceToDisciple" ADD CONSTRAINT "_AttendanceToDisciple_A_fkey" FOREIGN KEY ("A") REFERENCES "public"."Attendance"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."_AttendanceToDisciple" ADD CONSTRAINT "_AttendanceToDisciple_B_fkey" FOREIGN KEY ("B") REFERENCES "public"."Disciple"("id") ON DELETE CASCADE ON UPDATE CASCADE;
