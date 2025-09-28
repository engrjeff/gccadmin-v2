"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { format, subYears } from "date-fns";
import { useAction } from "next-safe-action/hooks";
import {
  type SubmitErrorHandler,
  type SubmitHandler,
  useForm,
} from "react-hook-form";
import { toast } from "sonner";
import {
  type Disciple,
  Gender,
  MemberType,
  ProcessLevel,
  ProcessLevelStatus,
} from "@/app/generated/prisma";
import { Button } from "@/components/ui/button";
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
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { SelectNative } from "@/components/ui/select-native";
import { Separator } from "@/components/ui/separator";
import { SubmitButton } from "@/components/ui/submit-button";
import { Switch } from "@/components/ui/switch";
import { useDisciples } from "@/hooks/use-disciples";
import { useIsAdmin } from "@/hooks/use-is-admin";
import { useLeaders } from "@/hooks/use-leaders";
import {
  cellStatuses,
  churchStatuses,
  processLevelStatuses,
  processLevels,
} from "@/lib/constants";
import { updateDisciple } from "./actions";
import { type DiscipleCreateInputs, discipleCreateSchema } from "./schema";

export function DiscipleEditForm({
  onAfterSave,
  disciple,
}: {
  onAfterSave: VoidFunction;
  disciple: Disciple;
}) {
  const isAdmin = useIsAdmin();

  const leadersQuery = useLeaders({ enabled: isAdmin });

  const form = useForm<DiscipleCreateInputs>({
    defaultValues: {
      name: disciple.name,
      address: disciple.address,
      birthdate: format(new Date(disciple.birthdate), "yyyy-MM-dd"),
      gender: disciple.gender,
      leaderId: disciple.leaderId ?? undefined,
      cellStatus: disciple.cellStatus,
      churchStatus: disciple.churchStatus,
      memberType: disciple.memberType,
      processLevel: disciple.processLevel,
      processLevelStatus: disciple.processLevelStatus,
      isMyPrimary: disciple.isPrimary ? true : disciple.isMyPrimary,
    },
    resolver: zodResolver(discipleCreateSchema),
  });

  const leaderId = form.watch("leaderId");

  const disciples = useDisciples({ leaderId });

  const handledByOptions = disciples.data
    ?.filter((d) => d.isMyPrimary && !d.isPrimary && d.id !== disciple.id)
    .map((d) => ({ label: d.name, value: d.id }));

  const updateAction = useAction(updateDisciple, {
    onError: ({ error }) => {
      console.error(error);
      toast.error(error.serverError ?? `Error updating disciple`);
    },
  });

  const isBusy = updateAction.isPending;

  const onFormError: SubmitErrorHandler<DiscipleCreateInputs> = (errors) => {
    console.log(`Disciple Update Form Errors: `, errors);
  };

  const onSubmit: SubmitHandler<DiscipleCreateInputs> = async (data) => {
    try {
      if (isAdmin && !form.getValues("leaderId")) {
        form.setError("leaderId", { message: "Leader is required" });
        return;
      }

      const result = await updateAction.executeAsync({
        id: disciple.id,
        ...data,
      });

      if (result.data?.disciple) {
        toast.success(
          `${result.data?.disciple.name} was updated successfully!`,
        );

        onAfterSave();
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
        className="relative flex max-h-[calc(100%-88px)] flex-1 flex-col"
      >
        <div className="mb-4 max-h-[calc(100%-69px)] flex-1 overflow-y-auto">
          <fieldset
            disabled={isBusy}
            className="flex h-full flex-col gap-3.5 p-4 disabled:opacity-90"
          >
            <p className="text-foreground text-sm">Personal Information</p>
            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Name</FormLabel>
                  <FormControl>
                    <Input autoFocus placeholder="Name" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="address"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Address</FormLabel>
                  <FormControl>
                    <Input placeholder="Address" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <div className="flex items-center gap-4">
              <FormField
                control={form.control}
                name="birthdate"
                render={({ field }) => (
                  <FormItem className="w-max">
                    <FormLabel>Birthdate</FormLabel>
                    <FormControl>
                      <Input
                        type="date"
                        placeholder="Birthdate"
                        pattern="\d{4}-\d{2}-\d{2}"
                        max={format(subYears(new Date(), 10), "yyyy-MM-dd")}
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="gender"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Gender</FormLabel>
                    <FormControl>
                      <RadioGroup
                        defaultValue={field.value}
                        className="flex h-9 w-full min-w-0 rounded-md border border-input bg-transparent px-3 py-1 text-base shadow-xs dark:bg-input/30"
                        onValueChange={(value) => {
                          field.onChange(value);

                          if (
                            form.watch("memberType") === MemberType.MEN &&
                            value === Gender.FEMALE
                          ) {
                            form.setValue("memberType", MemberType.WOMEN);
                          }

                          if (
                            form.watch("memberType") === MemberType.WOMEN &&
                            value === Gender.MALE
                          ) {
                            form.setValue("memberType", MemberType.MEN);
                          }
                        }}
                      >
                        <FormItem className="flex items-center gap-3">
                          <FormControl>
                            <RadioGroupItem value={Gender.MALE} />
                          </FormControl>
                          <FormLabel className="font-normal">Male</FormLabel>
                        </FormItem>
                        <FormItem className="flex items-center gap-3">
                          <FormControl>
                            <RadioGroupItem value={Gender.FEMALE} />
                          </FormControl>
                          <FormLabel className="font-normal">Female</FormLabel>
                        </FormItem>
                      </RadioGroup>
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
            <Separator />
            <p className="text-foreground text-sm">
              Church-related Information
            </p>
            <FormField
              control={form.control}
              name="memberType"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Member Type</FormLabel>
                  <FormControl>
                    <SelectNative
                      key={form.watch("memberType")}
                      {...field}
                      className="capitalize"
                    >
                      <option value="">Cell Status</option>
                      <option value={MemberType.KIDS}>Kids</option>
                      <option value={MemberType.YOUTH}>Youth</option>
                      <option value={MemberType.YOUNGPRO}>Young Pro</option>
                      <option
                        disabled={form.watch("gender") === Gender.FEMALE}
                        value={MemberType.MEN}
                      >
                        Men
                      </option>
                      <option
                        disabled={form.watch("gender") === Gender.MALE}
                        value={MemberType.WOMEN}
                      >
                        Women
                      </option>
                    </SelectNative>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            {isAdmin ? (
              <FormField
                control={form.control}
                name="leaderId"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Leader</FormLabel>
                    <FormControl>
                      <SelectNative {...field} className="capitalize">
                        <option value="">Leader</option>
                        {leadersQuery.data?.map((leader) => (
                          <option key={leader.id} value={leader.id}>
                            {leader.name}
                          </option>
                        ))}
                      </SelectNative>
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            ) : null}
            <div className="grid grid-cols-2 gap-4">
              <FormField
                control={form.control}
                name="cellStatus"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Cell Status</FormLabel>
                    <FormControl>
                      <SelectNative {...field} className="capitalize">
                        <option value="">Cell Status</option>
                        {cellStatuses.map((option) => (
                          <option key={option.value} value={option.value}>
                            {option.label}
                          </option>
                        ))}
                      </SelectNative>
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="churchStatus"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Church Status</FormLabel>
                    <FormControl>
                      <SelectNative {...field} className="capitalize">
                        <option value="">Church Status</option>
                        {churchStatuses.map((option) => (
                          <option key={option.value} value={option.value}>
                            {option.label}
                          </option>
                        ))}
                      </SelectNative>
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="processLevel"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Process Level</FormLabel>
                    <FormControl>
                      <SelectNative
                        {...field}
                        className="capitalize"
                        onChange={(e) => {
                          const value = e.currentTarget.value;

                          if (value === ProcessLevel.NONE) {
                            form.setValue(
                              "processLevelStatus",
                              ProcessLevelStatus.NOT_STARTED,
                            );
                          }

                          field.onChange(e);
                        }}
                      >
                        <option value="">Process Level</option>
                        {processLevels.map((option) => (
                          <option key={option.value} value={option.value}>
                            {option.label}
                          </option>
                        ))}
                      </SelectNative>
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="processLevelStatus"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Process Status</FormLabel>
                    <FormControl>
                      <SelectNative
                        key={form.watch("processLevel")}
                        disabled={
                          form.watch("processLevel") === ProcessLevel.NONE
                        }
                        className="capitalize"
                        {...field}
                      >
                        <option value="">Process Status</option>
                        {processLevelStatuses.map((option) => (
                          <option key={option.value} value={option.value}>
                            {option.label}
                          </option>
                        ))}
                      </SelectNative>
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            {disciple.isPrimary ? null : (
              <FormField
                control={form.control}
                name="handledById"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Handled By</FormLabel>
                    <FormControl>
                      <SelectNative
                        disabled={handledByOptions?.length === 0}
                        {...field}
                        className="capitalize"
                      >
                        <option value="">
                          {handledByOptions?.length === 0
                            ? "No qualified option"
                            : "Select Handled by"}
                        </option>
                        {handledByOptions?.map((disciple) => (
                          <option key={disciple.value} value={disciple.value}>
                            {disciple.label}
                          </option>
                        ))}
                      </SelectNative>
                    </FormControl>
                    <FormDescription>
                      Who handles this disciple?
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />
            )}
            {disciple.isPrimary ? null : (
              <FormField
                control={form.control}
                name="isMyPrimary"
                render={({ field }) => (
                  <FormItem className="flex flex-row items-center justify-between rounded-lg border bg-transparent p-3 shadow-sm dark:bg-input/30">
                    <div className="space-y-0.5">
                      <FormLabel>Is Primary?</FormLabel>
                      <FormDescription>
                        Is this disciple your primary disciple?
                      </FormDescription>
                    </div>
                    <FormControl>
                      <Switch
                        checked={field.value}
                        onCheckedChange={field.onChange}
                      />
                    </FormControl>
                  </FormItem>
                )}
              />
            )}
          </fieldset>
        </div>

        <div className="flex items-center justify-end gap-3 p-4">
          <Button type="button" variant="ghost" onClick={onAfterSave}>
            Cancel
          </Button>
          <SubmitButton loading={isBusy}>Save Disciple</SubmitButton>
        </div>
      </form>
    </Form>
  );
}
