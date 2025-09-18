import { type NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/prisma";

export async function GET(request: NextRequest) {
  try {
    const query = request.nextUrl.searchParams;

    const requestType = query.get("type");

    // members by category (type),
    if (requestType === "memberType") {
      const result = await prisma.disciple.groupBy({
        by: "memberType",
        where: {
          isActive: true,
          isDeleted: false,
        },
        _count: {
          memberType: true,
        },
        orderBy: {
          _count: {
            memberType: "desc",
          },
        },
      });

      return NextResponse.json(result);
    }
    // members by status,
    if (requestType === "status") {
      const result = await prisma.disciple.groupBy({
        by: "isActive",
        _count: {
          isActive: true,
        },
        orderBy: {
          _count: {
            isActive: "desc",
          },
        },
      });

      return NextResponse.json(result);
    }
    // members by cell status,
    if (requestType === "cellStatus") {
      const result = await prisma.disciple.groupBy({
        by: "cellStatus",
        where: {
          isActive: true,
          isDeleted: false,
        },
        _count: {
          cellStatus: true,
        },
        orderBy: {
          _count: {
            cellStatus: "desc",
          },
        },
      });

      return NextResponse.json(result);
    }
    // members by church status
    if (requestType === "churchStatus") {
      const result = await prisma.disciple.groupBy({
        by: "churchStatus",
        where: {
          isActive: true,
          isDeleted: false,
        },
        _count: {
          churchStatus: true,
        },
        orderBy: {
          _count: {
            churchStatus: "desc",
          },
        },
      });

      return NextResponse.json(result);
    }
  } catch (error) {
    console.log(`Error in GET /api/reports/member-statistics: `, error);
    return NextResponse.json(null);
  }
}
