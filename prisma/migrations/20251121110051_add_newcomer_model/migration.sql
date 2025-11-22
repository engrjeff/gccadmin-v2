-- CreateTable
CREATE TABLE "public"."NewComer" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "gender" "public"."Gender" NOT NULL,
    "memberType" "public"."MemberType" NOT NULL DEFAULT 'UNCATEGORIZED',
    "contactNo" TEXT,
    "email" TEXT,
    "address" TEXT,
    "attendanceId" TEXT NOT NULL,
    "invitedById" TEXT,
    "attendedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "NewComer_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "NewComer_attendanceId_idx" ON "public"."NewComer"("attendanceId");

-- CreateIndex
CREATE INDEX "NewComer_invitedById_idx" ON "public"."NewComer"("invitedById");

-- AddForeignKey
ALTER TABLE "public"."NewComer" ADD CONSTRAINT "NewComer_attendanceId_fkey" FOREIGN KEY ("attendanceId") REFERENCES "public"."Attendance"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."NewComer" ADD CONSTRAINT "NewComer_invitedById_fkey" FOREIGN KEY ("invitedById") REFERENCES "public"."Disciple"("id") ON DELETE SET NULL ON UPDATE CASCADE;
