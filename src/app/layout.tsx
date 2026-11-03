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
  title: "Shri Ram A U | Software Engineer & Systems Architect",
  description:
    "Portfolio of Shri Ram A U — Full-Stack Software Engineer specializing in distributed architectures, cloud native services, and fluid web products.",
  keywords: [
    "Shri Ram A U",
    "Software Engineer",
    "Full-Stack Developer",
    "Systems Architect",
    "Next.js",
    "React",
    "TypeScript",
    "Portfolio",
  ],
  authors: [{ name: "Shri Ram A U" }],
  openGraph: {
    title: "Shri Ram A U | Software Engineer & Systems Architect",
    description:
      "Full-Stack Software Engineer specializing in distributed architectures, cloud systems, and fluid web products.",
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
