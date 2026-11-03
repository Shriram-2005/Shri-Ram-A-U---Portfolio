"use client";

import { motion } from "framer-motion";
import { ThemeToggle } from "@/components/theme-toggle";
import {
  Sparkles,
  Layers,
  Palette,
  SunMoon,
  Zap,
  Code2,
  CheckCircle2,
} from "lucide-react";
import React, { useState } from "react";

const features = [
  {
    icon: Layers,
    title: "Next.js App Router",
    description:
      "Modern React Server Components, file-based routing, and high-performance server-side rendering.",
    badge: "Framework",
    color: "from-blue-500/20 to-cyan-500/20 text-blue-600 dark:text-blue-400",
  },
  {
    icon: Palette,
    title: "Tailwind CSS v4",
    description:
      "Utility-first CSS engine configured with modern design tokens and seamless dark variant support.",
    badge: "Styling",
    color: "from-sky-500/20 to-indigo-500/20 text-sky-600 dark:text-sky-400",
  },
  {
    icon: SunMoon,
    title: "next-themes",
    description:
      "Zero-flicker light, dark, and system color mode switcher with persistent user preferences.",
    badge: "Themes",
    color: "from-amber-500/20 to-orange-500/20 text-amber-600 dark:text-amber-400",
  },
  {
    icon: Sparkles,
    title: "Framer Motion",
    description:
      "Production-ready declarative animations, spring physics, layout animations, and gesture controls.",
    badge: "Animation",
    color: "from-purple-500/20 to-pink-500/20 text-purple-600 dark:text-purple-400",
  },
];

export default function Home() {
  const [clickCount, setClickCount] = useState(0);

  return (
    <div className="relative min-h-screen overflow-hidden bg-background text-foreground transition-colors selection:bg-purple-500 selection:text-white">
      {/* Background ambient glow */}
      <div className="pointer-events-none absolute -top-40 left-1/2 -z-10 h-96 w-[700px] -translate-x-1/2 rounded-full bg-gradient-to-tr from-purple-500/15 via-blue-500/15 to-pink-500/10 blur-3xl" />

      {/* Navigation */}
      <header className="sticky top-0 z-40 border-b border-zinc-200/60 bg-background/80 backdrop-blur-md dark:border-zinc-800/80">
        <div className="mx-auto flex max-w-6xl items-center justify-between px-6 py-4">
          <div className="flex items-center gap-2.5">
            <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-gradient-to-tr from-purple-600 to-blue-500 text-white shadow-md shadow-purple-500/20">
              <Code2 className="h-5 w-5" />
            </div>
            <div>
              <span className="font-semibold tracking-tight">Shriram AU</span>
              <span className="ml-2 rounded-md bg-zinc-100 px-2 py-0.5 text-xs font-medium text-zinc-600 dark:bg-zinc-800 dark:text-zinc-400">
                Portfolio
              </span>
            </div>
          </div>
          <ThemeToggle />
        </div>
      </header>

      {/* Main Content */}
      <main className="mx-auto max-w-6xl px-6 py-16">
        {/* Hero Section */}
        <div className="flex flex-col items-center text-center">
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="inline-flex items-center gap-2 rounded-full border border-purple-200 bg-purple-50/70 px-4 py-1.5 text-xs font-medium text-purple-700 shadow-xs dark:border-purple-900/60 dark:bg-purple-950/40 dark:text-purple-300"
          >
            <Zap className="h-3.5 w-3.5 animate-pulse" />
            <span>Ready for Development</span>
          </motion.div>

          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.1 }}
            className="mt-6 max-w-3xl text-4xl font-extrabold tracking-tight sm:text-5xl md:text-6xl"
          >
            Built with{" "}
            <span className="bg-gradient-to-r from-purple-600 via-pink-600 to-blue-600 bg-clip-text text-transparent">
              Next.js, Tailwind
            </span>
            <br />& Smooth Animations
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="mt-5 max-w-xl text-base text-zinc-600 sm:text-lg dark:text-zinc-400"
          >
            All modern essentials have been configured: Next.js App Router, Tailwind CSS,
            dark mode with <code className="font-mono text-sm text-purple-600 dark:text-purple-400">next-themes</code>,
            and interactive motion with <code className="font-mono text-sm text-purple-600 dark:text-purple-400">framer-motion</code>.
          </motion.p>
        </div>

        {/* Features Grid */}
        <motion.div
          initial="hidden"
          animate="visible"
          variants={{
            hidden: { opacity: 0 },
            visible: {
              opacity: 1,
              transition: {
                staggerChildren: 0.1,
                delayChildren: 0.3,
              },
            },
          }}
          className="mt-16 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4"
        >
          {features.map((item, index) => {
            const Icon = item.icon;
            return (
              <motion.div
                key={index}
                variants={{
                  hidden: { opacity: 0, y: 20 },
                  visible: { opacity: 1, y: 0 },
                }}
                whileHover={{ y: -4, transition: { duration: 0.2 } }}
                className="group relative flex flex-col justify-between rounded-2xl border border-zinc-200/80 bg-zinc-50/50 p-6 backdrop-blur-xs transition-colors hover:border-zinc-300 dark:border-zinc-800 dark:bg-zinc-900/40 dark:hover:border-zinc-700"
              >
                <div>
                  <div className="flex items-center justify-between">
                    <div
                      className={`flex h-11 w-11 items-center justify-center rounded-xl bg-gradient-to-br ${item.color} shadow-xs`}
                    >
                      <Icon className="h-5 w-5" />
                    </div>
                    <span className="rounded-full border border-zinc-200 px-2 py-0.5 text-[11px] font-medium text-zinc-500 dark:border-zinc-800 dark:text-zinc-400">
                      {item.badge}
                    </span>
                  </div>
                  <h3 className="mt-5 text-lg font-semibold tracking-tight">
                    {item.title}
                  </h3>
                  <p className="mt-2 text-sm leading-relaxed text-zinc-600 dark:text-zinc-400">
                    {item.description}
                  </p>
                </div>
                <div className="mt-6 flex items-center gap-1 text-xs font-medium text-purple-600 dark:text-purple-400">
                  <CheckCircle2 className="h-3.5 w-3.5" />
                  <span>Configured & Ready</span>
                </div>
              </motion.div>
            );
          })}
        </motion.div>

        {/* Interactive Framer Motion Demo Card */}
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.4 }}
          className="mt-12 overflow-hidden rounded-3xl border border-zinc-200/80 bg-gradient-to-b from-zinc-50 to-white p-8 dark:border-zinc-800 dark:from-zinc-900/60 dark:to-zinc-950/60"
        >
          <div className="flex flex-col items-center justify-between gap-6 md:flex-row">
            <div>
              <div className="flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-purple-600 dark:text-purple-400">
                <Sparkles className="h-4 w-4" />
                <span>Live Interactive Demo</span>
              </div>
              <h2 className="mt-1 text-2xl font-bold tracking-tight">
                Framer Motion Gesture Playground
              </h2>
              <p className="mt-1 max-w-xl text-sm text-zinc-600 dark:text-zinc-400">
                Click the interactive button below to test spring physics, scale effects, and dynamic reactive state.
              </p>
            </div>

            <div className="flex items-center gap-4">
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.92 }}
                onClick={() => setClickCount((prev) => prev + 1)}
                className="relative flex items-center gap-2 rounded-xl bg-purple-600 px-6 py-3 font-medium text-white shadow-lg shadow-purple-600/25 transition-all hover:bg-purple-700"
              >
                <Zap className="h-4 w-4" />
                <span>Trigger Motion</span>
                <motion.span
                  key={clickCount}
                  initial={{ scale: 1.5, opacity: 0 }}
                  animate={{ scale: 1, opacity: 1 }}
                  className="ml-1 inline-flex h-5 min-w-5 items-center justify-center rounded-full bg-white/20 px-1 text-xs font-bold"
                >
                  {clickCount}
                </motion.span>
              </motion.button>
            </div>
          </div>
        </motion.div>
      </main>

      {/* Footer */}
      <footer className="mt-20 border-t border-zinc-200/60 py-8 text-center text-xs text-zinc-500 dark:border-zinc-800/80 dark:text-zinc-500">
        <p>Shriram AU Portfolio • Next.js + Tailwind CSS + next-themes + Framer Motion</p>
      </footer>
    </div>
  );
}
