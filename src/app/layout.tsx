import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import ClientLayout from "./client-layout";
import { Oswald } from "next/font/google";
import { cn } from "@/lib/utils";
import { Navbar } from "@/components/global/navbar";
import { ThemeProvider } from "@/components/global/theme-provider";
const inter = Oswald({ subsets: ["latin"] });
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "YachayBot",
  description: "YachayBot",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body
        className={cn(
          geistSans.variable,
          geistMono.variable,
          "antialiased",
          "min-h-screen bg-background",
          inter.className
        )}
      >
        <ClientLayout>
          <ThemeProvider
            attribute="class"
            defaultTheme="system"
            enableSystem
            disableTransitionOnChange
          >
            <Navbar />
            {children}
          </ThemeProvider>
        </ClientLayout>
      </body>
    </html>
  );
}
