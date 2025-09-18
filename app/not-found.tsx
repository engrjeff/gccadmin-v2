import Image from "next/image";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { app } from "@/lib/config";

export default function DefaultNotFoundPage() {
  return (
    <main className="flex flex-col items-center justify-center min-h-[60vh] gap-3">
      <Image
        unoptimized
        src="/gcc-logo.svg"
        alt={app.title}
        width={64}
        height={64}
      />
      <h1 className="font-bold text-4xl text-center">Page not Found.</h1>
      <p className="text-lg text-muted-foreground mb-6">
        The page that you are looking for does not exist.
      </p>
      <Button asChild>
        <Link href="/">Back to Home</Link>
      </Button>
    </main>
  );
}
