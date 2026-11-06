"use client";

import React from "react";
import { Share2, Printer } from "lucide-react";
import { useToast } from "@/components/ui/toast";

interface CaseStudyActionsProps {
  title: string;
  tagline: string;
}

export function CaseStudyActions({ title, tagline }: CaseStudyActionsProps) {
  const { toast } = useToast();

  const handleShare = async () => {
    const shareData = {
      title: `${title} - Engineering Case Study | Shri Ram A U`,
      text: tagline,
      url: typeof window !== "undefined" ? window.location.href : "https://www.shriramau.in",
    };

    if (navigator.share && navigator.canShare && navigator.canShare(shareData)) {
      try {
        await navigator.share(shareData);
      } catch {
        // User cancelled share sheet
      }
    } else {
      if (typeof window !== "undefined") {
        await navigator.clipboard.writeText(window.location.href);
        toast("Case study link copied to clipboard!", "success");
      }
    }
  };

  const handlePrint = () => {
    if (typeof window !== "undefined") {
      window.print();
    }
  };

  return (
    <div className="flex items-center gap-1.5 sm:gap-2 print:hidden">
      <button
        onClick={handlePrint}
        className="inline-flex h-8 w-8 sm:h-9 sm:w-auto sm:px-2.5 items-center justify-center gap-1.5 rounded-lg border border-zinc-200/80 bg-zinc-50 text-xs font-medium text-zinc-700 transition-colors hover:border-zinc-300 hover:bg-zinc-100 dark:border-zinc-800 dark:bg-zinc-900/60 dark:text-zinc-300 dark:hover:border-zinc-700 dark:hover:bg-zinc-800"
        aria-label="Print or Save Case Study as PDF"
        title="Print or Save as PDF"
      >
        <Printer className="h-3.5 w-3.5 text-zinc-500 dark:text-zinc-400" />
        <span className="hidden sm:inline">Print / PDF</span>
      </button>

      <button
        onClick={handleShare}
        className="inline-flex h-8 w-8 sm:h-9 sm:w-auto sm:px-2.5 items-center justify-center gap-1.5 rounded-lg border border-zinc-200/80 bg-zinc-50 text-xs font-medium text-zinc-700 transition-colors hover:border-zinc-300 hover:bg-zinc-100 dark:border-zinc-800 dark:bg-zinc-900/60 dark:text-zinc-300 dark:hover:border-zinc-700 dark:hover:bg-zinc-800"
        aria-label="Share Case Study"
        title="Share Case Study"
      >
        <Share2 className="h-3.5 w-3.5 text-purple-600 dark:text-purple-400" />
        <span className="hidden sm:inline">Share</span>
      </button>
    </div>
  );
}

