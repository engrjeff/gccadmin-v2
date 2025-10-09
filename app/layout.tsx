import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import { ClerkProvider } from "@/components/providers/clerk-provider";
import { ThemeProvider } from "@/components/providers/theme-provider";
import "./globals.css";
import { ClerkLoaded, ClerkLoading } from "@clerk/nextjs";
import { Loader2Icon } from "lucide-react";
import Image from "next/image";
import NextTopLoader from "nextjs-toploader";
import { QueryProvider } from "@/components/providers/query-provider";
import { Toaster } from "@/components/ui/sonner";
import { app } from "@/lib/config";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: {
    template: `%s | ${app.title}`,
    default: app.title,
  },
  description: app.description,
  openGraph: {
    title: app.title,
    images: [
      {
        url: app.ogImageUrl,
        alt: app.title,
        width: 1200,
        height: 630,
      },
    ],
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <ClerkProvider>
      <html lang="en" className="h-full" suppressHydrationWarning>
        <body
          className={`${geistSans.variable} ${geistMono.variable} flex min-h-full flex-col antialiased`}
        >
          <NextTopLoader color={app.themeColor} />
          <QueryProvider>
            <ThemeProvider
              attribute="class"
              defaultTheme="dark"
              enableSystem
              disableTransitionOnChange
            >
              <ClerkLoading>
                <div className="inset-0 flex h-screen w-screen flex-col items-center justify-center gap-4">
                  <Image
                    unoptimized
                    src="/gcc-logo.svg"
                    alt={app.title}
                    width={40}
                    height={40}
                  />
                  <p className="text-lg">The app is loading...</p>
                  <Loader2Icon className="size-6 animate-spin" />
                </div>
              </ClerkLoading>
              <ClerkLoaded>{children}</ClerkLoaded>
              <Toaster richColors />
            </ThemeProvider>
          </QueryProvider>
        </body>
      </html>
    </ClerkProvider>
  );
}
