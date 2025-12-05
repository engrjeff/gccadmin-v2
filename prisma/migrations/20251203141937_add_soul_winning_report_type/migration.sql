-- CreateEnum
CREATE TYPE "public"."SoulWinningReportType" AS ENUM ('SOUL_WINNING', 'CONSOLIDATION');

-- AlterTable
ALTER TABLE "public"."SoulWinningReport" ADD COLUMN     "type" "public"."SoulWinningReportType" NOT NULL DEFAULT 'SOUL_WINNING';
