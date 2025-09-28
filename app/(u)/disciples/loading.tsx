import { Loader2Icon } from "lucide-react";

function DisciplesLoadingPage() {
  return (
    <div className="h-full min-h-[70vh] flex-1">
      <div className="mx-auto flex h-full max-w-5xl flex-col items-center justify-center gap-4 p-4">
        <Loader2Icon className="size-6 animate-spin" />
      </div>
    </div>
  );
}

export default DisciplesLoadingPage;
