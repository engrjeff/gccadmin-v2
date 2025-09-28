import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Growth Process System",
};

function LeadershipPage() {
  return (
    <div className="flex flex-1 flex-col gap-4 p-4">
      <div className="flex items-center gap-4">
        <div>
          <h2 className="font-bold">Growth Process System</h2>
          <p className="text-muted-foreground text-sm">
            GCC Growth Process System
          </p>
        </div>
      </div>
      <div>
        <p>Jeff is working on it. Chill.</p>
      </div>
    </div>
  );
}

export default LeadershipPage;
