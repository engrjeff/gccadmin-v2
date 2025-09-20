import { SignIn } from "@clerk/nextjs";
import type { Metadata } from "next";
import { Footer } from "@/components/footer";
import { Header } from "@/components/header";

export const metadata: Metadata = {
  title: "Sign In",
  description: "Sign in to your account to access the dashboard.",
};

export default function SignInPage() {
  return (
    <>
      <Header />
      <main className="flex w-full flex-1 items-center justify-center p-6 md:p-10">
        <SignIn />
      </main>
      <Footer />
    </>
  );
}
