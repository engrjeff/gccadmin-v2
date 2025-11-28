import { PackageIcon } from "lucide-react";
import type { Metadata } from "next";
import { SearchField } from "@/components/ui/search-field";
import { AttendanceCard } from "@/features/attendance/attendance-card";
import { AttendanceFormDialog } from "@/features/attendance/attendance-form-dialog";
import {
  type GetAttendanceRecordsQueryArgs,
  getAttendanceRecords,
} from "@/features/attendance/queries";

export const metadata: Metadata = {
  title: "Attendance",
};

interface PageProps {
  searchParams: Promise<GetAttendanceRecordsQueryArgs>;
}

async function AttendancePage({ searchParams }: PageProps) {
  const pageSearchParams = await searchParams;

  const { attendanceRecords } = await getAttendanceRecords(pageSearchParams);

  return (
    <div className="flex flex-1 flex-col gap-4 p-4">
      <div className="flex items-center gap-4">
        <div>
          <h2 className="font-bold">Attendance</h2>
          <p className="text-muted-foreground text-sm">
            Manage Church Service and Events Attendance
          </p>
        </div>
        {attendanceRecords.length === 0 ? null : (
          <div className="ml-auto flex items-center gap-3">
            <AttendanceFormDialog />
          </div>
        )}
      </div>

      {attendanceRecords.length === 0 ? (
        <div className="flex min-h-[350px] flex-1 flex-col items-center justify-center gap-3 rounded-md border border-dashed">
          <PackageIcon className="size-6 text-muted-foreground" />
          <p className="text-center text-muted-foreground text-sm">
            No attendance records found.
          </p>

          <AttendanceFormDialog />
        </div>
      ) : (
        <>
          <div className="flex items-center gap-3">
            <SearchField paramName="q" />
          </div>
          <ul className="grid flex-1 grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-3">
            {attendanceRecords.map((attendance) => (
              <li key={`attendance-${attendance.id}`}>
                <AttendanceCard attendanceRecord={attendance} />
              </li>
            ))}
          </ul>
        </>
      )}
    </div>
  );
}

export default AttendancePage;
