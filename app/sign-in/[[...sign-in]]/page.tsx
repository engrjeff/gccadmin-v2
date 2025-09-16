import { SignIn } from "@clerk/nextjs";
import { Header } from "@/components/header";

export default function SignInPage() {
  return (
    <>
      <Header />
      <main className="flex w-full flex-1 items-center justify-center p-6 md:p-10">
        <SignIn />
      </main>
    </>
  );
}
