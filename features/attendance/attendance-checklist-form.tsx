"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useRouter } from "next/navigation";
import { useAction } from "next-safe-action/hooks";
import { type PropsWithChildren, useEffect } from "react";
import {
  type SubmitErrorHandler,
  type SubmitHandler,
  useForm,
} from "react-hook-form";
import { toast } from "sonner";
import type { NewComer } from "@/app/generated/prisma";
import { Form } from "@/components/ui/form";
import { useAttendanceRecord } from "@/hooks/use-attendance-record";
import { useReturnees } from "@/hooks/use-returnees";
import { addAttendees } from "./actions";
import { type AddAttendeesInputs, addAttendeesSchema } from "./schema";

const STORAGE_KEY = "GCC_ATTENDANCE";

export function AttendanceChecklistForm({
  attendanceId,
  isLocked,
  defaultAttendees,
  defaultNewComers,
  defaultReturnees,
  children,
}: PropsWithChildren<{
  isLocked: boolean;
  attendanceId: string;
  defaultNewComers: Array<NewComer>;
  defaultAttendees: Array<{ id: string }>;
  defaultReturnees: Array<{ id: string }>;
}>) {
  const router = useRouter();

  const attendanceQuery = useAttendanceRecord(attendanceId);
  const returneesQuery = useReturnees({ currentAttendanceId: attendanceId });

  const form = useForm<AddAttendeesInputs>({
    resolver: zodResolver(addAttendeesSchema),
    disabled: isLocked,
    defaultValues: {
      attendanceId,
      attendees: defaultAttendees ?? [],
      returnees: defaultReturnees ?? [],
      newComers:
        defaultNewComers.map((nc) => ({
          name: nc.name,
          gender: nc.gender,
          memberType: nc.memberType,
          invitedById: nc.invitedById ?? undefined,
          email: nc.email ?? undefined,
          contactNo: nc.contactNo ?? undefined,
          address: nc.address ?? undefined,
        })) ?? [],
    },
  });

  const createAction = useAction(addAttendees, {
    onError: ({ error }) => {
      console.error(error);
      toast.error(error.serverError ?? `Error adding attendees`);
    },
  });

  const isBusy = createAction.isPending;

  const { subscribe } = form;

  // biome-ignore lint/correctness/useExhaustiveDependencies: <nah>
  useEffect(() => {
    if (typeof window === "undefined") return;

    if (!window?.localStorage) return;

    const ATTENDANCE_STORAGE_KEY = `${STORAGE_KEY}_${attendanceId}`;

    try {
      const storedData = localStorage.getItem(ATTENDANCE_STORAGE_KEY);

      if (storedData) {
        const formData = JSON.parse(storedData) as AddAttendeesInputs;

        form.reset(formData);
      }
    } catch (error) {
      console.log(`Cannot save to local storage: `, error);
    }
  }, [attendanceId]);

  useEffect(() => {
    if (typeof window === "undefined") return;

    if (!window?.localStorage) return;

    const ATTENDANCE_STORAGE_KEY = `${STORAGE_KEY}_${attendanceId}`;

    const subscription = subscribe({
      formState: { values: true, isDirty: true },
      callback({ values, isDirty }) {
        try {
          if (!isDirty) {
            localStorage.removeItem(ATTENDANCE_STORAGE_KEY);
            return;
          }
          localStorage.setItem(ATTENDANCE_STORAGE_KEY, JSON.stringify(values));
        } catch (error) {
          console.log(`Cannot save to local storage: `, error);
        }
      },
    });

    return () => {
      subscription();
    };
  }, [attendanceId, subscribe]);

  const onFormError: SubmitErrorHandler<AddAttendeesInputs> = (errors) => {
    console.log(`Attendance Form Errors: `, errors);
  };

  const onSubmit: SubmitHandler<AddAttendeesInputs> = async (data) => {
    try {
      if (isLocked) return;

      const result = await createAction.executeAsync(data);

      if (result.data?.attendance?.id) {
        toast.success(`Attendance saved!`);

        const ATTENDANCE_STORAGE_KEY = `${STORAGE_KEY}_${attendanceId}`;
        localStorage.removeItem(ATTENDANCE_STORAGE_KEY);

        router.refresh();

        await attendanceQuery.refetch();
        await returneesQuery.refetch();
      }
    } catch (error) {
      if (error instanceof Error) {
        toast.error(error.message);
      }
    }
  };

  return (
    <Form {...form}>
      <form
        onSubmit={form.handleSubmit(onSubmit, onFormError)}
        className="max-w-full overflow-x-hidden"
      >
        <fieldset
          disabled={isBusy}
          className="block min-w-0 max-w-full space-y-4 overflow-x-hidden disabled:opacity-90"
        >
          {children}
        </fieldset>
      </form>
    </Form>
  );
}
