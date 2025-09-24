import { CheckIcon } from "lucide-react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

export function DiscipleAccountCard({ email }: { email?: string }) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Account</CardTitle>
        <CardDescription>Linked User Account</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-2">
          <Label htmlFor="leader">Leader</Label>
          <div className="relative">
            <Input readOnly disabled type="email" defaultValue={email} />
            <CheckIcon className="size-4 absolute top-1/2 right-2 -translate-y-1/2 text-green-500" />
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
