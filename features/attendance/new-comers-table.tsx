"use client";

import { PlusIcon, XIcon } from "lucide-react";
import { useFieldArray, useFormContext } from "react-hook-form";
import { Gender, MemberType } from "@/app/generated/prisma";
import { AppCombobox } from "@/components/app-combobox";
import { Button } from "@/components/ui/button";
import {
  FormControl,
  FormField,
  FormItem,
  FormLabel,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { SelectNative } from "@/components/ui/select-native";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { useChurchMembers } from "@/hooks/use-church-members";
import type { AddAttendeesInputs } from "./schema";

const COL_COUNT = 8;

export function NewComersTable() {
  const form = useFormContext<AddAttendeesInputs>();

  const newComerFields = useFieldArray({
    control: form.control,
    name: "newComers",
  });

  const churchMembersQuery = useChurchMembers({ gender: "all" });

  const invitedByOptions =
    churchMembersQuery.data?.churchMembers.flatMap((m) =>
      m.members.map((m) => ({ label: m.name, value: m.id })),
    ) ?? [];

  return (
    <div className="overflow-hidden rounded-md border">
      <Table>
        <TableHeader className="sticky top-0 z-10 bg-card backdrop-blur-sm">
          <TableRow className="hover:bg-transparent">
            <TableHead className="w-6 text-center">#</TableHead>
            <TableHead>Name</TableHead>
            <TableHead className="w-24">Gender</TableHead>
            <TableHead className="w-32">Member Type</TableHead>
            <TableHead className="w-56">Invited By</TableHead>
            <TableHead className="w-32">Contact No.</TableHead>
            <TableHead className="w-36">Address</TableHead>
            <TableHead className="w-9"></TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {newComerFields.fields.map((field, fieldIndex) => (
            <TableRow key={field.id} className="hover:bg-transparent">
              <TableCell className="w-6 border-r text-center">
                {fieldIndex + 1}
              </TableCell>
              <TableCell className="border-r p-0">
                <FormField
                  control={form.control}
                  name={`newComers.${fieldIndex}.name`}
                  render={({ field }) => (
                    <FormItem className="space-y-0">
                      <FormLabel className="sr-only">Title</FormLabel>
                      <FormControl>
                        <Input
                          placeholder="Name"
                          className="rounded-none border-transparent focus-visible:ring-0 dark:bg-background"
                          {...field}
                        />
                      </FormControl>
                    </FormItem>
                  )}
                />
              </TableCell>
              <TableCell className="border-r p-0">
                <FormField
                  control={form.control}
                  name={`newComers.${fieldIndex}.gender`}
                  render={({ field }) => (
                    <FormItem className="space-y-0">
                      <FormLabel className="sr-only">Gender</FormLabel>
                      <FormControl>
                        <SelectNative
                          className="rounded-none border-transparent bg-background capitalize focus-visible:ring-0 dark:bg-transparent"
                          {...field}
                          onChange={(e) => {
                            const value = e.currentTarget.value as Gender;

                            field.onChange(e);

                            if (
                              form.watch(
                                `newComers.${fieldIndex}.memberType`,
                              ) === MemberType.MEN &&
                              value === Gender.FEMALE
                            ) {
                              form.setValue(
                                `newComers.${fieldIndex}.memberType`,
                                MemberType.WOMEN,
                              );
                            }

                            if (
                              form.watch(
                                `newComers.${fieldIndex}.memberType`,
                              ) === MemberType.WOMEN &&
                              value === Gender.MALE
                            ) {
                              form.setValue(
                                `newComers.${fieldIndex}.memberType`,
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
              </TableCell>
              <TableCell className="border-r p-0">
                <FormField
                  control={form.control}
                  name={`newComers.${fieldIndex}.memberType`}
                  render={({ field }) => (
                    <FormItem className="space-y-0">
                      <FormLabel className="sr-only">Member Type</FormLabel>
                      <FormControl>
                        <SelectNative
                          {...field}
                          className="rounded-none border-transparent bg-background capitalize focus-visible:ring-0 dark:bg-transparent"
                        >
                          <option value={MemberType.UNCATEGORIZED}>--</option>

                          <option
                            disabled={
                              form.watch(`newComers.${fieldIndex}.gender`) ===
                              Gender.FEMALE
                            }
                            value={MemberType.MEN}
                          >
                            Men
                          </option>
                          <option
                            disabled={
                              form.watch(`newComers.${fieldIndex}.gender`) ===
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
              </TableCell>
              <TableCell className="border-r p-0">
                <FormField
                  control={form.control}
                  name={`newComers.${fieldIndex}.invitedById`}
                  render={({ field }) => (
                    <FormItem className="space-y-0">
                      <FormLabel className="sr-only">Invited By</FormLabel>
                      <FormControl>
                        <AppCombobox
                          fullwidth
                          label="Invited by"
                          value={field.value}
                          onValueChange={field.onChange}
                          className="rounded-none bg-background focus-visible:border-ring focus-visible:ring-1 focus-visible:ring-ring active:ring-1 dark:border-transparent dark:bg-background dark:hover:bg-transparent"
                          options={invitedByOptions}
                        />
                      </FormControl>
                    </FormItem>
                  )}
                />
              </TableCell>
              <TableCell className="border-r p-0">
                <FormField
                  control={form.control}
                  name={`newComers.${fieldIndex}.contactNo`}
                  render={({ field }) => (
                    <FormItem className="space-y-0">
                      <FormLabel className="sr-only">Contact No.</FormLabel>
                      <FormControl>
                        <Input
                          placeholder="Contact No."
                          className="rounded-none border-transparent focus-visible:ring-0 dark:bg-background"
                          {...field}
                        />
                      </FormControl>
                    </FormItem>
                  )}
                />
              </TableCell>
              <TableCell className="border-r p-0">
                <FormField
                  control={form.control}
                  name={`newComers.${fieldIndex}.address`}
                  render={({ field }) => (
                    <FormItem className="space-y-0">
                      <FormLabel className="sr-only">Address</FormLabel>
                      <FormControl>
                        <Input
                          placeholder="Address"
                          className="rounded-none border-transparent focus-visible:ring-0 dark:bg-background"
                          {...field}
                        />
                      </FormControl>
                    </FormItem>
                  )}
                />
              </TableCell>
              <TableCell className="p-0">
                <Button
                  type="button"
                  className="inline-block h-9 rounded-none text-red-500 dark:hover:bg-red-500/10 dark:hover:text-red-500"
                  variant="ghost"
                  aria-label="remove this row"
                  onClick={() => {
                    newComerFields.remove(fieldIndex);
                  }}
                >
                  <XIcon />
                </Button>
              </TableCell>
            </TableRow>
          ))}
          <TableRow className="hover:bg-transparent">
            <TableCell colSpan={COL_COUNT}>
              <Button
                type="button"
                size="sm"
                className="bg-white text-black hover:bg-white/80"
                onClick={() => {
                  newComerFields.append({
                    name: "",
                    gender: Gender.MALE,
                    memberType: MemberType.UNCATEGORIZED,
                  });
                }}
              >
                <PlusIcon /> Add Entry
              </Button>
            </TableCell>
          </TableRow>
        </TableBody>
      </Table>
    </div>
  );
}
