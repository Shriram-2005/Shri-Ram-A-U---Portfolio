import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import { ThemeProvider } from "@/components/theme-provider";
import { ToastProvider } from "@/components/ui/toast";
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
  title: "Shri Ram A U | AI Solutions Developer & Software Engineer",
  description:
    "Portfolio of Shri Ram A U - AI Solutions Developer Intern at Saina Human AI and Computer Science undergraduate at Presidency University Bangalore. Specializing in on-device Edge AI, Next.js, Android, Supabase, and PostgreSQL.",
  keywords: [
    "Shri Ram A U",
    "AI Solutions Developer",
    "Software Engineer",
    "Android Developer",
    "Edge AI",
    "TensorFlow Lite",
    "Next.js",
    "Supabase",
    "Presidency University",
    "Portfolio",
  ],
  authors: [{ name: "Shri Ram A U" }],
  openGraph: {
    title: "Shri Ram A U | AI Solutions Developer & Software Engineer",
    description:
      "AI Solutions Developer Intern at Saina Human AI & CS undergraduate at Presidency University Bangalore. Edge AI, Next.js, and multi-tenant architectures.",
    type: "website",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      suppressHydrationWarning
      className={`${geistSans.variable} ${geistMono.variable} h-full antialiased scroll-smooth`}
    >
      <body className="min-h-full flex flex-col bg-background text-foreground selection:bg-purple-600 selection:text-white">
        <ThemeProvider
          attribute="class"
          defaultTheme="system"
          enableSystem
          disableTransitionOnChange
        >
          <ToastProvider>{children}</ToastProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}
