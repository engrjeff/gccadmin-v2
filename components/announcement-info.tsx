import Link from "next/link";

export function AnnouncementInfo() {
  return (
    <div className="flex items-center gap-2 border-b bg-secondary px-3 py-2">
      <span>🍀</span>
      <p className="text-sm">
        Soul Winning & Consolidation Module is live!{" "}
        <Link
          href="/soul-winning/new"
          className="text-green-500 underline hover:no-underline"
        >
          Create Report &rarr;
        </Link>
      </p>
    </div>
  );
}
