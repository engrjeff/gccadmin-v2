import Link from "next/link";
import { Button } from "@/components/ui/button";

function DiscipleNotFoundPage() {
  return (
    <div className="mx-auto flex h-full min-h-[70vh] max-w-5xl flex-col items-center justify-center gap-4 p-4">
      <h2 className="font-semibold text-lg">Disciple not found</h2>
      <Button asChild>
        <Link href="/disciples">Back to Disciple List</Link>
      </Button>
    </div>
  );
}

export default DiscipleNotFoundPage;
