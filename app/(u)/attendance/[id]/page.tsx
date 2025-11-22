import { format } from "date-fns";
import { CheckIcon, SettingsIcon } from "lucide-react";
import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { Suspense } from "react";
import { Gender } from "@/app/generated/prisma";
import { Button } from "@/components/ui/button";
import { SubmitButton } from "@/components/ui/submit-button";
import { AttendanceChecklist } from "@/features/attendance/attendance-checklist";
import { AttendanceChecklistForm } from "@/features/attendance/attendance-checklist-form";
import { ChurchMembersFilters } from "@/features/attendance/church-members-filters";
import { ChurchMembersTable } from "@/features/attendance/church-members-table";
import { NewComersTable } from "@/features/attendance/new-comers-table";
import { getAttendanceRecordById } from "@/features/attendance/queries";

interface PageProps {
  params: Promise<{ id: string }>;
  searchParams: Promise<{ view?: Gender | "NewComers" }>;
}

export const generateMetadata = async (props: PageProps): Promise<Metadata> => {
  const params = await props.params;

  const { attendanceRecord } = await getAttendanceRecordById(params.id);

  return {
    title: `Attendance | ${attendanceRecord?.title || "Not Found"}`,
  };
};

async function AttendanceItemPage(props: PageProps) {
  const params = await props.params;
  const searchParams = await props.searchParams;

  const { attendanceRecord } = await getAttendanceRecordById(params.id);

  if (!attendanceRecord) {
    return notFound();
  }

  const currentView = searchParams.view ?? Gender.MALE;

  return (
    <div className="flex flex-1 flex-col gap-4 p-4">
      <Link href="/attendance" className="inline-block text-sm hover:underline">
        &larr; Back to List
      </Link>
      <AttendanceChecklistForm attendanceId={attendanceRecord.id}>
        <div className="flex items-center gap-4">
          <div>
            <h2 className="font-bold">{attendanceRecord.title}</h2>
            <p className="text-muted-foreground text-xs">
              {format(attendanceRecord.date, "MMMM dd, yyyy")}
            </p>
          </div>
          <div className="ml-auto flex items-center gap-3">
            <SubmitButton size="sm">
              <CheckIcon /> Save
            </SubmitButton>
            <Button
              type="button"
              variant="outline"
              size="iconSm"
              aria-label="Update attendance"
            >
              <SettingsIcon />
            </Button>
          </div>
        </div>
        <div className="flex items-center justify-between gap-4">
          <Suspense>
            <AttendanceChecklist />
            {currentView === "NewComers" ? null : <ChurchMembersFilters />}
          </Suspense>
        </div>
        {currentView === "NewComers" ? (
          <NewComersTable />
        ) : (
          <ChurchMembersTable gender={currentView} />
        )}
      </AttendanceChecklistForm>
    </div>
  );
}

export default AttendanceItemPage;
