import Image from "next/image";
import Link from "next/link";
import { Footer } from "@/components/footer";
import { Header } from "@/components/header";
import { Button } from "@/components/ui/button";
import { app } from "@/lib/config";

export default function DefaultNotFoundPage() {
  return (
    <>
      <Header />
      <main className="flex flex-1 flex-col items-center max-w-6xl container mx-auto justify-center min-h-[80vh] gap-3 px-6">
        <Image
          unoptimized
          src="/gcc-logo.svg"
          alt={app.title}
          width={64}
          height={64}
        />
        <h1 className="font-bold text-3xl md:text-5xl text-center">
          Page not found
        </h1>
        <p className="text-lg text-muted-foreground text-center">
          The page that you are looking for does not exist.
        </p>

        <div className="flex flex-col gap-4 pt-10">
          <Button asChild>
            <Link href="/">Back to Home</Link>
          </Button>
        </div>
      </main>
      <Footer />
    </>
  );
}
