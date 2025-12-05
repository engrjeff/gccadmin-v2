import { auth } from "@clerk/nextjs/server";
import { type NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/prisma";

export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;

    const leaderId = searchParams.get("leaderId");

    if (leaderId) {
      const newBelievers = await prisma.newBeliever.findMany({
        where: {
          networkLeaderId: leaderId,
        },
      });

      return NextResponse.json(newBelievers);
    }

    const user = await auth();

    const leader = await prisma.disciple.findUnique({
      where: {
        userAccountId: user.userId as string,
      },
      include: {
        networkNewSouls: true,
      },
    });

    if (!leader?.networkNewSouls?.length) {
      return NextResponse.json([]);
    }

    return NextResponse.json(leader?.networkNewSouls);
  } catch (error) {
    console.log("Error at GET /api/new-believers", error);
    return NextResponse.json([]);
  }
}
