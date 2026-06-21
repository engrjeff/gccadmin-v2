import type { Metadata } from "next";
import Link from "next/link";
import { SearchField } from "@/components/ui/search-field";
import { NewAttendeeesTable } from "@/features/attendance/new-attendees-table";
import {
  getNewChurchAttendees,
  type NewChurchAttendeesQueryArgs,
} from "@/features/attendance/queries";

export const metadata: Metadata = {
  title: "New Church Attendees",
};

interface PageProps {
  searchParams: Promise<NewChurchAttendeesQueryArgs>;
}

async function NewAttendeesPage(props: PageProps) {
  const pageParams = await props.searchParams;

  const newChurchAttendees = await getNewChurchAttendees(pageParams);

  return (
    <div className="flex max-w-6xl flex-1 flex-col gap-4 p-4">
      <Link
        href="/attendance"
        className="inline-block w-max text-sm hover:underline"
      >
        &larr; Back to Attendance
      </Link>
      <div>
        <h2 className="font-bold">New Church Attendees</h2>
        <p className="text-muted-foreground text-sm">
          View, manage, convert to disciples the new church attendees
        </p>
      </div>
      <div>
        <SearchField paramName="q" />
      </div>
      <NewAttendeeesTable newChurchAttendees={newChurchAttendees} />
    </div>
  );
}

export default NewAttendeesPage;
