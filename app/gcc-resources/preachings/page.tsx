import type { Metadata } from "next";
import { PreachingFolders } from "@/features/gcc-resources/preaching-folders";

export const metadata: Metadata = {
  title: {
    absolute: "Preachings | GCC Resources",
  },
};

function PreachingsPage() {
  return (
    <div>
      <PreachingFolders />
    </div>
  );
}

export default PreachingsPage;
