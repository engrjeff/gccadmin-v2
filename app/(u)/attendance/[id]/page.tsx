import { format } from "date-fns";
import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { Suspense } from "react";
import { Gender } from "@/app/generated/prisma";
import { Badge } from "@/components/ui/badge";
import { AttendanceChecklistForm } from "@/features/attendance/attendance-checklist-form";
import { AttendanceChecklistSubmitButton } from "@/features/attendance/attendance-checklist-submit-button";
import { AttendanceChecklistTabs } from "@/features/attendance/attendance-checklist-tabs";
import { AttendanceRecordMenu } from "@/features/attendance/attendance-record-menu";
import { AttendanceRecordStatistics } from "@/features/attendance/attendance-record-statistics";
import { ChurchLeadersTable } from "@/features/attendance/church-leaders-table";
import { ChurchMembersFilters } from "@/features/attendance/church-members-filters";
import { ChurchMembersTable } from "@/features/attendance/church-members-table";
import { NewComersTable } from "@/features/attendance/new-comers-table";
import { getAttendanceRecordById } from "@/features/attendance/queries";
import { ReturneesTable } from "@/features/attendance/returnees-table";
import { removeUnderscores } from "@/lib/utils";

type View = Gender | "NewComers" | "Leaders" | "Returnees";
interface PageProps {
  params: Promise<{ id: string }>;
  searchParams: Promise<{
    view?: View;
  }>;
}

export const generateMetadata = async (props: PageProps): Promise<Metadata> => {
  const params = await props.params;

  const { attendanceRecord } = await getAttendanceRecordById(params.id);

  return {
    title: `Attendance | ${attendanceRecord?.title || "Not Found"}`,
  };
};

function SwitchTable({
  currentView,
  attendanceId,
}: {
  currentView: View;
  attendanceId: string;
}) {
  if (currentView === "Leaders") return <ChurchLeadersTable />;

  if (currentView === "NewComers") return <NewComersTable />;

  if (currentView === Gender.MALE)
    return <ChurchMembersTable gender={Gender.MALE} />;

  if (currentView === Gender.FEMALE)
    return <ChurchMembersTable gender={Gender.FEMALE} />;

  if (currentView === "Returnees")
    return <ReturneesTable currentAttendanceId={attendanceId} />;

  return null;
}

async function AttendanceItemPage(props: PageProps) {
  const params = await props.params;
  const searchParams = await props.searchParams;

  const { attendanceRecord } = await getAttendanceRecordById(params.id);

  if (!attendanceRecord) {
    return notFound();
  }

  const currentView = searchParams.view ?? "Leaders";

  const newComers = attendanceRecord.newComers?.filter(
    (nc) => nc.attendances.length <= 1,
  );

  const returnees = attendanceRecord.newComers?.filter(
    (nc) => nc.attendances.length > 1,
  );

  return (
    <div className="flex max-w-6xl flex-1 flex-col gap-4 p-4">
      <Link href="/attendance" className="inline-block text-sm hover:underline">
        &larr; Back to List
      </Link>
      <div className="flex items-center gap-4">
        <div>
          <h2 className="font-bold">{attendanceRecord.title}</h2>
          <p className="text-muted-foreground text-xs">
            {format(attendanceRecord.date, "MMMM dd, yyyy")}
          </p>
          <Badge variant={attendanceRecord.type} className="text-[10px]">
            {removeUnderscores(attendanceRecord.type)}
          </Badge>
          {attendanceRecord.tags?.at(0) ? (
            <Badge variant={attendanceRecord.type} className="ml-1 text-[10px]">
              {attendanceRecord.tags?.at(0)}
            </Badge>
          ) : null}
        </div>
        <div className="ml-auto flex items-center gap-3">
          <AttendanceRecordMenu
            attendanceId={attendanceRecord.id}
            attendanceTitle={attendanceRecord.title}
          />
        </div>
      </div>
      <AttendanceRecordStatistics id={attendanceRecord.id} />
      <AttendanceChecklistForm
        attendanceId={attendanceRecord.id}
        defaultAttendees={attendanceRecord.attendees}
        defaultNewComers={newComers}
        defaultReturnees={returnees}
      >
        <Suspense>
          <div className="flex items-center justify-between gap-4">
            <AttendanceChecklistTabs />
            <AttendanceChecklistSubmitButton />
          </div>
          <ChurchMembersFilters key={JSON.stringify(searchParams)} />
          <SwitchTable
            attendanceId={attendanceRecord.id}
            currentView={currentView}
          />
        </Suspense>
      </AttendanceChecklistForm>
    </div>
  );
}

export default AttendanceItemPage;
