import type { Metadata } from "next";
import { Card, CardContent } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { DiscipleAccountCard } from "@/features/disciples/disciple-account-card";
import { DiscipleProfileForm } from "@/features/disciples/disciple-profile-form";
import { getDiscipleProfile } from "@/features/disciples/queries";

export const metadata: Metadata = {
  title: "My Profile",
};

async function MyProfilePage() {
  const { discipleProfile } = await getDiscipleProfile();

  if (!discipleProfile)
    return (
      <div className="flex-1">
        <div className="mx-auto flex max-w-5xl flex-col gap-4 p-4">
          <Card>
            <CardContent>
              <p>No disciple profile found.</p>
            </CardContent>
          </Card>
        </div>
      </div>
    );

  return (
    <div className="flex-1">
      <div className="mx-auto flex max-w-5xl flex-col gap-4 p-4">
        <div className="flex items-center gap-4">
          <div>
            <h2 className="flex items-center gap-2 font-bold">
              {discipleProfile.name}{" "}
            </h2>
            {discipleProfile.isPrimary ? (
              <p className="text-muted-foreground text-sm">Primary Leader</p>
            ) : null}
          </div>
        </div>
        <Separator />
        <div className="flex-1 space-y-4">
          <DiscipleProfileForm
            key={discipleProfile.updatedAt.toString()}
            disciple={discipleProfile}
          />
          <DiscipleAccountCard email={discipleProfile.userAccount?.email} />
        </div>
      </div>
    </div>
  );
}

export default MyProfilePage;
