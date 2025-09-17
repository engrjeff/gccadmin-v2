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
  CellStatus,
  ChurchStatus,
  Gender,
  MemberType,
  ProcessLevel,
  ProcessLevelStatus,
} from "@/app/generated/prisma";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
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
import { useIsAdmin } from "@/hooks/use-is-admin";
import { useLeaders } from "@/hooks/use-leaders";
import {
  cellStatuses,
  churchStatuses,
  processLevelStatuses,
  processLevels,
} from "@/lib/constants";
import { createDisciple } from "./actions";
import { type DiscipleCreateInputs, discipleCreateSchema } from "./schema";

const defaultValues: Partial<DiscipleCreateInputs> = {
  name: "",
  address: "",
  birthdate: "1990-01-01",
  gender: Gender.MALE,
  cellStatus: CellStatus.FIRST_TIMER,
  churchStatus: ChurchStatus.NACS,
  memberType: MemberType.KIDS,
  processLevel: ProcessLevel.NONE,
  processLevelStatus: ProcessLevelStatus.NOT_STARTED,
};

export function DiscipleForm({ onAfterSave }: { onAfterSave: VoidFunction }) {
  const isAdmin = useIsAdmin();

  const leadersQuery = useLeaders({ enabled: isAdmin });

  const form = useForm<DiscipleCreateInputs>({
    defaultValues,
    resolver: zodResolver(discipleCreateSchema),
  });

  const createAction = useAction(createDisciple, {
    onError: ({ error }) => {
      console.error(error);
      toast.error(error.serverError ?? `Error creating disciple`);
    },
  });

  const isBusy = createAction.isPending;

  const onFormError: SubmitErrorHandler<DiscipleCreateInputs> = (errors) => {
    console.log(`Disciple Create Form Errors: `, errors);
  };

  const onSubmit: SubmitHandler<DiscipleCreateInputs> = async (data) => {
    try {
      if (isAdmin && !form.getValues("leaderId")) {
        form.setError("leaderId", { message: "Leader is required" });
        return;
      }

      const result = await createAction.executeAsync(data);

      if (result.data?.disciple) {
        toast.success(
          `${result.data?.disciple.name} was created successfully!`,
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
        <div className="max-h-[calc(100%-69px)] flex-1 overflow-y-auto mb-4">
          <fieldset
            disabled={isBusy}
            className="gap-3.5 disabled:opacity-90 flex flex-col h-full p-4"
          >
            <p className="text-sm text-foreground">Personal Information</p>
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
                        className="flex dark:bg-input/30 border-input h-9 w-full min-w-0 rounded-md border bg-transparent px-3 py-1 text-base shadow-xs"
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
            <p className="text-sm text-foreground">
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
                      <SelectNative {...field} className="capitalize">
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
                      <SelectNative {...field} className="capitalize">
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
          </fieldset>
        </div>

        <div className="p-4 flex gap-3 items-center justify-end">
          <Button type="button" variant="ghost" onClick={onAfterSave}>
            Cancel
          </Button>
          <SubmitButton loading={isBusy}>Save Disciple</SubmitButton>
        </div>
      </form>
    </Form>
  );
}
