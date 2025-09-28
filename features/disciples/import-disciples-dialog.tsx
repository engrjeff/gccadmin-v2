"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import {
  AlertCircleIcon,
  ArrowDownIcon,
  ChevronDownIcon,
  ImportIcon,
  Loader2Icon,
} from "lucide-react";
import { useAction } from "next-safe-action/hooks";
import { type ChangeEvent, useId, useState } from "react";
import {
  type SubmitErrorHandler,
  type SubmitHandler,
  useFieldArray,
  useForm,
} from "react-hook-form";
import { toast } from "sonner";
import * as XLSX from "xlsx";
import z from "zod";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Label } from "@/components/ui/label";
import { SelectNative } from "@/components/ui/select-native";
import { SubmitButton } from "@/components/ui/submit-button";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { useIsAdmin } from "@/hooks/use-is-admin";
import { useLeaders } from "@/hooks/use-leaders";
import { removeUnderscores } from "@/lib/utils";
import { bulkCreateDisciples } from "./actions";
import { type DiscipleImportInputs, importDisciplesSchema } from "./schema";

export function ImportDisciplesDialog() {
  const [open, setOpen] = useState(false);

  return (
    <div className="flex items-center">
      <Dialog open={open} onOpenChange={setOpen}>
        <DialogTrigger asChild>
          <Button
            size="sm"
            variant="secondaryOutline"
            className="rounded-tr-none rounded-br-none"
          >
            Import
          </Button>
        </DialogTrigger>
        <DialogContent
          onEscapeKeyDown={(e) => e.preventDefault()}
          onInteractOutside={(e) => e.preventDefault()}
          className="gap-0 p-0 sm:max-w-6xl"
        >
          <DialogHeader className="border-b p-4 text-left">
            <DialogTitle>Import Disciples</DialogTitle>
            <div className="flex items-center justify-between gap-4 pr-4">
              <DialogDescription>
                Upload a <Badge variant="outline">.xlsx</Badge> file.
              </DialogDescription>
              <a
                href="/templates/disciple-template.xlsx"
                download
                target="_blank"
                rel="noreferrer"
                className="inline-flex items-center gap-1.5 text-blue-500 text-sm hover:underline"
              >
                <ArrowDownIcon size={16} strokeWidth={2} aria-hidden="true" />
                Download Template
              </a>
            </div>
          </DialogHeader>
          <DisciplesImportContent onAfterSave={() => setOpen(false)} />
        </DialogContent>
      </Dialog>

      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button
            size="iconSm"
            variant="secondaryOutline"
            className="rounded-tl-none rounded-bl-none border-l-0"
          >
            <ChevronDownIcon />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end">
          <DropdownMenuItem asChild>
            <a
              href="/templates/disciple-template.xlsx"
              download
              target="_blank"
              rel="noreferrer"
            >
              <ArrowDownIcon
                size={16}
                strokeWidth={2}
                className="opacity-60"
                aria-hidden="true"
              />
              Download Template
            </a>
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    </div>
  );
}

type DiscipleEntry = DiscipleImportInputs["disciples"][number];
type EntryError = Record<number, { [k in keyof DiscipleEntry]?: string }>;

function DisciplesImportContent({
  onAfterSave,
}: {
  onAfterSave: VoidFunction;
}) {
  const [view, setView] = useState<"upload" | "success" | "error">("upload");
  const [fileLoading, setFileLoading] = useState(false);
  const fileInputId = useId();
  const isAdmin = useIsAdmin();

  const [leaderId, setLeaderId] = useState<string>();

  const leadersQuery = useLeaders({ enabled: isAdmin });

  const [dataWithError, setDataWithError] = useState<DiscipleEntry[]>([]);
  const [entryErrors, setEntryErrors] = useState<EntryError>({});

  const form = useForm<DiscipleImportInputs>({
    resolver: zodResolver(importDisciplesSchema),
    defaultValues: { disciples: [] },
  });

  const discipleFields = useFieldArray({
    control: form.control,
    name: "disciples",
  });

  const bulkCreateAction = useAction(bulkCreateDisciples, {
    onError: ({ error }) => {
      console.error(error);
      toast.error(error.serverError ?? `Error saving imported disciples`);
    },
  });

  const isBusy = bulkCreateAction.isPending;

  const onFormError: SubmitErrorHandler<DiscipleImportInputs> = (errors) => {
    console.log(`Disciple Import Form Errors: `, errors);
  };

  const onSubmit: SubmitHandler<DiscipleImportInputs> = async (data) => {
    try {
      if (isAdmin && !leaderId) {
        toast.error("Please select a leader.");
        return;
      }

      const result = await bulkCreateAction.executeAsync({
        disciples: data.disciples.map((d) => ({ ...d, leaderId: leaderId })),
      });

      if (result.data?.disciples.count) {
        toast.success(`${result.data?.disciples.count} disciples were added!`);

        onAfterSave();
      }
    } catch (error) {
      if (error instanceof Error) {
        toast.error(error.message);
      }
    }
  };

  const handleChangeFile = () => {
    setDataWithError([]);
    setEntryErrors({});
    discipleFields.remove();
    setView("upload");
  };

  const handleFileUpload = (e: ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;

    const file = files?.[0];

    if (!file) return;

    const reader = new FileReader();

    reader.onloadstart = () => {
      setFileLoading(true);
    };

    reader.onloadend = () => {
      setFileLoading(false);
    };

    reader.onload = (event) => {
      if (!event.target?.result) return;

      const workbook = XLSX.read(event.target.result, {
        type: "binary",
        cellDates: true,
      });

      const sheet = workbook.Sheets[workbook.SheetNames[0]];

      const sheetData = XLSX.utils.sheet_to_json<
        DiscipleImportInputs["disciples"][number]
      >(sheet, {
        raw: false,
        header: [
          "name",
          "address",
          "birthdate",
          "gender",
          "memberType",
          "cellStatus",
          "churchStatus",
          "processLevel",
          "processLevelStatus",
        ],
      });

      const rawData = sheetData.slice(1);

      const validatedData = importDisciplesSchema.safeParse({
        disciples: rawData.map((d) => ({
          name: d.name,
          address: d.address,
          birthdate: d.birthdate,
          gender: d.gender,
          memberType: d.memberType,
          cellStatus: d.cellStatus,
          churchStatus: d.churchStatus,
          processLevel: d.processLevel,
          processLevelStatus: d.processLevelStatus,
        })),
      });

      const tempEntryError: EntryError = {};

      if (!validatedData.success) {
        z.treeifyError(
          validatedData.error,
        ).properties?.disciples?.items?.forEach((item, index) => {
          // collect field errors
          tempEntryError[index] = {
            name: item.properties?.name?.errors?.at(0),
            address: item.properties?.address?.errors?.at(0),
            gender: item.properties?.gender?.errors?.at(0),
            memberType: item.properties?.memberType?.errors?.at(0),
            cellStatus: item.properties?.cellStatus?.errors?.at(0),
            churchStatus: item.properties?.churchStatus?.errors?.at(0),
            processLevel: item.properties?.processLevel?.errors?.at(0),
            processLevelStatus:
              item.properties?.processLevelStatus?.errors?.at(0),
          };
        });

        setDataWithError(rawData);
        setEntryErrors(tempEntryError);
        setView("error");
        return;
      }

      if (validatedData.success) {
        setView("success");

        discipleFields.replace(validatedData.data.disciples);

        toast.success(`Parsed ${validatedData.data.disciples.length} rows.`);
      }
    };

    reader.readAsArrayBuffer(file);
  };

  return (
    <form
      onSubmit={form.handleSubmit(onSubmit, onFormError)}
      className="max-w-full overflow-hidden"
    >
      <fieldset disabled={isBusy} className="group p-4 disabled:opacity-90">
        {view === "upload" ? (
          <div>
            <label
              htmlFor={fileInputId}
              className="flex h-[200px] cursor-pointer flex-col items-center justify-center rounded-lg border border-dashed hover:bg-muted/20 group-disabled:cursor-not-allowed group-disabled:hover:bg-transparent"
            >
              {fileLoading ? (
                <>
                  <Loader2Icon
                    strokeWidth={1.5}
                    className="size-5 animate-spin text-muted-foreground"
                  />
                  <span className="text-center text-muted-foreground text-sm">
                    Loading file...
                  </span>
                </>
              ) : (
                <>
                  <ImportIcon
                    strokeWidth={1.5}
                    className="mb-3 size-6 text-muted-foreground"
                  />
                  <span className="text-center text-muted-foreground text-sm">
                    Click to select a <Badge variant="outline">.xlsx</Badge>{" "}
                    file
                  </span>
                </>
              )}
              <input
                type="file"
                hidden
                name={fileInputId}
                id={fileInputId}
                key={view}
                accept=".xlsx, .xls, .csv"
                onChange={handleFileUpload}
              />
            </label>
            <div className="mt-4 flex gap-3 border-t pt-4 pb-0">
              <DialogClose asChild>
                <Button
                  type="button"
                  size="sm"
                  variant="secondary"
                  className="ml-auto"
                >
                  Cancel
                </Button>
              </DialogClose>
            </div>
          </div>
        ) : null}

        {view === "success" && discipleFields.fields.length ? (
          <div className="w-full max-w-full space-y-6 overflow-x-auto">
            {isAdmin ? (
              <div className="ml-1 w-1/4 space-y-2">
                <Label>Leader</Label>
                <SelectNative
                  disabled={leadersQuery.isLoading}
                  className="capitalize"
                  value={leaderId}
                  onChange={(e) => setLeaderId(e.currentTarget.value)}
                >
                  <option value="">Select a Leader</option>
                  {leadersQuery.data?.map((leader) => (
                    <option key={leader.id} value={leader.id}>
                      {leader.name}
                    </option>
                  ))}
                </SelectNative>
              </div>
            ) : null}
            <div className="[&>div]:max-h-[450px] [&>div]:rounded-md [&>div]:border">
              <Table>
                <TableHeader className="sticky top-0 z-10 bg-card backdrop-blur-sm">
                  <TableRow className="hover:bg-transparent">
                    <TableHead className="size-4 text-center">#</TableHead>
                    <TableHead>Name</TableHead>
                    <TableHead>Address</TableHead>
                    <TableHead>Birthdate</TableHead>
                    <TableHead>Gender</TableHead>
                    <TableHead>Member Type</TableHead>
                    <TableHead>Cell Status</TableHead>
                    <TableHead>Church Status</TableHead>
                    <TableHead>Process Level</TableHead>
                    <TableHead>Process Status</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {discipleFields.fields.map((d, index) => (
                    <TableRow key={d.id} className="hover:bg-transparent">
                      <TableCell className="w-4 border-r bg-card text-center">
                        {index + 1}
                      </TableCell>
                      <TableCell>{d.name}</TableCell>
                      <TableCell>{d.address}</TableCell>
                      <TableCell>{d.birthdate}</TableCell>
                      <TableCell>
                        <Badge variant={d.gender}>
                          {removeUnderscores(d.gender)}
                        </Badge>
                      </TableCell>
                      <TableCell>
                        <Badge variant={d.memberType}>
                          {removeUnderscores(d.memberType)}
                        </Badge>
                      </TableCell>
                      <TableCell>
                        <Badge variant={d.cellStatus}>
                          {removeUnderscores(d.cellStatus)}
                        </Badge>
                      </TableCell>
                      <TableCell>
                        <Badge variant={d.churchStatus}>
                          {removeUnderscores(d.churchStatus)}
                        </Badge>
                      </TableCell>
                      <TableCell>
                        <Badge variant={d.processLevel}>
                          {removeUnderscores(d.processLevel)}
                        </Badge>
                      </TableCell>
                      <TableCell>
                        <Badge variant={d.processLevelStatus}>
                          {removeUnderscores(d.processLevelStatus)}
                        </Badge>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>

            <div className="flex gap-3 border-t pt-4">
              <Button
                type="button"
                size="sm"
                variant="secondary"
                onClick={handleChangeFile}
              >
                Change File
              </Button>
              <DialogClose asChild>
                <Button
                  type="button"
                  size="sm"
                  variant="ghost"
                  className="ml-auto"
                >
                  Cancel
                </Button>
              </DialogClose>
              <SubmitButton size="sm" loading={isBusy}>
                Save Disciples
              </SubmitButton>
            </div>
          </div>
        ) : null}

        {view === "error" && dataWithError.length ? (
          <Alert variant="destructive" className="mb-4 flex items-start">
            <AlertCircleIcon />
            <div>
              <AlertTitle>Check row issues</AlertTitle>
              <AlertDescription>
                <p className="text-destructive">Upload the corrected file.</p>
              </AlertDescription>
            </div>
            <Button
              type="button"
              size="sm"
              variant="outline"
              className="ml-auto"
              onClick={handleChangeFile}
            >
              Change File
            </Button>
          </Alert>
        ) : null}

        {view === "error" && dataWithError.length ? (
          <div className="w-full max-w-full space-y-6 overflow-x-auto">
            <div className="[&>div]:max-h-[450px] [&>div]:rounded-md [&>div]:border">
              <Table>
                <TableHeader className="sticky top-0 z-10 bg-card backdrop-blur-sm">
                  <TableRow className="hover:bg-transparent">
                    <TableHead className="size-4 text-center">#</TableHead>
                    <TableHead>Name</TableHead>
                    <TableHead>Address</TableHead>
                    <TableHead>Birthdate</TableHead>
                    <TableHead>Gender</TableHead>
                    <TableHead>Member Type</TableHead>
                    <TableHead>Cell Status</TableHead>
                    <TableHead>Church Status</TableHead>
                    <TableHead>Process Level</TableHead>
                    <TableHead>Process Status</TableHead>
                    <TableHead>Issues</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {dataWithError.map((d, index) => (
                    <TableRow
                      key={`error-entry-${index.toString()}`}
                      data-has-error={Object.values(
                        entryErrors[index] ?? {},
                      ).some(Boolean)}
                      className="hover:bg-transparent data-[has-error=true]:bg-red-500/20"
                    >
                      <TableCell className="w-4 border-r bg-card text-center">
                        {index + 1}
                      </TableCell>
                      <TableCell>{d.name}</TableCell>
                      <TableCell>{d.address}</TableCell>
                      <TableCell>{d.birthdate}</TableCell>
                      <TableCell>
                        <Badge variant={d.gender}>
                          {removeUnderscores(d.gender)}
                        </Badge>
                      </TableCell>
                      <TableCell>
                        <Badge variant={d.memberType}>
                          {removeUnderscores(d.memberType)}
                        </Badge>
                      </TableCell>
                      <TableCell>
                        <Badge variant={d.cellStatus}>
                          {removeUnderscores(d.cellStatus)}
                        </Badge>
                      </TableCell>
                      <TableCell>
                        <Badge variant={d.churchStatus}>
                          {removeUnderscores(d.churchStatus)}
                        </Badge>
                      </TableCell>
                      <TableCell>
                        <Badge variant={d.processLevel}>
                          {removeUnderscores(d.processLevel)}
                        </Badge>
                      </TableCell>
                      <TableCell>
                        <Badge variant={d.processLevelStatus}>
                          {removeUnderscores(d.processLevelStatus)}
                        </Badge>
                      </TableCell>
                      <TableCell>
                        <ul>
                          {Object.values(entryErrors[index] ?? {}).map(
                            (err, errIndex) => (
                              <li
                                key={`error-${errIndex.toString()}`}
                                className="text-xs"
                              >
                                {err}
                              </li>
                            ),
                          )}
                        </ul>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          </div>
        ) : null}
      </fieldset>
    </form>
  );
}
