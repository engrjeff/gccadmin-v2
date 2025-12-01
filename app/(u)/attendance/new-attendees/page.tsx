import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "New Attendees",
};

function NewAttendeesPage() {
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
      <div>WIP</div>
    </div>
  );
}

export default NewAttendeesPage;
