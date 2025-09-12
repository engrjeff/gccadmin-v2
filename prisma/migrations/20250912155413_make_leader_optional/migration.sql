-- DropForeignKey
ALTER TABLE "public"."Disciple" DROP CONSTRAINT "Disciple_leaderId_fkey";

-- AlterTable
ALTER TABLE "public"."Disciple" ALTER COLUMN "leaderId" DROP NOT NULL;

-- AddForeignKey
ALTER TABLE "public"."Disciple" ADD CONSTRAINT "Disciple_leaderId_fkey" FOREIGN KEY ("leaderId") REFERENCES "public"."Disciple"("id") ON DELETE SET NULL ON UPDATE CASCADE;
