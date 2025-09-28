"use client";

import {
  List,
  ListItem,
  ListItemLinkContent,
  ListItemPrimary,
  ListItemSecondary,
  ListItemTrailing,
} from "@/components/ui/list";
import { removeUnderscores } from "@/lib/utils";
import type { DiscipleRecord } from "@/types/globals";
import { DiscipleRowMobileActions } from "./disciple-row-actions";

export function DisciplesList({
  isAdmin,
  disciples,
}: {
  isAdmin: boolean;
  disciples: Array<DiscipleRecord>;
}) {
  return (
    <div className="sm:hidden">
      <List>
        {disciples.map((disciple) => (
          <DiscipleListItem
            key={disciple.id}
            isAdmin={isAdmin}
            disciple={disciple}
          />
        ))}
      </List>
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
    <ListItem>
      <ListItemLinkContent href={`/disciples/${disciple.id}`}>
        <ListItemPrimary className="hover:underline">
          {disciple.name}
        </ListItemPrimary>
        <ListItemSecondary className="capitalize">
          {removeUnderscores(disciple.memberType)},{" "}
          {disciple.gender.toLowerCase()}
        </ListItemSecondary>
        {isAdmin ? (
          <ListItemSecondary>Leader: {disciple.leader?.name}</ListItemSecondary>
        ) : null}
      </ListItemLinkContent>
      <ListItemTrailing>
        <DiscipleRowMobileActions disciple={disciple} />
      </ListItemTrailing>
    </ListItem>
  );
}
