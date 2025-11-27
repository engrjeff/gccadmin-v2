"use client";

import { Gender, MemberType } from "@/app/generated/prisma";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { useAttendanceRecord } from "@/hooks/use-attendance-record";

export function AttendanceRecordStatistics({ id }: { id: string }) {
  const attendanceQuery = useAttendanceRecord(id);

  if (attendanceQuery.isLoading) return <p>Loading...</p>;

  if (!attendanceQuery.data?.attendance) return null;

  const attendance = attendanceQuery.data?.attendance;

  const totalAttendees =
    attendance?.attendees?.length + attendance?.newComers.length;

  const countByTotal = {
    usual: attendance.attendees.length,
    newComers: attendance.newComers.length,
  };

  const countByGender = {
    male:
      attendance.attendees.filter((a) => a.gender === Gender.MALE).length +
      attendance.newComers.filter((n) => n.gender === Gender.MALE).length,
    female:
      attendance.attendees.filter((a) => a.gender === Gender.FEMALE).length +
      attendance.newComers.filter((n) => n.gender === Gender.FEMALE).length,
  };

  const countByMemberType = {
    uncategorized:
      attendance.attendees.filter(
        (a) => a.memberType === MemberType.UNCATEGORIZED,
      ).length +
      attendance.newComers.filter(
        (n) => n.memberType === MemberType.UNCATEGORIZED,
      ).length,
    men:
      attendance.attendees.filter((a) => a.memberType === MemberType.MEN)
        .length +
      attendance.newComers.filter((n) => n.memberType === MemberType.MEN)
        .length,
    women:
      attendance.attendees.filter((a) => a.memberType === MemberType.WOMEN)
        .length +
      attendance.newComers.filter((n) => n.memberType === MemberType.WOMEN)
        .length,
    youngpro:
      attendance.attendees.filter((a) => a.memberType === MemberType.YOUNGPRO)
        .length +
      attendance.newComers.filter((n) => n.memberType === MemberType.YOUNGPRO)
        .length,
    youth:
      attendance.attendees.filter((a) => a.memberType === MemberType.YOUTH)
        .length +
      attendance.newComers.filter((n) => n.memberType === MemberType.YOUTH)
        .length,
    kids:
      attendance.attendees.filter((a) => a.memberType === MemberType.KIDS)
        .length +
      attendance.newComers.filter((n) => n.memberType === MemberType.KIDS)
        .length,
  };

  function calcPercent(input: number) {
    if (totalAttendees === 0) return 0;

    return (input / totalAttendees) * 100;
  }

  return (
    <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
      {/* by total */}
      <Card className="gap-4 py-4">
        <CardHeader className="gap-0 px-4">
          <CardTitle className="text-sm">
            Total Attendees ({totalAttendees})
          </CardTitle>
          <CardDescription className="text-xs">
            Usual attendees + New Comers
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4 px-4">
          <div className="flex w-full items-center gap-1 rounded-full bg-muted/30 [&>*]:h-2">
            <div
              className="h-full bg-blue-500"
              style={{
                width: `${calcPercent(countByTotal.usual)}%`,
              }}
            ></div>
            <div
              className="h-full bg-green-500"
              style={{
                width: `${calcPercent(countByTotal.newComers)}%`,
              }}
            ></div>
          </div>
          <ul className="mt-auto flex items-center gap-4">
            <li className="flex flex-col gap-2 text-xs">
              <span className="font-bold text-xs">
                {calcPercent(countByTotal.usual).toFixed(1)}%
              </span>
              <div className="flex items-center gap-2">
                <span
                  className="size-2.5 bg-blue-500"
                  aria-hidden="true"
                ></span>
                <span className="text-gray-900 dark:text-gray-50">
                  Usual ({countByTotal.usual})
                </span>
              </div>
            </li>
            <li className="flex flex-col gap-2 text-xs">
              <span className="font-bold text-xs">
                {calcPercent(countByTotal.newComers).toFixed(1)}%
              </span>
              <div className="flex items-center gap-2">
                <span
                  className="size-2.5 bg-green-500"
                  aria-hidden="true"
                ></span>
                <span className="text-gray-900 dark:text-gray-50">
                  New ({countByTotal.newComers})
                </span>
              </div>
            </li>
          </ul>
        </CardContent>
      </Card>

      {/* by gender */}
      <Card className="gap-4 py-4">
        <CardHeader className="gap-0 px-4">
          <CardTitle className="text-sm">By Gender</CardTitle>
          <CardDescription className="text-xs">
            Attendance count by gender
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4 px-4">
          <div className="flex w-full items-center gap-1 rounded-full bg-muted/30 [&>*]:h-2">
            <div
              className="h-full bg-blue-500"
              style={{
                width: `${calcPercent(countByGender.male)}%`,
              }}
            ></div>
            <div
              className="h-full bg-rose-500"
              style={{
                width: `${calcPercent(countByGender.female)}%`,
              }}
            ></div>
          </div>
          <ul className="mt-auto flex items-center gap-4">
            <li className="flex flex-col gap-2 text-xs">
              <span className="font-bold text-xs">
                {calcPercent(countByGender.male).toFixed(1)}%
              </span>
              <div className="flex items-center gap-2">
                <span
                  className="size-2.5 bg-blue-500"
                  aria-hidden="true"
                ></span>
                <span className="text-gray-900 dark:text-gray-50">
                  Male ({countByGender.male})
                </span>
              </div>
            </li>
            <li className="flex flex-col gap-2 text-xs">
              <span className="font-bold text-xs">
                {calcPercent(countByGender.female).toFixed(1)}%
              </span>
              <div className="flex items-center gap-2">
                <span
                  className="size-2.5 bg-rose-500"
                  aria-hidden="true"
                ></span>
                <span className="text-gray-900 dark:text-gray-50">
                  Female ({countByGender.female})
                </span>
              </div>
            </li>
          </ul>
        </CardContent>
      </Card>

      {/* by member type */}
      <Card className="gap-4 py-4">
        <CardHeader className="gap-0 px-4">
          <CardTitle className="text-sm">By Member Type</CardTitle>
          <CardDescription className="text-xs">
            Attendance count by member type
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4 px-4">
          <div className="flex w-full items-center gap-1 rounded-full bg-muted/30 [&>*]:h-2">
            <div
              className="h-full bg-blue-700"
              style={{
                width: `${calcPercent(countByMemberType.men)}%`,
              }}
            ></div>
            <div
              className="h-full bg-blue-600"
              style={{
                width: `${calcPercent(countByMemberType.women)}%`,
              }}
            ></div>
            <div
              className="h-full bg-blue-500"
              style={{
                width: `${calcPercent(countByMemberType.youngpro)}%`,
              }}
            ></div>
            <div
              className="h-full bg-blue-400"
              style={{
                width: `${calcPercent(countByMemberType.youth)}%`,
              }}
            ></div>
            <div
              className="h-full bg-blue-300"
              style={{
                width: `${calcPercent(countByMemberType.kids)}%`,
              }}
            ></div>
            <div
              className="h-full bg-blue-200"
              style={{
                width: `${calcPercent(countByMemberType.uncategorized)}%`,
              }}
            ></div>
          </div>
          <ul className="mt-auto flex flex-wrap items-center gap-4">
            <li className="flex flex-col gap-2 text-xs">
              <span className="hidden font-bold text-xs">
                {calcPercent(countByMemberType.men).toFixed(1)}%
              </span>
              <div className="flex items-center gap-2">
                <span
                  className="size-2.5 bg-blue-700"
                  aria-hidden="true"
                ></span>
                <span className="text-gray-900 dark:text-gray-50">
                  Men ({countByMemberType.men})
                </span>
              </div>
            </li>
            <li className="flex flex-col gap-2 text-xs">
              <span className="hidden font-bold text-xs">
                {calcPercent(countByMemberType.women).toFixed(1)}%
              </span>
              <div className="flex items-center gap-2">
                <span
                  className="size-2.5 bg-blue-600"
                  aria-hidden="true"
                ></span>
                <span className="text-gray-900 dark:text-gray-50">
                  Women ({countByMemberType.women})
                </span>
              </div>
            </li>
            <li className="flex flex-col gap-2 text-xs">
              <span className="hidden font-bold text-xs">
                {calcPercent(countByMemberType.youngpro).toFixed(1)}%
              </span>
              <div className="flex items-center gap-2">
                <span
                  className="size-2.5 bg-blue-500"
                  aria-hidden="true"
                ></span>
                <span className="text-gray-900 dark:text-gray-50">
                  YoungPro ({countByMemberType.youngpro})
                </span>
              </div>
            </li>
            <li className="flex flex-col gap-2 text-xs">
              <span className="hidden font-bold text-xs">
                {calcPercent(countByMemberType.youth).toFixed(1)}%
              </span>
              <div className="flex items-center gap-2">
                <span
                  className="size-2.5 bg-blue-400"
                  aria-hidden="true"
                ></span>
                <span className="text-gray-900 dark:text-gray-50">
                  Youth ({countByMemberType.youth})
                </span>
              </div>
            </li>
            <li className="flex flex-col gap-2 text-xs">
              <span className="hidden font-bold text-xs">
                {calcPercent(countByMemberType.kids).toFixed(1)}%
              </span>
              <div className="flex items-center gap-2">
                <span
                  className="size-2.5 bg-blue-300"
                  aria-hidden="true"
                ></span>
                <span className="text-gray-900 dark:text-gray-50">
                  Kids ({countByMemberType.kids})
                </span>
              </div>
            </li>
            <li className="flex flex-col gap-2 text-xs">
              <span className="hidden font-bold text-xs">
                {calcPercent(countByMemberType.uncategorized).toFixed(1)}%
              </span>
              <div className="flex items-center gap-2">
                <span
                  className="size-2.5 bg-blue-200"
                  aria-hidden="true"
                ></span>
                <span className="text-gray-900 dark:text-gray-50">
                  Uncat ({countByMemberType.uncategorized})
                </span>
              </div>
            </li>
          </ul>
        </CardContent>
      </Card>
    </div>
  );
}
