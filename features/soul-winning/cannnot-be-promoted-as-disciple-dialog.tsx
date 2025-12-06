import { InfoIcon } from "lucide-react";
import type { ComponentProps } from "react";
import { Gender, type MemberType } from "@/app/generated/prisma";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { removeUnderscores } from "@/lib/utils";

interface Props extends ComponentProps<typeof AlertDialog> {
  name: string;
  gender: Gender;
  memberType: MemberType;
}

export function CannotBePromotedAsDiscipleDialog({
  name,
  gender,
  memberType,
  ...dialogProps
}: Props) {
  const pronoun = gender === Gender.MALE ? "he" : "she";

  return (
    <AlertDialog {...dialogProps}>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle className="flex items-center gap-2">
            <InfoIcon className="size-4 text-blue-500" /> <span>Info</span>
          </AlertDialogTitle>
          <AlertDialogDescription className="mb-4">
            <span className="font-semibold text-foreground">{name}</span> cannot
            be promoted as a Disciple record yet because {pronoun} has not yet
            taken all Soul-Winning and Consolidation lessons.
          </AlertDialogDescription>
          <Alert>
            <AlertTitle>New Believer Details</AlertTitle>
            <AlertDescription>
              <p>
                <span>Name: </span>
                {name}
              </p>
              <p>
                <span>Gender: </span>
                {gender}
              </p>
              <p>
                <span>Member Type: </span>
                {removeUnderscores(memberType)}
              </p>
            </AlertDescription>
          </Alert>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogAction>Okay</AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}
