"use client";

import React from "react";
import { usePortfolio } from "@/context/portfolio-context";

interface PrintHeaderProps {
  pageTitle?: string;
  category?: string;
}

export function PrintHeader({ pageTitle, category }: PrintHeaderProps) {
  const { personalInfo } = usePortfolio();
  return (
    <div className="hidden print:block mb-8 pb-4 border-b-2 border-zinc-900 text-black">
      <div className="flex justify-between items-start">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-black font-mono">
            {personalInfo.name}
          </h1>
          <p className="text-sm font-semibold text-zinc-800 mt-0.5">
            {personalInfo.role}
          </p>
          <p className="text-xs text-zinc-600 mt-1.5 font-mono">
            <span>{personalInfo.email}</span>
            <span className="mx-2">•</span>
            <span>https://www.shriramau.in</span>
            <span className="mx-2">•</span>
            <span>github.com/Shriram-2005</span>
          </p>
        </div>
        <div className="text-right text-xs text-zinc-600 font-mono">
          <div className="font-medium">Bengaluru, Karnataka, India</div>
          {category && <div className="text-purple-700 font-semibold mt-0.5">[{category}]</div>}
          <div className="font-semibold text-zinc-900 mt-1">
            {pageTitle || "Engineering Portfolio"}
          </div>
        </div>
      </div>
    </div>
  );
}

export function PrintFooter() {
  return (
    <div className="hidden print:flex justify-between items-center text-[9pt] text-zinc-600 pt-4 border-t border-zinc-300 mt-10 break-inside-avoid">
      <span>Shri Ram A U | Portfolio &amp; Technical Documentation</span>
      <span>https://www.shriramau.in</span>
      <span>Candidate Evaluation Document</span>
    </div>
  );
}
