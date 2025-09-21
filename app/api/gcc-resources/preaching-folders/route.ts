import { NextResponse } from "next/server";
import { getPreachingFolders } from "@/features/gcc-resources/grdrive";

export async function GET() {
  try {
    const result = await getPreachingFolders();

    return NextResponse.json(result);
  } catch (error) {
    return NextResponse.json(
      {
        error:
          "/api/gcc-resources/preaching-folders - Failed to fetch preaching folders",
        details: error,
      },
      { status: 500 },
    );
  }
}
