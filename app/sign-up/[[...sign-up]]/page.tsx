import { SignUp } from "@clerk/nextjs";
import { Header } from "@/components/header";

export default function SignUpPage() {
  return (
    <>
      <Header />
      <main className="flex w-full flex-1 items-center justify-center p-6 md:p-10">
        <SignUp />
      </main>
    </>
  );
}
