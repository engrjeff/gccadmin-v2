import { type NextRequest, NextResponse } from "next/server";
import { getResourceFilesByFolder } from "@/features/gcc-resources/grdrive";

export async function GET(
  req: NextRequest,
  ctx: RouteContext<"/api/gcc-resources/resources-folders/[folderId]">,
) {
  try {
    const order =
      (req.nextUrl.searchParams.get("order") as "asc" | "desc") ?? "asc";

    const { folderId } = await ctx.params;

    const result = await getResourceFilesByFolder(folderId, order);

    return NextResponse.json(result);
  } catch (error) {
    return NextResponse.json(
      {
        error:
          "/api/gcc-resources/resources-folders/{folderId} - Failed to fetch resources folders by folder id",
        details: error,
      },
      { status: 500 },
    );
  }
}
