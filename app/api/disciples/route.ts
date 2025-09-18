import { auth } from "@clerk/nextjs/server";
import { type NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/prisma";

export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;

    const leaderId = searchParams.get("leaderId");

    if (leaderId) {
      const disciples = await prisma.disciple.findMany({
        where: {
          leaderId,
        },
      });

      return NextResponse.json(disciples);
    }

    const user = await auth();

    const leader = await prisma.disciple.findUnique({
      where: {
        userAccountId: user.userId as string,
      },
      include: {
        disciples: {
          where: {
            isActive: true,
            isDeleted: false,
          },
        },
      },
    });

    return NextResponse.json(leader?.disciples);
  } catch (error) {
    console.log("Error at GET /api/disciples", error);
    return NextResponse.json([]);
  }
}
