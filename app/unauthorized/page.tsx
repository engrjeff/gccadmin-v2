import type { Metadata } from "next";
import Image from "next/image";
import { Footer } from "@/components/footer";
import { Header } from "@/components/header";
import { RequestAccessForm } from "@/features/accounts/request-access-form";
import { app } from "@/lib/config";

export const metadata: Metadata = {
  title: "Unauthorized",
  description: "Your account has no rights to access that page.",
};

export default function UnauthorizedPage() {
  return (
    <>
      <Header />
      <main className="container mx-auto flex min-h-[80vh] max-w-6xl flex-1 flex-col items-center justify-center gap-3 px-6">
        <Image
          unoptimized
          src="/gcc-logo.svg"
          alt={app.title}
          width={64}
          height={64}
        />
        <h1 className="text-center font-bold text-3xl md:text-5xl">
          Unauthorized.
        </h1>
        <p className="text-center text-lg text-muted-foreground">
          Your account has no rights to access that page.
        </p>
        <RequestAccessForm />
      </main>
      <Footer />
    </>
  );
}
