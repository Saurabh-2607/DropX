import type { Metadata } from "next";
import { ClerkProvider } from "@clerk/nextjs";
import { Providers } from "./providers";
import "./globals.css";
import { Instrument_Serif, Geist, Geist_Mono } from "next/font/google";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";

const fontSerif = Instrument_Serif({
  subsets: ["latin"],
  variable: "--font-serif",
  weight: ["400"],
  style: ["normal", "italic"],
});

const fontSans = Geist({
  subsets: ["latin"],
  variable: "--font-sans",
});

const fontMono = Geist_Mono({
  subsets: ["latin"],
  variable: "--font-mono",
});

export const metadata: Metadata = {
  title: "DropX",
  description: "Secure cloud storage for your images, powered by ImageKit",
};

import { currentUser } from "@clerk/nextjs/server";

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  let user = null;
  try {
    user = await currentUser();
  } catch (error: any) {
    if (
      error &&
      (error.digest === "DYNAMIC_SERVER_USAGE" ||
        error.message?.includes("Dynamic server usage"))
    ) {
      throw error;
    }
    console.error("Clerk API authentication error:", error);
  }

  const serializedUser = user
    ? {
        id: user.id,
        firstName: user.firstName,
        lastName: user.lastName,
        imageUrl: user.imageUrl,
        username: user.username,
        emailAddress: user.emailAddresses?.[0]?.emailAddress,
      }
    : null;

  return (
    <ClerkProvider>
      <html lang="en" className="light overflow-x-hidden">
        <body
          className={`${fontSans.variable} ${fontMono.variable} ${fontSerif.variable} ${fontSans.className} antialiased bg-[#fafaf9] text-[#292524] overflow-x-hidden`}
        >
          <Providers>
            <div className="min-h-screen flex flex-col justify-between">
              <Navbar user={serializedUser} />
              <div className="flex-grow w-full flex flex-col">{children}</div>
              <Footer />
            </div>
          </Providers>
        </body>
      </html>
    </ClerkProvider>
  );
}
