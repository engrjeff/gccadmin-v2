"use client";

import { useUser } from "@clerk/nextjs";
import { ArrowRightIcon } from "lucide-react";
import { Button } from "@/components/ui/button";

export function RequestAccessForm() {
  const { user } = useUser();

  const userEmail = user?.primaryEmailAddress;
  const userName = user?.fullName;

  const subject = encodeURIComponent("Request Access as a GCC Leader");
  const body = encodeURIComponent(
    `Hi Admin! \n\nPlease grant me Leader rights to GCC Admin App. \n\nMy email is ${userEmail} and my account name is ${userName}. \n\nThank you.`,
  );

  return (
    <div className="mt-4 space-y-3 text-center">
      <p>Click the button below to request access.</p>
      <Button size="sm" asChild>
        <a
          href={`mailto:gccsystemph@gmail.com?subject=${subject}&body=${body}`}
        >
          Request Acces <ArrowRightIcon />
        </a>
      </Button>
    </div>
  );
}
