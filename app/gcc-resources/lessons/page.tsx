import type { Metadata } from "next";
import { ResourcesFolders } from "@/features/gcc-resources/resources-folders";

export const metadata: Metadata = {
  title: {
    absolute: "Lessons | GCC Resources",
  },
};

function GCCLessonsPage() {
  return (
    <div>
      <ResourcesFolders />
    </div>
  );
}

export default GCCLessonsPage;
