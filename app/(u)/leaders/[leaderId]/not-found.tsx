import Link from "next/link";
import { Button } from "@/components/ui/button";

function LeaderNotFoundPage() {
  return (
    <div className="flex-1">
      <div className="max-w-5xl mx-auto h-full flex flex-col items-center justify-center gap-4 p-4">
        <h2 className="font-semibold text-lg">Leader not found</h2>
        <Button asChild>
          <Link href="/leaders">Back to Leader List</Link>
        </Button>
      </div>
    </div>
  );
}

export default LeaderNotFoundPage;
