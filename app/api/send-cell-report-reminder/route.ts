import { auth } from "@clerk/nextjs/server";
import { type NextRequest, NextResponse } from "next/server";
import { Resend } from "resend";
import z from "zod";
import CellReportReminderEmail from "@/emails/cell-report-reminder-email";

const emailPayloadSchema = z
  .object({
    email: z.email(),
    name: z.string(),
  })
  .array();

const FROM = process.env.RESEND_FROM_EMAIL;

const resend = new Resend(process.env.RESEND_API_KEY);

export async function POST(request: NextRequest) {
  try {
    const user = await auth();

    if (user?.sessionClaims?.metadata?.role !== "admin")
      return NextResponse.json(
        { error: { message: "Unauthorized" } },
        { status: 403 },
      );

    const body = await request.json();

    const validatedBody = emailPayloadSchema.safeParse(body);

    if (!validatedBody.success)
      return NextResponse.json(
        { error: { message: "Invalid Payload" } },
        { status: 400 },
      );

    const { data, error } = await resend.batch.send(
      validatedBody.data.map((data) => ({
        from: `GCC Admin <${FROM}>`,
        to: [data.email],
        subject: "Reminder: Cell Reports",
        react: CellReportReminderEmail({ name: data.name }),
      })),
    );

    if (error) {
      return NextResponse.json({ error }, { status: 500 });
    }

    return NextResponse.json(data);
  } catch (error) {
    return NextResponse.json({ error }, { status: 500 });
  }
}
