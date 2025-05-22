"use client";

import { Geist } from "next/font/google";
import { ThemeProvider, useTheme } from "next-themes";
import Link from "next/link";
import "./globals.css";

const geistSans = Geist({
  display: "swap",
  subsets: ["latin"],
});

function ThemeToggler() {
  const { theme, setTheme } = useTheme();

  const toggleTheme = () => {
    setTheme(theme === "light" ? "dark" : "light");
  };

  return (
    <button
      onClick={toggleTheme}
      className="text-xl font-bold hover:text-blue-600 transition-colors"
    >
      {theme === "light" ? "🌑" : "💡"}
    </button>
  );
}

// Wrapper to safely access useTheme AFTER hydration
function AppShell({ children }: { children: React.ReactNode }) {
  const { theme } = useTheme();

  return (
    <main
      className={`min-h-screen flex flex-col items-center ${
        theme === "dark" ? "bg-gray-900 text-white" : "bg-white text-black"
      }`}
    >
      <div className="flex-1 w-full flex flex-col gap-10 items-center">
        <nav
          className={`w-full flex justify-center shadow-sm h-16 border-b ${
            theme === "dark"
              ? "bg-gray-800 border-gray-700"
              : "bg-white border-gray-200"
          }`}
        >
          <div className="w-full max-w-5xl flex justify-between items-center p-3 px-5 text-sm">
            <div
              className={`flex gap-5 items-center font-bold ${
                theme === "dark" ? "text-blue-400" : "text-blue-600"
              }`}
            >
              <Link href="/">AI Interview Task</Link>
            </div>
            <div className="flex gap-5 items-center">
              {/* <Link
                href="https://www.linkedin.com/in/prajwal-singh-8740b4236/"
                className={`hover:text-blue-600 transition-colors ${
                  theme === "dark" ? "text-white" : "text-black"
                }`}
                target="_blank"
              >
                Designed by Prajwal
              </Link>
              <Link
                href="https://github.com/Singh-Prajwal/"
                className={`hover:text-blue-600 transition-colors ${
                  theme === "dark" ? "text-white" : "text-black"
                }`}
                target="_blank"
              >
                Github
              </Link> */}
              Theme Toggler
              <ThemeToggler />
            </div>
          </div>
        </nav>

        <div
          className={`flex flex-col gap-10 max-w-5xl p-6 rounded-lg shadow-lg w-full ${
            theme === "dark" ? "bg-gray-800" : "bg-white"
          }`}
        >
          {children}
        </div>

        <footer
          className={`w-full flex items-center justify-center border-t text-center text-xs gap-8 py-6 ${
            theme === "dark"
              ? "bg-gray-800 text-gray-400 border-gray-700"
              : "bg-white text-gray-500 border-gray-200"
          }`}
        >
          <p>All rights reserved by Prajwal</p>
        </footer>
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
