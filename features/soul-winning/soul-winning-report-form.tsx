"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { format } from "date-fns";
import { PlusIcon, XIcon } from "lucide-react";
import { useRouter } from "next/navigation";
import { useAction } from "next-safe-action/hooks";
import { useEffect, useState } from "react";
import {
  type SubmitErrorHandler,
  type SubmitHandler,
  useFieldArray,
  useForm,
  useFormContext,
} from "react-hook-form";
import { toast } from "sonner";
import { Gender, MemberType } from "@/app/generated/prisma";
import { AppCombobox } from "@/components/app-combobox";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import {
  Drawer,
  DrawerClose,
  DrawerContent,
  DrawerDescription,
  DrawerFooter,
  DrawerHeader,
  DrawerTitle,
  DrawerTrigger,
} from "@/components/ui/drawer";
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
import { SelectNative } from "@/components/ui/select-native";
import { Separator } from "@/components/ui/separator";
import { SubmitButton } from "@/components/ui/submit-button";
import { Textarea } from "@/components/ui/textarea";
import { useDisciples } from "@/hooks/use-disciples";
import { useIsAdmin } from "@/hooks/use-is-admin";
import { useLeaders } from "@/hooks/use-leaders";
import { useLessonSeries } from "@/hooks/use-lesson-series";
import { useIsMobile } from "@/hooks/use-mobile";
import { cn, removeUnderscores } from "@/lib/utils";
import { createSoulWinningReport } from "./actions";
import {
  type NewBelieverInputs,
  newBelieverSchema,
  type SoulWinningCreateInputs,
  soulWinningReportCreateSchema,
} from "./schema";

const defaultValues: SoulWinningCreateInputs = {
  networkLeaderId: "",
  venue: "",
  newBelievers: [],
  assistantLeaderId: "",
  date: format(new Date(), "yyyy-MM-dd'T'HH:mm"),
  lessonId: "",
};

interface NewBelieverFormProps {
  onAdd: (data: NewBelieverInputs) => void;
}

function NewBelieverForm(props: NewBelieverFormProps) {
  const [open, setOpen] = useState(false);
  const form = useFormContext<SoulWinningCreateInputs>();

  const newBelievers = form.watch("newBelievers");

  return (
    <div className="space-y-4 pb-4">
      {newBelievers.length === 0 ? (
        <div className="rounded border border-dashed p-4">
          <p className="text-muted-foreground text-xs">
            No new believer entries yet. Add one now.
          </p>
        </div>
      ) : (
        <ul>
          {newBelievers.map((nb, nbIndex) => (
            <li key={`new-believer-value-${nbIndex.toString()}`}>
              <div className="flex items-start gap-2">
                <div className="mt-0.5 text-muted-foreground text-xs">
                  {nbIndex + 1}.
                </div>
                <div>
                  <p className="font-semibold text-sm">{nb.name}</p>
                  <p className="text-muted-foreground text-xs capitalize">
                    <span>{removeUnderscores(nb.gender)}</span>,{" "}
                    <span>{removeUnderscores(nb.memberType)}</span>
                  </p>
                </div>
              </div>
            </li>
          ))}
        </ul>
      )}
      <Drawer open={open} onOpenChange={setOpen}>
        <DrawerTrigger asChild>
          <Button type="button" size="sm" variant="secondaryOutline">
            <PlusIcon /> Add Entry
          </Button>
        </DrawerTrigger>
        <DrawerContent>
          <DrawerHeader className="!text-left">
            <DrawerTitle>New Believer</DrawerTitle>
            <DrawerDescription>Fill out the form below.</DrawerDescription>
          </DrawerHeader>
          <div className="overflow-y-auto p-6">
            <NewBelieverFormContent {...props} onClose={() => setOpen(false)} />
          </div>
        </DrawerContent>
      </Drawer>
    </div>
  );
}

function NewBelieverFormContent(
  props: NewBelieverFormProps & { onClose: VoidFunction },
) {
  const [values, setValues] = useState<NewBelieverInputs>({
    name: "",
    gender: Gender.MALE,
    memberType: MemberType.UNCATEGORIZED,
    email: "",
    contactNo: "",
    address: "",
  });

  function handleValueChange(key: keyof NewBelieverInputs, value: string) {
    setValues((values) => ({ ...values, [key]: value }));
  }

  function handleSave() {
    const valid = newBelieverSchema.safeParse(values);

    if (!valid.success) {
      toast.error("Check out invalid fields.");
      return;
    }

    props.onAdd(valid.data);
    props.onClose();
  }

  return (
    <div className="space-y-3">
      <div className="space-y-2">
        <Label htmlFor="new-believer-name">Name</Label>
        <Input
          id="new-believer-name"
          name="new-believer-name"
          placeholder="Name"
          value={values.name}
          onChange={(e) => handleValueChange("name", e.currentTarget.value)}
        />
      </div>
      <div className="space-y-2">
        <Label htmlFor="new-believer-gender">Gender</Label>
        <SelectNative
          id="new-believer-gender"
          name="new-believer-gender"
          className="w-max"
          value={values.gender}
          onChange={(e) => handleValueChange("gender", e.currentTarget.value)}
        >
          <option value={Gender.MALE}>Male</option>
          <option value={Gender.FEMALE}>Female</option>
        </SelectNative>
      </div>
      <div className="space-y-2">
        <Label htmlFor="new-believer-member-type">Member Type</Label>
        <SelectNative
          id="new-believer-member-type"
          name="new-believer-member-type"
          className="w-max"
          value={values.memberType}
          onChange={(e) =>
            handleValueChange("memberType", e.currentTarget.value)
          }
        >
          <option value={MemberType.UNCATEGORIZED}>Uncategorized</option>
          <option value={MemberType.MEN}>Men</option>
          <option value={MemberType.WOMEN}>Women</option>
          <option value={MemberType.YOUNGPRO}>Young Pro</option>
          <option value={MemberType.YOUTH}>Youth</option>
          <option value={MemberType.KIDS}>Kids</option>
        </SelectNative>
      </div>
      <div className="space-y-2">
        <Label htmlFor="new-believer-address">
          Address{" "}
          <span className="text-muted-foreground text-xs">(Optional)</span>
        </Label>
        <Input
          id="new-believer-address"
          name="new-believer-address"
          placeholder="Address"
          value={values.address}
          onChange={(e) => handleValueChange("address", e.currentTarget.value)}
        />
      </div>
      <div className="space-y-2">
        <Label htmlFor="new-believer-email">
          Email{" "}
          <span className="text-muted-foreground text-xs">(Optional)</span>
        </Label>
        <Input
          id="new-believer-email"
          name="new-believer-email"
          placeholder="email@example.com"
          type="email"
          value={values.email}
          onChange={(e) => handleValueChange("email", e.currentTarget.value)}
        />
      </div>
      <div className="space-y-2">
        <Label htmlFor="new-believer-contact">
          Contact No.{" "}
          <span className="text-muted-foreground text-xs">(Optional)</span>
        </Label>
        <Input
          id="new-believer-contact"
          name="new-believer-contact"
          placeholder="+639XXXXXXXXX"
          type="tel"
          value={values.contactNo}
          onChange={(e) =>
            handleValueChange("contactNo", e.currentTarget.value)
          }
        />
      </div>
      <DrawerFooter className="flex-row justify-end px-0">
        <DrawerClose asChild>
          <Button type="button" size="sm" variant="secondary">
            Cancel
          </Button>
        </DrawerClose>
        <Button type="button" size="sm" onClick={handleSave}>
          Save Entry
        </Button>
      </DrawerFooter>
    </div>
  );
}

export function SoulWinningReportForm() {
  const isAdmin = useIsAdmin();
  const isMobile = useIsMobile();
  const router = useRouter();

  const [withAssistant, setWithAssistant] = useState(false);

  const leadersQuery = useLeaders({ enabled: isAdmin });

  const lessonSeriesQuery = useLessonSeries();

  const form = useForm<SoulWinningCreateInputs>({
    defaultValues,
    resolver: zodResolver(soulWinningReportCreateSchema),
    mode: "onChange",
  });

  const newBelieversFields = useFieldArray({
    control: form.control,
    name: "newBelievers",
  });

  const leaderId = form.watch("networkLeaderId");
  const selectedLesson = form.watch("lessonId");

  const disciplesOfLeader = useDisciples({ leaderId });

  const lessonOptions = lessonSeriesQuery.data?.find(
    (ls) => ls.title === "Soul Winning",
  )?.lessons;

  const referencesFromLessons =
    lessonOptions
      ?.find((i) => i.id === selectedLesson)
      ?.scriptureReferences.join(", ") ?? "";

  const createAction = useAction(createSoulWinningReport, {
    onError: ({ error }) => {
      console.error(error);
      toast.error(error.serverError ?? `Error creating soul-winning report`);
    },
  });

  useEffect(() => {
    if (disciplesOfLeader.data?.length !== 0) return;

    setWithAssistant(false);
  }, [disciplesOfLeader.data?.length]);

  const isBusy = createAction.isPending;

  const onFormError: SubmitErrorHandler<SoulWinningCreateInputs> = (errors) => {
    console.log(`Soul-Winning Report Create Form Errors: `, errors);
  };

  const onSubmit: SubmitHandler<SoulWinningCreateInputs> = async (data) => {
    try {
      if (isAdmin && !form.getValues("networkLeaderId")) {
        form.setError("networkLeaderId", {
          message: "Network Leader is required",
        });
        return;
      }

      const result = await createAction.executeAsync(data);

      if (result.data?.report) {
        toast.success(`Soul-Winning Report created!`);

        form.reset();

        router.replace("/soul-winning");
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
    router.replace("/soul-winning");
  }

  return (
    <Form {...form}>
      <form
        onSubmit={form.handleSubmit(onSubmit, onFormError)}
        className="relative flex max-w-full flex-1 flex-col overflow-x-hidden px-4"
      >
        <fieldset className="space-y-3 disabled:opacity-90" disabled={isBusy}>
          <legend className="font-medium text-sm">General Details</legend>
          {isAdmin ? (
            <FormField
              control={form.control}
              name="networkLeaderId"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Leader</FormLabel>
                  <Select
                    defaultValue={field.value}
                    disabled={leadersQuery.isLoading}
                    value={field.value}
                    onValueChange={(value) => {
                      field.onChange(value);
                      setWithAssistant(false);
                      form.setValue("assistantLeaderId", "");
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
        <fieldset className="space-y-3 disabled:opacity-90" disabled={isBusy}>
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

        <fieldset className="space-y-3 disabled:opacity-90" disabled={isBusy}>
          <legend className="font-medium text-sm">New Believers</legend>
          {form.formState.errors.newBelievers?.message && (
            <p data-slot="form-message" className="text-destructive text-sm">
              {form.formState.errors.newBelievers?.message}
            </p>
          )}
          {isMobile ? (
            <NewBelieverForm onAdd={newBelieversFields.append} />
          ) : (
            <NewBelieverFormFields />
          )}
        </fieldset>

        <div className="mt-auto flex items-center justify-end gap-3 border-t py-4">
          <Button
            type="button"
            variant="ghost"
            size="sm"
            onClick={handleCancelClick}
          >
            Cancel
          </Button>
          <SubmitButton size="sm" loading={isBusy}>
            Save Report
          </SubmitButton>
        </div>
      </form>
    </Form>
  );
}

function NewBelieverFormFields() {
  const form = useFormContext<SoulWinningCreateInputs>();
  const newBelieversFields = useFieldArray({
    control: form.control,
    name: "newBelievers",
  });

  const newBelievers = form.watch("newBelievers");

  return (
    <>
      {newBelievers.length === 0 ? (
        <div className="rounded border border-dashed p-4">
          <p className="text-muted-foreground text-xs">
            No new believer entries yet. Add one now.
          </p>
        </div>
      ) : null}
      <ul className="hidden space-y-2 md:block">
        {newBelieversFields.fields.map((field, fieldIndex) => (
          <li
            key={field.id}
            className={cn(
              "grid max-w-full grid-cols-[1fr_auto] items-start gap-4 overflow-x-auto p-1 md:grid-cols-[1fr_160px_160px_auto]",
              fieldIndex === 0 ? "items-end" : "",
            )}
          >
            <FormField
              control={form.control}
              name={`newBelievers.${fieldIndex}.name`}
              render={({ field }) => (
                <FormItem className="min-w-[200px] shrink-0">
                  <FormLabel
                    className={cn(
                      fieldIndex !== 0 ? "sr-only" : "hidden md:inline",
                    )}
                  >
                    Name
                  </FormLabel>
                  <FormControl>
                    <Input placeholder="Name" {...field} />
                  </FormControl>
                  <FormMessage className="sr-only" />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name={`newBelievers.${fieldIndex}.gender`}
              render={({ field }) => (
                <FormItem className="hidden space-y-0 md:grid">
                  <FormLabel className={cn(fieldIndex !== 0 ? "sr-only" : "")}>
                    Gender
                  </FormLabel>
                  <FormControl>
                    <SelectNative
                      {...field}
                      onChange={(e) => {
                        const value = e.currentTarget.value as Gender;

                        field.onChange(e);

                        if (
                          form.watch(
                            `newBelievers.${fieldIndex}.memberType`,
                          ) === MemberType.MEN &&
                          value === Gender.FEMALE
                        ) {
                          form.setValue(
                            `newBelievers.${fieldIndex}.memberType`,
                            MemberType.WOMEN,
                          );
                        }

                        if (
                          form.watch(
                            `newBelievers.${fieldIndex}.memberType`,
                          ) === MemberType.WOMEN &&
                          value === Gender.MALE
                        ) {
                          form.setValue(
                            `newBelievers.${fieldIndex}.memberType`,
                            MemberType.MEN,
                          );
                        }
                      }}
                    >
                      <option value={Gender.MALE}>Male</option>
                      <option value={Gender.FEMALE}>Female</option>
                    </SelectNative>
                  </FormControl>
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name={`newBelievers.${fieldIndex}.memberType`}
              render={({ field }) => (
                <FormItem className="hidden space-y-0 md:grid">
                  <FormLabel className={cn(fieldIndex !== 0 ? "sr-only" : "")}>
                    Member Type
                  </FormLabel>
                  <FormControl>
                    <SelectNative {...field}>
                      <option value={MemberType.UNCATEGORIZED}>
                        Uncategorized
                      </option>

                      <option
                        disabled={
                          form.watch(`newBelievers.${fieldIndex}.gender`) ===
                          Gender.FEMALE
                        }
                        value={MemberType.MEN}
                      >
                        Men
                      </option>
                      <option
                        disabled={
                          form.watch(`newBelievers.${fieldIndex}.gender`) ===
                          Gender.MALE
                        }
                        value={MemberType.WOMEN}
                      >
                        Women
                      </option>
                      <option value={MemberType.YOUNGPRO}>Young Pro</option>
                      <option value={MemberType.YOUTH}>Youth</option>
                      <option value={MemberType.KIDS}>Kids</option>
                    </SelectNative>
                  </FormControl>
                </FormItem>
              )}
            />
            <Button
              type="button"
              size="icon"
              variant="outline"
              aria-label="remove this entry"
              className="shrink-0 text-destructive hover:text-destructive"
              onClick={() => newBelieversFields.remove(fieldIndex)}
            >
              <XIcon />
            </Button>
          </li>
        ))}
      </ul>
      <div className="my-4 px-1">
        <Button
          type="button"
          size="sm"
          variant="secondaryOutline"
          onClick={() =>
            newBelieversFields.append({
              name: "",
              gender: Gender.MALE,
              memberType: MemberType.UNCATEGORIZED,
            })
          }
        >
          <PlusIcon /> Add Entry
        </Button>
      </div>
    </>
  );
}
