"use client";

import { BadgeCheckIcon, PackageIcon, ShieldCheckIcon } from "lucide-react";
import {
  List,
  ListItem,
  ListItemContent,
  ListItemPrimary,
  ListItemSecondary,
} from "@/components/ui/list";
import { removeUnderscores } from "@/lib/utils";
import type { DiscipleRecord } from "@/types/globals";
import { DiscipleActionButton } from "./disciple-row-actions";

export function DisciplesList({
  isAdmin,
  disciples,
}: {
  isAdmin: boolean;
  disciples: Array<DiscipleRecord>;
}) {
  return (
    <div className="sm:hidden">
      {disciples.length === 0 ? (
        <div className="flex min-h-[60vh] flex-col items-center justify-center gap-3">
          <PackageIcon className="size-6 text-muted-foreground" />
          <p className="text-center text-muted-foreground text-sm">
            No disciple records found.
          </p>
        </div>
      ) : (
        <List className="min-h-[40vh]">
          {disciples.map((disciple) => (
            <DiscipleListItem
              key={disciple.id}
              isAdmin={isAdmin}
              disciple={disciple}
            />
          ))}
        </List>
      )}
    </div>
  );
}

function DiscipleListItem({
  disciple,
  isAdmin,
}: {
  disciple: DiscipleRecord;
  isAdmin: boolean;
}) {
  return (
    <ListItem className="bg-card/40">
      <ListItemContent>
        <ListItemPrimary className="flex items-center gap-2">
          {disciple.name}
          {disciple.isMyPrimary && !disciple.isPrimary ? (
            <BadgeCheckIcon className="size-3 text-blue-500" />
          ) : null}
          {disciple.isPrimary ? (
            <ShieldCheckIcon className="size-3 text-yellow-500" />
          ) : null}{" "}
        </ListItemPrimary>
        <ListItemSecondary className="capitalize">
          {removeUnderscores(disciple.memberType)},{" "}
          {disciple.gender.toLowerCase()}
        </ListItemSecondary>
        {isAdmin ? (
          <ListItemSecondary>Leader: {disciple.leader?.name}</ListItemSecondary>
        ) : null}
        {disciple.handledBy ? (
          <ListItemSecondary>
            Handled by: {disciple.handledBy.name}
          </ListItemSecondary>
        ) : null}
      </ListItemContent>
      <DiscipleActionButton disciple={disciple} />
    </ListItem>
  );
}
