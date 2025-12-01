import { type NextRequest, NextResponse } from "next/server";
import type { MemberType } from "@/app/generated/prisma";
import prisma from "@/lib/prisma";

export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;

    const memberType = searchParams.get("memberType") as MemberType;

    const data = await prisma.disciple.groupBy({
      by: ["churchStatus"],
      where: {
        isActive: true,
        isDeleted: false,
        memberType: memberType ?? undefined,
      },
      _count: {
        churchStatus: true,
      },
    });

    return NextResponse.json({
      total: data.reduce((sum, item) => sum + item._count.churchStatus, 0),
      data,
    });
  } catch (error) {
    console.log("Error at GET /api/reports/member-type-statistics", error);
    return NextResponse.json({
      total: 0,
      data: [],
    });
  }
}
