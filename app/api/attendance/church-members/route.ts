import { type NextRequest, NextResponse } from "next/server";
import type { Disciple, Gender, MemberType } from "@/app/generated/prisma";
import prisma from "@/lib/prisma";

export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;

    const gender = searchParams.get("gender") as Gender | "all";
    const memberType = searchParams.get("memberType") as MemberType;
    const q = searchParams.get("q");

    const leadersQuery = prisma.disciple.findMany({
      where: {
        isActive: true,
        isDeleted: false,
        isPrimary: true,
        name: {
          not: {
            equals: "GCC Admin",
          },
        },
      },
      orderBy: {
        name: "asc",
      },
    });

    const churchMembersQuery = prisma.disciple.findMany({
      where: {
        isActive: true,
        isDeleted: false,
        gender: gender === "all" ? undefined : gender,
        memberType: memberType ?? undefined,
        name: q
          ? {
              contains: q,
              mode: "insensitive",
            }
          : undefined,
      },
      orderBy: {
        name: "asc",
      },
    });

    const [leaders, churchMembers] = await Promise.all([
      leadersQuery,
      churchMembersQuery,
    ]);

    leaders.sort((a, _b) => {
      if (a.name.startsWith("Pastor") || a.name.startsWith("John De Guzman"))
        return -1;

      return 1;
    });

    const churchMembersToLeadersMap = new Map<
      string,
      { label: string; members: Disciple[] }
    >();

    leaders.forEach((leader) => {
      const disciplesOfLeader = churchMembers.filter(
        (member) => member.leaderId === leader.id && member.isPrimary === false,
      );

      if (disciplesOfLeader.length === 0) return;

      churchMembersToLeadersMap.set(leader.id, {
        label: leader.name,
        members: disciplesOfLeader,
      });
    });

    const data = Array.from(churchMembersToLeadersMap.values());

    return NextResponse.json({
      leaders: { label: "Primary Leaders", members: leaders },
      churchMembers: data,
    });
  } catch (error) {
    console.log("Error at GET /api/attendance/church-members", error);
    return NextResponse.json({
      leaders: { label: "Primary Leaders", members: [] },
      churchMembers: [],
    });
  }
}
