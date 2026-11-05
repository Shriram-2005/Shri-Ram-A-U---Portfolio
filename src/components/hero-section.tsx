"use client";

import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { personalInfo } from "@/data/portfolio-data";
import { useToast } from "@/components/ui/toast";
import { GithubIcon, LinkedinIcon } from "@/components/ui/icons";
import {
  ArrowDown,
  Copy,
  Check,
  FileText,
  Clock,
  ExternalLink,
} from "lucide-react";

export function HeroSection() {
  const { toast } = useToast();
  const [copied, setCopied] = useState(false);
  const [currentTime, setCurrentTime] = useState("");

  useEffect(() => {
    const updateTime = () => {
      const now = new Date();
      const options: Intl.DateTimeFormatOptions = {
        timeZone: "Asia/Kolkata",
        hour: "2-digit",
        minute: "2-digit",
        second: "2-digit",
        hour12: true,
      };
      setCurrentTime(new Intl.DateTimeFormat("en-US", options).format(now));
    };

    updateTime();
    const interval = setInterval(updateTime, 1000);
    return () => clearInterval(interval);
  }, []);

  const handleCopyEmail = () => {
    navigator.clipboard.writeText(personalInfo.email);
    setCopied(true);
    toast("Email copied to clipboard!", "success");
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <section className="relative pt-20 pb-10 sm:pt-28 sm:pb-14 md:pt-36 md:pb-16 overflow-hidden">
      {/* Background radial gradient accent */}
      <div className="pointer-events-none absolute top-12 left-1/2 -z-10 h-[350px] sm:h-[500px] w-[500px] sm:w-[800px] -translate-x-1/2 rounded-full bg-gradient-to-b from-purple-500/10 via-indigo-500/5 to-transparent blur-3xl dark:from-purple-900/20 dark:via-blue-950/10" />

      {/* Grid background texture */}
      <div className="pointer-events-none absolute inset-0 -z-20 bg-[linear-gradient(to_right,#8882_1px,transparent_1px),linear-gradient(to_bottom,#8882_1px,transparent_1px)] bg-[size:3rem_3rem] sm:bg-[size:4rem_4rem] [mask-image:radial-gradient(ellipse_60%_50%_at_50%_0%,#000_70%,transparent_100%)] opacity-35 dark:opacity-20" />

      <div className="mx-auto max-w-6xl px-4 sm:px-6">
        {/* Top Badges: Availability Status + Live Clock */}
        <div className="flex flex-wrap items-center gap-2 sm:gap-3">
          {/* Availability pill */}
          <div className="inline-flex items-center gap-2 rounded-full border border-emerald-500/30 bg-emerald-500/10 px-3 py-1 text-[11px] sm:text-xs font-medium text-emerald-700 dark:border-emerald-400/20 dark:bg-emerald-950/40 dark:text-emerald-300 backdrop-blur-xs">
            <span className="relative flex h-2 w-2 shrink-0">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
            </span>
            <span className="sm:hidden">Available Jan–Jun 2027 (Internships)</span>
            <span className="hidden sm:inline">{personalInfo.availability}</span>
          </div>

          {/* Live IST clock */}
          {currentTime && (
            <div className="inline-flex items-center gap-1.5 rounded-full border border-zinc-200/80 bg-zinc-100/70 px-2.5 sm:px-3 py-1 text-[11px] sm:text-xs font-mono text-zinc-600 dark:border-zinc-800 dark:bg-zinc-900/60 dark:text-zinc-400 backdrop-blur-xs">
              <Clock className="h-3 w-3 text-zinc-400 shrink-0" />
              <span className="hidden xs:inline">IST:</span>
              <span className="font-semibold text-zinc-900 dark:text-zinc-200">
                {currentTime}
              </span>
            </div>
          )}
        </div>

        {/* Main Headline */}
        <div className="mt-6 sm:mt-8 max-w-4xl">
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            <span className="font-mono text-xs sm:text-sm tracking-wider uppercase text-purple-600 dark:text-purple-400 font-semibold">
              AI Solutions Developer & Software Engineer
            </span>
          </motion.div>

          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.1 }}
            className="mt-3 sm:mt-4 text-3xl font-extrabold tracking-tight sm:text-5xl md:text-6xl lg:text-7xl text-zinc-900 dark:text-zinc-50 leading-[1.12] break-words"
          >
            Architecting on-device{" "}
            <span className="bg-gradient-to-r from-purple-600 via-indigo-600 to-sky-600 bg-clip-text text-transparent">
              edge-AI systems
            </span>{" "}
            & multi-tenant cloud SaaS.
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="mt-4 sm:mt-6 max-w-2xl text-base sm:text-lg md:text-xl text-zinc-600 dark:text-zinc-400 leading-relaxed font-normal"
          >
            Hi, I&apos;m <span className="font-semibold text-zinc-900 dark:text-zinc-100">{personalInfo.name}</span>.
            7th-semester CS undergrad at Presidency University Bangalore and AI Solutions Developer Intern at Saina Human AI.
            Creator of <span className="font-medium text-zinc-800 dark:text-zinc-200">Intent</span> (on-device AI notification firewall, 3.68ms warm inference) and production multi-tenant web systems.
          </motion.p>
        </div>

        {/* CTA Buttons & Social Strip */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.3 }}
          className="mt-8 sm:mt-10 flex flex-col sm:flex-row sm:items-center gap-3 sm:gap-4"
        >
          {/* Action Row 1: Primary + Copy Email */}
          <div className="flex flex-col sm:flex-row gap-3 w-full sm:w-auto">
            <a
              href="#projects"
              className="inline-flex w-full sm:w-auto items-center justify-center gap-2 rounded-xl bg-zinc-900 px-5 py-3 text-sm font-semibold text-white shadow-md transition-all hover:bg-zinc-800 hover:shadow-lg dark:bg-white dark:text-zinc-900 dark:hover:bg-zinc-100"
            >
              <span>Explore Selected Work</span>
              <ArrowDown className="h-4 w-4" />
            </a>

            <button
              onClick={handleCopyEmail}
              className="inline-flex w-full sm:w-auto items-center justify-center gap-2 rounded-xl border border-zinc-200/90 bg-white/80 px-4 py-3 text-sm font-medium text-zinc-800 shadow-xs transition-colors hover:bg-zinc-100 dark:border-zinc-800 dark:bg-zinc-900/80 dark:text-zinc-200 dark:hover:bg-zinc-800"
              aria-label="Copy email address"
            >
              {copied ? (
                <Check className="h-4 w-4 text-emerald-500" />
              ) : (
                <Copy className="h-4 w-4 text-zinc-500" />
              )}
              <span className="font-mono text-xs truncate max-w-[210px] sm:max-w-none">
                {personalInfo.email}
              </span>
            </button>
          </div>

          {/* Action Row 2: Resume + Socials */}
          <div className="flex items-center justify-between sm:justify-start gap-2 pt-1 sm:pt-0 sm:pl-2 sm:border-l sm:border-zinc-200 dark:sm:border-zinc-800">
            <a
              href={personalInfo.resumeUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex flex-1 sm:flex-initial items-center justify-center gap-1.5 rounded-xl border border-zinc-200/90 bg-zinc-50/80 px-4 py-3 text-sm font-medium text-zinc-700 transition-colors hover:bg-zinc-100 dark:border-zinc-800 dark:bg-zinc-900/40 dark:text-zinc-300 dark:hover:bg-zinc-800"
            >
              <FileText className="h-4 w-4 text-zinc-400" />
              <span>Resume</span>
              <ExternalLink className="h-3 w-3 text-zinc-400" />
            </a>

            <div className="flex items-center gap-2">
              <a
                href={personalInfo.github}
                target="_blank"
                rel="noopener noreferrer"
                aria-label="GitHub Profile"
                className="flex h-11 w-11 sm:h-10 sm:w-10 items-center justify-center rounded-xl border border-zinc-200/80 bg-white/60 text-zinc-700 transition-all hover:scale-105 hover:bg-zinc-100 dark:border-zinc-800 dark:bg-zinc-900/60 dark:text-zinc-300 dark:hover:bg-zinc-800"
              >
                <GithubIcon className="h-4 w-4" />
              </a>
              <a
                href={personalInfo.linkedin}
                target="_blank"
                rel="noopener noreferrer"
                aria-label="LinkedIn Profile"
                className="flex h-11 w-11 sm:h-10 sm:w-10 items-center justify-center rounded-xl border border-zinc-200/80 bg-white/60 text-zinc-700 transition-all hover:scale-105 hover:bg-zinc-100 dark:border-zinc-800 dark:bg-zinc-900/60 dark:text-zinc-300 dark:hover:bg-zinc-800"
              >
                <LinkedinIcon className="h-4 w-4" />
              </a>
            </div>
          </div>
        </motion.div>

        {/* Stats Strip */}
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.4 }}
          className="mt-12 sm:mt-16 grid grid-cols-2 gap-3 sm:gap-4 lg:grid-cols-4"
        >
          {personalInfo.stats.map((stat, i) => (
            <div
              key={i}
              className="relative overflow-hidden rounded-2xl border border-zinc-200/80 bg-zinc-50/60 p-4 sm:p-5 backdrop-blur-xs transition-colors hover:border-zinc-300 dark:border-zinc-800/80 dark:bg-zinc-900/40 dark:hover:border-zinc-700"
            >
              <div className="text-xl sm:text-2xl md:text-3xl font-extrabold tracking-tight text-zinc-900 dark:text-zinc-50 font-mono">
                {stat.value}
              </div>
              <div className="mt-1 text-[11px] sm:text-xs font-medium text-zinc-600 dark:text-zinc-400 leading-snug">
                {stat.label}
              </div>
            </div>
          ))}
        </motion.div>
      </div>
    </section>
  );
}
