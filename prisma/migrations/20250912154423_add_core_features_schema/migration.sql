-- CreateEnum
CREATE TYPE "public"."Role" AS ENUM ('USER', 'ADMIN');

-- CreateEnum
CREATE TYPE "public"."Gender" AS ENUM ('MALE', 'FEMALE');

-- CreateEnum
CREATE TYPE "public"."MemberType" AS ENUM ('UNCATEGORIZED', 'KIDS', 'MEN', 'WOMEN', 'YOUTH', 'YOUNGPRO');

-- CreateEnum
CREATE TYPE "public"."ChurchStatus" AS ENUM ('NACS', 'ACS', 'REGULAR');

-- CreateEnum
CREATE TYPE "public"."CellStatus" AS ENUM ('FIRST_TIMER', 'SECOND_TIMER', 'THIRD_TIMER', 'REGULAR');

-- CreateEnum
CREATE TYPE "public"."ProcessLevel" AS ENUM ('NONE', 'PREENC', 'ENCOUNTER', 'LEADERSHIP_1', 'LEADERSHIP_2', 'LEADERSHIP_3');

-- CreateEnum
CREATE TYPE "public"."CellType" AS ENUM ('SOULWINNING', 'OPEN', 'DISCIPLESHIP');

-- CreateEnum
CREATE TYPE "public"."ProcessLevelStatus" AS ENUM ('NOT_STARTED', 'ON_GOING', 'PENDING_REQUIREMENTS', 'FINISHED', 'UNFINISHED', 'DROPPED');

-- CreateTable
CREATE TABLE "public"."User" (
    "id" TEXT NOT NULL,
    "clerkId" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "role" "public"."Role" NOT NULL DEFAULT 'USER',
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "User_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."Disciple" (
    "id" TEXT NOT NULL,
    "userAccountId" TEXT,
    "name" TEXT NOT NULL,
    "address" TEXT NOT NULL,
    "birthdate" TIMESTAMP(3) NOT NULL,
    "gender" "public"."Gender" NOT NULL,
    "isPrimary" BOOLEAN NOT NULL DEFAULT false,
    "isActive" BOOLEAN NOT NULL DEFAULT true,
    "isDeleted" BOOLEAN NOT NULL DEFAULT false,
    "isMyPrimary" BOOLEAN NOT NULL DEFAULT false,
    "leaderId" TEXT NOT NULL,
    "memberType" "public"."MemberType" NOT NULL DEFAULT 'UNCATEGORIZED',
    "processLevel" "public"."ProcessLevel" NOT NULL DEFAULT 'NONE',
    "cellStatus" "public"."CellStatus" NOT NULL DEFAULT 'FIRST_TIMER',
    "churchStatus" "public"."ChurchStatus" NOT NULL DEFAULT 'NACS',
    "processLevelStatus" "public"."ProcessLevelStatus" NOT NULL DEFAULT 'NOT_STARTED',
    "handledById" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Disciple_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."LessonSeries" (
    "id" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "description" TEXT,
    "tags" TEXT[],
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "LessonSeries_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."Lesson" (
    "id" TEXT NOT NULL,
    "lessonSeriesId" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "description" TEXT,
    "fileUrl" TEXT,
    "scriptureReferences" TEXT[],
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Lesson_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."CellReport" (
    "id" TEXT NOT NULL,
    "type" "public"."CellType" NOT NULL DEFAULT 'OPEN',
    "venue" TEXT NOT NULL,
    "date" TIMESTAMP(3) NOT NULL,
    "time" TEXT NOT NULL,
    "lessonId" TEXT,
    "lessonTitle" TEXT,
    "hasCustomLesson" BOOLEAN NOT NULL DEFAULT false,
    "scriptureReferences" TEXT[],
    "assistantId" TEXT,
    "leaderId" TEXT NOT NULL,
    "worship" TEXT[],
    "work" TEXT[],
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "CellReport_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."CellReportAttendeeSnapshot" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "status" "public"."CellStatus" NOT NULL,
    "cellReportId" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "CellReportAttendeeSnapshot_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."ProcessLessonSeries" (
    "id" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "description" TEXT,
    "tags" TEXT[],
    "processLevel" "public"."ProcessLevel" NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "ProcessLessonSeries_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."ProcessLesson" (
    "id" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "description" TEXT,
    "fileUrl" TEXT,
    "scriptureReferences" TEXT[],
    "processLessonSeriesId" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "ProcessLesson_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."_attendedCellGroups" (
    "A" TEXT NOT NULL,
    "B" TEXT NOT NULL,

    CONSTRAINT "_attendedCellGroups_AB_pkey" PRIMARY KEY ("A","B")
);

-- CreateIndex
CREATE UNIQUE INDEX "User_clerkId_key" ON "public"."User"("clerkId");

-- CreateIndex
CREATE UNIQUE INDEX "User_email_key" ON "public"."User"("email");

-- CreateIndex
CREATE UNIQUE INDEX "Disciple_userAccountId_key" ON "public"."Disciple"("userAccountId");

-- CreateIndex
CREATE INDEX "Disciple_id_leaderId_idx" ON "public"."Disciple"("id", "leaderId");

-- CreateIndex
CREATE INDEX "Disciple_leaderId_idx" ON "public"."Disciple"("leaderId");

-- CreateIndex
CREATE INDEX "Disciple_userAccountId_idx" ON "public"."Disciple"("userAccountId");

-- CreateIndex
CREATE INDEX "Disciple_handledById_idx" ON "public"."Disciple"("handledById");

-- CreateIndex
CREATE INDEX "Disciple_isPrimary_idx" ON "public"."Disciple"("isPrimary");

-- CreateIndex
CREATE INDEX "Disciple_isActive_idx" ON "public"."Disciple"("isActive");

-- CreateIndex
CREATE INDEX "Lesson_lessonSeriesId_idx" ON "public"."Lesson"("lessonSeriesId");

-- CreateIndex
CREATE INDEX "CellReport_leaderId_idx" ON "public"."CellReport"("leaderId");

-- CreateIndex
CREATE INDEX "CellReport_assistantId_idx" ON "public"."CellReport"("assistantId");

-- CreateIndex
CREATE INDEX "CellReport_lessonId_idx" ON "public"."CellReport"("lessonId");

-- CreateIndex
CREATE INDEX "CellReportAttendeeSnapshot_cellReportId_idx" ON "public"."CellReportAttendeeSnapshot"("cellReportId");

-- CreateIndex
CREATE INDEX "ProcessLesson_processLessonSeriesId_idx" ON "public"."ProcessLesson"("processLessonSeriesId");

-- CreateIndex
CREATE INDEX "_attendedCellGroups_B_index" ON "public"."_attendedCellGroups"("B");

-- AddForeignKey
ALTER TABLE "public"."Disciple" ADD CONSTRAINT "Disciple_userAccountId_fkey" FOREIGN KEY ("userAccountId") REFERENCES "public"."User"("clerkId") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."Disciple" ADD CONSTRAINT "Disciple_leaderId_fkey" FOREIGN KEY ("leaderId") REFERENCES "public"."Disciple"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."Disciple" ADD CONSTRAINT "Disciple_handledById_fkey" FOREIGN KEY ("handledById") REFERENCES "public"."Disciple"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."Lesson" ADD CONSTRAINT "Lesson_lessonSeriesId_fkey" FOREIGN KEY ("lessonSeriesId") REFERENCES "public"."LessonSeries"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."CellReport" ADD CONSTRAINT "CellReport_lessonId_fkey" FOREIGN KEY ("lessonId") REFERENCES "public"."Lesson"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."CellReport" ADD CONSTRAINT "CellReport_assistantId_fkey" FOREIGN KEY ("assistantId") REFERENCES "public"."Disciple"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."CellReport" ADD CONSTRAINT "CellReport_leaderId_fkey" FOREIGN KEY ("leaderId") REFERENCES "public"."Disciple"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."CellReportAttendeeSnapshot" ADD CONSTRAINT "CellReportAttendeeSnapshot_cellReportId_fkey" FOREIGN KEY ("cellReportId") REFERENCES "public"."CellReport"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."ProcessLesson" ADD CONSTRAINT "ProcessLesson_processLessonSeriesId_fkey" FOREIGN KEY ("processLessonSeriesId") REFERENCES "public"."ProcessLessonSeries"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."_attendedCellGroups" ADD CONSTRAINT "_attendedCellGroups_A_fkey" FOREIGN KEY ("A") REFERENCES "public"."CellReport"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."_attendedCellGroups" ADD CONSTRAINT "_attendedCellGroups_B_fkey" FOREIGN KEY ("B") REFERENCES "public"."Disciple"("id") ON DELETE CASCADE ON UPDATE CASCADE;
