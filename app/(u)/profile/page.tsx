import { CheckIcon } from "lucide-react";
import type { Metadata } from "next";
import { notFound } from "next/navigation";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import { DiscipleProfileForm } from "@/features/disciples/disciple-profile-form";
import { getDiscipleProfile } from "@/features/disciples/queries";

export const metadata: Metadata = {
  title: "My Profile",
};

async function MyProfilePage() {
  const { discipleProfile } = await getDiscipleProfile();

  if (!discipleProfile) return notFound();

  return (
    <div className="flex-1">
      <div className="max-w-5xl mx-auto flex flex-col gap-4 p-4">
        <div className="flex items-center gap-4">
          <div>
            <h2 className="font-bold flex items-center gap-2">
              {discipleProfile.name}{" "}
            </h2>
            {discipleProfile.isPrimary ? (
              <p className="text-sm text-muted-foreground">Primary Leader</p>
            ) : null}
          </div>
        </div>
        <Separator />
        <div className="flex-1 space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Account</CardTitle>
              <CardDescription>Linked User Account</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                <Label htmlFor="leader">Leader</Label>
                <div className="relative">
                  <Input
                    readOnly
                    disabled
                    type="email"
                    defaultValue={discipleProfile.userAccount?.email}
                  />
                  <CheckIcon className="size-4 absolute top-1/2 right-2 -translate-y-1/2 text-green-500" />
                </div>
              </div>
            </CardContent>
          </Card>
          <DiscipleProfileForm
            key={discipleProfile.updatedAt.toString()}
            disciple={discipleProfile}
          />
        </div>
      </div>
    </div>
  );
}

export default MyProfilePage;
