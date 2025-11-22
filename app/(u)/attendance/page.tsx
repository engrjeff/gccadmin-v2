import type { Metadata } from "next";
import { AttendanceFormDialog } from "@/features/attendance/attendance-form-dialog";
import { AttendanceTable } from "@/features/attendance/attendance-table";
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
          <p className="text-muted-foreground text-xs">
            Manage Church Service and Events Attendance
          </p>
        </div>
        <div className="ml-auto flex items-center gap-3">
          <AttendanceFormDialog />
        </div>
      </div>

      {attendanceRecords.length === 0 ? (
        <p className="text-muted-foreground text-sm">
          No attendance records found.
        </p>
      ) : (
        <AttendanceTable attendanceRecords={attendanceRecords} />
      )}
    </div>
  );
}

export default AttendancePage;
