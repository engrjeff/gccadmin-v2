import type { Metadata } from "next";
import Link from "next/link";
import { Separator } from "@/components/ui/separator";
import { SoulWinningReportForm } from "@/features/soul-winning/soul-winning-report-form";

export const metadata: Metadata = {
  title: "Create Soul-Winning Report",
};

function NewSoulWinningReportPage() {
  return (
    <div className="mx-auto w-full max-w-4xl space-y-4">
      <Link
        href="/soul-winning"
        className="inline-block w-max text-blue-500 text-sm hover:underline"
      >
        &larr; Back to List
      </Link>
      <div>
        <h2 className="font-bold">Create Soul-Winning Report</h2>
        <p className="text-muted-foreground text-xs">
          Fill in the details below.
        </p>
      </div>
      <Separator />
      <SoulWinningReportForm />
    </div>
  );
}

export default NewSoulWinningReportPage;
