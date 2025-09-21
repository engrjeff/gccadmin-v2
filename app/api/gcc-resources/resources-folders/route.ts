import { NextResponse } from "next/server";
import { getResourcesFolders } from "@/features/gcc-resources/grdrive";

export async function GET() {
  try {
    const result = await getResourcesFolders();

    return NextResponse.json(result);
  } catch (error) {
    return NextResponse.json(
      {
        error:
          "/api/gcc-resources/resources-folders - Failed to fetch resources folders",
        details: error,
      },
      { status: 500 },
    );
  }
}
