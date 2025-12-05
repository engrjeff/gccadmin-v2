import type { ReactNode } from "react";
import { SoulWinningCreateDropdown } from "@/features/soul-winning/soul-winning-create-dropdown";
import { SoulWinningTabLinks } from "@/features/soul-winning/soul-winning-tab-links";

function SoulWinningPagesLayout({ children }: { children: ReactNode }) {
  return (
    <div className="flex flex-1 flex-col gap-4 p-4">
      <div className="flex items-center gap-4">
        <div>
          <h2 className="font-bold">Soul Winning</h2>
          <p className="hidden text-muted-foreground text-sm md:block">
            View, report, and track newly-won souls.
          </p>
        </div>

        <div className="ml-auto flex items-center gap-3">
          <SoulWinningCreateDropdown />
        </div>
      </div>
      <SoulWinningTabLinks />
      {children}
    </div>
  );
}

export default SoulWinningPagesLayout;
