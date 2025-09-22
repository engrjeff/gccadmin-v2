import type { User } from "@clerk/nextjs/server";
import { CheckIcon, PackageIcon, XIcon } from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { formatDateDistance } from "@/lib/utils";

export function UsersTable({ users }: { users: User[] }) {
  return (
    <div className="bg-background overflow-hidden rounded-md border">
      <Table>
        <TableHeader>
          <TableRow className="hover:bg-card bg-card">
            <TableHead className="w-5">#</TableHead>
            <TableHead>Name</TableHead>
            <TableHead>Role</TableHead>
            <TableHead>Status</TableHead>
            <TableHead>Email Verified?</TableHead>
            <TableHead>Last Active At</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {users?.length === 0 ? (
            <TableRow className="hover:bg-transparent">
              <TableCell colSpan={3}>
                <div className="min-h-[300px] flex flex-col items-center justify-center gap-3">
                  <PackageIcon className="size-6 text-muted-foreground" />
                  <p className="text-sm text-muted-foreground text-center">
                    No user found.
                  </p>
                </div>
              </TableCell>
            </TableRow>
          ) : (
            users?.map((user, index) => (
              <TableRow key={user.id} className="hover:bg-transparent">
                <TableCell className="border-r">{index + 1}</TableCell>
                <TableCell className="font-medium">
                  <div className="flex items-center gap-2">
                    <Avatar>
                      <AvatarImage
                        src={user.imageUrl}
                        alt={user.fullName ?? ""}
                      />
                      <AvatarFallback>
                        {user.fullName
                          ?.split(" ")
                          .slice(0, 2)
                          ?.map((s) => s.charAt(0))
                          ?.join("")}
                      </AvatarFallback>
                    </Avatar>
                    <div>
                      <p className="font-semibold">{user.fullName}</p>
                      <p className="text-xs text-muted-foreground">
                        {user.primaryEmailAddress?.emailAddress}
                      </p>
                    </div>
                  </div>
                </TableCell>
                <TableCell>
                  <Badge variant="ACTIVE">
                    {
                      (
                        user.publicMetadata as CustomJwtSessionClaims["metadata"]
                      ).role
                    }
                  </Badge>
                </TableCell>
                <TableCell>
                  {(user.publicMetadata as CustomJwtSessionClaims["metadata"])
                    .role ? (
                    <Badge variant="ACTIVE">
                      <CheckIcon /> Account Linked
                    </Badge>
                  ) : (
                    <Badge variant="INACTIVE">
                      <XIcon />
                      Unregistered
                    </Badge>
                  )}
                </TableCell>
                <TableCell>
                  {user.primaryEmailAddress?.verification ? (
                    <Badge variant="ACTIVE">
                      <CheckIcon /> Verified
                    </Badge>
                  ) : (
                    <Badge variant="INACTIVE">
                      <XIcon />
                      Unverified
                    </Badge>
                  )}
                </TableCell>
                <TableCell>
                  {user.lastActiveAt
                    ? formatDateDistance(new Date(user.lastActiveAt))
                    : "--"}
                </TableCell>
              </TableRow>
            ))
          )}
        </TableBody>
      </Table>
    </div>
  );
}
