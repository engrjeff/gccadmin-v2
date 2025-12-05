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
import { Textarea } from "@/components/ui/textarea";
import { useDisciples } from "@/hooks/use-disciples";
import { useIsAdmin } from "@/hooks/use-is-admin";
import { useLeaders } from "@/hooks/use-leaders";
import { useLessonSeries } from "@/hooks/use-lesson-series";
import { createConsolidationReport } from "./actions";
import { NewBelieversPicker } from "./new-believers-picker";
import {
  type ConsolidationCreateInputs,
  consolidationReportCreateSchema,
} from "./schema";

const defaultValues: ConsolidationCreateInputs = {
  networkLeaderId: "",
  venue: "",
  newBelievers: [],
  assistantLeaderId: "",
  date: format(new Date(), "yyyy-MM-dd'T'HH:mm"),
  lessonId: "",
};

export function ConsolidationReportForm({
  onAfterSave,
}: {
  onAfterSave: VoidFunction;
}) {
  const isAdmin = useIsAdmin();

  const [createMore, setCreateMore] = useState(false);
  const [withAssistant, setWithAssistant] = useState(false);

  const leadersQuery = useLeaders({ enabled: isAdmin });

  const lessonSeriesQuery = useLessonSeries();

  const queryClient = useQueryClient();

  const form = useForm<ConsolidationCreateInputs>({
    defaultValues,
    resolver: zodResolver(consolidationReportCreateSchema),
    mode: "onChange",
  });

  const leaderId = form.watch("networkLeaderId");
  const selectedLesson = form.watch("lessonId");

  const disciplesOfLeader = useDisciples({ leaderId });

  const lessonOptions = lessonSeriesQuery.data?.find(
    (ls) => ls.title === "Consolidation",
  )?.lessons;

  const referencesFromLessons =
    lessonOptions
      ?.find((i) => i.id === selectedLesson)
      ?.scriptureReferences.join(", ") ?? "";

  const createAction = useAction(createConsolidationReport, {
    onError: ({ error }) => {
      console.error(error);
      toast.error(error.serverError ?? `Error creating consolidation report`);
    },
  });

  useEffect(() => {
    if (disciplesOfLeader.data?.length !== 0) return;

    setWithAssistant(false);
  }, [disciplesOfLeader.data?.length]);

  const isBusy = createAction.isPending;

  const onFormError: SubmitErrorHandler<ConsolidationCreateInputs> = (
    errors,
  ) => {
    console.log(`Consolidation Report Create Form Errors: `, errors);

    const assistantLeaderId = form.watch("assistantLeaderId");

    if (withAssistant && !assistantLeaderId) {
      form.setError("assistantLeaderId", { message: "Assistant is required." });
      return false;
    }

    return true;
  };

  const onSubmit: SubmitHandler<ConsolidationCreateInputs> = async (data) => {
    try {
      if (isAdmin && !form.getValues("networkLeaderId")) {
        form.setError("networkLeaderId", {
          message: "Network Leader is required",
        });
        return;
      }

      const hasNoError = onFormError(form.formState.errors);

      if (!hasNoError) return;

      const result = await createAction.executeAsync(data);

      if (result.data?.report) {
        toast.success(`Consolidation Report created!`);

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
                name="networkLeaderId"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Network Leader</FormLabel>
                    <Select
                      defaultValue={field.value}
                      disabled={leadersQuery.isLoading}
                      value={field.value}
                      onValueChange={(value) => {
                        field.onChange(value);
                        form.setValue("newBelievers", []);
                        setWithAssistant(false);
                        form.setValue("assistantLeaderId", "");
                      }}
                    >
                      <FormControl>
                        <SelectTrigger id="leaderId" className="w-full">
                          <SelectValue placeholder="Select a network leader" />
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

            <div className="flex items-center space-x-2 pt-4">
              <Checkbox
                disabled={
                  disciplesOfLeader.isLoading ||
                  disciplesOfLeader.data?.length === 0
                }
                checked={withAssistant}
                onCheckedChange={(checked) => {
                  setWithAssistant(checked === true);
                  if (checked !== true) {
                    form.setValue("assistantLeaderId", "");
                  }
                }}
                id="with-assistant"
              />
              <Label htmlFor="with-assistant">I have an assistant leader</Label>
            </div>

            {withAssistant ? (
              <FormField
                control={form.control}
                name="assistantLeaderId"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Assistant Leader</FormLabel>
                    <AppCombobox
                      fullwidth
                      label="Select assistant leader"
                      value={field.value}
                      disabled={
                        disciplesOfLeader.isLoading ||
                        disciplesOfLeader.data?.length === 0
                      }
                      onValueChange={field.onChange}
                      options={
                        disciplesOfLeader.data?.map((d) => ({
                          label: d.name,
                          value: d.id,
                        })) ?? []
                      }
                    />
                    <FormDescription>
                      Every disciple in a network can win or consolidate souls.
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
                        label="Select Lesson"
                        value={field.value}
                        onValueChange={field.onChange}
                        options={
                          lessonOptions?.map((lesson) => ({
                            label: lesson.title,
                            value: lesson.id,
                          })) ?? []
                        }
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
          </fieldset>

          <Separator className="my-6" />

          <fieldset
            className="space-y-3 px-4 disabled:opacity-90"
            disabled={isBusy}
          >
            <FormField
              control={form.control}
              name="newBelievers"
              render={() => (
                <FormItem>
                  <FormLabel>New Believers</FormLabel>
                  <FormMessage />
                  <FormControl>
                    <NewBelieversPicker />
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
              setWithAssistant(false);
            }}
          >
            Reset
          </Button>
          <Button type="button" variant="ghost" onClick={handleCancelClick}>
            Cancel
          </Button>
          <SubmitButton loading={isBusy}>Save Report</SubmitButton>
        </div>
      </form>
    </Form>
  );
}
