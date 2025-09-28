import { ArrowLeftIcon, CheckIcon, XIcon } from "lucide-react";
import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { cache } from "react";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { AssignAccountForm } from "@/features/leaders/assign-account-form";
import { getLeaderById } from "@/features/leaders/queries";

interface PageProps {
  params: Promise<{ leaderId: string }>;
}

const cachedGetLeaderById = cache(getLeaderById);

export const generateMetadata = async ({
  params,
}: PageProps): Promise<Metadata> => {
  const pageParams = await params;

  const leader = await cachedGetLeaderById(pageParams.leaderId);

  return {
    title: leader ? leader.name : "Leader not found",
  };
};

async function LeaderDetailPage({ params }: PageProps) {
  const pageParams = await params;

  const leader = await cachedGetLeaderById(pageParams.leaderId);

  if (!leader) return notFound();

  return (
    <div className="flex-1">
      <div className="mx-auto flex max-w-5xl flex-col gap-4 p-4">
        <Link
          href="/leaders"
          className="inline-flex w-max items-center gap-2 text-sm hover:underline"
        >
          <ArrowLeftIcon className="size-4" /> Back to List
        </Link>
        <div className="flex items-center gap-4">
          <div>
            <h2 className="flex items-center gap-2 font-bold">
              {leader.name}{" "}
              {leader.userAccountId ? (
                <Badge variant="ACTIVE">
                  <CheckIcon /> With Account{" "}
                </Badge>
              ) : (
                <Badge variant="INACTIVE">
                  <XIcon />
                  Unregistered
                </Badge>
              )}
            </h2>
            <p className="text-muted-foreground text-sm">Primary Leader</p>
          </div>
        </div>
        <Separator />
        <div className="flex-1 space-y-4">
          <AssignAccountForm leader={leader} />
        </div>
      </div>
    </div>
  );
}

export default LeaderDetailPage;
