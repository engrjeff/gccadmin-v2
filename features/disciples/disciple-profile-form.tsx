"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { format, subYears } from "date-fns";
import { useRouter } from "next/navigation";
import { useAction } from "next-safe-action/hooks";
import {
  type SubmitErrorHandler,
  type SubmitHandler,
  useForm,
} from "react-hook-form";
import { toast } from "sonner";
import type { Disciple } from "@/app/generated/prisma";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { SubmitButton } from "@/components/ui/submit-button";
import { updateDiscipleProfile } from "./actions";
import {
  type DiscipleCreateInputs,
  type DiscipleProfileInputs,
  discipleProfileSchema,
} from "./schema";

export function DiscipleProfileForm({ disciple }: { disciple: Disciple }) {
  const router = useRouter();

  const form = useForm<DiscipleProfileInputs>({
    defaultValues: {
      id: disciple.id,
      name: disciple.name,
      address: disciple.address,
      birthdate: format(new Date(disciple.birthdate), "yyyy-MM-dd"),
    },
    resolver: zodResolver(discipleProfileSchema),
  });

  const updateAction = useAction(updateDiscipleProfile, {
    onError: ({ error }) => {
      console.error(error);
      toast.error(error.serverError ?? `Error updating profile`);
    },
  });

  const isBusy = updateAction.isPending;

  const onFormError: SubmitErrorHandler<DiscipleCreateInputs> = (errors) => {
    console.log(`Disciple Profile Form Errors: `, errors);
  };

  const onSubmit: SubmitHandler<DiscipleProfileInputs> = async (data) => {
    try {
      const result = await updateAction.executeAsync(data);

      if (result.data?.disciple) {
        toast.success(`Profile was updated successfully!`);
        router.refresh();
      }
    } catch (error) {
      if (error instanceof Error) {
        toast.error(error.message);
      }
    }
  };
  return (
    <Card>
      <CardHeader>
        <CardTitle>Profile Info</CardTitle>
        <CardDescription>Your profile as a disciple.</CardDescription>
      </CardHeader>
      <CardContent>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit, onFormError)}>
            <fieldset
              disabled={isBusy}
              className="flex h-full flex-col gap-3.5 disabled:opacity-90"
            >
              <p className="text-foreground text-sm">Personal Information</p>
              <FormField
                control={form.control}
                name="name"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Name</FormLabel>
                    <FormControl>
                      <Input placeholder="Name" {...field} />
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
            </fieldset>

            <div className="flex items-center justify-end gap-3">
              <Button
                type="button"
                variant="ghost"
                onClick={() => form.reset()}
              >
                Reset
              </Button>
              <SubmitButton disabled={!form.formState.isDirty} loading={isBusy}>
                Save Changes
              </SubmitButton>
            </div>
          </form>
        </Form>
      </CardContent>
    </Card>
  );
}
