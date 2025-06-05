"use client";

import { Geist } from "next/font/google";
import { ThemeProvider, useTheme } from "next-themes";
import Link from "next/link";
import "./globals.css";

const geistSans = Geist({
  display: "swap",
  subsets: ["latin"],
});

import { ThemeToggler } from "@/components/ThemeToggler";

function AppShell({ children }: { children: React.ReactNode }) {
  return (
    <main>
      <div className="flex-1 w-full flex flex-col items-center">
        <header className="w-full max-w-5xl flex justify-end items-center p-4">
          <ThemeToggler />
        </header>

        <div className={`flex flex-col gap-10 max-w-5xl p-6 rounded-lg w-full`}>
          {children}
        </div>
      </div>
    </main>
  );
}
export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className={geistSans.className} suppressHydrationWarning>
      <body>
        <ThemeProvider
          attribute="class"
          defaultTheme="system"
          enableSystem
          disableTransitionOnChange
        >
          <AppShell>{children}</AppShell>
        </ThemeProvider>
      </body>
    </html>
  );
}
