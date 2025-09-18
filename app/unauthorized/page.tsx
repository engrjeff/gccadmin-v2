import Image from "next/image";
import { Header } from "@/components/header";
import { RequestAccessForm } from "@/features/accounts/request-access-form";
import { app } from "@/lib/config";

export default function UnauthorizedPage() {
  return (
    <>
      <Header />
      <main className="flex flex-col items-center justify-center min-h-[60vh] gap-3">
        <Image
          unoptimized
          src="/gcc-logo.svg"
          alt={app.title}
          width={64}
          height={64}
        />
        <h1 className="font-bold text-4xl text-center">Unauthorized.</h1>
        <p className="text-lg text-muted-foreground">
          Your account has no rights to access that page.
        </p>
        <RequestAccessForm />
      </main>
    </>
  );
}
