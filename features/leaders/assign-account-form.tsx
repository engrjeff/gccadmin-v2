"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useAction } from "next-safe-action/hooks";
import {
  type SubmitErrorHandler,
  type SubmitHandler,
  useForm,
} from "react-hook-form";
import { toast } from "sonner";
import type { Disciple, User } from "@/app/generated/prisma";
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
import { Label } from "@/components/ui/label";
import { SelectNative } from "@/components/ui/select-native";
import { SubmitButton } from "@/components/ui/submit-button";
import { useClerkUserAccounts } from "../accounts/useClerkUserAccounts";
import { assignAccountToLeader } from "./actions";
import { type AssignAccountInputs, assignAccountSchema } from "./schema";

export function AssignAccountForm({
  leader,
}: {
  leader: Disciple & { userAccount: User | null };
}) {
  const userAccountsQuery = useClerkUserAccounts();

  const form = useForm<AssignAccountInputs>({
    resolver: zodResolver(assignAccountSchema),
    defaultValues: {
      leaderId: leader.id,
      userAccountId: leader.userAccountId ?? undefined,
      userAccountEmail: leader.userAccount?.email ?? undefined,
    },
  });

  const action = useAction(assignAccountToLeader, {
    onError: ({ error }) => {
      console.error(error);
      toast.error(error.serverError ?? `Error assigning account to leader`);
    },
  });

  const onFormError: SubmitErrorHandler<AssignAccountInputs> = (errors) => {
    console.log(`Assign Account Form Errors: `, errors);
  };

  const onSubmit: SubmitHandler<AssignAccountInputs> = async (data) => {
    try {
      const result = await action.executeAsync(data);

      if (result.data?.result.success) {
        toast.success(`Leader was successfully linked to a User Account!`);
        userAccountsQuery.refetch();
      }
    } catch (error) {
      if (error instanceof Error) {
        toast.error(error.message);
      }
    }
  };

  const isBusy = userAccountsQuery.isLoading || action.isPending;

  return (
    <Card>
      <CardHeader>
        <CardTitle>Assign Account</CardTitle>
        <CardDescription>Link to a User Account</CardDescription>
      </CardHeader>
      <CardContent>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit, onFormError)}>
            <fieldset
              disabled={isBusy}
              className="space-y-3 disabled:opacity-90"
            >
              <div className="space-y-2">
                <Label htmlFor="leader">Leader</Label>
                <Input readOnly disabled defaultValue={leader.name} />
              </div>
              <input
                type="hidden"
                hidden
                {...form.register("userAccountEmail")}
                aria-label="User Account Email"
              />
              {leader.userAccountId ? (
                <div className="space-y-2">
                  <Label htmlFor="userAccountId">User Account</Label>
                  <Input
                    readOnly
                    disabled
                    defaultValue={leader.userAccount?.email}
                  />
                </div>
              ) : (
                <FormField
                  control={form.control}
                  name="userAccountId"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>User Account</FormLabel>
                      <FormControl>
                        <SelectNative
                          {...field}
                          onChange={(e) => {
                            if (e.currentTarget.value) {
                              const user = userAccountsQuery.data?.find(
                                (u) => u.clerkId === e.currentTarget.value,
                              );

                              if (user) {
                                form.setValue("userAccountEmail", user.email);
                              }
                            } else {
                              form.setValue("userAccountEmail", "");
                            }

                            field.onChange(e);
                          }}
                        >
                          <option value="">Select user account</option>
                          {userAccountsQuery.data?.map((user) => (
                            <option key={user.clerkId} value={user.clerkId}>
                              {user.firstName} {user.lastName} ({user.email})
                            </option>
                          ))}
                        </SelectNative>
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              )}
              {leader.userAccountId ? null : (
                <div className="flex justify-end pt-6">
                  <SubmitButton
                    disabled={Boolean(leader.userAccountId)}
                    loading={action.isPending}
                  >
                    Link Account
                  </SubmitButton>
                </div>
              )}
            </fieldset>
          </form>
        </Form>
      </CardContent>
    </Card>
  );
}
