import { SignUp } from "@clerk/nextjs";
import type { Metadata } from "next";
import { Footer } from "@/components/footer";
import { Header } from "@/components/header";

export const metadata: Metadata = {
  title: "Sign Up",
  description: "Create an account to access the dashboard.",
};

export default function SignUpPage() {
  return (
    <>
      <Header />
      <main className="flex w-full flex-1 items-center justify-center p-6 md:p-10">
        <SignUp />
      </main>
      <Footer />
    </>
  );
}
