"use client";

import React from "react";
import Image from "next/image";
import { personalInfo, socialLinks } from "@/data/portfolio-data";
import { ArrowUp } from "lucide-react";

export function Footer() {
  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  return (
    <footer className="border-t border-zinc-200/80 bg-zinc-50/50 py-8 sm:py-12 dark:border-zinc-800 dark:bg-zinc-950/50">
      <div className="mx-auto max-w-6xl px-4 sm:px-6 flex flex-col gap-6 sm:gap-8">
        <div className="flex flex-col md:flex-row items-center justify-between gap-5 text-center sm:text-left">
          <div className="flex items-center gap-3">
            <Image
              src="/aus-logo.png"
              alt="AUS Logo"
              width={78}
              height={30}
              className="h-7 w-auto object-contain"
            />
            <div>
              <div className="text-sm font-bold text-zinc-900 dark:text-zinc-100">
                {personalInfo.name}
              </div>
              <div className="text-xs text-zinc-500 dark:text-zinc-400">
                {personalInfo.role}
              </div>
            </div>
          </div>

          <div className="flex flex-wrap justify-center items-center gap-4 sm:gap-6 text-xs text-zinc-600 dark:text-zinc-400">
            {socialLinks.map((s) => (
              <a
                key={s.name}
                href={s.url}
                target="_blank"
                rel="noopener noreferrer"
                className="hover:text-zinc-950 dark:hover:text-zinc-100 transition-colors py-1"
              >
                {s.name}
              </a>
            ))}
          </div>

          <button
            onClick={scrollToTop}
            className="flex items-center gap-1.5 rounded-full border border-zinc-200 bg-white px-3 py-1.5 text-xs font-medium text-zinc-600 shadow-xs transition-colors hover:bg-zinc-100 dark:border-zinc-800 dark:bg-zinc-900 dark:text-zinc-400 dark:hover:bg-zinc-800"
            aria-label="Back to top"
          >
            <span>Back to top</span>
            <ArrowUp className="h-3.5 w-3.5" />
          </button>
        </div>

        <div className="flex flex-col sm:flex-row items-center justify-between gap-3 border-t border-zinc-200/60 pt-5 sm:pt-6 text-[11px] text-zinc-500 dark:border-zinc-800/80 dark:text-zinc-500 text-center sm:text-left">
          <div>
            © 2026 {personalInfo.name}. All rights reserved.
          </div>
          <div className="flex items-center gap-2 font-mono text-[10px] sm:text-[11px]">
            <span>Next.js 16</span>
            <span>•</span>
            <span>Tailwind v4</span>
            <span>•</span>
            <span>Framer Motion</span>
          </div>
        </div>
      </div>
    </footer>
  );
}
