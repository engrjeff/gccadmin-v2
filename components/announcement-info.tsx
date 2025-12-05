import Link from "next/link";

export function AnnouncementInfo() {
  return (
    <div className="flex items-center gap-2 border-b bg-secondary px-3 py-2">
      <p className="text-sm">
        <span>🍀</span>Soul Winning & Consolidation Module is live!{" "}
      </p>
      <Link
        href="/soul-winning/new"
        className="font-semibold text-blue-500 underline hover:no-underline"
      >
        Create Report &rarr;
      </Link>
    </div>
  );
}
