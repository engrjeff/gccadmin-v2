import { type NextRequest, NextResponse } from "next/server";
import type { Disciple, Gender, MemberType } from "@/app/generated/prisma";
import prisma from "@/lib/prisma";

export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;

    const gender = searchParams.get("gender") as Gender | "all";
    const memberType = searchParams.get("memberType") as MemberType;
    const q = searchParams.get("q");

    const churchMembers = await prisma.disciple.findMany({
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
        createdAt: "asc",
      },
    });

    const leaders = churchMembers.filter((member) => member.isPrimary === true);

    const churchMembersToLeadersMap = new Map<
      string,
      { label: string; members: Disciple[] }
    >();

    churchMembersToLeadersMap.set("Primary Leaders", {
      label: "Primary Leaders",
      members: leaders,
    });

    leaders.forEach((leader) => {
      const disciplesOfLeader = churchMembers.filter(
        (member) => member.leaderId === leader.id && member.isPrimary === false,
      );

      churchMembersToLeadersMap.set(leader.id, {
        label: leader.name,
        members: disciplesOfLeader,
      });
    });

    const data = Array.from(churchMembersToLeadersMap.values());

    return NextResponse.json({ churchMembers: data });
  } catch (error) {
    console.log("Error at GET /api/attendance/church-members", error);
    return NextResponse.json({ churchMembers: [] });
  }
}
