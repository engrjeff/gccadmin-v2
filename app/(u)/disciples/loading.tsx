import { Loader2Icon } from "lucide-react";

function DisciplesLoadingPage() {
  return (
    <div className="flex-1 h-full min-h-[70vh]">
      <div className="max-w-5xl mx-auto h-full flex flex-col items-center justify-center gap-4 p-4">
        <Loader2Icon className="size-6 animate-spin" />
      </div>
    </div>
  );
}

export default DisciplesLoadingPage;
