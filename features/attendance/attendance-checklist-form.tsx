"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { type PropsWithChildren, useEffect, useState } from "react";
import {
  type SubmitErrorHandler,
  type SubmitHandler,
  useForm,
} from "react-hook-form";
import { toast } from "sonner";
import { Gender, MemberType } from "@/app/generated/prisma";
import { Form } from "@/components/ui/form";
import { type AddAttendeesInputs, addAttendeesSchema } from "./schema";

const STORAGE_KEY = "GCC_ATTENDANCE";

export function AttendanceChecklistForm({
  attendanceId,
  children,
}: PropsWithChildren<{ attendanceId: string }>) {
  const [hasSet, setHasSet] = useState(false);
  const form = useForm<AddAttendeesInputs>({
    resolver: zodResolver(addAttendeesSchema),
    defaultValues: {
      attendanceId,
      attendees: [],
      newComers: [1, 2, 3].map((_n) => ({
        name: "",
        gender: Gender.MALE,
        memberType: MemberType.UNCATEGORIZED,
      })),
    },
  });

  const attendees = form.watch("attendees");
  const newComers = form.watch("newComers");

  // biome-ignore lint/correctness/useExhaustiveDependencies: <nah>
  useEffect(() => {
    if (typeof window === "undefined") return;

    if (!window?.localStorage) return;

    const ATTENDANCE_STORAGE_KEY = `${STORAGE_KEY}_${attendanceId}`;

    try {
      const storedData = localStorage.getItem(ATTENDANCE_STORAGE_KEY);

      if (storedData) {
        const formData = JSON.parse(storedData) as AddAttendeesInputs;

        form.setValue("attendees", formData.attendees);
        form.setValue("newComers", formData.newComers);
      }

      setHasSet(true);
    } catch (error) {
      console.log(`Cannot save to local storage: `, error);
    }
  }, [attendanceId]);

  useEffect(() => {
    if (typeof window === "undefined") return;

    if (!window?.localStorage) return;

    if (!hasSet) return;

    const ATTENDANCE_STORAGE_KEY = `${STORAGE_KEY}_${attendanceId}`;

    try {
      localStorage.setItem(
        ATTENDANCE_STORAGE_KEY,
        JSON.stringify({
          attendanceId,
          attendees,
          newComers,
        }),
      );
    } catch (error) {
      console.log(`Cannot save to local storage: `, error);
    }
  }, [attendanceId, attendees, newComers, hasSet]);

  const onFormError: SubmitErrorHandler<AddAttendeesInputs> = (errors) => {
    console.log(`Attendance Form Errors: `, errors);
  };

  const onSubmit: SubmitHandler<AddAttendeesInputs> = async (data) => {
    try {
      console.log(data);
    } catch (error) {
      if (error instanceof Error) {
        toast.error(error.message);
      }
    }
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit, onFormError)}>
        <fieldset className="space-y-4">{children}</fieldset>
      </form>
    </Form>
  );
}
