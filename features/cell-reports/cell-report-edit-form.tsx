"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useQueryClient } from "@tanstack/react-query";
import { format } from "date-fns";
import { useAction } from "next-safe-action/hooks";
import { useEffect, useState } from "react";
import {
  type SubmitErrorHandler,
  type SubmitHandler,
  useForm,
} from "react-hook-form";
import { toast } from "sonner";
import { AppCombobox } from "@/components/app-combobox";
import { TagsInput } from "@/components/tags-input";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Separator } from "@/components/ui/separator";
import { SubmitButton } from "@/components/ui/submit-button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Textarea } from "@/components/ui/textarea";
import { useDisciples } from "@/hooks/use-disciples";
import { useIsAdmin } from "@/hooks/use-is-admin";
import { useLeaders } from "@/hooks/use-leaders";
import { useLessonSeries } from "@/hooks/use-lesson-series";
import type { CellReportRecord } from "@/types/globals";
import { editCellReport } from "./actions";
import { AttendeesPicker } from "./attendees-picker";
import { type CellReportEditInputs, cellReportEditSchema } from "./schema";

export function CellReportEditForm({
  cellReport,
  onAfterSave,
}: {
  cellReport: CellReportRecord;
  onAfterSave: VoidFunction;
}) {
  const isAdmin = useIsAdmin();

  const [createMore, setCreateMore] = useState(false);

  const [withAssistant, setWithAssistant] = useState(() =>
    Boolean(cellReport.assistantId),
  );

  const [selectedSeries, setSelectedSeries] = useState<string | undefined>(
    () => cellReport.lesson?.lessonSeries?.id,
  );

  const leadersQuery = useLeaders({ enabled: isAdmin });

  const lessonSeriesQuery = useLessonSeries();

  const queryClient = useQueryClient();

  const defaultValues: Partial<CellReportEditInputs> = {
    id: cellReport.id,
    leaderId: cellReport.leaderId,
    type: cellReport.type,
    venue: cellReport.venue,
    date: cellReport.date
      ? format(cellReport.date, "yyyy-MM-dd'T'HH:mm")
      : undefined,
    lessonId: cellReport.lessonId ?? undefined,
    lessonTitle: cellReport.lessonTitle ?? undefined,
    scriptureReferences: cellReport.scriptureReferences,
    worship: cellReport.worship,
    work: cellReport.work,
    assistantId: cellReport.assistantId ?? undefined,
    attendees: cellReport.cellReportAttendeeSnapshots.map((c) => c.discipleId),
  };

  const form = useForm<CellReportEditInputs>({
    defaultValues,
    resolver: zodResolver(cellReportEditSchema),
    mode: "onChange",
  });

  const leaderId = form.watch("leaderId");
  const selectedLesson = form.watch("lessonId");
  const selectedAssistant = form.watch("assistantId");
  const currentAttendees = form.watch("attendees");

  const disciplesOfLeader = useDisciples({ leaderId });

  const lessons =
    lessonSeriesQuery.data?.find((i) => i.id === selectedSeries)?.lessons ?? [];

  const referencesFromLessons =
    lessons
      .find((i) => i.id === selectedLesson)
      ?.scriptureReferences.join(", ") ?? "";

  const editAction = useAction(editCellReport, {
    onError: ({ error }) => {
      console.error(error);
      toast.error(error.serverError ?? `Error updating cell report`);
    },
  });

  useEffect(() => {
    if (disciplesOfLeader.data?.length !== 0) return;

    setWithAssistant(false);
  }, [disciplesOfLeader.data?.length]);

  const isBusy = editAction.isPending;

  const onFormError: SubmitErrorHandler<CellReportEditInputs> = (errors) => {
    console.log(`Cell Report Edit Form Errors: `, errors);

    const { lessonId, lessonTitle, assistantId, scriptureReferences } =
      form.watch();

    if (withAssistant && !assistantId) {
      form.setError("assistantId", { message: "Assistant is required." });
      return false;
    }

    if (!lessonId && !lessonTitle) {
      form.setError("lessonId", { message: "Lesson is required" });
      form.setError("lessonTitle", { message: "Lesson is required" });
      return false;
    }

    if (!lessonId) {
      if (!form.watch("lessonTitle")) {
        form.setError("lessonTitle", { message: "Lesson is required" });
        return false;
      }

      if (!scriptureReferences || scriptureReferences?.length === 0) {
        form.setError("scriptureReferences", {
          message: "Scripture reference is required",
        });
        return false;
      }
    }

    return true;
  };

  const onSubmit: SubmitHandler<CellReportEditInputs> = async (data) => {
    try {
      if (isAdmin && !form.getValues("leaderId")) {
        form.setError("leaderId", { message: "Leader is required" });
        return;
      }

      const hasNoError = onFormError(form.formState.errors);

      if (!hasNoError) return;

      const result = await editAction.executeAsync(data);

      if (result.data?.cellReport) {
        toast.success(`Cell Report updated!`);

        await queryClient.invalidateQueries();

        onAfterSave();
      }
    } catch (error) {
      if (error instanceof Error) {
        toast.error(error.message);
      }
    }
  };

  function handleCancelClick() {
    form.reset(defaultValues);
    setSelectedSeries(undefined);
    setWithAssistant(false);
    onAfterSave();
  }

  return (
    <Form {...form}>
      <form
        onSubmit={form.handleSubmit(onSubmit, onFormError)}
        className="relative flex max-h-[calc(100%-88px)] flex-1 flex-col"
      >
        <div className="max-h-[calc(100%-69px)] flex-1 overflow-y-auto py-4">
          <fieldset
            className="space-y-3 px-4 disabled:opacity-90"
            disabled={isBusy}
          >
            <legend className="font-medium text-sm">General Details</legend>
            {isAdmin ? (
              <FormField
                control={form.control}
                name="leaderId"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Leader</FormLabel>
                    <Select
                      defaultValue={field.value}
                      disabled={leadersQuery.isLoading}
                      value={field.value}
                      onValueChange={(value) => {
                        field.onChange(value);
                        form.setValue("attendees", []);
                        setWithAssistant(false);
                        form.setValue("assistantId", "");
                      }}
                    >
                      <FormControl>
                        <SelectTrigger id="leaderId" className="w-full">
                          <SelectValue placeholder="Select a leader" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        {leadersQuery.data?.map((item) => (
                          <SelectItem key={item.id} value={item.id}>
                            {item.name}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />
            ) : null}

            <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
              <FormField
                control={form.control}
                name="type"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Cell Type</FormLabel>
                    <Select
                      onValueChange={field.onChange}
                      defaultValue={field.value}
                      value={field.value}
                    >
                      <FormControl>
                        <SelectTrigger
                          id="type"
                          className="w-min normal-case md:w-full"
                        >
                          <SelectValue placeholder="Select cell type" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        <SelectItem value="OPEN">Open Cell</SelectItem>
                        <SelectItem value="DISCIPLESHIP">
                          Discipleship Cell
                        </SelectItem>
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="date"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Date & Time</FormLabel>
                    <FormControl>
                      <Input
                        type="datetime-local"
                        placeholder="Date"
                        max={format(new Date(), "yyyy-MM-dd'T'HH:mm")}
                        className="w-min"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <FormField
              control={form.control}
              name="venue"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Venue</FormLabel>
                  <FormControl>
                    <Input id="venue" placeholder="Venue" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <div className="flex items-center space-x-2 pt-4">
              <Checkbox
                disabled={
                  disciplesOfLeader.isLoading ||
                  disciplesOfLeader.data?.filter(
                    (d) => d.isMyPrimary || d.isPrimary,
                  )?.length === 0
                }
                checked={withAssistant}
                onCheckedChange={(checked) => {
                  setWithAssistant(checked === true);
                  if (checked !== true) {
                    form.setValue("assistantId", "");
                    form.setValue(
                      "attendees",
                      currentAttendees.filter((a) => a !== selectedAssistant),
                    );
                  }
                }}
                id="with-assistant"
              />
              <Label htmlFor="with-assistant">I have an assistant leader</Label>
            </div>

            {withAssistant ? (
              <FormField
                control={form.control}
                name="assistantId"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Assistant Leader</FormLabel>
                    <Select
                      defaultValue={field.value}
                      value={field.value}
                      disabled={
                        disciplesOfLeader.isLoading ||
                        disciplesOfLeader.data?.length === 0
                      }
                      onValueChange={(value) => {
                        if (value) {
                          form.setValue("attendees", [
                            ...currentAttendees,
                            value,
                          ]);
                        } else {
                          form.setValue(
                            "attendees",
                            currentAttendees.filter(
                              (a) => a !== selectedAssistant,
                            ),
                          );
                        }

                        field.onChange(value);
                      }}
                    >
                      <FormControl>
                        <SelectTrigger
                          id="assistantId"
                          className="w-full normal-case"
                        >
                          <SelectValue placeholder="Select assistant leader" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        {disciplesOfLeader.data
                          ?.filter((dc) => dc.isMyPrimary || dc.isPrimary)
                          ?.map((item) => (
                            <SelectItem key={item.id} value={item.id}>
                              {item.name}
                            </SelectItem>
                          ))}
                      </SelectContent>
                    </Select>
                    <FormDescription>
                      Qualified assistants are primary leaders and primary
                      disciples.
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />
            ) : null}
          </fieldset>
          <Separator className="my-6" />
          <fieldset
            className="space-y-3 px-4 disabled:opacity-90"
            disabled={isBusy}
          >
            <legend className="font-medium text-sm">Lesson Details</legend>

            <Tabs
              defaultValue={
                cellReport.lessonTitle ? "custom-lesson" : "pick-lesson"
              }
              className="w-full"
              onValueChange={(tabValue) => {
                if (tabValue === "custom-lesson") {
                  setSelectedSeries(undefined);
                  form.setValue("lessonId", undefined);
                  form.setValue(
                    "lessonTitle",
                    cellReport.lessonTitle ?? undefined,
                  );
                  form.setValue(
                    "scriptureReferences",
                    cellReport.scriptureReferences ?? [],
                  );
                } else {
                  form.setValue("lessonTitle", undefined);

                  setSelectedSeries(cellReport.lesson?.lessonSeries?.id);
                  form.setValue("lessonId", cellReport.lessonId ?? undefined);

                  form.setValue(
                    "scriptureReferences",
                    cellReport.lesson?.scriptureReferences ?? [],
                  );
                }
              }}
            >
              <TabsList className="grid w-full grid-cols-2">
                <TabsTrigger value="pick-lesson">Pick a Lesson</TabsTrigger>
                <TabsTrigger value="custom-lesson">Custom Lesson</TabsTrigger>
              </TabsList>
              <TabsContent
                value="pick-lesson"
                className="space-y-3 rounded-lg border p-3"
              >
                <div className="flex flex-col space-y-2">
                  <Label>Series</Label>
                  <AppCombobox
                    label="Select Series"
                    inputPlaceholder="Search series..."
                    disabled={lessonSeriesQuery.isLoading}
                    value={selectedSeries}
                    onValueChange={setSelectedSeries}
                    options={
                      lessonSeriesQuery.data?.map((lessonSeries) => ({
                        label: lessonSeries.title,
                        value: lessonSeries.id,
                      })) ?? []
                    }
                  />
                </div>
                <div className="flex flex-col space-y-2">
                  <FormField
                    control={form.control}
                    name="lessonId"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Lesson</FormLabel>
                        <FormControl>
                          <AppCombobox
                            fullwidth
                            disabled={!selectedSeries}
                            label="Select Lesson"
                            value={field.value}
                            onValueChange={field.onChange}
                            options={lessons.map((lesson) => ({
                              label: lesson.title,
                              value: lesson.id,
                            }))}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>
                <div className="flex flex-col space-y-2">
                  <Label>Scripture References</Label>
                  <Textarea
                    placeholder="Scripture references"
                    disabled
                    defaultValue={referencesFromLessons}
                  />
                </div>
              </TabsContent>
              <TabsContent
                value="custom-lesson"
                className="space-y-3 rounded-lg border p-3"
              >
                <div className="w-full space-y-2">
                  <FormField
                    control={form.control}
                    name="lessonTitle"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Lesson Title</FormLabel>
                        <FormControl>
                          <Input placeholder="Lesson title" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>
                <div className="flex flex-col space-y-2">
                  <FormField
                    control={form.control}
                    name="scriptureReferences"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Scripture References</FormLabel>
                        <FormControl>
                          <TagsInput
                            value={field.value ?? []}
                            onChange={field.onChange}
                            placeholder="Scriptures"
                            hintText="Type a verses (ex. John 3:16), then hit 'Enter'"
                            aria-describedby="scriptureRefError"
                            aria-invalid={
                              !!form.formState.errors?.scriptureReferences
                            }
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>
              </TabsContent>
            </Tabs>
            <Separator />
            <FormField
              control={form.control}
              name="worship"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>
                    Worship{" "}
                    <span className="text-muted-foreground text-xs italic">
                      (Optional)
                    </span>
                  </FormLabel>
                  <FormDescription>
                    Did you worship during the Cell Group?
                  </FormDescription>
                  <FormControl>
                    <TagsInput
                      value={field.value ?? []}
                      onChange={field.onChange}
                      placeholder="e.g. One Way, Better is One Day"
                      hintText="Type a worship song (ex. One Way), then hit 'Enter'"
                      aria-invalid={!!form.formState.errors?.worship}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="work"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>
                    Work{" "}
                    <span className="text-muted-foreground text-xs italic">
                      (Optional)
                    </span>
                  </FormLabel>
                  <FormDescription>Any plans of the group?</FormDescription>
                  <FormControl>
                    <TagsInput
                      value={field.value ?? []}
                      onChange={field.onChange}
                      placeholder="e.g. 3x3 Prayer, Follow-up"
                      hintText="Type a work activity (ex. Prayer), then hit 'Enter'"
                      aria-invalid={!!form.formState.errors?.work}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="attendees"
              render={() => (
                <FormItem>
                  <FormLabel>Attendees</FormLabel>
                  <FormMessage />
                  <FormControl>
                    <AttendeesPicker />
                  </FormControl>
                </FormItem>
              )}
            />
          </fieldset>
        </div>

        <div className="mt-auto flex items-center justify-end gap-3 border-t p-4">
          <div className="mb-2 hidden select-none items-center space-x-2 md:mb-0">
            <Checkbox
              id="create-more-flag"
              className="rounded"
              checked={createMore}
              onCheckedChange={(checked) => setCreateMore(checked === true)}
            />
            <label
              htmlFor="create-more-flag"
              className="font-medium text-sm leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
            >
              Create another report
            </label>
          </div>
          <Button
            variant="outline"
            type="reset"
            disabled={false}
            className="hidden bg-muted/30 md:ml-auto"
            onClick={() => {
              form.reset(defaultValues);
              setSelectedSeries(undefined);
              setWithAssistant(false);
            }}
          >
            Reset
          </Button>
          <Button type="button" variant="ghost" onClick={handleCancelClick}>
            Cancel
          </Button>
          <SubmitButton loading={isBusy}>Save Changes</SubmitButton>
        </div>
      </form>
    </Form>
  );
}
