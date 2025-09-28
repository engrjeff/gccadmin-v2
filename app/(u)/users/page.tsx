import type { Metadata } from "next";
import { SearchField } from "@/components/ui/search-field";
import { getAllClerkUserAccounts } from "@/features/accounts/queries";
import { UsersTable } from "@/features/accounts/users-table";

export const metadata: Metadata = {
  title: "Users",
};

interface PageProps {
  searchParams: Promise<{ q?: string }>;
}

async function UsersPage({ searchParams }: PageProps) {
  const pageSearchParams = await searchParams;

  const users = await getAllClerkUserAccounts(pageSearchParams);

  return (
    <div className="flex-1">
      <div className="mx-auto flex max-w-5xl flex-col gap-4 p-4">
        <div>
          <h2 className="font-bold">Users</h2>
          <p className="text-muted-foreground text-sm">List of User Accounts</p>
        </div>
        <div className="flex items-center gap-3">
          <SearchField paramName="q" placeholder="Search users..." />
        </div>
        <div className="flex-1">
          <UsersTable users={users} />
        </div>
      </div>
    </div>
  );
}

export default UsersPage;
