"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useAction } from "next-safe-action/hooks";
import {
  type SubmitErrorHandler,
  type SubmitHandler,
  useForm,
} from "react-hook-form";
import { toast } from "sonner";
import { Gender, MemberType, type NewBeliever } from "@/app/generated/prisma";
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
import { SubmitButton } from "@/components/ui/submit-button";
import { useDisciples } from "@/hooks/use-disciples";
import { updateNewBeliever } from "./actions";
import { type NewBelieverEditInputs, newBelieverEditSchema } from "./schema";

export function NewBelieverEditForm({
  onAfterSave,
  newBeliever,
}: {
  onAfterSave: VoidFunction;
  newBeliever: NewBeliever;
}) {
  const form = useForm<NewBelieverEditInputs>({
    defaultValues: {
      id: newBeliever.id,
      name: newBeliever.name,
      gender: newBeliever.gender,
      memberType: newBeliever.memberType,
      contactNo: newBeliever.contactNo ?? "",
      email: newBeliever.email ?? "",
      address: newBeliever.address ?? "",
      handledById: newBeliever.handledById ?? undefined,
    },
    resolver: zodResolver(newBelieverEditSchema),
  });

  const disciples = useDisciples({ leaderId: newBeliever.networkLeaderId });

  const handledByOptions = disciples.data?.map((d) => ({
    label: d.name,
    value: d.id,
  }));

  const updateAction = useAction(updateNewBeliever, {
    onError: ({ error }) => {
      console.error(error);
      toast.error(error.serverError ?? `Error updating new believer`);
    },
  });

  const isBusy = updateAction.isPending;

  const onFormError: SubmitErrorHandler<NewBelieverEditInputs> = (errors) => {
    console.log(`New Believer Update Form Errors: `, errors);
  };

  const onSubmit: SubmitHandler<NewBelieverEditInputs> = async (data) => {
    try {
      const result = await updateAction.executeAsync(data);

      if (result.data?.id) {
        toast.success(`${result.data?.name} was updated successfully!`);

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
        <div className="max-h-[calc(100%-69px)] flex-1">
          <fieldset
            disabled={isBusy}
            className="flex h-full flex-col gap-3.5 overflow-y-auto p-4 disabled:opacity-90"
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
              name="gender"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Gender</FormLabel>
                  <FormControl>
                    <RadioGroup
                      defaultValue={field.value}
                      className="flex h-9 w-max min-w-0 rounded-md border border-input bg-transparent px-3 py-1 text-base shadow-xs dark:bg-input/30"
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
                      className="w-max capitalize"
                    >
                      <option value="">Member Type</option>
                      <option value={MemberType.UNCATEGORIZED}>
                        Uncategorized
                      </option>
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
                    Who handles this new believer?
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="address"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>
                    Address{" "}
                    <span className="text-muted-foreground text-xs">
                      (Optional)
                    </span>
                  </FormLabel>
                  <FormControl>
                    <Input placeholder="Address" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="email"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>
                    Email{" "}
                    <span className="text-muted-foreground text-xs">
                      (Optional)
                    </span>
                  </FormLabel>
                  <FormControl>
                    <Input
                      type="email"
                      placeholder="email@example.com"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="contactNo"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>
                    Contact No.{" "}
                    <span className="text-muted-foreground text-xs">
                      (Optional)
                    </span>
                  </FormLabel>
                  <FormControl>
                    <Input type="tel" placeholder="+639XXXXXXXXX" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </fieldset>
        </div>

        <div className="flex items-center justify-end gap-3 border-t p-4">
          <Button type="button" variant="ghost" onClick={onAfterSave}>
            Cancel
          </Button>
          <SubmitButton loading={isBusy}>Save Changes</SubmitButton>
        </div>
      </form>
    </Form>
  );
}
